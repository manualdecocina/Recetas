#!/usr/bin/env node
/**
 * Respaldo de emergencia, NO destructivo, de Manual de Cocina.
 * Ejecutar solo en entorno seguro. No subir el directorio .local-backups a Git.
 *
 * SUPABASE_URL=https://<project>.supabase.co
 * SUPABASE_SERVICE_ROLE_KEY=<secret key>  (nunca NEXT_PUBLIC_)
 * node scripts/backup-manualdecocina.mjs
 *
 * No cambia ninguna tabla, política, archivo ni cuenta de Supabase.
 */
import { createClient } from '@supabase/supabase-js'
import { mkdir, writeFile, rename } from 'node:fs/promises'
import { resolve, join, dirname, sep } from 'node:path'

const url = process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL
const secret = process.env.SUPABASE_SERVICE_ROLE_KEY
if (!url || !secret) {
  console.error('Faltan SUPABASE_URL y SUPABASE_SERVICE_ROLE_KEY en el entorno seguro.')
  process.exit(1)
}
if (!url.startsWith('https://') || !url.endsWith('.supabase.co')) {
  console.error('SUPABASE_URL debe ser la URL HTTPS del proyecto Supabase.')
  process.exit(1)
}

const sb = createClient(url, secret, {
  auth: { persistSession: false, autoRefreshToken: false },
})
const stamp = new Date().toISOString().replaceAll(':', '-').replaceAll('.', '-')
const root = resolve(process.cwd(), '.local-backups', 'manualdecocina-' + stamp)
const manifest = {
  created_at: new Date().toISOString(),
  project_url: url,
  complete: false,
  tables: {},
  buckets: {},
  auth_users: 0,
  warnings: [
    'Los objetos Storage se respaldan como archivos; no basta con copiar storage.objects.',
    'El JSON permite rescatar datos; un respaldo PostgreSQL completo también debe incluir esquema, funciones y políticas.',
    'Las contraseñas de Supabase Auth no se migran a MySQL: definir nuevo mecanismo de inicio de sesión.',
  ],
}
const tableOrder = {
  recipes: ['id'],
  admins: ['user_id'],
  content_pages: ['id'],
  content_redirects: ['id'],
  media_assets: ['id'],
  ingredients: ['id'],
  ingredient_aliases: ['id'],
  recipe_ingredients: ['id'],
  recipe_ingredient_pending: ['id'],
  cuisines: ['id'],
  recipe_cuisines: ['recipe_id', 'cuisine_id'],
  content_redirects_backup_20261030: ['id'],
  recipe_reviews: ['recipe_group_id'],
}

async function saveJson(relative, data) {
  const destination = join(root, relative)
  await mkdir(dirname(destination), { recursive: true, mode: 0o700 })
  const temp = destination + '.tmp'
  await writeFile(temp, JSON.stringify(data, null, 2) + '\n', { mode: 0o600 })
  await rename(temp, destination)
}

async function exportTable(table, orderColumns) {
  const rows = []
  const pageSize = 250
  for (let offset = 0; ; offset += pageSize) {
    let request = sb.from(table).select('*')
    for (const col of orderColumns) request = request.order(col, { ascending: true })
    const { data, error } = await request.range(offset, offset + pageSize - 1)
    if (error) throw new Error(table + ': ' + error.message)
    rows.push(...(data ?? []))
    if (!data || data.length < pageSize) break
  }
  await saveJson('database/' + table + '.json', rows)
  manifest.tables[table] = rows.length
  console.log('Tabla respaldada: ' + table + ' (' + rows.length + ')')
}

async function exportUsers() {
  const users = []
  for (let page = 1; ; page++) {
    const { data, error } = await sb.auth.admin.listUsers({ page, perPage: 100 })
    if (error) throw new Error('auth.users: ' + error.message)
    users.push(...(data.users ?? []))
    if (!data.users || data.users.length < 100) break
  }
  await saveJson('auth/users.json', users)
  manifest.auth_users = users.length
  console.log('Usuarios de autenticación respaldados: ' + users.length)
}

function safeStorageDestination(bucket, objectPath) {
  const destination = resolve(root, 'storage', bucket, ...objectPath.split('/'))
  const storageRoot = resolve(root, 'storage', bucket)
  if (!destination.startsWith(storageRoot + sep)) throw new Error('Ruta de Storage insegura: ' + objectPath)
  return destination
}

async function exportBucket(bucketId) {
  let count = 0
  let bytes = 0
  const objects = []
  const visited = new Set()
  async function visit(prefix = '') {
    if (visited.has(prefix)) return
    visited.add(prefix)
    const pageSize = 1000
    for (let offset = 0; ; offset += pageSize) {
      const { data, error } = await sb.storage.from(bucketId)
        .list(prefix, { limit: pageSize, offset, sortBy: { column: 'name', order: 'asc' } })
      if (error) throw new Error('Storage ' + bucketId + '/' + prefix + ': ' + error.message)
      const entries = data ?? []
      for (const entry of entries) {
        const path = prefix ? prefix + '/' + entry.name : entry.name
        if (entry.id == null) {
          await visit(path)
          continue
        }
        const { data: blob, error: fileError } = await sb.storage.from(bucketId).download(path)
        if (fileError || !blob) throw new Error('Descarga ' + bucketId + '/' + path + ': ' + (fileError?.message ?? 'sin contenido'))
        const file = safeStorageDestination(bucketId, path)
        await mkdir(dirname(file), { recursive: true, mode: 0o700 })
        const content = Buffer.from(await blob.arrayBuffer())
        await writeFile(file, content, { mode: 0o600 })
        objects.push({ path, size: content.length })
        count++
        bytes += content.length
      }
      if (entries.length < pageSize) break
    }
  }
  await visit()
  await saveJson('storage/' + bucketId + '-manifest.json', objects)
  manifest.buckets[bucketId] = { objects: count, bytes }
  console.log('Bucket respaldado: ' + bucketId + ' (' + count + ' archivos)')
}

async function main() {
  await mkdir(root, { recursive: true, mode: 0o700 })
  await saveJson('manifest.json', manifest)
  try {
    for (const [table, order] of Object.entries(tableOrder)) await exportTable(table, order)
    await exportUsers()
    const { data: buckets, error } = await sb.storage.listBuckets()
    if (error) throw new Error('Listar buckets: ' + error.message)
    for (const bucket of buckets ?? []) await exportBucket(bucket.id)
    manifest.complete = true
    manifest.finished_at = new Date().toISOString()
    await saveJson('manifest.json', manifest)
    console.log('RESPALDO COMPLETO: ' + root)
    console.log('Verifique el manifest.json antes de tocar producción.')
  } catch (error) {
    await saveJson('manifest.json', manifest)
    console.error('RESPALDO INCOMPLETO: ' + root, error)
    process.exitCode = 1
  }
}
await main()

#!/usr/bin/env node
/**
 * Convierte backup PRIVADO Supabase a archivos SQL MySQL por lotes.
 * NO conecta con la base, NO borra datos y NO publica el respaldo.
 * Uso: node scripts/migracion-hostinger/02-json-a-sql.mjs .local-backups/manualdecocina-TIMESTAMP
 * NO subir .local-backups a Git, sitios públicos o chats.
 */
import {readFile,mkdir,writeFile} from 'node:fs/promises'
import {resolve,join} from 'node:path'
import {createHash} from 'node:crypto'

const root=process.argv[2] ? resolve(process.argv[2]) : ''
if(!root || !root.includes('.local-backups')) {
  console.error('Especifique un respaldo PRIVADO en .local-backups/')
  process.exit(1)
}
const backup=JSON.parse(await readFile(join(root,'manifest.json'),'utf8'))
if(backup.complete!==true) throw Error('Respaldo incompleto: cancelado')
const target=join(root,'mysql-import')
await mkdir(target,{recursive:true,mode:0o700})

const tables=['admins','content_pages','content_redirects',
  'content_redirects_backup_20261030','cuisines','ingredient_aliases',
  'ingredients','media_assets','recipe_cuisines','recipe_ingredient_pending',
  'recipe_ingredients','recipe_reviews','recipes']
const schema=await readFile(new URL('./01-esquema-mysql.sql',import.meta.url),'utf8')
const definitions={}
for(const match of schema.matchAll(/CREATE TABLE \x60([a-z0-9_]+)\x60 \(([\s\S]*?)\) ENGINE=/g)){
  definitions[match[1]]={}
  for(const line of match[2].split('\n')){
    const m=line.match(/^\s*\x60([a-z0-9_]+)\x60 (CHAR\(\d+\)|VARCHAR\(\d+\)|LONGTEXT|JSON|DATETIME\(6\)|INT|TINYINT\(1\))/)
    if(m)definitions[match[1]][m[1]]=m[2]
  }
}
const q=String.fromCharCode(96)
function quote(s){return 'CONVERT(0x'+Buffer.from(s,'utf8').toString('hex')+' USING utf8mb4)'}
function sqlValue(v,type,table,col){
  if(v===null || v===undefined)return 'NULL'
  if(type==='TINYINT(1)'){
    if(v!==true&&v!==false)throw Error(table+'.'+col+': no es booleano')
    return v?'1':'0'
  }
  if(type==='INT'){
    if(!Number.isSafeInteger(v))throw Error(table+'.'+col+': no es entero')
    return String(v)
  }
  if(type==='DATETIME(6)'){
    const d=new Date(v)
    if(Number.isNaN(d.getTime()))throw Error(table+'.'+col+': fecha no válida')
    const stamp=d.toISOString().replace('T',' ').replace('Z','').replace(/\.([0-9]{3})$/,(_,ms)=>'.'+ms+'000')
    return "'"+stamp+"'"
  }
  if(type==='JSON')return quote(JSON.stringify(v))
  if(typeof v!=='string')throw Error(table+'.'+col+': se esperaba texto')
  if(type==='CHAR(36)'&&!/^[0-9a-fA-F-]{36}$/.test(v))throw Error(table+'.'+col+': UUID incorrecto')
  return quote(v)
}
const manifest={generated_at:new Date().toISOString(),tables:{},files:[]}
for(const table of tables){
  const data=JSON.parse(await readFile(join(root,'database',table+'.json'),'utf8'))
  if(!Array.isArray(data)||data.length!==backup.tables[table])throw Error('Recuento incorrecto: '+table)
  const cols=definitions[table]
  if(!cols)throw Error('Sin definición: '+table)
  let part=1,rowsInFile=0,lines=[],bytes=0
  async function flush(){
    if(!lines.length)return
    const filename='02-'+table+'-'+String(part).padStart(3,'0')+'.sql'
    const sql='-- Contiene datos privados; no compartir. Importar SOLO en destino vacío.\n'
      +'SET NAMES utf8mb4;\nSET time_zone = \'+00:00\';\n'+lines.join('\n')+'\n'
    await writeFile(join(target,filename),sql,{mode:0o600,flag:'wx'})
    manifest.files.push({filename,rows:rowsInFile,sha256:createHash('sha256').update(sql).digest('hex')})
    part++;rowsInFile=0;lines=[];bytes=0
  }
  for(const row of data){
    const columns=Object.keys(row)
    for(const key of columns)if(!Object.hasOwn(cols,key))throw Error(table+'.'+key+': no figura en esquema MySQL')
    const statement='INSERT INTO '+q+table+q+' ('+columns.map(x=>q+x+q).join(',')+') VALUES ('
      +columns.map(x=>sqlValue(row[x],cols[x],table,x)).join(',')+');'
    const len=Buffer.byteLength(statement)
    if(bytes+len>3_000_000&&lines.length)await flush()
    lines.push(statement);bytes+=len;rowsInFile++
  }
  await flush()
  manifest.tables[table]=data.length
  console.log('Exportada tabla',table,data.length)
}
await writeFile(join(target,'manifest.json'),JSON.stringify(manifest,null,2)+'\n',{mode:0o600,flag:'wx'})
console.log('Archivos SQL PRIVADOS preparados en:',target)

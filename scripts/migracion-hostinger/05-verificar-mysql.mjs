#!/usr/bin/env node
/**
 * Smoke test MySQL en el servidor Node de Hostinger, NO destructivo.
 * Ejecutar: npm ci && node scripts/migracion-hostinger/05-verificar-mysql.mjs
 * Las claves solo deben estar en variables del servidor, NO NEXT_PUBLIC_.
 * Salida: cantidades y SQL errors; NUNCA imprime contraseñas ni borradores.
 */
import mysql from 'mysql2/promise'
const env = process.env
const needed=['MYSQL_HOST','MYSQL_USER','MYSQL_PASSWORD','MYSQL_DATABASE']
for(const key of needed) if(!env[key]) {
  console.error('Falta variable de servidor', key)
  process.exit(1)
}
const port=env.MYSQL_PORT?Number(env.MYSQL_PORT):3306
if(!Number.isInteger(port)||port<1||port>65535)throw Error('MYSQL_PORT inválido')
const conn=await mysql.createConnection({
  host:env.MYSQL_HOST,
  port,
  user:env.MYSQL_USER,
  password:env.MYSQL_PASSWORD,
  database:env.MYSQL_DATABASE,
  charset:'utf8mb4',
  timezone:'Z',
  connectTimeout:6000,
  ...(env.MYSQL_SSL_MODE==='required'?{ssl:{rejectUnauthorized:true}}:{}),
})
const expected={
  recipes:1782,
  ingredients:1032,
  ingredient_aliases:520,
  recipe_ingredients:1574,
  recipe_ingredient_pending:885,
  cuisines:7,
  recipe_cuisines:25,
  recipe_reviews:226,
  media_assets:12,
  content_redirects:242,
  content_redirects_backup_20261030:100,
}
let pass=true
try{
  for(const [table,n] of Object.entries(expected)){
    const [rows]=await conn.execute('SELECT COUNT(*) AS total FROM '+String.fromCharCode(96)+table+String.fromCharCode(96))
    const count=Number(rows[0]?.total)
    console.log(table+':',count,count===n?'OK':'ERROR (esperado '+n+')')
    if(count!==n)pass=false
  }
  const [rows]=await conn.execute('SELECT language,COUNT(*) AS n,SUM(published = 1) AS pub FROM recipes GROUP BY language ORDER BY language')
  const expectedLangs=['de','en','es','fr','it','ja','pt']
  const langs=rows.map(r=>r.language)
  const allLanguages=expectedLangs.every((x,i)=>langs[i]===x)
  console.log('Idiomas:',langs.join(','),allLanguages?'OK':'ERROR')
  if(!allLanguages)pass=false
  for(const r of rows){
    const actual=Number(r.n),pub=Number(r.pub),wanted=r.language==='es'?270:252
    if(actual!==wanted||pub!==252)pass=false
    console.log('Idioma '+r.language+':',actual,'filas; publicadas',pub)
  }
  const [paths]=await conn.execute("SELECT language, public_path FROM recipes WHERE published = 1 AND language IN ('ja','es','de') ORDER BY id LIMIT 3")
  console.log('Rutas públicas de ejemplo:',paths.length,'(valores no impresos)')
  if(paths.length!==3)pass=false
}finally{
  await conn.end()
}
if(!pass){
  console.error('SMOKE TEST FALLÓ. NO habilitar MYSQL_READS_ENABLED ni desplegar a main.')
  process.exitCode=1
}else console.log('MYSQL_SMOKE_PASS: 11 tablas, 7 idiomas, rutas y 1764 publicaciones')

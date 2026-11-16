import assert from 'node:assert/strict'
import { createMysqlReadClient } from '../../src/lib/mysql/read-query.ts'

let queries: {sql:string;params:unknown[]}[] = []
let resultRows: Array<Record<string, any>>[] = []
const execute = async (sql:string, params:unknown[]) => {
  queries.push({sql,params})
  return resultRows.shift() ?? []
}
function reset(...results:Array<Array<Record<string, any>>>) { queries=[];resultRows=[...results] }
const client=createMysqlReadClient(execute)

reset([{id:'r1',language:'es',published:1,title:'Arepa',ingredients:'[{"name":"Harina"}]',steps:'[]',seo:'{}'}])
const found=await client.from('recipes').select('id, language, published, title, ingredients, steps, seo')
  .eq('language','es').eq('published',true).limit(1)
assert.equal(found.error,null)
assert.equal(found.data?.[0]?.id,'r1')
assert.deepEqual(found.data[0].ingredients,[{name:'Harina'}])
assert.equal(found.data[0].published,true)
assert.match(queries[0].sql,/WHERE/)
assert.equal(queries[0].params[0],1)
assert.deepEqual(queries[0].params.slice(-2),[1,0])

reset([{total:252}],[])
const counted=await client.from('recipes').select('id',{count:'exact',head:true})
  .eq('language','it').eq('published',true)
assert.equal(counted.count,252)
assert.equal(counted.data,null)
assert.equal(queries.length,1)
assert.match(queries[0].sql,/COUNT\(\*\)/)

reset([{id:'r2',recipe_group_id:'g1',language:'ja',published:1,ingredients:'[]',steps:'[]',seo:'{}'}],[
  {recipe_id:'r2',position:0,name:'米',slug:'kome',indexable:1},
])
const detail=await client.from('recipes')
  .select('*, recipe_ingredients(position, ingredients(name, slug, indexable))')
  .in('public_path',['/ja/ご飯','/ja/ご飯/']).eq('published',true).limit(1)
assert.equal(detail.error,null)
assert.equal(detail.data[0].recipe_ingredients[0].ingredients.name,'米')
assert.equal(detail.data[0].recipe_ingredients[0].ingredients.indexable,true)
assert.equal(queries.length,2)
assert.match(queries[1].sql,/LEFT JOIN ingredients/)

reset([{id:'r3',title:'Sopa'}])
const search=await client.from('recipes').select('id, title').eq('language','es')
  .or('title.ilike."%sopa, pollo%",excerpt.ilike."%sopa, pollo%"')
  .order('published_at',{ascending:false,nullsFirst:false}).range(24,47)
assert.equal(search.error,null)
assert.equal(search.data.length,1)
assert.deepEqual(queries[0].params,[1,'es','%sopa, pollo%','%sopa, pollo%',24,24])
assert.match(queries[0].sql,/LIMIT \? OFFSET \?/)
assert.equal(queries[0].params.at(-1),24)

reset([])
const nothing=await client.from('recipes').select('id').in('id',[]).maybeSingle()
assert.equal(nothing.error,null)
assert.equal(nothing.data,null)
assert.match(queries[0].sql,/1=0/)

const originalImage='https://eqbdtctxbpepbeickhqi.supabase.co/storage/v1/object/public/recetas/test/portada.webp'
reset([{id:'r4',published:1,image_url:originalImage,ingredients:'[]',steps:'[]',seo:'{}'}])
const publicImage=await client.from('recipes').select('id, image_url').eq('id','r4').maybeSingle()
assert.equal(publicImage.data?.image_url,'/recetas/test/portada.webp')
const adminClient=createMysqlReadClient(execute,{includeUnpublished:true,preserveMediaUrls:true})
reset([{id:'r4',published:0,image_url:originalImage,ingredients:'[]',steps:'[]',seo:'{}'}])
const adminImage=await adminClient.from('recipes').select('id, image_url').eq('id','r4').maybeSingle()
assert.equal(adminImage.data?.image_url,originalImage)
assert.equal(adminImage.data?.published,false)
assert.equal(queries[0].params[0],'r4')

assert.throws(() => client.from('admins'), /no autorizada/)
console.log('MySQL public read adapter: checks PASS')

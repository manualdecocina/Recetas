import 'server-only'
import {createHash,randomUUID} from 'node:crypto'
import type {PoolConnection,RowDataPacket} from 'mysql2/promise'

type IngredientInput = {
  name?:string|null; amount?:string|null; unit?:string|null;
  preparation?:string|null; note?:string|null
}
type Catalog = RowDataPacket & {
  id:string; name:string; normalized_name:string|null; status:string;
  searchable:number|boolean; alias:string|null; normalized_alias:string|null
}
const normal=(v:string)=>v.trim().toLowerCase().replace(/\s+/gu,' ')
const optional=(v:unknown)=>typeof v==='string' && v.trim() ? v.trim():null
const ambiguous=(v:string)=>v==='aceite'||/\s(?:o|u)\s/u.test(v)||
  v.startsWith('sal y pimienta')||v.includes('de tu elección')||
  v.includes('etc.')||(v.split(',').length>=3&&v.includes(' y '))

/** Replica el trigger privado de Supabase sobre catálogo y pendientes.
 * Esta operación siempre está dentro de la transacción de la receta.
 * Solo ingredientes en español afectan la búsqueda de despensa.
 */
export async function syncRecipePantryMysql(conn:PoolConnection,id:string,language:string,ingredients:IngredientInput[]){
  if(language!=='es')return
  if(!Array.isArray(ingredients))throw Error('Ingredientes no válidos')
  const [catalog]=await conn.execute<Catalog[]>(
    'SELECT i.id,i.name,i.normalized_name,i.status,i.searchable,a.alias,a.normalized_alias '+
    'FROM ingredients i LEFT JOIN ingredient_aliases a ON a.ingredient_id=i.id '+
    "WHERE i.status IN ('canonical','pending','review')",
  )
  const canonical=new Map<string,Set<string>>()
  const reviewed=new Map<string,string>()
  for(const row of catalog){
    const key=normal(row.normalized_name||row.name)
    if(row.status==='canonical'){
      for(const name of [key,optional(row.normalized_alias)||optional(row.alias)]){
        if(!name)continue
        const normalized=normal(name)
        const ids=canonical.get(normalized)??new Set<string>()
        ids.add(String(row.id));canonical.set(normalized,ids)
      }
    } else if(!reviewed.has(key)) reviewed.set(key,String(row.id))
  }
  await conn.execute('DELETE FROM recipe_ingredients WHERE recipe_id=?',[id])
  await conn.execute('DELETE FROM recipe_ingredient_pending WHERE recipe_id=?',[id])
  let indexableMatches=0,linked=0,pending=0
  for(let position=0;position<ingredients.length;position++){
    const item=ingredients[position]
    const raw=optional(item?.name)
    if(!raw)continue
    const key=normal(raw),matches=[...(canonical.get(key)??new Set<string>())]
    if(matches.length===1){
      const ingredientId=matches[0]
      await conn.execute(
        'INSERT INTO recipe_ingredients '+
        '(id,recipe_id,ingredient_id,amount,unit,preparation,note,position) VALUES (?,?,?,?,?,?,?,?)',
        [randomUUID(),id,ingredientId,optional(item.amount),optional(item.unit),
          optional(item.preparation),optional(item.note),position],
      )
      linked++
      // El trigger de Supabase exige al menos un ingrediente canónico BUSCABLE.
      if(catalog.some(c=>String(c.id)===ingredientId&&c.status==='canonical'&&Boolean(c.searchable)))indexableMatches++
      continue
    }
    let reason:string
    if(matches.length>1)reason='ambiguous_match'
    else if(ambiguous(key))reason='ambiguous_expression'
    else {
      reason='new_ingredient'
      if(!reviewed.has(key)){
        const ingredientId=randomUUID()
        await conn.execute(
          'INSERT INTO ingredients (id,slug,name,normalized_name,searchable,indexable,status,created_at,updated_at) '+
          'VALUES (?,?,?,?,0,0,?,UTC_TIMESTAMP(6),UTC_TIMESTAMP(6))',
          [ingredientId,'pending-'+createHash('md5').update(key).digest('hex').slice(0,16),raw,key,'pending'],
        )
        reviewed.set(key,ingredientId)
      }
    }
    await conn.execute(
      'INSERT INTO recipe_ingredient_pending '+
      '(id,recipe_id,position,raw_name,amount,unit,status,reason,created_at,updated_at) '+
      'VALUES (?,?,?,?,?,?,?,?,UTC_TIMESTAMP(6),UTC_TIMESTAMP(6))',
      [randomUUID(),id,position,raw,optional(item.amount),optional(item.unit),'pending',reason],
    )
    pending++
  }
  return {linked,pending,indexableMatches}
}

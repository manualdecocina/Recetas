/** Validación sin IO del snapshot privado de Supabase.
 * El historial contiene hashes pseudónimos que NO deben llegar al navegador,
 * a logs, a GitHub Actions como artefactos ni al repositorio.
 */
const UUID=/^[0-9a-f]{8}-(?:[0-9a-f]{4}-){3}[0-9a-f]{12}$/i
const HASH=/^[0-9a-f]{64}$/
const UTC_SQL_TIMESTAMP=/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}\.\d{6}$/
type RecordLike=Record<string,unknown>
const record=(value:unknown):value is RecordLike=>
  value!==null&&typeof value==='object'&&!Array.isArray(value)
function nonNegative(value:unknown):number {
  if(typeof value!=='number'||!Number.isSafeInteger(value)||value<0)throw Error('Conteo inválido')
  return value
}
export type HistoricalVote={id:string;recipe_id:string;voter_hash:string;rating:number;created_at:string}
export type HistoricalCounter={id:string;rating_count:number;rating_sum:number}
export type RatingHistorySnapshot={
  votes:HistoricalVote[]
  counters:HistoricalCounter[]
  source_vote_count:number
  source_rating_count:number
  source_rating_sum:number
}
export function validateRatingHistorySnapshot(value:unknown):RatingHistorySnapshot{
  if(!record(value)||!Array.isArray(value.votes)||!Array.isArray(value.counters))
    throw Error('Formato de historial inválido')
  if(value.votes.length>20000||value.counters.length>20000)
    throw Error('Snapshot demasiado grande')
  const source_vote_count=nonNegative(value.source_vote_count)
  const source_rating_count=nonNegative(value.source_rating_count)
  const source_rating_sum=nonNegative(value.source_rating_sum)
  if(source_rating_sum<source_rating_count||source_rating_sum>source_rating_count*5)
    throw Error('Total de estrellas fuera de rango')
  if(source_vote_count!==value.votes.length)throw Error('Número de votos inconsistente')

  const voteIds=new Set<string>(),votePairs=new Set<string>()
  const votes:HistoricalVote[]=value.votes.map((raw:unknown)=>{
    if(!record(raw)||typeof raw.id!=='string'||!UUID.test(raw.id)||
       typeof raw.recipe_id!=='string'||!UUID.test(raw.recipe_id)||
       typeof raw.voter_hash!=='string'||!HASH.test(raw.voter_hash)||
       typeof raw.created_at!=='string'||!UTC_SQL_TIMESTAMP.test(raw.created_at)||
       typeof raw.rating!=='number'||!Number.isInteger(raw.rating)||raw.rating<1||raw.rating>5)
       throw Error('Fila de voto inválida')
    const pair=raw.recipe_id+'|'+raw.voter_hash
    if(voteIds.has(raw.id)||votePairs.has(pair))throw Error('Voto histórico duplicado')
    voteIds.add(raw.id);votePairs.add(pair)
    return {id:raw.id,recipe_id:raw.recipe_id,voter_hash:raw.voter_hash,
      rating:raw.rating,created_at:raw.created_at}
  })
  const counterIds=new Set<string>()
  const counters:HistoricalCounter[]=value.counters.map((raw:unknown)=>{
    if(!record(raw)||typeof raw.id!=='string'||!UUID.test(raw.id))
      throw Error('ID de receta inválido')
    const rating_count=nonNegative(raw.rating_count)
    const rating_sum=nonNegative(raw.rating_sum)
    if(rating_count===0||rating_sum<rating_count||rating_sum>rating_count*5||
       counterIds.has(raw.id))throw Error('Contador inválido o duplicado')
    counterIds.add(raw.id)
    return {id:raw.id,rating_count,rating_sum}
  })
  if(counters.reduce((total,c)=>total+c.rating_count,0)!==source_rating_count||
     counters.reduce((total,c)=>total+c.rating_sum,0)!==source_rating_sum)
    throw Error('Totales agregados inconsistentes')
  const byRecipe=new Map(counters.map(c=>[c.id,c]))
  const captured=new Map<string,{count:number;sum:number}>()
  for(const row of votes) {
    const curr=captured.get(row.recipe_id)??{count:0,sum:0}
    curr.count++;curr.sum+=row.rating;captured.set(row.recipe_id,curr)
  }
  for(const [id,data] of captured) {
    const c=byRecipe.get(id)
    if(!c||c.rating_count<data.count||c.rating_sum<data.sum)
      throw Error('Votos individuales exceden contadores')
  }
  return {votes,counters,source_vote_count,source_rating_count,source_rating_sum}
}

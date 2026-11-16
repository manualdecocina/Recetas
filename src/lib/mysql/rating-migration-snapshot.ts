/** Validación pura del snapshot privado de Supabase antes de escribir en MySQL. */
export interface RatingVoteSnapshotRow {
  id:string; recipe_id:string; voter_hash:string; rating:number; created_at:string
}
export interface RatingCounterSnapshotRow {
  id:string; rating_count:number; rating_sum:number
}
export interface RatingSnapshot {
  votes:RatingVoteSnapshotRow[]
  counters:RatingCounterSnapshotRow[]
  source_vote_count:number
  source_rating_count:number
  source_rating_sum:number
}
const UUID=/^[0-9a-f]{8}-(?:[0-9a-f]{4}-){3}[0-9a-f]{12}$/i
const HASH=/^[0-9a-f]{64}$/
const UTC_DATETIME=/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}\.\d{6}$/
const record=(x:unknown):x is Record<string,unknown>=>x!==null&&typeof x==='object'&&!Array.isArray(x)
const safeInt=(x:unknown):x is number=>typeof x==='number'&&Number.isSafeInteger(x)&&x>=0
export function parseRatingSnapshot(raw:unknown):RatingSnapshot {
  if(!record(raw)||!Array.isArray(raw.votes)||!Array.isArray(raw.counters))throw Error('Snapshot de valoraciones inválido')
  if(raw.votes.length>10000||raw.counters.length>10000)throw Error('Snapshot demasiado grande')
  if(!safeInt(raw.source_vote_count)||!safeInt(raw.source_rating_count)||!safeInt(raw.source_rating_sum)){
    throw Error('Totales del origen inválidos')
  }
  const seenVotes=new Set<string>(),seenVoters=new Set<string>(),seenRecipes=new Set<string>()
  const votes=raw.votes.map((item:unknown):RatingVoteSnapshotRow=>{
    if(!record(item)||typeof item.id!=='string'||!UUID.test(item.id)||
      typeof item.recipe_id!=='string'||!UUID.test(item.recipe_id)||
      typeof item.voter_hash!=='string'||!HASH.test(item.voter_hash)||
      !safeInt(item.rating)||item.rating<1||item.rating>5||
      typeof item.created_at!=='string'||!UTC_DATETIME.test(item.created_at))throw Error('Voto histórico inválido')
    const key=item.recipe_id+'|'+item.voter_hash
    if(seenVotes.has(item.id)||seenVoters.has(key))throw Error('Voto histórico duplicado')
    seenVotes.add(item.id);seenVoters.add(key)
    return {id:item.id,recipe_id:item.recipe_id,voter_hash:item.voter_hash,rating:item.rating,created_at:item.created_at}
  })
  const counters=raw.counters.map((item:unknown):RatingCounterSnapshotRow=>{
    if(!record(item)||typeof item.id!=='string'||!UUID.test(item.id)||
      !safeInt(item.rating_count)||!safeInt(item.rating_sum)||
      item.rating_sum<item.rating_count||item.rating_sum>item.rating_count*5||
      item.rating_count===0||seenRecipes.has(item.id))throw Error('Contador histórico inválido')
    seenRecipes.add(item.id)
    return {id:item.id,rating_count:item.rating_count,rating_sum:item.rating_sum}
  })
  if(raw.source_vote_count!==votes.length)throw Error('Número de votos no coincide')
  if(raw.source_rating_count!==counters.reduce((n,r)=>n+r.rating_count,0)||
     raw.source_rating_sum!==counters.reduce((n,r)=>n+r.rating_sum,0))throw Error('Totales históricos incoherentes')
  const counted=new Map(counters.map(c=>[c.id,c]))
  const votesPerRecipe=new Map<string,{count:number;sum:number}>()
  for(const vote of votes){
    const prev=votesPerRecipe.get(vote.recipe_id)??{count:0,sum:0}
    votesPerRecipe.set(vote.recipe_id,{count:prev.count+1,sum:prev.sum+vote.rating})
  }
  for(const [id,value] of votesPerRecipe){
    const counter=counted.get(id)
    if(!counter||counter.rating_count<value.count||counter.rating_sum<value.sum){
      throw Error('Contadores inferiores a los votos registrados')
    }
  }
  return {votes,counters,source_vote_count:raw.source_vote_count,source_rating_count:raw.source_rating_count,source_rating_sum:raw.source_rating_sum}
}

import assert from 'node:assert/strict'
import { parseRatingSnapshot } from '../../src/lib/mysql/rating-migration-snapshot.ts'

const id=(n:number)=>String(n).padStart(8,'0')+'-0000-4000-8000-'+String(n).padStart(12,'0')
const input={
  votes:[
    {id:id(10),recipe_id:id(1),voter_hash:'a'.repeat(64),rating:5,created_at:'2026-11-16 20:15:45.169155'},
    {id:id(11),recipe_id:id(1),voter_hash:'b'.repeat(64),rating:5,created_at:'2026-11-16 20:16:45.169155'},
  ],
  counters:[{id:id(1),rating_count:3,rating_sum:14}],
  source_vote_count:2,source_rating_count:3,source_rating_sum:14,
}
const good=parseRatingSnapshot(input)
assert.equal(good.votes.length,2)
assert.equal(good.source_rating_count,3,'conservar valoraciones sin voto individual (legadas)')
assert.equal(good.source_rating_sum,14)
assert.equal(good.votes[1].voter_hash,'b'.repeat(64))
assert.throws(()=>parseRatingSnapshot({...input,source_vote_count:3}),/Número de votos/)
assert.throws(()=>parseRatingSnapshot({...input,source_rating_sum:10}),/Totales históricos/)
assert.throws(()=>parseRatingSnapshot({...input,votes:[input.votes[0],input.votes[0]]}),/duplicado/)
assert.throws(()=>parseRatingSnapshot({...input,votes:[{...input.votes[0],voter_hash:'not-a-hash'}]}),/inválido/)
assert.throws(()=>parseRatingSnapshot({...input,counters:[{id:id(1),rating_count:1,rating_sum:5}],source_rating_count:1,source_rating_sum:5}),/Contadores inferiores/)
assert.throws(()=>parseRatingSnapshot({...input,counters:[{id:id(1),rating_count:3,rating_sum:17}],source_rating_sum:17}),/Contador histórico inválido/)
console.log('Migración segura de valoraciones: validaciones PASS')

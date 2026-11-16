import assert from 'node:assert/strict'
import {ratingCounterMirrorUpdate} from '../../src/lib/mysql/rating-counter-mirror.ts'

const recipe='00000000-0000-4000-8000-000000000001'
const result=ratingCounterMirrorUpdate(recipe,25,123)
assert.deepEqual(result.params,[123,25,recipe,25])
assert.match(result.sql,/UPDATE recipes SET rating_sum=\?,rating_count=\?/)
assert.match(result.sql,/WHERE id=\? AND published=1 AND rating_count<=\?/)
assert.equal(result.sql.includes('INSERT'),false)
assert.equal(result.sql.includes('recipe_rating_votes'),false)
// El origen puede haber recibido otro voto: los resultados antiguos no deben
// pisar datos con rating_count mayor (protección SQL idempotente en WHERE).
assert.equal(result.params.at(-1),25)
for(const [id,count,sum] of [
  ['not-uuid',25,123],[recipe,-1,0],[recipe,0,0],
  [recipe,2,11],[recipe,2,1],[recipe,1,1.5],[recipe,NaN,3],
] as const){
  assert.throws(()=>ratingCounterMirrorUpdate(id,count,sum))
}
console.log('MySQL rating counter mirror: monotonic and validated PASS')

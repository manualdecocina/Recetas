import assert from 'node:assert/strict'
import { validateRatingHistorySnapshot } from '../../src/lib/mysql/rating-history-snapshot.ts'

const id1='00000000-0000-4000-8000-000000000001'
const id2='00000000-0000-4000-8000-000000000002'
const voter='a'.repeat(64)
const base={
  votes:[{id:id2,recipe_id:id1,voter_hash:voter,rating:5,created_at:'2026-11-16 21:00:00.000001'}],
  counters:[{id:id1,rating_count:2,rating_sum:9}],
  source_vote_count:1,source_rating_count:2,source_rating_sum:9,
}
assert.deepEqual(validateRatingHistorySnapshot(base),base)
assert.throws(()=>validateRatingHistorySnapshot({...base,source_vote_count:2}))
assert.throws(()=>validateRatingHistorySnapshot({...base,source_rating_count:1}))
assert.throws(()=>validateRatingHistorySnapshot({...base,source_rating_sum:11}))
assert.throws(()=>validateRatingHistorySnapshot({...base,
  votes:[...base.votes,...base.votes],source_vote_count:2}))
assert.throws(()=>validateRatingHistorySnapshot({...base,
  votes:[{...base.votes[0],voter_hash:'invalid'}]}))
assert.throws(()=>validateRatingHistorySnapshot({...base,
  votes:[{...base.votes[0],rating:6}]}))
assert.throws(()=>validateRatingHistorySnapshot({...base,
  votes:[{...base.votes[0],created_at:'DROP TABLE recipes;'}]}))
assert.throws(()=>validateRatingHistorySnapshot({...base,
  counters:[{id:id1,rating_count:0,rating_sum:0}],source_rating_count:0,source_rating_sum:0}))
assert.throws(()=>validateRatingHistorySnapshot({...base,
  votes:[{...base.votes[0],recipe_id:'00000000-0000-4000-8000-000000000003'}]}))
console.log('MySQL historical votes: restricted snapshot integrity checks PASS')

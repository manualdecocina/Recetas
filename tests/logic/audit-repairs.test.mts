import assert from 'node:assert/strict'
import { formatRecipeDuration } from '@/lib/duration'
import { parsePrivacyChoice, CONSENT_MAX_AGE } from '@/lib/consent'
import { parseFavoriteIds } from '@/lib/favorites'
for (const lang of ['es','en','de','fr','it','ja','pt'] as const) {
  assert(!formatRecipeDuration(43380, lang).includes('43380'))
  assert(formatRecipeDuration(43380, lang).includes('30'))
  assert(formatRecipeDuration(60, lang).includes('1'))
}
const now = 100000000000
assert.equal(parsePrivacyChoice(null, now), null)
assert.equal(parsePrivacyChoice('{', now), null)
assert.equal(parsePrivacyChoice(JSON.stringify({version:1,advertising:true,savedAt:now-CONSENT_MAX_AGE}), now), null)
assert.equal(parsePrivacyChoice(JSON.stringify({version:1,advertising:true,savedAt:now+1}), now), null)
assert.equal(parsePrivacyChoice(JSON.stringify({version:1,advertising:'yes',savedAt:now}), now), null)
assert.equal(parsePrivacyChoice(JSON.stringify({version:1,advertising:false,savedAt:now}), now)?.advertising, false)
assert.deepEqual(parseFavoriteIds('["a","b","a"]'), ['a','b'])
assert.throws(() => parseFavoriteIds('{"a":true}'))
console.log('OK: durations in seven languages, expired/malformed consent, explicit refusal, compatible favorite IDs')

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
assert.equal(parsePrivacyChoice(JSON.stringify({version:2,acknowledged:true,savedAt:now-CONSENT_MAX_AGE}), now), null)
assert.equal(parsePrivacyChoice(JSON.stringify({version:2,acknowledged:true,savedAt:now+1}), now), null)
assert.equal(parsePrivacyChoice(JSON.stringify({version:2,acknowledged:'yes',savedAt:now}), now), null)
assert.equal(parsePrivacyChoice(JSON.stringify({version:1,advertising:false,savedAt:now}), now), null, 'legacy refusal is not new consent')
assert.equal(parsePrivacyChoice(JSON.stringify({version:2,acknowledged:true,savedAt:now}), now)?.acknowledged, true)
assert.deepEqual(parseFavoriteIds('["a","b","a"]'), ['a','b'])
assert.throws(() => parseFavoriteIds('{"a":true}'))
console.log('OK: durations in seven languages, expired/malformed consent, explicit refusal, compatible favorite IDs')

const { recipeCoverVariants } = await import('@/lib/cover-variants')
assert.equal(recipeCoverVariants('/recetas/creep-stroganoff/portada.webp', null).length, 3)
assert.deepEqual(recipeCoverVariants('/recetas/new-cover.webp', null), [])
assert.deepEqual(recipeCoverVariants('/recetas/creep-stroganoff/portada.webp', ['a','b','c']), ['a','b','c'])

const { sanitizeEditorialHtml } = await import('@/lib/sanitize-editorial')
for (const html of ['<p onclick=alert(1)>hola</p>', '<svg onload=alert(1)>bad</svg>', '<a href="jav&#97;script:alert(1)">bad</a>', '<iframe src="https://example.com"></iframe>', '<script>alert(1)</script>']) {
  const safe = sanitizeEditorialHtml(html)
  assert(!/onclick|onload|javascript:|<script|<iframe|<svg/i.test(safe))
}
assert(sanitizeEditorialHtml('<h3>Notas</h3><p><a href="/arepa-de-huevo">Receta</a></p>').includes('href="/arepa-de-huevo"'))

const { PRIVACY_BOOTSTRAP } = await import('@/lib/consent')
for (const allowed of [true, false]) {
 const document = { documentElement: { dataset: {} as Record<string,string> } }
 const storage = { getItem: () => JSON.stringify({version:2,acknowledged:allowed,savedAt:Date.now()}) }
 new Function('document','localStorage',PRIVACY_BOOTSTRAP)(document,storage)
 assert.equal(document.documentElement.dataset.mdPrivacy,allowed ? 'known' : undefined,'only a valid notice acknowledgement hides it')
}

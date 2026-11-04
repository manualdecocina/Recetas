export type RelatedProfile = { id: string; group: string; ingredients: string[]; techniques: string[]; minutes: number | null; category: string | null; cuisine: string | null }
/** Spanish is the common editorial origin. Match techniques on actions rather than
 * cuisine names or translated slugs. The index is computed on the server only. */
export function recipeTechniques(title: string, steps: Array<{ title?: string; content?: string }>): string[] {
 const text = [title, ...steps.flatMap(s => [s.title ?? '', s.content ?? ''])].join(' ').normalize('NFD').replace(/\p{M}/gu, '').toLowerCase()
 const techniques: Array<[string, RegExp]> = [
  ['bake', /\b(?:hornea\w*|horno|reposteria)\b/], ['fry', /\b(?:frie|frita\w*|frito\w*|freir|fritura)\b/],
  ['braise', /\b(?:estofa\w*|guis[ao]\w*|brasea\w*)\b/], ['grill', /\b(?:parrilla\w*|plancha|asar|asa\w*)\b/],
  ['steam', /\b(?:vapor|vaporera)\b/], ['blend', /\b(?:licua\w*|tritura\w*|batido)\b/],
  ['saute', /\b(?:saltea\w*|sofrie|sofreir|sofrito)\b/], ['boil', /\b(?:hierve|hervir|hervida\w*|ebullicion)\b/],
  ['chill', /\b(?:refrigera\w*|cuajar|gelatina|congela\w*)\b/], ['ferment', /\b(?:fermenta\w*|leva\w*)\b/],
 ]
 return techniques.filter(([, pattern]) => pattern.test(text)).map(([key]) => key)
}
export function rankRelated(target: RelatedProfile, candidates: RelatedProfile[], limit = 4): string[] {
 const frequency = new Map<string, number>()
 for (const item of candidates) for (const ingredient of new Set(item.ingredients)) frequency.set(ingredient, (frequency.get(ingredient) ?? 0) + 1)
 const weight = (id: string) => Math.log(1 + candidates.length / (frequency.get(id) ?? 1))
 const targetIngredients = new Set(target.ingredients)
 return candidates.filter(item => item.group !== target.group && item.id !== target.id).map(item => {
  const own = new Set(item.ingredients), union = new Set([...targetIngredients, ...own])
  const shared = [...own].filter(id => targetIngredients.has(id)).reduce((sum, id) => sum + weight(id), 0)
  const total = [...union].reduce((sum, id) => sum + weight(id), 0)
  const techniqueOverlap = item.techniques.filter(t => target.techniques.includes(t)).length / Math.max(1, new Set([...item.techniques, ...target.techniques]).size)
  const timeScore = target.minutes && item.minutes ? Math.min(target.minutes, item.minutes) / Math.max(target.minutes, item.minutes) : 0
  return { item, score: (total ? shared / total : 0) * 12 + techniqueOverlap * 3 + timeScore * 2 + (item.category && item.category === target.category ? 2 : 0) + (item.cuisine && item.cuisine === target.cuisine ? .5 : 0) }
 }).sort((a,b) => b.score - a.score || a.item.id.localeCompare(b.item.id)).slice(0, limit).map(({ item }) => item.group)
}

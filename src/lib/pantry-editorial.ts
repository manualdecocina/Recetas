import type { MdPantryIngredient } from '@/lib/md-data'

export type EditorialIngredient = { name: string }
export type PantryLink = { recipe_id: string; ingredient_id: string; position: number }
export type PantrySource = { id: string; ingredients?: unknown[] | null }

export function normalizeIngredientSearch(value: string): string {
  return value.normalize('NFD').replace(/\p{M}/gu, '').toLowerCase().replace(/\s+/g, ' ').trim()
}

/** Keep exact ingredient identities. Never infer that two foods are substitutes. */
export function editorialIngredientId(name: string): string {
  return `editorial:${name.toLowerCase().replace(/\s+/g, ' ').trim()}`
}

/** Reviewed aliases for the same food with preparation wording. Restrict rather than
 * guessing alternatives ("o"), mixtures, powders, preserves, or different products. */
const PREPARATION_IDENTITIES: Array<[RegExp, string]> = [
  [/^(?:ajo|dientes? de ajo)\b(?! en polvo)/, 'ajo'],
  [/^(?:tomates?|jitomates?)\b(?!s? (?:cherry|concentrad|triturad|pelad|en (?:conserva|lata)))/, 'tomate'],
  [/^cebollas?\b(?! (?:larga|de verdeo))/, 'cebolla'],
  [/^cebolla larga\b/, 'cebolla-larga'],
  [/^(?:maicena|fecula de maiz|almidon de maiz)\b/, 'almidon-de-maiz'],
  [/^aceite de oliva\b/, 'aceite-de-oliva'],
  [/^aceite vegetal\b/, 'aceite-vegetal'],
  [/^aceite de canola\b/, 'aceite-de-canola'],
  [/^sal\b(?! y )/, 'sal'],
  [/^pimienta negra\b/, 'pimienta-negra'],
  [/^agua(?: (?:potable|fria|caliente|tibia|para|de coccion|limpia)|,|$)/, 'agua'],
  [/^huevos?\b(?!.*yemas separadas)/, 'huevo'],
  [/^leche(?: entera)?(?: pasteurizada| caliente|,|$)/, 'leche'],
  [/^(?:mantequilla)(?: sin sal)?(?: fria| blanda|,| \(|$)/, 'mantequilla'],
  [/^azucar(?: blanca| blanco| granulada| para| \(|$)/, 'azucar'],
  [/^harina de trigo(?: comun| de todo uso| de uso comun| de uso general|,|$)/, 'harina-de-trigo'],
  [/^fresas\b/, 'fresas'],
  [/^frambuesas\b/, 'frambuesas'],
  [/^arandanos\b/, 'arandanos'],
  [/^moras\b/, 'moras'],
  [/^cilantro(?: fresco)?\b/, 'cilantro'],
  [/^perejil(?: fresco)?\b/, 'perejil'],
  [/^(?:hojas de )?menta\b/, 'menta'],
  [/^zanahorias?\b/, 'zanahoria'],
  [/^aguacates?\b|^pulpa de aguacate\b/, 'aguacate'],
  [/^pepino\b/, 'pepino'],
  [/^calabacin\b|^calabacitas\b/, 'calabacin'],
  [/^berenjena\b/, 'berenjena'],
  [/^champinones\b/, 'champiñones'],
  [/^espinacas?\b/, 'espinacas'],
  [/^brocoli\b/, 'brocoli'],
  [/^pimiento rojo\b/, 'pimiento-rojo'],
  [/^pimiento verde\b/, 'pimiento-verde'],
  [/^mango\b/, 'mango'],
  [/^manzanas?\b/, 'manzana'],
  [/^pina\b/, 'pina'],
  [/^kiwi\b/, 'kiwi'],
  [/^sandia\b/, 'sandia'],
  [/^jengibre(?: fresco|,|$)/, 'jengibre'],
  [/^queso parmesano\b|^parmesano\b/, 'queso-parmesano'],
  [/^(?:queso )?mozzarella\b/, 'queso-mozzarella'],
  [/^(?:queso )?ricotta\b/, 'queso-ricotta'],
  [/^pimenton dulce\b/, 'pimenton-dulce'],
  [/^(?:jugo|zumo) de pina\b/, 'zumo-de-pina'],
  [/^(?:jugo|zumo) de limon\b|^limon(?:es)?\b/, 'limon'],
  [/^vinagre de sidra\b/, 'vinagre-de-manzana'],
  [/^(?:hojas? de )?laurel\b/, 'laurel'],
]

function verifiedPreparationId(name: string, catalog: MdPantryIngredient[]): string | undefined {
  const normalized = normalizeIngredientSearch(name)
  if (/\b(?:o|u)\b|sal y pimienta|de tu eleccion/.test(normalized)) return undefined
  if (/^(?:ajo|cebolla|tomate|tomates|cilantro|perejil|menta)\b.*\b(?:polvo|seco|seca|secos|secas|deshidratado|deshidratada)\b/.test(normalized) || /^ajo negro\b/.test(normalized)) return undefined
  // Cooking water and ice water are not carbonated water or ice itself.
  if (/^agua (?:con gas|con hielo)/.test(normalized)) return undefined
  const slug = PREPARATION_IDENTITIES.find(([pattern]) => pattern.test(normalized))?.[1]
  return slug ? catalog.find(i => i.slug === slug)?.id : undefined
}

function nameOf(value: unknown): string {
  return value && typeof value === 'object' && 'name' in value && typeof value.name === 'string' ? value.name.trim() : ''
}

/** Every editorial position is selectable, even before its taxonomy relation is reviewed.
 * Exact names already linked elsewhere may reuse that verified identity. Ambiguous names
 * retain their own identity; this never creates or promotes database taxonomy records. */
export function buildEditorialPantry(sources: PantrySource[], catalog: MdPantryIngredient[], links: PantryLink[]) {
  const byId = new Map(catalog.map(i => [i.id, i]))
  const linksByRecipe = new Map<string, Map<number, string>>()
  const exactNames = new Map<string, Set<string>>()
  for (const link of links) {
    if (!byId.has(link.ingredient_id)) continue
    const positions = linksByRecipe.get(link.recipe_id) ?? new Map<number, string>()
    positions.set(link.position, link.ingredient_id)
    linksByRecipe.set(link.recipe_id, positions)
  }
  for (const source of sources) {
    (source.ingredients ?? []).forEach((value, position) => {
      const id = linksByRecipe.get(source.id)?.get(position)
      const name = nameOf(value).toLowerCase().replace(/\s+/g, ' ').trim()
      if (!id || !name) return
      const ids = exactNames.get(name) ?? new Set<string>()
      ids.add(id); exactNames.set(name, ids)
    })
  }
  const requirements = new Map<string, string[]>()
  const used = new Map<string, MdPantryIngredient>()
  for (const source of sources) {
    const ids: string[] = []
    ;(source.ingredients ?? []).forEach((value, position) => {
      const name = nameOf(value)
      if (!name) return
      const normalized = name.toLowerCase().replace(/\s+/g, ' ').trim()
      const exact = exactNames.get(normalized)
      const id = linksByRecipe.get(source.id)?.get(position)
        ?? (exact?.size === 1 ? [...exact][0] : verifiedPreparationId(name, catalog) ?? editorialIngredientId(name))
      const ingredient = byId.get(id) ?? { id, slug: id, name }
      used.set(id, ingredient); ids.push(id)
    })
    requirements.set(source.id, ids)
  }
  return { ingredients: [...used.values()], requirements }
}

/** Preserve IDs across languages; localize editorial choices only where the source and
 * translation have the same positions. Otherwise retain the exact source label. */
export function localizeEditorialIngredients(
  ingredients: MdPantryIngredient[], sources: Array<PantrySource & { recipe_group_id: string }>,
  translations: Array<{ recipe_group_id: string; ingredients?: unknown[] | null }>, requirements: Map<string, string[]>,
) {
  const translatedByGroup = new Map(translations.map(r => [r.recipe_group_id, r]))
  const names = new Map<string, string>()
  for (const source of sources) {
    const translated = translatedByGroup.get(source.recipe_group_id)
    if (!translated || translated.ingredients?.length !== source.ingredients?.length) continue
    const ids = requirements.get(source.id) ?? []
    translated.ingredients?.forEach((value, position) => {
      const id = ids[position], name = nameOf(value)
      if (id?.startsWith('editorial:') && name && !names.has(id)) names.set(id, name)
    })
  }
  return ingredients.map(i => ({ ...i, name: names.get(i.id) ?? i.name }))
}

export function ingredientSuggestions(ingredients: MdPantryIngredient[], query: string, selected: Set<string>, lang: string, limit = 8) {
  const normalized = normalizeIngredientSearch(query)
  if (!normalized) return []
  const words = normalized.split(' ')
  return ingredients.filter(i => !selected.has(i.id) && words.every(word => normalizeIngredientSearch(i.name).includes(word)))
    .sort((a, b) => {
      const an = normalizeIngredientSearch(a.name), bn = normalizeIngredientSearch(b.name)
      const rank = (s: string) => s === normalized ? 0 : s.startsWith(normalized) ? 1 : 2
      return rank(an) - rank(bn) || a.name.length - b.name.length || a.name.localeCompare(b.name, lang)
    }).slice(0, limit)
}

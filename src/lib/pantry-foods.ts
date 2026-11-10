import type { MdPantryIngredient, MdPantryRecipe } from '@/lib/md-data'

const fold = (s: string) => s.normalize('NFD').replace(/\p{M}/gu, '').toLowerCase().replace(/\s+/g, ' ').trim()

// Pantry inventory describes food, not the preparation/nutrition wording of a recipe.
// Keep distinct varieties and processed products; never turn a flour or a sauce into
// the fresh food it was made from. Alternatives retain their separate identity.
const FOODS: Array<[RegExp, string]> = [
  [/^(?:papas?|patatas?)\b(?!.*\b(?:criolla|sabanera|pastusa|blanca|fritas|congeladas|pure|harina)\b)/, 'Papa'],
  [/^papas? pastusas?\b/, 'Papa pastusa'],
  [/^papaya verde\b/, 'Papaya verde'],
  [/^(?:pechugas? de pollo)\b/, 'Pechuga de pollo'],
  [/^alitas de pollo\b/, 'Alitas de pollo'],
  [/^(?:carne de res molida|carne molida de res|carne de res picada)\b/, 'Carne molida de res'],
  [/^lomo de cerdo\b/, 'Lomo de cerdo'],
  [/^paleta de cerdo(?! molida)\b/, 'Paleta de cerdo'],
  [/^(?:filetes?|lomos?) de salmon\b|^salmon sin piel\b/, 'Salmón'],
  [/^filetes? de trucha\b/, 'Trucha'],
  [/^filetes? de bacalao\b/, 'Bacalao'],
  [/^(?:gambas|camarones)\b/, 'Camarones'],
  [/^langostinos\b/, 'Langostinos'],
  [/^calamar\b/, 'Calamar'],
  [/^mejillones\b/, 'Mejillones'],
  [/^(?:hojas de )?albahaca\b(?! (?:sec[oa]s?|deshidratad[oa]s?|en polvo))/, 'Albahaca fresca'],
  [/^(?:ramas? de |tallos de )apio\b|^apio\b/, 'Apio'],
  [/^calabaza\b/, 'Calabaza'],
  [/^coliflor\b/, 'Coliflor'],
  [/^col china\b/, 'Col china'],
  [/^judias verdes\b/, 'Judías verdes'],
  [/^lechuga romana\b/, 'Lechuga romana'],
  [/^(?:hojas de )?lechuga(?! romana)\b/, 'Lechuga'],
  [/^pimenton rojo\b|^pimiento rojo\b/, 'Pimiento rojo'],
  [/^rabanos\b/, 'Rábanos'],
  [/^yu[ck]as?\b/, 'Yuca'],
  [/^nueces\b/, 'Nueces'],
  [/^pistachos\b/, 'Pistachos'],
  [/^almendras\b/, 'Almendras'],
  [/^avellanas\b/, 'Avellanas'],
  [/^aceitunas negras\b/, 'Aceitunas negras'],
  [/^aceitunas verdes\b/, 'Aceitunas verdes'],
  [/^pasas\b/, 'Pasas'],
  [/^bananas?\b/, 'Banana'],
  [/^higos\b(?! (?:secos?|deshidratados?|en (?:almibar|conserva)))/, 'Higos'],
  [/^naranja\b/, 'Naranja'],
  [/^(?:jugo|zumo) de naranja\b/, 'Jugo de naranja'],
  [/^(?:jugo|zumo) de lima\b/, 'Jugo de lima'],
  [/^limas?\b/, 'Lima'],
  [/^cafe espresso\b/, 'Espresso'],
  [/^queso crema\b/, 'Queso crema'],
  [/^queso feta\b/, 'Queso feta'],
  [/^queso cheddar\b|^lonchas de queso cheddar\b/, 'Queso cheddar'],
  [/^queso mascarpone\b|^mascarpone\b/, 'Mascarpone'],
  [/^queso pecorino\b|^pecorino romano\b/, 'Queso pecorino'],
  [/^queso gruyere\b/, 'Queso gruyère'],
  [/^mozzarella fresca\b/, 'Mozzarella fresca'],
  [/^crema agria\b/, 'Crema agria'],
  [/^leche de coco\b/, 'Leche de coco'],
  [/^leche evaporada\b/, 'Leche evaporada'],
  [/^hojaldre\b/, 'Hojaldre'],
  [/^pan blanco\b/, 'Pan blanco'],
  [/^panes? (?:de|tipo) hamburguesa\b/, 'Pan de hamburguesa'],
  [/^(?:pan rallado(?: tipo)? panko|panko)\b/, 'Panko'],
  [/^pan rallado(?! panko)\b/, 'Pan rallado'],
  [/^(?:espaguetis?|espagueti)\b(?! (?:frescos?|cocidos?))/, 'Espaguetis'],
  [/^fettuccine\b(?! (?:frescos?|cocidos?))/, 'Fettuccine'],
  [/^tortillas de maiz\b/, 'Tortillas de maíz'],
  [/^tortillas (?:grandes )?de (?:trigo|harina)\b/, 'Tortillas de trigo'],
  [/^tomate triturado\b/, 'Tomate triturado'],
  [/^tomate concentrado\b|^pasta de tomate\b/, 'Concentrado de tomate'],
  [/^jamon serrano\b/, 'Jamón serrano'],
  [/^jamon cocido\b/, 'Jamón cocido'],
  [/^vinagre de arroz\b/, 'Vinagre de arroz'],
  [/^yemas de huevo\b/, 'Yema de huevo'],
  [/^claras de huevo\b/, 'Clara de huevo'],
  [/^cubitos de hielo\b|^hielo\b/, 'Hielo'],
]

export function pantryFoodName(name: string, lang = 'es'): string {
  const normalized = fold(name)
  const alternatives = /\b(?:o|u)\b/.test(normalized)
  const combinedFoods = /,\s*(?:aguacate|arepa|chicharron|guacamole|cilantro fresco)\b/.test(normalized)
  if (combinedFoods) return name
  if (lang === 'es' && !alternatives) {
    const food = FOODS.find(([pattern]) => pattern.test(normalized))
    if (food) return food[1]
  }
  // Remove subordinate preparation notes, keeping product descriptors before them.
  // Do not truncate lists of alternatives or combined ingredients.
  if (alternatives || /\by\b/.test(normalized.split(',')[0])) return name
  let short = name.replace(/\s*\([^)]*\)/g, '').split(/[,;:]/)[0].trim()
  // Product form is meaningful: peeling a canned tomato or grating dried
  // coconut does not turn either into the fresh food. Preserve those descriptors.
  const productForm = /\b(?:en conserva|en lata|deshidratad[oa]s?|congelad[oa]s?|secos?|secas?|en polvo|salmuera|ahumad[oa]s?|panko)\b/.test(fold(short))
  if (lang === 'es' && !productForm) {
    short = short.replace(/\s+(?:para (?:servir|decorar|espolvorear|la cobertura|el relleno)|(?:finamente )?(?:picad[oa]s?|pelad[oa]s?|rallad[oa]s?|cortad[oa]s?|laminad[oa]s?|trocead[oa]s?|desmenuzad[oa]s?|escurrid[oa]s?)|en (?:rodajas|gajos|cubos|dados|tiras|trozos)\b).*$/i, '')
  }
  return short ? short[0].toLocaleUpperCase(lang) + short.slice(1) : name
}

/** Apply the SAME identity mapping to suggestions, matching, checklists and saved
 * selections. Never simplify just the visible label and leave duplicate requirements. */
export function consolidatePantryFoods<T extends Pick<MdPantryRecipe, 'ingredientIds'> & { editorialIngredientIds?: string[] }>(
  ingredients: MdPantryIngredient[], recipes: T[], lang = 'es',
): { ingredients: MdPantryIngredient[]; recipes: T[] } {
  const groups = new Map<string, MdPantryIngredient[]>()
  for (const ingredient of ingredients) {
    const key = fold(pantryFoodName(ingredient.name, lang))
    const group = groups.get(key) ?? []
    group.push(ingredient); groups.set(key, group)
  }
  const ids = new Map<string, string>()
  const choices: MdPantryIngredient[] = []
  for (const group of groups.values()) {
    const winner = [...group].sort((a, b) => Number(a.id.startsWith('editorial:')) - Number(b.id.startsWith('editorial:')) || a.name.length - b.name.length)[0]
    const name = pantryFoodName(winner.name, lang)
    for (const item of group) ids.set(item.id, winner.id)
    choices.push({ ...winner, name,
      sourceIds: [...new Set(group.flatMap(i => [i.id, ...(i.sourceIds ?? [])]))],
      aliases: [...new Set(group.flatMap(i => [i.slug, ...(i.aliases ?? [])]))] })
  }
  return { ingredients: choices.sort((a, b) => a.name.localeCompare(b.name, lang)), recipes: recipes.map(r => ({
    ...r, ingredientIds: [...new Set(r.ingredientIds.map(id => ids.get(id) ?? id))],
    ...(r.editorialIngredientIds ? { editorialIngredientIds: r.editorialIngredientIds.map(id => ids.get(id) ?? id) } : {}),
  })) }
}

/** Taxonomy pages and filters must resolve the same identities as the pantry.
 * A canonical ID may have been merged into another equivalent choice. */
export function pantryIngredientRecipeIds(
  pantry: { ingredients: MdPantryIngredient[]; recipes: Array<{ id: string; ingredientIds: string[] }> },
  ingredientId: string,
): string[] {
  const choice = pantry.ingredients.find(i => i.id === ingredientId || i.sourceIds?.includes(ingredientId))
  const id = choice?.id ?? ingredientId
  return pantry.recipes.filter(recipe => recipe.ingredientIds.includes(id)).map(recipe => recipe.id)
}

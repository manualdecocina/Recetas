import type { RecipeLanguage } from '@/types/recipe'
import type { RecipeIngredientText } from '@/lib/recipe-ingredient-format'


// Exact section headings recovered from the legacy localized records. A section label
// is never an ingredient; retain it as the visible group heading instead.
const SECTION_HEADINGS = new Set(["For the Bowl", "For the Garnish", "For the Tahini Sauce", "For the arepa", "For the filling", "Für die Arepa", "Für die Bowl", "Für die Füllung", "Für die Tahini-Sauce", "Para a arepa", "Para a decoração", "Para o bowl", "Para o molho de tahine", "Para o recheio", "Per il ripieno", "Per l'arepa", "Per la bowl", "Per la guarnizione", "Per la salsa tahini", "Pour l'arepa", "Pour la garniture", "Pour la sauce tahini", "Pour le bowl", "Zum Garnieren", "アレパ生地用", "タヒニソース用", "トッピング用", "ボウル用", "具材用"])

const AJIACO_GROUP = '3225779c-4c03-4b93-8c68-7454142f87f3'
// Reviewed mapping: localized legacy ajiaco lists the potatoes before the aromatics.
const AJIACO_ORDER = [0, 1, 6, 7, 9, 10, 2, 3, 4, 5, 8, 11, 12, 13]

const QUINOA_GROUP = '726e443e-2d92-4e1a-807d-4ae130c90066'
const AREPA_GROUP = 'f3d1df5c-7da4-4fd0-a27b-14f4ea446f8a'
const UNITS = {
  en: ['cups', 'cup', 'tablespoons'], de: ['Tassen', 'Tasse', 'EL'],
  fr: ['tasses', 'tasse', 'cuillères à soupe'], it: ['tazze', 'tazza', 'cucchiai'],
  ja: ['カップ', 'カップ', '大さじ'], pt: ['xícaras', 'xícara', 'colheres de sopa'],
} as const

/** Recover specific dropped quantities from the reviewed Spanish source, with localized
 * units. Apply only to these legacy records and never overwrite an authored quantity. */
function recoverLegacyQuantities<T extends RecipeIngredientText>(rows: T[], groupId: string, lang: RecipeLanguage): T[] {
  if (lang === 'es') return rows
  const units = UNITS[lang]
  const amounts: Record<number, [string, string]> = groupId === AREPA_GROUP && rows.length === 12
    ? { 1: ['2', units[0]], 5: ['2', units[0]], 6: ['1', units[1]], 7: ['1', units[1]], 8: ['1', ''], 9: ['1/2', units[1]] }
    : groupId === QUINOA_GROUP && rows.length === 19 ? { 18: ['2', units[2]] }
    : groupId === AJIACO_GROUP && rows.length === 14 ? { 13: ['1', ''] } : {}
  return rows.map((item, index) => !item.amount && amounts[index] ? { ...item, amount: amounts[index][0], unit: amounts[index][1] } : item)
}

export function normalizeEditorialIngredientSections<T extends RecipeIngredientText>(ingredients: T[], groupId: string, lang: RecipeLanguage): T[] {
  let group: string | undefined
  const rows: T[] = []
  for (const [sourcePosition, item] of ingredients.entries()) {
    if (!item.amount && !item.unit && SECTION_HEADINGS.has(item.name)) { group = item.name; continue }
    const storagePosition = 'storagePosition' in item ? item.storagePosition : sourcePosition
    rows.push({ ...item, storagePosition, ...(group ? { group } : {}) })
  }
  if (lang !== 'es' && groupId === AJIACO_GROUP && rows.length === 14) {
    // A stable recognizable name guard prevents reordering a future corrected source.
    const garlicMarkers = /garlic|knoblauch|ail|aglio|alho|にんにく/i
    if (garlicMarkers.test(rows[7].name) && !garlicMarkers.test(rows[3].name)) return recoverLegacyQuantities(AJIACO_ORDER.map(i => rows[i]), groupId, lang)
  }
  return recoverLegacyQuantities(rows, groupId, lang)
}

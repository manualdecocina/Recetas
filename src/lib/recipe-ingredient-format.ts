/** Human-readable ingredients are shared by the visible list and Recipe JSON-LD.
 * Keep database quantities untouched, and never invent unit conversions. */
export interface RecipeIngredientText {
  amount?: string | number | null
  unit?: string | null
  name: string
}

const SPANISH_COUNT_UNITS: Record<string, readonly [string, string]> = {
  cucharada: ['cucharada de', 'cucharadas de'],
  cucharadita: ['cucharadita de', 'cucharaditas de'],
  rebanada: ['rebanada de', 'rebanadas de'],
  taza: ['taza de', 'tazas de'],
  diente: ['diente de', 'dientes de'],
  rama: ['rama de', 'ramas de'],
  hoja: ['hoja de', 'hojas de'],
  pizca: ['pizca de', 'pizcas de'],
  gota: ['gota de', 'gotas de'],
  vaso: ['vaso de', 'vasos de'],
  lata: ['lata de', 'latas de'],
  botella: ['botella de', 'botellas de'],
  sobre: ['sobre de', 'sobres de'],
  pieza: ['pieza de', 'piezas de'],
}

/** Prefix before the ingredient name, for both rich JSX and schema. */
export function ingredientDisplayPrefix(
  ingredient: Pick<RecipeIngredientText, 'amount' | 'unit'>,
  language: string,
): string {
  const rawAmount = ingredient.amount == null ? '' : String(ingredient.amount).trim()
  const rawUnit = ingredient.unit?.trim() ?? ''
  if (language !== 'es') return [rawAmount, rawUnit].filter(Boolean).join(' ')

  // Spanish decimal punctuation is only a presentation change (e.g. 1.5 -> 1,5).
  const amount = rawAmount.replace(/^(\d+)\.(\d+)$/, '$1,$2')
  const numericAmount = /^\d+(?:[.,]\d+)?$/.test(rawAmount)
    ? Number(rawAmount.replace(',', '.')) : NaN
  const plural = Number.isFinite(numericAmount) && numericAmount > 1
  const unit = rawUnit.toLocaleLowerCase('es')
  // The noun is already supplied by the ingredient name: "4 huevos", not "4 unidad huevos".
  if (unit === 'unidad' || unit === 'unidades') return amount
  const forms = SPANISH_COUNT_UNITS[unit]
  return [amount, forms ? forms[plural ? 1 : 0] : rawUnit].filter(Boolean).join(' ')
}

export function ingredientDisplayText(ingredient: RecipeIngredientText, language: string): string {
  const prefix = ingredientDisplayPrefix(ingredient, language)
  const name = ingredient.name.trim()
  return [prefix, prefix.endsWith(' de') ? name.replace(/^de\s+/i, '') : name]
    .filter(Boolean).join(' ')
}

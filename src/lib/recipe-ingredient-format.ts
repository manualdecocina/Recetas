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
  ramita: ['ramita de', 'ramitas de'],
  hoja: ['hoja de', 'hojas de'],
  pizca: ['pizca de', 'pizcas de'],
  gota: ['gota de', 'gotas de'],
  vaso: ['vaso de', 'vasos de'],
  lata: ['lata de', 'latas de'],
  botella: ['botella de', 'botellas de'],
  sobre: ['sobre de', 'sobres de'],
  pieza: ['pieza de', 'piezas de'],
  manojo: ['manojo de', 'manojos de'],
  tallo: ['tallo de', 'tallos de'],
  tira: ['tira de', 'tiras de'],
  cubo: ['cubo de', 'cubos de'],
  yema: ['yema de', 'yemas de'],
}

/** Plural spellings stored in the data ("cucharadas", "dientes") resolve to the same entry. */
const SPANISH_PLURAL_KEYS: Record<string, string> = Object.fromEntries(
  Object.entries(SPANISH_COUNT_UNITS).map(([singular, [, plural]]) => [plural.replace(/ de$/, ''), singular]),
)

/** Units that are really the noun of the ingredient: "4 huevos", not "4 unidad huevos". */
const SPANISH_NOUN_UNITS = new Set(['unidad', 'unidades', 'und', 'unidadad'])

/** Same rule in the other Latin-script languages, whose names already carry the noun:
 * "4 ovos", not "4 unidade ovos"; "2 egg yolks", not "2 piece egg yolks".
 * German "Stück" is idiomatic ("2 Stück Eier") and stays. */
const NOUN_UNITS_BY_LANGUAGE: Record<string, ReadonlySet<string>> = {
  en: new Set(['piece', 'pieces', 'unit', 'units', 'pc', 'pcs']),
  fr: new Set(['unité', 'unités', 'pièce', 'pièces']),
  it: new Set(['unità', 'pezzo', 'pezzi']),
  pt: new Set(['unidade', 'unidades', 'und', 'un']),
}

/** Reviewed count units only. SI symbols, free-text ranges and annotations stay intact. */
const LOCAL_COUNT_UNITS: Record<string, ReadonlyArray<readonly [string, string]>> = {
  en: [['teaspoon', 'teaspoons'], ['tablespoon', 'tablespoons'], ['cup', 'cups'], ['pinch', 'pinches'], ['clove', 'cloves'], ['leaf', 'leaves'], ['sprig', 'sprigs'], ['bunch', 'bunches'], ['can', 'cans'], ['slice', 'slices'], ['stick', 'sticks']],
  de: [['Tasse', 'Tassen'], ['Prise', 'Prisen'], ['Zehe', 'Zehen'], ['Blatt', 'Blätter'], ['Zweig', 'Zweige'], ['Bund', 'Bünde'], ['Dose', 'Dosen'], ['Scheibe', 'Scheiben'], ['Stange', 'Stangen']],
  fr: [['cuillère à café', 'cuillères à café'], ['cuillère à soupe', 'cuillères à soupe'], ['tasse', 'tasses'], ['pincée', 'pincées'], ['gousse', 'gousses'], ['feuille', 'feuilles'], ['brin', 'brins'], ['botte', 'bottes'], ['boîte', 'boîtes'], ['tranche', 'tranches'], ['bâton', 'bâtons'], ['lanière', 'lanières']],
  it: [['cucchiaino', 'cucchiaini'], ['cucchiaio', 'cucchiai'], ['tazza', 'tazze'], ['pizzico', 'pizzichi'], ['spicchio', 'spicchi'], ['foglia', 'foglie'], ['rametto', 'rametti'], ['mazzo', 'mazzi'], ['lattina', 'lattine'], ['fetta', 'fette'], ['stecca', 'stecche']],
  pt: [['colher de chá', 'colheres de chá'], ['colher de sopa', 'colheres de sopa'], ['xícara', 'xícaras'], ['pitada', 'pitadas'], ['dente', 'dentes'], ['folha', 'folhas'], ['ramo', 'ramos'], ['maço', 'maços'], ['lata', 'latas'], ['fatia', 'fatias'], ['pau', 'paus']],
}

function localCountUnit(ingredient: Pick<RecipeIngredientText, 'amount' | 'unit'>, language: string): string | null {
  const value = parseSpanishAmount(String(ingredient.amount ?? ''))
  if (!Number.isFinite(value)) return null
  const unit = (ingredient.unit?.trim() ?? '')
    .replace(/\s+(?:de|di|of)$/i, '')
    .replace(/colher \(chá\)/i, 'colher de chá').replace(/colher \(sopa\)/i, 'colher de sopa')
  const forms = LOCAL_COUNT_UNITS[language]?.find(pair => pair.some(form => form.toLocaleLowerCase(language) === unit.toLocaleLowerCase(language)))
  if (!forms) return null
  // Fractions up to one use the singular in recipe measures; French also uses
  // the singular below two. The original amount is always preserved.
  const plural = language === 'fr' ? value >= 2 : value > 1 || value === 0
  return forms[plural ? 1 : 0]
}

/** Size adjectives stored as a unit ("1 grande" + "cebolla picada") belong after the noun. */
const SPANISH_SIZE_UNITS = new Set(['grande', 'grandes', 'mediana', 'medianas', 'mediano', 'medianos', 'pequeña', 'pequeñas', 'pequeño', 'pequeños'])

/** Numeric value of "2", "1.5", "1,5", "1/2" or "1 1/4"; NaN for ranges or free text. */
function parseSpanishAmount(raw: string): number {
  const value = raw.trim()
  if (/^\d+(?:[.,]\d+)?$/.test(value)) return Number(value.replace(',', '.'))
  const mixed = value.match(/^(?:(\d+)\s+)?(\d+)\/(\d+)$/)
  if (mixed) return Number(mixed[1] ?? 0) + Number(mixed[2]) / Number(mixed[3])
  return NaN
}

function spanishUnit(rawUnit: string): string {
  // "taza de" / "cucharadas de" were sometimes stored with the preposition already included.
  return rawUnit.toLocaleLowerCase('es').replace(/\s+de$/, '').trim()
}

/** Prefix before the ingredient name, for both rich JSX and schema. */
export function ingredientDisplayPrefix(
  ingredient: Pick<RecipeIngredientText, 'amount' | 'unit'>,
  language: string,
): string {
  const rawAmount = ingredient.amount == null ? '' : String(ingredient.amount).trim()
  const rawUnit = ingredient.unit?.trim() ?? ''
  if (language !== 'es') {
    if (NOUN_UNITS_BY_LANGUAGE[language]?.has(rawUnit.toLocaleLowerCase(language))) return rawAmount
    const countUnit = localCountUnit(ingredient, language)
    if (countUnit) return [rawAmount, countUnit].filter(Boolean).join(' ')
    if (language === 'ja' && rawAmount) {
      if (rawUnit === '小さじ' || rawUnit === '大さじ') return rawUnit + rawAmount
      if (rawUnit === 'ひとつまみ' && parseSpanishAmount(rawAmount) === 1) return rawUnit
      if (/^(?:個|個分|本|片|かけ|枚|カップ|缶|束|枝|粒|つまみ)$/.test(rawUnit)) return rawAmount + rawUnit
    }
    return [rawAmount, rawUnit].filter(Boolean).join(' ')
  }

  // Spanish decimal punctuation is only a presentation change (e.g. 1.5 -> 1,5).
  const amount = rawAmount.replace(/^(\d+)\.(\d+)$/, '$1,$2')
  const numericAmount = parseSpanishAmount(rawAmount)
  const unit = spanishUnit(rawUnit)
  if (SPANISH_NOUN_UNITS.has(unit) || SPANISH_SIZE_UNITS.has(unit)) return amount

  const singularKey = SPANISH_COUNT_UNITS[unit] ? unit : SPANISH_PLURAL_KEYS[unit]
  const forms = singularKey ? SPANISH_COUNT_UNITS[singularKey] : undefined
  if (!forms) return [amount, rawUnit].filter(Boolean).join(' ')

  // Without a parseable amount, keep the number the editor wrote ("tazas" stays plural).
  const plural = Number.isFinite(numericAmount) ? numericAmount > 1 : unit !== singularKey
  return [amount, forms[plural ? 1 : 0]].filter(Boolean).join(' ')
}

/** Ingredient name as displayed after the prefix (shared by the visible list and JSON-LD). */
export function ingredientDisplayName(ingredient: RecipeIngredientText, language: string): string {
  const name = ingredient.name.trim()
  if (language !== 'es') {
    if (!localCountUnit(ingredient, language)) return name
    if (language === 'fr') {
      const noun = name.replace(/^(?:de\s+|d['’]\s*)/i, '')
      return /^(?:[aeiouyàâäéèêëîïôöùûüœæ]|huile|herbe)/i.test(noun) ? `d’${noun}` : `de ${noun}`
    }
    if (language === 'it') return `di ${name.replace(/^(?:di\s+|d['’]\s*)/i, '')}`
    if (language === 'pt') return `de ${name.replace(/^de\s+/i, '')}`
    return name
  }
  const unit = spanishUnit(ingredient.unit?.trim() ?? '')
  const prefix = ingredientDisplayPrefix(ingredient, language)
  const withoutDe = prefix.endsWith(' de') ? name.replace(/^de\s+/i, '') : name
  if (!SPANISH_SIZE_UNITS.has(unit)) return withoutDe
  // "cebolla picada" + "grande" -> "cebolla grande picada".
  const [noun, ...rest] = withoutDe.split(/\s+/)
  return [noun, unit, ...rest].join(' ')
}

export function ingredientDisplayText(ingredient: RecipeIngredientText, language: string): string {
  return [ingredientDisplayPrefix(ingredient, language), ingredientDisplayName(ingredient, language)]
    .filter(Boolean).join(' ')
}

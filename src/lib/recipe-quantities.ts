import { ingredientDisplayPrefix, recipeCountUnits } from '@/lib/recipe-ingredient-format'
import type { MdIngredient, MdStep } from '@/components/md/md-types'

const FRACTIONS: Record<string, string> = { '¼': '1/4', '½': '1/2', '¾': '3/4', '⅓': '1/3', '⅔': '2/3', '⅛': '1/8', '⅜': '3/8', '⅝': '5/8', '⅞': '7/8' }
export function parseQuantity(raw: string): number | null {
  const value = raw.trim().replace(/(\d)([¼½¾⅓⅔⅛⅜⅝⅞])/g, '$1 $2').replace(/[¼½¾⅓⅔⅛⅜⅝⅞]/g, c => FRACTIONS[c])
  if (/^\d+(?:[.,]\d+)?$/.test(value)) return Number(value.replace(',', '.'))
  const fraction = value.match(/^(?:(\d+)\s+)?(\d+)\s*\/\s*(\d+)$/)
  if (!fraction || Number(fraction[3]) === 0) return null
  return Number(fraction[1] ?? 0) + Number(fraction[2]) / Number(fraction[3])
}
export function formatQuantity(value: number, lang: string): string {
  // Three decimal places preserve small seasoning amounts without floating-point noise.
  return new Intl.NumberFormat(lang, { maximumFractionDigits: 3, useGrouping: false }).format(value)
}
export function scaleAmount(raw: string, factor: number, lang: string): string {
  if (factor === 1) return raw
  const value = parseQuantity(raw)
  if (value !== null) return formatQuantity(value * factor, lang)
  const range = raw.match(/^\s*(.+?)\s*[–—-]\s*(.+?)\s*$/)
  if (range) {
    const from = parseQuantity(range[1]), to = parseQuantity(range[2])
    if (from !== null && to !== null) return `${formatQuantity(from * factor, lang)}–${formatQuantity(to * factor, lang)}`
  }
  return raw // "al gusto", "as needed", alternatives and unknown measures remain editorial.
}
const NUMBER = '(?:\\d+\\s+\\d+\\/\\d+|\\d+\\/\\d+|\\d+(?:[.,]\\d+)?(?:[¼½¾⅓⅔⅛⅜⅝⅞])?|[¼½¾⅓⅔⅛⅜⅝⅞])'
const AMOUNT = `${NUMBER}(?:\\s*[–—-]\\s*${NUMBER})?`
// Explicit food measures only: never times, temperatures, percentages, pan sizes or step numbers.
const MEASURES = 'kg|mg|g|ml|cl|dl|l|litros?|litres?|liters?|gramos?|grams?|Gramm|Kilogramm|Milliliter|Liter|cups?|tablespoons?|teaspoons?|tbsp|tsp|tazas?|cucharadas?|cucharaditas?|Tassen?|EL|TL|cuillères? à (?:soupe|café)|tasses?|cucchiai(?:ni)?|cucchiaio|tazze?|colheres? de (?:sopa|chá)|xícaras?|カップ|グラム|ミリリットル|個|本|枚|片|玉|pinches?|pizcas?|Prisen?|pincées?|pizzichi|pizzico|pitadas?'
const escape = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
export function scaleInstruction(text: string, factor: number, lang: string, ingredients: MdIngredient[]): string {
  if (factor === 1) return text
  const nouns = [...new Set(ingredients.filter(i => !i.unit || /^(?:unidades?|units?|pieces?|pcs?|Stück|個|本|枚|unidade|unidades|unité|unités|unità)$/i.test(i.unit)).flatMap(i => {
    const full = i.name.split(/[,;(（]/)[0].trim();
    const short = full.replace(/\s+(?:grandes?|medianos?|medianas?|pequeños?|pequeñas?|large|medium|small|große|kleine|grandes?|moyens?|piccole?|grandi).*$/iu, '');
    return [full, short];
  }).filter(Boolean))].sort((a, b) => b.length - a.length).map(noun => escape(noun).replace(/\s+/g, '\\s+'))
  const measures = [MEASURES, ...recipeCountUnits(lang).map(escape)].join('|')
  const units = `${measures}|porciones|raciones|servings|portions|Portionen|porzioni|porções|人分${nouns.length ? `|${nouns.join('|')}` : ''}`
  const foodMeasures = new RegExp(`(?<![\\d.,/–—-])(${AMOUNT})(\\s*)(${units})(?![a-zA-ZÀ-ÿ])`, 'giu')
  const words: Record<string, Record<string, number>> = {
   es: { un: 1, una: 1, dos: 2, tres: 3, cuatro: 4 }, en: { a: 1, an: 1, one: 1, two: 2, three: 3, four: 4 },
   de: { ein: 1, eine: 1, einen: 1, zwei: 2, drei: 3, vier: 4 }, fr: { un: 1, une: 1, deux: 2, trois: 3, quatre: 4 },
   it: { un: 1, una: 1, uno: 1, due: 2, tre: 3, quattro: 4 }, pt: { um: 1, uma: 1, dois: 2, duas: 2, tres: 3, 'três': 3, quatro: 4 },
  }
  const localWords = words[lang] ?? {}
  const numbered = Object.keys(localWords).length ? text.replace(new RegExp(`(?<![\\p{L}])(${Object.keys(localWords).join('|')})(?=\\s+(?:${units})(?![a-zA-ZÀ-ÿ]))`, 'giu'), word => String(localWords[word.toLocaleLowerCase(lang)])) : text
  let scaled = numbered.replace(foodMeasures, (_all, amount: string, space: string, unit: string) => {
    const adjusted = scaleAmount(amount, factor, lang)
    if (new RegExp(`^(?:${measures})$`, 'iu').test(unit)) return ingredientDisplayPrefix({ amount: adjusted, unit }, lang).replace(/\s+de$/, '')
    return `${adjusted}${space}${unit}`
  })
  scaled = scaled.replace(new RegExp(`(小さじ|大さじ)(${AMOUNT})`, 'gu'), (_all, unit: string, amount: string) => `${unit}${scaleAmount(amount, factor, lang)}`)
  return scaled
}
function scaleIngredientAnnotation(text: string, factor: number, lang: string): string {
 const scaled = scaleInstruction(text, factor, lang, [])
 return scaled.replace(/((?:unas?|aprox\.?|aproximadamente|about|approximately|environ|etwa|circa|cerca de|約)\s*)(\d+(?:[.,]\d+)?)(?![\d.,])/giu,
  (all, qualifier: string, amount: string, offset: number) => {
   const after = scaled.slice(offset + all.length)
   if (new RegExp(`^\\s*(?:${[MEASURES, ...recipeCountUnits(lang).map(escape)].join('|')})(?![a-zA-ZÀ-ÿ])`, 'iu').test(after)) return all
   return `${qualifier}${scaleAmount(amount, factor, lang)}`
  })
}
export function scaleIngredients(ingredients: MdIngredient[], factor: number, lang: string): MdIngredient[] {
  if (factor === 1) return ingredients
  return ingredients.map(item => ({ ...item, amount: scaleAmount(String(item.amount ?? ''), factor, lang),
    name: scaleIngredientAnnotation(item.name, factor, lang),
    ...(item.note ? { note: scaleInstruction(item.note, factor, lang, []) } : {}),
    ...(item.preparation ? { preparation: scaleInstruction(item.preparation, factor, lang, []) } : {}),
  }))
}
export function scaleSteps(steps: MdStep[], factor: number, lang: string, ingredients: MdIngredient[]): MdStep[] {
  return factor === 1 ? steps : steps.map(step => ({ ...step,
    title: scaleInstruction(step.title, factor, lang, ingredients), content: scaleInstruction(step.content, factor, lang, ingredients),
  }))
}

/** Use explicit editorial timers first. Infer only a single unambiguous duration in
 * the seven languages; ranges, multiple durations and long rests require a manual timer. */
export function stepTimerSeconds(step: MdStep): number | null {
  if (step.timer_seconds && Number.isFinite(step.timer_seconds) && step.timer_seconds > 0) return Math.round(step.timer_seconds)
  const matches = [...step.content.matchAll(/(\d+(?:[.,]\d+)?)\s*(minutes?|minutos?|Minuten?|minuti|秒|分|seconds?|segundos?|Sekunden?|secondes?|secondi)(?![a-zA-ZÀ-ÿ])/giu)]
  if (matches.length !== 1) return null
  const match = matches[0], before = step.content.slice(0, match.index)
  if (/[\d–—\-〜～~]\s*$|\d+\s+(?:a|to|bis|à|até|から)\s*$/i.test(before)) return null
  const value = Number(match[1].replace(',', '.')) * (/^(?:秒|s|S)/.test(match[2]) ? 1 : 60)
  return value > 0 && value <= 7200 ? Math.round(value) : null
}

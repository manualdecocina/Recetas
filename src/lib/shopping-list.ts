import type { MdIngredient, MdLanguage } from '@/components/md/md-types'
import { parseQuantity, formatQuantity } from '@/lib/recipe-quantities'
import { pantryFoodName } from '@/lib/pantry-foods'
import { ingredientDisplayText, ingredientDisplayPrefix, recipeCountUnitIdentity } from '@/lib/recipe-ingredient-format'
export const SHOPPING_KEY = 'manualdecocina:shopping:v1'
export const SHOPPING_EVENT = 'manualdecocina:shopping-change'
export const PANTRY_KEY = 'manualdecocina:pantry:selectedSlugs'
export const PANTRY_EVENT = 'manualdecocina:pantry-change'
export type ShoppingSource = { id: string; recipeId?: string; title: string; href: string; lang: MdLanguage; ingredients: MdIngredient[] }
export type ShoppingState = { sources: ShoppingSource[]; checked: string[] }
export type ShoppingRow = { key: string; name: string; amount: string; unit?: string; text: string; quantity: string; slugs: string[] }
export const emptyShopping = (): ShoppingState => ({ sources: [], checked: [] })
let memory: ShoppingState = emptyShopping()
let memoryOnly = false
export function readShopping(): ShoppingState {
 if (memoryOnly) return memory
 try {
  const raw = localStorage.getItem(SHOPPING_KEY)
  if (!raw) return memory = emptyShopping()
  const data = JSON.parse(raw)
  if (!Array.isArray(data?.sources) || !Array.isArray(data?.checked)) return memory = emptyShopping()
  return memory = { sources: data.sources.filter((s: ShoppingSource) => s && typeof s.id === 'string' && typeof s.title === 'string' && typeof s.href === 'string' && /^\/(?!\/)/.test(s.href) && ['es','en','de','fr','it','ja','pt'].includes(s.lang) && Array.isArray(s.ingredients)).map((s: ShoppingSource) => ({ ...s, ingredients: s.ingredients.filter(i => i && typeof i.name === 'string' && typeof i.amount === 'string') })), checked: data.checked.filter((s: unknown) => typeof s === 'string') }
 } catch { return memory }
}
export function writeShopping(state: ShoppingState): boolean {
 memory = state
 let saved = true
 try { localStorage.setItem(SHOPPING_KEY, JSON.stringify(state)); memoryOnly = false } catch { saved = false; memoryOnly = true }
 window.dispatchEvent(new Event(SHOPPING_EVENT))
 return saved
}
export function addShoppingSource(state: ShoppingState, source: ShoppingSource): ShoppingState {
 // Re-adding a recipe updates its quantities, rather than silently doubling it.
 const sources = state.sources.filter(s => s.id !== source.id)
 if (source.ingredients.length) sources.push(source)
 const affected = new Set(shoppingRows({ sources: [source], checked: [] }, source.lang).map(row => row.key))
 return { sources, checked: state.checked.filter(key => !affected.has(key)) }
}
const fold = (text: string) => text.normalize('NFD').replace(/\p{M}/gu, '').toLowerCase().replace(/\s+/g, ' ').trim()
function unitIdentity(raw: string, lang: MdLanguage): { key: string; factor: number; unit: string } {
 const unit = fold(raw).replace(/\.$/, '')
 if (/^(?:kg|kilogramos?|kilograms?|kilogramm)$/.test(unit)) return { key: 'mass', factor: 1000, unit: 'g' }
 if (/^(?:g|gramos?|grams?|gramm)$/.test(unit)) return { key: 'mass', factor: 1, unit: 'g' }
 if (/^(?:mg)$/.test(unit)) return { key: 'mass', factor: .001, unit: 'g' }
 if (/^(?:l|litros?|litres?|liters?|liter)$/.test(unit)) return { key: 'volume', factor: 1000, unit: 'ml' }
 if (unit === 'cl') return { key: 'volume', factor: 10, unit: 'ml' }
 if (unit === 'dl') return { key: 'volume', factor: 100, unit: 'ml' }
 if (/^(?:ml|milliliters?|millilitres?|milliliter)$/.test(unit)) return { key: 'volume', factor: 1, unit: 'ml' }
 if (/^(?:unidades?|units?|pieces?|pcs?|stuck|個|unidades?|unites?|unità|unita)$/.test(unit) || !unit) return { key: 'count', factor: 1, unit: '' }
 const countUnit = recipeCountUnitIdentity(raw, lang)
 if (countUnit) return { key: `${lang}:${fold(countUnit)}`, factor: 1, unit: countUnit }
 // Cups/spoons may differ between countries. Combine only the same written measure.
 return { key: unit, factor: 1, unit: raw }
}
export function shoppingRows(state: ShoppingState, lang: MdLanguage): ShoppingRow[] {
 const rows = new Map<string, ShoppingRow & { value: number | null }>()
 for (const source of state.sources) for (const item of source.ingredients) {
  const slug = item.pantryIngredientSlug ?? item.canonicalIngredientSlug
  const identity = slug || `${source.lang}:${fold(item.name)}`
  const unit = unitIdentity(item.unit ?? '', source.lang)
  const quantity = parseQuantity(String(item.amount ?? ''))
  // Free text/ranges are not summed into invented numeric amounts.
  const key = JSON.stringify([identity, unit.key, quantity === null ? String(item.amount ?? '') : 'numeric'])
  const previous = rows.get(key)
  const value = quantity === null ? null : quantity * unit.factor
  if (previous) {
   if (previous.value !== null && value !== null) previous.value += value
   if (slug && !previous.slugs.includes(slug)) previous.slugs.push(slug)
  } else rows.set(key, { key, name: pantryFoodName(item.name, source.lang), amount: String(item.amount ?? ''), unit: unit.unit, text: '', quantity: '', slugs: slug ? [slug] : [], value })
 }
 return [...rows.values()].map(({ value, ...row }) => {
  const amount = value === null ? row.amount : formatQuantity(value, lang)
  // Convert only the displayed SI measure; stable keys and base quantities keep
  // purchased checkmarks and aggregation intact across recipes and reloads.
  const largeUnit = value !== null && value >= 1000 && (row.unit === 'g' || row.unit === 'ml')
  const display = { ...row, amount: largeUnit ? formatQuantity(value / 1000, lang) : amount, unit: largeUnit ? (row.unit === 'g' ? 'kg' : 'L') : row.unit }
  const quantity = ingredientDisplayPrefix(display, lang), text = ingredientDisplayText(display, lang)
  return { ...row, name: text.slice(quantity.length).trim(), amount, quantity, text }
 })
}
export function readPantrySlugs(): Set<string> {
 try { const value = JSON.parse(localStorage.getItem(PANTRY_KEY) ?? '[]'); return new Set(Array.isArray(value) ? value.filter(i => typeof i === 'string') : []) } catch { return new Set() }
}
export function markBought(slugs: string[], bought: boolean): void {
 const pantry = readPantrySlugs()
 for (const slug of slugs) if (bought) pantry.add(slug); else pantry.delete(slug)
 try { localStorage.setItem(PANTRY_KEY, JSON.stringify([...pantry])) } catch {}
 window.dispatchEvent(new Event(PANTRY_EVENT))
}

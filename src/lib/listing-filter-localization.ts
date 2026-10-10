import type { RecipeLanguage } from '@/types/recipe'

/** Stable URL filter values; displayed labels and stored recipe difficulties vary by language. */
export type DifficultyFilter = 'Fácil' | 'Media' | 'Difícil'
const DIFFICULTY_FILTERS: readonly DifficultyFilter[] = ['Fácil', 'Media', 'Difícil']

const DIFFICULTY_LABELS: Record<RecipeLanguage, readonly [string, string, string]> = {
  es: ['Fácil', 'Media', 'Difícil'],
  en: ['Easy', 'Medium', 'Hard'],
  de: ['Einfach', 'Mittel', 'Schwer'],
  fr: ['Facile', 'Moyenne', 'Difficile'],
  it: ['Facile', 'Media', 'Difficile'],
  ja: ['簡単', '普通', '難しい'],
  pt: ['Fácil', 'Média', 'Difícil'],
}

/** Exact values confirmed in published recipes; this is a query adapter, not an editorial mutation. */
const STORED_DIFFICULTIES: Record<RecipeLanguage, Record<DifficultyFilter, readonly string[]>> = {
  es: { 'Fácil': ['Fácil', 'Baja'], 'Media': ['Media', 'Intermedia'], 'Difícil': ['Difícil', 'Alta'] },
  en: { 'Fácil': ['Easy'], 'Media': ['Medium', 'Intermediate'], 'Difícil': ['Hard', 'High'] },
  de: { 'Fácil': ['Einfach'], 'Media': ['Mittel'], 'Difícil': ['Schwer', 'Hoch'] },
  fr: { 'Fácil': ['Facile'], 'Media': ['Moyenne', 'Intermédiaire'], 'Difícil': ['Difficile', 'Élevée'] },
  it: { 'Fácil': ['Facile'], 'Media': ['Media'], 'Difícil': ['Difficile', 'Alta'] },
  ja: { 'Fácil': ['簡単', '初級', 'やさしい'], 'Media': ['普通', '中級', '中程度'], 'Difícil': ['難しい', '高'] },
  pt: { 'Fácil': ['Fácil'], 'Media': ['Média', 'Media', 'Intermédia'], 'Difícil': ['Difícil', 'Alta'] },
}

export function difficultyFilterOptions(lang: RecipeLanguage) {
  return DIFFICULTY_FILTERS.map((value, i) => ({ value, label: DIFFICULTY_LABELS[lang][i] }))
}

export function storedDifficultyValues(lang: RecipeLanguage, selected: string): readonly string[] {
  if (!DIFFICULTY_FILTERS.includes(selected as DifficultyFilter)) return []
  return STORED_DIFFICULTIES[lang][selected as DifficultyFilter]
}

/** Cuisine slugs are stable foreign keys; translate only display labels. */
const CUISINE_LABELS: Record<string, Record<RecipeLanguage, string>> = {
  'cocina-andaluza': { es: 'Cocina andaluza', en: 'Andalusian cuisine', de: 'Andalusische Küche', fr: 'Cuisine andalouse', it: 'Cucina andalusa', ja: 'アンダルシア料理', pt: 'Culinária andaluza' },
  'cocina-colombiana': { es: 'Cocina colombiana', en: 'Colombian cuisine', de: 'Kolumbianische Küche', fr: 'Cuisine colombienne', it: 'Cucina colombiana', ja: 'コロンビア料理', pt: 'Culinária colombiana' },
  'cocina-gallega': { es: 'Cocina gallega', en: 'Galician cuisine', de: 'Galicische Küche', fr: 'Cuisine galicienne', it: 'Cucina galiziana', ja: 'ガリシア料理', pt: 'Culinária galega' },
  'cocina-italiana': { es: 'Cocina italiana', en: 'Italian cuisine', de: 'Italienische Küche', fr: 'Cuisine italienne', it: 'Cucina italiana', ja: 'イタリア料理', pt: 'Culinária italiana' },
  'cocina-japonesa': { es: 'Cocina japonesa', en: 'Japanese cuisine', de: 'Japanische Küche', fr: 'Cuisine japonaise', it: 'Cucina giapponese', ja: '日本料理', pt: 'Culinária japonesa' },
  'cocina-mexicana': { es: 'Cocina mexicana', en: 'Mexican cuisine', de: 'Mexikanische Küche', fr: 'Cuisine mexicaine', it: 'Cucina messicana', ja: 'メキシコ料理', pt: 'Culinária mexicana' },
  'cocina-peruana': { es: 'Cocina peruana', en: 'Peruvian cuisine', de: 'Peruanische Küche', fr: 'Cuisine péruvienne', it: 'Cucina peruviana', ja: 'ペルー料理', pt: 'Culinária peruana' },
}

export function cuisineFilterLabel(lang: RecipeLanguage, slug: string, fallback: string): string {
  return CUISINE_LABELS[slug]?.[lang] ?? fallback
}

const TIME_LABELS: Record<RecipeLanguage, readonly [string, string, string, string, string]> = {
  es: ['Hasta 20 min', '21–40 min', '41–60 min', '61–120 min', 'Más de 120 min'],
  en: ['Up to 20 min', '21–40 min', '41–60 min', '61–120 min', 'Over 120 min'],
  de: ['Bis 20 Min.', '21–40 Min.', '41–60 Min.', '61–120 Min.', 'Über 120 Min.'],
  fr: ['Jusqu’à 20 min', '21–40 min', '41–60 min', '61–120 min', 'Plus de 120 min'],
  it: ['Fino a 20 min', '21–40 min', '41–60 min', '61–120 min', 'Oltre 120 min'],
  ja: ['20分以内', '21～40分', '41～60分', '61～120分', '120分超'],
  pt: ['Até 20 min', '21–40 min', '41–60 min', '61–120 min', 'Mais de 120 min'],
}

export function timeFilterOptions(lang: RecipeLanguage) {
  const values = ['0-20', '21-40', '41-60', '61-120', '121+'] as const
  return values.map((value, i) => ({ value, label: TIME_LABELS[lang][i] }))
}

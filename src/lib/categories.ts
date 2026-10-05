import type { RecipeLanguage } from '@/types/recipe'

// Taxonomía cerrada: nombres traducidos y slugs de navegación comparten una sola fuente.
const CATEGORY_LABELS: Record<string, Record<RecipeLanguage, string>> = {
  'platos-principales': {
    es: 'Platos principales',
    en: 'Main dishes',
    de: 'Hauptgerichte',
    fr: 'Plats principaux',
    it: 'Secondi piatti',
    ja: '主菜',
    pt: 'Pratos principais',
  },
  pastas: {
    es: 'Pastas', en: 'Pasta', de: 'Pasta', fr: 'Pâtes',
    it: 'Pasta', ja: 'パスタ', pt: 'Massas',
  },
  'entrantes-y-aperitivos': {
    es: 'Entrantes y aperitivos',
    en: 'Starters & appetizers',
    de: 'Vorspeisen',
    fr: 'Entrées et apéritifs',
    it: 'Antipasti',
    ja: '前菜・おつまみ',
    pt: 'Entradas e aperitivos',
  },
  'sopas-y-cremas': {
    es: 'Sopas y cremas',
    en: 'Soups & creams',
    de: 'Suppen und Cremesuppen',
    fr: 'Soupes et crèmes',
    it: 'Zuppe e creme',
    ja: 'スープ・ポタージュ',
    pt: 'Sopas e cremes',
  },
  ensaladas: {
    es: 'Ensaladas',
    en: 'Salads',
    de: 'Salate',
    fr: 'Salades',
    it: 'Insalate',
    ja: 'サラダ',
    pt: 'Saladas',
  },
  guarniciones: {
    es: 'Guarniciones',
    en: 'Side dishes',
    de: 'Beilagen',
    fr: 'Accompagnements',
    it: 'Contorni',
    ja: '付け合わせ',
    pt: 'Acompanhamentos',
  },
  'salsas-y-aderezos': {
    es: 'Salsas y aderezos',
    en: 'Sauces & dressings',
    de: 'Saucen und Dressings',
    fr: 'Sauces et vinaigrettes',
    it: 'Salse e condimenti',
    ja: 'ソース・ドレッシング',
    pt: 'Molhos e temperos',
  },
  'panes-y-masas': {
    es: 'Panes y masas',
    en: 'Breads & doughs',
    de: 'Brote und Teige',
    fr: 'Pains et pâtes',
    it: 'Pane e impasti',
    ja: 'パン・生地料理',
    pt: 'Pães e massas',
  },
  postres: {
    es: 'Postres',
    en: 'Desserts',
    de: 'Desserts',
    fr: 'Desserts',
    it: 'Dolci',
    ja: 'デザート',
    pt: 'Sobremesas',
  },
  'desayunos-y-brunch': {
    es: 'Desayunos y brunch',
    en: 'Breakfast & brunch',
    de: 'Frühstück und Brunch',
    fr: 'Petit-déjeuner et brunch',
    it: 'Colazione e brunch',
    ja: '朝食・ブランチ',
    pt: 'Café da manhã e brunch',
  },
  bebidas: {
    es: 'Bebidas',
    en: 'Drinks',
    de: 'Getränke',
    fr: 'Boissons',
    it: 'Bevande',
    ja: '飲み物',
    pt: 'Bebidas',
  },
}

export interface CategoryTaxonomyEntry {
  slug: string
  labels: Record<RecipeLanguage, string>
}

export const CATEGORY_TAXONOMY: CategoryTaxonomyEntry[] = Object.entries(CATEGORY_LABELS).map(([slug, labels]) => ({ slug, labels }))

export const MD_CATEGORIES = CATEGORY_TAXONOMY.map(({ slug, labels }) => ({ slug, label: labels.es }))

/** Etiqueta de una categoría en el idioma dado, a partir de su slug (idioma-neutral). */
export function categoryLabel(lang: RecipeLanguage, slug: string): string | undefined {
  return CATEGORY_LABELS[slug]?.[lang]
}

/** Slug de una categoría a partir de su etiqueta TAL COMO está guardada en `recipes.category`
 *  para ese idioma. Reemplaza la comparación antigua que solo reconocía la etiqueta en español. */
export function categorySlugFromLabel(lang: RecipeLanguage, label: string | null | undefined): string | undefined {
  if (!label) return undefined
  return CATEGORY_TAXONOMY.find((entry) => entry.labels[lang] === label)?.slug
}

/** Devuelve solo etiquetas exactas de la taxonomía aprobada; nunca crea categorías. */
export function canonicalCategoryLabel(lang: RecipeLanguage, label: string | null | undefined): string | undefined {
  const slug = categorySlugFromLabel(lang, label)
  return slug ? categoryLabel(lang, slug) : undefined
}

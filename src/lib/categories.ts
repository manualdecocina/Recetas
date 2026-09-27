import { MD_CATEGORIES } from '@/components/md/md-types'
import type { RecipeLanguage } from '@/types/recipe'

/**
 * El campo `recipes.category` se guarda como texto libre TRADUCIDO en cada idioma
 * (p. ej. "Platos principales" en es, "Hauptgerichte" en de, "主菜" en ja).
 * `MD_CATEGORIES` (en md-types.ts) solo tiene las 10 etiquetas en español.
 * Sin este mapa, cualquier consulta que compare `category` contra esas etiquetas
 * en español (home, /categorias, /categorias/[slug], /recetas, la ficha de receta)
 * nunca encuentra nada para de/en/fr/it/ja/pt: 0 en cada categoría, aunque la
 * receta esté publicada y sí tenga categoría. Este mapa traduce por slug para que
 * la comparación se haga en el idioma correcto.
 *
 * Importante: para que una receta cuente en su categoría, `category` en la base de
 * datos debe coincidir EXACTO (case-sensitive) con la etiqueta de aquí para su
 * idioma. Si en el futuro se escribe la categoría a mano con otra redacción
 * (p. ej. "Platos fuertes" en vez de "Platos principales"), esa receta queda fuera
 * del conteo aunque esté publicada — no es un bug de este mapa, es el motivo por
 * el que `category` como texto libre por idioma es frágil (ver README, "Pendiente
 * de decisión: Modelo de categorías").
 */
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

/** Mismo orden y slugs que MD_CATEGORIES; valida en tiempo de import que no falte ninguno. */
for (const { slug } of MD_CATEGORIES) {
  if (!CATEGORY_LABELS[slug]) throw new Error(`Falta la traducción de categoría para el slug "${slug}"`)
}

export interface CategoryTaxonomyEntry {
  slug: string
  labels: Record<RecipeLanguage, string>
}

export const CATEGORY_TAXONOMY: CategoryTaxonomyEntry[] = MD_CATEGORIES.map(({ slug }) => ({
  slug,
  labels: CATEGORY_LABELS[slug],
}))

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

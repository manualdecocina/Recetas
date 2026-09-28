/** Contrato reproducido del encargo. No reemplazar los tipos internos existentes. */
export type MdLanguage = 'es' | 'en' | 'de' | 'it' | 'fr' | 'ja' | 'pt';

export interface MdIngredient {
  name: string;
  amount: string;
  unit?: string;
  preparation?: string;
  note?: string;
  group?: string;
  canonicalIngredientSlug?: string;
}

export interface MdStep {
  title: string;
  content: string;
  timer_seconds?: number;
  image_url?: string;
  image_alt?: string;
}

export interface MdRecipe {
  id: string;
  language: MdLanguage;
  slug: string;
  public_path: string;
  title: string;
  excerpt: string | null;
  ingredients: MdIngredient[];
  steps: MdStep[];
  category: string | null;
  prep_time_minutes: number | null;
  cook_time_minutes: number | null;
  total_time_minutes?: number | null;
  servings: number | null;
  image_url: string | null;
  difficulty?: string | null;
  cuisine?: string | null;
  content_html?: string | null;
  notes?: string | null;
  summary?: string | null;
  keywords?: string[] | null;
  nutrition?: Record<string, unknown> | null;
  gallery?: Array<Record<string, unknown>> | null;
  video_urls?: string[] | null;
  seo?: Record<string, unknown> | null;
  published_at: string | null;
  updated_at: string;
  /** Votos reales (1-5 cada uno); nunca inventados. Ver RatingWidget y rate_recipe(). */
  rating_count?: number;
  rating_sum?: number;
}

/** Solo estos campos pueden utilizarse para renderizar una tarjeta. */
export type MdRecipeCardData = Pick<
  MdRecipe,
  'id' | 'language' | 'slug' | 'public_path' | 'title' | 'excerpt' | 'category' | 'image_url'
>;

export const MD_CATEGORIES = [
  { label: 'Platos principales', slug: 'platos-principales' },
  { label: 'Entrantes y aperitivos', slug: 'entrantes-y-aperitivos' },
  { label: 'Sopas y cremas', slug: 'sopas-y-cremas' },
  { label: 'Ensaladas', slug: 'ensaladas' },
  { label: 'Guarniciones', slug: 'guarniciones' },
  { label: 'Salsas y aderezos', slug: 'salsas-y-aderezos' },
  { label: 'Panes y masas', slug: 'panes-y-masas' },
  { label: 'Postres', slug: 'postres' },
  { label: 'Desayunos y brunch', slug: 'desayunos-y-brunch' },
  { label: 'Bebidas', slug: 'bebidas' },
] as const;

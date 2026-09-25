export type RecipeLanguage = 'es' | 'de' | 'ja' | 'it' | 'fr' | 'en'

export interface RecipeIngredient {
  name: string
  amount: string
  unit?: string
  preparation?: string
  note?: string
}

export interface RecipeStep {
  title: string
  content: string
  timer_seconds?: number
}

export interface Recipe {
  id: string
  recipe_group_id: string
  language: RecipeLanguage
  slug: string
  public_path: string
  title: string
  excerpt: string | null
  ingredients: RecipeIngredient[]
  steps: RecipeStep[]
  category: string | null
  prep_time_minutes: number | null
  cook_time_minutes: number | null
  servings: number | null
  image_url: string | null
  published: boolean
  published_at: string | null
  created_at: string
  updated_at: string
  content_html?: string | null
  summary?: string | null
  notes?: string | null
  difficulty?: string | null
  course?: string | null
  cuisine?: string | null
  total_time_minutes?: number | null
  keywords?: string[] | null
  nutrition?: Record<string, unknown> | null
  gallery?: Array<Record<string, unknown>> | null
  video_urls?: string[] | null
  seo?: Record<string, unknown> | null
  source_post_id?: number | null
  source_url?: string | null
}

export const SUPPORTED_LANGUAGES: RecipeLanguage[] = ['es', 'de', 'ja', 'it', 'fr', 'en']
export const DEFAULT_LANGUAGE: RecipeLanguage = 'es'

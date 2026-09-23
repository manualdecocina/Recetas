// Refleja exactamente la tabla `recipes` de Supabase (supabase/schema.sql).
// Si cambia el esquema, este archivo debe actualizarse junto con la migración.

export type RecipeLanguage = 'es' | 'de' | 'ja' | 'it' | 'fr' | 'en'

export interface RecipeIngredient {
  name: string
  amount: string
  unit?: string
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
}

export const SUPPORTED_LANGUAGES: RecipeLanguage[] = ['es', 'de', 'ja', 'it', 'fr', 'en']

export const DEFAULT_LANGUAGE: RecipeLanguage = 'es'

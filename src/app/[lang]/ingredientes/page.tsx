import { notFound } from 'next/navigation'
import { IngredientsIndexView } from '@/components/md/IngredientViews'
import { getIngredientSummaries } from '@/lib/md-data'
import { SUPPORTED_LANGUAGES, type RecipeLanguage } from '@/types/recipe'

function parseLang(value: string): RecipeLanguage | null {
  return (SUPPORTED_LANGUAGES as string[]).includes(value) ? value as RecipeLanguage : null
}

// Ingredient discovery is backed by the canonical ingredient model in Supabase.
// Population/alias normalization is intentionally a separate migration phase.
export default async function IngredientsPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang: rawLang } = await params
  const lang = parseLang(rawLang)
  if (!lang || lang !== 'es') notFound()

  const ingredients = await getIngredientSummaries()
  return <IngredientsIndexView ingredients={ingredients} />
}

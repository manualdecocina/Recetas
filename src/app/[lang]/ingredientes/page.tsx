import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { IngredientsIndexView } from '@/components/md/IngredientViews'
import { getIngredientSummaries } from '@/lib/md-data'
import { SUPPORTED_LANGUAGES, type RecipeLanguage } from '@/types/recipe'
import { getMdCopy } from '@/lib/copy'
import { withSiteName, allLanguageAlternates } from '@/lib/seo'

function parseLang(value: string): RecipeLanguage | null {
  return (SUPPORTED_LANGUAGES as string[]).includes(value) ? value as RecipeLanguage : null
}

// Ingredient discovery is backed by the canonical ingredient model in Supabase.
// Population/alias normalization is intentionally a separate migration phase.
export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang: rawLang } = await params
  const lang = parseLang(rawLang)
  if (!lang) return {}
  return {
    title: withSiteName(getMdCopy(lang).ingredientCatalog),
    description: getMdCopy(lang).ingredientCatalogIntro,
    alternates: allLanguageAlternates(`/${lang}/ingredientes`, (l) => `/${l}/ingredientes`),
  }
}

export default async function IngredientsPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang: rawLang } = await params
  const lang = parseLang(rawLang)
  if (!lang) notFound()

  const ingredients = await getIngredientSummaries(undefined, lang)
  return <IngredientsIndexView lang={lang} ingredients={ingredients} />
}

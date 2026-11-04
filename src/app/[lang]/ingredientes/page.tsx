import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { IngredientsIndexView } from '@/components/md/IngredientViews'
import { getIngredientSummaries } from '@/lib/md-data'
import { SUPPORTED_LANGUAGES, type RecipeLanguage } from '@/types/recipe'
import { getMdCopy } from '@/lib/copy'
import { withSiteName, allLanguageAlternates } from '@/lib/seo'
import { publicUrl } from '@/lib/site'
import { firstQueryValue, parseRecipePage } from '@/lib/catalog-pagination'
import { INGREDIENT_PAGE_SIZE, ingredientDirectoryCopy, ingredientDirectoryPath } from '@/lib/ingredient-discovery'

type Props = { params: Promise<{ lang: string }>; searchParams: Promise<{ page?: string | string[] }> }

function parseLang(value: string): RecipeLanguage | null {
  return (SUPPORTED_LANGUAGES as string[]).includes(value) ? value as RecipeLanguage : null
}

function directoryPage(value: string | string[] | undefined): number {
  return firstQueryValue(value) ? parseRecipePage(value) : 0
}

export async function generateMetadata({ params, searchParams }: Props): Promise<Metadata> {
  const lang = parseLang((await params).lang)
  if (!lang) return {}
  const page = directoryPage((await searchParams).page)
  const t = getMdCopy(lang)
  const [,, pageLabel] = ingredientDirectoryCopy[lang]
  return {
    title: withSiteName(page ? `${t.ingredientCatalog} · ${pageLabel} ${page}` : t.ingredientCatalog),
    description: t.ingredientCatalogIntro,
    alternates: page
      ? { canonical: publicUrl(ingredientDirectoryPath(lang, page)) }
      : allLanguageAlternates(ingredientDirectoryPath(lang), language => ingredientDirectoryPath(language)),
  }
}

export default async function IngredientsPage({ params, searchParams }: Props) {
  const lang = parseLang((await params).lang)
  if (!lang) notFound()
  const page = directoryPage((await searchParams).page)
  const ingredients = await getIngredientSummaries(undefined, lang)
  if (page && (page - 1) * INGREDIENT_PAGE_SIZE >= ingredients.length) notFound()
  return <IngredientsIndexView lang={lang} ingredients={ingredients} page={page} />
}

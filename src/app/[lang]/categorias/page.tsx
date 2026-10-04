import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { CategoriesIndexView } from '@/components/md/CategoryViews'
import { getCategorySummaries } from '@/lib/md-data'
import { SUPPORTED_LANGUAGES, type RecipeLanguage } from '@/types/recipe'
import { allLanguageAlternates, withSiteName } from '@/lib/seo'
import { getMdCopy } from '@/lib/copy'

function parseLang(value: string): RecipeLanguage | null {
  return (SUPPORTED_LANGUAGES as string[]).includes(value) ? value as RecipeLanguage : null
}

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang: rawLang } = await params
  const lang = parseLang(rawLang)
  if (!lang) return {}
  const t = getMdCopy(lang)
  return {
    title: withSiteName(t.categoryCatalog),
    description: t.browseCategories,
    alternates: allLanguageAlternates(`/${lang}/categorias`, (l) => `/${l}/categorias`),
  }
}

export default async function CategoriesPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang: rawLang } = await params
  const lang = parseLang(rawLang)
  if (!lang) notFound()

  const categories = await getCategorySummaries(lang)
  return <CategoriesIndexView lang={lang} categories={categories} />
}

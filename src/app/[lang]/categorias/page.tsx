import { notFound } from 'next/navigation'
import { CategoriesIndexView } from '@/components/md/CategoryViews'
import { getCategorySummaries } from '@/lib/md-data'
import { SUPPORTED_LANGUAGES, type RecipeLanguage } from '@/types/recipe'

function parseLang(value: string): RecipeLanguage | null {
  return (SUPPORTED_LANGUAGES as string[]).includes(value) ? value as RecipeLanguage : null
}

export default async function CategoriesPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang: rawLang } = await params
  const lang = parseLang(rawLang)
  if (!lang) notFound()

  const categories = await getCategorySummaries(lang)
  return <CategoriesIndexView lang={lang} categories={categories} />
}

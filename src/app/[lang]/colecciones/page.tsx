import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { CollectionsIndexView } from '@/components/md/CollectionViews'
import { getMdCopy } from '@/lib/copy'
import { COLLECTIONS, collectionsIndexPath } from '@/lib/collections'
import { loadCollectionSummaries } from '@/lib/collections-data'
import { allLanguageAlternates, withSiteName } from '@/lib/seo'
import { SUPPORTED_LANGUAGES, type RecipeLanguage } from '@/types/recipe'

export const revalidate = 3600

function parseLang(value: string): RecipeLanguage | null {
  return (SUPPORTED_LANGUAGES as string[]).includes(value) ? (value as RecipeLanguage) : null
}

export function generateStaticParams() {
  return SUPPORTED_LANGUAGES.map((lang) => ({ lang }))
}

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const lang = parseLang((await params).lang)
  if (!lang) return {}
  const t = getMdCopy(lang)
  return {
    title: withSiteName(t.navCollections),
    description: t.collectionsIndexIntro,
    alternates: allLanguageAlternates(collectionsIndexPath(lang), (l) => collectionsIndexPath(l)),
  }
}

export default async function CollectionsIndexPage({ params }: { params: Promise<{ lang: string }> }) {
  const lang = parseLang((await params).lang)
  if (!lang) notFound()
  const items = await loadCollectionSummaries(COLLECTIONS, lang)
  return <CollectionsIndexView lang={lang} items={items.filter((item) => item.count > 0)} />
}

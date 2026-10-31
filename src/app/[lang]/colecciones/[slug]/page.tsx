import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { CollectionDetailView } from '@/components/md/CollectionViews'
import { COLLECTIONS, collectionCover, collectionPath, findCollection } from '@/lib/collections'
import { loadCollectionRecipes } from '@/lib/collections-data'
import { allLanguageAlternates, withSiteName } from '@/lib/seo'
import { absoluteUrl, publicUrl } from '@/lib/site'
import { recipeImageSrc } from '@/lib/recipe-media'
import { SUPPORTED_LANGUAGES, type RecipeLanguage } from '@/types/recipe'

export const revalidate = 3600

type Params = { lang: string; slug: string }

function parseLang(value: string): RecipeLanguage | null {
  return (SUPPORTED_LANGUAGES as string[]).includes(value) ? (value as RecipeLanguage) : null
}

export function generateStaticParams() {
  return SUPPORTED_LANGUAGES.flatMap((lang) => COLLECTIONS.map((c) => ({ lang, slug: c.text[lang].slug })))
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { lang: rawLang, slug } = await params
  const lang = parseLang(rawLang)
  const collection = lang ? findCollection(lang, slug) : null
  if (!lang || !collection) return {}
  const text = collection.text[lang]
  const wide = collectionCover(collection, 'portada-16x9.webp')
  const first = wide ? null : (await loadCollectionRecipes(collection, lang)).flat().find((r) => r.image_url)
  const images = wide
    ? [
      { url: absoluteUrl(wide), width: 1280, height: 720, alt: text.title },
      { url: absoluteUrl(collectionCover(collection, 'portada-1x1.webp')!), width: 1024, height: 1024, alt: text.title },
    ]
    : first?.image_url ? [{ url: absoluteUrl(recipeImageSrc(first.image_url)), alt: text.title }] : undefined
  return {
    title: withSiteName(text.seoTitle),
    description: text.description,
    alternates: allLanguageAlternates(collectionPath(lang, collection), (l) => collectionPath(l as RecipeLanguage, collection)),
    openGraph: { type: 'website', title: text.seoTitle, description: text.description, url: publicUrl(collectionPath(lang, collection)), images },
    twitter: { card: images ? 'summary_large_image' : 'summary', title: text.seoTitle, description: text.description, images },
  }
}

export default async function CollectionPage({ params }: { params: Promise<Params> }) {
  const { lang: rawLang, slug } = await params
  const lang = parseLang(rawLang)
  const collection = lang ? findCollection(lang, slug) : null
  if (!lang || !collection) notFound()
  const sections = await loadCollectionRecipes(collection, lang)
  return <CollectionDetailView lang={lang} collection={collection} sections={sections} />
}

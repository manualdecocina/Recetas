import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import PantryMatchView from '@/components/md/PantryMatchView'
import SiteHeader from '@/components/md/SiteHeader'
import SiteFooter from '@/components/md/SiteFooter'
import { getPantryMatchData } from '@/lib/md-data'
import { SUPPORTED_LANGUAGES, type RecipeLanguage } from '@/types/recipe'
import { getMdCopy } from '@/lib/copy'
import { withSiteName, SITE_NAME, siteRobots, allLanguageAlternates } from '@/lib/seo'
import { absoluteUrl, publicUrl, languageTag } from '@/lib/site'

function parseLang(value: string): RecipeLanguage | null {
  return (SUPPORTED_LANGUAGES as string[]).includes(value) ? value as RecipeLanguage : null
}

const pantryPath = (lang: string) => `/${lang}/que-puedo-cocinar`
// No existe una imagen social dedicada (1200x630) para la herramienta; se usa el logo
// real de la marca como respaldo en vez de inventar una imagen que no existe.
const FALLBACK_IMAGE = absoluteUrl('/brand/logo-manual-de-cocina.png')

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang: rawLang } = await params
  const lang = parseLang(rawLang)
  if (!lang) return {}
  const t = getMdCopy(lang)
  const title = withSiteName(t.pantryToolHeading)
  const images = [{ url: FALLBACK_IMAGE, alt: SITE_NAME, width: 640, height: 188 }]
  return {
    title,
    description: t.pantryMetaDescription,
    robots: siteRobots(),
    alternates: allLanguageAlternates(pantryPath(lang), pantryPath),
    openGraph: {
      type: 'website',
      title,
      description: t.pantryMetaDescription,
      url: publicUrl(pantryPath(lang)),
      images,
    },
    twitter: {
      card: 'summary',
      title,
      description: t.pantryMetaDescription,
      images,
    },
  }
}

/**
 * Herramienta en los siete idiomas. SiteHeader/SiteFooter
 * se pintan aquí (servidor); PantryMatchView es cliente solo para la parte interactiva
 * (elegir ingredientes). Nunca renderizar SiteHeader dentro de un componente 'use client'.
 */
export default async function PantryMatchPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang: rawLang } = await params
  const lang = parseLang(rawLang)
  if (!lang) notFound()

  const t = getMdCopy(lang)
  const { ingredients, recipes } = await getPantryMatchData(lang)
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: t.pantryToolHeading,
    description: t.pantryMetaDescription,
    url: publicUrl(pantryPath(lang)),
    applicationCategory: 'LifestyleApplication',
    operatingSystem: 'Any',
    inLanguage: languageTag(lang),
    isAccessibleForFree: true,
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
  }
  return (
    <div className="md-site" lang={languageTag(lang)}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <SiteHeader lang={lang} alternates={Object.fromEntries(SUPPORTED_LANGUAGES.map((l) => [l, pantryPath(l)]))} />
      <PantryMatchView lang={lang} ingredients={ingredients} recipes={recipes} />
      <SiteFooter lang={lang} />
    </div>
  )
}

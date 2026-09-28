import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import PantryMatchView from '@/components/md/PantryMatchView'
import SiteHeader from '@/components/md/SiteHeader'
import SiteFooter from '@/components/md/SiteFooter'
import { getPantryMatchData } from '@/lib/md-data'
import { SUPPORTED_LANGUAGES, type RecipeLanguage } from '@/types/recipe'
import { getMdCopy } from '@/lib/copy'
import { withSiteName, SITE_NAME } from '@/lib/seo'
import { absoluteUrl, publicUrl } from '@/lib/site'

function parseLang(value: string): RecipeLanguage | null {
  return (SUPPORTED_LANGUAGES as string[]).includes(value) ? value as RecipeLanguage : null
}

const PANTRY_PATH = '/es/que-puedo-cocinar'
// No existe una imagen social dedicada (1200x630) para la herramienta; se usa el logo
// real de la marca como respaldo en vez de inventar una imagen que no existe.
const FALLBACK_IMAGE = absoluteUrl('/brand/logo-manual-de-cocina.png')

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang: rawLang } = await params
  const lang = parseLang(rawLang)
  if (!lang || lang !== 'es') return {}
  const t = getMdCopy('es')
  const title = withSiteName(t.pantryToolHeading)
  const images = [{ url: FALLBACK_IMAGE, alt: SITE_NAME, width: 640, height: 188 }]
  return {
    title,
    description: t.pantryMetaDescription,
    robots: { index: true, follow: true },
    alternates: { canonical: publicUrl(PANTRY_PATH) },
    openGraph: {
      type: 'website',
      title,
      description: t.pantryMetaDescription,
      url: publicUrl(PANTRY_PATH),
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
 * Herramienta solo en español por ahora, igual que /es/ingredientes. SiteHeader/SiteFooter
 * se pintan aquí (servidor); PantryMatchView es cliente solo para la parte interactiva
 * (elegir ingredientes). Nunca renderizar SiteHeader dentro de un componente 'use client'.
 */
export default async function PantryMatchPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang: rawLang } = await params
  const lang = parseLang(rawLang)
  if (!lang || lang !== 'es') notFound()

  const t = getMdCopy('es')
  const { ingredients, recipes } = await getPantryMatchData()
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: t.pantryToolHeading,
    description: t.pantryMetaDescription,
    url: publicUrl(PANTRY_PATH),
    applicationCategory: 'LifestyleApplication',
    operatingSystem: 'Any (navegador web)',
    inLanguage: 'es',
    isAccessibleForFree: true,
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
  }
  return (
    <div className="md-site" lang="es">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <SiteHeader lang="es" />
      <PantryMatchView ingredients={ingredients} recipes={recipes} />
      <SiteFooter lang="es" />
    </div>
  )
}

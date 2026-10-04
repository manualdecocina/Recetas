import type { Metadata } from 'next'
import HomePageView from '@/components/md/HomePageView'
import { getHomeData } from '@/lib/md-data'
import { UI_TEXT } from '@/lib/i18n'
import { allLanguageAlternates, SITE_NAME } from '@/lib/seo'
import { SUPPORTED_LANGUAGES, type RecipeLanguage } from '@/types/recipe'
import { legacyMetadata, LegacyPublicPage } from '@/lib/legacy-route'
import { absoluteUrl, getSiteUrl } from '@/lib/site'

// Sin foto propia de portada para el home; se usa el logo real de la marca como
// respaldo en vez de inventar una imagen que no existe.
const HOME_FALLBACK_IMAGE = absoluteUrl('/brand/logo-manual-de-cocina.png')

export const revalidate = 3600

function parseLang(value: string): RecipeLanguage | null {
  return (SUPPORTED_LANGUAGES as string[]).includes(value) ? (value as RecipeLanguage) : null
}

export async function generateStaticParams() {
  return SUPPORTED_LANGUAGES.map((lang) => ({ lang }))
}

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang: rawLang } = await params
  const lang = parseLang(rawLang)
  // Un solo segmento que no es idioma: URL histórica en la raíz (p. ej. /receta-bondiola-de-cerdo).
  if (!lang) return legacyMetadata('/' + rawLang)
  const text = UI_TEXT[lang]
  const url = `${getSiteUrl()}/${lang}`
  const images = [{ url: HOME_FALLBACK_IMAGE, alt: SITE_NAME, width: 640, height: 188 }]
  return {
    title: text.homeTitle,
    description: text.homeDescription,
    alternates: allLanguageAlternates('/' + lang, (l) => '/' + l),
    openGraph: {
      type: 'website',
      title: text.homeTitle,
      description: text.homeDescription,
      url,
      images,
    },
    twitter: {
      card: 'summary',
      title: text.homeTitle,
      description: text.homeDescription,
      images,
    },
  }
}

export default async function LanguageHome({ params }: { params: Promise<{ lang: string }> }) {
  const { lang: rawLang } = await params
  const lang = parseLang(rawLang)
  if (!lang) return <LegacyPublicPage path={'/' + rawLang} />

  const data = await getHomeData(lang)
  const siteUrl = getSiteUrl()
  const graph = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        '@id': `${siteUrl}/#organization`,
        name: SITE_NAME,
        url: siteUrl,
        logo: {
          '@type': 'ImageObject',
          url: absoluteUrl('/brand/logo-manual-de-cocina.png'),
        },
      },
      {
        '@type': 'WebSite',
        '@id': `${siteUrl}/#website`,
        name: SITE_NAME,
        url: siteUrl,
        inLanguage: SUPPORTED_LANGUAGES,
        publisher: { '@id': `${siteUrl}/#organization` },
      },
    ],
  }
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(graph).replace(/</g, '\\u003c') }} />
      <HomePageView lang={lang} data={data} />
    </>
  )
}

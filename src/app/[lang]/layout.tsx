import type { Metadata } from 'next'
import '../public-base.css'
import '../site.css'
import { editorialSerif, uiSans } from '../fonts'
import ThemeSync from '@/components/md/ThemeSync'
import AdSenseLoader from '@/components/md/AdSenseLoader'
import { getSiteUrl, isIndexingAllowed, adsenseClientId, adsenseCmpReady, absoluteUrl } from '@/lib/site'
import { DEFAULT_LANGUAGE, SUPPORTED_LANGUAGES } from '@/types/recipe'

// Layout RAÍZ del sitio público (patrón i18n oficial de Next.js App Router).
// Cada idioma produce su propio <html lang>: /es → lang="es", /de → lang="de", etc.
// El panel /admin tiene su propio layout raíz (src/app/admin/layout.tsx).
//
// TODO(diseño): tipografía e identidad visual — fuera del alcance de esta fase.

// Seguro anti-duplicado: sin NEXT_PUBLIC_ALLOW_INDEXING="true" todo el sitio es noindex.
const allowIndexing = isIndexingAllowed()

export const metadata: Metadata = {
  metadataBase: new URL(getSiteUrl()),
  title: 'Manual de Cocina',
  robots: {
    index: allowIndexing,
    follow: allowIndexing,
    googleBot: allowIndexing ? {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1,
    } : {
      index: false,
      follow: false,
    },
  },
}

export function generateStaticParams() {
  return SUPPORTED_LANGUAGES.map((lang) => ({ lang }))
}

export const dynamicParams = true

export default async function LanguageRootLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ lang: string }>
}) {
  // Un segmento desconocido (/xx/...) no es un idioma: las páginas responden 404 y el
  // documento usa el idioma por defecto en lugar de un lang inválido.
  const { lang: rawLang } = await params
  const lang = (SUPPORTED_LANGUAGES as string[]).includes(rawLang) ? rawLang : DEFAULT_LANGUAGE
  const adsenseClient = adsenseClientId()
  const cmpReady = adsenseCmpReady()
  const siteUrl = getSiteUrl()
  const entityGraph = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        '@id': `${siteUrl}/#organization`,
        name: 'Manual de Cocina',
        url: siteUrl,
        logo: {
          '@type': 'ImageObject',
          url: absoluteUrl('/brand/logo-manual-de-cocina.png'),
        },
      },
      {
        '@type': 'WebSite',
        '@id': `${siteUrl}/#website`,
        name: 'Manual de Cocina',
        url: siteUrl,
        inLanguage: SUPPORTED_LANGUAGES,
        publisher: { '@id': `${siteUrl}/#organization` },
      },
    ],
  }

  return (
    <html lang={lang} className={`${editorialSerif.variable} ${uiSans.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: "try{var t=localStorage.getItem('md-theme');if(t==='dark'||t==='light')document.documentElement.dataset.theme=t}catch(e){}" }} />
      </head>
      {/* AdSense queda desactivado por defecto. Además del client ID, producción debe declarar
          NEXT_PUBLIC_GOOGLE_CMP_READY="true" solo después de configurar una CMP certificada/TCF.
          La CMP certificada es la única fuente de verdad para consentimiento publicitario. */}
      <body>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(entityGraph).replace(/</g, '\\u003c') }} />
        <ThemeSync />
        {children}
        {adsenseClient && cmpReady && <AdSenseLoader clientId={adsenseClient} cmpReady />}
      </body>
    </html>
  )
}

import type { Metadata } from 'next'
import '../globals.css'
import '../editorial.css'
import '../site.css'
import { editorialSerif, uiSans } from '../fonts'
import ThemeSync from '@/components/md/ThemeSync'
import { getSiteUrl, isIndexingAllowed, adsenseClientId } from '@/lib/site'
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
  robots: { index: allowIndexing, follow: allowIndexing },
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

  return (
    <html lang={lang} className={`${editorialSerif.variable} ${uiSans.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: "try{var t=localStorage.getItem('md-theme');if(t==='dark'||t==='light')document.documentElement.dataset.theme=t}catch(e){}" }} />
        {/* Google AdSense: el dominio ya está aprobado por Google (pub-2592990699767586); no hay
            aprobación pendiente. Sin NEXT_PUBLIC_ADSENSE_CLIENT_ID (preview y entornos de prueba)
            no se imprime nada. En cuanto se configure esa variable en el entorno de producción de
            Hostinger y se despliegue, este script empieza a servir anuncios sin tocar código. */}
        {adsenseClient && (
          <script
            async
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adsenseClient}`}
            crossOrigin="anonymous"
          />
        )}
      </head>
      <body><ThemeSync />{children}</body>
    </html>
  )
}

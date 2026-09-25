import type { Metadata } from 'next'
import { getSiteUrl, isIndexingAllowed } from '@/lib/site'
import { DEFAULT_LANGUAGE, SUPPORTED_LANGUAGES } from '@/types/recipe'
import { SiteFooter } from '@/components/SiteFooter'

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

  return (
    <html lang={lang}>
      <body>{children}<SiteFooter lang={lang} /></body>
    </html>
  )
}

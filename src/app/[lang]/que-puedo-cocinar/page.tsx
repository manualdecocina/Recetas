import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import PantryMatchView from '@/components/md/PantryMatchView'
import SiteHeader from '@/components/md/SiteHeader'
import SiteFooter from '@/components/md/SiteFooter'
import { getPantryMatchData } from '@/lib/md-data'
import { SUPPORTED_LANGUAGES, type RecipeLanguage } from '@/types/recipe'
import { getMdCopy } from '@/lib/copy'

function parseLang(value: string): RecipeLanguage | null {
  return (SUPPORTED_LANGUAGES as string[]).includes(value) ? value as RecipeLanguage : null
}

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang: rawLang } = await params
  const lang = parseLang(rawLang)
  if (!lang || lang !== 'es') return {}
  const t = getMdCopy('es')
  return {
    title: t.pantryToolHeading,
    description: t.pantryMetaDescription,
    robots: { index: true, follow: true },
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

  const { ingredients, recipes } = await getPantryMatchData()
  return (
    <div className="md-site" lang="es">
      <SiteHeader lang="es" />
      <PantryMatchView ingredients={ingredients} recipes={recipes} />
      <SiteFooter lang="es" />
    </div>
  )
}

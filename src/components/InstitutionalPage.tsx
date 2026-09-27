import type { ReactNode } from 'react'
import SiteHeader from '@/components/md/SiteHeader'
import SiteFooter from '@/components/md/SiteFooter'
import { SUPPORTED_LANGUAGES, type RecipeLanguage } from '@/types/recipe'

// Misma API que antes (lang, eyebrow, title, intro, children): las 8 páginas institucionales
// y las páginas de contenido heredadas siguen usándola sin cambios. `eyebrow` ahora es opcional.
// `slug` es el segmento de ruta fijo de la página, igual en los 7 idiomas (p. ej. "aviso-legal").
// Con él, el selector de idioma se queda en la misma página al cambiar de idioma en vez de caer
// al inicio. Si se omite (páginas de contenido heredadas sin slug fijo por idioma), el selector
// conserva el comportamiento anterior: cae al inicio del idioma elegido.
export function InstitutionalPage({ lang, slug, eyebrow, title, intro, children }: {
  lang: string
  slug?: string
  eyebrow?: string
  title: string
  intro?: string
  children: ReactNode
}) {
  const language: RecipeLanguage = (SUPPORTED_LANGUAGES as string[]).includes(lang) ? (lang as RecipeLanguage) : 'es'
  const alternates = slug
    ? (Object.fromEntries(SUPPORTED_LANGUAGES.map((l) => [l, `/${l}/${slug}`])) as Partial<Record<RecipeLanguage, string>>)
    : undefined
  return (
    <div className="md-site" lang={language}>
      <SiteHeader lang={language} alternates={alternates} />
      <main className="md-reading md-institutional" id="md-main">
        {eyebrow && <p className="md-eyebrow">{eyebrow}</p>}
        <h1 className="md-display">{title}</h1>
        {intro && <p className="md-lead">{intro}</p>}
        <div className="md-institutional-content">{children}</div>
      </main>
      <SiteFooter lang={language} />
    </div>
  )
}

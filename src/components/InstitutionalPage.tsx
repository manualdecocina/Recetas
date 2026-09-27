import type { ReactNode } from 'react'
import SiteHeader from '@/components/md/SiteHeader'
import SiteFooter from '@/components/md/SiteFooter'
import { SUPPORTED_LANGUAGES, type RecipeLanguage } from '@/types/recipe'

// Misma API que antes (lang, eyebrow, title, intro, children): las 8 páginas institucionales
// y las páginas de contenido heredadas siguen usándola sin cambios. `eyebrow` ahora es opcional.
export function InstitutionalPage({ lang, eyebrow, title, intro, children }: {
  lang: string
  eyebrow?: string
  title: string
  intro?: string
  children: ReactNode
}) {
  const language: RecipeLanguage = (SUPPORTED_LANGUAGES as string[]).includes(lang) ? (lang as RecipeLanguage) : 'es'
  return (
    <div className="md-site" lang={language}>
      <SiteHeader lang={language} />
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

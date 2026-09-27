import { InstitutionalPage } from '@/components/InstitutionalPage'
import type { LegalPageContent } from '@/lib/legal-content'

/** Vista compartida para las páginas legales/institucionales simples: reutiliza InstitutionalPage
 * (cabecera, pie y el `slug` que arma el selector de idioma) y pinta las secciones traducidas. */
export function LegalPageView({ lang, slug, content }: { lang: string; slug: string; content: LegalPageContent }) {
  return (
    <InstitutionalPage lang={lang} slug={slug} eyebrow={content.eyebrow} title={content.title} intro={content.intro}>
      {content.sections.map((section, index) => (
        <div key={index}>
          {section.heading && <h2>{section.heading}</h2>}
          <div dangerouslySetInnerHTML={{ __html: section.html }} />
        </div>
      ))}
    </InstitutionalPage>
  )
}

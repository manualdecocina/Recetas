import { SiteHeader } from '@/components/SiteHeader'

export function InstitutionalPage({ lang, eyebrow, title, intro, children }: { lang: string; eyebrow: string; title: string; intro?: string; children: React.ReactNode }) {
  return <>
    <SiteHeader lang={lang} />
    <main className="institutional">
      <header className="institutional__hero"><p className="eyebrow">{eyebrow}</p><h1>{title}</h1>{intro && <p>{intro}</p>}</header>
      <article className="institutional__body">{children}</article>
    </main>
  </>
}

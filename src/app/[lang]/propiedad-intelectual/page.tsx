import type { Metadata } from 'next'
import { LegalPageView } from '@/components/LegalPageView'
import { resolveLegalLanguage } from '@/lib/legal-content'
import { allLanguageAlternates } from '@/lib/seo'
import { PROPIEDAD_INTELECTUAL_CONTENT } from './content'

const SLUG = 'propiedad-intelectual'

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params
  const t = PROPIEDAD_INTELECTUAL_CONTENT[resolveLegalLanguage(lang)]
  return {
    title: t.metaTitle,
    description: t.metaDescription,
    alternates: allLanguageAlternates(`/${lang}/${SLUG}`, (language) => `/${language}/${SLUG}`),
  }
}

export default async function Page({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params
  return <LegalPageView lang={lang} slug={SLUG} content={PROPIEDAD_INTELECTUAL_CONTENT[resolveLegalLanguage(lang)]} />
}

import type { Metadata } from 'next'
import { LegalPageView } from '@/components/LegalPageView'
import { resolveLegalLanguage } from '@/lib/legal-content'
import { allLanguageAlternates } from '@/lib/seo'
import { PRIVACIDAD_CONTENT } from './content'

const SLUG = 'privacidad'

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params
  const t = PRIVACIDAD_CONTENT[resolveLegalLanguage(lang)]
  return {
    title: t.metaTitle,
    description: t.metaDescription,
    alternates: allLanguageAlternates(`/${lang}/${SLUG}`, (language) => `/${language}/${SLUG}`),
  }
}

export default async function Page({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params
  return <LegalPageView lang={lang} slug={SLUG} content={PRIVACIDAD_CONTENT[resolveLegalLanguage(lang)]} />
}

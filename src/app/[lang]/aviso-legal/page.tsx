import type { Metadata } from 'next'
import { LegalPageView } from '@/components/LegalPageView'
import { resolveLegalLanguage } from '@/lib/legal-content'
import { getSiteUrl, normalizePublicPath } from '@/lib/site'
import { AVISO_LEGAL_CONTENT } from './content'

const SLUG = 'aviso-legal'

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params
  const t = AVISO_LEGAL_CONTENT[resolveLegalLanguage(lang)]
  return {
    title: t.metaTitle,
    description: t.metaDescription,
    alternates: { canonical: `${getSiteUrl()}${normalizePublicPath(`/${lang}/${SLUG}`)}` },
  }
}

export default async function Page({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params
  return <LegalPageView lang={lang} slug={SLUG} content={AVISO_LEGAL_CONTENT[resolveLegalLanguage(lang)]} />
}

import type { Metadata } from 'next'
import HomePageView from '@/components/md/HomePageView'
import { getHomeData } from '@/lib/md-data'
import { UI_TEXT } from '@/lib/i18n'
import { allLanguageAlternates } from '@/lib/seo'
import { SUPPORTED_LANGUAGES, type RecipeLanguage } from '@/types/recipe'
import { legacyMetadata, LegacyPublicPage } from '@/lib/legacy-route'

export const revalidate = 3600

function parseLang(value: string): RecipeLanguage | null {
  return (SUPPORTED_LANGUAGES as string[]).includes(value) ? (value as RecipeLanguage) : null
}

export async function generateStaticParams() {
  return SUPPORTED_LANGUAGES.map((lang) => ({ lang }))
}

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang: rawLang } = await params
  const lang = parseLang(rawLang)
  // Un solo segmento que no es idioma: URL histórica en la raíz (p. ej. /receta-bondiola-de-cerdo).
  if (!lang) return legacyMetadata('/' + rawLang)
  const text = UI_TEXT[lang]
  return {
    title: text.homeTitle,
    description: text.homeDescription,
    alternates: allLanguageAlternates('/' + lang, (l) => '/' + l),
  }
}

export default async function LanguageHome({ params }: { params: Promise<{ lang: string }> }) {
  const { lang: rawLang } = await params
  const lang = parseLang(rawLang)
  if (!lang) return <LegacyPublicPage path={'/' + rawLang} />

  const data = await getHomeData(lang)
  return <HomePageView lang={lang} data={data} />
}

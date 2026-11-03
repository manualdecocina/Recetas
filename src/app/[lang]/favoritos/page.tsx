import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import SiteHeader from '@/components/md/SiteHeader';
import SiteFooter from '@/components/md/SiteFooter';
import FavoritesCollection from '@/components/md/FavoritesCollection';
import { SUPPORTED_LANGUAGES } from '@/types/recipe';
import type { MdLanguage } from '@/components/md/md-types';
import { favoritesCopy } from '@/lib/favorites-copy';
import { withSiteName } from '@/lib/seo';
type Props = { params: Promise<{ lang: string }> };
function language(raw: string): MdLanguage { if (!(SUPPORTED_LANGUAGES as string[]).includes(raw)) notFound(); return raw as MdLanguage; }
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const lang = language((await params).lang);
  return { title: withSiteName(favoritesCopy[lang].title), description: favoritesCopy[lang].intro, robots: { index: false, follow: true } };
}
export default async function FavoritesPage({ params }: Props) {
  const lang = language((await params).lang), t = favoritesCopy[lang];
  const alternates = Object.fromEntries(SUPPORTED_LANGUAGES.map(l => [l, `/${l}/favoritos`]));
  return <div className="md-site"><SiteHeader lang={lang} alternates={alternates} /><main className="md-container" id="md-main"><header className="md-page-head"><h1 className="md-display">{t.title}</h1><p className="md-page-intro">{t.intro}</p></header><FavoritesCollection lang={lang} /></main><SiteFooter lang={lang} /></div>;
}

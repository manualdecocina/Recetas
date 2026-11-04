import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { SUPPORTED_LANGUAGES } from '@/types/recipe';
import type { MdLanguage } from '@/components/md/md-types';
import SiteHeader from '@/components/md/SiteHeader';
import SiteFooter from '@/components/md/SiteFooter';
import ShoppingList from '@/components/md/ShoppingList';
import { kitchenCopy } from '@/lib/kitchen-copy';
type Props = { params: Promise<{ lang: string }> };
function language(raw: string): MdLanguage { if (!(SUPPORTED_LANGUAGES as string[]).includes(raw)) notFound(); return raw as MdLanguage; }
export async function generateMetadata({ params }: Props): Promise<Metadata> {
 const t = kitchenCopy(language((await params).lang));
 return { title: `${t.shopping} | Manual de Cocina`, description: t.local };
}
export default async function ShoppingPage({ params }: Props) {
 const lang = language((await params).lang), t = kitchenCopy(lang);
 const alternates = Object.fromEntries(SUPPORTED_LANGUAGES.map(l => [l, `/${l}/lista-de-compra`]));
 return <div className="md-site"><SiteHeader lang={lang} alternates={alternates} /><main className="md-container" id="md-main"><header className="md-page-head"><h1 className="md-display">{t.shopping}</h1></header><ShoppingList lang={lang} /></main><SiteFooter lang={lang} /></div>;
}

import type { MdLanguage } from './md-types';
import { getAvailableLanguages } from '@/lib/md-data';
import SiteHeaderView from './SiteHeaderView';

/** Servidor: consulta qué idiomas tienen recetas publicadas y pinta la cabecera. */
export default async function SiteHeader({ lang, alternates }: { lang: MdLanguage; alternates?: Partial<Record<MdLanguage, string>> }) {
  const available = await getAvailableLanguages();
  return <SiteHeaderView lang={lang} alternates={alternates} available={available} />;
}

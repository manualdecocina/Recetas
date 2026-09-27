import Link from 'next/link';
import type { MdLanguage } from './md-types';
import { getMdCopy } from '@/lib/copy';
import LanguageSwitcher from './LanguageSwitcher';

/** Vista síncrona (usable también desde componentes cliente). <details> da un menú móvil accesible por teclado. */
export default function SiteHeaderView({ lang, alternates, available }: { lang: MdLanguage; alternates?: Partial<Record<MdLanguage, string>>; available: MdLanguage[] }) {
  const t = getMdCopy(lang);
  const base = `/${lang}`;
  const nav = [
    { href: `${base}/recetas`, label: t.navRecipes },
    { href: `${base}/categorias`, label: t.navCategories },
    ...(lang === 'es' ? [{ href: `${base}/ingredientes`, label: t.navIngredients }] : []),
  ];

  return (
    <>
      <Link className="md-skip" href="#md-main">{t.skipToContent}</Link>
      <header className="md-header">
        <div className="md-container md-header-inner">
          <Link className="md-brand" href={base} aria-label="Manual de Cocina">
            <img className="md-brand-image" src="/brand/logo-manual-de-cocina.png" alt="Manual de Cocina" width="640" height="188" />
          </Link>
          <nav className="md-header-nav" aria-label={t.navRecipes}>
            {nav.map((item) => <Link key={item.href} href={item.href}>{item.label}</Link>)}
          </nav>
          <div className="md-header-actions">
            <form className="md-header-search" action={`${base}/recetas`} method="get" role="search">
              <label className="md-search-label md-sr-only" htmlFor="md-header-query">{t.searchLabel}</label>
              <input className="md-search-input" id="md-header-query" type="search" name="q" placeholder={t.searchPlaceholder} />
              <button className="md-search-submit" type="submit">{t.searchButton}</button>
            </form>
            <LanguageSwitcher lang={lang} alternates={alternates} available={available} />
            <details className="md-menu">
              <summary className="md-menu-toggle">{t.openMenu}</summary>
              <div className="md-menu-panel">
                <nav className="md-stack" aria-label={t.openMenu}>
                  {nav.map((item) => <Link key={item.href} href={item.href}>{item.label}</Link>)}
                </nav>
                <form action={`${base}/recetas`} method="get" role="search">
                  <label className="md-search-label" htmlFor="md-mobile-query">{t.searchLabel}</label>
                  <input className="md-search-input" id="md-mobile-query" type="search" name="q" placeholder={t.searchPlaceholder} />
                  <button className="md-button" type="submit">{t.searchButton}</button>
                </form>
              </div>
            </details>
          </div>
        </div>
      </header>
    </>
  );
}

import Link from 'next/link';
import Image from 'next/image';
import type { MdLanguage } from './md-types';
import { getMdCopy } from '@/lib/copy';
import LanguageSwitcher from './LanguageSwitcher';
import ThemeToggle from './ThemeToggle';

/** Vista síncrona (usable también desde componentes cliente). <details> da un menú móvil accesible por teclado. */
export default function SiteHeaderView({ lang, alternates, available }: { lang: MdLanguage; alternates?: Partial<Record<MdLanguage, string>>; available: MdLanguage[] }) {
  const t = getMdCopy(lang);
  const base = `/${lang}`;
  const nav = [
    { href: `${base}/recetas`, label: t.navRecipes },
    ...(lang === 'es' ? [{ href: `${base}/que-puedo-cocinar`, label: t.navPantryTool }] : []),
    { href: `${base}/categorias`, label: t.navCategories },
    ...(lang === 'es' ? [{ href: `${base}/ingredientes`, label: t.navIngredients }] : []),
  ];

  return (
    <>
      <Link className="md-skip" href="#md-main">{t.skipToContent}</Link>
      <header className="md-header">
        <div className="md-container md-header-inner">
          <Link className="md-brand" href={base} aria-label="Manual de Cocina">
            <Image className="md-brand-image" src="/brand/logo-manual-de-cocina.png" alt="Manual de Cocina" width={214} height={63} sizes="214px" quality={65} />
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
            <ThemeToggle lang={lang} />
            <details className="md-menu" {...{ name: 'md-header-popover' }}>
              <summary className="md-menu-toggle">
                <svg className="md-menu-icon" viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" aria-hidden="true"><path d="M4 7h16M4 12h16M4 17h16" /></svg>
                <span className="md-sr-only">{t.openMenu}</span>
              </summary>
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

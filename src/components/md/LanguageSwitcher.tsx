import Link from 'next/link';
import type { MdLanguage } from './md-types';
import Flag from './Flag';
import { languageTag } from '@/lib/site';

const LANGUAGES: Array<{ code: MdLanguage; label: string }> = [
  { code: 'es', label: 'Español' },
  { code: 'en', label: 'English' },
  { code: 'de', label: 'Deutsch' },
  { code: 'it', label: 'Italiano' },
  { code: 'fr', label: 'Français' },
  { code: 'ja', label: '日本語' },
  { code: 'pt', label: 'Português (Brasil)' },
];

/**
 * Selector de idioma. `alternates` trae la URL de esta misma página en otros idiomas (recetas con
 * traducción publicada). Si no hay traducción de la página, lleva a la portada de ese idioma solo
 * cuando ese idioma tiene contenido publicado; si no, se muestra deshabilitado.
 */
export default function LanguageSwitcher({ lang, alternates = {}, available }: {
  lang: MdLanguage;
  alternates?: Partial<Record<MdLanguage, string>>;
  available: MdLanguage[];
}) {
  const current = LANGUAGES.find((item) => item.code === lang) ?? LANGUAGES[0];
  return (
    <details className="md-lang" {...{ name: 'md-header-popover' }}>
      <summary className="md-lang-toggle" aria-label="Idioma / Language">
        <Flag code={current.code} /><span className="md-lang-label">{current.label}</span>
      </summary>
      <ul className="md-lang-panel">
        {LANGUAGES.map((item) => {
          const href = item.code === lang ? null : alternates[item.code] ?? (available.includes(item.code) ? `/${item.code}` : null);
          if (item.code === lang) return <li key={item.code}><span className="md-lang-item is-current" aria-current="true"><Flag code={item.code} />{item.label}</span></li>;
          if (!href) return <li key={item.code}><span className="md-lang-item is-off" aria-disabled="true"><Flag code={item.code} />{item.label}</span></li>;
          return <li key={item.code}><Link className="md-lang-item" href={href} hrefLang={languageTag(item.code)} lang={languageTag(item.code)}><Flag code={item.code} />{item.label}</Link></li>;
        })}
      </ul>
    </details>
  );
}

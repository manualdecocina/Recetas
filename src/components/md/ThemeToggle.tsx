'use client';
import type { MdLanguage } from './md-types';
import { getMdCopy } from '@/lib/copy';

/** Alterna tema claro/oscuro. El tema inicial lo fija un script en <head> (sin parpadeo). */
export default function ThemeToggle({ lang }: { lang: MdLanguage }) {
  const label = getMdCopy(lang).toggleTheme;
  function toggle() {
    const root = document.documentElement;
    const next = root.dataset.theme === 'dark' ? 'light' : 'dark';
    root.dataset.theme = next;
    try { localStorage.setItem('md-theme', next); } catch { /* sin almacenamiento: el cambio dura hasta recargar */ }
  }
  return (
    <button type="button" className="md-theme-toggle" onClick={toggle} aria-label={label} title={label}>
      <svg className="md-icon-sun" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" aria-hidden="true"><circle cx="12" cy="12" r="4.2"/><path d="M12 2.5v2.4M12 19.1v2.4M2.5 12h2.4M19.1 12h2.4M5.3 5.3l1.7 1.7M17 17l1.7 1.7M5.3 18.7L7 17M17 7l1.7-1.7"/></svg>
      <svg className="md-icon-moon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M20 14.5A8.5 8.5 0 0 1 9.5 4a8.5 8.5 0 1 0 10.5 10.5z"/></svg>
    </button>
  );
}

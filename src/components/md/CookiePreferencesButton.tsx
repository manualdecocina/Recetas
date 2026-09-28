'use client';
import type { MdLanguage } from './md-types';
import { getMdCopy } from '@/lib/copy';

/** Reabre el banner de cookies para cambiar la decisión ya tomada. */
export default function CookiePreferencesButton({ lang }: { lang: MdLanguage }) {
  const t = getMdCopy(lang);
  return (
    <button type="button" className="md-footer-cookie-btn"
      onClick={() => window.dispatchEvent(new CustomEvent('manualdecocina:open-cookie-preferences'))}>
      {t.cookiePreferencesLink}
    </button>
  );
}

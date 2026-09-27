'use client';
import type { MdLanguage } from './md-types';
import { getMdCopy } from '@/lib/copy';

export default function SharePrintActions({ title, lang }: { title: string; lang: MdLanguage }) {
  const t = getMdCopy(lang);
  async function share() {
    const url = window.location.href;
    try {
      if (navigator.share) await navigator.share({ title, url });
      else if (navigator.clipboard?.writeText) await navigator.clipboard.writeText(url);
      else window.prompt(url, url);
    } catch { /* User cancellation and unavailable share services are not errors. */ }
  }
  return (
    <>
      <button type="button" className="md-button-quiet" onClick={() => { void share(); }}>{t.share}</button>
      <button type="button" className="md-button-quiet" onClick={() => window.print()}>{t.print}</button>
    </>
  );
}

'use client';
import { useEffect, useState } from 'react';
import type { MdLanguage } from './md-types';
import { getMdCopy } from '@/lib/copy';
import { prepareRecipePrint, PRINT_ROOT_ID } from '@/lib/recipe-print';

export default function SharePrintActions({ title, lang }: { title: string; lang: MdLanguage }) {
  const t = getMdCopy(lang);
  const [printing, setPrinting] = useState(false);
  useEffect(() => {
    const prepare = () => { prepareRecipePrint(document); };
    const cleanup = () => { document.getElementById(PRINT_ROOT_ID)?.remove(); setPrinting(false); };
    window.addEventListener('beforeprint', prepare);
    window.addEventListener('afterprint', cleanup);
    return () => {
      window.removeEventListener('beforeprint', prepare);
      window.removeEventListener('afterprint', cleanup);
      document.getElementById(PRINT_ROOT_ID)?.remove();
    };
  }, []);
  async function print() {
    if (printing) return;
    setPrinting(true);
    try {
      document.getElementById(PRINT_ROOT_ID)?.remove();
      const sheet = prepareRecipePrint(document);
      // Cover and logo are already used on the page; still wait for their decoded
      // print copies so the PDF does not reserve space for an unloaded image.
      await Promise.all(Array.from(sheet?.querySelectorAll('img') ?? []).map(async image => {
        try { await image.decode(); } catch { image.remove(); }
      }));
      window.print();
    } catch {
      document.getElementById(PRINT_ROOT_ID)?.remove();
      setPrinting(false);
    }
  }
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
      <button type="button" className="md-button-quiet" disabled={printing} aria-busy={printing} onClick={() => { void print(); }}>{t.print}</button>
    </>
  );
}

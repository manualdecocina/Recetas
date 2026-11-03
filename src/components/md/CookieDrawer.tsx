'use client';
import { useEffect, useState } from 'react';
import type { MdLanguage } from './md-types';
import { consentCopy } from '@/lib/consent-copy';
import { CONSENT_OPEN } from '@/lib/consent';
type Fc = { callbackQueue?: { push: (callback: Record<string, () => void>) => unknown }; showRevocationMessage?: () => void };

/** The published Google CMP is the ONLY consent dialog. Do not cover it with
 * an informational banner or invent local acceptance/refusal signals. */
export default function CookieDrawer({ lang }: { lang: MdLanguage }) {
  const [unavailable, setUnavailable] = useState(false);
  const t = consentCopy[lang];
  useEffect(() => {
    const w = window as Window & { googlefc?: Fc };
    let active = true;
    let request = 0;
    let timer: ReturnType<typeof setTimeout> | undefined;
    const open = () => {
      const currentRequest = ++request;
      setUnavailable(false);
      if (timer) clearTimeout(timer);
      const fc = w.googlefc ?? (w.googlefc = {});
      timer = setTimeout(() => { if (active && currentRequest === request) setUnavailable(true); }, 15000);
      (fc.callbackQueue ??= [] as Array<Record<string, () => void>>).push({ CONSENT_API_READY: () => {
        if (!active || currentRequest !== request) return;
        if (timer) clearTimeout(timer);
        const current = w.googlefc;
        if (typeof current?.showRevocationMessage !== 'function') { setUnavailable(true); return; }
        try { current.showRevocationMessage(); setUnavailable(false); }
        catch { setUnavailable(true); }
      } });
    };
    window.addEventListener(CONSENT_OPEN, open);
    return () => { active = false; if (timer) clearTimeout(timer); window.removeEventListener(CONSENT_OPEN, open); };
  }, []);
  if (!unavailable) return null;
  return <section className="md-cookie-drawer" data-open="true" role="status" aria-label={t.title}>
    <p>{t.storageError} <a href={`/${lang}/cookies`}>{t.policy}</a>.</p>
    <button className="md-button-secondary" type="button" onClick={() => window.dispatchEvent(new Event(CONSENT_OPEN))}>{t.google}</button>
  </section>;
}

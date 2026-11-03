'use client';
import { useEffect, useState } from 'react';
import type { MdLanguage } from './md-types';
import { consentCopy } from '@/lib/consent-copy';
import { CONSENT_OPEN } from '@/lib/consent';
type Fc = { callbackQueue?: { push: (callback: Record<string, () => void>) => unknown }; showRevocationMessage?: () => void };
type TcData = { gdprApplies?: boolean; listenerId?: number };
type TcfApi = (command: string, version: number, callback: (data: TcData | undefined, success: boolean) => void, parameter?: number) => void;
const closeLabels = { es: 'Cerrar', en: 'Close', de: 'Schließen', fr: 'Fermer', it: 'Chiudi', ja: '閉じる', pt: 'Fechar' };

/** The published Google CMP is the ONLY consent dialog. Do not cover it with
 * an informational banner or invent local acceptance/refusal signals. */
export default function CookieDrawer({ lang }: { lang: MdLanguage }) {
  const [unavailable, setUnavailable] = useState(false);
  const t = consentCopy[lang];
  useEffect(() => {
    const w = window as Window & { googlefc?: Fc; __tcfapi?: TcfApi };
    let active = true;
    let request = 0;
    let timer: ReturnType<typeof setTimeout> | undefined;
    let listenerId: number | undefined;
    const removeListener = () => {
      if (listenerId === undefined) return;
      try { w.__tcfapi?.('removeEventListener', 2, () => {}, listenerId); } catch { /* API unloaded. */ }
      listenerId = undefined;
    };
    const open = () => {
      const currentRequest = ++request;
      setUnavailable(false);
      if (timer) clearTimeout(timer);
      removeListener();
      const fc = w.googlefc ?? (w.googlefc = {});
      timer = setTimeout(() => {
        if (!active || currentRequest !== request) return;
        ++request;
        removeListener();
        setUnavailable(true);
      }, 15000);
      (fc.callbackQueue ??= [] as Array<Record<string, () => void>>).push({ CONSENT_API_READY: () => {
        if (!active || currentRequest !== request) return;
        if (typeof w.__tcfapi !== 'function') return;
        try {
          w.__tcfapi('addEventListener', 2, (data, success) => {
            if (!active || currentRequest !== request) return;
            listenerId = data?.listenerId;
            if (!success || data?.gdprApplies === undefined) return;
            if (timer) clearTimeout(timer);
            ++request;
            removeListener();
            if (!data.gdprApplies) { setUnavailable(false); return; }
            const current = w.googlefc;
            if (typeof current?.showRevocationMessage !== 'function') { setUnavailable(true); return; }
            try { current.showRevocationMessage(); setUnavailable(false); }
            catch { setUnavailable(true); }
          });
        } catch { if (timer) clearTimeout(timer); ++request; setUnavailable(true); }
      } });
    };
    window.addEventListener(CONSENT_OPEN, open);
    const dismiss = () => { ++request; if (timer) clearTimeout(timer); removeListener(); setUnavailable(false); };
    window.addEventListener('manualdecocina:privacy-dismiss', dismiss);
    return () => { active = false; if (timer) clearTimeout(timer); removeListener(); window.removeEventListener(CONSENT_OPEN, open); window.removeEventListener('manualdecocina:privacy-dismiss', dismiss); };
  }, []);
  if (!unavailable) return null;
  return <section className="md-cookie-drawer" data-open="true" role="status" aria-label={t.title}>
    <p>{t.storageError} <a href={`/${lang}/cookies`}>{t.policy}</a>.</p>
    <button className="md-button-secondary" type="button" onClick={() => window.dispatchEvent(new Event('manualdecocina:privacy-dismiss'))}>{closeLabels[lang]}</button>
  </section>;
}

'use client';
import { useEffect, useState } from 'react';
import type { MdLanguage } from './md-types';
import { consentCopy } from '@/lib/consent-copy';
import { CONSENT_OPEN } from '@/lib/consent';
type TcData = { gdprApplies?: boolean; listenerId?: number };
type TcfApi = (command: string, version: number, callback: (data: TcData | undefined, success: boolean) => void, parameter?: number) => void;

/** Google determines applicability. Never offer a dead European revocation link
 * before its API is ready, outside its region, or when the integration is blocked. */
export default function ConsentPreferences({ lang }: { lang: MdLanguage }) {
  const [available, setAvailable] = useState(false);
  useEffect(() => {
    const w = window as Window & {
      googlefc?: { callbackQueue?: { push: (entry: Record<string, () => void>) => unknown }; showRevocationMessage?: () => void };
      __tcfapi?: TcfApi;
    };
    let active = true;
    let listenerId: number | undefined;
    const fc = w.googlefc ?? (w.googlefc = {});
    (fc.callbackQueue ??= [] as Array<Record<string, () => void>>).push({ CONSENT_API_READY: () => {
      if (!active || typeof w.__tcfapi !== 'function') return;
      try {
        w.__tcfapi('addEventListener', 2, (data, success) => {
          if (!active) return;
          listenerId = data?.listenerId;
          setAvailable(success && data?.gdprApplies === true && typeof w.googlefc?.showRevocationMessage === 'function');
        });
      } catch { setAvailable(false); }
    } });
    return () => {
      active = false;
      if (listenerId !== undefined) {
        try { w.__tcfapi?.('removeEventListener', 2, () => {}, listenerId); } catch { /* API already unloaded. */ }
      }
    };
  }, []);
  if (!available) return null;
  return <div className="md-consent-preferences"><button type="button" className="md-footer-cookie-btn" aria-haspopup="dialog"
    onClick={() => window.dispatchEvent(new Event(CONSENT_OPEN))}>{consentCopy[lang].preferences}</button></div>;
}

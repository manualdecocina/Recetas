'use client';

import { useEffect, useRef, useState } from 'react';
import type { MdLanguage } from './md-types';

const copy: Record<MdLanguage, { label: string; opening: string; unavailable: string }> = {
  es: { label: 'Preferencias de cookies', opening: 'Abriendo preferencias…', unavailable: 'No se pudieron abrir las preferencias. Consulta la política de cookies o inténtalo de nuevo.' },
  en: { label: 'Cookie preferences', opening: 'Opening preferences…', unavailable: 'Preferences could not be opened. Read the cookie policy or try again.' },
  de: { label: 'Cookie-Einstellungen', opening: 'Einstellungen werden geöffnet…', unavailable: 'Die Einstellungen konnten nicht geöffnet werden. Lies die Cookie-Richtlinie oder versuche es erneut.' },
  it: { label: 'Preferenze cookie', opening: 'Apertura delle preferenze…', unavailable: 'Impossibile aprire le preferenze. Consulta la politica sui cookie o riprova.' },
  fr: { label: 'Préférences de cookies', opening: 'Ouverture des préférences…', unavailable: 'Impossible d’ouvrir les préférences. Consultez la politique de cookies ou réessayez.' },
  ja: { label: 'Cookie設定', opening: '設定を開いています…', unavailable: '設定を開けませんでした。Cookieポリシーを確認するか、もう一度お試しください。' },
  pt: { label: 'Preferências de cookies', opening: 'Abrindo preferências…', unavailable: 'Não foi possível abrir as preferências. Consulte a política de cookies ou tente novamente.' },
};

type GoogleFc = {
  callbackQueue?: { push: (callback: Record<string, () => void>) => unknown };
  showRevocationMessage?: () => void;
};

/** Reopens Google's certified CMP; never records an advertising decision itself. */
export default function ConsentPreferences({ lang }: { lang: MdLanguage }) {
  const t = copy[lang];
  const [status, setStatus] = useState<'idle' | 'opening' | 'unavailable'>('idle');
  const request = useRef(0);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => () => {
    request.current += 1;
    if (timer.current) clearTimeout(timer.current);
  }, []);

  function openPreferences() {
    if (status === 'opening') return;
    const current = ++request.current;
    setStatus('opening');
    const consentWindow = window as Window & { googlefc?: GoogleFc };
    const googlefc = consentWindow.googlefc ?? (consentWindow.googlefc = {});
    const queue = googlefc.callbackQueue ?? (googlefc.callbackQueue = [] as Array<Record<string, () => void>>);
    timer.current = setTimeout(() => {
      request.current += 1; // Do not open a late dialog after reporting failure.
      setStatus('unavailable');
    }, 8000);
    queue.push({
      CONSENT_API_READY: () => {
        if (request.current !== current) return;
        if (timer.current) clearTimeout(timer.current);
        try {
          if (!consentWindow.googlefc?.showRevocationMessage) {
            setStatus('unavailable');
            return;
          }
          consentWindow.googlefc.showRevocationMessage();
          setStatus('idle');
        } catch {
          setStatus('unavailable');
        }
      },
    });
  }

  return (
    <div className="md-consent-preferences">
      <button type="button" className="md-footer-cookie-btn" onClick={openPreferences} disabled={status === 'opening'}>
        {t.label}
      </button>
      {status !== 'idle' && <p role="status">{status === 'opening' ? t.opening : t.unavailable}</p>}
    </div>
  );
}

'use client';

import { useEffect, useState } from 'react';
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
  const [ready, setReady] = useState(false);
  const [unavailable, setUnavailable] = useState(false);

  useEffect(() => {
    // Google recommends exposing the revocation control only after its consent
    // API is ready. A missing CMP must not leave a dead button in the footer.
    let mounted = true;
    const consentWindow = window as Window & { googlefc?: GoogleFc };
    const googlefc = consentWindow.googlefc ?? (consentWindow.googlefc = {});
    const queue = googlefc.callbackQueue ?? (googlefc.callbackQueue = [] as Array<Record<string, () => void>>);
    queue.push({
      CONSENT_API_READY: () => {
        if (mounted) setReady(typeof consentWindow.googlefc?.showRevocationMessage === 'function');
      },
    });
    return () => { mounted = false; };
  }, []);

  function openPreferences() {
    try {
      const consentWindow = window as Window & { googlefc?: GoogleFc };
      if (!consentWindow.googlefc?.showRevocationMessage) {
        setUnavailable(true);
        return;
      }
      consentWindow.googlefc.showRevocationMessage();
      setUnavailable(false);
    } catch {
      setUnavailable(true);
    }
  }

  if (!ready) return null;

  return (
    <div className="md-consent-preferences">
      <button type="button" className="md-footer-cookie-btn" onClick={openPreferences}>
        {t.label}
      </button>
      {unavailable && <p role="status">{t.unavailable}</p>}
    </div>
  );
}

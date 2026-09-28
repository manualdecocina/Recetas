'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import type { MdLanguage } from './md-types';
import { getMdCopy } from '@/lib/copy';

const CONSENT_KEY = 'manualdecocina:cookie-consent';

type ConsentStatus = 'accepted' | 'rejected';

/** Lee la decisión guardada; null si el visitante todavía no ha elegido. */
function readConsent(): ConsentStatus | null {
  try {
    const raw = localStorage.getItem(CONSENT_KEY);
    if (!raw) return null;
    const parsed: unknown = JSON.parse(raw);
    const status = (parsed as { status?: unknown })?.status;
    return status === 'accepted' || status === 'rejected' ? status : null;
  } catch { return null; }
}

function writeConsent(status: ConsentStatus) {
  try {
    localStorage.setItem(CONSENT_KEY, JSON.stringify({ status, ts: Date.now() }));
  } catch { /* Almacenamiento restringido: el banner volverá a aparecer en la próxima visita. */ }
  window.dispatchEvent(new CustomEvent('manualdecocina:cookie-consent-changed', { detail: { status } }));
}

/**
 * Banner de consentimiento de cookies. No carga AdSense por sí mismo: solo guarda la
 * decisión y avisa mediante un evento; quien realmente carga el script es AdSenseLoader,
 * que escucha ese mismo evento. Se puede reabrir desde el pie de página (evento
 * "manualdecocina:open-cookie-preferences"), por ejemplo para cambiar de opinión.
 */
export default function CookieConsentBanner({ lang }: { lang: MdLanguage }) {
  const t = getMdCopy(lang);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(readConsent() === null);
    function onReopen() { setVisible(true); }
    window.addEventListener('manualdecocina:open-cookie-preferences', onReopen);
    return () => window.removeEventListener('manualdecocina:open-cookie-preferences', onReopen);
  }, []);

  if (!visible) return null;

  function choose(status: ConsentStatus) {
    writeConsent(status);
    setVisible(false);
  }

  return (
    <div className="md-cookie-banner" role="dialog" aria-live="polite" aria-label={t.cookiePreferencesLink}>
      <div className="md-cookie-banner-card">
        <p className="md-cookie-banner-text">
          {t.cookieBannerText}{' '}
          <Link href={`/${lang}/cookies`}>{t.cookieBannerLearnMore}</Link>
        </p>
        <div className="md-cookie-banner-actions">
          <button type="button" className="md-button-secondary" onClick={() => choose('rejected')}>
            {t.cookieBannerReject}
          </button>
          <button type="button" className="md-button" onClick={() => choose('accepted')}>
            {t.cookieBannerAccept}
          </button>
        </div>
      </div>
    </div>
  );
}

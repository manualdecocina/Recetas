'use client';
import { useEffect } from 'react';

const CONSENT_KEY = 'manualdecocina:cookie-consent';
const SCRIPT_ID = 'md-adsense-script';

function hasAcceptedConsent(): boolean {
  try {
    const raw = localStorage.getItem(CONSENT_KEY);
    if (!raw) return false;
    const parsed: unknown = JSON.parse(raw);
    return (parsed as { status?: unknown })?.status === 'accepted';
  } catch { return false; }
}

function loadAdsense(clientId: string) {
  if (document.getElementById(SCRIPT_ID)) return;
  const script = document.createElement('script');
  script.id = SCRIPT_ID;
  script.async = true;
  script.crossOrigin = 'anonymous';
  script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${clientId}`;
  document.head.appendChild(script);
}

/**
 * Carga el script de Google AdSense solo si el visitante ya aceptó el banner de cookies
 * (ver CookieConsentBanner). Sin NEXT_PUBLIC_ADSENSE_CLIENT_ID (preview y entornos de
 * prueba) este componente no hace nada, igual que antes. Si el visitante rechaza o no ha
 * decidido, el script nunca se inserta.
 */
export default function AdSenseLoader({ clientId }: { clientId?: string }) {
  useEffect(() => {
    if (!clientId) return;
    const id = clientId;
    if (hasAcceptedConsent()) loadAdsense(id);
    function onConsentChange(event: Event) {
      const detail = (event as CustomEvent<{ status?: string }>).detail;
      if (detail?.status === 'accepted') loadAdsense(id);
    }
    window.addEventListener('manualdecocina:cookie-consent-changed', onConsentChange);
    return () => window.removeEventListener('manualdecocina:cookie-consent-changed', onConsentChange);
  }, [clientId]);

  return null;
}

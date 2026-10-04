'use client';
import { useEffect } from 'react';

const CONSENT_KEY = 'manualdecocina:cookie-consent';
const SCRIPT_ID = 'md-adsense-script';

type ConsentStatus = 'personalized' | 'basic';

function readConsent(): ConsentStatus | null {
  try {
    const raw = localStorage.getItem(CONSENT_KEY);
    if (!raw) return null;
    const parsed: unknown = JSON.parse(raw);
    const status = (parsed as { status?: unknown })?.status;
    return status === 'personalized' || status === 'basic' ? status : null;
  } catch { return null; }
}

declare global {
  interface Window {
    adsbygoogle?: unknown[] & { requestNonPersonalizedAds?: number };
  }
}

/**
 * Carga Google AdSense según lo que la persona eligió en el banner de cookies:
 * - "personalized": anuncios normales, personalización con Google incluida.
 * - "basic": mismos anuncios, pero con requestNonPersonalizedAds=1 (Restricted Data
 *   Processing de Google) — sin personalizar según su navegación. Nunca "sin anuncios":
 *   quitarle los anuncios a quien elige "básico" no da ningún motivo para elegir el otro
 *   botón, así que ambas opciones muestran anuncios y solo cambia cuánto se usa su dato.
 * Sin decisión guardada, no se carga nada. Sin NEXT_PUBLIC_ADSENSE_CLIENT_ID (preview y
 * entornos de prueba) este componente no hace nada, igual que antes.
 */
function loadAdsense(clientId: string, status: ConsentStatus) {
  if (document.getElementById(SCRIPT_ID)) return;
  window.adsbygoogle = window.adsbygoogle || [];
  if (status === 'basic') window.adsbygoogle.requestNonPersonalizedAds = 1;
  const script = document.createElement('script');
  script.id = SCRIPT_ID;
  script.async = true;
  script.crossOrigin = 'anonymous';
  script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${clientId}`;
  document.head.appendChild(script);
}

export default function AdSenseLoader({ clientId, cmpReady }: { clientId?: string; cmpReady: boolean }) {
  useEffect(() => {
    if (!clientId || !cmpReady) return;
    const id = clientId;
    const current = readConsent();
    if (current) loadAdsense(id, current);
    function onConsentChange(event: Event) {
      const detail = (event as CustomEvent<{ status?: string }>).detail;
      if (detail?.status === 'personalized' || detail?.status === 'basic') {
        loadAdsense(id, detail.status);
      }
    }
    window.addEventListener('manualdecocina:cookie-consent-changed', onConsentChange);
    return () => window.removeEventListener('manualdecocina:cookie-consent-changed', onConsentChange);
  }, [clientId, cmpReady]);

  return null;
}

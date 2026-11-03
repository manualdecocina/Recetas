'use client';
import { useEffect } from 'react';
import { CONSENT_CHANGED, readPrivacyChoice } from '@/lib/consent';

const SCRIPT_ID = 'md-adsense-script';

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
 * AdSense solo se carga cuando:
 * 1) existe publisher/client id;
 * 2) NEXT_PUBLIC_GOOGLE_CMP_READY=true.
 *
 * Esa bandera significa que producción ya tiene configurada una CMP certificada por Google
 * e integrada con IAB TCF. Este componente NO inventa ni duplica consentimiento: la CMP
 * certificada es la única fuente de verdad para EEA/UK/CH.
 */
export default function AdSenseLoader({ clientId, cmpReady }: { clientId?: string; cmpReady: boolean }) {
  useEffect(() => {
    if (!clientId || !cmpReady) return;
    const sync = () => {
      if (readPrivacyChoice()?.advertising) loadAdsense(clientId);
      // Loaded third-party code cannot be unloaded safely: a fresh document
      // removes it, and the saved refusal prevents it loading again.
      else if (document.getElementById(SCRIPT_ID)) window.location.reload();
    };
    sync();
    window.addEventListener(CONSENT_CHANGED, sync);
    window.addEventListener('storage', sync);
    return () => { window.removeEventListener(CONSENT_CHANGED, sync); window.removeEventListener('storage', sync); };
  }, [clientId, cmpReady]);

  return null;
}

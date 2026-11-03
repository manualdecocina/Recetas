'use client';
import { useEffect } from 'react';
const SCRIPT_ID = 'md-adsense-script';

/** The certified Google CMP owns consent and TCF signals. Loading the integration
 * is not accepting personalization. Google selects the permitted serving mode,
 * including limited ads when eligible; a local notice must not override it. */
export default function AdSenseLoader({ clientId, cmpReady }: { clientId?: string; cmpReady: boolean }) {
  useEffect(() => {
    if (!clientId || !cmpReady || document.getElementById(SCRIPT_ID)) return;
    const script = document.createElement('script');
    script.id = SCRIPT_ID;
    script.async = true;
    script.crossOrigin = 'anonymous';
    script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${clientId}`;
    document.head.appendChild(script);
  }, [clientId, cmpReady]);
  return null;
}

'use client';
import type { MdLanguage } from './md-types';
import { consentCopy } from '@/lib/consent-copy';
import { CONSENT_OPEN } from '@/lib/consent';
/** Always available, including regions where Google's own message is not shown. */
export default function ConsentPreferences({ lang }: { lang: MdLanguage }) {
  return <div className="md-consent-preferences"><button type="button" className="md-footer-cookie-btn"
    onClick={() => window.dispatchEvent(new Event(CONSENT_OPEN))}>{consentCopy[lang].preferences}</button></div>;
}

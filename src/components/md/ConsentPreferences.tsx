'use client';
import type { MdLanguage } from './md-types';
import { consentCopy } from '@/lib/consent-copy';
import { CONSENT_OPEN } from '@/lib/consent';
/** Reopen the certified Google CMP; never a second consent system. */
export default function ConsentPreferences({ lang }: { lang: MdLanguage }) {
  return <div className="md-consent-preferences"><button type="button" className="md-footer-cookie-btn" aria-haspopup="dialog"
    onClick={() => window.dispatchEvent(new Event(CONSENT_OPEN))}>{consentCopy[lang].preferences}</button></div>;
}

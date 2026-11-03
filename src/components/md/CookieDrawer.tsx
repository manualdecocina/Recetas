'use client';
import { useEffect, useRef, useState } from 'react';
import type { MdLanguage } from './md-types';
import { consentCopy } from '@/lib/consent-copy';
import { CONSENT_KEY, CONSENT_CHANGED, CONSENT_OPEN, readPrivacyChoice } from '@/lib/consent';
type Fc = { callbackQueue?: Array<Record<string, () => void>>; showRevocationMessage?: () => void };

/** Informational notice. Google collects, stores and applies advertising choices. */
export default function CookieDrawer({ lang }: { lang: MdLanguage }) {
  const t = consentCopy[lang];
  const [visible, setVisible] = useState(true);
  const [settings, setSettings] = useState(false);
  const [googleReady, setGoogleReady] = useState(false);
  const [error, setError] = useState(false);
  const heading = useRef<HTMLHeadingElement>(null);
  const opener = useRef<HTMLElement | null>(null);
  useEffect(() => {
    setVisible(!readPrivacyChoice());
    const open = () => { opener.current = document.activeElement as HTMLElement; setSettings(true); setVisible(true); };
    const sync = () => { const choice = readPrivacyChoice(); document.documentElement.dataset.mdPrivacy = choice ? 'known' : 'unknown'; setVisible(!choice); };
    window.addEventListener(CONSENT_OPEN, open);
    window.addEventListener('storage', sync);
    const w = window as Window & { googlefc?: Fc };
    const fc = w.googlefc ?? (w.googlefc = {});
    let mounted = true;
    const ready = () => { if (mounted) setGoogleReady(typeof w.googlefc?.showRevocationMessage === 'function'); };
    ready();
    (fc.callbackQueue ??= []).push({ CONSENT_API_READY: ready });
    return () => { mounted = false; window.removeEventListener(CONSENT_OPEN, open); window.removeEventListener('storage', sync); };
  }, []);
  useEffect(() => { if (visible && settings) heading.current?.focus(); }, [visible, settings]);
  function acknowledge() {
    try {
      localStorage.setItem(CONSENT_KEY, JSON.stringify({ version: 2, acknowledged: true, savedAt: Date.now() }));
      document.documentElement.dataset.mdPrivacy = 'known';
      window.dispatchEvent(new Event(CONSENT_CHANGED));
    } catch { /* Dismissal still works when the browser blocks local storage. */ }
    setVisible(false);
    opener.current?.focus();
  }
  function googleOptions() {
    const fc = (window as Window & { googlefc?: Fc }).googlefc;
    if (typeof fc?.showRevocationMessage === 'function') {
      setVisible(false);
      fc.showRevocationMessage();
    } else { setSettings(true); setError(true); }
  }
  if (!visible) return null;
  return <section className="md-cookie-drawer" data-open={settings ? 'true' : undefined} aria-labelledby="md-cookie-title" aria-describedby="md-cookie-description" role="region">
    <h2 id="md-cookie-title" ref={heading} tabIndex={-1}>{t.title}</h2>
    <p id="md-cookie-description">{t.body} <a href={`/${lang}/cookies`}>{t.policy}</a>.</p>
    {settings && <div className="md-cookie-settings"><p>{t.detail}</p></div>}
    <div className="md-cookie-actions">
      <button className="md-button-secondary" type="button" onClick={() => setSettings(!settings)}>{t.configure}</button>
      {googleReady && <button className="md-button-secondary" type="button" onClick={googleOptions}>{t.google}</button>}
      <button className="md-button-secondary" type="button" onClick={acknowledge}>{t.continue}</button>
    </div>
    {error && <p role="status">{t.storageError}</p>}
  </section>;
}

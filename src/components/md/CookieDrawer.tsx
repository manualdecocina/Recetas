'use client';
import { useEffect, useRef, useState } from 'react';
import type { MdLanguage } from './md-types';
import { consentCopy } from '@/lib/consent-copy';
import { CONSENT_KEY, CONSENT_CHANGED, CONSENT_OPEN, readPrivacyChoice } from '@/lib/consent';
type Fc = { callbackQueue?: Array<Record<string, () => void>>; showRevocationMessage?: () => void };

/** Global first-visit control. It gates loading; it does not create a Google/TCF consent string. */
export default function CookieDrawer({ lang }: { lang: MdLanguage }) {
  const t = consentCopy[lang];
  const [visible, setVisible] = useState(true);
  const [settings, setSettings] = useState(false);
  const [advertising, setAdvertising] = useState(false);
  const [googleReady, setGoogleReady] = useState(false);
  const [error, setError] = useState(false);
  const heading = useRef<HTMLHeadingElement>(null);
  const opener = useRef<HTMLElement | null>(null);
  useEffect(() => {
    const choice = readPrivacyChoice();
    setAdvertising(choice?.advertising ?? false);
    setVisible(!choice);
    const open = () => {
      opener.current = document.activeElement as HTMLElement;
      setAdvertising(readPrivacyChoice()?.advertising ?? false);
      setSettings(true); setVisible(true);
    };
    const sync = () => { const choice = readPrivacyChoice(); document.documentElement.dataset.mdPrivacy = choice ? 'known' : 'unknown'; setAdvertising(choice?.advertising ?? false); setVisible(!choice); };
    window.addEventListener(CONSENT_OPEN, open);
    window.addEventListener('storage', sync);
    const w = window as Window & { googlefc?: Fc };
    const fc = w.googlefc ?? (w.googlefc = {});
    let mounted = true;
    (fc.callbackQueue ??= []).push({ CONSENT_API_READY: () => { if (mounted) setGoogleReady(typeof w.googlefc?.showRevocationMessage === 'function'); } });
    return () => { mounted = false; window.removeEventListener(CONSENT_OPEN, open); window.removeEventListener('storage', sync); };
  }, []);
  useEffect(() => { if (visible && settings) heading.current?.focus(); }, [visible, settings]);
  function choose(allow: boolean) {
    try {
      localStorage.setItem(CONSENT_KEY, JSON.stringify({ version: 1, advertising: allow, savedAt: Date.now() }));
      setError(false);
      setVisible(false);
      opener.current?.focus();
      window.dispatchEvent(new Event(CONSENT_CHANGED));
    } catch { setError(true); }
  }
  function googleOptions() {
    const fc = (window as Window & { googlefc?: Fc }).googlefc;
    fc?.callbackQueue?.push({ CONSENT_API_READY: () => fc.showRevocationMessage?.() });
  }
  if (!visible) return null;
  return <section className="md-cookie-drawer" data-open={settings ? 'true' : undefined} aria-labelledby="md-cookie-title" aria-describedby="md-cookie-description" role="region">
    <h2 id="md-cookie-title" ref={heading} tabIndex={-1}>{t.title}</h2>
    <p id="md-cookie-description">{t.body} <a href={`/${lang}/cookies`}>{t.policy}</a>.</p>
    {settings && <div className="md-cookie-settings"><label><input type="checkbox" checked={advertising} onChange={e => setAdvertising(e.target.checked)} /> {t.advertising}</label><p>{t.detail}</p></div>}
    <div className="md-cookie-actions">
      <button className="md-button-secondary" type="button" onClick={() => choose(false)}>{t.reject}</button>
      {settings ? <button className="md-button-secondary" type="button" onClick={() => choose(advertising)}>{t.save}</button> : <button className="md-button-secondary" type="button" onClick={() => setSettings(true)}>{t.configure}</button>}
      <button className="md-button-secondary" type="button" onClick={() => choose(true)}>{t.accept}</button>
      {googleReady && <button className="md-button-quiet" type="button" onClick={googleOptions}>{t.google}</button>}
    </div>
    {error && <p role="status">{t.storageError} <button type="button" onClick={() => { setVisible(false); opener.current?.focus(); }}>{t.continue}</button></p>}
  </section>;
}

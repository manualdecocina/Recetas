export const CONSENT_KEY = 'manualdecocina:privacy:v1';
export const CONSENT_CHANGED = 'manualdecocina:privacy-changed';
export const CONSENT_OPEN = 'manualdecocina:privacy-open';
export const CONSENT_MAX_AGE = 180 * 24 * 60 * 60 * 1000;
export type PrivacyChoice = { version: 1; advertising: boolean; savedAt: number };
export function parsePrivacyChoice(raw: string | null, now = Date.now()): PrivacyChoice | null {
  try {
    const v = JSON.parse(raw ?? 'null');
    return v?.version === 1 && typeof v.advertising === 'boolean' && typeof v.savedAt === 'number'
      && v.savedAt <= now && now - v.savedAt < CONSENT_MAX_AGE ? v : null;
  } catch { return null; }
}
export function readPrivacyChoice(): PrivacyChoice | null {
  try { return parsePrivacyChoice(localStorage.getItem(CONSENT_KEY)); } catch { return null; }
}

/** Runs in <head> before paint: hide the SSR drawer only for a valid saved choice.
 * Advertising remains gated separately by readPrivacyChoice and the certified CMP. */
export const PRIVACY_BOOTSTRAP = `try{var p=JSON.parse(localStorage.getItem('${CONSENT_KEY}')||'null');if(p&&p.version===1&&typeof p.advertising==='boolean'&&typeof p.savedAt==='number'&&p.savedAt<=Date.now()&&Date.now()-p.savedAt<${CONSENT_MAX_AGE})document.documentElement.dataset.mdPrivacy='known'}catch(e){}`;

'use client';
import { useEffect, useState } from 'react';
import type { MdLanguage } from './md-types';
import { getMdCopy } from '@/lib/copy';

const KEY = 'manualdecocina:favorites';
/**
 * Adapter assumption: favorites are stored as a string[] of recipe IDs.
 * Claude must inspect the production value shape before replacing existing logic.
 * If the value is not a string[], this component will not overwrite it.
 */
export default function FavoriteButton({ recipeId, lang }: { recipeId: string; lang: MdLanguage }) {
  const t = getMdCopy(lang);
  const [saved, setSaved] = useState(false);
  const [compatible, setCompatible] = useState(true);
  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      const parsed: unknown = raw ? JSON.parse(raw) : [];
      if (!Array.isArray(parsed) || !parsed.every((v) => typeof v === 'string')) {
        setCompatible(false);
        return;
      }
      setSaved(parsed.includes(recipeId));
    } catch { setCompatible(false); }
  }, [recipeId]);
  function toggle() {
    if (!compatible) return;
    try {
      const raw = localStorage.getItem(KEY);
      const parsed: unknown = raw ? JSON.parse(raw) : [];
      if (!Array.isArray(parsed) || !parsed.every((v) => typeof v === 'string')) return;
      const next = parsed.includes(recipeId) ? parsed.filter((v) => v !== recipeId) : [...parsed, recipeId];
      localStorage.setItem(KEY, JSON.stringify(next));
      setSaved(next.includes(recipeId));
      window.dispatchEvent(new CustomEvent('manualdecocina:favorites-changed'));
    } catch { /* Restricted storage: preserve the existing user data. */ }
  }
  return (
    <button className="md-button-quiet" type="button" onClick={toggle}
      aria-pressed={saved} disabled={!compatible} title={!compatible ? 'Existing favorites format requires integration' : undefined}>
      <span aria-hidden="true">{saved ? '★' : '☆'}</span>{saved ? t.saved : t.save}
    </button>
  );
}

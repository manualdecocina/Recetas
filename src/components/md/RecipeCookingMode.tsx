'use client';
import { useEffect, useRef, useState } from 'react';
import type { MdLanguage, MdStep } from './md-types';
import { getMdCopy } from '@/lib/copy';

export default function RecipeCookingMode({ lang, steps }: { lang: MdLanguage; steps: MdStep[] }) {
  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(0);
  const closeRef = useRef<HTMLButtonElement>(null);
  const startRef = useRef<HTMLButtonElement>(null);
  const t = getMdCopy(lang);
  useEffect(() => {
    if (!open) return;
    closeRef.current?.focus();
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') setOpen(false);
      if (event.key !== 'Tab') return;
      // Compact focus trap for three buttons, with disabled steps excluded.
      const controls = document.querySelectorAll<HTMLButtonElement>('.md-cooking-overlay button:not(:disabled)');
      const first = controls[0];
      const last = controls[controls.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus(); }
      if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); }
    }
    document.addEventListener('keydown', onKeyDown);
    return () => { document.removeEventListener('keydown', onKeyDown); startRef.current?.focus(); };
  }, [open]);
  if (!steps.length) return null;
  const current = steps[index];
  return (
    <>
      <button ref={startRef} className="md-button" type="button" onClick={() => { setIndex(0); setOpen(true); }}>
        {t.cookingMode}
      </button>
      {open && (
        <div className="md-cooking-overlay" role="dialog" aria-modal="true" aria-labelledby="md-cooking-heading">
          <header className="md-cooking-header">
            <strong>{t.cookingMode}</strong>
            <button ref={closeRef} className="md-button-quiet" type="button" onClick={() => setOpen(false)}>{t.closeCooking}</button>
          </header>
          <div className="md-cooking-main">
            <span className="md-eyebrow">{t.step} {index + 1} {t.of} {steps.length}</span>
            <h2 className="md-title" id="md-cooking-heading">{current.title || `${t.step} ${index + 1}`}</h2>
            <p>{current.content}</p>
          </div>
          <footer>
            <div className="md-cooking-progress" role="progressbar" aria-valuemin={0} aria-valuemax={steps.length}
              aria-valuenow={index + 1} aria-label={t.cookingMode}>
              <div className="md-cooking-progress-bar" style={{ width: `${(index + 1) / steps.length * 100}%` }} />
            </div>
            <div className="md-cooking-controls">
              <button className="md-button-secondary" type="button" onClick={() => setIndex(index - 1)} disabled={index === 0}>{t.previousStep}</button>
              {index < steps.length - 1 ? (
                <button className="md-button" type="button" onClick={() => setIndex(index + 1)}>{t.nextStep}</button>
              ) : <button className="md-button" type="button" onClick={() => setOpen(false)}>{t.finish}</button>}
            </div>
          </footer>
        </div>
      )}
    </>
  );
}

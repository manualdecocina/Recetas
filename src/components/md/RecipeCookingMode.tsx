'use client';
import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { recipeImageSrc } from '@/lib/recipe-media';
import type { MdLanguage, MdStep } from './md-types';
import { getMdCopy } from '@/lib/copy';
import { kitchenCopy } from '@/lib/kitchen-copy';
import { ingredientDisplayText } from '@/lib/recipe-ingredient-format';
import { useRecipeWorkspace } from './RecipeWorkspace';
import RecipeTimer from './RecipeTimer';
const useIsoLayoutEffect = typeof window === 'undefined' ? useEffect : useLayoutEffect;
type Lock = { release: () => Promise<void>; released: boolean; addEventListener: (name: string, listener: () => void) => void };
export default function RecipeCookingMode({ recipeId, lang, steps: originalSteps }: { recipeId: string; lang: MdLanguage; steps: MdStep[] }) {
 const workspace = useRecipeWorkspace(), steps = workspace?.steps ?? originalSteps;
 const [open, setOpen] = useState(false), [index, setIndex] = useState(0), [awake, setAwake] = useState(false);
 const closeRef = useRef<HTMLButtonElement>(null), startRef = useRef<HTMLButtonElement>(null), overlayRef = useRef<HTMLDivElement>(null), mainRef = useRef<HTMLDivElement>(null), headingRef = useRef<HTMLHeadingElement>(null);
 const t = getMdCopy(lang), ui = kitchenCopy(lang), key = `manualdecocina:cooking:${recipeId}`;
 useEffect(() => { try { const saved = Number(localStorage.getItem(key)); setIndex(Number.isInteger(saved) && saved >= 0 && saved < steps.length ? saved : 0); } catch {} }, [key, steps.length]);
 function go(next: number) { if (next < 0 || next >= steps.length) return; setIndex(next); try { localStorage.setItem(key, String(next)); } catch {} }
 useIsoLayoutEffect(() => {
  if (!open) return;
  mainRef.current?.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  headingRef.current?.focus({ preventScroll: true });
 }, [open, index]);
 useEffect(() => {
  if (!open) return;
  const previousOverflow = document.body.style.overflow; document.body.style.overflow = 'hidden';
  closeRef.current?.focus();
  function onKeyDown(event: KeyboardEvent) {
   if (event.key === 'Escape') setOpen(false);
   if (event.key !== 'Tab') return;
   const controls = [...(overlayRef.current?.querySelectorAll<HTMLElement>('button:not(:disabled), input:not(:disabled), summary, a[href]') ?? [])].filter(el => el.getClientRects().length > 0);
   const first = controls[0], last = controls[controls.length - 1];
   if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus(); }
   if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); }
  }
  document.addEventListener('keydown', onKeyDown);
  return () => { document.body.style.overflow = previousOverflow; document.removeEventListener('keydown', onKeyDown); startRef.current?.focus({ preventScroll: true }); };
 }, [open]);
 useEffect(() => {
  if (!open) return;
  let lock: Lock | undefined, disposed = false, pending = false;
  const wake = (navigator as unknown as { wakeLock?: { request: (type: string) => Promise<Lock> } }).wakeLock;
  async function acquire() {
   if (!wake || document.visibilityState !== 'visible' || pending || (lock && !lock.released)) return;
   pending = true;
   try { const acquired = await wake.request('screen');
    if (disposed) { await acquired.release(); return; }
    lock = acquired; setAwake(!acquired.released); acquired.addEventListener('release', () => { if (!disposed) setAwake(false); });
   } catch { if (!disposed) setAwake(false); } finally { pending = false; }
  }
  setAwake(false); void acquire(); document.addEventListener('visibilitychange', acquire);
  return () => { disposed = true; document.removeEventListener('visibilitychange', acquire); void lock?.release().catch(() => {}); };
 }, [open]);
 if (!steps.length) return null;
 const current = steps[Math.min(index, steps.length - 1)];
 return <>
  <div className="md-cooking-entry">
   <button ref={startRef} className="md-button md-cooking-start" type="button" aria-haspopup="dialog" aria-expanded={open} aria-describedby="md-cooking-help" onClick={() => setOpen(true)}>
    <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M8 4.5v15l12-7.5z" /></svg>
    {ui.startCooking}
    <span aria-hidden="true">→</span>
   </button>
   <p id="md-cooking-help">{ui.cookingHelp}</p>
  </div>
  {open && <div ref={overlayRef} className="md-cooking-overlay" role="dialog" aria-modal="true" aria-labelledby="md-cooking-heading">
   <header className="md-cooking-header"><strong>{t.cookingMode}</strong><button ref={closeRef} className="md-button-quiet" type="button" onClick={() => setOpen(false)}>{t.closeCooking}</button></header>
   <div ref={mainRef} className="md-cooking-main"><div className="md-cooking-step">
    <span className="md-eyebrow">{t.step} {index + 1} {t.of} {steps.length}</span>
    <h2 ref={headingRef} tabIndex={-1} className="md-title" id="md-cooking-heading">{current.title || `${t.step} ${index + 1}`}</h2><p>{current.content}</p>
    {current.image_url && <figure className="md-cooking-photo">
     <Image key={current.image_url} src={recipeImageSrc(current.image_url)} alt={current.image_alt || current.title || `${t.step} ${index + 1}`}
      width={1200} height={900} sizes="(max-width: 796px) calc(100vw - 36px), 760px" quality={75} loading="eager" />
    </figure>}
    {workspace?.ingredients.length ? <details className="md-cooking-ingredients"><summary>{ui.ingredients}{workspace.servings ? ` · ${workspace.servings} ${ui.servings.toLowerCase()}` : ''}</summary><ul>{workspace.ingredients.map((item, i) => <li key={i}>{ingredientDisplayText(item, lang)}{item.preparation ? `, ${item.preparation}` : ''}</li>)}</ul></details> : null}
    <div className="md-cooking-timers">{steps.map((step, position) => <RecipeTimer key={`${recipeId}-${position}`} recipeId={recipeId} step={step} position={position} lang={lang} current={position === index} onSelect={() => go(position)} />)}</div>
    <small className="md-kitchen-hint">{ui.timerNote}</small><p className="md-kitchen-hint">{awake ? ui.screenOn : ui.screenOff}</p>
    <button className="md-button-quiet" type="button" onClick={() => go(0)}>{ui.restart}</button>
   </div></div>
   <footer className="md-cooking-footer"><div className="md-cooking-progress" role="progressbar" aria-valuemin={0} aria-valuemax={steps.length} aria-valuenow={index + 1} aria-label={t.cookingMode}><div className="md-cooking-progress-bar" style={{ width: `${(index + 1) / steps.length * 100}%` }} /></div>
    <div className="md-cooking-controls"><button className="md-button-secondary" type="button" onClick={() => go(index - 1)} disabled={index === 0}>{t.previousStep}</button>{index < steps.length - 1 ? <button className="md-button" type="button" onClick={() => go(index + 1)}>{t.nextStep}</button> : <button className="md-button" type="button" onClick={() => setOpen(false)}>{t.finish}</button>}</div>
   </footer>
  </div>}
 </>;
}

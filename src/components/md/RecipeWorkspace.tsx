'use client';
import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import type { MdIngredient, MdLanguage, MdStep } from './md-types';
import { scaleIngredients, scaleSteps } from '@/lib/recipe-quantities';
import { kitchenCopy } from '@/lib/kitchen-copy';
type Workspace = { ingredients: MdIngredient[]; steps: MdStep[]; servings: number | null; base: number | null; setServings: (value: number) => void };
const Context = createContext<Workspace | null>(null);
export const useRecipeWorkspace = () => useContext(Context);
export default function RecipeWorkspace({ recipeId, lang, ingredients, steps, servings, children }: {
 recipeId: string; lang: MdLanguage; ingredients: MdIngredient[]; steps: MdStep[]; servings: number | null; children: React.ReactNode;
}) {
 const base = servings && servings > 0 ? servings : null;
 const [count, setCount] = useState(base);
 const key = `manualdecocina:servings:${recipeId}`;
 useEffect(() => { try { const saved = Number(localStorage.getItem(key)); setCount(base && saved >= 1 && saved <= 100 ? saved : base); } catch { setCount(base); } }, [key, base]);
 function setServings(value: number) { if (!base || !Number.isFinite(value) || value < 1 || value > 100) return; setCount(value); try { localStorage.setItem(key, String(value)); } catch {} }
 const factor = base && count ? count / base : 1;
 const value = useMemo(() => ({ ingredients: scaleIngredients(ingredients, factor, lang), steps: scaleSteps(steps, factor, lang, ingredients), servings: count, base, setServings }), [ingredients, steps, factor, lang, count, base]);
 return <Context.Provider value={value}>{children}</Context.Provider>;
}
export function ServingsValue({ initial }: { initial: number }) { return <>{useRecipeWorkspace()?.servings ?? initial}</>; }
export function ServingsSelector({ lang }: { lang: MdLanguage }) {
 const state = useRecipeWorkspace(), t = kitchenCopy(lang);
 if (!state?.base) return null;
 return <div className="md-servings-controls" data-base-servings={state.base} data-current-servings={state.servings}>
  <div className="md-servings-bar">
   <label className="md-servings-label" htmlFor="md-servings">{t.servings}</label>
   <div className="md-servings-stepper">
    <button type="button" className="md-servings-adjust" aria-label={`${t.servings} −`} disabled={(state.servings ?? 1) <= 1} onClick={() => state.setServings((state.servings ?? state.base!) - 1)}>−</button>
    <input id="md-servings" type="number" inputMode="numeric" min="1" max="100" step="1" aria-describedby="md-servings-help" value={state.servings ?? state.base} onChange={e => { if (e.currentTarget.value) state.setServings(Number(e.currentTarget.value)); }} />
    <button type="button" className="md-servings-adjust" aria-label={`${t.servings} +`} disabled={(state.servings ?? 1) >= 100} onClick={() => state.setServings((state.servings ?? state.base!) + 1)}>+</button>
   </div>
   <button type="button" className="md-servings-reset" aria-label={t.reset} title={t.reset} disabled={state.servings === state.base} onClick={() => state.setServings(state.base!)}>
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M3 10a9 9 0 1 1 2.6 8.4" /><path d="M3 4v6h6" /></svg>
   </button>
  </div>
  <p className="md-servings-help" id="md-servings-help">{t.scaleNote}</p>
 </div>;
}

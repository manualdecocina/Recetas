'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import type { MdIngredient, MdLanguage } from './md-types';
import { kitchenCopy } from '@/lib/kitchen-copy';
import { addShoppingSource, emptyShopping, markBought, readPantrySlugs, readShopping, SHOPPING_EVENT, shoppingRows, writeShopping, type ShoppingSource } from '@/lib/shopping-list';
import { useRecipeWorkspace } from './RecipeWorkspace';

export function AddToShoppingList({ lang, source, missing }: { lang: MdLanguage; source: ShoppingSource; missing?: MdIngredient[] }) {
 const state = useRecipeWorkspace(); const t = kitchenCopy(lang);
 const [message, setMessage] = useState('');
 function add(onlyMissing: boolean) {
  const ingredients = state?.ingredients ?? source.ingredients;
  let items = ingredients;
  if (onlyMissing) {
   if (missing) items = missing;
   else {
    const owned = readPantrySlugs(); let checked: Record<string, boolean> = {};
    try { checked = JSON.parse(localStorage.getItem(`manualdecocina:ingredients:${source.recipeId ?? source.id}`) ?? '{}') ?? {}; } catch {}
    items = ingredients.filter((item, index) => !owned.has(item.pantryIngredientSlug ?? item.canonicalIngredientSlug ?? '') && !item.pantryIngredientAliases?.some(alias => owned.has(alias)) && !checked[item.storagePosition ?? index]);
   }
  }
  if (onlyMissing && !items.length) { setMessage(t.emptyMissing); return; }
  const saved = writeShopping(addShoppingSource(readShopping(), { ...source, ingredients: items }));
  setMessage(saved ? t.added : t.notSaved);
 }
 return <div className="md-shopping-add">
  {!missing && <div className="md-shopping-add-heading">
   <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 7h14l1 14H4L5 7Z" /><path d="M9 8V6a3 3 0 0 1 6 0v2" /></svg>
   <div><strong>{t.shopping}</strong><p>{t.shoppingHelp}</p></div>
  </div>}
  <div className="md-shopping-add-actions">
   <button type="button" className="md-button md-shopping-add-primary" aria-label={t.addMissing} onClick={() => add(true)}>
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true"><path d="M12 5v14M5 12h14" /></svg><span>{t.addMissingShort}</span>
   </button>
   {!missing && <button type="button" className="md-button-quiet md-shopping-add-all" aria-label={t.addAll} onClick={() => add(false)}>{t.addAllShort}</button>}
  </div>
  <p className="md-kitchen-status" role="status">{message}</p>
  <Link className="md-shopping-add-view" href={`/${lang}/lista-de-compra`} prefetch={false}><span>{t.viewList}</span><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12h14m-6-6 6 6-6 6" /></svg></Link>
 </div>;
}
export default function ShoppingList({ lang }: { lang: MdLanguage }) {
 const t = kitchenCopy(lang), [state, setState] = useState(emptyShopping), [message, setMessage] = useState(''), [fallback, setFallback] = useState(false);
 useEffect(() => {
  const update = () => setState(readShopping()); update();
  window.addEventListener('storage', update); window.addEventListener(SHOPPING_EVENT, update);
  return () => { window.removeEventListener('storage', update); window.removeEventListener(SHOPPING_EVENT, update); };
 }, []);
 const rows = shoppingRows(state, lang);
 const text = [t.shopping, ...rows.filter(row => !state.checked.includes(row.key)).map(row => `☐ ${row.text}`)].join('\n');
 function save(next: typeof state) { setState(next); if (!writeShopping(next)) setMessage(t.notSaved); }
 async function copy() {
  try { await navigator.clipboard.writeText(text); setMessage(t.copied); setFallback(false); }
  catch { setFallback(true); setMessage(t.copyFailed); }
 }
 async function share() {
  if (navigator.share) { try { await navigator.share({ title: t.shopping, text }); return; } catch (error) { if ((error as Error).name === 'AbortError') return; } }
  await copy();
 }
 return <section className="md-section md-shopping-list" aria-label={t.shopping}>
  <p className="md-shopping-intro">{t.local}</p>
  {!rows.length ? <p className="md-empty-block">{t.empty}</p> : <>
   <ul className="md-shopping-items">{rows.map(row => <li key={row.key}>
    <label className="md-ingredient-checkbox"><input type="checkbox" checked={state.checked.includes(row.key)} aria-label={`${t.bought}: ${row.text}`} onChange={() => {
     const latest = readShopping(), bought = !latest.checked.includes(row.key);
     save({ ...latest, checked: bought ? [...latest.checked, row.key] : latest.checked.filter(key => key !== row.key) }); markBought(row.slugs, bought);
    }} /><span className="md-shopping-item-text"><strong>{row.quantity}</strong>{' '}{row.name}</span></label>
   </li>)}</ul>
   <div className="md-kitchen-actions md-shopping-actions"><button type="button" className="md-button" onClick={copy}>{t.copy}</button><button type="button" className="md-button-secondary" onClick={share}>{t.share}</button></div>
   <div className="md-shopping-recipes"><h2 className="md-subtitle">{t.sources}</h2><ul className="md-shopping-sources">{state.sources.map(source => <li key={source.id}><Link href={source.href}>{source.title}</Link><button type="button" className="md-button-quiet" aria-label={`${t.remove}: ${source.title}`} onClick={() => { const latest = readShopping(); save({ ...latest, sources: latest.sources.filter(s => s.id !== source.id) }); }}>{t.remove}</button></li>)}</ul>
   </div><div className="md-shopping-footer"><button type="button" className="md-shopping-clear" onClick={() => save(emptyShopping())}>{t.clear}</button></div>
  </>}
  <p className="md-kitchen-status" role="status">{message}</p>
  {fallback && <textarea className="md-copy-fallback" aria-label={t.copy} value={text} readOnly onFocus={e => e.currentTarget.select()} />}
  <p><Link className="md-link" href={`/${lang}/que-puedo-cocinar`} prefetch={false}>{t.pantry} →</Link></p>
 </section>;
}

'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import RecipeCard from './RecipeCard';
import type { MdLanguage, MdRecipeCardData } from './md-types';
import { FAVORITES_KEY, FAVORITES_CHANGED, parseFavoriteIds } from '@/lib/favorites';
import { favoritesCopy } from '@/lib/favorites-copy';
type SavedCard = MdRecipeCardData & { savedIds: string[] };
export default function FavoritesCollection({ lang }: { lang: MdLanguage }) {
  const t = favoritesCopy[lang];
  const [recipes, setRecipes] = useState<SavedCard[]>([]);
  const [status, setStatus] = useState<'loading' | 'ready' | 'error' | 'storageError'>('loading');
  const [retry, setRetry] = useState(0);
  useEffect(() => {
    let controller: AbortController | undefined;
    const load = async () => {
      controller?.abort(); controller = new AbortController();
      const signal = controller.signal;
      let ids: string[];
      try { ids = parseFavoriteIds(localStorage.getItem(FAVORITES_KEY)); } catch { setStatus('storageError'); return; }
      if (!ids.length) { setRecipes([]); setStatus('ready'); return; }
      setStatus('loading');
      try {
        const response = await fetch('/api/favorites', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ lang, ids }), signal, cache: 'no-store' });
        if (!response.ok) throw new Error();
        const data = await response.json();
        if (!Array.isArray(data.recipes)) throw new Error();
        if (!signal.aborted) { setRecipes(data.recipes); setStatus('ready'); }
      } catch { if (!signal.aborted) setStatus('error'); }
    };
    void load();
    window.addEventListener(FAVORITES_CHANGED, load); window.addEventListener('storage', load);
    return () => { controller?.abort(); window.removeEventListener(FAVORITES_CHANGED, load); window.removeEventListener('storage', load); };
  }, [lang, retry]);
  function remove(recipe: SavedCard) {
    try {
      const ids = parseFavoriteIds(localStorage.getItem(FAVORITES_KEY)).filter(id => !recipe.savedIds.includes(id));
      localStorage.setItem(FAVORITES_KEY, JSON.stringify(ids));
      window.dispatchEvent(new Event(FAVORITES_CHANGED));
    } catch { setStatus('storageError'); }
  }
  return <section aria-label={t.title}>
    {status === 'loading' && <p role="status">{t.loading}</p>}
    {(status === 'error' || status === 'storageError') && <p role="status">{t[status]} <button className="md-button-secondary" onClick={() => setRetry(n => n + 1)}>{t.retry}</button></p>}
    {status === 'ready' && (recipes.length ? <div className="md-card-grid">{recipes.map(recipe => <div key={recipe.id}><RecipeCard recipe={recipe} /><button className="md-button-quiet" onClick={() => remove(recipe)} aria-label={`${t.remove}: ${recipe.title}`}>{t.remove}</button></div>)}</div> : <div className="md-empty-state"><p>{t.empty}</p><Link className="md-button" href={`/${lang}/recetas`}>{t.browse}</Link></div>)}
  </section>;
}

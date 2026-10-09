'use client';
import { useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import RecipeCard from './RecipeCard';
import { getMdCopy } from '@/lib/copy';
import type { MdLanguage } from './md-types';
import { getPantryCopy } from '@/lib/pantry-copy';
import { countLabel } from '@/lib/plural';
import type { MdPantryIngredient, MdPantryRecipe } from '@/lib/md-data';

/**
 * Solo el contenido interactivo (elige ingredientes + resultados). SiteHeader es un
 * componente de servidor asíncrono (consulta Supabase con await): un componente de
 * cliente no puede renderizarlo dentro de sí — rompe la página entera. Header y footer
 * se pintan en page.tsx (servidor), igual que en RecipeDocument.tsx.
 */

const MAX_RESULTS = 30;
const PANTRY_STORAGE_KEY = 'manualdecocina:pantry:selectedSlugs';

interface Match {
  recipe: MdPantryRecipe;
  matched: number;
  checklist: Array<{ id: string; name: string; owned: boolean }>;
  effectiveMissingCount: number;
  isComplete: boolean;
}

/**
 * Coincidencia calculada en el cliente sobre datos reales ya cargados (ingredientes
 * canónicos y recipe_ingredients de recetas publicadas). No hay llamada a IA ni datos
 * inventados: si una receta no tiene ingredientes canonicalizados, simplemente no aparece.
 */
function computeMatches(recipes: MdPantryRecipe[], selected: Set<string>, ingredientNameById: Map<string, string>, lang: MdLanguage): Match[] {
  if (selected.size === 0) return [];
  const results: Match[] = [];
  for (const recipe of recipes) {
    const matched = recipe.ingredientIds.filter((id) => selected.has(id));
    if (matched.length === 0) continue;
    const missingIds = recipe.ingredientIds.filter((id) => !selected.has(id));
    const checklist = recipe.ingredientIds
      .map((id) => ({ id, name: ingredientNameById.get(id) ?? '', owned: selected.has(id) }))
      .filter((item) => Boolean(item.name));
    const effectiveMissingCount = missingIds.length + recipe.uncanonicalizedCount;
    results.push({
      recipe,
      matched: matched.length,
      checklist,
      effectiveMissingCount,
      isComplete: effectiveMissingCount === 0,
    });
  }
  results.sort((a, b) => {
    if (a.effectiveMissingCount !== b.effectiveMissingCount) return a.effectiveMissingCount - b.effectiveMissingCount;
    if (b.matched !== a.matched) return b.matched - a.matched;
    return a.recipe.title.localeCompare(b.recipe.title, lang);
  });
  return results.slice(0, MAX_RESULTS);
}

export default function PantryMatchView({ lang, ingredients, recipes }: { lang: MdLanguage; ingredients: MdPantryIngredient[]; recipes: MdPantryRecipe[] }) {
  const t = getMdCopy(lang);
  const ui = getPantryCopy(lang);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [filter, setFilter] = useState('');
  const [hasViewedResults, setHasViewedResults] = useState(false);
  const resultsHeadingRef = useRef<HTMLHeadingElement>(null);

  const ingredientNameById = useMemo(() => new Map(ingredients.map((i) => [i.id, i.name])), [ingredients]);
  const ingredientById = useMemo(() => new Map(ingredients.map((i) => [i.id, i])), [ingredients]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(PANTRY_STORAGE_KEY);
      const storedSlugs: unknown = raw ? JSON.parse(raw) : [];
      if (!Array.isArray(storedSlugs) || storedSlugs.length === 0) return;
      const slugs = new Set(storedSlugs.filter((value): value is string => typeof value === 'string'));
      const restored = ingredients.filter((ingredient) => slugs.has(ingredient.slug)).map((ingredient) => ingredient.id);
      if (restored.length) setSelected(new Set(restored));
    } catch { /* La herramienta funciona aunque localStorage no esté disponible. */ }
  }, [ingredients]);
  const filteredIngredients = useMemo(() => {
    const q = filter.trim().toLocaleLowerCase(lang);
    if (!q) return ingredients;
    return ingredients.filter((i) => i.name.toLocaleLowerCase(lang).includes(q));
  }, [ingredients, filter, lang]);
  const matches = useMemo(() => computeMatches(recipes, selected, ingredientNameById, lang), [recipes, selected, ingredientNameById, lang]);

  function persistSelection(next: Set<string>) {
    try {
      const slugs = Array.from(next)
        .map((id) => ingredientById.get(id)?.slug)
        .filter((slug): slug is string => Boolean(slug));
      localStorage.setItem(PANTRY_STORAGE_KEY, JSON.stringify(slugs));
    } catch { /* Sin persistencia: la selección actual sigue funcionando. */ }
  }

  function toggle(id: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      persistSelection(next);
      return next;
    });
  }

  function viewResults() {
    if (selected.size === 0) return;
    setHasViewedResults(true);
    window.requestAnimationFrame(() => {
      resultsHeadingRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      window.setTimeout(() => resultsHeadingRef.current?.focus({ preventScroll: true }), 450);
    });
  }

  function clearSelection() {
    const next = new Set<string>();
    setSelected(next);
    persistSelection(next);
    setHasViewedResults(false);
  }

  return (
    <main className="md-container" id="md-main">
      <header className="md-page-head">
        <p className="md-eyebrow">{t.pantryEyebrow}</p>
        <h1 className="md-display">{t.pantryToolHeading}</h1>
        <p className="md-lead md-page-intro">{t.pantryToolIntro}</p>
        <div className="md-pantry-how" aria-label={ui.how}>
          <strong>{ui.how}</strong>
          <ol>
            <li><span>1</span> {ui.step1}</li>
            <li><span>2</span> {ui.step2}</li>
            <li><span>3</span> {ui.step3}</li>
          </ol>
        </div>
      </header>

      <section className="md-pantry-picker-section md-section" aria-labelledby="md-pantry-picker-heading">
        <div className="md-pantry-picker-head">
          <h2 className="md-title" id="md-pantry-picker-heading">{t.pantryPickerHeading}</h2>
          {selected.size > 0 && (
            <button type="button" className="md-button-quiet" onClick={clearSelection}>
              {t.pantryClearSelection}
            </button>
          )}
        </div>
        <label className="md-search-label md-sr-only" htmlFor="md-pantry-filter">{t.pantrySearchPlaceholder}</label>
        <input
          className="md-search-input md-pantry-filter"
          id="md-pantry-filter"
          type="search"
          placeholder={t.pantrySearchPlaceholder}
          value={filter}
          onChange={(event) => setFilter(event.target.value)}
        />
        <div className="md-pantry-chips" role="group" aria-label={t.pantryPickerHeading}>
          {filteredIngredients.map((ingredient) => {
            const isSelected = selected.has(ingredient.id);
            return (
              <button
                key={ingredient.id}
                type="button"
                className={`md-pantry-chip${isSelected ? ' md-pantry-chip-selected' : ''}`}
                aria-pressed={isSelected}
                onClick={() => toggle(ingredient.id)}
              >
                {ingredient.name}
              </button>
            );
          })}
          {filteredIngredients.length === 0 && <p className="md-pantry-no-ingredients">{t.pantryNoIngredientsFound}</p>}
        </div>

        <div className="md-pantry-action" aria-live="polite">
          <p>
            {selected.size === 0
              ? ui.start
              : ui.selected(selected.size)}
          </p>
          <button
            type="button"
            className="md-button md-pantry-view-results"
            disabled={selected.size === 0}
            onClick={viewResults}
          >
            {hasViewedResults ? ui.update : ui.view}
            {selected.size > 0 && <span aria-hidden="true"> ↓</span>}
          </button>
        </div>
      </section>

      <section className={`md-section md-pantry-results${hasViewedResults ? ' md-pantry-results-viewed' : ''}`} aria-labelledby="md-pantry-results-heading">
        <div className="md-section-head">
          <h2 className="md-title" id="md-pantry-results-heading" ref={resultsHeadingRef} tabIndex={-1}>{t.pantryResultsHeading}</h2>
        </div>
        {selected.size === 0 && (
          <div className="md-empty-block">
            <p>{t.pantryEmptyNoSelection}</p>
          </div>
        )}
        {selected.size > 0 && matches.length === 0 && (
          <div className="md-empty-block">
            <h2 className="md-subtitle">{t.emptyTitle}</h2>
            <p>{t.pantryEmptyNoMatches}</p>
            <Link className="md-button" href={`/${lang}/recetas`}>{t.seeAllRecipes}</Link>
          </div>
        )}
        {matches.length > 0 && (
          <div className="md-card-grid">
            {matches.map(({ recipe, checklist, effectiveMissingCount, isComplete }) => (
              <div className="md-pantry-result" key={recipe.id}>
                <span className={`md-pantry-badge${isComplete ? ' md-pantry-badge-complete' : ''}`}>
                  {isComplete ? t.pantryComplete : countLabel(lang, effectiveMissingCount, 'missingIngredient')}
                </span>
                <RecipeCard recipe={recipe} />
                {checklist.length > 0 && (
                  <details className="md-pantry-checklist">
                    <summary>
                      {isComplete ? ui.checklist : `${ui.checklist} · ${countLabel(lang, effectiveMissingCount, 'missingIngredient')}`}
                    </summary>
                    <ul>
                      {checklist.map((item) => (
                        <li key={item.id} className={item.owned ? 'md-pantry-check-owned' : 'md-pantry-check-missing'}>
                          <span aria-hidden="true">{item.owned ? '✓' : '○'}</span>
                          <span>{item.name}</span>
                        </li>
                      ))}
                    </ul>
                    {recipe.uncanonicalizedCount > 0 && (
                      <p className="md-pantry-missing-list">
                        {ui.pending(recipe.uncanonicalizedCount)}
                      </p>
                    )}
                  </details>
                )}
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}

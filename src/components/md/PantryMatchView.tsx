'use client';
import { useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import RecipeCard from './RecipeCard';
import { getMdCopy } from '@/lib/copy';
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
  missing: string[];
  checklist: Array<{ id: string; name: string; owned: boolean }>;
  effectiveMissingCount: number;
  isComplete: boolean;
}

/**
 * Coincidencia calculada en el cliente sobre datos reales ya cargados (ingredientes
 * canónicos y recipe_ingredients de recetas publicadas). No hay llamada a IA ni datos
 * inventados: si una receta no tiene ingredientes canonicalizados, simplemente no aparece.
 */
function computeMatches(recipes: MdPantryRecipe[], selected: Set<string>, ingredientNameById: Map<string, string>): Match[] {
  if (selected.size === 0) return [];
  const results: Match[] = [];
  for (const recipe of recipes) {
    const matched = recipe.ingredientIds.filter((id) => selected.has(id));
    if (matched.length === 0) continue;
    const missingIds = recipe.ingredientIds.filter((id) => !selected.has(id));
    const missing = missingIds.map((id) => ingredientNameById.get(id) ?? '').filter(Boolean);
    const checklist = recipe.ingredientIds
      .map((id) => ({ id, name: ingredientNameById.get(id) ?? '', owned: selected.has(id) }))
      .filter((item) => Boolean(item.name));
    const effectiveMissingCount = missing.length + recipe.uncanonicalizedCount;
    results.push({
      recipe,
      matched: matched.length,
      missing,
      checklist,
      effectiveMissingCount,
      isComplete: effectiveMissingCount === 0,
    });
  }
  results.sort((a, b) => {
    if (a.effectiveMissingCount !== b.effectiveMissingCount) return a.effectiveMissingCount - b.effectiveMissingCount;
    if (b.matched !== a.matched) return b.matched - a.matched;
    return a.recipe.title.localeCompare(b.recipe.title, 'es');
  });
  return results.slice(0, MAX_RESULTS);
}

export default function PantryMatchView({ ingredients, recipes }: { ingredients: MdPantryIngredient[]; recipes: MdPantryRecipe[] }) {
  const t = getMdCopy('es');
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
    const q = filter.trim().toLocaleLowerCase('es');
    if (!q) return ingredients;
    return ingredients.filter((i) => i.name.toLocaleLowerCase('es').includes(q));
  }, [ingredients, filter]);
  const matches = useMemo(() => computeMatches(recipes, selected, ingredientNameById), [recipes, selected, ingredientNameById]);

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
        <div className="md-pantry-how" aria-label="Cómo funciona">
          <strong>Así funciona</strong>
          <ol>
            <li><span>1</span> Marca los ingredientes que tienes.</li>
            <li><span>2</span> Pulsa <b>Ver qué puedo cocinar</b>.</li>
            <li><span>3</span> Te mostramos primero las recetas para las que te falta menos.</li>
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
              ? 'Marca uno o varios ingredientes para empezar.'
              : `${selected.size} ${selected.size === 1 ? 'ingrediente seleccionado' : 'ingredientes seleccionados'}.`}
          </p>
          <button
            type="button"
            className="md-button md-pantry-view-results"
            disabled={selected.size === 0}
            onClick={viewResults}
          >
            {hasViewedResults ? 'Actualizar recetas' : 'Ver qué puedo cocinar'}
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
            <Link className="md-button" href="/es/recetas">{t.seeAllRecipes}</Link>
          </div>
        )}
        {matches.length > 0 && (
          <div className="md-card-grid">
            {matches.map(({ recipe, missing, checklist, effectiveMissingCount, isComplete }) => (
              <div className="md-pantry-result" key={recipe.id}>
                <span className={`md-pantry-badge${isComplete ? ' md-pantry-badge-complete' : ''}`}>
                  {isComplete ? t.pantryComplete : `${effectiveMissingCount} ${t.pantryMissingSuffix}`}
                </span>
                <RecipeCard recipe={recipe} />
                {checklist.length > 0 && (
                  <details className="md-pantry-checklist">
                    <summary>
                      {isComplete ? 'Ver ingredientes' : `Ver ingredientes · ${effectiveMissingCount} ${effectiveMissingCount === 1 ? 'faltante' : 'faltantes'}`}
                    </summary>
                    <ul>
                      {checklist.map((item) => (
                        <li key={item.id} className={item.owned ? 'md-pantry-check-owned' : 'md-pantry-check-missing'}>
                          <span aria-hidden="true">{item.owned ? '✓' : '○'}</span>
                          <span>{item.name}</span>
                        </li>
                      ))}
                    </ul>
                  </details>
                )}
                {missing.length > 0 && (
                  <p className="md-pantry-missing-list"><strong>{t.pantryMissingPrefix}</strong> {missing.join(', ')}</p>
                )}
                {recipe.uncanonicalizedCount > 0 && (
                  <p className="md-pantry-missing-list">
                    Además, {recipe.uncanonicalizedCount} {recipe.uncanonicalizedCount === 1 ? 'ingrediente adicional de esta receta está' : 'ingredientes adicionales de esta receta están'} en proceso de catalogación.
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}

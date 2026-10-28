'use client';
import { useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import RecipeCard from './RecipeCard';
import { getMdCopy } from '@/lib/copy';
import type { MdLanguage } from './md-types';
import { getPantryCopy } from '@/lib/pantry-copy';
import { ingredientSuggestions } from '@/lib/pantry-editorial';
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
 * inventados: cada posición editorial conserva una identidad seleccionable, aunque falte su vínculo taxonómico.
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
  const [suggestionsOpen, setSuggestionsOpen] = useState(false);
  const [activeSuggestion, setActiveSuggestion] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
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
  const suggestions = useMemo(() => ingredientSuggestions(ingredients, filter, selected, lang), [ingredients, filter, selected, lang]);
  const selectedIngredients = useMemo(() => ingredients.filter(i => selected.has(i.id)), [ingredients, selected]);
  const expanded = suggestionsOpen && filter.trim().length > 0;

  function selectIngredient(id: string) {
    toggle(id);
    setFilter('');
    setActiveSuggestion(-1);
    setSuggestionsOpen(false);
    inputRef.current?.focus();
  }

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
      resultsHeadingRef.current?.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'start' });
      resultsHeadingRef.current?.focus({ preventScroll: true });
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
        <div className="md-pantry-autocomplete" onBlur={(event) => {
          if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setSuggestionsOpen(false);
        }}>
          <label className="md-search-label" htmlFor="md-pantry-filter">{ui.search}</label>
          <p id="md-pantry-search-help" className="md-pantry-search-help">{ui.searchHelp}</p>
          <input
            ref={inputRef}
            className="md-search-input md-pantry-filter"
            id="md-pantry-filter"
            type="search"
            role="combobox"
            aria-autocomplete="list"
            aria-expanded={expanded}
            aria-controls="md-pantry-suggestions"
            aria-describedby="md-pantry-search-help"
            aria-activedescendant={expanded && activeSuggestion >= 0 && suggestions[activeSuggestion] ? `md-pantry-option-${activeSuggestion}` : undefined}
            autoComplete="off"
            placeholder={t.pantrySearchPlaceholder}
            value={filter}
            onFocus={() => setSuggestionsOpen(true)}
            onChange={(event) => { setFilter(event.target.value); setSuggestionsOpen(true); setActiveSuggestion(-1); }}
            onKeyDown={(event) => {
              if (event.key === 'Escape') { setSuggestionsOpen(false); setActiveSuggestion(-1); }
              if ((event.key === 'ArrowDown' || event.key === 'ArrowUp') && suggestions.length) {
                event.preventDefault(); setSuggestionsOpen(true);
                setActiveSuggestion(prev => event.key === 'ArrowDown' ? (prev + 1) % suggestions.length : (prev <= 0 ? suggestions.length - 1 : prev - 1));
              }
              if (event.key === 'Enter' && expanded && suggestions.length) {
                event.preventDefault(); selectIngredient(suggestions[activeSuggestion >= 0 ? activeSuggestion : 0].id);
              }
            }}
          />
          <ul id="md-pantry-suggestions" role="listbox" aria-label={ui.search} className="md-pantry-suggestions" hidden={!expanded}>
            {suggestions.map((ingredient, index) => (
              <li key={ingredient.id} id={`md-pantry-option-${index}`} role="option" aria-selected={index === activeSuggestion}
                className={index === activeSuggestion ? 'md-pantry-option-active' : undefined}
                onPointerDown={event => event.preventDefault()} onClick={() => selectIngredient(ingredient.id)}
                onPointerMove={() => setActiveSuggestion(index)}>
                <span>{ingredient.name}</span><span aria-hidden="true">+</span>
              </li>
            ))}
          </ul>
          <p className="md-sr-only" role="status">{expanded ? ui.suggestions(suggestions.length) : ''}</p>
          {expanded && suggestions.length === 0 && <p className="md-pantry-no-ingredients">{t.pantryNoIngredientsFound}</p>}
        </div>
        {selectedIngredients.length > 0 && (
          <div className="md-pantry-selection">
            <h3 className="md-subtitle">{ui.selectedHeading}</h3>
            <div className="md-pantry-chips" role="group" aria-label={ui.selectedHeading}>
              {selectedIngredients.map(ingredient => (
                <button key={ingredient.id} type="button" className="md-pantry-chip md-pantry-chip-selected"
                  aria-label={`${ui.remove}: ${ingredient.name}`} onClick={() => toggle(ingredient.id)}>
                  <span aria-hidden="true">✓ </span>{ingredient.name}<span aria-hidden="true"> ×</span>
                </button>
              ))}
            </div>
          </div>
        )}

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

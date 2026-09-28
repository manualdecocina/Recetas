'use client';
import { useMemo, useState } from 'react';
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

interface Match {
  recipe: MdPantryRecipe;
  matched: number;
  missing: string[];
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
    results.push({
      recipe,
      matched: matched.length,
      missing: missingIds.map((id) => ingredientNameById.get(id) ?? '').filter(Boolean),
    });
  }
  results.sort((a, b) => {
    if (a.missing.length !== b.missing.length) return a.missing.length - b.missing.length;
    if (b.matched !== a.matched) return b.matched - a.matched;
    return a.recipe.title.localeCompare(b.recipe.title, 'es');
  });
  return results.slice(0, MAX_RESULTS);
}

export default function PantryMatchView({ ingredients, recipes }: { ingredients: MdPantryIngredient[]; recipes: MdPantryRecipe[] }) {
  const t = getMdCopy('es');
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [filter, setFilter] = useState('');

  const ingredientNameById = useMemo(() => new Map(ingredients.map((i) => [i.id, i.name])), [ingredients]);
  const filteredIngredients = useMemo(() => {
    const q = filter.trim().toLocaleLowerCase('es');
    if (!q) return ingredients;
    return ingredients.filter((i) => i.name.toLocaleLowerCase('es').includes(q));
  }, [ingredients, filter]);
  const matches = useMemo(() => computeMatches(recipes, selected, ingredientNameById), [recipes, selected, ingredientNameById]);

  function toggle(id: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  return (
    <main className="md-container" id="md-main">
      <header className="md-page-head">
        <p className="md-eyebrow">{t.pantryEyebrow}</p>
        <h1 className="md-display">{t.pantryToolHeading}</h1>
        <p className="md-lead md-page-intro">{t.pantryToolIntro}</p>
      </header>

      <section className="md-pantry-picker-section md-section" aria-labelledby="md-pantry-picker-heading">
        <div className="md-pantry-picker-head">
          <h2 className="md-title" id="md-pantry-picker-heading">{t.pantryPickerHeading}</h2>
          {selected.size > 0 && (
            <button type="button" className="md-button-quiet" onClick={() => setSelected(new Set())}>
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
      </section>

      <section className="md-section" aria-labelledby="md-pantry-results-heading">
        <div className="md-section-head">
          <h2 className="md-title" id="md-pantry-results-heading">{t.pantryResultsHeading}</h2>
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
            {matches.map(({ recipe, missing }) => (
              <div className="md-pantry-result" key={recipe.id}>
                <span className={`md-pantry-badge${missing.length === 0 ? ' md-pantry-badge-complete' : ''}`}>
                  {missing.length === 0 ? t.pantryComplete : `${missing.length} ${t.pantryMissingSuffix}`}
                </span>
                <RecipeCard recipe={recipe} />
                {missing.length > 0 && (
                  <p className="md-pantry-missing-list">{t.pantryMissingPrefix} {missing.join(', ')}</p>
                )}
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}

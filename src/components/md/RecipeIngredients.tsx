'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import type { MdIngredient, MdLanguage } from './md-types';
import { getMdCopy } from '@/lib/copy';

/**
 * Persistencia compatible con la versión anterior del sitio: misma clave
 * (`manualdecocina:ingredients:<id>`) y mismo formato, un objeto { [índice]: boolean }.
 * Así las casillas que un lector ya marcó siguen marcadas.
 */
export default function RecipeIngredients({ recipeId, lang, ingredients }: {
  recipeId: string;
  lang: MdLanguage;
  ingredients: MdIngredient[];
}) {
  const [checked, setChecked] = useState<Record<number, boolean>>({});
  const storageKey = `manualdecocina:ingredients:${recipeId}`;
  const t = getMdCopy(lang);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(storageKey);
      const value: unknown = raw ? JSON.parse(raw) : {};
      if (value && typeof value === 'object' && !Array.isArray(value)) setChecked(value as Record<number, boolean>);
    } catch { /* Las casillas siguen funcionando sin almacenamiento persistente. */ }
  }, [storageKey]);

  function toggle(index: number) {
    setChecked((previous) => {
      const next = { ...previous, [index]: !previous[index] };
      try { localStorage.setItem(storageKey, JSON.stringify(next)); } catch { /* Sin persistencia. */ }
      return next;
    });
  }

  return (
    <section className="md-recipe-section" id="md-ingredientes" aria-labelledby="md-ingredients-heading">
      <h2 className="md-title" id="md-ingredients-heading">{t.ingredients}</h2>
      <ul className="md-ingredient-checks">
        {ingredients.map((item, index) => {
          const amount = [item.amount, item.unit].filter(Boolean).join(' ');
          const showGroup = item.group && item.group !== ingredients[index - 1]?.group;
          return (
            <li key={`${recipeId}-ingredient-${index}`} className={showGroup ? 'md-ingredient-has-group' : undefined}>
              {showGroup && <h3 className="md-ingredient-group">{item.group}</h3>}
              <label className="md-ingredient-checkbox">
                <input type="checkbox" checked={Boolean(checked[index])} onChange={() => toggle(index)} />
                <span>
                  {amount && <span className="md-ingredient-amount">{amount} </span>}
                  {item.canonicalIngredientSlug && lang === 'es' ? (
                    <Link href={`/es/ingredientes/${item.canonicalIngredientSlug}`} onClick={(event) => event.stopPropagation()}>{item.name}</Link>
                  ) : item.name}
                  {item.preparation && <span>, {item.preparation}</span>}
                  {item.note && <small className="md-ingredient-note">{item.note}</small>}
                </span>
              </label>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

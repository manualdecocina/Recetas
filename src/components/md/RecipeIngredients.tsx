'use client';
import { useEffect, useState } from 'react';
import { useRecipeWorkspace, ServingsSelector } from './RecipeWorkspace';
import { PANTRY_EVENT } from '@/lib/shopping-list';
import Link from 'next/link';
import type { MdIngredient, MdLanguage } from './md-types';
import { getMdCopy } from '@/lib/copy';
import { ingredientDisplayName, ingredientDisplayPrefix } from '@/lib/recipe-ingredient-format';

/**
 * Persistencia compatible con la versión anterior del sitio: misma clave
 * (`manualdecocina:ingredients:<id>`) y mismo formato, un objeto { [índice]: boolean }.
 * Así las casillas que un lector ya marcó siguen marcadas.
 */
export default function RecipeIngredients({ recipeId, lang, ingredients: originalIngredients }: {
  recipeId: string;
  lang: MdLanguage;
  ingredients: MdIngredient[];
}) {
  const ingredients = useRecipeWorkspace()?.ingredients ?? originalIngredients;
  const [checked, setChecked] = useState<Record<number, boolean>>({});
  const storageKey = `manualdecocina:ingredients:${recipeId}`;
  const t = getMdCopy(lang);

  useEffect(() => {
    function restore() { try {
      const raw = localStorage.getItem(storageKey);
      const value: unknown = raw ? JSON.parse(raw) : {};
      const saved = value && typeof value === 'object' && !Array.isArray(value)
        ? value as Record<number, boolean>
        : {};

      const pantryRaw = localStorage.getItem('manualdecocina:pantry:selectedSlugs');
      const pantryValue: unknown = pantryRaw ? JSON.parse(pantryRaw) : [];
      const pantrySlugs = new Set(
        Array.isArray(pantryValue)
          ? pantryValue.filter((item): item is string => typeof item === 'string')
          : [],
      );

      const merged = { ...saved };
      originalIngredients.forEach((item, index) => {
        const slug = item.pantryIngredientSlug ?? item.canonicalIngredientSlug;
        if (slug) merged[item.storagePosition ?? index] = pantrySlugs.has(slug) || Boolean(item.pantryIngredientAliases?.some(alias => pantrySlugs.has(alias)));
      });
      setChecked(merged);
      localStorage.setItem(storageKey, JSON.stringify(merged));
    } catch { /* Las casillas siguen funcionando sin almacenamiento persistente. */ }
    }
    restore();
    window.addEventListener(PANTRY_EVENT, restore);
    window.addEventListener('storage', restore);
    return () => { window.removeEventListener(PANTRY_EVENT, restore); window.removeEventListener('storage', restore); };
  }, [storageKey, originalIngredients]);

  function toggle(index: number) {
    const previous = checked;
    {
      const storagePosition = ingredients[index]?.storagePosition ?? index;
      const nextValue = !previous[storagePosition];
      const next = { ...previous, [storagePosition]: nextValue };
      try {
        localStorage.setItem(storageKey, JSON.stringify(next));

        // Si el ingrediente tiene canonical slug, la casilla de la receta también actualiza
        // el inventario global de "¿Qué puedo cocinar?". Así herramienta y receta no se contradicen.
        const slug = ingredients[index]?.pantryIngredientSlug ?? ingredients[index]?.canonicalIngredientSlug;
        if (slug) {
          const pantryRaw = localStorage.getItem('manualdecocina:pantry:selectedSlugs');
          const pantryValue: unknown = pantryRaw ? JSON.parse(pantryRaw) : [];
          const pantrySlugs = new Set(
            Array.isArray(pantryValue)
              ? pantryValue.filter((item): item is string => typeof item === 'string')
              : [],
          );
          if (nextValue) pantrySlugs.add(slug);
          else {
            pantrySlugs.delete(slug);
            for (const alias of ingredients[index]?.pantryIngredientAliases ?? []) pantrySlugs.delete(alias);
          }
          localStorage.setItem('manualdecocina:pantry:selectedSlugs', JSON.stringify(Array.from(pantrySlugs)));
          window.dispatchEvent(new Event(PANTRY_EVENT));
        }
      } catch { /* Sin persistencia: la casilla actual sigue funcionando. */ }
      setChecked(next);
    }
  }

  return (
    <section className="md-recipe-section" id="md-ingredientes" aria-labelledby="md-ingredients-heading">
      <h2 className="md-title" id="md-ingredients-heading">{t.ingredients}</h2>
      <ServingsSelector lang={lang} />
      <ul className="md-ingredient-checks">
        {ingredients.map((item, index) => {
          const amount = ingredientDisplayPrefix(item, lang);
          const displayName = ingredientDisplayName(item, lang);
          const showGroup = item.group && item.group !== ingredients[index - 1]?.group;
          return (
            <li key={`${recipeId}-ingredient-${index}`} className={showGroup ? 'md-ingredient-has-group' : undefined}>
              {showGroup && <h3 className="md-ingredient-group">{item.group}</h3>}
              <label className="md-ingredient-checkbox">
                <input type="checkbox" checked={Boolean(checked[item.storagePosition ?? index])} onChange={() => toggle(index)} />
                <span>
                  {amount && <span className="md-ingredient-amount">{amount} </span>}
                  {item.canonicalIngredientSlug && lang === 'es' ? (
                    <Link href={`/es/ingredientes/${item.canonicalIngredientSlug}`} onClick={(event) => event.stopPropagation()}>{displayName}</Link>
                  ) : displayName}
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

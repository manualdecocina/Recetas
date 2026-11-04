'use client';
import { useMemo, useRef, useState, type ReactNode } from 'react';
import type { MdPantryIngredient } from '@/lib/md-data';
import { getMdCopy } from '@/lib/copy';
import { getPantryCopy } from '@/lib/pantry-copy';
import { ingredientSuggestions } from '@/lib/pantry-editorial';
import type { MdLanguage } from './md-types';

type Choice = Pick<MdPantryIngredient, 'id' | 'slug' | 'name' | 'aliases'>;
const EMPTY_SELECTION = new Set<string>();

export default function IngredientAutocomplete<T extends Choice>({
  lang, inputId, optionPrefix, ingredients, selected = EMPTY_SELECTION, help, limit, onSelect, renderOption,
}: {
  lang: MdLanguage;
  inputId: string;
  optionPrefix: string;
  ingredients: T[];
  selected?: Set<string>;
  help?: string;
  limit?: number;
  onSelect: (ingredient: T) => void;
  renderOption: (ingredient: T) => ReactNode;
}) {
  const t = getMdCopy(lang);
  const ui = getPantryCopy(lang);
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(-1);
  const input = useRef<HTMLInputElement>(null);
  const suggestions = useMemo(() => ingredientSuggestions(ingredients, query, selected, lang, limit), [ingredients, query, selected, lang, limit]);
  const showResults = open && query.trim().length > 0;
  const expanded = showResults && suggestions.length > 0;
  const listId = `${optionPrefix}-suggestions`;
  const optionId = (index: number) => `${optionPrefix}-option-${index}`;

  function select(index: number) {
    const ingredient = suggestions[index];
    if (!ingredient) return;
    setQuery('');
    setActive(-1);
    input.current?.focus();
    setOpen(false);
    onSelect(ingredient);
  }

  return <div className="md-pantry-autocomplete" onBlur={event => {
    if (!event.currentTarget.contains(event.relatedTarget)) setOpen(false);
  }}>
    <label className="md-search-label" htmlFor={inputId}>{ui.search}</label>
    {help && <p id={`${inputId}-help`} className="md-pantry-search-help">{help}</p>}
    <input
      ref={input}
      className="md-search-input md-pantry-filter"
      id={inputId}
      type="search"
      role="combobox"
      aria-autocomplete="list"
      aria-expanded={expanded}
      aria-controls={listId}
      aria-describedby={help ? `${inputId}-help` : undefined}
      aria-activedescendant={expanded && suggestions[active] ? optionId(active) : undefined}
      autoComplete="off"
      placeholder={t.pantrySearchPlaceholder}
      value={query}
      onFocus={() => setOpen(true)}
      onChange={event => { setQuery(event.target.value); setOpen(true); setActive(-1); }}
      onKeyDown={event => {
        if (event.key === 'Escape' && showResults) {
          event.preventDefault();
          setOpen(false);
          setActive(-1);
        }
        if ((event.key === 'ArrowDown' || event.key === 'ArrowUp') && suggestions.length) {
          event.preventDefault();
          setOpen(true);
          setActive(index => event.key === 'ArrowDown' ? (index + 1) % suggestions.length : (index <= 0 ? suggestions.length - 1 : index - 1));
        }
        if (event.key === 'Enter' && expanded) {
          event.preventDefault();
          select(Math.max(0, active));
        }
      }}
    />
    <ul id={listId} role="listbox" aria-label={ui.search} className="md-pantry-suggestions" hidden={!expanded}>
      {expanded && suggestions.map((ingredient, index) => (
        <li key={ingredient.id} id={optionId(index)} role="option" aria-selected={index === active}
          className={index === active ? 'md-pantry-option-active' : undefined}
          onPointerDown={event => event.preventDefault()} onClick={() => select(index)}
          onPointerMove={() => setActive(index)}>
          {renderOption(ingredient)}
        </li>
      ))}
    </ul>
    <p className="md-sr-only" role="status">{showResults && (suggestions.length ? ui.suggestions(suggestions.length) : t.pantryNoIngredientsFound)}</p>
    {showResults && suggestions.length === 0 && <p className="md-pantry-no-ingredients">{t.pantryNoIngredientsFound}</p>}
  </div>;
}

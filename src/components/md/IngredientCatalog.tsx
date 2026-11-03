'use client';
import { useMemo, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import type { MdLanguage } from './md-types';
import type { MdIngredientSummary } from './IngredientViews';
import { getPantryCopy } from '@/lib/pantry-copy';
import { getMdCopy } from '@/lib/copy';
import { countLabel } from '@/lib/plural';
import { normalizeIngredientSearch } from '@/lib/pantry-editorial';

export default function IngredientCatalog({ lang, ingredients }: { lang: MdLanguage; ingredients: MdIngredientSummary[] }) {
  const [query, setQuery] = useState('');
  const t = getMdCopy(lang);
  const matches = useMemo(() => {
    const words = normalizeIngredientSearch(query).split(' ').filter(Boolean);
    return ingredients.filter(i => words.every(word => normalizeIngredientSearch(`${i.name} ${i.slug === 'papas' ? 'papa papas patata patatas' : ''}`).includes(word)));
  }, [ingredients, query]);
  return <section className="md-section" aria-label={t.navIngredients}>
    <label className="md-search-label" htmlFor="md-ingredient-search">{getPantryCopy(lang).search}</label>
    <input id="md-ingredient-search" className="md-search-input md-ingredient-search" type="search" value={query} onChange={e => setQuery(e.target.value)} />
    <p className="md-muted" role="status">{t.navIngredients}: {matches.length} / {ingredients.length}</p>
    <div className="md-category-grid">
      {matches.map(item => <Link className={`md-category-card md-ingredient-card${item.image_url ? '' : ' md-ingredient-card-text'}`} href={`/${lang}/ingredientes/${item.slug}`} key={item.slug}>
        {item.image_url && <Image className="md-category-photo" src={item.image_url} alt={item.name} width={480} height={360} loading="lazy" sizes="(max-width: 599px) 50vw, (max-width: 899px) 33vw, 20vw" />}
        <span className="md-category-body"><strong className="md-category-name">{item.name}</strong><span className="md-category-count">{countLabel(lang, item.count ?? 0, 'recipe')}</span></span>
      </Link>)}
    </div>
    {matches.length === 0 && <p className="md-empty-block">{t.pantryNoIngredientsFound}</p>}
  </section>;
}

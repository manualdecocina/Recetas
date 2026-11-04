'use client';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import IngredientAutocomplete from './IngredientAutocomplete';
import type { MdLanguage } from './md-types';
import type { MdIngredientSummary } from './IngredientViews';
import { countLabel } from '@/lib/plural';

export default function IngredientCatalog({ lang, ingredients }: { lang: MdLanguage; ingredients: MdIngredientSummary[] }) {
  const router = useRouter();
  return <IngredientAutocomplete lang={lang} inputId="md-ingredient-search" optionPrefix="md-ingredient"
    ingredients={ingredients.map(ingredient => ({ ...ingredient, id: ingredient.slug }))} limit={6}
    onSelect={item => router.push(`/${lang}/ingredientes/${encodeURIComponent(item.slug)}`)}
    renderOption={item => <>
      <span className="md-ingredient-option">
        {item.image_url && <Image className="md-ingredient-option-photo" src={item.image_url} alt="" width={48} height={36} />}
        <strong>{item.name}</strong>
      </span>
      <span className="md-category-count">{countLabel(lang, item.count ?? 0, 'recipe')}</span>
    </>} />;
}

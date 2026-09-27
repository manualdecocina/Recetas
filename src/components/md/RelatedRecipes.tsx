import type { MdLanguage, MdRecipeCardData } from './md-types';
import { getMdCopy } from '@/lib/copy';
import RecipeCard from './RecipeCard';

export default function RelatedRecipes({ lang, recipes }: {
  lang: MdLanguage;
  recipes: MdRecipeCardData[];
}) {
  if (!recipes.length) return null;
  const t = getMdCopy(lang);
  return (
    <section className="md-section md-related" aria-labelledby="md-related-heading">
      <div className="md-container">
        <h2 className="md-title" id="md-related-heading">{t.relatedRecipes}</h2>
        <div className="md-card-grid">
          {recipes.map((recipe) => <RecipeCard key={recipe.id} recipe={recipe} />)}
        </div>
      </div>
    </section>
  );
}

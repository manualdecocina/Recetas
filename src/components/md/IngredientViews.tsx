import Link from 'next/link';
import type { MdRecipeCardData } from './md-types';
import { getMdCopy } from '@/lib/copy';
import SiteHeader from './SiteHeader';
import SiteFooter from './SiteFooter';
import RecipeCard from './RecipeCard';

/** Both ingredient routes exist only in Spanish per the supplied contract. */
export interface MdIngredientSummary {
  slug: string;
  name: string;
  count?: number;
}

export function IngredientsIndexView({ ingredients }: { ingredients: MdIngredientSummary[] }) {
  const t = getMdCopy('es');
  return (
    <div className="md-site" lang="es">
      <SiteHeader lang="es" />
      <main className="md-container" id="md-main">
        <header className="md-page-head"><h1 className="md-display">{t.ingredientCatalog}</h1></header>
        {ingredients.length > 0 ? (
          <nav className="md-ingredient-list md-section" aria-label={t.ingredientCatalog}>
            {ingredients.map((item) => <Link className="md-ingredient-link" href={`/es/ingredientes/${item.slug}`} key={item.slug}>{item.name}</Link>)}
          </nav>
        ) : (
          <div className="md-empty-block">
            <h2 className="md-subtitle">{t.emptyTitle}</h2><p>{t.emptyBody}</p>
            <Link className="md-button" href="/es/recetas">{t.seeAllRecipes}</Link>
          </div>
        )}
      </main>
      <SiteFooter lang="es" />
    </div>
  );
}

export function IngredientDetailView({ ingredient, description, recipes }: {
  ingredient: MdIngredientSummary;
  description?: string | null;
  recipes: MdRecipeCardData[];
}) {
  const t = getMdCopy('es');
  return (
    <div className="md-site" lang="es">
      <SiteHeader lang="es" />
      <main className="md-container" id="md-main">
        <header className="md-page-head"><p className="md-eyebrow">{t.recipesWithIngredient}</p><h1 className="md-display">{ingredient.name}</h1>
          {description && <p className="md-lead md-page-intro">{description}</p>}</header>
        {recipes.length > 0 ? (
          <div className="md-card-grid md-section">{recipes.map((recipe, index) => <RecipeCard key={recipe.id} recipe={recipe} priority={index === 0} />)}</div>
        ) : (
          <div className="md-empty-block">
            <h2 className="md-subtitle">{t.emptyTitle}</h2><p>{t.emptyBody}</p>
            <Link className="md-button" href="/es/recetas">{t.seeAllRecipes}</Link>
          </div>
        )}
      </main>
      <SiteFooter lang="es" />
    </div>
  );
}

import Link from 'next/link';
import Image from 'next/image';
import { recipeImageSrc } from '@/lib/recipe-media';
import type { MdRecipeCardData } from './md-types';
import { getMdCopy } from '@/lib/copy';
import SiteHeader from './SiteHeader';
import SiteFooter from './SiteFooter';
import RecipeCard from './RecipeCard';
import PantryBanner from './PantryBanner';
import Breadcrumbs from './Breadcrumbs';
import { countLabel } from '@/lib/plural';

/** Both ingredient routes exist only in Spanish per the supplied contract. */
export interface MdIngredientSummary {
  slug: string;
  name: string;
  /** Conteo real de recetas publicadas que lo usan (recipe_ingredients). */
  count?: number;
  /** Foto real de una de esas recetas; nunca inventada. Null si aún no hay ninguna. */
  image_url?: string | null;
}

export function IngredientsIndexView({ ingredients }: { ingredients: MdIngredientSummary[] }) {
  const t = getMdCopy('es');
  const withRecipes = ingredients.filter((item) => (item.count ?? 0) > 0);
  return (
    <div className="md-site" lang="es">
      <SiteHeader lang="es" />
      <main className="md-container" id="md-main">
        <header className="md-page-head">
          <h1 className="md-display">{t.ingredientCatalog}</h1>
          <p className="md-lead md-page-intro">{t.ingredientCatalogIntro}</p>
        </header>
        <PantryBanner lang="es" headingId="md-ingredient-pantry-cta" card />
        {withRecipes.length > 0 ? (
          <div className="md-category-grid md-section">
            {withRecipes.map((item) => (
              <Link className="md-category-card" href={`/es/ingredientes/${item.slug}`} key={item.slug}>
                {item.image_url ? (
                  <Image className="md-category-photo" src={recipeImageSrc(item.image_url)} alt="" width={360} height={270} loading="lazy"
                    sizes="(max-width: 599px) 50vw, (max-width: 899px) 33vw, 20vw" />
                ) : (
                  <span className="md-category-fallback" aria-hidden="true">
                    <img src="/brand/mark.png" alt="" width="42" height="42" />
                  </span>
                )}
                <span className="md-category-body">
                  <strong className="md-category-name">{item.name}</strong>
                  <span className="md-category-count">{countLabel('es', item.count ?? 0, 'recipe')}</span>
                </span>
              </Link>
            ))}
          </div>
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
        <header className="md-page-head">
          <Breadcrumbs items={[
            { name: 'Manual de Cocina', path: '/es' },
            { name: t.navIngredients, path: '/es/ingredientes' },
            { name: ingredient.name, path: `/es/ingredientes/${ingredient.slug}` },
          ]} />
          <p className="md-eyebrow">{t.recipesWithIngredient}</p><h1 className="md-display">{ingredient.name}</h1>
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

import Link from 'next/link';
import Image from 'next/image';
import { recipeImageSrc } from '@/lib/recipe-media';
import { SUPPORTED_LANGUAGES } from '@/types/recipe';
import { languageTag } from '@/lib/site';
import type { MdLanguage } from './md-types';
import type { MdRecipeCardData } from './md-types';
import { getMdCopy } from '@/lib/copy';
import SiteHeader from './SiteHeader';
import SiteFooter from './SiteFooter';
import RecipeCard from './RecipeCard';
import PantryBanner from './PantryBanner';
import Breadcrumbs from './Breadcrumbs';
import { countLabel } from '@/lib/plural';
import { taxonomyLanding } from '@/lib/taxonomy-landing-seo';

/** Canonical ingredient routes, with localized labels and published recipes. */
export interface MdIngredientSummary {
  slug: string;
  name: string;
  /** Conteo real de recetas publicadas que lo usan (recipe_ingredients). */
  count?: number;
  /** Foto real de una de esas recetas; nunca inventada. Null si aún no hay ninguna. */
  image_url?: string | null;
}

export function IngredientsIndexView({ lang, ingredients }: { lang: MdLanguage; ingredients: MdIngredientSummary[] }) {
  const t = getMdCopy(lang);
  const withRecipes = ingredients.filter((item) => (item.count ?? 0) > 0);
  return (
    <div className="md-site" lang={languageTag(lang)}>
      <SiteHeader lang={lang} alternates={Object.fromEntries(SUPPORTED_LANGUAGES.map((l) => [l, `/${l}/ingredientes`]))} />
      <main className="md-container" id="md-main">
        <header className="md-page-head">
          <h1 className="md-display">{t.ingredientCatalog}</h1>
          <p className="md-lead md-page-intro">{t.ingredientCatalogIntro}</p>
        </header>
        <PantryBanner lang={lang} headingId="md-ingredient-pantry-cta" card />
        {withRecipes.length > 0 ? (
          <div className="md-category-grid md-section">
            {withRecipes.map((item) => (
              <Link className="md-category-card" href={`/${lang}/ingredientes/${item.slug}`} key={item.slug}>
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
                  <span className="md-category-count">{countLabel(lang, item.count ?? 0, 'recipe')}</span>
                </span>
              </Link>
            ))}
          </div>
        ) : (
          <div className="md-empty-block">
            <h2 className="md-subtitle">{t.emptyTitle}</h2><p>{t.emptyBody}</p>
            <Link className="md-button" href={`/${lang}/recetas`}>{t.seeAllRecipes}</Link>
          </div>
        )}
      </main>
      <SiteFooter lang={lang} />
    </div>
  );
}

export function IngredientDetailView({ lang, ingredient, description, recipes }: {
  lang: MdLanguage;
  ingredient: MdIngredientSummary;
  description?: string | null;
  recipes: MdRecipeCardData[];
}) {
  const t = getMdCopy(lang);
  const landing = taxonomyLanding('ingredient', lang, ingredient.name, recipes.length);
  return (
    <div className="md-site" lang={languageTag(lang)}>
      <SiteHeader lang={lang} alternates={Object.fromEntries(SUPPORTED_LANGUAGES.map((l) => [l, `/${l}/ingredientes/${ingredient.slug}`]))} />
      <main className="md-container" id="md-main">
        <header className="md-page-head">
          <Breadcrumbs items={[
            { name: 'Manual de Cocina', path: `/${lang}` },
            { name: t.navIngredients, path: `/${lang}/ingredientes` },
            { name: ingredient.name, path: `/${lang}/ingredientes/${ingredient.slug}` },
          ]} />
          <p className="md-eyebrow">{t.recipesWithIngredient}</p><h1 className="md-display">{ingredient.name}</h1>
          {description && <p className="md-lead md-page-intro">{description}</p>}
          <p className="md-lead md-page-intro">{landing.intro}</p>
        </header>
        <h2 className="md-subtitle">{landing.heading}</h2>
        {recipes.length > 0 ? (
          <div className="md-card-grid md-section">{recipes.map((recipe, index) => <RecipeCard key={recipe.id} recipe={recipe} priority={index === 0} />)}</div>
        ) : (
          <div className="md-empty-block">
            <h2 className="md-subtitle">{t.emptyTitle}</h2><p>{t.emptyBody}</p>
            <Link className="md-button" href={`/${lang}/recetas`}>{t.seeAllRecipes}</Link>
          </div>
        )}
      </main>
      <SiteFooter lang={lang} />
    </div>
  );
}

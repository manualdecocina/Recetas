import Link from 'next/link';
import Image from 'next/image';
import IngredientCatalog from './IngredientCatalog';
import { ingredientPhoto, photoCreditsLabel } from '@/lib/ingredient-photos';
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
import { featuredIngredients, INGREDIENT_PAGE_SIZE, ingredientDirectoryCopy, ingredientDirectoryPath } from '@/lib/ingredient-discovery';

/** Canonical ingredient routes, with localized labels and published recipes. */
export interface MdIngredientSummary {
  slug: string;
  name: string;
  /** Conteo real de recetas publicadas que lo usan (recipe_ingredients). */
  count?: number;
  aliases?: string[];
  /** Fotografía verificada del alimento. Nunca una receta que lo contenga. */
  image_url?: string | null;
}

function IngredientPhotoCredits({ lang, ingredients }: { lang: MdLanguage; ingredients: MdIngredientSummary[] }) {
  const credits = ingredients.flatMap(item => {
    const photo = ingredientPhoto(item.slug);
    return photo ? [<li key={item.slug}>{item.name} · <a href={photo.source} target="_blank" rel="noopener noreferrer">{photo.author}</a> · <a href={photo.licenseUrl} target="_blank" rel="noopener noreferrer">{photo.license}</a></li>] : [];
  });
  return credits.length > 0 && <details className="md-photo-credits">
    <summary>{photoCreditsLabel[lang]}</summary>
    <ul>{credits}</ul>
  </details>;
}

export function IngredientsIndexView({ lang, ingredients, page }: { lang: MdLanguage; ingredients: MdIngredientSummary[]; page: number }) {
  const t = getMdCopy(lang);
  const [featuredLabel, allLabel, pageLabel] = ingredientDirectoryCopy[lang];
  const start = (page - 1) * INGREDIENT_PAGE_SIZE;
  const visible = page ? ingredients.slice(start, start + INGREDIENT_PAGE_SIZE) : featuredIngredients(ingredients);
  const pages = Math.ceil(ingredients.length / INGREDIENT_PAGE_SIZE);
  return (
    <div className="md-site" lang={languageTag(lang)}>
      <SiteHeader lang={lang} alternates={Object.fromEntries(SUPPORTED_LANGUAGES.map(l => [l, ingredientDirectoryPath(l)]))} />
      <main className="md-container" id="md-main">
        <header className="md-page-head">
          <h1 className="md-display">{t.ingredientCatalog}</h1>
          <p className="md-lead md-page-intro">{t.ingredientCatalogIntro}</p>
        </header>
        {visible.length > 0 ? (
          <section className="md-section" aria-labelledby="md-ingredient-grid-heading">
            <IngredientCatalog lang={lang} ingredients={ingredients} />
            <div className="md-section-head md-ingredient-grid-head">
              <h2 className="md-subtitle" id="md-ingredient-grid-heading">{page ? t.ingredientCatalog : featuredLabel}</h2>
              {page === 0 && <Link className="md-button-quiet" href={ingredientDirectoryPath(lang, 1)} prefetch={false}>{allLabel}</Link>}
            </div>
            <div className="md-category-grid">
              {visible.map(item => (
                <Link className={`md-category-card md-ingredient-card${item.image_url ? '' : ' md-ingredient-card-text'}`}
                  href={`/${lang}/ingredientes/${encodeURIComponent(item.slug)}`} key={item.slug} prefetch={false}>
                  {item.image_url && <Image className="md-category-photo" src={item.image_url} alt="" width={480} height={360} loading="lazy" sizes="(max-width: 599px) 50vw, (max-width: 899px) 33vw, 20vw" />}
                  <span className="md-category-body"><strong className="md-category-name">{item.name}</strong><span className="md-category-count">{countLabel(lang, item.count ?? 0, 'recipe')}</span></span>
                </Link>
              ))}
            </div>
            {page > 0 && pages > 1 && (
              <nav className="md-ingredient-pagination" aria-label={t.ingredientCatalog}>
                {page > 1 && <Link className="md-button-quiet" href={ingredientDirectoryPath(lang, page - 1)} prefetch={false}>{t.previousPage}</Link>}
                <span aria-current="page">{pageLabel} {page} / {pages}</span>
                {page < pages && <Link className="md-button-quiet" href={ingredientDirectoryPath(lang, page + 1)} prefetch={false}>{t.nextPage}</Link>}
              </nav>
            )}
            <IngredientPhotoCredits lang={lang} ingredients={visible} />
          </section>
        ) : (
          <div className="md-empty-block">
            <h2 className="md-subtitle">{t.emptyTitle}</h2><p>{t.emptyBody}</p>
            <Link className="md-button" href={`/${lang}/recetas`}>{t.seeAllRecipes}</Link>
          </div>
        )}
        <PantryBanner lang={lang} headingId="md-ingredient-pantry-cta" card />
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
          <Breadcrumbs lang={lang} items={[
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
        <IngredientPhotoCredits lang={lang} ingredients={[ingredient]} />
      </main>
      <SiteFooter lang={lang} />
    </div>
  );
}

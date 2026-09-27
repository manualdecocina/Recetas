import Image from 'next/image';
import Link from 'next/link';
import { MD_CATEGORIES, type MdRecipe, type MdRecipeCardData } from './md-types';
import { getMdCopy } from '@/lib/copy';
import RecipeIngredients from './RecipeIngredients';
import RecipeCookingMode from './RecipeCookingMode';
import FavoriteButton from './FavoriteButton';
import SharePrintActions from './SharePrintActions';
import AdSlot from './AdSlot';
import RelatedRecipes from './RelatedRecipes';

/**
 * Capa visual de la receta. NO contiene JSON-LD, migas de pan, canonical ni hreflang:
 * eso vive en RecipeDocument.tsx, que monta este componente. Aquí hay un único <h1>.
 * `notesHtml` llega ya saneado (cleanHtml en RecipeDocument).
 */
export default function RecipeDocumentVisual({ recipe, relatedRecipes = [], notesHtml }: {
  recipe: MdRecipe;
  relatedRecipes?: MdRecipeCardData[];
  notesHtml?: string | null;
}) {
  const t = getMdCopy(recipe.language);
  const computedTotal = recipe.total_time_minutes ?? (
    recipe.prep_time_minutes != null && recipe.cook_time_minutes != null
      ? recipe.prep_time_minutes + recipe.cook_time_minutes : null
  );
  const facts = [
    computedTotal != null && computedTotal > 0 ? { label: t.totalTime, value: `${computedTotal} min` } : null,
    recipe.servings != null && recipe.servings > 0 ? { label: t.servings, value: String(recipe.servings) } : null,
    recipe.difficulty ? { label: t.difficulty, value: recipe.difficulty } : null,
    recipe.cuisine ? { label: t.cuisine, value: recipe.cuisine } : null,
  ].filter((value): value is { label: string; value: string } => value !== null);

  const categorySlug = MD_CATEGORIES.find((item) => item.label === recipe.category)?.slug;
  const lang = recipe.language;

  return (
    <>
      <article className="md-article">
        <header className="md-container md-recipe-hero">
          <div className="md-recipe-hero-copy">
            <nav className="md-crumbs" aria-label="Breadcrumb">
              <Link href={`/${lang}`}>Manual de Cocina</Link><span aria-hidden="true">/</span>
              <Link href={`/${lang}/recetas`}>{t.navRecipes}</Link>
              {recipe.category && categorySlug && <><span aria-hidden="true">/</span><Link href={`/${lang}/categorias/${categorySlug}`}>{recipe.category}</Link></>}
            </nav>
            {recipe.category && <p className="md-eyebrow">{recipe.category}</p>}
            <h1 className="md-display">{recipe.title}</h1>
            {recipe.excerpt && <p className="md-lead">{recipe.excerpt}</p>}
            {facts.length > 0 && <dl className="md-recipe-facts">{facts.map((fact) => (
              <div className="md-recipe-fact" key={fact.label}><dt>{fact.label}</dt><dd>{fact.value}</dd></div>
            ))}</dl>}
            <div className="md-article-actions">
              <RecipeCookingMode lang={lang} steps={recipe.steps} />
              <FavoriteButton recipeId={recipe.id} lang={lang} />
              <SharePrintActions lang={lang} title={recipe.title} />
            </div>
          </div>
          {recipe.image_url && (
            <figure className="md-recipe-hero-photo">
              <Image
                src={recipe.image_url}
                alt={`${t.photoOf} ${recipe.title}`}
                width={1200}
                height={1000}
                sizes="(max-width: 900px) 100vw, 560px"
                priority
              />
            </figure>
          )}
        </header>
        <div className="md-container md-recipe-wrap">
          <div className="md-recipe-body">
            {recipe.ingredients.length > 0 && <div className="md-recipe-side">
              <RecipeIngredients recipeId={recipe.id} lang={lang} ingredients={recipe.ingredients} />
              <AdSlot placement="after-ingredients" />
            </div>}
            {recipe.steps.length > 0 && (
              <section className="md-recipe-section" id="md-preparacion" aria-labelledby="md-preparation-heading">
                <h2 className="md-title" id="md-preparation-heading">{t.preparation}</h2>
                <ol className="md-step-list">{recipe.steps.map((step, index) => (
                  <li className="md-step-item" key={`${recipe.id}-step-${index}`}>
                    <span className="md-step-count" aria-hidden="true">{index + 1}</span>
                    <div className="md-step-text"><h3>{step.title || `${t.step} ${index + 1}`}</h3><p>{step.content}</p></div>
                  </li>
                ))}</ol>
              </section>
            )}
            {notesHtml && <section className="md-notes" id="md-notas" aria-labelledby="md-notes-heading">
              <h2 className="md-title" id="md-notes-heading">{t.notes}</h2>
              <div className="md-rich" dangerouslySetInnerHTML={{ __html: notesHtml }} />
            </section>}
            {notesHtml && <AdSlot placement="after-notes" />}
          </div>
        </div>
      </article>
      <RelatedRecipes lang={lang} recipes={relatedRecipes} />
    </>
  );
}

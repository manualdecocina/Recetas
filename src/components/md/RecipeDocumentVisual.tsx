import Image from 'next/image';
import type { MdRecipe, MdRecipeCardData } from './md-types';
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
 * `editorialHtml` y `notesHtml` llegan ya saneados (cleanHtml en RecipeDocument).
 */
export default function RecipeDocumentVisual({ recipe, relatedRecipes = [], editorialHtml, notesHtml }: {
  recipe: MdRecipe;
  relatedRecipes?: MdRecipeCardData[];
  editorialHtml?: string | null;
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

  return (
    <>
      <article className="md-article">
        <header className="md-reading md-article-head">
          {recipe.category && <p className="md-eyebrow">{recipe.category}</p>}
          <h1 className="md-display">{recipe.title}</h1>
          {recipe.excerpt && <p className="md-lead">{recipe.excerpt}</p>}
        </header>
        {recipe.image_url && (
          <figure className="md-article-cover">
            <Image
              src={recipe.image_url}
              alt={`${t.photoOf} ${recipe.title}`}
              width={1400}
              height={930}
              sizes="(max-width: 1200px) 100vw, 1200px"
              priority
            />
          </figure>
        )}
        <div className="md-container md-recipe-wrap">
          {facts.length > 0 && <dl className="md-recipe-facts">{facts.map((fact) => (
            <div className="md-recipe-fact" key={fact.label}><dt>{fact.label}</dt><dd>{fact.value}</dd></div>
          ))}</dl>}
          <div className="md-article-actions">
            <FavoriteButton recipeId={recipe.id} lang={recipe.language} />
            <SharePrintActions lang={recipe.language} title={recipe.title} />
            <RecipeCookingMode lang={recipe.language} steps={recipe.steps} />
          </div>
          <nav className="md-article-toc" aria-label={t.recipeContents}>
            {recipe.ingredients.length > 0 && <a href="#md-ingredientes">{t.ingredients}</a>}
            {recipe.steps.length > 0 && <a href="#md-preparacion">{t.preparation}</a>}
            {notesHtml && <a href="#md-notas">{t.notes}</a>}
          </nav>
          {editorialHtml && (
            <aside className="md-keypoint">
              <h2 className="md-subtitle">{t.keyPoint}</h2>
              <div className="md-rich" dangerouslySetInnerHTML={{ __html: editorialHtml }} />
            </aside>
          )}
          <div className="md-recipe-body">
            {recipe.ingredients.length > 0 && <div className="md-recipe-side">
              <RecipeIngredients recipeId={recipe.id} lang={recipe.language} ingredients={recipe.ingredients} />
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
            {notesHtml && <section className="md-recipe-section md-notes" id="md-notas" aria-labelledby="md-notes-heading">
              <h2 className="md-title" id="md-notes-heading">{t.notes}</h2>
              <div className="md-rich" dangerouslySetInnerHTML={{ __html: notesHtml }} />
            </section>}
            {notesHtml && <AdSlot placement="after-notes" />}
          </div>
        </div>
      </article>
      <RelatedRecipes lang={recipe.language} recipes={relatedRecipes} />
    </>
  );
}

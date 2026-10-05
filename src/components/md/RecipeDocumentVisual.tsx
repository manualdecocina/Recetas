import Image from 'next/image';
import { recipeImageSrc } from '@/lib/recipe-media';
import Link from 'next/link';
import type { MdRecipe, MdRecipeCardData } from './md-types';
import { categorySlugFromLabel } from '@/lib/categories';
import { getMdCopy } from '@/lib/copy';
import RecipeIngredients from './RecipeIngredients';
import RecipeCookingMode from './RecipeCookingMode';
import FavoriteButton from './FavoriteButton';
import RatingWidget from './RatingWidget';
import SharePrintActions from './SharePrintActions';
import AdSlot from './AdSlot';
import RelatedRecipes from './RelatedRecipes';
import { parseVideo } from '@/lib/video';
import VideoFacade from './VideoFacade';
import StepPhoto from './StepPhoto';
import PantryBanner from './PantryBanner';
import { RECIPE_AUTHOR, publicUrl } from '@/lib/site';

const LOCALES: Record<string, string> = { es: 'es-ES', en: 'en-GB', de: 'de-DE', it: 'it-IT', fr: 'fr-FR', ja: 'ja-JP', pt: 'pt-BR' };

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
  const ratingsEnabled = process.env.NEXT_PUBLIC_RATINGS_ENABLED === 'true';
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

  const lang = recipe.language;
  // `recipe.category` está traducido a este idioma; buscar el slug con la etiqueta
  // española fija fallaba siempre fuera de /es (categorySlug quedaba undefined).
  const categorySlug = categorySlugFromLabel(lang, recipe.category);
  const updated = new Intl.DateTimeFormat(LOCALES[lang] ?? 'es-ES', { dateStyle: 'long', timeZone: 'UTC' }).format(new Date(recipe.updated_at));
  const seo = (recipe.seo ?? {}) as Record<string, unknown>;
  const faq = Array.isArray(seo.faq) ? (seo.faq as Array<{ q?: string; a?: string }>).filter((f) => f?.q && f?.a) : [];
  const video = parseVideo(recipe.video_urls?.[0]);
  const videoPoster = typeof seo.video_poster === 'string' ? seo.video_poster : recipe.image_url;
  const hasStepPhotos = recipe.steps.some((s) => s.image_url);
  const nutrition = (recipe.nutrition ?? {}) as Record<string, unknown>;
  const nv = (k: string) => (typeof nutrition[k] === 'number' ? (nutrition[k] as number) : null);
  const calories = nv('calories');
  const nutritionRows = [
    [t.protein, nv('protein_g'), 'g'], [t.carbs, nv('carbs_g'), 'g'], [t.fat, nv('fat_g'), 'g'],
    [t.saturatedFat, nv('saturated_fat_g'), 'g'], [t.fiber, nv('fiber_g'), 'g'], [t.sugars, nv('sugar_g'), 'g'],
    [t.sodium, nv('sodium_mg'), 'mg'],
  ].filter((r): r is [string, number, string] => r[1] !== null);
  const nutritionNote = typeof nutrition.note === 'string' ? nutrition.note : t.nutritionEstimated;
  const nutritionSource = typeof nutrition.source === 'string' ? nutrition.source : null;
  const nutritionSourceUrl = nutritionSource?.includes('USDA FoodData Central') ? 'https://fdc.nal.usda.gov/' : null;
  const summaryParagraphs = (recipe.summary ?? '').split(/\n{2,}/).map((x) => x.trim()).filter(Boolean);

  return (
    <>
      <article className="md-article">
        <div className="md-print-brand" aria-hidden="true">
          <img src="/brand/logo-manual-de-cocina.png" alt="" width="640" height="188" />
          <span>manualdecocina.com</span>
        </div>
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
            <p className="md-byline">{t.writtenBy} <Link href={`/${lang}/quienes-somos`} rel="author">{RECIPE_AUTHOR.name}</Link> · {t.updatedOn} <time dateTime={recipe.updated_at}>{updated}</time></p>
            {facts.length > 0 && <dl className="md-recipe-facts">{facts.map((fact) => (
              <div className="md-recipe-fact" key={fact.label}><dt>{fact.label}</dt><dd>{fact.value}</dd></div>
            ))}</dl>}
            {ratingsEnabled && <RatingWidget recipeId={recipe.id} lang={lang} ratingCount={recipe.rating_count ?? 0} ratingSum={recipe.rating_sum ?? 0} />}
            <div className="md-article-actions">
              <RecipeCookingMode lang={lang} steps={recipe.steps} />
              <FavoriteButton recipeId={recipe.id} lang={lang} />
              <SharePrintActions lang={lang} title={recipe.title} />
            </div>
          </div>
          {recipe.image_url && (
            <figure className="md-recipe-hero-photo">
              <Image
                src={recipeImageSrc(recipe.image_url)}
                alt={`${t.photoOf} ${recipe.title}`}
                width={1200}
                height={1000}
                sizes="(max-width: 900px) calc(100vw - 36px), 560px"
                fetchPriority="high"
                loading="eager"
                quality={70}
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
                  <li className={`md-step-item${step.image_url ? ' has-photo' : ''}`} id={`paso-${index + 1}`} key={`${recipe.id}-step-${index}`}>
                    <span className="md-step-count" aria-hidden="true">{index + 1}</span>
                    <div className="md-step-text"><h3>{step.title || `${t.step} ${index + 1}`}</h3><p>{step.content}</p></div>
                    {step.image_url && <StepPhoto src={step.image_url} alt={step.image_alt || step.title || `${t.step} ${index + 1}`} closeLabel={t.close} />}
                  </li>
                ))}</ol>
                {hasStepPhotos && <p className="md-step-photos-note">{t.stepPhotosNote}</p>}
              </section>
            )}
          </div>
          <div className="md-recipe-after">
            {/* Orden fijo pedido: notas justo tras la preparación, luego nutrición, video,
                "sobre esta receta" (E-E-A-T) y al final las preguntas frecuentes. */}
            {notesHtml && <section className="md-notes" id="md-notas" aria-labelledby="md-notes-heading">
              <h2 className="md-title" id="md-notes-heading">{t.notes}</h2>
              <div className="md-rich" dangerouslySetInnerHTML={{ __html: notesHtml }} />
            </section>}
            {calories !== null && (
              <section className="md-nutrition" id="md-nutricion" aria-labelledby="md-nutrition-heading">
                <div className="md-nutrition-head">
                  <h2 className="md-title" id="md-nutrition-heading">{t.nutritionTitle}</h2>
                  <p className="md-nutrition-serving">{typeof nutrition.serving_size === 'string' ? nutrition.serving_size : t.perServing}</p>
                </div>
                <div className="md-nutrition-body">
                  <div className="md-nutrition-cal"><strong>{calories}</strong><span>{t.calories} · kcal</span></div>
                  <dl className="md-nutrition-grid">
                    {nutritionRows.map(([label, value, unit]) => (
                      <div key={label}><dt>{label}</dt><dd>{value} {unit}</dd></div>
                    ))}
                  </dl>
                </div>
                <p className="md-nutrition-note">{nutritionNote}</p>
                {nutritionSource && (
                  <p className="md-nutrition-source">
                    <strong>{t.nutritionSourceLabel}:</strong>{' '}
                    {nutritionSourceUrl ? (
                      <a href={nutritionSourceUrl} target="_blank" rel="noopener noreferrer">{nutritionSource}</a>
                    ) : nutritionSource}
                  </p>
                )}
                <p className="md-nutrition-disclaimer">{t.nutritionDisclaimer}</p>
              </section>
            )}
            {video && (
              <section className="md-video" id="md-video" aria-labelledby="md-video-heading">
                <h2 className="md-title" id="md-video-heading">{t.videoTitle}</h2>
                <VideoFacade embedUrl={video.embedUrl} title={`${t.videoTitle}: ${recipe.title}`} posterUrl={videoPoster} playLabel={t.playVideo} />
              </section>
            )}
            {summaryParagraphs.length > 0 && (
              <section className="md-about md-rich" id="md-sobre" aria-labelledby="md-about-heading">
                <h2 className="md-title" id="md-about-heading">{t.aboutRecipe}</h2>
                {summaryParagraphs.map((paragraph, i) => <p key={i}>{paragraph}</p>)}
              </section>
            )}
            {faq.length > 0 && (
              <section className="md-faq" id="md-faq" aria-labelledby="md-faq-heading">
                <h2 className="md-title" id="md-faq-heading">{t.faqTitle}</h2>
                {faq.map((item, i) => <details key={i}><summary>{item.q}</summary><p>{item.a}</p></details>)}
              </section>
            )}
            {lang === 'es' && <PantryBanner lang="es" headingId="md-recipe-pantry-cta" card />}
            {notesHtml && <AdSlot placement="after-notes" />}
          </div>
        </div>
        <div className="md-print-foot" aria-hidden="true">
          <span>{recipe.title} · {RECIPE_AUTHOR.name}</span>
          <span>{publicUrl(recipe.public_path)}</span>
        </div>
      </article>
      <RelatedRecipes lang={lang} recipes={relatedRecipes} />
    </>
  );
}

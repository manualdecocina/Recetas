import Link from 'next/link';
import Image from 'next/image';
import { recipeImageSrc } from '@/lib/recipe-media';
import type { MdLanguage, MdRecipeCardData } from './md-types';
import type { MdCategorySummary } from './CategoryViews';
import type { MdIngredientSummary } from './IngredientViews';
import { getMdCopy } from '@/lib/copy';
import { publicPathHref, languageTag } from '@/lib/site';
import SiteHeader from './SiteHeader';
import SiteFooter from './SiteFooter';
import RecipeCard from './RecipeCard';
import { CategoryGrid } from './CategoryViews';
import PantryBanner from './PantryBanner';

export interface MdHomeData {
  /** Use only an actual published recipe of the requested language. */
  featured: MdRecipeCardData | null;
  /** Latest publications in editorial order, excluding the featured recipe. */
  latest: MdRecipeCardData[];
  /** Actual category count and a real representative recipe image, nullable. */
  categories: MdCategorySummary[];
  /** Canonical ingredient slugs with localized display names. */
  ingredients: MdIngredientSummary[];
}

/** Fully typed presentational home. DB calls remain in the existing route. */
export default function HomePageView({ lang, data }: { lang: MdLanguage; data: MdHomeData }) {
  const t = getMdCopy(lang);
  return (
    <div className="md-site" lang={languageTag(lang)}>
      <SiteHeader lang={lang} />
      <main id="md-main">
        <section className="md-home-hero" aria-labelledby="md-home-heading">
          <div className="md-home-hero-copy">
            <p className="md-eyebrow">Manual de Cocina</p>
            <h1 className="md-display" id="md-home-heading">{t.homeHeading}</h1>
            <p className="md-lead">{t.homeLead}</p>
            <Link className="md-button" href={`/${lang}/recetas`}>{t.seeAllRecipes}</Link>
          </div>
          {data.featured && (
            <figure className="md-home-hero-figure">
              <Link href={publicPathHref(data.featured.public_path)} tabIndex={-1}>
                {data.featured.image_url ? <Image className="md-home-hero-photo" src={recipeImageSrc(data.featured.image_url)}
                  alt={`${t.photoOf} ${data.featured.title}`} width={900} height={675}
                  fetchPriority="high" loading="eager" quality={70}
                  sizes="(max-width: 899px) calc(100vw - 36px), 55vw" /> : (
                  <span className="md-home-hero-fallback"><img src="/brand/mark.png" alt="" width="75" height="75" /></span>
                )}
              </Link>
              <figcaption className="md-home-hero-caption">
                <span className="md-eyebrow">{t.featured}</span>
                <Link href={publicPathHref(data.featured.public_path)}>{data.featured.title}</Link>
              </figcaption>
            </figure>
          )}
        </section>
        {<PantryBanner lang={lang} headingId="md-pantry-banner-heading" container />}
        {data.latest.length > 0 && <section className="md-section" aria-labelledby="md-latest-heading">
          <div className="md-container">
            <div className="md-section-head"><div><p className="md-eyebrow">{t.navRecipes}</p>
              <h2 className="md-title" id="md-latest-heading">{t.latest}</h2></div>
              <Link className="md-link" href={`/${lang}/recetas`}>{t.seeAllRecipes}</Link></div>
            <div className="md-card-grid">{data.latest.map((recipe) => <RecipeCard key={recipe.id} recipe={recipe} />)}</div>
          </div>
        </section>}
        {data.categories.length > 0 && <section className="md-section" aria-labelledby="md-categories-heading">
          <div className="md-container"><div className="md-section-head"><h2 className="md-title" id="md-categories-heading">{t.browseCategories}</h2>
            <Link className="md-link" href={`/${lang}/categorias`}>{t.seeAllCategories}</Link></div>
            <CategoryGrid lang={lang} categories={data.categories} />
          </div>
        </section>}
        {data.ingredients.length > 0 && <section className="md-section" aria-labelledby="md-ingredients-heading-home">
          <div className="md-container"><div className="md-section-head"><h2 className="md-title" id="md-ingredients-heading-home">{t.browseIngredients}</h2>
            <Link className="md-link" href={`/${lang}/ingredientes`}>{t.seeAllIngredients}</Link></div>
            <nav className="md-ingredient-list" aria-label={t.browseIngredients}>
              {data.ingredients.map((item) => <Link className="md-ingredient-link" key={item.slug} href={`/${lang}/ingredientes/${item.slug}`}>{item.name}</Link>)}
            </nav>
          </div>
        </section>}
        <aside className="md-section md-editorial">
          <div className="md-container md-editorial-grid">
            <div className="md-editorial-box md-editorial-copy">
              <p className="md-eyebrow">Manual de Cocina</p>
              <h2 className="md-title">{t.editorialTitle}</h2>
              <p className="md-lead">{t.editorialBody}</p>
              <ul className="md-editorial-points">
                <li>{t.editorialPoint1}</li>
                <li>{t.editorialPoint2}</li>
                <li>{t.editorialPoint3}</li>
                <li>{t.editorialPoint4}</li>
              </ul>
            </div>
            <Link className="md-editorial-box md-editorial-author" href={`/${lang}/quienes-somos`}>
              <Image className="md-editorial-author-photo" src="/autor/nestor-bastidas.webp" alt="" width={480} height={360}
                sizes="(max-width: 780px) 100vw, 460px" />
              <div className="md-editorial-author-text">
                <strong>Néstor Bastidas</strong>
                <span className="md-editorial-author-role">{t.editorialAuthorRole}</span>
                <p>{t.editorialAuthorBlurb}</p>
                <span className="md-link">{t.editorialAuthorCta}</span>
              </div>
            </Link>
          </div>
        </aside>
      </main>
      <SiteFooter lang={lang} />
    </div>
  );
}

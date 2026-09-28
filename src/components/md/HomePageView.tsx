import Link from 'next/link';
import Image from 'next/image';
import type { MdLanguage, MdRecipeCardData } from './md-types';
import type { MdCategorySummary } from './CategoryViews';
import type { MdIngredientSummary } from './IngredientViews';
import { getMdCopy } from '@/lib/copy';
import { normalizePublicPath } from '@/lib/site';
import SiteHeader from './SiteHeader';
import SiteFooter from './SiteFooter';
import RecipeCard from './RecipeCard';
import { CategoryGrid } from './CategoryViews';

export interface MdHomeData {
  /** Use only an actual published recipe of the requested language. */
  featured: MdRecipeCardData | null;
  /** Actual publication date DESC, e.g. eight rows; exclude featured if desired. */
  latest: MdRecipeCardData[];
  /** Actual category count and a real representative recipe image, nullable. */
  categories: MdCategorySummary[];
  /** Only when lang === 'es'; real ingredient slugs and names. */
  ingredients: MdIngredientSummary[];
}

/** Fully typed presentational home. DB calls remain in the existing route. */
export default function HomePageView({ lang, data }: { lang: MdLanguage; data: MdHomeData }) {
  const t = getMdCopy(lang);
  return (
    <div className="md-site" lang={lang}>
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
              <Link href={normalizePublicPath(data.featured.public_path)} tabIndex={-1}>
                {data.featured.image_url ? <Image className="md-home-hero-photo" src={data.featured.image_url}
                  alt={`${t.photoOf} ${data.featured.title}`} width={900} height={675} priority
                  sizes="(max-width: 899px) 100vw, 55vw" /> : (
                  <span className="md-home-hero-fallback"><img src="/brand/mark.png" alt="" width="75" height="75" /></span>
                )}
              </Link>
              <figcaption className="md-home-hero-caption">
                <span className="md-eyebrow">{t.featured}</span>
                <Link href={normalizePublicPath(data.featured.public_path)}>{data.featured.title}</Link>
              </figcaption>
            </figure>
          )}
        </section>
        {lang === 'es' && (
          <section className="md-pantry-banner" aria-labelledby="md-pantry-banner-heading">
            <div className="md-container md-pantry-banner-inner">
              <div className="md-pantry-banner-copy">
                <p className="md-eyebrow">{t.pantryEyebrow}</p>
                <h2 className="md-title" id="md-pantry-banner-heading">{t.pantryBannerTitle}</h2>
                <p className="md-lead">{t.pantryBannerBody}</p>
              </div>
              <Link className="md-button" href="/es/que-puedo-cocinar">{t.pantryBannerCta}</Link>
            </div>
          </section>
        )}
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
        {lang === 'es' && data.ingredients.length > 0 && <section className="md-section" aria-labelledby="md-ingredients-heading-home">
          <div className="md-container"><div className="md-section-head"><h2 className="md-title" id="md-ingredients-heading-home">{t.browseIngredients}</h2>
            <Link className="md-link" href="/es/ingredientes">{t.seeAllIngredients}</Link></div>
            <nav className="md-ingredient-list" aria-label={t.browseIngredients}>
              {data.ingredients.map((item) => <Link className="md-ingredient-link" key={item.slug} href={`/es/ingredientes/${item.slug}`}>{item.name}</Link>)}
            </nav>
          </div>
        </section>}
        <aside className="md-section md-editorial"><div className="md-container md-editorial-inner">
          <p className="md-eyebrow">Manual de Cocina</p><h2 className="md-title">{t.editorialTitle}</h2>
          <p className="md-lead">{t.editorialBody}</p>
        </div></aside>
      </main>
      <SiteFooter lang={lang} />
    </div>
  );
}

import Link from 'next/link';
import type { MdLanguage, MdRecipeCardData } from './md-types';
import { getMdCopy } from '@/lib/copy';
import SiteHeader from './SiteHeader';
import SiteFooter from './SiteFooter';
import RecipeCard from './RecipeCard';

/** Photo must come from a real recipe in the category; never fabricate one. */
export interface MdCategorySummary {
  slug: string;
  label: string;
  count: number;
  image_url: string | null;
}

export function CategoryGrid({ lang, categories }: {
  lang: MdLanguage;
  categories: MdCategorySummary[];
}) {
  return (
    <div className="md-category-grid">
      {categories.filter((item) => item.count > 0).map((item) => (
        <Link className="md-category-card" key={item.slug} href={`/${lang}/categorias/${item.slug}`}>
          {item.image_url ? (
            <img className="md-category-photo" src={item.image_url} alt="" width="360" height="270" loading="lazy" />
          ) : (
            <span className="md-category-fallback" aria-hidden="true">
              <img src="/brand/mark.png" alt="" width="42" height="42" />
            </span>
          )}
          <span className="md-category-body"><strong className="md-category-name">{item.label}</strong>
            <span className="md-category-count">{item.count}</span></span>
        </Link>
      ))}
    </div>
  );
}

export function CategoriesIndexView({ lang, categories }: {
  lang: MdLanguage; categories: MdCategorySummary[];
}) {
  const t = getMdCopy(lang);
  return (
    <div className="md-site" lang={lang}>
      <SiteHeader lang={lang} />
      <main className="md-container" id="md-main">
        <header className="md-page-head"><h1 className="md-display">{t.categoryCatalog}</h1></header>
        <section className="md-section">
          {categories.some((item) => item.count > 0)
            ? <CategoryGrid lang={lang} categories={categories} />
            : <div className="md-empty-block"><h2 className="md-subtitle">{t.emptyTitle}</h2><p>{t.emptyBody}</p></div>}
        </section>
      </main>
      <SiteFooter lang={lang} />
    </div>
  );
}

export function CategoryDetailView({ lang, category, recipes }: {
  lang: MdLanguage;
  category: MdCategorySummary;
  recipes: MdRecipeCardData[];
}) {
  const t = getMdCopy(lang);
  return (
    <div className="md-site" lang={lang}>
      <SiteHeader lang={lang} />
      <main className="md-container" id="md-main">
        <header className="md-page-head"><p className="md-eyebrow">{t.recipesInCategory}</p><h1 className="md-display">{category.label}</h1></header>
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

import Link from 'next/link';
import Image from 'next/image';
import { recipeImageSrc } from '@/lib/recipe-media';
import type { MdLanguage, MdRecipeCardData } from './md-types';
import { getMdCopy } from '@/lib/copy';
import SiteHeader from './SiteHeader';
import SiteFooter from './SiteFooter';
import RecipeCard from './RecipeCard';
import { SUPPORTED_LANGUAGES } from '@/types/recipe';
import { languageTag } from '@/lib/site';
import { CATEGORY_LANDING_COPY } from '@/lib/category-landing-copy';
import Breadcrumbs from './Breadcrumbs';

/** Alternates de una ruta con el mismo slug en los 7 idiomas (categorías: el slug es
 * neutro por idioma, solo cambia la etiqueta mostrada). Evita que el selector de idioma
 * caiga al inicio en vez de quedarse en la misma categoría. */
function samePathAlternates(path: (lang: MdLanguage) => string): Partial<Record<MdLanguage, string>> {
  return Object.fromEntries(SUPPORTED_LANGUAGES.map((l) => [l, path(l)]));
}

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
      {categories.map((item) => (
        <Link className="md-category-card" key={item.slug} href={`/${lang}/categorias/${item.slug}`}>
          {item.image_url ? (
            <Image className="md-category-photo" src={recipeImageSrc(item.image_url)} alt="" width={360} height={270} loading="lazy"
              sizes="(max-width: 599px) 50vw, (max-width: 899px) 33vw, 20vw" />
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
  const alternates = samePathAlternates((l) => `/${l}/categorias`);
  return (
    <div className="md-site" lang={languageTag(lang)}>
      <SiteHeader lang={lang} alternates={alternates} />
      <main className="md-container" id="md-main">
        <header className="md-page-head"><h1 className="md-display">{t.categoryCatalog}</h1><p className="md-page-intro md-lead">{CATEGORY_LANDING_COPY[lang].intro}</p></header>
        <section className="md-section">
          {categories.length > 0
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
  const alternates = samePathAlternates((l) => `/${l}/categorias/${category.slug}`);
  const postresIntro = lang === 'es' && category.slug === 'postres'
    ? `Explora ${category.count} recetas de postres para preparar en casa, desde tortas y bizcochos hasta cremas, galletas y opciones frías. En cada receta encontrarás las cantidades de los ingredientes, el tiempo estimado, el número de porciones y una preparación explicada paso a paso. Puedes comparar propuestas sencillas para una merienda con elaboraciones que necesitan horno, reposo o refrigeración. Antes de comenzar, lee la receta completa y comprueba qué utensilios necesitas, especialmente si incluye batidos, almíbares o tiempos de enfriado. Las fotografías ilustran las preparaciones, pero los tiempos pueden variar según el equipo y el tamaño de las porciones. También encontrarás recomendaciones de conservación cuando correspondan. Elige un postre que se ajuste a tu tiempo, revisa sus ingredientes y sigue las instrucciones en orden para obtener el mejor resultado posible.`
    : null;
  return (
    <div className="md-site" lang={languageTag(lang)}>
      <SiteHeader lang={lang} alternates={alternates} />
      <main className="md-container" id="md-main">
        <header className="md-page-head">
          <Breadcrumbs items={[
            { name: 'Manual de Cocina', path: `/${lang}` },
            { name: t.navCategories, path: `/${lang}/categorias` },
            { name: category.label, path: `/${lang}/categorias/${category.slug}` },
          ]} />
          <p className="md-eyebrow">{t.recipesInCategory}</p><h1 className="md-display">{category.label}</h1>
          {postresIntro && <p className="md-page-intro md-lead">{postresIntro}</p>}
        </header>
        {postresIntro && <h2 className="md-subtitle">{`Explora las ${category.count} recetas de postres`}</h2>}
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

import Link from 'next/link';
import Image from 'next/image';
import { recipeImageSrc } from '@/lib/recipe-media';
import type { MdLanguage, MdRecipeCardData } from './md-types';
import { getMdCopy } from '@/lib/copy';
import { languageTag } from '@/lib/site';
import { recipeListItem } from '@/lib/recipe-list-seo';
import { SUPPORTED_LANGUAGES } from '@/types/recipe';
import { collectionAlternatePaths, collectionPath, collectionsIndexPath, type Collection } from '@/lib/collections';
import type { CollectionSummary } from '@/lib/collections-data';
import SiteHeader from './SiteHeader';
import SiteFooter from './SiteFooter';
import RecipeCard from './RecipeCard';
import Breadcrumbs from './Breadcrumbs';

/** Tarjetas de colecciones (portada y /colecciones). Reutiliza el estilo de las categorías. */
export function CollectionGrid({ lang, items }: { lang: MdLanguage; items: CollectionSummary[] }) {
  const t = getMdCopy(lang);
  return (
    <div className="md-category-grid md-collection-grid">
      {items.map(({ collection, count, image_url }) => (
        <Link className="md-category-card md-collection-card" key={collection.id} href={collectionPath(lang, collection)}>
          {image_url ? (
            <Image className="md-category-photo" src={recipeImageSrc(image_url)} alt="" width={640} height={480} loading="lazy"
              sizes="(max-width: 599px) calc(100vw - 36px), (max-width: 899px) 50vw, 33vw" />
          ) : (
            <span className="md-category-fallback" aria-hidden="true"><img src="/brand/mark.png" alt="" width="42" height="42" /></span>
          )}
          <span className="md-category-body">
            <strong className="md-category-name">{collection.text[lang].title}</strong>
            <span className="md-category-count">{count} {t.ingredientRecipeCountSuffix}</span>
          </span>
        </Link>
      ))}
    </div>
  );
}

export function CollectionsIndexView({ lang, items }: { lang: MdLanguage; items: CollectionSummary[] }) {
  const t = getMdCopy(lang);
  const alternates = Object.fromEntries(SUPPORTED_LANGUAGES.map((l) => [l, collectionsIndexPath(l)]));
  return (
    <div className="md-site" lang={languageTag(lang)}>
      <SiteHeader lang={lang} alternates={alternates} />
      <main className="md-container" id="md-main">
        <header className="md-page-head">
          <Breadcrumbs items={[
            { name: 'Manual de Cocina', path: `/${lang}` },
            { name: t.navCollections, path: collectionsIndexPath(lang) },
          ]} />
          <h1 className="md-display">{t.navCollections}</h1>
          <p className="md-page-intro md-lead">{t.collectionsIndexIntro}</p>
        </header>
        <section className="md-section">
          {items.length > 0
            ? <CollectionGrid lang={lang} items={items} />
            : <div className="md-empty-block"><h2 className="md-subtitle">{t.emptyTitle}</h2><p>{t.emptyBody}</p></div>}
        </section>
      </main>
      <SiteFooter lang={lang} />
    </div>
  );
}

export function CollectionDetailView({ lang, collection, sections }: {
  lang: MdLanguage;
  collection: Collection;
  sections: MdRecipeCardData[][];
}) {
  const t = getMdCopy(lang);
  const text = collection.text[lang];
  const all = sections.flat();
  // Página resumen de recetas: ItemList con la URL canónica de cada receta (como /recetas).
  const itemList = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: text.title,
    itemListElement: all.map((recipe, index) => recipeListItem(recipe, index + 1)),
  };
  return (
    <div className="md-site" lang={languageTag(lang)}>
      <SiteHeader lang={lang} alternates={collectionAlternatePaths(collection)} />
      {all.length >= 2 && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemList).replace(/</g, '\\u003c') }} />
      )}
      <main className="md-container" id="md-main">
        <header className="md-page-head">
          <Breadcrumbs items={[
            { name: 'Manual de Cocina', path: `/${lang}` },
            { name: t.navCollections, path: collectionsIndexPath(lang) },
            { name: text.title, path: collectionPath(lang, collection) },
          ]} />
          <p className="md-eyebrow">{t.navCollections}</p>
          <h1 className="md-display">{text.title}</h1>
          {text.intro.map((paragraph) => <p className="md-page-intro md-lead" key={paragraph}>{paragraph}</p>)}
          <p className="md-collection-curator">
            <Link className="md-link" href={`/${lang}/quienes-somos`}>{t.collectionCuratedBy}</Link>
          </p>
        </header>
        {sections.map((recipes, index) => recipes.length > 0 && (
          <section className="md-section md-collection-section" key={text.sections[index]?.heading ?? index}
            aria-labelledby={`md-collection-section-${index}`}>
            <h2 className="md-title" id={`md-collection-section-${index}`}>{text.sections[index]?.heading}</h2>
            {text.sections[index]?.note && <p className="md-muted md-collection-note">{text.sections[index].note}</p>}
            <div className="md-card-grid">
              {recipes.map((recipe, i) => <RecipeCard key={recipe.id} recipe={recipe} priority={index === 0 && i === 0} />)}
            </div>
          </section>
        ))}
        {all.length === 0 && (
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

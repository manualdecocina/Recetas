import Link from 'next/link';
import type { MdLanguage, MdRecipeCardData } from './md-types';
import { MD_CATEGORIES } from './md-types';
import { getMdCopy } from '@/lib/copy';
import RecipeCard from './RecipeCard';

export type MdFilterParam = 'q' | 'categoria' | 'cocina' | 'dificultad' | 'ingrediente' | 'tiempo' | 'ordenar';
export type MdListingFilters = Partial<Record<MdFilterParam, string>>;
export interface MdSelectOption { value: string; label: string; }
export interface MdListingOptions {
  /** Only actual values accepted by the existing query implementation. */
  cuisines: MdSelectOption[];
  difficulties: MdSelectOption[];
  ingredients: MdSelectOption[];
  times: MdSelectOption[];
}
export interface MdListingViewProps {
  lang: MdLanguage;
  recipes: MdRecipeCardData[]; // already filtered, paged and sorted by existing server query
  filters: MdListingFilters;
  options: MdListingOptions;
  page: number;
  totalPages: number;
  totalResults: number;
}

const filterKeys: MdFilterParam[] = ['q', 'categoria', 'cocina', 'dificultad', 'ingrediente', 'tiempo', 'ordenar'];
function listUrl(lang: MdLanguage, filters: MdListingFilters, page = 1, omit?: MdFilterParam) {
  const qs = new URLSearchParams();
  filterKeys.forEach((key) => { if (key !== omit && filters[key]) qs.set(key, filters[key]!); });
  if (page > 1) qs.set('page', String(page));
  const text = qs.toString();
  return `/${lang}/recetas${text ? `?${text}` : ''}`;
}

/** Replace ONLY the existing listing JSX with this server-side view. */
export default function RecipeListingView({ lang, recipes, filters, options, page, totalPages, totalResults }: MdListingViewProps) {
  const t = getMdCopy(lang);
  const action = `/${lang}/recetas`;
  const active = filterKeys.filter((key) => filters[key]);
  const selectFields: Array<{ key: MdFilterParam; label: string; options: MdSelectOption[] }> = [
    { key: 'categoria', label: t.category, options: MD_CATEGORIES.map((item) => ({ value: item.slug, label: item.label })) },
    { key: 'cocina', label: t.cuisine, options: options.cuisines },
    { key: 'dificultad', label: t.difficulty, options: options.difficulties },
    ...(lang === 'es' ? [{ key: 'ingrediente' as const, label: t.ingredient, options: options.ingredients }] : []),
    { key: 'tiempo', label: t.time, options: options.times },
    { key: 'ordenar', label: t.sort, options: [
      { value: 'recientes', label: t.mostRecent }, { value: 'antiguas', label: t.oldest },
    ] },
  ];
  return (
    <main className="md-container" id="md-main">
      <header className="md-page-head"><h1 className="md-display">{t.recipeCatalog}</h1></header>
      <div className="md-listing-layout">
        <aside className="md-filter-panel">
          <h2 className="md-subtitle">{t.filterHeading}</h2>
          <form action={action} method="get" role="search">
            <div className="md-filter-fields">
              <div><label className="md-search-label" htmlFor="md-list-q">{t.searchLabel}</label>
                <input className="md-search-input" id="md-list-q" name="q" type="search"
                  defaultValue={filters.q ?? ''} placeholder={t.searchPlaceholder} /></div>
              {selectFields.filter(({ key, options: choices }) => key === 'ordenar' || choices.length > 0).map((field) => (
                <div key={field.key}><label className="md-search-label" htmlFor={`md-filter-${field.key}`}>{field.label}</label>
                  <select className="md-select" id={`md-filter-${field.key}`} name={field.key}
                    defaultValue={filters[field.key] ?? (field.key === 'ordenar' ? 'recientes' : '')}>
                    {field.key !== 'ordenar' && <option value="">{t.any}</option>}
                    {field.options.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
                  </select>
                </div>
              ))}
            </div>
            <div className="md-filter-buttons">
              <button className="md-button" type="submit">{t.applyFilters}</button>
              <Link className="md-button-quiet" href={action}>{t.clearFilters}</Link>
            </div>
          </form>
        </aside>
        <section aria-label={t.recipeCatalog}>
          <p className="md-result-summary" role="status">{totalResults.toLocaleString(lang)} {t.resultCount.toLowerCase()}</p>
          {active.length > 0 && <nav className="md-active-filters" aria-label={t.activeFilters}>
            {active.map((key) => {
              const pretty = selectFields.find((field) => field.key === key);
              const found = pretty?.options.find((option) => option.value === filters[key]);
              const label = `${pretty?.label ?? t.searchLabel}: ${found?.label ?? filters[key]}`;
              return <Link key={key} className="md-filter-chip" href={listUrl(lang, filters, 1, key)}
                aria-label={`${t.removeFilter}: ${label}`}>{label} ×</Link>;
            })}
          </nav>}
          {recipes.length > 0 ? <div className="md-card-grid">
            {recipes.map((recipe, index) => <RecipeCard key={recipe.id} recipe={recipe} priority={index === 0} />)}
          </div> : <div className="md-empty-state">
            <h2 className="md-subtitle">{t.noRecipes}</h2><p>{t.emptyHint}</p>
            <Link className="md-button-secondary" href={action}>{t.clearFilters}</Link>
          </div>}
          {totalPages > 1 && <nav className="md-pagination" aria-label={t.page}>
            {page > 1 && <Link className="md-button-quiet" href={listUrl(lang, filters, page - 1)}>{t.previousPage}</Link>}
            <span>{t.page} {page} {t.of} {totalPages}</span>
            {page < totalPages && <Link className="md-button-quiet" href={listUrl(lang, filters, page + 1)}>{t.nextPage}</Link>}
          </nav>}
        </section>
      </div>
    </main>
  );
}

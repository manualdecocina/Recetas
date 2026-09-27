import Link from 'next/link';
import type { MdRecipeCardData } from './md-types';
import { getMdCopy } from '@/lib/copy';
import { normalizePublicPath } from '@/lib/site';

/** Deliberately uses only the eight fields authorized for a recipe card. */
export default function RecipeCard({ recipe, priority = false }: {
  recipe: MdRecipeCardData;
  priority?: boolean;
}) {
  const t = getMdCopy(recipe.language);
  const href = normalizePublicPath(recipe.public_path);
  return (
    <article className="md-recipe-card">
      <Link className="md-card-photo-link" href={href} tabIndex={-1}>
        {recipe.image_url ? (
          <img className="md-card-photo" src={recipe.image_url} alt={`${t.photoOf} ${recipe.title}`} width="640" height="480"
            loading={priority ? 'eager' : 'lazy'} fetchPriority={priority ? 'high' : 'auto'} />
        ) : (
          <div className="md-card-photo-placeholder">
            <img src="/brand/manual-de-cocina-mark.svg" width="52" height="52" alt="" />
            <span>{t.noPhoto}</span>
          </div>
        )}
      </Link>
      <div className="md-card-content">
        {recipe.category && <span className="md-card-category">{recipe.category}</span>}
        <h3 className="md-card-title"><Link href={href}>{recipe.title}</Link></h3>
        {recipe.excerpt && <p className="md-card-excerpt">{recipe.excerpt}</p>}
      </div>
    </article>
  );
}

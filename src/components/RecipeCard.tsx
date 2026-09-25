import Link from 'next/link'
import Image from 'next/image'
import type { Recipe } from '@/types/recipe'
import { normalizePublicPath } from '@/lib/site'
import { FavoriteStar } from '@/components/FavoriteStar'

type CardRecipe = Pick<Recipe, 'id' | 'language' | 'slug' | 'public_path' | 'title' | 'excerpt' | 'category' | 'image_url'>

export function RecipeCard({
  recipe,
  priority = false,
  featured = false,
}: {
  recipe: CardRecipe
  priority?: boolean
  featured?: boolean
}) {
  return (
    <article className={featured ? 'recipe-card recipe-card--featured' : 'recipe-card'}>
      <Link href={normalizePublicPath(recipe.public_path)} className="recipe-card__link">
        <div className="recipe-card__image">
          {recipe.image_url ? (
            <Image
              src={recipe.image_url}
              alt={recipe.title}
              fill
              sizes={featured ? '(max-width: 900px) 100vw, 65vw' : '(max-width: 600px) 100vw, (max-width: 900px) 50vw, 33vw'}
              priority={priority}
            />
          ) : (
            <span className="recipe-card__placeholder" aria-hidden="true">Manual de Cocina</span>
          )}
        </div>
        <div className="recipe-card__body">
          {recipe.category && <span className="recipe-card__category">{recipe.category}</span>}
          <h3>{recipe.title}</h3>
          {recipe.excerpt && <p>{recipe.excerpt}</p>}
        </div>
      </Link>
      <FavoriteStar recipeId={recipe.id} />
    </article>
  )
}

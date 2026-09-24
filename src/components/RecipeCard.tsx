import Link from 'next/link'
import Image from 'next/image'
import type { Recipe } from '@/types/recipe'
import { normalizePublicPath } from '@/lib/site'

type CardRecipe = Pick<Recipe, 'id' | 'language' | 'slug' | 'public_path' | 'title' | 'excerpt' | 'category' | 'image_url'>

export function RecipeCard({ recipe, priority = false }: { recipe: CardRecipe; priority?: boolean }) {
  return (
    <Link href={normalizePublicPath(recipe.public_path)}>
      <article>
        {recipe.image_url && (
          <Image
            src={recipe.image_url}
            alt={recipe.title}
            width={800}
            height={600}
            sizes="(max-width: 768px) 100vw, 33vw"
            style={{ width: '100%', height: 'auto' }}
            priority={priority}
          />
        )}
        <h3>{recipe.title}</h3>
        {recipe.excerpt && <p>{recipe.excerpt}</p>}
        {recipe.category && <span>{recipe.category}</span>}
      </article>
    </Link>
  )
}

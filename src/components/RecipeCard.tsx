import Link from 'next/link'
import Image from 'next/image'
import type { Recipe } from '@/types/recipe'
import { recipePath } from '@/lib/site'

type CardRecipe = Pick<Recipe, 'id' | 'language' | 'slug' | 'title' | 'excerpt' | 'category' | 'image_url'>

// TODO(diseño): cuadro funcional sin diseño final.
// Usa next/image: solo carga imágenes de los dominios permitidos en next.config.mjs.
export function RecipeCard({ recipe, priority = false }: { recipe: CardRecipe; priority?: boolean }) {
  return (
    <Link href={recipePath(recipe.language, recipe.slug)}>
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

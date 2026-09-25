import Image from 'next/image'
import type { Recipe } from '@/types/recipe'
import { RecipeCard } from '@/components/RecipeCard'

type RelatedRecipe = Pick<Recipe, 'id' | 'language' | 'slug' | 'public_path' | 'title' | 'excerpt' | 'category' | 'image_url'>

export function RelatedRecipes({ recipes }: { recipes: RelatedRecipe[] }) {
  if (!recipes.length) return null
  return (
    <section className="related-recipes" aria-labelledby="related-recipes-title">
      <p className="eyebrow">Después de esta</p>
      <h2 id="related-recipes-title">También puedes cocinar</h2>
      <div className="recipe-grid">
        {recipes.map((recipe) => <RecipeCard key={recipe.id} recipe={recipe} />)}
      </div>
    </section>
  )
}

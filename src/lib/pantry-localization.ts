import type { MdPantryRecipe } from '@/lib/md-data'
import type { MdRecipeCardData } from '@/components/md/md-types'

/** Count editorial positions for coverage, but show each pantry requirement once. */
export function pantryIngredientCoverage(linkedIds: string[], totalIngredients: number) {
  return {
    ingredientIds: [...new Set(linkedIds)],
    totalIngredients,
    totalCanonicalIngredients: linkedIds.length,
    uncanonicalizedCount: Math.max(0, totalIngredients - linkedIds.length),
  }
}

/** Join by stable group identity, never translated title, slug, or ingredient position. */
export function localizePantryRecipes(source: MdPantryRecipe[], translations: Array<MdRecipeCardData & { recipe_group_id: string }>): MdPantryRecipe[] {
  const byGroup = new Map(translations.map((recipe) => [recipe.recipe_group_id, recipe]))
  return source.flatMap((recipe) => {
    const translation = byGroup.get(recipe.recipe_group_id)
    return translation ? [{ ...recipe, ...translation }] : []
  })
}

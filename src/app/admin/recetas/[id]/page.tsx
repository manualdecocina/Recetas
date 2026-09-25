import Link from 'next/link'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { requireAdmin } from '@/lib/supabase/admin-guard'
import { ingredientsToText, stepsToText, uuidSchema } from '@/lib/validation'
import type { Recipe } from '@/types/recipe'
import { updateRecipeAction } from '../../actions'
import { RecipeForm } from '../../RecipeForm'
import { NotAdmin } from '../../NotAdmin'

export const dynamic = 'force-dynamic'
export const metadata: Metadata = { title: 'Editar receta', robots: { index: false, follow: false } }

export default async function EditRecipePage({ params }: { params: Promise<{ id: string }> }) {
  const { id: rawId } = await params
  const { supabase, user, isAdmin } = await requireAdmin()
  if (!isAdmin) return <NotAdmin email={user.email} />

  const id = uuidSchema.safeParse(rawId)
  if (!id.success) notFound()

  const { data } = await supabase.from('recipes').select('*').eq('id', id.data).maybeSingle()
  if (!data) notFound()
  const recipe = data as Recipe

  return (
    <main>
      <p><Link href="/admin">← Volver al panel</Link></p>
      <h1>Editar: {recipe.title}</h1>
      <p>
        Idioma: {recipe.language} (no editable). {recipe.published_at
          ? `Publicada por primera vez el ${new Date(recipe.published_at).toLocaleDateString('es-CO')}.`
          : 'Nunca publicada.'}
      </p>
      <RecipeForm
        action={updateRecipeAction}
        submitLabel="Guardar cambios"
        hidden={{ name: 'id', value: recipe.id }}
        defaults={{
          slug: recipe.slug,
          title: recipe.title,
          excerpt: recipe.excerpt,
          category: recipe.category,
          prep_time_minutes: recipe.prep_time_minutes,
          cook_time_minutes: recipe.cook_time_minutes,
          servings: recipe.servings,
          image_url: recipe.image_url,
          published: recipe.published,
          ingredientsText: ingredientsToText(recipe.ingredients),
          stepsText: stepsToText(recipe.steps),
        }}
      />
    </main>
  )
}

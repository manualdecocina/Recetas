import Link from 'next/link'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { requireAdmin } from '@/lib/supabase/admin-guard'
import { uuidSchema } from '@/lib/validation'
import { SUPPORTED_LANGUAGES } from '@/types/recipe'
import { createRecipeAction, createTranslationAction } from '../../actions'
import { RecipeForm } from '../../RecipeForm'
import { NotAdmin } from '../../NotAdmin'

export const dynamic = 'force-dynamic'
export const metadata: Metadata = { title: 'Nueva receta', robots: { index: false, follow: false } }

const LANGUAGE_LABELS: Record<string, string> = {
  es: 'Español', de: 'Deutsch', ja: '日本語', it: 'Italiano', fr: 'Français', en: 'English',
}

// Sin ?from → plato nuevo (create_recipe).
// Con ?from=<id de receta existente> → traducción de ese plato (create_recipe_translation).
export default async function NewRecipePage({ searchParams }: { searchParams: { from?: string } }) {
  const { supabase, user, isAdmin } = await requireAdmin()
  if (!isAdmin) return <NotAdmin email={user.email} />

  if (!searchParams.from) {
    return (
      <main>
        <p><Link href="/admin">← Volver al panel</Link></p>
        <h1>Nueva receta</h1>
        <RecipeForm
          action={createRecipeAction}
          submitLabel="Crear receta"
          languageOptions={SUPPORTED_LANGUAGES.map((l) => ({ value: l, label: LANGUAGE_LABELS[l] }))}
        />
      </main>
    )
  }

  const sourceId = uuidSchema.safeParse(searchParams.from)
  if (!sourceId.success) notFound()

  const { data: source } = await supabase
    .from('recipes')
    .select('id, recipe_group_id, title, language, category, prep_time_minutes, cook_time_minutes, servings, image_url')
    .eq('id', sourceId.data)
    .maybeSingle()
  if (!source) notFound()

  const { data: siblings } = await supabase
    .from('recipes')
    .select('language')
    .eq('recipe_group_id', source.recipe_group_id)

  const taken = new Set((siblings ?? []).map((s) => s.language))
  const available = SUPPORTED_LANGUAGES.filter((l) => !taken.has(l))

  return (
    <main>
      <p><Link href="/admin">← Volver al panel</Link></p>
      <h1>Traducción de “{source.title}” ({source.language})</h1>
      {available.length === 0 ? (
        <p>Esta receta ya existe en los 6 idiomas.</p>
      ) : (
        <RecipeForm
          action={createTranslationAction}
          submitLabel="Crear traducción"
          hidden={{ name: 'source_id', value: source.id }}
          languageOptions={available.map((l) => ({ value: l, label: LANGUAGE_LABELS[l] }))}
          defaults={{
            // Solo datos neutros al idioma; textos y categoría se escriben en el idioma nuevo.
            prep_time_minutes: source.prep_time_minutes,
            cook_time_minutes: source.cook_time_minutes,
            servings: source.servings,
            image_url: source.image_url,
          }}
        />
      )}
    </main>
  )
}

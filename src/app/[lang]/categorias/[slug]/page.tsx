import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { supabase } from '@/lib/supabase/public'
import { CategoryDetailView } from '@/components/md/CategoryViews'
import type { MdRecipeCardData } from '@/components/md/md-types'
import { SUPPORTED_LANGUAGES, type RecipeLanguage } from '@/types/recipe'
import { CATEGORY_TAXONOMY, categoryLabel } from '@/lib/categories'

function parseLang(value: string): RecipeLanguage | null {
  return (SUPPORTED_LANGUAGES as string[]).includes(value) ? value as RecipeLanguage : null
}

export async function generateMetadata({ params }: { params: Promise<{ lang: string; slug: string }> }): Promise<Metadata> {
  const { lang: rawLang, slug } = await params
  const lang = parseLang(rawLang)
  const exists = CATEGORY_TAXONOMY.some((entry) => entry.slug === slug)
  if (!lang || !exists) return {}
  const label = categoryLabel(lang, slug)!
  return { title: label, description: 'Recetas de ' + label.toLowerCase() + ' en Manual de Cocina.' }
}

export default async function CategoryPage({ params }: { params: Promise<{ lang: string; slug: string }> }) {
  const { lang: rawLang, slug } = await params
  const lang = parseLang(rawLang)
  const exists = CATEGORY_TAXONOMY.some((entry) => entry.slug === slug)
  if (!lang || !exists) notFound()
  // La etiqueta de la categoría se guarda TRADUCIDA por idioma en `recipes.category`
  // (p. ej. "Postres" en es, "Dolci" en it): hay que filtrar con la etiqueta de ESTE
  // idioma, no con la española fija, o la categoría siempre sale vacía fuera de /es.
  const label = categoryLabel(lang, slug)!

  const { data: recipes, error } = await supabase.from('recipes')
    .select('id, language, slug, public_path, title, excerpt, category, image_url')
    .eq('language', lang).eq('published', true).eq('category', label)
    .order('updated_at', { ascending: false, nullsFirst: false })

  if (error) throw new Error('No se pudieron cargar las recetas de la categoría')

  const list = (recipes ?? []) as MdRecipeCardData[]
  return (
    <CategoryDetailView
      lang={lang}
      category={{ slug, label, count: list.length, image_url: null }}
      recipes={list}
    />
  )
}

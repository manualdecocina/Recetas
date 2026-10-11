import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { supabase } from '@/lib/supabase/public'
import { CategoryDetailView } from '@/components/md/CategoryViews'
import type { MdRecipeCardData } from '@/components/md/md-types'
import { SUPPORTED_LANGUAGES, type RecipeLanguage } from '@/types/recipe'
import { CATEGORY_TAXONOMY, categoryLabel } from '@/lib/categories'
import { allLanguageAlternates, withSiteName } from '@/lib/seo'
import { getMdCopy } from '@/lib/copy'

function parseLang(value: string): RecipeLanguage | null {
  return (SUPPORTED_LANGUAGES as string[]).includes(value) ? value as RecipeLanguage : null
}

export async function generateMetadata({ params }: { params: Promise<{ lang: string; slug: string }> }): Promise<Metadata> {
  const { lang: rawLang, slug } = await params
  const lang = parseLang(rawLang)
  const exists = CATEGORY_TAXONOMY.some((entry) => entry.slug === slug)
  if (!lang || !exists) return {}
  const label = categoryLabel(lang, slug)!
  const t = getMdCopy(lang)
  let title = label
  let description = `${t.recipesInCategory}: ${label}.`
  if (lang === 'es' && slug === 'postres') {
    const { count, error } = await supabase.from('recipes')
      .select('id', { count: 'exact', head: true })
      .eq('language', lang).eq('published', true).eq('category', label)
    if (error) throw new Error('No se pudo calcular el total publicado de postres')
    const total = count ?? 0
    title = `Recetas de postres: ${total} ideas paso a paso`
    description = `${total} recetas de postres con ingredientes pesados, tiempos y pasos claros.`
  }
  return {
    title: withSiteName(title),
    description,
    alternates: allLanguageAlternates(`/${lang}/categorias/${slug}`, (l) => `/${l}/categorias/${slug}`),
  }
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
    .order('ready_at', { ascending: false, nullsFirst: false })

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

import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { supabase } from '@/lib/supabase/public'
import { CategoryDetailView } from '@/components/md/CategoryViews'
import type { MdRecipeCardData } from '@/components/md/md-types'
import { SUPPORTED_LANGUAGES, type RecipeLanguage } from '@/types/recipe'

const CATEGORIES = [
  ['Platos principales', 'platos-principales'],
  ['Entrantes y aperitivos', 'entrantes-y-aperitivos'],
  ['Sopas y cremas', 'sopas-y-cremas'],
  ['Ensaladas', 'ensaladas'],
  ['Guarniciones', 'guarniciones'],
  ['Salsas y aderezos', 'salsas-y-aderezos'],
  ['Panes y masas', 'panes-y-masas'],
  ['Postres', 'postres'],
  ['Desayunos y brunch', 'desayunos-y-brunch'],
  ['Bebidas', 'bebidas'],
] as const

function parseLang(value: string): RecipeLanguage | null {
  return (SUPPORTED_LANGUAGES as string[]).includes(value) ? value as RecipeLanguage : null
}

export async function generateMetadata({ params }: { params: Promise<{ lang: string; slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const category = CATEGORIES.find(([, categorySlug]) => categorySlug === slug)
  return category ? { title: category[0], description: 'Recetas de ' + category[0].toLowerCase() + ' en Manual de Cocina.' } : {}
}

export default async function CategoryPage({ params }: { params: Promise<{ lang: string; slug: string }> }) {
  const { lang: rawLang, slug } = await params
  const lang = parseLang(rawLang)
  const category = CATEGORIES.find(([, categorySlug]) => categorySlug === slug)
  if (!lang || !category) notFound()

  const { data: recipes, error } = await supabase.from('recipes')
    .select('id, language, slug, public_path, title, excerpt, category, image_url')
    .eq('language', lang).eq('published', true).eq('category', category[0])
    .order('published_at', { ascending: false, nullsFirst: false })

  if (error) throw new Error('No se pudieron cargar las recetas de la categoría')

  const list = (recipes ?? []) as MdRecipeCardData[]
  return (
    <CategoryDetailView
      lang={lang}
      category={{ slug, label: category[0], count: list.length, image_url: null }}
      recipes={list}
    />
  )
}

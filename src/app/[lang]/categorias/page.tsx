import Link from 'next/link'
import { notFound } from 'next/navigation'
import { supabase } from '@/lib/supabase/public'
import { SiteHeader } from '@/components/SiteHeader'
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

export default async function CategoriesPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang: rawLang } = await params
  const lang = parseLang(rawLang)
  if (!lang) notFound()

  const counts = await Promise.all(CATEGORIES.map(async ([label]) => {
    const { count } = await supabase.from('recipes').select('id', { count: 'exact', head: true })
      .eq('language', lang).eq('published', true).eq('category', label)
    return count ?? 0
  }))

  return (
    <>
      <SiteHeader lang={lang} />
      <main className="categories-page">
        <header className="categories-page__hero">
          <p className="eyebrow">Descubrir</p>
          <h1>Categorías de cocina</h1>
          <p>Una estructura sencilla para encontrar qué te apetece cocinar.</p>
        </header>
        <section className="category-directory" aria-label="Categorías">
          {CATEGORIES.map(([label, slug], index) => (
            <Link key={slug} href={'/' + lang + '/categorias/' + slug} className="category-directory__item">
              <span className="category-directory__number">{String(index + 1).padStart(2, '0')}</span>
              <span><strong>{label}</strong><small>{counts[index]} {counts[index] === 1 ? 'receta' : 'recetas'}</small></span>
              <span aria-hidden="true">↗</span>
            </Link>
          ))}
        </section>
      </main>
    </>
  )
}

// Ingredient discovery is backed by the canonical ingredient model in Supabase.
// Population/alias normalization is intentionally a separate migration phase.

import Link from 'next/link'
import { notFound } from 'next/navigation'
import { supabase } from '@/lib/supabase/public'
import { SiteHeader } from '@/components/SiteHeader'
import { SUPPORTED_LANGUAGES, type RecipeLanguage } from '@/types/recipe'

function parseLang(value: string): RecipeLanguage | null {
  return (SUPPORTED_LANGUAGES as string[]).includes(value) ? value as RecipeLanguage : null
}

export default async function IngredientsPage({ params }: { params: { lang: string } }) {
  const lang = parseLang(params.lang)
  if (!lang || lang !== 'es') notFound()

  const { data: ingredients, error } = await supabase
    .from('ingredients')
    .select('id, name, slug')
    .eq('status', 'canonical')
    .eq('indexable', true)
    .order('name', { ascending: true })

  if (error) throw new Error('No se pudieron cargar los ingredientes')

  const items = ingredients ?? []

  return (
    <>
      <SiteHeader lang={lang} />
      <main className="ingredients-page">
        <header className="ingredients-page__hero">
          <p className="eyebrow">Descubrir</p>
          <h1>Ingredientes</h1>
          <p>Explora recetas a partir de ingredientes concretos.</p>
        </header>
        {items.length ? (
          <section className="ingredient-directory" aria-label="Ingredientes">
            {items.map((ingredient) => (
              <Link key={ingredient.id} href={`/${lang}/ingredientes/${ingredient.slug}`} className="ingredient-directory__item">
                <strong>{ingredient.name}</strong>
                <span aria-hidden="true">↗</span>
              </Link>
            ))}
          </section>
        ) : (
          <section className="catalog-empty">
            <p className="eyebrow">Próximamente</p>
            <h2>Estamos preparando este índice.</h2>
            <p>Los ingredientes aparecerán aquí cuando tengan una página pública aprobada.</p>
            <Link className="button button--dark" href={`/${lang}/recetas`}>Explorar recetas</Link>
          </section>
        )}
      </main>
    </>
  )
}

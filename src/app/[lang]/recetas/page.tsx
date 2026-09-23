import Link from 'next/link'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { supabase } from '@/lib/supabase/public'
import { RecipeCard } from '@/components/RecipeCard'
import { UI_TEXT } from '@/lib/i18n'
import { allLanguageAlternates } from '@/lib/seo'
import { getSiteUrl } from '@/lib/site'
import { SUPPORTED_LANGUAGES, type RecipeLanguage } from '@/types/recipe'

const PAGE_SIZE = 24
const CARD_FIELDS = 'id, language, slug, title, excerpt, category, image_url'

interface Props {
  params: { lang: string }
  searchParams: { page?: string }
}

function parseLang(value: string): RecipeLanguage | null {
  return (SUPPORTED_LANGUAGES as string[]).includes(value) ? (value as RecipeLanguage) : null
}

// ?page=1 o valores inválidos no son páginas distintas: se tratan como página 1.
function parsePage(value?: string): number {
  const n = Number.parseInt(value ?? '1', 10)
  return Number.isFinite(n) && n >= 1 ? n : 1
}

export async function generateMetadata({ params, searchParams }: Props): Promise<Metadata> {
  const lang = parseLang(params.lang)
  if (!lang) return {}
  const text = UI_TEXT[lang]
  const page = parsePage(searchParams.page)

  if (page === 1) {
    return {
      title: text.recipesTitle,
      description: text.recipesDescription,
      alternates: allLanguageAlternates(`/${lang}/recetas`, (l) => `/${l}/recetas`),
    }
  }
  // Páginas 2+: canonical propia, sin hreflang (el contenido de la página N no es
  // equivalente entre idiomas porque cada catálogo tiene tamaño distinto).
  return {
    title: `${text.recipesTitle} — ${text.page} ${page}`,
    description: text.recipesDescription,
    alternates: { canonical: `${getSiteUrl()}/${lang}/recetas?page=${page}` },
  }
}

export default async function RecipesListPage({ params, searchParams }: Props) {
  const lang = parseLang(params.lang)
  if (!lang) notFound()
  const text = UI_TEXT[lang]
  const page = parsePage(searchParams.page)
  const from = (page - 1) * PAGE_SIZE

  const { data: recipes, count, error } = await supabase
    .from('recipes')
    .select(CARD_FIELDS, { count: 'exact' })
    .eq('language', lang)
    .eq('published', true)
    .order('published_at', { ascending: false })
    .range(from, from + PAGE_SIZE - 1)

  if (error) throw new Error(`No se pudieron cargar las recetas: ${error.message}`)

  const total = count ?? 0
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE))
  if (page > totalPages) notFound() // página inexistente → 404 real, no página vacía

  return (
    <main>
      <h1>{text.recipesTitle}</h1>
      {total === 0 ? (
        <p>{text.noRecipes}</p>
      ) : (
        <section>
          {(recipes ?? []).map((recipe) => (
            <RecipeCard key={recipe.id} recipe={recipe} />
          ))}
        </section>
      )}

      {totalPages > 1 && (
        <nav aria-label={text.page}>
          {page > 1 && (
            <Link href={page === 2 ? `/${lang}/recetas` : `/${lang}/recetas?page=${page - 1}`} rel="prev">
              {text.previous}
            </Link>
          )}{' '}
          {text.page} {page} / {totalPages}{' '}
          {page < totalPages && (
            <Link href={`/${lang}/recetas?page=${page + 1}`} rel="next">
              {text.next}
            </Link>
          )}
        </nav>
      )}
    </main>
  )
}

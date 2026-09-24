import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { supabase } from '@/lib/supabase/public'
import { RecipeCard } from '@/components/RecipeCard'
import { UI_TEXT } from '@/lib/i18n'
import { allLanguageAlternates } from '@/lib/seo'
import { SUPPORTED_LANGUAGES, type RecipeLanguage } from '@/types/recipe'

export const revalidate = 3600 // respaldo; la invalidación real es revalidateTag (ver docs/cache.md)

const CARD_FIELDS = 'id, language, slug, public_path, title, excerpt, category, image_url'

export async function generateStaticParams() {
  return SUPPORTED_LANGUAGES.map((lang) => ({ lang }))
}

function parseLang(value: string): RecipeLanguage | null {
  return (SUPPORTED_LANGUAGES as string[]).includes(value) ? (value as RecipeLanguage) : null
}

export async function generateMetadata({ params }: { params: { lang: string } }): Promise<Metadata> {
  const lang = parseLang(params.lang)
  if (!lang) return {}
  const text = UI_TEXT[lang]
  return {
    title: text.homeTitle,
    description: text.homeDescription,
    alternates: allLanguageAlternates(`/${lang}`, (l) => `/${l}`),
  }
}

export default async function LanguageHome({ params }: { params: { lang: string } }) {
  const lang = parseLang(params.lang)
  if (!lang) notFound()
  const text = UI_TEXT[lang]

  // Última receta publicada primero (published_at = fecha de primera publicación).
  const { data: recipes, error } = await supabase
    .from('recipes')
    .select(CARD_FIELDS)
    .eq('language', lang)
    .eq('published', true)
    .order('published_at', { ascending: false })
    .limit(13) // 1 destacada + 12 en cuadrícula

  if (error) throw new Error(`No se pudieron cargar las recetas: ${error.message}`)

  const [latest, ...grid] = recipes ?? []

  return (
    <main>
      {/* TODO(diseño): selector de idioma visible, enlazando a /{otro-idioma} */}
      <h1>{text.homeTitle}</h1>
      {latest ? (
        <section aria-label="latest">
          <RecipeCard recipe={latest} priority />
        </section>
      ) : (
        <p>{text.noRecipes}</p>
      )}

      {grid.length > 0 && (
        <section aria-label="recipes">
          {grid.map((recipe) => (
            <RecipeCard key={recipe.id} recipe={recipe} />
          ))}
        </section>
      )}
    </main>
  )
}

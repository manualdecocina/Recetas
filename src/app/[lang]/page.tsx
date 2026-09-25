import { notFound, permanentRedirect } from 'next/navigation'
import type { Metadata } from 'next'
import { supabase } from '@/lib/supabase/public'
import { getContentPageByPublicPath, getRecipeByPublicPath, getRecipeTranslations } from '@/lib/public-content'
import { RecipeCard } from '@/components/RecipeCard'
import { RecipeDocument } from '@/components/RecipeDocument'
import { publicUrl } from '@/lib/site'
import { recipeAlternates } from '@/lib/seo'
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

async function rootLegacyMetadata(path: string): Promise<Metadata> {
  const recipe = await getRecipeByPublicPath(path)
  if (recipe) {
    const translations = await getRecipeTranslations(recipe.recipe_group_id)
    return {
      title: recipe.title,
      description: recipe.excerpt ?? undefined,
      alternates: recipeAlternates(recipe, translations),
      openGraph: {
        type: 'article',
        title: recipe.title,
        description: recipe.excerpt ?? undefined,
        url: publicUrl(recipe.public_path),
        images: recipe.image_url ? [recipe.image_url] : undefined,
      },
    }
  }

  const page = await getContentPageByPublicPath(path)
  if (!page) return {}
  return {
    title: page.title,
    description: page.excerpt ?? undefined,
    alternates: { canonical: publicUrl(page.public_path) },
    openGraph: {
      type: 'article',
      title: page.title,
      description: page.excerpt ?? undefined,
      url: publicUrl(page.public_path),
      images: page.featured_image_url ? [page.featured_image_url] : undefined,
    },
  }
}

async function rootLegacyPage(path: string) {
  const recipe = await getRecipeByPublicPath(path)
  if (recipe) return <RecipeDocument recipe={recipe} />

  const page = await getContentPageByPublicPath(path)
  if (page) {
    const html = (page.content_html ?? '')
      .replace(/<script[\\s\\S]*?<\\/script>/gi, '')
      .replace(/<style[\\s\\S]*?<\\/style>/gi, '')
      .replace(/\\son\\w+\\s*=\\s*(['"]).*?\\1/gi, '')
      .replace(/javascript:/gi, '')
    return (
      <main>
        <article>
          <h1>{page.title}</h1>
          {page.excerpt && <p>{page.excerpt}</p>}
          {html && <div dangerouslySetInnerHTML={{ __html: html }} />}
        </article>
      </main>
    )
  }

  const normalized = path.replace(/\\/+$/, '') || '/'
  const candidates = [path, normalized, normalized + '/']
  const { data } = await supabase
    .from('content_redirects')
    .select('target_path')
    .in('source_path', candidates)
    .limit(1)
    .maybeSingle()
  if (data?.target_path) permanentRedirect(data.target_path)
  return null
}

export async function generateMetadata({ params }: { params: { lang: string } }): Promise<Metadata> {
  const lang = parseLang(params.lang)
  if (!lang) return rootLegacyMetadata(`/${params.lang}`)
  const text = UI_TEXT[lang]
  return {
    title: text.homeTitle,
    description: text.homeDescription,
    alternates: allLanguageAlternates(`/${lang}`, (l) => `/${l}`),
  }
}

export default async function LanguageHome({ params }: { params: { lang: string } }) {
  const lang = parseLang(params.lang)
  if (!lang) {
    const legacy = await rootLegacyPage(`/${params.lang}`)
    if (legacy) return legacy
    notFound()
  }
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

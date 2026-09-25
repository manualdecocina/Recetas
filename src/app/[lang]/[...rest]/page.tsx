import type { Metadata } from 'next'
import { notFound, permanentRedirect } from 'next/navigation'
import { getContentPageByPublicPath, getRecipeByPublicPath, getRecipeTranslations } from '@/lib/public-content'
import { recipeAlternates } from '@/lib/seo'
import { publicUrl } from '@/lib/site'
import { SUPPORTED_LANGUAGES } from '@/types/recipe'
import { RecipeDocument } from '@/components/RecipeDocument'

type LangRestParams = { lang: string; rest: string[] }

interface Props { params: LangRestParams }

function isLang(value: string): boolean {
  return (SUPPORTED_LANGUAGES as string[]).includes(value)
}

function pathFor(params: LangRestParams): string {
  return '/' + params.lang + '/' + params.rest.join('/')
}

function cleanHtml(html: string): string {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/<style[\s\S]*?<\/style>/gi, '')
    .replace(/\son\w+\s*=\s*(['"]).*?\1/gi, '')
    .replace(/javascript:/gi, '')
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  if (!isLang(params.lang)) return {}
  const path = pathFor(params)

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

export default async function PublicLanguageRoute({ params }: Props) {
  if (!isLang(params.lang)) notFound()
  const path = pathFor(params)

  const recipe = await getRecipeByPublicPath(path)
  if (recipe) return <RecipeDocument recipe={recipe} />

  const page = await getContentPageByPublicPath(path)
  if (page) {
    return (
      <main>
        <article>
          <h1>{page.title}</h1>
          {page.excerpt && <p>{page.excerpt}</p>}
          {page.content_html && <div dangerouslySetInnerHTML={{ __html: cleanHtml(page.content_html) }} />}
        </article>
      </main>
    )
  }

  const normalized = path.replace(/\/+$/, '') || '/'
  const candidates = [path, normalized, normalized + '/']
  const { data } = await import('@/lib/supabase/public').then(({ supabase }) =>
    supabase.from('content_redirects').select('target_path').in('source_path', candidates).limit(1).maybeSingle()
  )
  if (data?.target_path) permanentRedirect(data.target_path)

  notFound()
}

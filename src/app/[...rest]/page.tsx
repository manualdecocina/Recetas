import { notFound, permanentRedirect } from 'next/navigation'
import { getContentPageByPublicPath, getRecipeByPublicPath, getRecipeTranslations } from '@/lib/public-content'
import { recipeAlternates } from '@/lib/seo'
import { publicUrl } from '@/lib/site'
import { RecipeDocument } from '@/components/RecipeDocument'

type RestParams = { rest: string[] }

interface Props { params: RestParams }

function sourcePath(params: RestParams): string {
  return '/' + params.rest.join('/')
}

export async function generateMetadata({ params }: Props) {
  const path = sourcePath(params)
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

export default async function LegacyPublicRoute({ params }: Props) {
  const path = sourcePath(params)

  const recipe = await getRecipeByPublicPath(path)
  if (recipe) return <RecipeDocument recipe={recipe} />

  const page = await getContentPageByPublicPath(path)
  if (page) {
    const html = (page.content_html ?? '')
      .replace(/<script[\s\S]*?<\/script>/gi, '')
      .replace(/<style[\s\S]*?<\/style>/gi, '')
      .replace(/\son\w+\s*=\s*(['"]).*?\1/gi, '')
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

  const normalized = path.replace(/\/+$/, '') || '/'
  const candidates = normalized === '/' ? [path] : [path, normalized, normalized + '/']
  const { data } = await import('@/lib/supabase/public').then(({ supabase }) =>
    supabase.from('content_redirects').select('target_path').in('source_path', candidates).limit(1).maybeSingle()
  )
  if (data?.target_path) permanentRedirect(data.target_path)

  notFound()
}

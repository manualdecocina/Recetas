import type { Metadata } from 'next'
import { notFound, permanentRedirect } from 'next/navigation'
import { getContentPageByPublicPath, getRecipeByPublicPath, getRecipeTranslations } from '@/lib/public-content'
import { recipeAlternates, recipeMetaText } from '@/lib/seo'
import { publicUrl, absoluteUrl } from '@/lib/site'
import { SUPPORTED_LANGUAGES } from '@/types/recipe'
import { RecipeDocument } from '@/components/RecipeDocument'
import { InstitutionalPage } from '@/components/InstitutionalPage'
import { legacyMetadata, LegacyPublicPage } from '@/lib/legacy-route'

type LangRestParams = { lang: string; rest: string[] }

interface Props { params: Promise<LangRestParams> }

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
  const resolvedParams = await params
  const path = pathFor(resolvedParams)
  // Primer segmento que no es idioma: ruta histórica de la raíz con varios segmentos.
  if (!isLang(resolvedParams.lang)) return legacyMetadata(path)

  const recipe = await getRecipeByPublicPath(path)
  if (recipe) {
    const translations = await getRecipeTranslations(recipe.recipe_group_id)
    return {
      title: recipeMetaText(recipe).title,
      description: recipeMetaText(recipe).description,
      alternates: recipeAlternates(recipe, translations),
      openGraph: {
        type: 'article',
        title: recipe.title,
        description: recipe.excerpt ?? undefined,
        url: publicUrl(recipe.public_path),
        images: recipe.image_url ? [absoluteUrl(recipe.image_url)] : undefined,
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
  const resolvedParams = await params
  const path = pathFor(resolvedParams)
  if (!isLang(resolvedParams.lang)) return <LegacyPublicPage path={path} />

  const recipe = await getRecipeByPublicPath(path)
  if (recipe) return <RecipeDocument recipe={recipe} />

  const page = await getContentPageByPublicPath(path)
  if (page) {
    return (
      <InstitutionalPage lang={resolvedParams.lang} title={page.title} intro={page.excerpt ?? undefined}>
        {page.content_html && <div className="md-rich" dangerouslySetInnerHTML={{ __html: cleanHtml(page.content_html) }} />}
      </InstitutionalPage>
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

import type { Metadata } from 'next'
import { notFound, permanentRedirect } from 'next/navigation'
import { getContentPageByPublicPath, getRecipeByPublicPath, getRecipeTranslations } from '@/lib/public-content'
import { recipeAlternates } from '@/lib/seo'
import { publicUrl } from '@/lib/site'
import { SUPPORTED_LANGUAGES } from '@/types/recipe'
import { RecipeDocument } from '@/components/RecipeDocument'
import { InstitutionalPage } from '@/components/InstitutionalPage'

/**
 * Resolución de URLs públicas por `public_path` (recetas, páginas de contenido y redirecciones 301).
 * Se usa desde tres rutas: `[...rest]` (raíz), `[lang]/page` y `[lang]/[...rest]`.
 * Next da prioridad a `[lang]` sobre `[...rest]`, así que una URL de un solo segmento como
 * `/receta-bondiola-de-cerdo` llega a `[lang]` con lang="receta-bondiola-de-cerdo": esas rutas
 * deben delegar aquí cuando el primer segmento no es un idioma.
 */

export function isSupportedLang(value: string): boolean {
  return (SUPPORTED_LANGUAGES as string[]).includes(value)
}

function cleanHtml(html: string): string {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/<style[\s\S]*?<\/style>/gi, '')
    .replace(/\son\w+\s*=\s*(['"]).*?\1/gi, '')
    .replace(/javascript:/gi, '')
}

export async function legacyMetadata(path: string): Promise<Metadata> {
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

export async function LegacyPublicPage({ path, lang = 'es' }: { path: string; lang?: string }) {
  const recipe = await getRecipeByPublicPath(path)
  if (recipe) return <RecipeDocument recipe={recipe} />

  const page = await getContentPageByPublicPath(path)
  if (page) {
    return (
      <InstitutionalPage lang={lang} title={page.title} intro={page.excerpt ?? undefined}>
        {page.content_html && <div className="md-rich" dangerouslySetInnerHTML={{ __html: cleanHtml(page.content_html) }} />}
      </InstitutionalPage>
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

import type { Metadata } from 'next'
import { notFound, permanentRedirect, redirect } from 'next/navigation'
import { getContentRedirect, getContentPageByPublicPath, getRecipeByPublicPath, getRecipeTranslations, getRelatedRecipes, getPublishedPublicPaths } from '@/lib/public-content'
import { recipeAlternates, recipeMetaText, recipeSocialImages, withSiteName, SITE_NAME, SOCIAL_LOCALE } from '@/lib/seo'
import { publicUrl, recipeCanonicalUrl, absoluteUrl } from '@/lib/site'
import { SUPPORTED_LANGUAGES } from '@/types/recipe'
import { RecipeDocument } from '@/components/RecipeDocument'
import { InstitutionalPage } from '@/components/InstitutionalPage'
import { legacyMetadata, LegacyPublicPage } from '@/lib/legacy-route'

type LangRestParams = { lang: string; rest: string[] }

interface Props { params: Promise<LangRestParams> }

export const revalidate = 3600

export async function generateStaticParams() {
  const paths = await getPublishedPublicPaths()
  return paths
    .map((path) => path.split('/').filter(Boolean))
    .filter((segments) => segments.length >= 2)
    .map(([lang, ...rest]) => ({ lang, rest }))
}

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
    const meta = recipeMetaText(recipe)
    const images = recipeSocialImages(recipe)
    return {
      title: meta.title,
      description: meta.description,
      alternates: recipeAlternates(recipe, translations),
      openGraph: {
        type: 'article',
        siteName: SITE_NAME,
        locale: SOCIAL_LOCALE[recipe.language] ?? SOCIAL_LOCALE.es,
        title: meta.title,
        description: meta.description,
        url: recipeCanonicalUrl(recipe),
        images,
      },
      twitter: {
        card: images ? 'summary_large_image' : 'summary',
        title: meta.title,
        description: meta.description,
        images,
      },
    }
  }

  const page = await getContentPageByPublicPath(path)
  if (!page) return {}

  const pageTitle = withSiteName(page.title)
  const pageImages = page.featured_image_url ? [{ url: absoluteUrl(page.featured_image_url), alt: page.title }] : undefined
  return {
    title: pageTitle,
    description: page.excerpt ?? undefined,
    alternates: { canonical: publicUrl(page.public_path) },
    openGraph: {
      type: 'article',
        siteName: SITE_NAME,
        locale: SOCIAL_LOCALE[resolvedParams.lang] ?? SOCIAL_LOCALE.es,
      title: pageTitle,
      description: page.excerpt ?? undefined,
      url: publicUrl(page.public_path),
      images: pageImages,
    },
    twitter: {
      card: pageImages ? 'summary_large_image' : 'summary',
      title: pageTitle,
      description: page.excerpt ?? undefined,
      images: pageImages,
    },
  }
}

export default async function PublicLanguageRoute({ params }: Props) {
  const resolvedParams = await params
  const path = pathFor(resolvedParams)
  if (!isLang(resolvedParams.lang)) return <LegacyPublicPage path={path} />

  const recipe = await getRecipeByPublicPath(path)
  if (recipe) {
    const relatedRecipes = await getRelatedRecipes(recipe)
    return <RecipeDocument recipe={recipe} relatedRecipes={relatedRecipes} />
  }

  const page = await getContentPageByPublicPath(path)
  if (page) {
    return (
      <InstitutionalPage lang={resolvedParams.lang} title={page.title} intro={page.excerpt ?? undefined}>
        {page.content_html && <div className="md-rich" dangerouslySetInnerHTML={{ __html: cleanHtml(page.content_html) }} />}
      </InstitutionalPage>
    )
  }

  const redirectTo = await getContentRedirect(path)
  if (redirectTo) {
    if (redirectTo.permanent) permanentRedirect(redirectTo.target_path)
    redirect(redirectTo.target_path)
  }

  notFound()
}

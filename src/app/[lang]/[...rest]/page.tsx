import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { supabase } from '@/lib/supabase/public'
import { SUPPORTED_LANGUAGES, type RecipeLanguage } from '@/types/recipe'

function cleanHtml(html: string): string {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/<style[\s\S]*?<\/style>/gi, '')
    .replace(/\son\w+\s*=\s*(['"]).*?\1/gi, '')
    .replace(/javascript:/gi, '')
}

interface Props { params: { lang: string; rest: string[] } }

function isLang(value: string): value is RecipeLanguage {
  return (SUPPORTED_LANGUAGES as string[]).includes(value)
}

async function getPage(lang: string, slug: string) {
  const { data, error } = await supabase.from('content_pages').select('*').eq('language', lang).eq('slug', slug).eq('published', true).maybeSingle()
  if (error) throw new Error('No se pudo cargar el contenido: ' + error.message)
  return data
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  if (!isLang(params.lang)) return {}
  const slug = params.rest.join('/')
  const page = await getPage(params.lang, slug)
  if (!page) return {}
  return {
    title: page.title,
    description: page.excerpt ?? undefined,
    alternates: { canonical: '/' + page.language + '/' + page.slug },
    openGraph: { title: page.title, description: page.excerpt ?? undefined, url: '/' + page.language + '/' + page.slug, images: page.featured_image_url ? [page.featured_image_url] : undefined },
  }
}

export default async function ContentPage({ params }: Props) {
  if (!isLang(params.lang)) notFound()
  const slug = params.rest.join('/')
  const page = await getPage(params.lang, slug)
  if (!page) notFound()
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
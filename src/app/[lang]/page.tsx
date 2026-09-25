import Image from 'next/image'
import { notFound, permanentRedirect } from 'next/navigation'
import type { Metadata } from 'next'
import { supabase } from '@/lib/supabase/public'
import { getContentPageByPublicPath, getRecipeByPublicPath, getRecipeTranslations } from '@/lib/public-content'
import { RecipeCard } from '@/components/RecipeCard'
import { RecipeDocument } from '@/components/RecipeDocument'
import { SiteHeader } from '@/components/SiteHeader'
import { publicUrl } from '@/lib/site'
import { recipeAlternates } from '@/lib/seo'
import { UI_TEXT } from '@/lib/i18n'
import { allLanguageAlternates } from '@/lib/seo'
import { SUPPORTED_LANGUAGES, type RecipeLanguage } from '@/types/recipe'

export const revalidate = 3600

const CARD_FIELDS = 'id, language, slug, public_path, title, excerpt, category, image_url'

const CATEGORIES = [
  ['Platos principales', 'platos-principales'],
  ['Entrantes y aperitivos', 'entrantes-y-aperitivos'],
  ['Sopas y cremas', 'sopas-y-cremas'],
  ['Ensaladas', 'ensaladas'],
  ['Guarniciones', 'guarniciones'],
  ['Salsas y aderezos', 'salsas-y-aderezos'],
  ['Panes y masas', 'panes-y-masas'],
  ['Postres', 'postres'],
  ['Desayunos y brunch', 'desayunos-y-brunch'],
  ['Bebidas', 'bebidas'],
] as const

const CATEGORY_IMAGES: Record<string, string> = {
  'platos-principales': 'https://manualdecocina.com/wp-content/uploads/2024/04/alfredo-2.png',
  'entrantes-y-aperitivos': 'https://manualdecocina.com/wp-content/uploads/2024/02/Hummus-530x501.jpg',
  'sopas-y-cremas': 'https://manualdecocina.com/wp-content/uploads/2023/06/ajiaco.jpg',
  'ensaladas': 'https://manualdecocina.com/wp-content/uploads/2023/06/ensalada-caprese.jpg',
  'guarniciones': 'https://manualdecocina.com/wp-content/uploads/2024/03/Como-hacer-kimchi-copia-530x501.jpg',
  'salsas-y-aderezos': 'https://manualdecocina.com/wp-content/uploads/2025/06/Receta-Salsa-de-Tomate-Casera-Facil-Rapida-y-Deliciosa-1-530x530.jpg',
  'panes-y-masas': 'https://manualdecocina.com/wp-content/uploads/2023/04/Empanada-Peruana-de-Pollo.jpg',
  'postres': 'https://manualdecocina.com/wp-content/uploads/2025/06/Cheesecake-de-Oreo-Postre-Cremoso-y-Facil-de-Preparar-530x530.jpg',
  'desayunos-y-brunch': 'https://manualdecocina.com/wp-content/uploads/2025/06/Acai-Bowl-2.jpg',
  'bebidas': 'https://manualdecocina.com/wp-content/uploads/2024/04/Receta-Jugo-Anticancerigeno-530x489.jpg',
}

function parseLang(value: string): RecipeLanguage | null {
  return (SUPPORTED_LANGUAGES as string[]).includes(value) ? (value as RecipeLanguage) : null
}

async function rootLegacyMetadata(path: string): Promise<Metadata> {
  const recipe = await getRecipeByPublicPath(path)
  if (recipe) {
    const translations = await getRecipeTranslations(recipe.recipe_group_id)
    return { title: recipe.title, description: recipe.excerpt ?? undefined, alternates: recipeAlternates(recipe, translations), openGraph: { type: 'article', title: recipe.title, description: recipe.excerpt ?? undefined, url: publicUrl(recipe.public_path), images: recipe.image_url ? [recipe.image_url] : undefined } }
  }
  const page = await getContentPageByPublicPath(path)
  if (!page) return {}
  return { title: page.title, description: page.excerpt ?? undefined, alternates: { canonical: publicUrl(page.public_path) }, openGraph: { type: 'article', title: page.title, description: page.excerpt ?? undefined, url: publicUrl(page.public_path), images: page.featured_image_url ? [page.featured_image_url] : undefined } }
}

async function rootLegacyPage(path: string) {
  const recipe = await getRecipeByPublicPath(path)
  if (recipe) return <RecipeDocument recipe={recipe} />
  const page = await getContentPageByPublicPath(path)
  if (page) {
    const html = (page.content_html ?? '')
      .replace(/<script[\s\S]*?<\/script>/gi, '')
      .replace(/<style[\s\S]*?<\/style>/gi, '')
      .replace(/\son\w+\s*=\s*(['"]).*?\1/gi, '')
      .replace(/javascript:/gi, '')
    return <main><article><h1>{page.title}</h1>{page.excerpt && <p>{page.excerpt}</p>}{html && <div dangerouslySetInnerHTML={{ __html: html }} />}</article></main>
  }
  const normalized = path.replace(/\/+$/, '') || '/'
  const candidates = [path, normalized, normalized + '/']
  const { data } = await supabase.from('content_redirects').select('target_path').in('source_path', candidates).limit(1).maybeSingle()
  if (data?.target_path) permanentRedirect(data.target_path)
  return null
}

export async function generateStaticParams() {
  return SUPPORTED_LANGUAGES.map((lang) => ({ lang }))
}

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang: rawLang } = await params
  const lang = parseLang(rawLang)
  if (!lang) return rootLegacyMetadata(`/${rawLang}`)
  const text = UI_TEXT[lang]
  return { title: text.homeTitle, description: text.homeDescription, alternates: allLanguageAlternates(`/${lang}`, (l) => `/${l}`) }
}

export default async function LanguageHome({ params }: { params: Promise<{ lang: string }> }) {
  const { lang: rawLang } = await params
  const lang = parseLang(rawLang)
  if (!lang) {
    const legacy = await rootLegacyPage(`/${rawLang}`)
    if (legacy) return legacy
    notFound()
  }
  const text = UI_TEXT[lang]
  const { data: recipes, error } = await supabase
    .from('recipes')
    .select(CARD_FIELDS)
    .eq('language', lang)
    .eq('published', true)
    .order('published_at', { ascending: false })
    .limit(40)

  if (error) throw new Error(`No se pudieron cargar las recetas: ${error.message}`)

  const [latest, ...grid] = recipes ?? []
  const secondary = grid.slice(0, 6)
  const remaining = grid.slice(6, 12)

  return (
    <>
      <SiteHeader lang={lang} />
      <main className="home">
        <section className="hero">
          <div className="hero__layout">
            <div className="hero__copy">
              <p className="eyebrow">Manual de Cocina</p>
              <h1>Recetas para cocinar<br /><em>bien, todos los días.</em></h1>
              <p className="hero__intro">Recetas claras, ideas para descubrir y herramientas para cocinar sin complicaciones.</p>
              <form className="hero-search" action={`/${lang}/recetas/`} method="get">
                <label htmlFor="home-search">¿Qué quieres cocinar?</label>
                <div>
                  <input id="home-search" name="q" type="search" placeholder="Prueba «pollo rápido» o «pasta»" />
                  <button type="submit">Buscar</button>
                </div>
              </form>
            </div>
            {latest?.image_url && (
              <div className="hero__image">
                <Image src={latest.image_url} alt={latest.title} fill priority sizes="(max-width: 900px) 100vw, 43vw" />
                <span>{latest.category ?? 'Receta destacada'}</span>
              </div>
            )}
          </div>
        </section>

        <section id="categorias" className="home-section category-section" aria-labelledby="categories-title">
          <div className="section-heading">
            <div><p className="eyebrow">Explora</p><h2 id="categories-title">¿Qué te apetece cocinar?</h2></div>
            <a href={`/${lang}/recetas/`}>Ver todas las recetas</a>
          </div>
          <div className="category-grid">
            {CATEGORIES.map(([label, slug], index) => {
              const categoryRecipe = (recipes ?? []).find((recipe) => {
                const value = (recipe.category ?? '').toLowerCase()
                return value === label.toLowerCase() || value.includes(label.split(' ')[0].toLowerCase())
              })
              const imageUrl = categoryRecipe?.image_url ?? CATEGORY_IMAGES[slug]
              return (
                <a key={slug} href={`/${lang}/recetas/?categoria=${slug}`} className={`category-link category-link--${index + 1}`}>
                  <Image src={imageUrl} alt="" fill sizes="(max-width: 700px) 50vw, (max-width: 1000px) 33vw, 20vw" />
                  <span className="category-link__veil" aria-hidden="true" />
                  <strong>{label}</strong>
                  <span className="category-link__arrow" aria-hidden="true">↗</span>
                </a>
              )
            })}
          </div>
        </section>

        {latest && (
          <section className="home-section latest-section" aria-labelledby="latest-title">
            <div className="section-heading">
              <div><p className="eyebrow">Recién publicado</p><h2 id="latest-title">Para cocinar hoy</h2></div>
              <a href={`/${lang}/recetas/`}>Ver recetas</a>
            </div>
            <div className="featured-recipe">
              <RecipeCard recipe={latest} priority featured />
            </div>
            {secondary.length > 0 && <div className="recipe-grid">{secondary.map((recipe, index) => <RecipeCard key={recipe.id} recipe={recipe} priority={index < 2} />)}</div>}
            {remaining.length > 0 && (
              <div className="home-secondary-grid">
                {remaining.map((recipe) => <RecipeCard key={recipe.id} recipe={recipe} />)}
              </div>
            )}
          </section>
        )}

        <section id="colecciones" className="home-section editorial-band">
          <div><p className="eyebrow">Más que recetas</p><h2>Un manual para descubrir, aprender y cocinar.</h2></div>
          <div className="editorial-band__content">
            <p>Recetas claras, ingredientes, categorías y herramientas para pasar de la idea al plato.</p>
            <div className="editorial-links">
              <a href={`/${lang}/recetas/`}>Explorar recetas <span>→</span></a>
              <a href={`/${lang}/ingredientes/`}>Explorar ingredientes <span>→</span></a>
            </div>
          </div>
        </section>

        <section id="guias" className="home-section closing-cta">
          <p className="eyebrow">Manual de Cocina</p>
          <h2>Busca una receta.<br />Abre el manual.<br /><em>Empieza a cocinar.</em></h2>
          <a className="button button--dark" href={`/${lang}/recetas/`}>Explorar recetas</a>
        </section>
      </main>
    </>
  )
}

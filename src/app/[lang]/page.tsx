import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { SiteHeader } from '@/components/SiteHeader'
import { UI_TEXT } from '@/lib/i18n'
import { allLanguageAlternates } from '@/lib/seo'
import { SUPPORTED_LANGUAGES, type RecipeLanguage } from '@/types/recipe'

export const revalidate = 3600

function parseLang(value: string): RecipeLanguage | null {
  return (SUPPORTED_LANGUAGES as string[]).includes(value) ? (value as RecipeLanguage) : null
}

export async function generateStaticParams() {
  return SUPPORTED_LANGUAGES.map((lang) => ({ lang }))
}

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang: rawLang } = await params
  const lang = parseLang(rawLang)
  if (!lang) return {}
  const text = UI_TEXT[lang]
  return {
    title: text.homeTitle,
    description: text.homeDescription,
    alternates: allLanguageAlternates('/' + lang, (l) => '/' + l),
  }
}

const intents = [
  ['Entre semana', 'Rápido, sencillo y sin ensuciar media cocina.', '→', 'platos-principales'],
  ['Para compartir', 'Picadas, entradas, masas y cosas que desaparecen de la mesa.', '→', 'entrantes-y-aperitivos'],
  ['Algo dulce', 'Postres y masas cuando el antojo manda.', '→', 'postres'],
  ['Con lo que tengo', 'Ideas para convertir básicos de despensa en comida de verdad.', '→', 'ingredientes'],
  ['Quiero aprender', 'Técnicas explicadas para entender qué haces y por qué funciona.', '→', 'aprender-tecnicas'],
  ['Desde cero', 'Bases, fondos, cortes y preparaciones que construyen una buena cocina.', '→', 'escuela'],
] as const

const categories = [
  ['Platos fuertes', '01', 'Comidas completas, de diario y de celebración.'],
  ['Panes y masas', '02', 'Fermentos, masas, pizzas y horno.'],
  ['Salsas y fondos', '03', 'La base que hace que un plato tenga sentido.'],
  ['Postres', '04', 'Dulce, horno, cremas y preparaciones para guardar.'],
  ['Sopas y cremas', '05', 'Cocina de cuchara, caldo y textura.'],
  ['Bebidas', '06', 'Refrescos, infusiones, batidos y bebidas caseras.'],
] as const

const principles = [
  ['01', 'Recetas que explican', 'No solo una lista de pasos. Cantidades, señales, tiempos y decisiones para que sepas qué buscar mientras cocinas.'],
  ['02', 'Técnica sin humo', 'Lo importante explicado con palabras normales: calor, sal, textura, emulsión, reposo y organización.'],
  ['03', 'Una cocina para la vida real', 'Ingredientes accesibles, sustituciones útiles y procesos pensados para una cocina doméstica.'],
] as const

export default async function LanguageHome({ params }: { params: Promise<{ lang: string }> }) {
  const { lang: rawLang } = await params
  const lang = parseLang(rawLang)
  if (!lang) notFound()

  return (
    <>
      <SiteHeader lang={lang} />

      <main className="mc-home">
        <section className="mc-hero">
          <div className="mc-hero__statement">
            <span className="mc-overline">MANUAL DE COCINA · RECETAS + TÉCNICA</span>
            <h1>Cocina bien.<br /><i>Entiende</i> por qué.</h1>
            <p>Un lugar para cocinar todos los días, aprender lo que realmente importa y dejar de depender de recetas que solo dicen qué hacer.</p>
            <div className="mc-hero__actions">
              <a className="mc-btn mc-btn--solid" href={'/' + lang + '/recetas/'}>Explorar recetas <span>↗</span></a>
              <a className="mc-btn mc-btn--text" href={'/' + lang + '/aprender-tecnicas/'}>Aprender técnicas</a>
            </div>
          </div>

          <div className="mc-hero__object" aria-label="Manual de Cocina">
            <div className="mc-plate">
              <span className="mc-plate__leaf mc-plate__leaf--a" />
              <span className="mc-plate__leaf mc-plate__leaf--b" />
              <span className="mc-plate__tomato mc-plate__tomato--a" />
              <span className="mc-plate__tomato mc-plate__tomato--b" />
              <span className="mc-plate__herb mc-plate__herb--a" />
              <span className="mc-plate__herb mc-plate__herb--b" />
              <div className="mc-plate__center">MDC</div>
            </div>
            <div className="mc-hero__note"><b>01</b><span>El sabor empieza antes de encender el fuego.</span></div>
          </div>
        </section>

        <section className="mc-intents">
          <div className="mc-section-head">
            <span className="mc-overline">¿QUÉ NECESITAS HOY?</span>
            <h2>Entra por el problema,<br /><i>no por la categoría.</i></h2>
          </div>
          <div className="mc-intent-grid">
            {intents.map(([title, desc, arrow, slug], index) => (
              <a key={slug} className="mc-intent" href={'/' + lang + '/' + slug + '/'}>
                <span className="mc-intent__number">{String(index + 1).padStart(2, '0')}</span>
                <div><h3>{title}</h3><p>{desc}</p></div><span className="mc-intent__arrow">{arrow}</span>
              </a>
            ))}
          </div>
        </section>

        <section className="mc-categories">
          <div className="mc-section-head mc-section-head--row">
            <div><span className="mc-overline">EL MAPA</span><h2>Explora la cocina.</h2></div>
            <a href={'/' + lang + '/categorias/'}>Ver todas <span>↗</span></a>
          </div>
          <div className="mc-category-grid">
            {categories.map(([title, number, desc]) => (
              <a className="mc-category" key={title} href={'/' + lang + '/recetas/'}>
                <span>{number}</span><h3>{title}</h3><p>{desc}</p><b>↗</b>
              </a>
            ))}
          </div>
        </section>

        <section className="mc-method">
          <div className="mc-method__lead">
            <span className="mc-overline">NUESTRO MÉTODO</span>
            <h2>No queremos que<br /><i>memorices recetas.</i></h2>
            <p>Queremos que después de cocinar una vez puedas mirar un ingrediente y saber qué hacer con él.</p>
            <a className="mc-btn mc-btn--outline" href={'/' + lang + '/aprender-tecnicas/'}>Entrar a la Escuela ↗</a>
          </div>
          <div className="mc-principles">
            {principles.map(([number, title, desc]) => (
              <article key={number}><span>{number}</span><div><h3>{title}</h3><p>{desc}</p></div></article>
            ))}
          </div>
        </section>

        <section className="mc-manifesto">
          <span className="mc-overline">MANUAL DE COCINA</span>
          <blockquote>“Una buena receta te lleva hasta el plato. Una buena cocina te enseña a llegar sola.”</blockquote>
          <a href={'/' + lang + '/recetas/'}>Empezar a cocinar <span>↗</span></a>
        </section>
      </main>
    </>
  )
}

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

const PHOTOS = {
  hero: 'https://images.unsplash.com/photo-1473093295043-cdd812d0e601?auto=format&fit=crop&w=1800&q=88',
  spices: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=1200&q=88',
  entradas: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=1200&q=88',
  panes: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=1200&q=88',
  fuertes: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1200&q=88',
  postres: 'https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?auto=format&fit=crop&w=1200&q=88',
  salsas: 'https://images.unsplash.com/photo-1473093295043-cdd812d0e601?auto=format&fit=crop&w=1200&q=88',
  bebidas: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=1200&q=88',
  sopas: 'https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=1200&q=88',
  ciencia: 'https://images.unsplash.com/photo-1556911220-bff31c812dba?auto=format&fit=crop&w=1200&q=88',
  compra: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=1200&q=88',
  tecnicas: 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&w=1200&q=88',
  destacado: 'https://images.unsplash.com/photo-1579751626657-72bc17010498?auto=format&fit=crop&w=1600&q=88',
}
const categories = [
  ['Entradas y picadas','Aperitivos, bocados, tablas, dips y platos para compartir.','entradas',PHOTOS.entradas],
  ['Panadería y masas','Panes, pizzas, empanadas, tartas y masas caseras.','panes',PHOTOS.panes],
  ['Platos fuertes','Comidas completas para almuerzos, cenas y reuniones.','fuertes',PHOTOS.fuertes],
  ['Postres y dulces','Tortas, cremas, galletas, rellenos y dulces caseros.','postres',PHOTOS.postres],
  ['Salsas y fondos','Caldos, fondos, reducciones y bases llenas de sabor.','salsas',PHOTOS.salsas],
  ['Bebidas','Jugos, refrescos, infusiones, batidos y bebidas caseras.','bebidas',PHOTOS.bebidas],
  ['Sopas y cremas','Platos de cuchara, cremas suaves y sopas reconfortantes.','sopas',PHOTOS.sopas],
] as const
const school = [
  ['Escuela','Ciencia gastronómica','Sabor, textura, calor, emulsiones, fermentación y técnica explicada.',PHOTOS.ciencia,'/es/aprender-tecnicas/'],
  ['Consejos','Guía de compra','Ingredientes frescos, utensilios útiles y básicos de despensa.',PHOTOS.compra,'/es/guias/'],
  ['Técnicas','Técnicas de cocina','Cortes, cocciones, organización y métodos básicos para cocinar mejor.',PHOTOS.tecnicas,'/es/aprender-tecnicas/'],
] as const
const guides = [
  ['Técnicas básicas','Cortes, cocciones, salteados, horneados y métodos que se repiten en muchas recetas.','/es/aprender-tecnicas/'],
  ['Ingredientes y utensilios','Cómo elegir productos frescos, básicos de despensa y herramientas útiles.','/es/guias/'],
  ['Bases de sabor','Fondos, caldos, salsas y preparaciones que elevan platos sencillos.','/es/recetas/'],
  ['Masas y panadería','Harinas, fermentación, amasado, reposos y horneado para recetas caseras.','/es/recetas/'],
] as const
export default async function LanguageHome({ params }: { params: Promise<{ lang: string }> }) {
  const { lang: rawLang } = await params
  const lang = parseLang(rawLang)
  if (!lang) { const legacy = await rootLegacyPage('/' + rawLang); if (legacy) return legacy; notFound() }
  return (
    <>
      <SiteHeader lang={lang} />
      <main className="reference-home">
        <section className="reference-hero"><div className="reference-hero__photo"><img src={PHOTOS.hero} alt="Pasta recién preparada" /></div><div className="reference-hero__panel"><span className="reference-pill">RECETAS · TÉCNICAS · ESCUELA</span><h1>Manual de<br />Cocina</h1><p>Recetas caseras, técnicas culinarias y guías prácticas para cocinar con más confianza, mejor sabor y menos complicaciones.</p><div className="reference-actions"><a className="reference-button reference-button--gold" href={'/' + lang + '/recetas/'}>EXPLORAR RECETAS</a><a className="reference-button" href={'/' + lang + '/aprender-tecnicas/'}>APRENDER TÉCNICAS</a></div></div></section>
        <section className="reference-intro"><div className="reference-intro__image"><img src={PHOTOS.spices} alt="Especias e ingredientes" /></div><div className="reference-card"><span className="reference-kicker">RECETAS DE COCINA</span><h2>Cocina mejor con recetas claras, técnicas útiles y una guía pensada para el día a día.</h2><p>Manual de Cocina reúne recetas de cocina organizadas por categoría, explicaciones prácticas y consejos para que cada preparación tenga sentido desde el primer paso. Aquí encontrarás ideas para cocinar en casa, mejorar tus platos, aprender técnicas culinarias y elegir mejor los ingredientes.</p><p>La web está pensada para quienes buscan recetas fáciles, platos completos, postres caseros, masas, bebidas, sopas, cremas, salsas y fondos. También incluye escuela de cocina, ciencia gastronómica, guías de compra y técnicas para entender mejor la cocción, la textura, el sabor y la organización.</p></div></section>
        <section className="reference-search"><span className="reference-kicker">BUSCAR EN MANUAL DE COCINA</span><h2>Encuentra recetas,<br />técnicas, postres, masas,<br />bebidas y más.</h2><form action={'/' + lang + '/recetas/'} method="get"><input name="q" type="search" placeholder="Buscar: postres, masas, bebidas, salsas, técnicas..." /><button>Buscar</button></form></section>
        <section className="reference-section"><span className="reference-kicker">CATEGORÍA PADRE</span><h2>Recetas</h2><p className="reference-lead">Recetas de cocina para preparar entradas, panes, platos fuertes, postres, salsas, bebidas, sopas y cremas.</p><div className="reference-card-grid">{categories.map(([label,desc,slug,image]) => <a className="photo-card" key={slug} href={'/' + lang + '/recetas/?categoria=' + slug}><img src={image} alt="" /><span className="photo-card__shade" /><span className="photo-card__tag">RECETAS</span><h3>{label}</h3><p>{desc}</p></a>)}</div></section>
        <section className="reference-section reference-school"><span className="reference-kicker">CATEGORÍA PADRE</span><h2>Tips y Escuela</h2><p className="reference-lead">Aprende técnicas de cocina, compra mejor y entiende el porqué de cada preparación.</p><div className="reference-card-grid">{school.map(([tag,title,desc,image,href]) => <a className="photo-card" key={title} href={href}><img src={image} alt="" /><span className="photo-card__shade" /><span className="photo-card__tag">{tag.toUpperCase()}</span><h3>{title}</h3><p>{desc}</p></a>)}</div></section>
        <section className="reference-section"><span className="reference-kicker">DESTACADOS</span><h2>Ideas para cocinar hoy</h2><p className="reference-lead">Enlaces pensados para llevarte directamente a las categorías principales de la web.</p><a className="featured-reference-card" href={'/' + lang + '/recetas/?categoria=platos-principales'}><img src={PHOTOS.destacado} alt="Platos fuertes" /><div><h3>Platos fuertes para comidas completas</h3><p>Recetas de cocina para almuerzos, cenas y preparaciones principales con ingredientes claros, buena técnica y sabor casero.</p><span>VER PLATOS FUERTES ↗</span></div></a></section>
        <section className="reference-section reference-guides"><span className="reference-kicker">EMPIEZA POR AQUÍ</span><h2>Guías esenciales para cocinar mejor</h2><div className="guide-grid">{guides.map(([title,desc,href]) => <a key={title} href={href}><h3>{title}</h3><p>{desc}</p><span>↗</span></a>)}</div></section>
        <section className="reference-section reference-faq"><span className="reference-kicker">PREGUNTAS FRECUENTES</span><h2>Dudas comunes sobre recetas de cocina</h2><details><summary>¿Qué tipo de recetas puedo encontrar?</summary><p>Entradas, masas, platos fuertes, postres, salsas, bebidas, sopas y cremas organizadas por categoría.</p></details><details><summary>¿Manual de Cocina sirve para principiantes?</summary><p>Sí. La web está pensada para aprender con recetas fáciles, explicaciones claras y técnicas paso a paso.</p></details><details><summary>¿Qué aporta Tips y Escuela?</summary><p>Ciencia gastronómica, guías de compra y técnicas culinarias para cocinar con más criterio.</p></details><details><summary>¿Dónde aprendo técnicas de cocina?</summary><p>En Técnicas de cocina encontrarás cortes, cocciones, organización, utensilios y métodos básicos.</p></details></section>
        <section className="reference-cta"><span className="reference-kicker">MANUAL DE COCINA</span><h2>Cocina con más confianza.</h2><p>Explora recetas, aprende técnicas culinarias y usa Manual de Cocina como una guía práctica para preparar mejores platos en casa.</p><a className="reference-button reference-button--gold" href={'/' + lang + '/recetas/'}>VER RECETAS</a></section>
      </main>
    </>
  )
}

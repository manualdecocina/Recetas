import type { Metadata } from 'next'
import Image from 'next/image'
import { InstitutionalPage } from '@/components/InstitutionalPage'
import { getSiteUrl, normalizePublicPath } from '@/lib/site'
import { SUPPORTED_LANGUAGES, type RecipeLanguage } from '@/types/recipe'

interface QuienesSomosContent {
  metaTitle: string
  metaDescription: string
  eyebrow: string
  title: string
  intro: string
  photoAlt: string
  role: string
  bioParagraphs: string[]
  credentials: string[]
  projectParagraph: string
  disclaimerParagraph: string
}

const CONTENT: Record<RecipeLanguage, QuienesSomosContent> = {
  es: {
    metaTitle: 'Quiénes somos — Néstor Bastidas | Manual de Cocina',
    metaDescription:
      'Manual de Cocina está dirigido por Néstor Bastidas, chef colombiano con más de 15 años de experiencia en cocina profesional en Latinoamérica, Estados Unidos y España.',
    eyebrow: 'Manual de Cocina',
    title: 'Quiénes somos',
    intro: 'Un proyecto editorial gastronómico para cocinar mejor, con recetas claras y herramientas útiles.',
    photoAlt: 'Néstor Bastidas, chef y responsable editorial de Manual de Cocina, en una cocina profesional',
    role: 'Chef · responsable editorial de Manual de Cocina',
    bioParagraphs: [
      'Néstor Bastidas es chef colombiano con más de 15 años de experiencia en cocina profesional. Se graduó como Tecnólogo en Gastronomía en el SENA (Colombia) en 2010 y, en 2013, completó su formación como profesional en gastronomía en el instituto Mausi Sebess, en Argentina.',
      'Ha trabajado en cocinas de restaurantes de cocina fusión, italiana, mediterránea y asiática en Buenos Aires, Bogotá, Cali, Medellín, Nueva York, Barcelona y Ciudad de Panamá.',
    ],
    credentials: [
      'Tecnólogo en Gastronomía — SENA, Colombia (2010)',
      'Profesional en Gastronomía — Instituto Mausi Sebess, Argentina (2013)',
      'Más de 15 años de experiencia profesional en cocina',
      'Experiencia en Buenos Aires, Bogotá, Cali, Medellín, Nueva York, Barcelona y Ciudad de Panamá',
    ],
    projectParagraph:
      'Desde hace más de dos años, Néstor dirige Manual de Cocina: un proyecto editorial gastronómico digital, hecho con dedicación para las familias que buscan una receta clara o una idea para preparar una cena especial. Reunimos recetas, categorías, ingredientes y recursos de cocina en una experiencia pensada para descubrir qué cocinar y hacerlo con confianza.',
    disclaimerParagraph: 'El proyecto no es un restaurante, no presta servicios profesionales y no mantiene una tienda de productos.',
  },
  en: {
    metaTitle: 'About us — Néstor Bastidas | Manual de Cocina',
    metaDescription:
      'Manual de Cocina is led by Néstor Bastidas, a Colombian chef with over 15 years of professional cooking experience in Latin America, the United States and Spain.',
    eyebrow: 'Manual de Cocina',
    title: 'About us',
    intro: 'A food editorial project to help you cook better, with clear recipes and useful tools.',
    photoAlt: 'Néstor Bastidas, chef and editorial lead of Manual de Cocina, in a professional kitchen',
    role: 'Chef · Editorial lead of Manual de Cocina',
    bioParagraphs: [
      'Néstor Bastidas is a Colombian chef with over 15 years of professional cooking experience. He graduated as a Culinary Arts Technologist from SENA (Colombia) in 2010 and, in 2013, completed his professional culinary training at the Mausi Sebess institute in Argentina.',
      'He has worked in the kitchens of fusion, Italian, Mediterranean and Asian restaurants in Buenos Aires, Bogotá, Cali, Medellín, New York, Barcelona and Panama City.',
    ],
    credentials: [
      'Culinary Arts Technologist — SENA, Colombia (2010)',
      'Professional Culinary Training — Mausi Sebess Institute, Argentina (2013)',
      'Over 15 years of professional cooking experience',
      'Experience in Buenos Aires, Bogotá, Cali, Medellín, New York, Barcelona and Panama City',
    ],
    projectParagraph:
      'For over two years, Néstor has led Manual de Cocina: a digital food editorial project, made with care for families looking for a clear recipe or an idea for a special dinner. We bring together recipes, categories, ingredients and cooking resources in an experience designed to help you discover what to cook and do it with confidence.',
    disclaimerParagraph: 'The project is not a restaurant, does not offer professional services, and does not run a product store.',
  },
  de: {
    metaTitle: 'Über uns — Néstor Bastidas | Manual de Cocina',
    metaDescription:
      'Manual de Cocina wird von Néstor Bastidas geleitet, einem kolumbianischen Koch mit über 15 Jahren Berufserfahrung in der professionellen Küche in Lateinamerika, den USA und Spanien.',
    eyebrow: 'Manual de Cocina',
    title: 'Über uns',
    intro: 'Ein kulinarisches Redaktionsprojekt, um besser zu kochen – mit klaren Rezepten und nützlichen Werkzeugen.',
    photoAlt: 'Néstor Bastidas, Koch und redaktioneller Leiter von Manual de Cocina, in einer Profiküche',
    role: 'Koch · Redaktionsleiter von Manual de Cocina',
    bioParagraphs: [
      'Néstor Bastidas ist ein kolumbianischer Koch mit über 15 Jahren Berufserfahrung in der professionellen Küche. Er schloss 2010 sein Studium als Gastronomie-Technologe am SENA (Kolumbien) ab und vervollständigte 2013 seine berufliche Ausbildung in Gastronomie am Institut Mausi Sebess in Argentinien.',
      'Er hat in Küchen von Fusion-, italienischen, mediterranen und asiatischen Restaurants in Buenos Aires, Bogotá, Cali, Medellín, New York, Barcelona und Panama-Stadt gearbeitet.',
    ],
    credentials: [
      'Gastronomie-Technologe — SENA, Kolumbien (2010)',
      'Berufliche Ausbildung in Gastronomie — Instituto Mausi Sebess, Argentinien (2013)',
      'Über 15 Jahre Berufserfahrung in der Küche',
      'Erfahrung in Buenos Aires, Bogotá, Cali, Medellín, New York, Barcelona und Panama-Stadt',
    ],
    projectParagraph:
      'Seit mehr als zwei Jahren leitet Néstor Manual de Cocina: ein digitales kulinarisches Redaktionsprojekt, mit Hingabe gemacht für Familien, die ein klares Rezept oder eine Idee für ein besonderes Abendessen suchen. Wir bündeln Rezepte, Kategorien, Zutaten und Kochressourcen in einem Erlebnis, das dabei helfen soll, herauszufinden, was man kochen kann, und es mit Zuversicht zu tun.',
    disclaimerParagraph: 'Das Projekt ist kein Restaurant, bietet keine professionellen Dienstleistungen an und betreibt keinen Produktshop.',
  },
  fr: {
    metaTitle: 'Qui sommes-nous — Néstor Bastidas | Manual de Cocina',
    metaDescription:
      "Manual de Cocina est dirigé par Néstor Bastidas, chef colombien avec plus de 15 ans d'expérience en cuisine professionnelle en Amérique latine, aux États-Unis et en Espagne.",
    eyebrow: 'Manual de Cocina',
    title: 'Qui sommes-nous',
    intro: 'Un projet éditorial gastronomique pour mieux cuisiner, avec des recettes claires et des outils utiles.',
    photoAlt: 'Néstor Bastidas, chef et responsable éditorial de Manual de Cocina, dans une cuisine professionnelle',
    role: 'Chef · responsable éditorial de Manual de Cocina',
    bioParagraphs: [
      "Néstor Bastidas est un chef colombien avec plus de 15 ans d'expérience en cuisine professionnelle. Il a obtenu son diplôme de technologue en gastronomie au SENA (Colombie) en 2010 et, en 2013, a complété sa formation professionnelle en gastronomie à l'institut Mausi Sebess, en Argentine.",
      'Il a travaillé dans les cuisines de restaurants de cuisine fusion, italienne, méditerranéenne et asiatique à Buenos Aires, Bogotá, Cali, Medellín, New York, Barcelone et Panama.',
    ],
    credentials: [
      'Technologue en gastronomie — SENA, Colombie (2010)',
      'Formation professionnelle en gastronomie — Institut Mausi Sebess, Argentine (2013)',
      "Plus de 15 ans d'expérience professionnelle en cuisine",
      'Expérience à Buenos Aires, Bogotá, Cali, Medellín, New York, Barcelone et Panama',
    ],
    projectParagraph:
      "Depuis plus de deux ans, Néstor dirige Manual de Cocina : un projet éditorial gastronomique numérique, conçu avec soin pour les familles à la recherche d'une recette claire ou d'une idée pour préparer un dîner spécial. Nous réunissons recettes, catégories, ingrédients et ressources de cuisine dans une expérience pensée pour découvrir quoi cuisiner et le faire en toute confiance.",
    disclaimerParagraph: 'Le projet n\'est pas un restaurant, ne propose pas de services professionnels et ne tient pas de boutique de produits.',
  },
  it: {
    metaTitle: 'Chi siamo — Néstor Bastidas | Manual de Cocina',
    metaDescription:
      'Manual de Cocina è diretto da Néstor Bastidas, chef colombiano con oltre 15 anni di esperienza in cucina professionale in America Latina, Stati Uniti e Spagna.',
    eyebrow: 'Manual de Cocina',
    title: 'Chi siamo',
    intro: 'Un progetto editoriale gastronomico per cucinare meglio, con ricette chiare e strumenti utili.',
    photoAlt: 'Néstor Bastidas, chef e responsabile editoriale di Manual de Cocina, in una cucina professionale',
    role: 'Chef · responsabile editoriale di Manual de Cocina',
    bioParagraphs: [
      "Néstor Bastidas è uno chef colombiano con oltre 15 anni di esperienza in cucina professionale. Si è diplomato come Tecnologo in Gastronomia al SENA (Colombia) nel 2010 e, nel 2013, ha completato la sua formazione professionale in gastronomia presso l'istituto Mausi Sebess, in Argentina.",
      'Ha lavorato nelle cucine di ristoranti di cucina fusion, italiana, mediterranea e asiatica a Buenos Aires, Bogotá, Cali, Medellín, New York, Barcellona e Città di Panama.',
    ],
    credentials: [
      'Tecnologo in Gastronomia — SENA, Colombia (2010)',
      'Formazione professionale in Gastronomia — Istituto Mausi Sebess, Argentina (2013)',
      'Oltre 15 anni di esperienza professionale in cucina',
      'Esperienza a Buenos Aires, Bogotá, Cali, Medellín, New York, Barcellona e Città di Panama',
    ],
    projectParagraph:
      "Da oltre due anni, Néstor dirige Manual de Cocina: un progetto editoriale gastronomico digitale, realizzato con dedizione per le famiglie che cercano una ricetta chiara o un'idea per preparare una cena speciale. Raccogliamo ricette, categorie, ingredienti e risorse di cucina in un'esperienza pensata per scoprire cosa cucinare e farlo con sicurezza.",
    disclaimerParagraph: 'Il progetto non è un ristorante, non offre servizi professionali e non gestisce un negozio di prodotti.',
  },
  pt: {
    metaTitle: 'Quem somos — Néstor Bastidas | Manual de Cocina',
    metaDescription:
      'O Manual de Cocina é dirigido por Néstor Bastidas, chef colombiano com mais de 15 anos de experiência em cozinha profissional na América Latina, Estados Unidos e Espanha.',
    eyebrow: 'Manual de Cocina',
    title: 'Quem somos',
    intro: 'Um projeto editorial gastronômico para cozinhar melhor, com receitas claras e ferramentas úteis.',
    photoAlt: 'Néstor Bastidas, chef e responsável editorial do Manual de Cocina, em uma cozinha profissional',
    role: 'Chef · responsável editorial do Manual de Cocina',
    bioParagraphs: [
      'Néstor Bastidas é um chef colombiano com mais de 15 anos de experiência em cozinha profissional. Formou-se como Tecnólogo em Gastronomia pelo SENA (Colômbia) em 2010 e, em 2013, concluiu sua formação profissional em gastronomia no instituto Mausi Sebess, na Argentina.',
      'Trabalhou em cozinhas de restaurantes de cozinha fusion, italiana, mediterrânea e asiática em Buenos Aires, Bogotá, Cali, Medellín, Nova York, Barcelona e Cidade do Panamá.',
    ],
    credentials: [
      'Tecnólogo em Gastronomia — SENA, Colômbia (2010)',
      'Formação profissional em Gastronomia — Instituto Mausi Sebess, Argentina (2013)',
      'Mais de 15 anos de experiência profissional em cozinha',
      'Experiência em Buenos Aires, Bogotá, Cali, Medellín, Nova York, Barcelona e Cidade do Panamá',
    ],
    projectParagraph:
      'Há mais de dois anos, Néstor dirige o Manual de Cocina: um projeto editorial gastronômico digital, feito com dedicação para as famílias que buscam uma receita clara ou uma ideia para preparar um jantar especial. Reunimos receitas, categorias, ingredientes e recursos de cozinha em uma experiência pensada para descobrir o que cozinhar e fazer isso com confiança.',
    disclaimerParagraph: 'O projeto não é um restaurante, não presta serviços profissionais e não mantém uma loja de produtos.',
  },
  ja: {
    metaTitle: '私たちについて — ネストル・バスティーダス | Manual de Cocina',
    metaDescription:
      'Manual de Cocinaは、ラテンアメリカ、アメリカ、スペインで15年以上のプロの料理経験を持つコロンビア人シェフ、ネストル・バスティーダスが率いています。',
    eyebrow: 'Manual de Cocina',
    title: '私たちについて',
    intro: 'より良く料理をするための料理編集プロジェクト。分かりやすいレシピと役立つツールを提供します。',
    photoAlt: 'プロの厨房に立つ、Manual de Cocinaのシェフ兼編集責任者ネストル・バスティーダス',
    role: 'シェフ・Manual de Cocina編集責任者',
    bioParagraphs: [
      'ネストル・バスティーダスは、15年以上のプロの料理経験を持つコロンビア人シェフである。2010年にコロンビアのSENAで調理技術者として卒業し、2013年にはアルゼンチンのマウシ・セベス学院でガストロノミーの専門課程を修了した。',
      'ブエノスアイレス、ボゴタ、カリ、メデジン、ニューヨーク、バルセロナ、パナマシティのフュージョン料理、イタリア料理、地中海料理、アジア料理のレストランの厨房で働いてきた。',
    ],
    credentials: [
      '調理技術者 — SENA、コロンビア（2010年）',
      'ガストロノミー専門課程 — マウシ・セベス学院、アルゼンチン（2013年）',
      '15年以上のプロの料理経験',
      'ブエノスアイレス、ボゴタ、カリ、メデジン、ニューヨーク、バルセロナ、パナマシティでの経験',
    ],
    projectParagraph:
      '2年以上にわたり、ネストルはManual de Cocinaを運営している。分かりやすいレシピや特別なディナーのアイデアを探す家庭のために、心を込めて作られたデジタル料理編集プロジェクトである。レシピ、カテゴリー、材料、調理に役立つ情報を集め、何を作るかを見つけ、自信を持って料理できるような体験を目指している。',
    disclaimerParagraph: 'このプロジェクトはレストランではなく、専門的なサービスの提供や商品の販売店の運営は行っていない。',
  },
}

function resolveLanguage(lang: string): RecipeLanguage {
  return (SUPPORTED_LANGUAGES as string[]).includes(lang) ? (lang as RecipeLanguage) : 'es'
}

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params
  const language = resolveLanguage(lang)
  const t = CONTENT[language]
  return {
    title: t.metaTitle,
    description: t.metaDescription,
    alternates: { canonical: `${getSiteUrl()}${normalizePublicPath(`/${lang}/quienes-somos`)}` },
  }
}

export default async function Page({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params
  const language = resolveLanguage(lang)
  const t = CONTENT[language]
  return (
    <InstitutionalPage lang={lang} eyebrow={t.eyebrow} title={t.title} intro={t.intro}>
      <div className="md-author">
        <figure className="md-author-photo">
          <Image
            src="/autor/nestor-bastidas.webp"
            alt={t.photoAlt}
            width={900}
            height={1200}
            sizes="(max-width: 780px) 60vw, 300px"
            priority
          />
        </figure>
        <div className="md-author-bio">
          <h2>Néstor Bastidas</h2>
          <p className="md-author-role">{t.role}</p>
          {t.bioParagraphs.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
          <ul className="md-author-credentials">
            {t.credentials.map((credential) => (
              <li key={credential}>{credential}</li>
            ))}
          </ul>
        </div>
      </div>
      <p>{t.projectParagraph}</p>
      <p>{t.disclaimerParagraph}</p>
    </InstitutionalPage>
  )
}

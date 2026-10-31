import type { RecipeLanguage } from '@/types/recipe'

/**
 * Colecciones editoriales: páginas temáticas que reúnen recetas que ya existen
 * (p. ej. Navidad colombiana). El contenido vive aquí, en el repositorio, para que cada
 * colección se revise en un PR antes de salir a la web.
 *
 * Reglas:
 * - Las recetas se citan por su public_path en español (estable: las URLs no cambian).
 *   En cada idioma se muestra la versión de ese idioma del mismo plato (recipe_group_id).
 * - Cada colección tiene los 7 idiomas completos (mismo sitio en todos los idiomas).
 * - El segmento /colecciones/ es igual en todos los idiomas, como /recetas/ y /categorias/;
 *   el slug final sí va traducido.
 */

export interface CollectionSection {
  heading: string
  /** Una o dos frases debajo del subtítulo. */
  note: string
}

export interface CollectionText {
  slug: string
  /** H1 visible. */
  title: string
  /** Título para Google (sin " | Manual de Cocina", que el sitio añade). */
  seoTitle: string
  /** Descripción para Google. */
  description: string
  /** Párrafos de introducción del chef. */
  intro: string[]
  sections: CollectionSection[]
}

export interface Collection {
  id: string
  /** Recetas por sección, en el orden en que se muestran (public_path en español). */
  sections: string[][]
  text: Record<RecipeLanguage, CollectionText>
}

export const COLLECTIONS: Collection[] = [
  {
    id: 'navidad-colombiana',
    coverDir: '/colecciones/navidad-colombiana',
    sections: [
      [
        '/receta-de-lechona-colombiana',
        // Tamal y pernil: se muestran solos en cuanto estén publicados (antes no aparecen).
        '/tamal-tolimense',
        '/pernil-de-cerdo-al-horno',
        '/natilla-colombiana',
        '/bunuelos-colombianos',
        '/hojuelas-colombianas',
        '/hojaldras-colombianas',
        '/receta-de-ajiaco',
      ],
      [
        '/lomo-de-cerdo-relleno',
        '/receta-de-ensalada-rusa',
        '/arbol-hojaldre-pesto-queso',
        '/receta-de-galletas-de-jengibre',
        '/rollitos-de-anis',
        '/tiramisu-turron-vasitos',
        '/arroz-con-leche-el-postre-casero',
      ],
    ],
    text: {
      es: {
        slug: 'recetas-navidad-colombiana',
        title: 'Recetas de Navidad colombiana',
        seoTitle: 'Recetas de Navidad colombiana: lechona, natilla y buñuelos',
        description: 'Recetas de Navidad colombiana para la novena y la cena de diciembre: lechona al horno, natilla con panela, buñuelos, hojuelas y postres para la mesa.',
        intro: [
          'En Colombia, diciembre se cocina en familia. Entre la novena de aguinaldos y la cena del 24, la mesa se llena de natilla, buñuelos y hojuelas, y en muchas casas la lechona es el plato que reúne a todos.',
          'Aquí están las recetas que preparamos en esas fechas, adaptadas a una cocina de casa: con ingredientes que se consiguen, tiempos claros y cada paso explicado.',
        ],
        sections: [
          { heading: 'La tradición colombiana', note: 'Los platos que no pueden faltar en diciembre: para la novena, la cena y el recalentado.' },
          { heading: 'Para completar la mesa', note: 'Un plato fuerte, una ensalada y dulces para compartir con la familia y las visitas.' },
        ],
      },
      en: {
        slug: 'colombian-christmas-recipes',
        title: 'Colombian Christmas recipes',
        seoTitle: 'Colombian Christmas Recipes: Lechona, Natilla and Buñuelos',
        description: 'Colombian Christmas recipes for the December novena and Christmas Eve dinner: oven lechona, panela natilla, buñuelos, hojuelas and desserts to share.',
        intro: [
          'In Colombia, December is cooked as a family. Between the nine-night novena and Christmas Eve dinner, the table fills with natilla, buñuelos and hojuelas, and in many homes lechona is the dish that brings everyone together.',
          'These are the recipes we make for those days, adapted to a home kitchen: easy-to-find ingredients, clear timings and every step explained.',
        ],
        sections: [
          { heading: 'Colombian tradition', note: 'The dishes no Colombian December is complete without: for the novena, Christmas Eve and the day-after leftovers.' },
          { heading: 'To round out the table', note: 'A main course, a salad and sweets to share with family and guests.' },
        ],
      },
      de: {
        slug: 'kolumbianische-weihnachtsrezepte',
        title: 'Kolumbianische Weihnachtsrezepte',
        seoTitle: 'Kolumbianische Weihnachtsrezepte: Lechona und Natilla',
        description: 'Kolumbianische Weihnachtsrezepte für die Novena und den Heiligabend: Lechona aus dem Ofen, Natilla mit Panela, Buñuelos, Hojuelas und Desserts.',
        intro: [
          'In Kolumbien wird der Dezember in der Familie gekocht. Zwischen der Novena, den neun Abenden vor Weihnachten, und dem Essen an Heiligabend stehen Natilla, Buñuelos und Hojuelas auf dem Tisch, und in vielen Häusern ist die Lechona das Gericht, das alle zusammenbringt.',
          'Hier sind die Rezepte, die wir an diesen Tagen kochen, angepasst an die heimische Küche: mit erhältlichen Zutaten, klaren Zeiten und jedem Schritt erklärt.',
        ],
        sections: [
          { heading: 'Kolumbianische Tradition', note: 'Die Gerichte, die im kolumbianischen Dezember nicht fehlen dürfen: für die Novena, den Heiligabend und die Reste am Tag danach.' },
          { heading: 'Für den festlichen Tisch', note: 'Ein Hauptgericht, ein Salat und Süßes zum Teilen mit Familie und Gästen.' },
        ],
      },
      fr: {
        slug: 'recettes-noel-colombien',
        title: 'Recettes de Noël colombien',
        seoTitle: 'Recettes de Noël colombien : lechona, natilla et buñuelos',
        description: 'Recettes de Noël colombien pour la novena et le réveillon : lechona au four, natilla à la panela, buñuelos, hojuelas et desserts à partager en famille.',
        intro: [
          'En Colombie, décembre se cuisine en famille. Entre la novena, les neuf soirées avant Noël, et le repas du 24, la table se remplit de natilla, de buñuelos et d’hojuelas, et dans beaucoup de maisons la lechona est le plat qui réunit tout le monde.',
          'Voici les recettes que nous préparons pour ces fêtes, adaptées à une cuisine de maison : des ingrédients faciles à trouver, des temps précis et chaque étape expliquée.',
        ],
        sections: [
          { heading: 'La tradition colombienne', note: 'Les plats incontournables du mois de décembre en Colombie : pour la novena, le réveillon et les restes du lendemain.' },
          { heading: 'Pour compléter la table', note: 'Un plat principal, une salade et des douceurs à partager avec la famille et les invités.' },
        ],
      },
      it: {
        slug: 'ricette-natale-colombiano',
        title: 'Ricette del Natale colombiano',
        seoTitle: 'Ricette del Natale colombiano: lechona, natilla e buñuelos',
        description: 'Ricette del Natale colombiano per la novena e la cena della vigilia: lechona al forno, natilla con panela, buñuelos, hojuelas e dolci da condividere.',
        intro: [
          'In Colombia dicembre si cucina in famiglia. Tra la novena, le nove sere prima di Natale, e la cena della vigilia, la tavola si riempie di natilla, buñuelos e hojuelas, e in molte case la lechona è il piatto che riunisce tutti.',
          'Ecco le ricette che prepariamo in quei giorni, adattate alla cucina di casa: ingredienti facili da trovare, tempi chiari e ogni passaggio spiegato.',
        ],
        sections: [
          { heading: 'La tradizione colombiana', note: 'I piatti che non possono mancare nel dicembre colombiano: per la novena, la vigilia e gli avanzi del giorno dopo.' },
          { heading: 'Per completare la tavola', note: 'Un secondo, un’insalata e dolci da condividere con la famiglia e gli ospiti.' },
        ],
      },
      ja: {
        slug: 'コロンビアのクリスマスレシピ',
        title: 'コロンビアのクリスマスレシピ',
        seoTitle: 'コロンビアのクリスマスレシピ｜レチョナ・ナティージャ・ブニュエロ',
        description: 'コロンビアのクリスマスに欠かせないレシピ集。オーブンで作るレチョナ、パネラのナティージャ、ブニュエロ、ホフエラスに、食卓を彩るデザートまで。',
        intro: [
          'コロンビアの12月は、家族で料理する季節です。クリスマス前の9日間に祈りをささげる「ノベナ」から24日の夕食まで、食卓にはナティージャやブニュエロ、ホフエラスが並び、多くの家庭ではレチョナがみんなを集める一皿になります。',
          'ここでは、この時期に作るレシピを家庭のキッチン向けにまとめました。手に入りやすい材料、わかりやすい時間、すべての手順を説明しています。',
        ],
        sections: [
          { heading: 'コロンビアの伝統料理', note: 'コロンビアの12月に欠かせない料理。ノベナ、クリスマスイブ、そして翌日の温め直しにも。' },
          { heading: '食卓を彩るもう一品', note: 'メイン料理、サラダ、家族やお客さまと分け合うお菓子。' },
        ],
      },
      pt: {
        slug: 'receitas-natal-colombiano',
        title: 'Receitas de Natal colombiano',
        seoTitle: 'Receitas de Natal colombiano: lechona, natilla e buñuelos',
        description: 'Receitas de Natal colombiano para a novena e a ceia de 24 de dezembro: lechona no forno, natilla com rapadura, buñuelos, hojuelas e sobremesas para a mesa.',
        intro: [
          'Na Colômbia, dezembro se cozinha em família. Entre a novena, as nove noites antes do Natal, e a ceia do dia 24, a mesa se enche de natilla, buñuelos e hojuelas, e em muitas casas a lechona é o prato que reúne todo mundo.',
          'Aqui estão as receitas que preparamos nessas datas, adaptadas à cozinha de casa: ingredientes fáceis de encontrar, tempos claros e cada passo explicado.',
        ],
        sections: [
          { heading: 'A tradição colombiana', note: 'Os pratos que não podem faltar no dezembro colombiano: para a novena, a ceia e as sobras do dia seguinte.' },
          { heading: 'Para completar a mesa', note: 'Um prato principal, uma salada e doces para dividir com a família e as visitas.' },
        ],
      },
    },
  },
]

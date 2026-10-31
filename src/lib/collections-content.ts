import type { RecipeLanguage } from '@/types/recipe'

/**
 * Colecciones editoriales: páginas temáticas que reúnen recetas que ya existen
 * (p. ej. Navidad colombiana). El contenido vive aquí, en el repositorio, para que cada
 * colección se revise en un PR antes de salir a la web.
 *
 * Reglas:
 * - Las recetas se citan por su public_path en español (estable: las URLs no cambian).
 *   Se acepta también la forma /es/receta/<slug> para la misma entrada (las recetas nuevas
 *   se publican así), de modo que '/dulce-de-breva' encuentra '/es/receta/dulce-de-breva'.
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
  /** Preguntas frecuentes al final de la página (texto visible; sin datos estructurados FAQ,
   * que Google ya no muestra para sitios de recetas). */
  faq?: { q: string; a: string }[]
}

export interface Collection {
  id: string
  /** Recetas por sección, en el orden en que se muestran (public_path en español). */
  sections: string[][]
  /**
   * Portada propia de la colección (opcional). Carpeta dentro de /public, p. ej.
   * '/colecciones/navidad-colombiana', con 4 archivos: portada.webp (1440×960),
   * portada-4x3.webp (1200×900), portada-1x1.webp (1024×1024) y portada-16x9.webp (1280×720).
   * Sin esto, la tarjeta usa la foto de la primera receta. La prueba collections.test.mts
   * falla si se pone la carpeta sin los 4 archivos.
   */
  coverDir?: string
  text: Record<RecipeLanguage, CollectionText>
}

export const COVER_FILES = ['portada.webp', 'portada-4x3.webp', 'portada-1x1.webp', 'portada-16x9.webp'] as const

export function collectionCover(collection: Collection, file: (typeof COVER_FILES)[number]): string | null {
  return collection.coverDir ? `${collection.coverDir.replace(/\/+$/, '')}/${file}` : null
}

export const COLLECTIONS: Collection[] = [
  {
    id: 'navidad-colombiana',
    coverDir: '/colecciones/navidad-colombiana',
    sections: [
      [
        '/receta-de-lechona-colombiana',
        '/es/receta/tamal-tolimense',
        '/es/receta/pernil-de-cerdo-al-horno',
        '/natilla-colombiana',
        '/bunuelos-colombianos',
        // Dulce de breva y manjar blanco: aparecen solos en cuanto estén publicados
        // (con /dulce-de-breva o /es/receta/dulce-de-breva: se aceptan las dos formas).
        '/manjar-blanco-del-valle',
        '/dulce-de-breva',
        // Sabajón, torta negra y dulce de papaya verde: aparecen solos al publicarse.
        '/es/receta/sabajon-colombiano',
        '/es/receta/torta-negra-colombiana',
        '/es/receta/dulce-de-papaya-verde',
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
        faq: [
          { q: "¿Qué se come en Navidad en Colombia?", a: "Depende de la región, pero en casi todo el país no faltan la natilla y los buñuelos, que se comparten durante la novena. Para la cena del 24 son comunes la lechona, el tamal o el pernil de cerdo, y de postre el manjar blanco, el dulce de breva y las hojuelas." },
          { q: "¿Qué es la novena de aguinaldos?", a: "Es una tradición colombiana: durante los nueve días antes de Navidad, del 16 al 24 de diciembre, familias y vecinos se reúnen a rezar, cantar villancicos y compartir natilla, buñuelos y algo de tomar." },
          { q: "¿Con qué se acompaña la natilla?", a: "Lo clásico es servirla con buñuelos recién fritos. En el Valle del Cauca también va con manjar blanco y dulce de breva, y en muchas casas se pone al lado de las hojuelas." },
          { q: "¿Qué se puede preparar con anticipación?", a: "La natilla y el manjar blanco aguantan varios días en la nevera, y el dulce de breva aún más si queda bien cubierto con su almíbar. El tamal se puede cocinar un día antes y recalentar al vapor. Los buñuelos y las hojuelas son mejores recién hechos." },
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
        faq: [
          { q: "What do Colombians eat at Christmas?", a: "It depends on the region, but almost everywhere you will find natilla and buñuelos, shared during the novena. Christmas Eve dinner often includes lechona, tamales or roast pork leg (pernil), with manjar blanco, candied figs and hojuelas for dessert." },
          { q: "What is the novena de aguinaldos?", a: "It is a Colombian tradition: for the nine days before Christmas, from December 16 to 24, families and neighbours gather to pray, sing carols and share natilla, buñuelos and something to drink." },
          { q: "What is natilla served with?", a: "The classic pairing is freshly fried buñuelos. In the Valle del Cauca region it also comes with manjar blanco and candied figs, and many families serve it alongside hojuelas." },
          { q: "What can I make ahead?", a: "Natilla and manjar blanco keep for several days in the fridge, and candied figs even longer if they stay covered in their syrup. Tamales can be cooked a day ahead and reheated by steaming. Buñuelos and hojuelas are best freshly made." },
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
        faq: [
          { q: "Was isst man in Kolumbien an Weihnachten?", a: "Das hängt von der Region ab, aber fast überall gibt es Natilla und Buñuelos, die während der Novena geteilt werden. Am Heiligabend kommen oft Lechona, Tamales oder Schweinekeule (Pernil) auf den Tisch, als Dessert Manjar Blanco, Feigen in Sirup und Hojuelas." },
          { q: "Was ist die Novena de Aguinaldos?", a: "Eine kolumbianische Tradition: In den neun Tagen vor Weihnachten, vom 16. bis 24. Dezember, kommen Familien und Nachbarn zusammen, um zu beten, Weihnachtslieder zu singen und Natilla, Buñuelos und etwas zu trinken zu teilen." },
          { q: "Wozu isst man Natilla?", a: "Klassisch zu frisch frittierten Buñuelos. Im Valle del Cauca gehören auch Manjar Blanco und Feigen in Sirup dazu, und in vielen Familien stehen Hojuelas daneben." },
          { q: "Was lässt sich vorbereiten?", a: "Natilla und Manjar Blanco halten sich mehrere Tage im Kühlschrank, Feigen in Sirup noch länger, wenn sie gut mit Sirup bedeckt sind. Tamales kann man am Vortag garen und im Dampf wieder erwärmen. Buñuelos und Hojuelas schmecken frisch am besten." },
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
        faq: [
          { q: "Que mange-t-on à Noël en Colombie ?", a: "Cela dépend de la région, mais presque partout on trouve la natilla et les buñuelos, partagés pendant la novena. Au réveillon, on sert souvent la lechona, les tamales ou le cuisseau de porc rôti (pernil), et en dessert le manjar blanco, les figues confites et les hojuelas." },
          { q: "Qu’est-ce que la novena de aguinaldos ?", a: "C’est une tradition colombienne : pendant les neuf jours qui précèdent Noël, du 16 au 24 décembre, familles et voisins se réunissent pour prier, chanter des chants de Noël et partager natilla, buñuelos et quelque chose à boire." },
          { q: "Avec quoi sert-on la natilla ?", a: "Le classique, ce sont des buñuelos tout juste frits. Dans la vallée du Cauca, on l’accompagne aussi de manjar blanco et de figues confites, et beaucoup de familles la servent avec des hojuelas." },
          { q: "Que peut-on préparer à l’avance ?", a: "La natilla et le manjar blanco se gardent plusieurs jours au réfrigérateur, les figues confites encore plus longtemps si elles restent couvertes de sirop. Les tamales peuvent être cuits la veille et réchauffés à la vapeur. Les buñuelos et les hojuelas sont meilleurs tout juste faits." },
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
        faq: [
          { q: "Cosa si mangia a Natale in Colombia?", a: "Dipende dalla regione, ma quasi ovunque non mancano la natilla e i buñuelos, condivisi durante la novena. Per la cena della vigilia sono comuni la lechona, i tamales o la coscia di maiale al forno (pernil), e come dolce il manjar blanco, i fichi sciroppati e le hojuelas." },
          { q: "Che cos’è la novena de aguinaldos?", a: "È una tradizione colombiana: nei nove giorni prima di Natale, dal 16 al 24 dicembre, famiglie e vicini si riuniscono per pregare, cantare canti natalizi e condividere natilla, buñuelos e qualcosa da bere." },
          { q: "Con cosa si accompagna la natilla?", a: "Il classico è con buñuelos appena fritti. Nella Valle del Cauca si serve anche con manjar blanco e fichi sciroppati, e in molte case accanto alle hojuelas." },
          { q: "Cosa si può preparare in anticipo?", a: "La natilla e il manjar blanco si conservano per diversi giorni in frigorifero, i fichi sciroppati ancora di più se restano coperti dal loro sciroppo. I tamales si possono cuocere il giorno prima e riscaldare al vapore. Buñuelos e hojuelas sono migliori appena fatti." },
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
        faq: [
          { q: "コロンビアのクリスマスには何を食べますか？", a: "地域によって違いますが、ほぼ全国でナティージャとブニュエロは欠かせず、ノベナの間にみんなで分け合います。24日の夕食にはレチョナやタマル、豚もも肉のオーブン焼き（ペルニル）がよく並び、デザートにはマンハル・ブランコやいちじくのシロップ煮、ホフエラスが定番です。" },
          { q: "「ノベナ・デ・アギナルドス」とは何ですか？", a: "コロンビアの伝統行事で、クリスマス前の9日間（12月16日〜24日）、家族や近所の人が集まって祈り、クリスマスの歌を歌い、ナティージャやブニュエロ、飲み物を分け合います。" },
          { q: "ナティージャには何を合わせますか？", a: "定番は揚げたてのブニュエロです。バジェ・デル・カウカ地方ではマンハル・ブランコやいちじくのシロップ煮も添え、多くの家庭ではホフエラスと一緒に出します。" },
          { q: "前もって作れるものは？", a: "ナティージャとマンハル・ブランコは冷蔵庫で数日もち、いちじくのシロップ煮はシロップにしっかり浸っていればさらに長もちします。タマルは前日に作って蒸し直せます。ブニュエロとホフエラスは作りたてがいちばんです。" },
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
        faq: [
          { q: "O que se come no Natal na Colômbia?", a: "Depende da região, mas em quase todo o país não faltam a natilla e os buñuelos, compartilhados durante a novena. Na ceia do dia 24 são comuns a lechona, o tamal ou o pernil de porco assado, e de sobremesa o manjar blanco, o doce de figo e as hojuelas." },
          { q: "O que é a novena de aguinaldos?", a: "É uma tradição colombiana: nos nove dias antes do Natal, de 16 a 24 de dezembro, famílias e vizinhos se reúnem para rezar, cantar canções de Natal e dividir natilla, buñuelos e algo para beber." },
          { q: "Com o que se acompanha a natilla?", a: "O clássico é servir com buñuelos fritos na hora. No Valle del Cauca ela também vem com manjar blanco e doce de figo, e em muitas casas é servida ao lado das hojuelas." },
          { q: "O que dá para preparar com antecedência?", a: "A natilla e o manjar blanco duram vários dias na geladeira, e o doce de figo dura ainda mais se ficar bem coberto pela calda. O tamal pode ser cozido no dia anterior e reaquecido no vapor. Buñuelos e hojuelas ficam melhores feitos na hora." },
        ],
      },
    },
  },
]

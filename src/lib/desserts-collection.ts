import type { Collection } from '@/lib/collections-content'

/** Selección de 20 recetas publicadas: distingue técnica y tiempo de espera, sin prometer rapidez. */
export const DESSERTS_COLLECTION: Collection = {
  id: 'postres-caseros',
  publishedAt: '2026-11-05T00:00:00Z',
  coverDir: '/colecciones/postres-caseros',
  sections: [
    ['/cheesecake-de-oreo-sin-horno', '/helado-queso-cottage-fresas', '/tiramisu', '/mango-sago-coco', '/arroz-con-leche-el-postre-casero', '/es/receta/vasitos-de-mousse-de-aguacate-y-cacao', '/recetas-de-trufas-de-chocolate', '/vasitos-cheesecake-pistacho-chocolate'],
    ['/torta-de-chocolate', '/torta-de-tres-leches', '/receta-torta-de-zanahoria', '/receta-de-pan-de-platano-clasico', '/flan-de-leche-condensada', '/tarta-de-manzana-clasica'],
    ['/receta-clasica-de-galletas-toll-house', '/galletas-de-avena-y-chocolate', '/receta-de-galletas-de-naranja', '/receta-de-alfajores-de-maicena', '/receta-de-muffins-de-chocolate', '/receta-de-pancakes-con-fresas-y-arandanos'],
  ],
  text: {
    es: {
      slug: 'postres-caseros-con-y-sin-horno',
      title: '20 postres caseros con y sin horno',
      seoTitle: '20 postres caseros con y sin horno, paso a paso',
      description: 'Elige entre 20 postres caseros: tiramisú, helado, arroz con leche, tortas y galletas. Recetas con fotos y tiempos de reposo para planear cuándo servir.',
      intro: [
        'A veces provoca algo de chocolate; otras, un arroz con leche de los de casa. Aquí tienes 20 postres para elegir según el antojo, el equipo y el tiempo que tengas: desde vasitos fríos hasta tortas para compartir y galletas para el café.',
        'Empieza por la técnica. El primer grupo no necesita horno, aunque algunas recetas usan la estufa y muchas necesitan nevera o congelador. El segundo reúne tortas, tarta y flan al horno; el tercero, galletas, alfajores, muffins y pancakes en sartén. Hay opciones fáciles y otras de dificultad media.',
        'Mira el tiempo total antes de empezar. El helado se mezcla en 15 minutos, pero necesita congelación y unos minutos para ablandarse; el tiramisú y los cheesecakes también requieren reposo. Cada receta conserva sus cantidades, fotos de los pasos, raciones ajustables y lista de compra: elige primero cuándo quieres servirla.',
      ],
      sections: [
        { heading: 'Sin horno: cremosos, fríos y de cuchara', note: 'Ocho ideas que no necesitan horno. Sin horno no significa sin cocción ni sin espera: revisa la estufa, la nevera y el congelador que pide cada receta.' },
        { heading: 'Tortas, tarta de manzana y flan al horno', note: 'Seis clásicos para cortar y compartir. Cuenta el horneado, el enfriado y, en el flan y la torta de tres leches, el reposo en la nevera.' },
        { heading: 'Galletas y bocados para el café o la merienda', note: 'Galletas, alfajores y muffins al horno, más pancakes en sartén. Calcula las tandas y deja enfriar las piezas antes de guardarlas o rellenarlas.' },
      ],
      faq: [
        { q: '¿Qué postre puedo hacer sin encender el horno?', a: 'Elige el primer grupo: cheesecake de Oreo, helado de cottage y fresas, tiramisú, mango sago, arroz con leche, mousse de aguacate y cacao, trufas o vasitos de pistacho. Algunas preparaciones sí usan la estufa para cocinar o derretir ingredientes.' },
        { q: '¿Cuál puedo servir si solo tengo media hora?', a: 'Los pancakes con fresas y arándanos indican 30 minutos totales. Las galletas de naranja marcan 32 minutos. Un postre frío puede llevar poca preparación y aun así necesitar varias horas de reposo: comprueba el tiempo total, no solo el de mezclar.' },
        { q: '¿Qué postres conviene preparar con anticipación?', a: 'El tiramisú, el cheesecake de Oreo, el flan y la torta de tres leches necesitan reposo, por lo que conviene organizarlos antes de la comida. Sigue el enfriado y la conservación de cada ficha. En el helado, reserva también un rato para ablandarlo antes de servir.' },
        { q: '¿Todas las recetas son fáciles o llevan pocos ingredientes?', a: 'No todas tienen la misma dificultad: hay opciones fáciles y clásicos de dificultad media, como los alfajores, el tiramisú o la tarta de manzana. Las fichas muestran la dificultad, los ingredientes y los pasos para que elijas según tu experiencia y lo que tengas.' },
        { q: '¿Puedo cambiar las raciones y preparar la lista de compra?', a: 'Sí. Abre la receta, ajusta las raciones y añade los ingredientes que te falten a la lista de compra. Revisa también el tamaño del molde y las tandas: duplicar la cantidad no significa duplicar automáticamente el tiempo de horno o de reposo.' },
      ],
    },
    en: {
      slug: 'homemade-desserts-baked-no-bake',
      title: '20 homemade desserts, baked and no-bake',
      seoTitle: '20 homemade desserts: baked and no-bake recipes',
      description: 'Choose from 20 homemade desserts, from tiramisu and ice cream to cakes and cookies. Step-by-step photos and resting times help you plan when to serve.',
      intro: [
        'Sometimes you want chocolate; sometimes a comforting bowl of rice pudding. These 20 desserts offer something for your mood, equipment and available time, from chilled cups to cakes for sharing and cookies to go with coffee.',
        'Choose a method first. The first group needs no oven, although some recipes use the stove and many need chilling or freezing. The second brings together oven-baked cakes, apple tart and caramel flan; the third has cookies, alfajores, muffins and stovetop pancakes. There are easy recipes and moderately challenging classics.',
        'Check the total time before starting. The ice cream takes 15 minutes to blend, but still needs freezing and softening time; tiramisu and cheesecakes also need to rest. Each recipe has quantities, step photos, adjustable servings and a shopping list. Decide when you want to serve it before choosing.',
      ],
      sections: [
        { heading: 'No-bake desserts: creamy, chilled and spoonable', note: 'Eight ideas that need no oven. No-bake does not mean no cooking or waiting: check each recipe for stove, refrigerator and freezer requirements.' },
        { heading: 'Oven-baked cakes, apple tart and caramel flan', note: 'Six classics to slice and share. Allow for baking, cooling and, for flan and tres leches cake, resting in the refrigerator.' },
        { heading: 'Cookies and small treats for coffee or a snack', note: 'Oven-baked cookies, alfajores and muffins, plus stovetop pancakes. Allow for batches and cool the pieces before storing or filling them.' },
      ],
      faq: [
        { q: 'Which dessert can I make without an oven?', a: 'Choose from the first group: Oreo cheesecake, strawberry cottage cheese ice cream, tiramisu, mango sago, rice pudding, avocado cocoa mousse, chocolate truffles or pistachio cheesecake cups. Some still require a stove to cook or melt ingredients.' },
        { q: 'What can I serve if I only have half an hour?', a: 'The strawberry and blueberry pancakes list 30 minutes total, while the orange cookies list 32 minutes. A chilled dessert may take little active work but still need hours to set. Check total time rather than blending or mixing time alone.' },
        { q: 'Which desserts should I make ahead?', a: 'Tiramisu, Oreo cheesecake, flan and tres leches cake need to rest, so plan them before the meal. Follow the cooling and storage notes in each recipe. For ice cream, also allow time for it to soften before serving.' },
        { q: 'Are all the recipes easy or made with few ingredients?', a: 'They vary: some are easy, while classics such as alfajores, tiramisu and apple tart take a little more skill. Each recipe shows its difficulty, ingredients and steps so you can choose according to your experience and supplies.' },
        { q: 'Can I adjust servings and make a shopping list?', a: 'Yes. Open a recipe, adjust the servings and add missing ingredients to your shopping list. Check pan size and the number of batches too: doubling quantities does not automatically double baking or resting time.' },
      ],
    },
    de: {
      slug: 'desserts-selber-machen-mit-ohne-backen',
      title: '20 Desserts zum Selbermachen – mit und ohne Backen',
      seoTitle: '20 Desserts zum Selbermachen, mit und ohne Backen',
      description: '20 Desserts für zu Hause: Tiramisu, Eis, Milchreis, Kuchen und Kekse. Mit Fotos der Arbeitsschritte und Ruhezeiten für eine gut geplante Zubereitung.',
      intro: [
        'Mal soll es etwas mit Schokolade sein, mal ein vertrauter Milchreis. Diese 20 Desserts bieten Ideen passend zu Appetit, Küchenausstattung und Zeit: gekühlte Desserts im Glas, Kuchen zum Teilen und Kekse zum Kaffee.',
        'Wähle zuerst die Zubereitungsart. Die erste Gruppe kommt ohne Backofen aus; manche Rezepte benötigen dennoch den Herd, viele den Kühlschrank oder das Gefrierfach. Danach folgen Kuchen, Apfeltarte und Karamellflan aus dem Ofen sowie Kekse, Alfajores, Muffins und Pancakes aus der Pfanne. Die Schwierigkeit reicht von einfach bis mittel.',
        'Prüfe vor dem Start die Gesamtzeit. Das Eis ist in 15 Minuten gemixt, muss danach aber gefrieren und vor dem Servieren etwas weich werden. Tiramisu und Cheesecakes brauchen ebenfalls Ruhezeit. Jedes Rezept enthält Mengen, Schrittfotos, anpassbare Portionen und eine Einkaufsliste. Plane zuerst den Zeitpunkt zum Servieren.',
      ],
      sections: [
        { heading: 'Ohne Backen: cremig, gekühlt und zum Löffeln', note: 'Acht Ideen ohne Backofen. Ohne Backen bedeutet weder ohne Kochen noch ohne Wartezeit: Beachte die Angaben zu Herd, Kühlschrank und Gefrierfach.' },
        { heading: 'Kuchen, Apfeltarte und Karamellflan aus dem Ofen', note: 'Sechs Klassiker zum Anschneiden und Teilen. Rechne Backen, Abkühlen und bei Flan und Tres-Leches-Kuchen die Kühlzeit mit ein.' },
        { heading: 'Kekse und kleine Leckereien zum Kaffee', note: 'Kekse, Alfajores und Muffins aus dem Ofen sowie Pancakes aus der Pfanne. Plane mehrere Backdurchgänge ein und lasse Gebäck vor dem Füllen oder Aufbewahren abkühlen.' },
      ],
      faq: [
        { q: 'Welches Dessert gelingt ohne Backofen?', a: 'In der ersten Gruppe findest du Oreo-Cheesecake, Erdbeer-Cottage-Cheese-Eis, Tiramisu, Mango-Sago, Milchreis, Avocado-Kakao-Mousse, Schokoladentrüffel und Pistazien-Cheesecake im Glas. Manche Zutaten müssen trotzdem auf dem Herd gekocht oder geschmolzen werden.' },
        { q: 'Was kann ich in einer halben Stunde servieren?', a: 'Die Pancakes mit Erdbeeren und Heidelbeeren haben eine Gesamtzeit von 30 Minuten, die Orangenkekse von 32 Minuten. Ein kaltes Dessert kann wenig Arbeit machen und dennoch Stunden zum Festwerden brauchen. Entscheidend ist die Gesamtzeit, nicht nur das Mixen.' },
        { q: 'Welche Desserts sollte ich vorbereiten?', a: 'Tiramisu, Oreo-Cheesecake, Flan und Tres-Leches-Kuchen brauchen Ruhezeit und lassen sich deshalb vor dem Essen einplanen. Beachte die Kühl- und Aufbewahrungshinweise des jeweiligen Rezepts. Eis sollte vor dem Servieren außerdem etwas weich werden.' },
        { q: 'Sind alle Rezepte einfach oder mit wenigen Zutaten?', a: 'Die Anforderungen unterscheiden sich. Neben einfachen Rezepten gibt es mittelschwere Klassiker wie Alfajores, Tiramisu und Apfeltarte. Schwierigkeitsgrad, Zutaten und Schritte helfen dir bei der Auswahl passend zu Erfahrung und Vorräten.' },
        { q: 'Kann ich Portionen anpassen und eine Einkaufsliste anlegen?', a: 'Ja. Öffne ein Rezept, passe die Portionen an und füge fehlende Zutaten zur Einkaufsliste hinzu. Beachte auch die Formgröße und nötige Backdurchgänge: Die doppelte Menge verlangt nicht automatisch die doppelte Back- oder Ruhezeit.' },
      ],
    },
    fr: {
      slug: 'desserts-maison-avec-sans-four',
      title: '20 desserts maison, avec ou sans four',
      seoTitle: '20 desserts maison avec ou sans four, pas à pas',
      description: 'Choisissez parmi 20 desserts maison : tiramisu, glace, riz au lait, gâteaux et biscuits. Photos des étapes et temps de repos pour prévoir le service.',
      intro: [
        'Parfois, on a envie de chocolat ; parfois, d’un riz au lait réconfortant. Ces 20 desserts se choisissent selon les envies, le matériel et le temps disponible : verrines fraîches, gâteaux à partager et biscuits pour accompagner le café.',
        'Commencez par la méthode. Le premier groupe ne demande pas de four, mais certaines recettes utilisent la cuisinière et beaucoup nécessitent un passage au réfrigérateur ou au congélateur. Viennent ensuite les gâteaux, la tarte aux pommes et le flan au four, puis les biscuits, alfajores, muffins et pancakes à la poêle. Les niveaux vont de facile à intermédiaire.',
        'Vérifiez le temps total avant de commencer. La glace se mixe en 15 minutes, mais doit encore congeler puis s’assouplir avant le service. Tiramisu et cheesecakes ont aussi besoin de repos. Chaque fiche conserve ses quantités, photos, portions ajustables et liste de courses. Décidez d’abord de l’heure du dessert.',
      ],
      sections: [
        { heading: 'Sans four : crémeux, frais et à la cuillère', note: 'Huit idées sans four. Cela ne signifie ni sans cuisson ni sans attente : vérifiez les besoins en cuisinière, réfrigérateur et congélateur de chaque recette.' },
        { heading: 'Gâteaux, tarte aux pommes et flan au four', note: 'Six classiques à couper et à partager. Comptez la cuisson, le refroidissement et, pour le flan et le gâteau aux trois laits, le repos au réfrigérateur.' },
        { heading: 'Biscuits et petites douceurs pour le goûter', note: 'Biscuits, alfajores et muffins au four, plus pancakes à la poêle. Prévoyez les fournées et laissez refroidir les pièces avant de les conserver ou de les garnir.' },
      ],
      faq: [
        { q: 'Quel dessert préparer sans allumer le four ?', a: 'Choisissez dans le premier groupe : cheesecake Oreo, glace au cottage cheese et aux fraises, tiramisu, mango sago, riz au lait, mousse avocat-cacao, truffes ou verrines de cheesecake à la pistache. Certaines préparations utilisent tout de même la cuisinière pour cuire ou faire fondre des ingrédients.' },
        { q: 'Que servir si je n’ai qu’une demi-heure ?', a: 'Les pancakes aux fraises et aux myrtilles affichent 30 minutes au total, les biscuits à l’orange 32 minutes. Un dessert froid peut être rapide à assembler mais demander plusieurs heures de repos. Regardez le temps total, pas seulement celui du mélange.' },
        { q: 'Quels desserts préparer à l’avance ?', a: 'Le tiramisu, le cheesecake Oreo, le flan et le gâteau aux trois laits nécessitent du repos : organisez-les avant le repas. Suivez les consignes de refroidissement et de conservation de chaque fiche. Prévoyez aussi un moment pour assouplir la glace avant de la servir.' },
        { q: 'Toutes les recettes sont-elles faciles ou avec peu d’ingrédients ?', a: 'Les niveaux varient : il y a des recettes faciles et des classiques intermédiaires, comme les alfajores, le tiramisu ou la tarte aux pommes. Les fiches indiquent difficulté, ingrédients et étapes pour choisir selon votre expérience et vos réserves.' },
        { q: 'Puis-je adapter les portions et préparer une liste de courses ?', a: 'Oui. Ouvrez la recette, ajustez les portions et ajoutez les ingrédients manquants à la liste de courses. Vérifiez également le moule et le nombre de fournées : doubler les quantités ne double pas automatiquement la cuisson ou le repos.' },
      ],
    },
    it: {
      slug: 'dolci-fatti-in-casa-con-senza-forno',
      title: '20 dolci fatti in casa, con e senza forno',
      seoTitle: '20 dolci fatti in casa con e senza forno, passo passo',
      description: 'Scegli fra 20 dolci fatti in casa: tiramisù, gelato, riso al latte, torte e biscotti. Foto dei passaggi e tempi di riposo per organizzare quando servirli.',
      intro: [
        'A volte hai voglia di cioccolato, altre di una ciotola di riso al latte. Questi 20 dolci offrono idee secondo il gusto, gli strumenti e il tempo disponibile: bicchierini freddi, torte da condividere e biscotti per accompagnare il caffè.',
        'Parti dal metodo. Il primo gruppo non richiede il forno, anche se alcune ricette usano i fornelli e molte hanno bisogno di frigorifero o congelatore. Seguono torte, crostata di mele e flan al forno, poi biscotti, alfajores, muffin e pancake in padella. Ci sono preparazioni facili e classici di difficoltà media.',
        'Controlla il tempo totale prima di iniziare. Il gelato si frulla in 15 minuti, ma deve ancora congelare e ammorbidirsi prima del servizio. Anche tiramisù e cheesecake richiedono riposo. Ogni ricetta mantiene dosi, foto dei passaggi, porzioni modificabili e lista della spesa. Decidi prima a che ora vuoi portarla in tavola.',
      ],
      sections: [
        { heading: 'Senza forno: cremosi, freddi e al cucchiaio', note: 'Otto idee senza forno. Non significa senza cottura o senza attesa: controlla l’uso di fornelli, frigorifero e congelatore in ogni ricetta.' },
        { heading: 'Torte, crostata di mele e flan al forno', note: 'Sei classici da tagliare e condividere. Considera cottura, raffreddamento e, per flan e torta ai tre latti, riposo in frigorifero.' },
        { heading: 'Biscotti e piccoli dolci per caffè e merenda', note: 'Biscotti, alfajores e muffin al forno, più pancake in padella. Calcola le infornate e lascia raffreddare i pezzi prima di conservarli o farcirli.' },
      ],
      faq: [
        { q: 'Quale dolce posso fare senza accendere il forno?', a: 'Scegli nel primo gruppo: cheesecake Oreo, gelato di cottage cheese e fragole, tiramisù, mango sago, riso al latte, mousse di avocado e cacao, tartufi o bicchierini di cheesecake al pistacchio. Alcuni richiedono comunque i fornelli per cuocere o sciogliere gli ingredienti.' },
        { q: 'Cosa posso servire se ho solo mezz’ora?', a: 'I pancake con fragole e mirtilli indicano 30 minuti totali; i biscotti all’arancia 32 minuti. Un dolce freddo può richiedere poco lavoro e diverse ore di riposo. Guarda il tempo totale, non soltanto quello per mescolare.' },
        { q: 'Quali dolci conviene preparare in anticipo?', a: 'Tiramisù, cheesecake Oreo, flan e torta ai tre latti devono riposare, quindi organizzali prima del pasto. Segui le indicazioni di raffreddamento e conservazione della singola ricetta. Per il gelato, prevedi anche il tempo per farlo ammorbidire prima di servirlo.' },
        { q: 'Tutte le ricette sono facili o con pochi ingredienti?', a: 'Il livello cambia: trovi preparazioni facili e classici di difficoltà media, come alfajores, tiramisù e crostata di mele. Le schede mostrano difficoltà, ingredienti e passaggi per scegliere secondo esperienza e dispensa.' },
        { q: 'Posso modificare le porzioni e creare la lista della spesa?', a: 'Sì. Apri la ricetta, regola le porzioni e aggiungi gli ingredienti mancanti alla lista. Controlla anche la dimensione dello stampo e le infornate: raddoppiare le dosi non significa raddoppiare automaticamente cottura o riposo.' },
      ],
    },
    pt: {
      slug: 'sobremesas-caseiras-com-sem-forno',
      title: '20 sobremesas caseiras, com e sem forno',
      seoTitle: '20 sobremesas caseiras com e sem forno, passo a passo',
      description: 'Escolha entre 20 sobremesas caseiras: tiramisù, sorvete, arroz-doce, bolos e biscoitos. Fotos das etapas e tempos de descanso para planejar quando servir.',
      intro: [
        'Às vezes dá vontade de chocolate; em outras, de um arroz-doce com gosto de casa. Estas 20 sobremesas trazem ideias conforme a vontade, os equipamentos e o tempo disponível: copinhos gelados, bolos para compartilhar e biscoitos para acompanhar o café.',
        'Comece pelo preparo. O primeiro grupo dispensa o forno, mas algumas receitas usam o fogão e muitas precisam de geladeira ou congelador. Depois vêm bolos, torta de maçã e pudim no forno, seguidos de biscoitos, alfajores, muffins e panquecas na frigideira. Há opções fáceis e clássicos de dificuldade média.',
        'Veja o tempo total antes de começar. O sorvete é batido em 15 minutos, mas ainda precisa congelar e amolecer um pouco antes de servir. Tiramisù e cheesecakes também precisam descansar. Cada receita mantém quantidades, fotos das etapas, porções ajustáveis e lista de compras. Decida primeiro a hora de levar à mesa.',
      ],
      sections: [
        { heading: 'Sem forno: cremosas, geladas e de colher', note: 'Oito ideias sem forno. Isso não significa sem cozimento nem sem espera: confira o uso de fogão, geladeira e congelador em cada receita.' },
        { heading: 'Bolos, torta de maçã e pudim no forno', note: 'Seis clássicos para cortar e compartilhar. Conte o tempo de forno, o resfriamento e, no pudim e no bolo de três leites, o descanso na geladeira.' },
        { heading: 'Biscoitos e pequenos doces para o café ou lanche', note: 'Biscoitos, alfajores e muffins no forno, além de panquecas na frigideira. Calcule as fornadas e deixe esfriar antes de guardar ou rechear.' },
      ],
      faq: [
        { q: 'Qual sobremesa posso fazer sem ligar o forno?', a: 'Escolha no primeiro grupo: cheesecake de Oreo, sorvete de cottage com morangos, tiramisù, mango sago, arroz-doce, mousse de abacate e cacau, trufas ou copinhos de cheesecake de pistache. Algumas ainda usam o fogão para cozinhar ou derreter ingredientes.' },
        { q: 'O que posso servir se só tenho meia hora?', a: 'As panquecas com morangos e mirtilos indicam 30 minutos no total; os biscoitos de laranja, 32 minutos. Uma sobremesa gelada pode dar pouco trabalho e mesmo assim precisar de horas de descanso. Confira o tempo total, não apenas o de misturar.' },
        { q: 'Quais sobremesas vale preparar com antecedência?', a: 'Tiramisù, cheesecake de Oreo, pudim e bolo de três leites precisam descansar, então organize-os antes da refeição. Siga as orientações de resfriamento e conservação de cada ficha. Para o sorvete, reserve também um tempo para amolecer antes de servir.' },
        { q: 'Todas as receitas são fáceis ou levam poucos ingredientes?', a: 'Os níveis variam: há opções fáceis e clássicos de dificuldade média, como alfajores, tiramisù e torta de maçã. As fichas mostram dificuldade, ingredientes e etapas para você escolher conforme sua experiência e despensa.' },
        { q: 'Posso ajustar as porções e montar uma lista de compras?', a: 'Sim. Abra a receita, ajuste as porções e adicione os ingredientes que faltam à lista. Confira também o tamanho da forma e as fornadas: dobrar as quantidades não significa dobrar automaticamente o tempo de forno ou de descanso.' },
      ],
    },
    ja: {
      slug: '手作りデザートオーブンありなし',
      title: 'オーブンあり・なしで選ぶ、手作りデザート20選',
      seoTitle: '手作りデザート20選｜オーブンあり・なしで選べる写真付きレシピ',
      description: 'ティラミス、アイス、ライスプディング、ケーキ、クッキーなど、手作りデザート20品を紹介。オーブンを使わないもの、焼くお菓子、小さなおやつから選べます。写真付きの手順と、冷やす・休ませる時間を確認して、食べたい時間に合わせて準備しましょう。',
      intro: [
        'チョコレートが食べたい日もあれば、家庭的なライスプディングがうれしい日もあります。ここでは、好み、調理器具、使える時間に合わせて選べる20品を集めました。冷たいカップデザート、切り分けるケーキ、コーヒーに添えるクッキーまで楽しめます。',
        'まずは作り方で選びましょう。最初のグループはオーブンを使いませんが、コンロを使うものや、冷蔵・冷凍が必要なものがあります。次はケーキ、りんごタルト、焼きプリン。最後はクッキー、アルファホーレス、マフィンと、フライパンで焼くパンケーキです。難易度は簡単なものから中級まであります。',
        '作り始める前に合計時間を確認してください。アイスは15分で混ぜられても、その後に冷凍し、食べる前に少しやわらかくする時間が必要です。ティラミスやチーズケーキにも休ませる時間があります。各レシピの分量、手順写真、人数調整、買い物リストを使い、食べたい時間から逆算して選びましょう。',
      ],
      sections: [
        { heading: 'オーブンなし：クリーミーな冷菓とスプーンで食べるお菓子', note: 'オーブンを使わない8品です。加熱も待ち時間も不要という意味ではありません。各レシピでコンロ、冷蔵庫、冷凍庫の使用を確認してください。' },
        { heading: 'オーブンで焼くケーキ、りんごタルト、プリン', note: '切り分けて楽しむ定番6品。焼く時間と冷ます時間に加え、プリンとトレスレチェスケーキは冷蔵庫で休ませる時間も見込みましょう。' },
        { heading: 'コーヒーやおやつに、小さなお菓子', note: 'オーブンで焼くクッキー、アルファホーレス、マフィンと、フライパンのパンケーキ。何回かに分けて焼く時間を考え、保存やクリームを挟む前には冷まします。' },
      ],
      faq: [
        { q: 'オーブンを使わずに作れるデザートは？', a: '最初のグループから選べます。オレオチーズケーキ、カッテージチーズといちごのアイス、ティラミス、マンゴーサゴ、ライスプディング、アボカドとカカオのムース、チョコトリュフ、ピスタチオのチーズケーキカップです。材料を煮たり溶かしたりするため、コンロを使うものもあります。' },
        { q: '30分しかない場合は何を作れますか？', a: 'いちごとブルーベリーのパンケーキは合計30分、オレンジクッキーは32分と記載されています。冷たいデザートは作業が短くても、冷やし固めるのに数時間かかることがあります。混ぜる時間だけでなく、合計時間を確認しましょう。' },
        { q: '前もって準備したいデザートは？', a: 'ティラミス、オレオチーズケーキ、プリン、トレスレチェスケーキは休ませる必要があるため、食事より前に準備すると計画を立てやすくなります。各レシピの冷まし方と保存方法に従ってください。アイスは食べる前に少しやわらかくする時間も必要です。' },
        { q: 'どのレシピも簡単で材料が少ないですか？', a: '難易度はさまざまです。簡単なものもあれば、アルファホーレス、ティラミス、りんごタルトのような中級の定番もあります。難易度、材料、手順を見て、経験や家にある食材に合わせて選んでください。' },
        { q: '人数を変えて買い物リストを作れますか？', a: 'はい。レシピを開いて人数を調整し、足りない材料を買い物リストに追加できます。型の大きさや焼く回数も確認しましょう。材料が2倍になっても、焼く時間や休ませる時間がそのまま2倍になるわけではありません。' },
      ],
    },
  },
}

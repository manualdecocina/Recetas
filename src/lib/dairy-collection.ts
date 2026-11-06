import type { Collection } from '@/lib/collections-content'

/** Derivados cotidianos: selección por técnica, sin añadir platos solo para aumentar la cifra. */
export const DAIRY_COLLECTION: Collection = {
  id: 'derivados-de-la-leche',
  publishedAt: '2026-11-05T16:00:00-05:00',
  coverDir: '/colecciones/derivados-de-la-leche',
  sections: [
    ['/yogur-natural-casero', '/yogur-griego-casero', '/suero-costeno-casero'],
    ['/como-preparar-queso', '/cuajada-casera-con-cuajo', '/mozzarella-casera', '/requeson-casero-de-leche', '/queso-crema-casero'],
    ['/mantequilla-casera', '/leche-condensada-casera', '/leche-evaporada-casera', '/arequipe-casero', '/manjar-blanco-del-valle'],
  ],
  text: {
    es: {
      slug: 'derivados-de-la-leche-caseros', title: 'Derivados de la leche que puedes hacer en casa',
      seoTitle: 'Derivados de la leche caseros: yogur, queso y más',
      description: 'Aprende a hacer yogur, cuajada, queso fresco, mozzarella, mantequilla y leche condensada en casa. Recetas con fotos, cantidades, temperaturas y conservación.',
      intro: ['Un yogur para el desayuno, queso blanco para la arepa, mantequilla para el pan o lechera para un postre: aquí reunimos 13 derivados de uso diario que puedes preparar en casa. Encontrarás quesos frescos y preparaciones sencillas, con su equipo y sus tiempos de espera explicados.', 'Elige según lo que tengas. El yogur necesita un cultivo vivo; la cuajada y la mozzarella, cuajo; la mantequilla se hace con crema de leche con suficiente grasa. Cada ficha explica qué leche funciona, cuánto rinde, cuándo enfriar y cómo guardar el resultado. Usa leche pasteurizada y un termómetro cuando la receta lo indique.'],
      sections: [
        { heading: 'Yogures y suero costeño', note: 'El natural se fermenta con cultivos vivos a temperatura controlada; el griego se escurre en la nevera. El suero costeño necesita un cultivo mesófilo diferente, temperatura controlada y escurrido en frío.' },
        { heading: 'Quesos frescos de todos los días', note: 'Queso blanco, cuajada, mozzarella, requesón y queso crema. Cuajar, escurrir e hilar son técnicas distintas: sigue la leche, el cuajo y las temperaturas de cada ficha.' },
        { heading: 'Mantequilla, lechera y leche concentrada', note: 'La mantequilla parte de crema de leche; la leche evaporada se reduce sin azúcar y la condensada lleva azúcar. Completa la selección con arequipe y manjar blanco del Valle.' },
      ],
      faq: [
        { q: '¿Lechera y leche condensada son lo mismo?', a: 'Aquí usamos «lechera» como el nombre cotidiano de la leche condensada azucarada. La receta es casera y no corresponde a una fórmula de marca. La evaporada es distinta: se concentra sin añadir azúcar.' },
        { q: '¿Todo se puede hacer batiendo leche normal?', a: 'No. La mantequilla necesita crema de leche con suficiente grasa. El yogur necesita cultivos vivos y la cuajada y mozzarella usan cuajo. La leche UHT puede servir para algunas preparaciones, pero no es adecuada para la mozzarella de esta selección.' },
        { q: '¿Puedo aprovechar el suero que queda del queso?', a: 'Depende del proceso. El suero de un queso hecho con cuajo tiene distinta acidez y composición al de un queso cortado con limón o al del yogur. No sustituye leche ni crema para hacer mantequilla. En las fichas se indica qué líquido se obtiene y cómo guardarlo.' },
        { q: '¿Se pueden guardar los tarros fuera de la nevera?', a: 'No son conservas de larga duración. Enfría y refrigera según cada receta, a 4 °C o menos. Usa utensilios limpios y leche pasteurizada; el azúcar o una tapa cerrada no convierten una preparación casera en una conserva segura.' },
      ],
    },
    en: {
      slug: 'homemade-dairy-products', title: 'Everyday dairy products you can make at home',
      seoTitle: 'Homemade dairy: yogurt, fresh cheese, butter and more',
      description: 'Make yogurt, fresh curds, mozzarella, butter and sweetened condensed milk at home. Recipes include photos, quantities, temperatures and storage guidance.',
      intro: ['Yogurt for breakfast, fresh cheese for an arepa, butter for toast or condensed milk for dessert: these 13 everyday dairy preparations are made for home kitchens. Discover fresh cheeses and practical basics with equipment and waiting times clearly explained.', 'Choose according to your ingredients. Yogurt needs live cultures; cuajada and mozzarella need rennet; butter needs cream with enough fat. Each recipe explains suitable milk, yield, cooling and storage. Use pasteurized milk and a thermometer whenever specified.'],
      sections: [
        { heading: 'Homemade yogurts and suero costeño', note: 'Plain yogurt ferments with live cultures at a controlled temperature; Greek-style yogurt drains in the refrigerator. Suero costeño uses a different mesophilic starter, controlled temperature and draining in the fridge.' },
        { heading: 'Everyday fresh cheeses', note: 'White fresh cheese, cuajada, mozzarella, whole-milk ricotta and cream cheese. Setting, draining and stretching are different techniques: follow the milk, rennet and temperature instructions.' },
        { heading: 'Butter and concentrated milk', note: 'Butter starts with cream. Evaporated milk reduces without sugar, while sweetened condensed milk contains added sugar. Finish with Colombian arequipe and manjar blanco.' },
      ],
      faq: [
        { q: 'What does lechera mean here?', a: 'It is a common Spanish name for sweetened condensed milk. This is a homemade recipe, not a branded formula. Evaporated milk is different: it is concentrated without added sugar.' },
        { q: 'Can I make everything by beating ordinary milk?', a: 'No. Butter needs sufficiently fatty cream. Yogurt needs live cultures, while cuajada and mozzarella use rennet. UHT milk can suit some methods but is unsuitable for the mozzarella recipe here.' },
        { q: 'Can I use the leftover whey?', a: 'It depends on the method. Rennet-cheese whey differs in acidity and composition from lemon-set cheese whey and yogurt whey. It cannot replace milk or cream for making butter. Recipes explain the liquid produced and its storage.' },
        { q: 'Can the jars stay outside the refrigerator?', a: 'These are not shelf-stable preserves. Cool and refrigerate as each recipe directs, at 4 °C or below. Use sanitized equipment and pasteurized milk. Sugar or a closed lid does not make a homemade dairy preserve shelf-stable.' },
      ],
    },
    de: {
      slug: 'milchprodukte-selber-machen', title: 'Milchprodukte für den Alltag selber machen',
      seoTitle: 'Milchprodukte selber machen: Joghurt, Käse und Butter',
      description: 'Joghurt, frischen Käse, Mozzarella, Butter und gezuckerte Kondensmilch selbst machen. Mit Schrittfotos, Mengen, Temperaturen und Hinweisen zur Aufbewahrung.',
      intro: ['Joghurt zum Frühstück, frischer Käse zur Arepa, Butter aufs Brot oder Kondensmilch für ein Dessert: Hier findest du 13 Milchprodukte und Zubereitungen für die heimische Küche. Geräte und nötige Wartezeiten werden erklärt.', 'Wähle passend zu deinen Zutaten. Joghurt braucht lebende Kulturen, Cuajada und Mozzarella benötigen Lab, Butter braucht ausreichend fettreiche Sahne. Jedes Rezept erklärt geeignete Milch, Ausbeute, Abkühlen und Aufbewahrung. Verwende pasteurisierte Milch und bei Bedarf ein Thermometer.'],
      sections: [
        { heading: 'Joghurt und kolumbianischer Suero costeño', note: 'Naturjoghurt reift mit lebenden Kulturen bei kontrollierter Temperatur, griechischer Joghurt tropft im Kühlschrank ab. Suero costeño braucht eine andere mesophile Kultur, kontrollierte Temperatur und Abtropfen im Kühlschrank.' },
        { heading: 'Frische Käsesorten für jeden Tag', note: 'Weißer Frischkäse, Cuajada, Mozzarella, Vollmilch-Ricotta und streichfähiger Käse. Gerinnen, Abtropfen und Ziehen sind verschiedene Techniken: Beachte Milch, Lab und Temperaturen.' },
        { heading: 'Butter und konzentrierte Milch', note: 'Butter entsteht aus Sahne. Ungesüßte Kondensmilch wird ohne Zucker reduziert, gezuckerte enthält Zucker. Dazu kommen kolumbianisches Arequipe und Manjar blanco.' },
      ],
      faq: [
        { q: 'Was bedeutet Lechera hier?', a: 'Das ist eine gebräuchliche spanische Bezeichnung für gezuckerte Kondensmilch. Das Rezept ist hausgemacht und keine Markenrezeptur. Ungesüßte Kondensmilch wird ohne Zuckerzusatz konzentriert.' },
        { q: 'Reicht für alles das Schlagen normaler Milch?', a: 'Nein. Butter braucht fettreiche Sahne. Joghurt benötigt lebende Kulturen, Cuajada und Mozzarella Lab. H-Milch eignet sich für manche Verfahren, aber nicht für das hier beschriebene Mozzarella-Rezept.' },
        { q: 'Kann ich die Molke weiterverwenden?', a: 'Das hängt vom Verfahren ab. Molke aus Labkäse unterscheidet sich von der aus Zitronen-Frischkäse oder Joghurt. Sie ersetzt keine Milch oder Sahne zur Butterherstellung. Die Rezepte erläutern die Flüssigkeit und ihre Aufbewahrung.' },
        { q: 'Dürfen die Gläser ungekühlt stehen?', a: 'Das sind keine ungekühlt haltbaren Konserven. Nach Rezept abkühlen und bei höchstens 4 °C lagern. Saubere Geräte und pasteurisierte Milch verwenden. Zucker und ein geschlossener Deckel ersetzen keine sichere Konservierung.' },
      ],
    },
    fr: {
      slug: 'produits-laitiers-maison', title: 'Les produits laitiers du quotidien faits maison',
      seoTitle: 'Produits laitiers maison : yaourt, fromage et beurre',
      description: 'Préparez yaourt, caillé, fromage frais, mozzarella, beurre et lait concentré sucré. Recettes avec photos, quantités, températures et conseils de conservation.',
      intro: ['Un yaourt au petit-déjeuner, du fromage frais avec une arepa, du beurre sur le pain ou du lait concentré pour un dessert : voici 13 préparations laitières du quotidien à faire chez soi, avec le matériel et les temps de repos expliqués.', 'Choisissez selon vos ingrédients. Le yaourt demande des ferments vivants ; la cuajada et la mozzarella, de la présure ; le beurre, une crème assez grasse. Chaque recette précise le lait adapté, le rendement, le refroidissement et la conservation. Utilisez du lait pasteurisé et un thermomètre lorsque demandé.'],
      sections: [
        { heading: 'Yaourts maison et suero costeño colombien', note: 'Le yaourt nature fermente à température contrôlée ; le yaourt à la grecque s’égoutte au réfrigérateur. Le suero costeño requiert un ferment mésophile différent, une température contrôlée et un égouttage au frais.' },
        { heading: 'Fromages frais de tous les jours', note: 'Fromage blanc frais, cuajada, mozzarella, ricotta au lait et fromage à tartiner. Cailler, égoutter et filer demandent des méthodes différentes : suivez chaque fiche.' },
        { heading: 'Beurre et laits concentrés', note: 'Le beurre part de crème. Le lait concentré non sucré réduit sans sucre ajouté, contrairement au lait concentré sucré. Découvrez aussi l’arequipe et le manjar blanco colombiens.' },
      ],
      faq: [
        { q: 'Que signifie lechera ici ?', a: 'C’est un nom espagnol courant pour le lait concentré sucré. La recette est maison et ne reprend pas une formule de marque. Le lait concentré non sucré est réduit sans ajout de sucre.' },
        { q: 'Peut-on tout faire en battant du lait ?', a: 'Non. Le beurre nécessite de la crème assez grasse. Le yaourt utilise des ferments vivants, la cuajada et la mozzarella de la présure. Le lait UHT convient à certaines préparations, mais pas à la mozzarella proposée ici.' },
        { q: 'Peut-on réutiliser le petit-lait ?', a: 'Cela dépend de la méthode. Le petit-lait d’un fromage à la présure diffère de celui d’un fromage au citron ou d’un yaourt. Il ne remplace pas la crème pour fabriquer du beurre. Les fiches précisent le liquide obtenu et sa conservation.' },
        { q: 'Peut-on garder les pots à température ambiante ?', a: 'Ce ne sont pas des conserves stables. Refroidissez puis réfrigérez à 4 °C maximum selon la recette. Utilisez du matériel désinfecté et du lait pasteurisé. Le sucre ou un couvercle fermé ne rendent pas une préparation laitière stable à température ambiante.' },
      ],
    },
    it: {
      slug: 'latticini-fatti-in-casa', title: 'Latticini di tutti i giorni da fare in casa',
      seoTitle: 'Latticini fatti in casa: yogurt, formaggi e burro',
      description: 'Prepara yogurt, cagliata, formaggio fresco, mozzarella, burro e latte condensato in casa. Ricette con foto, quantità, temperature e consigli di conservazione.',
      intro: ['Yogurt a colazione, formaggio fresco con un’arepa, burro sul pane o latte condensato per un dolce: ecco 13 preparazioni a base di latte per la cucina di casa, con attrezzatura e attese spiegate.', 'Scegli in base agli ingredienti. Lo yogurt richiede fermenti vivi; cuajada e mozzarella usano caglio; il burro richiede panna con abbastanza grassi. Ogni ricetta indica latte adatto, resa, raffreddamento e conservazione. Usa latte pastorizzato e un termometro quando previsto.'],
      sections: [
        { heading: 'Yogurt fatti in casa e suero costeño colombiano', note: 'Lo yogurt bianco fermenta a temperatura controllata; quello greco scola in frigorifero. Il suero costeño richiede una coltura mesofila diversa, temperatura controllata e scolatura in frigorifero.' },
        { heading: 'Formaggi freschi di tutti i giorni', note: 'Formaggio bianco, cuajada, mozzarella, ricotta di latte e formaggio spalmabile. Cagliare, scolare e filare sono tecniche diverse: segui latte, caglio e temperature della scheda.' },
        { heading: 'Burro e latte concentrato', note: 'Il burro si ricava dalla panna. Il latte evaporato si riduce senza zucchero, quello condensato è zuccherato. Completano la raccolta arequipe e manjar blanco colombiani.' },
      ],
      faq: [
        { q: 'Che cosa significa lechera?', a: 'Qui è il nome spagnolo comune del latte condensato zuccherato. La ricetta è casalinga e non è una formula di marca. Il latte evaporato viene invece concentrato senza zucchero aggiunto.' },
        { q: 'Basta sbattere latte normale per ottenere tutto?', a: 'No. Il burro richiede panna abbastanza grassa. Lo yogurt richiede fermenti vivi; cuajada e mozzarella usano caglio. Il latte UHT può andare bene per alcune preparazioni, ma non per la mozzarella di questa raccolta.' },
        { q: 'Posso usare il siero avanzato?', a: 'Dipende dal metodo. Il siero del formaggio al caglio è diverso da quello del formaggio al limone o dello yogurt. Non sostituisce la panna per fare il burro. Le schede spiegano il liquido ottenuto e la conservazione.' },
        { q: 'I vasetti possono stare fuori dal frigo?', a: 'Non sono conserve a lunga durata. Raffredda e conserva a 4 °C o meno seguendo la ricetta. Usa utensili igienizzati e latte pastorizzato. Zucchero e coperchio chiuso non rendono una preparazione stabile a temperatura ambiente.' },
      ],
    },
    ja: {
      slug: 'homemade-dairy-products', title: '家庭で作る、毎日の乳製品レシピ',
      seoTitle: '自家製乳製品：ヨーグルト、チーズ、バターの作り方',
      description: 'ヨーグルト、フレッシュチーズ、クアハーダ、モッツァレラ、バター、練乳など、家庭で作れる13品を紹介。材料、温度、工程写真、冷却と保存のポイントが分かります。',
      intro: ['朝食のヨーグルト、アレパに添える白いチーズ、パンに塗るバター、お菓子に使う練乳。家庭で作れる身近な乳製品と乳を使った基本の調製品を13品集めました。必要な器具と待ち時間も説明します。', '材料に合わせて選びましょう。ヨーグルトには生きた乳酸菌、クアハーダとモッツァレラにはレンネット、バターには乳脂肪分の高いクリームが必要です。各レシピで牛乳の種類、出来上がり量、冷却、保存を確認できます。殺菌済みの牛乳を使い、指定された工程では温度計で測ってください。'],
      sections: [
        { heading: 'ヨーグルトとコロンビアのスエロ・コステーニョ', note: 'プレーンは温度を管理して発酵させ、ギリシャ風は冷蔵庫で水切りします。スエロ・コステーニョには別の中温性スターターが必要で、温度管理と冷蔵での水切りを行います。' },
        { heading: '毎日使えるフレッシュチーズ', note: '白いフレッシュチーズ、クアハーダ、モッツァレラ、牛乳のリコッタ、クリームチーズ。凝固、水切り、引き伸ばしは異なる工程です。材料と温度を確認してください。' },
        { heading: 'バター、練乳、濃縮乳', note: 'バターにはクリームを使います。無糖練乳は砂糖を加えず煮詰め、加糖練乳には砂糖を加えます。コロンビアのアレキペとマンハール・ブランコも紹介します。' },
      ],
      faq: [
        { q: 'レチェラとは何ですか。', a: 'ここでは加糖練乳の通称です。特定ブランドの配合ではなく、自家製の作り方を紹介します。無糖練乳は砂糖を加えずに濃縮する別のものです。' },
        { q: '普通の牛乳を混ぜれば全部作れますか。', a: 'いいえ。バターには高脂肪のクリーム、ヨーグルトには生きた菌、クアハーダとモッツァレラにはレンネットが必要です。超高温殺菌乳を使える製法もありますが、このモッツァレラには適しません。' },
        { q: '残った乳清は使えますか。', a: '製法によります。レンネットチーズの乳清は、レモンで固めたチーズやヨーグルトの乳清と酸度や成分が異なります。バター作りのクリームの代わりにはできません。各レシピで保存方法を確認してください。' },
        { q: '瓶を常温で保存できますか。', a: '常温保存用の加工品ではありません。レシピに従って冷却し、4 ℃以下で冷蔵します。消毒した器具と殺菌乳を使いましょう。砂糖や密閉したふたがあっても、安全な常温保存品にはなりません。' },
      ],
    },
    pt: {
      slug: 'derivados-do-leite-caseiros', title: 'Derivados do leite para fazer em casa',
      seoTitle: 'Derivados do leite caseiros: iogurte, queijo e manteiga',
      description: 'Faça iogurte, coalhada com coalho, queijo fresco, mozzarella, manteiga e leite condensado. Receitas com fotos, quantidades, temperaturas e conservação.',
      intro: ['Iogurte no café da manhã, queijo fresco com arepa, manteiga no pão ou leite condensado na sobremesa: reunimos 13 preparações lácteas do dia a dia para fazer em casa, com utensílios e tempos de espera explicados.', 'Escolha conforme os ingredientes. Iogurte precisa de culturas vivas; cuajada e mozzarella usam coalho; manteiga precisa de creme de leite com gordura suficiente. Cada ficha explica leite adequado, rendimento, resfriamento e conservação. Use leite pasteurizado e termômetro quando indicado.'],
      sections: [
        { heading: 'Iogurtes caseiros e suero costeño colombiano', note: 'O natural fermenta com culturas vivas em temperatura controlada; o grego escorre na geladeira. O suero costeño usa cultura mesófila diferente, temperatura controlada e drenagem refrigerada.' },
        { heading: 'Queijos frescos do dia a dia', note: 'Queijo branco, cuajada com coalho, mozzarella, ricota de leite e queijo cremoso. Coalhar, escorrer e filar são técnicas diferentes: siga cada ficha.' },
        { heading: 'Manteiga e leites concentrados', note: 'A manteiga parte de creme de leite. O leite evaporado reduz sem açúcar; o condensado leva açúcar. Complete com arequipe e manjar blanco colombianos.' },
      ],
      faq: [
        { q: 'O que significa lechera?', a: 'Aqui é um nome espanhol comum para leite condensado açucarado. A receita é caseira, sem reproduzir fórmula de marca. Leite evaporado é diferente: concentra sem açúcar adicionado.' },
        { q: 'Basta bater leite comum para fazer tudo?', a: 'Não. Manteiga exige creme de leite com gordura suficiente. Iogurte precisa de culturas vivas; cuajada e mozzarella usam coalho. UHT serve para alguns métodos, mas não para a mozzarella desta seleção.' },
        { q: 'Posso aproveitar o soro que sobra?', a: 'Depende do processo. O soro de queijo com coalho difere daquele do queijo com limão ou do iogurte. Ele não substitui creme de leite para fazer manteiga. As fichas explicam o líquido obtido e sua conservação.' },
        { q: 'Posso guardar os potes fora da geladeira?', a: 'Não são conservas estáveis. Resfrie e refrigere a 4 °C ou menos, conforme a receita. Use utensílios higienizados e leite pasteurizado. Açúcar ou tampa fechada não tornam um preparo caseiro estável à temperatura ambiente.' },
      ],
    },
  },
}

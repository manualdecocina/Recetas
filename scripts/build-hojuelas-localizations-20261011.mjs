import fs from 'node:fs'
import crypto from 'node:crypto'

const path = 'editorial/hojuelas-colombianas-20261011.json'
const doc = JSON.parse(fs.readFileSync(path, 'utf8'))
const es = doc.records.find((r) => r.language === 'es')

function uuid5(name, namespace) {
  const ns = Buffer.from(namespace.replace(/-/g, ''), 'hex')
  const hash = crypto.createHash('sha1').update(Buffer.concat([ns, Buffer.from(name)])).digest()
  hash[6] = (hash[6] & 0x0f) | 0x50
  hash[8] = (hash[8] & 0x3f) | 0x80
  const h = hash.subarray(0, 16).toString('hex')
  return [h.slice(0,8),h.slice(8,12),h.slice(12,16),h.slice(16,20),h.slice(20)].join('-')
}
const ns = '6ba7b811-9dad-11d1-80b4-00c04fd430c8'
const groupId = uuid5('manualdecocina:recipe-group:hojuelas-colombianas', ns)

const packs = {
  de: {
    slug:'kolumbianische-hojuelas', path:'/de/kolumbianische-hojuelas',
    title:'Kolumbianische Hojuelas: knusprig mit Zimtzucker',
    excerpt:'Dünne kolumbianische Teigblätter, knusprig ausgebacken und mit Zimtzucker bestreut. Ergibt 20 Stück.',
    summary:'Hojuelas, auch Hojaldras genannt, sind dünne frittierte Teigblätter, die in Kolumbien besonders zur Weihnachtszeit mit Natilla und Buñuelos serviert werden. Dieser eifreie Teig wird 30 Minuten entspannt, auf 1–2 mm ausgerollt und bei 170–175 °C ausgebacken.',
    notes:'Wasser nach und nach zugeben; der Teig soll elastisch, aber nicht klebrig sein. Das Öl konstant bei 170–175 °C halten und nur kleine Portionen frittieren. Enthält Weizen und Milch. Vollständig auf einem Gitter auskühlen lassen und luftdicht 2–3 Tage bei Raumtemperatur lagern. Die Nährwerte sind geschätzt, weil die tatsächliche Ölaufnahme schwankt.',
    category:'Brote und Teige', course:'Dessert', cuisine:'Kolumbianisch', difficulty:'Einfach',
    keywords:['kolumbianische Hojuelas','Hojaldras','Zimtzucker','kolumbianisches Weihnachtsgebäck','frittierter Teig'],
    groups:['Für den Teig','Zum Frittieren','Zum Bestreuen'],
    ingredients:['Weizenmehl Type 405','weißer Zucker','weiche ungesalzene Butter','feines Salz','Wasser bei Raumtemperatur','neutrales Pflanzenöl','feiner weißer Zucker','gemahlener Zimt'],
    stepTitles:['Trockene Zutaten mischen','Teig zusammenfügen','Teig kneten','Teig ruhen lassen','Teig dünn ausrollen','Hojuelas schneiden','Portionsweise frittieren','Mit Zimtzucker bestreuen'],
    stepContents:[
      '250 g Mehl mit 20 g Zucker und 2 g Salz in einer großen Schüssel gleichmäßig vermischen.',
      '25 g weiche Butter und nach und nach 115 ml Wasser zugeben; mischen, bis ein zusammenhängender Teig ohne loses Mehl entsteht.',
      'Den Teig auf der Arbeitsfläche 5 Minuten kneten, bis er glatt, gleichmäßig und nicht klebrig ist; möglichst kein zusätzliches Mehl einarbeiten.',
      'Den Teig abdecken und 30 Minuten bei Raumtemperatur ruhen lassen, damit er sich ohne Zurückspringen ausrollen lässt.',
      'Den Teig portionsweise auf leicht bemehlter Fläche auf 1–2 mm, fast durchscheinend, ausrollen.',
      'Die Teigplatte in etwa 20 Rechtecke von 10 × 6 cm oder ähnlich große Rauten schneiden und getrennt ablegen.',
      'Öl auf 170–175 °C erhitzen. Wenige Stücke gleichzeitig etwa 30–45 Sekunden je Seite frittieren, bis sie Blasen bilden und goldgelb sind; auf einem Gitter abtropfen lassen.',
      '30 g Zucker mit 2 g Zimt mischen und auf die noch warmen, abgetropften Hojuelas streuen. Knusprig servieren.'
    ],
    alts:['Schüssel mit Mehl, Zucker und Salz','Wasser wird zu Mehl und Butter für rohen Teig gegossen','Hände kneten einen rohen Teig auf Holz','Roher Teig ruht abgedeckt in einer Schüssel','Roher Teig wird hauchdünn ausgerollt','Rohe Teigrechtecke werden mit einem Teigrad geschnitten','Teigblätter blubbern beim Frittieren im heißen Öl','Goldene kolumbianische Hojuelas mit Zimtzucker'],
    faq:[
      ['Warum werden die Hojuelas weich?','Meist ist der Teig zu dick oder das Öl zu kalt. Auf 1–2 mm ausrollen und 170–175 °C halten.'],
      ['Geht das Rezept ohne Ei?','Ja. Diese kolumbianische Variante besteht aus Mehl, Butter und Wasser und wird bei dünnem Ausrollen trotzdem knusprig.'],
      ['Kann Wasser durch Orangensaft ersetzt werden?','Ja, ganz oder teilweise durch Saft ohne Fruchtfleisch. Wegen unterschiedlicher Mehlaufnahme langsam zugeben.'],
      ['Wie prüfe ich die Öltemperatur?','Am zuverlässigsten mit einem Thermometer. Bei 170–175 °C blubbert ein Teststreifen sofort, ohne rasch dunkel zu werden.'],
      ['Wie bleiben Hojuelas knusprig?','Vollständig auf einem Gitter auskühlen und luftdicht 2–3 Tage trocken bei Raumtemperatur lagern; nicht kühlen.']
    ],
    seoTitle:'Kolumbianische Hojuelas mit Zimtzucker | Manual de Cocina',
    seoDescription:'Knusprige kolumbianische Hojuelas in 8 bebilderten Schritten: dünner Butterteig, 170–175 °C Frittieröl und Zimtzucker. Ergibt 20 Stück.'
  },
  en: {
    slug:'colombian-hojuelas', path:'/en/colombian-hojuelas',
    title:'Colombian hojuelas: crisp cinnamon-sugar pastries',
    excerpt:'Thin Colombian dough sheets fried until crisp and finished with cinnamon sugar. Makes 20 pieces.',
    summary:'Hojuelas, also called hojaldras, are thin sheets of fried dough served in Colombia especially at Christmas with natilla and buñuelos. This egg-free dough rests for 30 minutes, is rolled to 1–2 mm, fried at 170–175°C and dusted with cinnamon sugar.',
    notes:'Add the water gradually: the dough should be elastic but not sticky. Keep the oil at 170–175°C and fry small batches. Contains wheat and milk. Cool completely on a rack and store airtight at room temperature for 2–3 days. Nutrition is estimated because actual oil absorption varies.',
    category:'Breads & doughs', course:'Dessert', cuisine:'Colombian', difficulty:'Easy',
    keywords:['Colombian hojuelas','hojaldras','cinnamon sugar','Colombian Christmas dessert','fried dough'],
    groups:['For the dough','For frying','To finish'],
    ingredients:['all-purpose wheat flour','white sugar','softened unsalted butter','fine salt','room-temperature water','neutral vegetable oil','fine white sugar','ground cinnamon'],
    stepTitles:['Mix the dry ingredients','Bring the dough together','Knead the dough','Rest the dough','Roll the dough thin','Cut the hojuelas','Fry in batches','Dust with cinnamon sugar'],
    stepContents:[
      'Mix 250 g flour with 20 g sugar and 2 g salt in a large bowl until evenly distributed.',
      'Add 25 g softened butter and gradually add 115 ml water; mix until a cohesive dough forms with no loose flour.',
      'Knead on the worktop for 5 minutes until smooth, even and no longer sticky; avoid adding extra flour.',
      'Cover and rest the dough for 30 minutes at room temperature so it can be rolled without springing back.',
      'Roll the dough in batches on a lightly floured surface to 1–2 mm thick, almost translucent.',
      'Cut into about 20 rectangles measuring 10 × 6 cm or similar diamonds, keeping the pieces separate.',
      'Heat the oil to 170–175°C. Fry only a few pieces at a time for 30–45 seconds per side until blistered and golden; drain on a rack.',
      'Mix 30 g sugar with 2 g cinnamon and dust the drained hojuelas while warm. Serve crisp.'
    ],
    alts:['Bowl with flour, sugar and salt','Water poured into flour and butter to form raw dough','Hands kneading raw dough on a wooden board','Raw dough resting under a cloth in a bowl','Raw dough rolled into a very thin sheet','Raw dough rectangles cut with a pastry wheel','Thin dough bubbling in hot oil during frying','Golden Colombian hojuelas dusted with cinnamon sugar'],
    faq:[
      ['Why are my hojuelas soft instead of crisp?','The dough is usually too thick or the oil too cool. Roll to 1–2 mm and keep the oil at 170–175°C.'],
      ['Can Colombian hojuelas be made without egg?','Yes. This version uses flour, butter and water and becomes crisp when rolled very thin.'],
      ['Can I replace the water with orange juice?','Yes, replace some or all with pulp-free juice, adding it gradually because flour absorption varies.'],
      ['How do I know the oil is hot enough?','A thermometer is best. At 170–175°C a small dough strip should bubble immediately without turning dark at once.'],
      ['How should I store crisp hojuelas?','Cool completely on a rack, then keep airtight at room temperature away from humidity for 2–3 days; do not refrigerate.']
    ],
    seoTitle:'Colombian hojuelas with cinnamon sugar | Manual de Cocina',
    seoDescription:'Make crisp Colombian hojuelas in 8 illustrated steps: thin butter dough, 170–175°C frying oil and cinnamon sugar. Yields 20 pieces.'
  },
  fr: {
    slug:'hojuelas-colombiennes', path:'/fr/hojuelas-colombiennes',
    title:'Hojuelas colombiennes croustillantes au sucre cannelle',
    excerpt:'Fines feuilles de pâte colombiennes frites jusqu’à devenir croustillantes, puis poudrées de sucre à la cannelle. Pour 20 pièces.',
    summary:'Les hojuelas, ou hojaldras, sont de fines feuilles de pâte frite servies en Colombie, surtout à Noël avec la natilla et les buñuelos. Cette pâte sans œuf repose 30 minutes, s’abaisse à 1–2 mm puis se frit à 170–175 °C.',
    notes:'Ajoutez l’eau progressivement : la pâte doit être souple sans coller. Maintenez l’huile à 170–175 °C et travaillez par petites fournées. Contient blé et lait. Laissez refroidir sur grille et conservez 2–3 jours dans une boîte hermétique à température ambiante. La nutrition reste estimative car l’absorption d’huile varie.',
    category:'Pains et pâtes', course:'Dessert', cuisine:'Colombienne', difficulty:'Facile',
    keywords:['hojuelas colombiennes','hojaldras','sucre cannelle','dessert de Noël colombien','pâte frite'],
    groups:['Pour la pâte','Pour la friture','Pour la finition'],
    ingredients:['farine de blé tout usage','sucre blanc','beurre doux ramolli','sel fin','eau à température ambiante','huile végétale neutre','sucre blanc fin','cannelle moulue'],
    stepTitles:['Mélanger les ingrédients secs','Former la pâte','Pétrir la pâte','Laisser reposer','Abaisser finement','Découper les hojuelas','Frire par petites fournées','Saupoudrer de sucre cannelle'],
    stepContents:[
      'Mélangez uniformément 250 g de farine, 20 g de sucre et 2 g de sel dans un grand saladier.',
      'Ajoutez 25 g de beurre mou puis 115 ml d’eau progressivement; mélangez jusqu’à obtenir une pâte liée sans farine libre.',
      'Pétrissez 5 minutes sur le plan de travail jusqu’à ce que la pâte soit lisse, homogène et non collante, sans excès de farine.',
      'Couvrez la pâte et laissez-la reposer 30 minutes à température ambiante afin qu’elle s’étale sans se rétracter.',
      'Abaissez la pâte par portions à 1–2 mm, presque translucide, sur un plan légèrement fariné.',
      'Découpez environ 20 rectangles de 10 × 6 cm ou des losanges similaires et gardez-les séparés.',
      'Chauffez l’huile à 170–175 °C. Faites frire quelques pièces 30–45 secondes par face jusqu’à ce qu’elles cloquent et dorent; égouttez sur grille.',
      'Mélangez 30 g de sucre et 2 g de cannelle, puis poudrez les hojuelas égouttées encore tièdes. Servez croustillant.'
    ],
    alts:['Saladier contenant farine, sucre et sel','Eau versée sur farine et beurre pour former une pâte crue','Mains pétrissant une pâte crue sur bois','Pâte crue reposant sous un torchon dans un bol','Pâte crue abaissée en feuille très fine','Rectangles de pâte crue découpés à la roulette','Pâte fine bouillonnant dans l’huile chaude','Hojuelas colombiennes dorées au sucre cannelle'],
    faq:[
      ['Pourquoi mes hojuelas ramollissent-elles ?','La pâte est souvent trop épaisse ou l’huile trop froide. Abaissez à 1–2 mm et maintenez 170–175 °C.'],
      ['Peut-on préparer les hojuelas sans œuf ?','Oui. Cette variante utilise farine, beurre et eau et croustille si la pâte est très fine.'],
      ['Puis-je remplacer l’eau par du jus d’orange ?','Oui, en partie ou totalement avec un jus sans pulpe, ajouté progressivement selon l’absorption de la farine.'],
      ['Comment contrôler la température de l’huile ?','Le thermomètre est le plus précis. À 170–175 °C, une bande de pâte bouillonne immédiatement sans noircir.'],
      ['Comment conserver leur croustillant ?','Laissez refroidir sur grille puis gardez 2–3 jours dans une boîte hermétique, au sec et à température ambiante; ne réfrigérez pas.']
    ],
    seoTitle:'Hojuelas colombiennes au sucre cannelle | Manual de Cocina',
    seoDescription:'Hojuelas colombiennes croustillantes en 8 étapes illustrées : pâte fine au beurre, huile à 170–175 °C et sucre cannelle. Pour 20 pièces.'
  },
  it: {
    slug:'hojuelas-colombiane', path:'/it/hojuelas-colombiane',
    title:'Hojuelas colombiane croccanti con zucchero e cannella',
    excerpt:'Sfoglie sottili colombiane fritte fino a diventare croccanti e rifinite con zucchero alla cannella. Per 20 pezzi.',
    summary:'Le hojuelas, dette anche hojaldras, sono sottili sfoglie di pasta fritta servite in Colombia soprattutto a Natale con natilla e buñuelos. Questo impasto senza uova riposa 30 minuti, si stende a 1–2 mm e si frigge a 170–175 °C.',
    notes:'Aggiungete l’acqua poco alla volta: l’impasto deve essere elastico ma non appiccicoso. Mantenete l’olio a 170–175 °C e friggete poche sfoglie per volta. Contiene grano e latte. Raffreddate su griglia e conservate ermeticamente 2–3 giorni a temperatura ambiente. I valori nutrizionali sono stimati perché l’assorbimento d’olio varia.',
    category:'Pane e impasti', course:'Dessert', cuisine:'Colombiana', difficulty:'Facile',
    keywords:['hojuelas colombiane','hojaldras','zucchero e cannella','dolce natalizio colombiano','pasta fritta'],
    groups:['Per l’impasto','Per friggere','Per completare'],
    ingredients:['farina di grano tenero per tutti gli usi','zucchero bianco','burro non salato morbido','sale fino','acqua a temperatura ambiente','olio vegetale neutro','zucchero bianco fine','cannella in polvere'],
    stepTitles:['Mescola gli ingredienti secchi','Forma l’impasto','Impasta','Lascia riposare','Stendi sottile','Taglia le hojuelas','Friggi in piccole quantità','Spolvera con zucchero e cannella'],
    stepContents:[
      'Mescola uniformemente in una ciotola grande 250 g di farina, 20 g di zucchero e 2 g di sale.',
      'Aggiungi 25 g di burro morbido e 115 ml di acqua poco alla volta; mescola fino a ottenere un impasto unito senza farina libera.',
      'Impasta sul piano per 5 minuti finché risulta liscio, uniforme e non appiccicoso; evita altra farina.',
      'Copri l’impasto e lascialo riposare 30 minuti a temperatura ambiente perché si stenda senza ritirarsi.',
      'Stendi l’impasto in porzioni fino a 1–2 mm, quasi traslucido, su un piano leggermente infarinato.',
      'Taglia circa 20 rettangoli da 10 × 6 cm o rombi simili e tienili separati.',
      'Scalda l’olio a 170–175 °C. Friggi pochi pezzi per 30–45 secondi per lato finché si gonfiano e dorano; scola su una griglia.',
      'Mescola 30 g di zucchero e 2 g di cannella e spolvera le hojuelas scolate ancora tiepide. Servile croccanti.'
    ],
    alts:['Ciotola con farina, zucchero e sale','Acqua versata su farina e burro per formare impasto crudo','Mani che impastano pasta cruda sul legno','Impasto crudo che riposa coperto in ciotola','Impasto crudo steso in sfoglia sottilissima','Rettangoli di impasto crudo tagliati con rotella','Sfoglie che friggono con bolle nell’olio caldo','Hojuelas colombiane dorate con zucchero e cannella'],
    faq:[
      ['Perché le hojuelas risultano morbide?','Di solito l’impasto è troppo spesso o l’olio troppo freddo. Stendete a 1–2 mm e mantenete 170–175 °C.'],
      ['Si possono fare senza uova?','Sì. Questa variante usa farina, burro e acqua e diventa croccante se stesa molto sottile.'],
      ['Posso sostituire l’acqua con succo d’arancia?','Sì, in parte o del tutto con succo senza polpa, aggiunto gradualmente perché la farina assorbe in modo variabile.'],
      ['Come verifico la temperatura dell’olio?','Il termometro è più preciso. A 170–175 °C una striscia di prova produce subito bolle senza scurire.'],
      ['Come mantengo le hojuelas croccanti?','Raffreddatele del tutto su griglia e conservatele ermeticamente 2–3 giorni al riparo dall’umidità; non refrigerate.']
    ],
    seoTitle:'Hojuelas colombiane con zucchero e cannella | Manual de Cocina',
    seoDescription:'Hojuelas colombiane croccanti in 8 passaggi illustrati: impasto sottile al burro, olio a 170–175 °C e zucchero alla cannella. 20 pezzi.'
  },
  ja: {
    slug:'コロンビアのホフエラス', path:'/ja/コロンビアのホフエラス',
    title:'コロンビアのホフエラス：シナモンシュガーの薄焼き菓子',
    excerpt:'薄くのばした生地を香ばしく揚げ、シナモンシュガーをまぶすコロンビア菓子。20枚分です。',
    summary:'ホフエラス（ホハルドラス）は、コロンビアで特にクリスマスにナティージャやブニュエロと一緒に食べる薄い揚げ生地です。卵を使わない生地を30分休ませ、1〜2 mmにのばして170〜175°Cで揚げます。',
    notes:'水は少しずつ加え、生地は弾力がありながらべたつかない状態にします。油温を170〜175°Cに保ち、少量ずつ揚げます。小麦と乳を含みます。網で完全に冷まして密閉し、室温で2〜3日保存できます。実際の吸油量が変わるため栄養値は推定です。',
    category:'パン・生地料理', course:'デザート', cuisine:'コロンビア料理', difficulty:'簡単',
    keywords:['コロンビアのホフエラス','ホハルドラス','シナモンシュガー','コロンビアのクリスマス菓子','揚げ生地'],
    groups:['生地','揚げ油','仕上げ'],
    ingredients:['薄力粉または中力粉','白砂糖','室温に戻した無塩バター','細塩','室温の水','香りの弱い植物油','細目の白砂糖','シナモンパウダー'],
    stepTitles:['粉類を混ぜる','生地をまとめる','こねる','休ませる','薄くのばす','切り分ける','少量ずつ揚げる','シナモンシュガーをまぶす'],
    stepContents:[
      '大きなボウルで小麦粉250 g、砂糖20 g、塩2 gを均一に混ぜます。',
      '柔らかいバター25 gと水115 mlを少しずつ加え、粉が残らないひとまとまりの生地にします。',
      '台に移して5分こね、なめらかで均一、べたつかない状態にします。余分な粉は加えません。',
      '生地を覆い、室温で30分休ませて、のばしたときに縮みにくくします。',
      '軽く打ち粉をした台で、生地を分けながら厚さ1〜2 mm、ほぼ透ける薄さにのばします。',
      '約10 × 6 cmの長方形または同程度のひし形を約20枚切り、重ならないように置きます。',
      '油を170〜175°Cに熱し、少量ずつ片面30〜45秒を目安に泡が出てきつね色になるまで揚げ、網で油を切ります。',
      '砂糖30 gとシナモン2 gを混ぜ、油を切った温かいホフエラスにまぶします。カリッとしたうちに供します。'
    ],
    alts:['ボウルに入れた小麦粉、砂糖、塩','小麦粉とバターに水を注いで生の生地を作る様子','木の台で生地をこねる手','布をかけてボウルで休ませる生地','極薄にのばした生の生地','パイカッターで切る生の長方形生地','熱い油で泡を立てて揚がる薄い生地','シナモンシュガーをまぶした黄金色のホフエラス'],
    faq:[
      ['ホフエラスが柔らかくなるのはなぜですか？','生地が厚すぎるか油温が低いことが主因です。1〜2 mmにのばし、170〜175°Cを保ちます。'],
      ['卵なしでも作れますか？','はい。この配合は小麦粉、バター、水を使い、薄くのばすことでカリッと仕上がります。'],
      ['水をオレンジジュースに替えられますか？','果肉のないジュースで一部または全部を代用できます。粉の吸水が変わるため少しずつ加えます。'],
      ['油温はどう確認しますか？','温度計が最も確実です。170〜175°Cなら小さな試し生地がすぐ泡立ち、急に黒くなりません。'],
      ['カリッと保存する方法は？','網で完全に冷まし、湿気を避けて密閉し、室温で2〜3日保存します。冷蔵は避けます。']
    ],
    seoTitle:'コロンビアのホフエラス：シナモンシュガー | Manual de Cocina',
    seoDescription:'薄いバター生地を170〜175°Cで揚げるコロンビアのホフエラス。写真付き8工程、シナモンシュガー仕上げ、20枚分。'
  },
  pt: {
    slug:'hojuelas-colombianas-receita', path:'/pt/hojuelas-colombianas-receita',
    title:'Hojuelas colombianas crocantes com açúcar e canela',
    excerpt:'Lâminas finas de massa colombiana fritas até ficarem crocantes e finalizadas com açúcar e canela. Rende 20 unidades.',
    summary:'As hojuelas, também chamadas hojaldras, são lâminas finas de massa frita servidas na Colômbia, especialmente no Natal com natilla e buñuelos. Esta massa sem ovo descansa 30 minutos, é aberta a 1–2 mm e frita a 170–175°C.',
    notes:'Adicione a água aos poucos: a massa deve ficar elástica sem grudar. Mantenha o óleo a 170–175°C e frite poucas unidades por vez. Contém trigo e leite. Esfrie em grade e guarde hermeticamente por 2–3 dias em temperatura ambiente. A nutrição é estimada porque a absorção real de óleo varia.',
    category:'Pães e massas', course:'Sobremesa', cuisine:'Colombiana', difficulty:'Fácil',
    keywords:['hojuelas colombianas','hojaldras','açúcar e canela','doce natalino colombiano','massa frita'],
    groups:['Para a massa','Para fritar','Para finalizar'],
    ingredients:['farinha de trigo de uso geral','açúcar branco','manteiga sem sal amolecida','sal fino','água em temperatura ambiente','óleo vegetal neutro','açúcar branco fino','canela em pó'],
    stepTitles:['Misture os secos','Forme a massa','Sove a massa','Deixe descansar','Abra bem fino','Corte as hojuelas','Frite em porções','Polvilhe açúcar e canela'],
    stepContents:[
      'Misture uniformemente 250 g de farinha, 20 g de açúcar e 2 g de sal em uma tigela grande.',
      'Junte 25 g de manteiga macia e 115 ml de água aos poucos; misture até formar massa unida, sem farinha solta.',
      'Sove na bancada por 5 minutos até ficar lisa, uniforme e sem grudar; evite acrescentar farinha.',
      'Cubra a massa e deixe descansar 30 minutos em temperatura ambiente para abrir sem encolher.',
      'Abra a massa em porções sobre bancada levemente enfarinhada até 1–2 mm, quase translúcida.',
      'Corte cerca de 20 retângulos de 10 × 6 cm ou losangos semelhantes e mantenha separados.',
      'Aqueça o óleo a 170–175°C. Frite poucas peças por 30–45 segundos de cada lado, até criar bolhas e dourar; escorra em grade.',
      'Misture 30 g de açúcar com 2 g de canela e polvilhe as hojuelas escorridas ainda mornas. Sirva crocante.'
    ],
    alts:['Tigela com farinha, açúcar e sal','Água derramada sobre farinha e manteiga para formar massa crua','Mãos sovando massa crua em tábua de madeira','Massa crua descansando sob pano em tigela','Massa crua aberta em lâmina muito fina','Retângulos de massa crua cortados com carretilha','Massa fina borbulhando no óleo quente','Hojuelas colombianas douradas com açúcar e canela'],
    faq:[
      ['Por que as hojuelas ficam moles?','Normalmente a massa está grossa ou o óleo frio. Abra a 1–2 mm e mantenha 170–175°C.'],
      ['É possível fazer sem ovo?','Sim. Esta versão leva farinha, manteiga e água e fica crocante quando a massa é bem fina.'],
      ['Posso trocar a água por suco de laranja?','Sim, em parte ou por completo com suco sem polpa, adicionado aos poucos porque a farinha absorve de modo variável.'],
      ['Como saber se o óleo está na temperatura certa?','O termômetro é mais preciso. A 170–175°C, uma tira pequena borbulha imediatamente sem escurecer depressa.'],
      ['Como conservar as hojuelas crocantes?','Esfrie totalmente em grade e guarde em pote hermético, longe da umidade, por 2–3 dias em temperatura ambiente; não refrigere.']
    ],
    seoTitle:'Hojuelas colombianas com açúcar e canela | Manual de Cocina',
    seoDescription:'Hojuelas colombianas crocantes em 8 etapas ilustradas: massa fina com manteiga, óleo a 170–175°C e açúcar com canela. Rende 20.'
  }
}

const sourceIngredients = es.ingredients
const sourceSteps = es.steps
const translations = Object.entries(packs).map(([language,p]) => {
  const nutrition = structuredClone(es.nutrition)
  nutrition.serving_size = language === 'ja' ? '1枚（全20枚の1/20）' : language === 'pt' ? '1 hojuela (1/20 da receita)' : language === 'de' ? '1 Hojuela (1/20 des Rezepts)' : language === 'fr' ? '1 hojuela (1/20 de la recette)' : language === 'it' ? '1 hojuela (1/20 della ricetta)' : '1 hojuela (1/20 of the recipe)'
  nutrition.note = p.notes.split('. ').at(-1)
  return {
    ...structuredClone(es),
    id: uuid5('manualdecocina:recipe:hojuelas-colombianas:'+language, ns),
    recipe_group_id: groupId,
    language,
    slug:p.slug,
    public_path:p.path,
    source_url:null,
    title:p.title,
    excerpt:p.excerpt,
    summary:p.summary,
    notes:p.notes,
    category:p.category,
    course:p.course,
    cuisine:p.cuisine,
    difficulty:p.difficulty,
    keywords:p.keywords,
    ingredients:sourceIngredients.map((x,i)=>({...x,name:p.ingredients[i],group:p.groups[i < 5 ? 0 : i === 5 ? 1 : 2]})),
    steps:sourceSteps.map((x,i)=>({...x,title:p.stepTitles[i],content:p.stepContents[i],image_alt:p.alts[i]})),
    nutrition,
    gallery:[{url:'/recetas/hojuelas-colombianas/portada.webp',alt:p.alts[7]}],
    seo:{
      title:p.seoTitle,
      description:p.seoDescription,
      image_alt:p.alts[7],
      image_variants:structuredClone(es.seo.image_variants),
      faq:p.faq.map(([q,a])=>({q,a}))
    },
    content_html:`<p>${p.summary}</p><p>${p.notes}</p>`,
    published:false,
    editorial_status:'draft'
  }
})
es.id = uuid5('manualdecocina:recipe:hojuelas-colombianas:es', ns)
es.recipe_group_id = groupId
es.source_url = null
es.gallery = [{url:'/recetas/hojuelas-colombianas/portada.webp',alt:es.seo.image_alt ?? es.steps[7].image_alt}]
es.seo.image_alt = es.steps[7].image_alt
es.content_html = `<p>${es.summary}</p><p>${es.notes}</p>`
doc.recipe_group_id = groupId
doc.languages = ['es','de','en','fr','it','ja','pt']
doc.records = [es, ...translations]
doc.status = 'localized_7_of_7_pending_sql_and_pr'
doc.prepared = true
fs.writeFileSync(path, JSON.stringify(doc,null,2)+'\n')

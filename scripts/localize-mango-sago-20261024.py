import json
from pathlib import Path
L={}
def add(l,slug,title,summary,notes,ing,steps,faq,serving):L[l]=dict(slug=slug,title=title,summary=summary,notes=notes,ingredients=ing.split('|'),steps=[s.split('::',1) for s in steps.strip().split('\n')],faq=[s.split('::',1) for s in faq.strip().split('\n')],serving_size=serving)
add('en','mango-sago-coconut','Mango sago with coconut and tapioca pearls','A chilled dessert of ripe mango, coconut milk and small tapioca pearls, topped with diced fruit. Creamy and oven-free, with chilling time included.',
'Use small tapioca pearls, not large boba pearls. Often sold as sago, tapioca comes from cassava whereas true sago comes from palms. Use unsweetened canned coconut milk, not a carton coconut drink. The 130-minute rest includes 10 minutes to finish the pearls off the heat and 2 hours of refrigeration. Cooking varies by product: follow the pack and do not serve pearls with a hard centre. Contains milk from condensed milk. Keep covered at 4 °C or below for up to 2 days; tapioca absorbs liquid and thickens over time.',
'ripe mango, peeled and pitted weight|small dry tapioca pearls|unsweetened canned coconut milk|sweetened condensed milk|water: 1000 ml for boiling and 100 ml for blending',
'''Boil the water::Bring 1000 ml water to the boil in a medium pot. Weigh 60 g small tapioca pearls; do not add them to cold water.
Cook the pearls::Add the pearls to boiling water and stir immediately to separate them. Simmer for 15–20 minutes, stirring occasionally, until almost translucent. Follow the pack timing if different.
Finish off the heat::Turn off the heat, cover and rest for 10 minutes until the pearls are translucent and tender. If a hard white centre remains, boil a few minutes longer and check again.
Drain and cool::Pour into a fine sieve, rinse with cold drinking water to stop cooking and drain well. Do not leave for hours at room temperature.
Cut the mango::Cut 500 g peeled, pitted mango. Reserve 150 g in small cubes for topping, covered in the fridge. Use the remaining 350 g for the cream.
Blend and combine::Blend the 350 g mango with 250 g coconut milk, 60 g condensed milk and the remaining 100 ml water until smooth. Fold in the cold pearls with a spoon.
Chill the glasses::Divide between 4 glasses of about 300 ml, cover and refrigerate at 4 °C or below for 2 hours. Keep the topping fruit separate until serving.
Top and serve::Divide the 150 g diced mango over the 4 glasses and serve cold with spoons. If storage has made it too thick, stir in a little cold drinking water before adding the fruit.''',
'''Are sago and tapioca the same?::Botanically, no. True sago comes from palms and tapioca from cassava. This version uses small tapioca pearls, often sold as sago.
Can I use frozen mango?::Yes, thawed in the fridge and well drained. Thawing time is not included; reserve firm mango cubes if you want a topping with good texture.
Why is there a white centre?::The pearls need more cooking or resting in hot water. Follow the pack and check they are translucent and tender before rinsing.''','1 of 4 dessert glasses')
add('de','mango-sago-kokos','Mango-Sago mit Kokosmilch und Tapiokaperlen','Ein kaltes Dessert aus reifer Mango, Kokosmilch und kleinen Tapiokaperlen mit Mangowürfeln. Cremig und ohne Backofen; die Kühlzeit ist eingerechnet.',
'Kleine Tapiokaperlen verwenden, keine großen Boba-Perlen. Tapioka wird oft als Sago verkauft, stammt aber aus Maniok; echter Sago stammt aus Palmen. Ungesüßte Kokosmilch aus der Dose verwenden, keinen Kokosdrink aus dem Karton. Die 130 Minuten Ruhezeit umfassen 10 Minuten Nachquellen ohne Hitze und 2 Stunden Kühlschrank. Die Garzeit hängt vom Produkt ab: Packung beachten und keine Perlen mit hartem Kern servieren. Enthält durch die Kondensmilch Milch. Zugedeckt bei höchstens 4 °C bis zu 2 Tage lagern; Tapioka nimmt Flüssigkeit auf und dickt nach.',
'reife Mango, geschält und entsteint gewogen|kleine trockene Tapiokaperlen|ungesüßte Kokosmilch aus der Dose|gezuckerte Kondensmilch|Wasser: 1000 ml zum Kochen und 100 ml zum Pürieren',
'''Wasser aufkochen::1000 ml Wasser in einem mittleren Topf aufkochen. 60 g kleine Tapiokaperlen abwiegen; nicht in kaltes Wasser geben.
Perlen kochen::Perlen ins kochende Wasser geben und sofort umrühren, damit sie sich trennen. 15–20 Minuten sanft kochen und gelegentlich rühren, bis sie fast durchsichtig sind. Abweichende Packungszeiten beachten.
Ohne Hitze nachquellen::Herd ausschalten, zudecken und 10 Minuten stehen lassen, bis die Perlen durchsichtig und weich sind. Bleibt ein harter weißer Kern, einige Minuten weiterkochen und erneut prüfen.
Abgießen und abkühlen::In ein feines Sieb gießen, mit kaltem Trinkwasser abspülen, um das Garen zu stoppen, und gut abtropfen lassen. Nicht stundenlang bei Raumtemperatur stehen lassen.
Mango schneiden::500 g geschälte, entsteinte Mango schneiden. 150 g kleine Würfel für den Belag zugedeckt kalt stellen. Die übrigen 350 g für die Creme verwenden.
Pürieren und mischen::350 g Mango mit 250 g Kokosmilch, 60 g Kondensmilch und den übrigen 100 ml Wasser glatt pürieren. Kalte Perlen mit einem Löffel unterheben.
Gläser kalt stellen::Auf 4 Gläser mit etwa 300 ml Inhalt verteilen, abdecken und bei höchstens 4 °C 2 Stunden kühlen. Die Mangowürfel bis zum Servieren getrennt lagern.
Belegen und servieren::150 g Mangowürfel auf die 4 Gläser verteilen und kalt mit Löffeln servieren. Ist die Creme beim Lagern zu dick geworden, vor dem Belegen etwas kaltes Trinkwasser einrühren.''',
'''Sind Sago und Tapioka dasselbe?::Botanisch nein. Echter Sago stammt aus Palmen, Tapioka aus Maniok. Diese Version verwendet kleine Tapiokaperlen, die oft als Sago verkauft werden.
Geht gefrorene Mango?::Ja, im Kühlschrank aufgetaut und gut abgetropft. Die Auftauzeit ist nicht enthalten; für einen bissfesten Belag feste Mangowürfel zurücklegen.
Warum bleibt ein weißer Kern?::Die Perlen müssen länger kochen oder in heißem Wasser nachquellen. Packung beachten und vor dem Abspülen prüfen, dass sie durchsichtig und weich sind.''','1 von 4 Dessertgläsern')
add('fr','mango-sago-noix-de-coco','Mango sago : dessert à la mangue, coco et tapioca','Un dessert froid à la mangue mûre, au lait de coco et aux petites perles de tapioca, garni de dés de fruit. Crémeux, sans four, avec le temps de réfrigération inclus.',
'Utilisez de petites perles de tapioca, pas de grosses perles de boba. Souvent vendu comme sago, le tapioca vient du manioc, tandis que le vrai sagou vient de palmiers. Prenez du lait de coco en conserve non sucré, pas une boisson de coco en brique. Les 130 minutes de repos comprennent 10 minutes hors du feu pour les perles et 2 heures au réfrigérateur. La cuisson varie selon le produit : suivez l’emballage et ne servez pas de perles au cœur dur. Contient du lait via le lait concentré. Gardez couvert à 4 °C maximum jusqu’à 2 jours ; le tapioca absorbe du liquide et épaissit.',
'mangue mûre, poids pelé et dénoyauté|petites perles de tapioca sèches|lait de coco en conserve non sucré|lait concentré sucré|eau : 1000 ml pour cuire et 100 ml pour mixer',
'''Faites bouillir l’eau::Portez 1000 ml d’eau à ébullition dans une casserole moyenne. Pesez 60 g de petites perles de tapioca ; ne les mettez pas dans l’eau froide.
Cuisez les perles::Versez les perles dans l’eau bouillante et remuez aussitôt pour les séparer. Faites frémir 15–20 minutes en remuant parfois, jusqu’à ce qu’elles soient presque translucides. Suivez le temps de l’emballage s’il diffère.
Terminez hors du feu::Coupez le feu, couvrez et laissez reposer 10 minutes, jusqu’à des perles translucides et tendres. S’il reste un cœur blanc dur, refaites bouillir quelques minutes et vérifiez.
Égouttez et refroidissez::Versez dans une passoire fine, rincez à l’eau potable froide pour arrêter la cuisson et égouttez bien. Ne laissez pas plusieurs heures à température ambiante.
Coupez la mangue::Coupez 500 g de mangue pelée et dénoyautée. Réservez 150 g en petits dés pour la garniture, couverts au réfrigérateur. Gardez les 350 g restants pour la crème.
Mixez et mélangez::Mixez les 350 g de mangue avec 250 g de lait de coco, 60 g de lait concentré et les 100 ml d’eau restants jusqu’à une crème lisse. Incorporez les perles froides à la cuillère.
Réfrigérez les verres::Répartissez dans 4 verres d’environ 300 ml, couvrez et réfrigérez à 4 °C maximum pendant 2 heures. Gardez les dés de fruit séparés jusqu’au service.
Garnissez et servez::Répartissez les 150 g de mangue en dés sur les 4 verres et servez froid à la cuillère. Si la crème a trop épaissi, ajoutez un peu d’eau potable froide avant la garniture.''',
'''Sagou et tapioca sont-ils identiques ?::Botaniquement non. Le vrai sagou vient de palmiers et le tapioca du manioc. Cette version utilise de petites perles de tapioca, souvent vendues comme sago.
Peut-on utiliser de la mangue surgelée ?::Oui, décongelée au réfrigérateur et bien égouttée. La décongélation n’est pas incluse ; réservez des dés fermes pour une garniture agréable.
Pourquoi reste-t-il un cœur blanc ?::Les perles demandent plus de cuisson ou de repos dans l’eau chaude. Suivez l’emballage et vérifiez qu’elles sont translucides et tendres avant de rincer.''','1 des 4 verres à dessert')
add('it','mango-sago-cocco','Mango sago al cocco con perle di tapioca','Dessert freddo di mango maturo, latte di cocco e piccole perle di tapioca, con frutta a cubetti. Cremoso e senza forno, con il tempo in frigorifero incluso.',
'Usa perle piccole di tapioca, non le grandi perle boba. Spesso venduta come sago, la tapioca viene dalla manioca, mentre il vero sago viene dalle palme. Usa latte di cocco in lattina non zuccherato, non bevanda al cocco in cartone. I 130 minuti di riposo comprendono 10 minuti fuori dal fuoco e 2 ore in frigorifero. La cottura varia secondo il prodotto: segui la confezione e non servire perle con centro duro. Contiene latte per via del latte condensato. Conserva coperto a 4 °C o meno per massimo 2 giorni; la tapioca assorbe liquido e addensa.',
'mango maturo, peso sbucciato e senza nocciolo|perle piccole di tapioca secche|latte di cocco in lattina non zuccherato|latte condensato zuccherato|acqua: 1000 ml per cuocere e 100 ml per frullare',
'''Fai bollire l’acqua::Porta a bollore 1000 ml d’acqua in una pentola media. Pesa 60 g di piccole perle di tapioca; non aggiungerle all’acqua fredda.
Cuoci le perle::Versa le perle nell’acqua bollente e mescola subito per separarle. Fai sobbollire per 15–20 minuti, mescolando ogni tanto, finché sono quasi trasparenti. Segui il tempo della confezione se diverso.
Completa fuori dal fuoco::Spegni, copri e lascia riposare 10 minuti, finché le perle sono trasparenti e tenere. Se resta un centro bianco duro, fai bollire ancora qualche minuto e ricontrolla.
Scola e raffredda::Versa in un colino fine, sciacqua con acqua potabile fredda per fermare la cottura e scola bene. Non lasciare per ore a temperatura ambiente.
Taglia il mango::Taglia 500 g di mango sbucciato e senza nocciolo. Tieni 150 g a cubetti piccoli per decorare, coperti in frigorifero. Usa gli altri 350 g per la crema.
Frulla e mescola::Frulla i 350 g di mango con 250 g di latte di cocco, 60 g di latte condensato e i 100 ml d’acqua restanti, fino a ottenere una crema liscia. Incorpora le perle fredde con un cucchiaio.
Raffredda i bicchieri::Dividi in 4 bicchieri da circa 300 ml, copri e metti in frigorifero a 4 °C o meno per 2 ore. Conserva separata la frutta per la decorazione.
Completa e servi::Distribuisci i 150 g di mango a cubetti sui 4 bicchieri e servi freddo con cucchiaini. Se conservandolo è diventato troppo denso, aggiungi poca acqua potabile fredda prima della frutta.''',
'''Sago e tapioca sono la stessa cosa?::Botanicamente no. Il vero sago viene dalle palme e la tapioca dalla manioca. Questa versione usa piccole perle di tapioca, spesso vendute come sago.
Posso usare mango surgelato?::Sì, scongelato in frigorifero e ben scolato. Lo scongelamento non è incluso; tieni cubetti sodi se vuoi una decorazione dalla buona consistenza.
Perché resta un centro bianco?::Le perle richiedono più cottura o riposo in acqua calda. Segui la confezione e controlla che siano trasparenti e tenere prima di sciacquarle.''','1 dei 4 bicchieri da dessert')
add('pt','mango-sago-coco','Mango sago: sobremesa de manga, coco e tapioca','Sobremesa gelada de manga madura, leite de coco e pequenas pérolas de tapioca, com fruta em cubinhos. Cremosa, sem forno e com o tempo de geladeira incluído.',
'Use pérolas pequenas de tapioca, não as grandes de boba. Muitas vezes vendida como sago, a tapioca vem da mandioca; o sago verdadeiro vem de palmeiras. Use leite de coco sem açúcar de lata, não bebida de coco de caixinha. Os 130 minutos de descanso incluem 10 minutos fora do fogo e 2 horas de geladeira. O cozimento varia conforme o produto: siga a embalagem e não sirva pérolas com centro duro. Contém leite por causa do leite condensado. Guarde tampado a 4 °C ou menos por até 2 dias; a tapioca absorve líquido e engrossa.',
'manga madura, peso sem casca e sem caroço|pérolas pequenas de tapioca secas|leite de coco de lata sem açúcar|leite condensado açucarado|água: 1000 ml para cozinhar e 100 ml para bater',
'''Ferva a água::Leve 1000 ml de água à fervura em uma panela média. Pese 60 g de pérolas pequenas de tapioca; não coloque na água fria.
Cozinhe as pérolas::Junte as pérolas à água fervente e mexa imediatamente para separar. Ferva suavemente por 15–20 minutos, mexendo às vezes, até ficarem quase transparentes. Siga o tempo da embalagem se for diferente.
Termine fora do fogo::Desligue, tampe e deixe descansar 10 minutos, até ficarem transparentes e macias. Se houver um centro branco duro, ferva mais alguns minutos e confira novamente.
Escorra e esfrie::Passe por peneira fina, enxágue com água potável fria para interromper o cozimento e escorra bem. Não deixe por horas em temperatura ambiente.
Corte a manga::Corte 500 g de manga sem casca e sem caroço. Reserve 150 g em cubinhos para a cobertura, tampados na geladeira. Use os 350 g restantes para o creme.
Bata e misture::Bata os 350 g de manga com 250 g de leite de coco, 60 g de leite condensado e os 100 ml de água restantes até formar creme liso. Incorpore as pérolas frias com colher.
Leve os copos à geladeira::Divida em 4 copos de cerca de 300 ml, tampe e refrigere a 4 °C ou menos por 2 horas. Guarde a fruta da cobertura separada até servir.
Cubra e sirva::Distribua os 150 g de manga em cubos sobre os 4 copos e sirva gelado com colher. Se engrossar demais ao guardar, misture um pouco de água potável fria antes de colocar a fruta.''',
'''Sago e tapioca são iguais?::Botanicamente não. O sago verdadeiro vem de palmeiras e a tapioca da mandioca. Esta versão usa pequenas pérolas de tapioca, muitas vezes vendidas como sago ou sagu.
Posso usar manga congelada?::Sim, descongelada na geladeira e bem escorrida. O descongelamento não está incluído; reserve cubinhos firmes para uma cobertura com boa textura.
Por que fica um centro branco?::As pérolas precisam de mais cozimento ou descanso em água quente. Siga a embalagem e confira se estão transparentes e macias antes de enxaguar.''','1 dos 4 copos de sobremesa')
add('ja','mango-sago-coconut','マンゴーサゴ：ココナッツと小粒タピオカのデザート','熟したマンゴー、ココナッツミルク、小粒タピオカを使う冷たいデザート。角切りの果肉をのせます。オーブン不要で、冷やす時間も含めたレシピです。',
'大粒のボバではなく小粒のタピオカを使います。サゴという名前で売られることもありますが、タピオカはキャッサバ由来、本来のサゴはヤシ由来です。無糖の缶入りココナッツミルクを使い、紙パックのココナッツ飲料は使いません。休ませる130分には余熱で10分、冷蔵庫で2時間を含みます。加熱時間は製品で変わるため表示を優先し、硬い芯が残る粒は出さないでください。加糖練乳に由来する乳成分を含みます。ふたをして4 °C以下で2日以内保存します。タピオカは水分を吸って時間とともに濃くなります。',
'完熟マンゴー（皮と種を除いた重さ）|乾燥小粒タピオカ|無糖の缶入りココナッツミルク|加糖練乳|水（ゆで用1000 ml、ミキサー用100 ml）',
'''湯を沸かす::中くらいの鍋で水1000 mlを沸騰させます。小粒タピオカ60 gを量ります。冷たい水には入れないでください。
タピオカをゆでる::沸騰した湯にタピオカを入れ、すぐに混ぜてほぐします。時々混ぜながら15〜20分穏やかに沸かし、ほぼ透明にします。製品表示の時間が異なる場合はそちらを優先します。
余熱で仕上げる::火を止めてふたをし、透明でやわらかくなるまで10分置きます。中心に白い硬い芯が残る場合は、数分追加でゆでて再確認します。
水を切って冷ます::細かいざるにあけ、冷たい飲用水で洗って加熱を止め、よく水を切ります。室温で何時間も置かないでください。
マンゴーを切る::皮と種を除いたマンゴー500 gを切ります。150 gは小さな角切りにし、仕上げ用にふたをして冷蔵します。残り350 gをクリームに使います。
かくはんして合わせる::マンゴー350 g、ココナッツミルク250 g、加糖練乳60 g、残りの水100 mlをミキサーでなめらかにします。冷めたタピオカをスプーンで混ぜます。
グラスを冷やす::約300 mlのグラス4つに分け、ふたをして4 °C以下の冷蔵庫で2時間冷やします。仕上げの果肉は別に保存します。
果肉をのせて出す::角切りマンゴー150 gを4つのグラスに分けてのせ、冷たいままスプーンを添えます。保存中に濃くなりすぎたら、果肉をのせる前に少量の冷たい飲用水を混ぜます。''',
'''サゴとタピオカは同じですか？::植物としては異なります。本来のサゴはヤシ、タピオカはキャッサバから作ります。このレシピはサゴの名前でも売られる小粒タピオカを使います。
冷凍マンゴーでも作れますか？::はい。冷蔵庫で解凍してよく水を切ります。解凍時間は含みません。仕上げの食感をよくするには、形のしっかりした角切り果肉を取っておきます。
白い芯が残るのはなぜですか？::さらにゆでるか熱い湯で休ませる必要があります。製品表示に従い、透明でやわらかくなったことを確認してから洗います。''','4つのデザートグラスのうち1つ')
for l,r in L.items():assert len(r['steps'])==8 and len(r['ingredients'])==5 and len(r['faq'])==3,l
p=Path(__file__).resolve().parents[1]/'editorial/lote-cinco-20261024/mango-sago-coco-locales.json';p.write_text(json.dumps(L,ensure_ascii=False,indent=2)+'\n');print('Mango sago: six complete translations')

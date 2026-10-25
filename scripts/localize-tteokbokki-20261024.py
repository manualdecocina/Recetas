import json
from pathlib import Path
L={}
def add(l,slug,title,summary,notes,ing,steps,faq,serving):L[l]=dict(slug=slug,title=title,summary=summary,notes=notes,ingredients=ing.split('|'),steps=[s.split('::',1) for s in steps.strip().split('\n')],faq=[s.split('::',1) for s in faq.strip().split('\n')],serving_size=serving)
add('en','spicy-korean-tteokbokki','Spicy Korean tteokbokki with gochujang sauce','Soft, chewy Korean rice cakes simmered in a sweet-spicy gochujang sauce. A simple home version with water, spring onion and sesame, ready in about 35 minutes.',
'Use plain cylindrical tteokbokki rice cakes without sauce, not puffed rice crackers. This version uses water rather than anchovy stock or fish cakes. Start with refrigerated rice cakes; thaw frozen ones according to the pack before starting, as thawing is not included. The 10-minute soak is included. Follow pack cooking directions and check the centre is tender. Heat varies by gochujang. Contains soy and sesame; gochujang and soy sauce often contain wheat. Refrigerate leftovers at 4 °C or below within 2 hours; eat within 2 days, reheated with a little water.',
'plain refrigerated cylindrical tteok rice cakes|water for the sauce, plus extra for soaking|gochujang Korean chilli paste|soy sauce|sugar|grated garlic|spring onion|sesame seeds',
'''Soak the rice cakes::Rinse 400 g refrigerated rice cakes and gently separate them. Cover with extra lukewarm water and soak for 10 minutes while preparing the rest. Follow the pack if it specifies a different treatment.
Chop the aromatics::Chop 30 g spring onion, separating white and green parts. Grate 5 g garlic. Reserve the green parts for finishing.
Dissolve the gochujang::Mix 50 g gochujang, 15 g soy sauce and 15 g sugar with 100 ml of the 500 ml sauce water until no large lumps remain.
Heat the sauce base::Put the remaining 400 ml water in a deep pan about 28 cm wide. Add the gochujang mixture, garlic and white spring onion. Bring to a gentle boil.
Cook the rice cakes::Drain the soaked rice cakes and add to the sauce. Simmer for 8–12 minutes, stirring with a spatula to prevent sticking, until tender and chewy. Also follow the pack cooking time.
Thicken the sauce::Cook for another 2–3 minutes, stirring, until the sauce coats the rice cakes but still flows. If it thickens before the cakes soften, add extra water a tablespoon at a time.
Check the texture::Cut one rice cake open with a spoon: the centre should be tender, without a hard core. Turn off the heat once cooked and glossy; do not reduce until dry.
Finish and serve::Divide between 4 bowls and top with the green spring onion and 3 g sesame seeds. Serve hot while the sauce is fluid; rice cakes firm up as they cool.''',
'''Can I use puffed rice crackers?::No. You need compact cylindrical rice-dough cakes made for cooking. Crisp rice crackers will fall apart.
How spicy is it?::It depends on the gochujang. Choose a mild one if needed; using less changes the formulation and sauce intensity.
Why is the centre hard?::The product may need more soaking or cooking. Follow the pack and add a little water to extend simmering without drying out the sauce.''','1 of 4 bowls')
add('de','scharfe-koreanische-tteokbokki','Scharfe koreanische Tteokbokki mit Gochujang-Sauce','Weiche, elastische koreanische Reiskuchen in süß-scharfer Gochujang-Sauce. Ein einfaches Hausrezept mit Wasser, Frühlingszwiebeln und Sesam, fertig in etwa 35 Minuten.',
'Ungewürzte zylindrische Tteok für Tteokbokki ohne Sauce verwenden, keine gepufften Reiswaffeln. Diese Version verwendet Wasser statt Sardellenbrühe und Fischkuchen. Mit gekühlten Tteok beginnen; gefrorene vorher nach Packungsanweisung auftauen, die Auftauzeit ist nicht eingerechnet. 10 Minuten Einweichen sind enthalten. Garhinweise der Packung befolgen und einen weichen Kern prüfen. Die Schärfe hängt vom Gochujang ab. Enthält Soja und Sesam; Gochujang und Sojasauce enthalten oft Weizen. Reste innerhalb von 2 Stunden bei höchstens 4 °C kühlen und innerhalb von 2 Tagen mit etwas Wasser gründlich erhitzt essen.',
'gekühlte zylindrische Tteok-Reiskuchen ohne Sauce|Wasser für die Sauce sowie zusätzliches Einweichwasser|Gochujang, koreanische Chilipaste|Sojasauce|Zucker|geriebener Knoblauch|Frühlingszwiebel|Sesamsamen',
'''Reiskuchen einweichen::400 g gekühlte Tteok abspülen und vorsichtig trennen. Mit zusätzlichem lauwarmem Wasser bedecken und während der Vorbereitung 10 Minuten einweichen. Abweichende Packungsangaben beachten.
Aromaten schneiden::30 g Frühlingszwiebel hacken und weiße und grüne Teile trennen. 5 g Knoblauch reiben. Das Grün für den Abschluss zurücklegen.
Gochujang auflösen::50 g Gochujang, 15 g Sojasauce und 15 g Zucker mit 100 ml der insgesamt 500 ml Saucenwasser verrühren, bis keine großen Klumpen bleiben.
Saucenbasis erhitzen::Die übrigen 400 ml Wasser in eine tiefe, etwa 28 cm breite Pfanne geben. Gochujang-Mischung, Knoblauch und weiße Frühlingszwiebel zugeben und sanft aufkochen.
Tteok garen::Die eingeweichten Reiskuchen abgießen und in die Sauce geben. Unter Rühren mit einem Pfannenwender 8–12 Minuten sanft köcheln, bis sie weich und elastisch sind. Auch die Garzeit auf der Packung beachten.
Sauce eindicken::Weitere 2–3 Minuten rührend garen, bis die Sauce an den Tteok haftet, aber noch fließt. Wird sie vorzeitig dick, zusätzliches Wasser esslöffelweise zugeben.
Konsistenz prüfen::Einen Reiskuchen mit einem Löffel öffnen: die Mitte soll weich sein, ohne harten Kern. Sobald alles gar und glänzend ist, den Herd ausschalten; nicht trocken einkochen.
Anrichten und servieren::Auf 4 Schalen verteilen und mit dem Frühlingszwiebelgrün und 3 g Sesam bestreuen. Heiß mit noch fließender Sauce servieren; beim Abkühlen werden die Reiskuchen fester.''',
'''Kann ich gepuffte Reiswaffeln nehmen?::Nein. Erforderlich sind kompakte zylindrische Reisteigstücke zum Kochen; knusprige Reiswaffeln zerfallen.
Wie scharf ist das Gericht?::Das hängt vom Gochujang ab. Bei Bedarf eine milde Sorte wählen; weniger Paste verändert Rezeptur und Saucenintensität.
Warum bleibt ein harter Kern?::Das Produkt braucht möglicherweise mehr Einweich- oder Garzeit. Packung beachten und etwas Wasser zugeben, um weiterzuköcheln, ohne die Sauce auszutrocknen.''','1 von 4 Schalen')
add('fr','tteokbokki-coreen-piquant','Tteokbokki coréen : gâteaux de riz en sauce piquante','Des gâteaux de riz coréens tendres et élastiques dans une sauce au gochujang douce et piquante. Une version maison à l’eau, à la cébette et au sésame, prête en environ 35 minutes.',
'Utilisez des tteok cylindriques nature sans sauce, pas des galettes de riz soufflé. Cette version utilise de l’eau, sans bouillon d’anchois ni gâteaux de poisson. Partez d’un produit réfrigéré ; décongelez le produit surgelé selon l’emballage avant de commencer, hors temps indiqué. Les 10 minutes de trempage sont incluses. Respectez la cuisson indiquée et vérifiez un cœur tendre. Le piquant varie selon le gochujang. Contient soja et sésame ; gochujang et sauce soja contiennent souvent du blé. Réfrigérez les restes à 4 °C maximum sous 2 heures et consommez sous 2 jours, bien réchauffés avec un peu d’eau.',
'tteok cylindriques nature réfrigérés|eau pour la sauce, plus de l’eau pour le trempage|gochujang, pâte de piment coréenne|sauce soja|sucre|ail râpé|cébette|graines de sésame',
'''Faites tremper les tteok::Rincez 400 g de tteok réfrigérés et séparez-les délicatement. Couvrez d’eau tiède supplémentaire et laissez tremper 10 minutes pendant la préparation. Suivez l’emballage s’il prévoit un autre traitement.
Préparez les aromates::Hachez 30 g de cébette en séparant blanc et vert. Râpez 5 g d’ail. Réservez le vert pour la finition.
Délayez le gochujang::Mélangez 50 g de gochujang, 15 g de sauce soja et 15 g de sucre avec 100 ml des 500 ml d’eau prévus pour la sauce, sans gros grumeaux.
Chauffez la base::Versez les 400 ml d’eau restants dans une sauteuse profonde d’environ 28 cm. Ajoutez la préparation au gochujang, l’ail et le blanc de cébette. Portez à petite ébullition.
Faites cuire les tteok::Égouttez les tteok et ajoutez-les à la sauce. Laissez frémir 8–12 minutes en remuant à la spatule pour éviter qu’ils collent, jusqu’à ce qu’ils soient tendres et élastiques. Respectez aussi le temps de l’emballage.
Épaississez la sauce::Poursuivez 2–3 minutes en remuant, jusqu’à une sauce nappante mais encore fluide. Si elle épaissit avant que les tteok soient tendres, ajoutez de l’eau par cuillères à soupe.
Vérifiez la texture::Ouvrez un tteok avec une cuillère : son centre doit être tendre, sans noyau dur. Coupez le feu dès qu’ils sont cuits et la sauce brillante, sans laisser sécher.
Terminez et servez::Répartissez dans 4 bols et ajoutez le vert de cébette et 3 g de sésame. Servez chaud avec la sauce encore fluide ; les tteok se raffermissent en refroidissant.''',
'''Peut-on utiliser des galettes de riz soufflé ?::Non. Il faut des cylindres compacts de pâte de riz à cuire ; les galettes croustillantes se défont.
Est-ce très piquant ?::Cela dépend du gochujang. Choisissez une version douce si nécessaire ; en diminuer la quantité change la formulation et l’intensité de la sauce.
Pourquoi le cœur reste-t-il dur ?::Le produit peut demander plus de trempage ou de cuisson. Suivez l’emballage et ajoutez un peu d’eau pour prolonger le frémissement sans dessécher la sauce.''','1 des 4 bols')
add('it','tteokbokki-coreani-piccanti','Tteokbokki coreani: gnocchi di riso in salsa piccante','Cilindretti di riso coreani morbidi ed elastici, cotti in salsa dolce e piccante al gochujang. Una versione casalinga con acqua, cipollotto e sesamo, pronta in circa 35 minuti.',
'Compra tteok cilindrici al naturale senza salsa, non gallette di riso soffiato. Questa versione usa acqua, senza brodo di acciughe né tortini di pesce. Parti da prodotto refrigerato; scongela quello surgelato secondo l’etichetta prima di iniziare, fuori dal tempo indicato. I 10 minuti d’ammollo sono inclusi. Segui la cottura della confezione e controlla che il centro sia morbido. Il piccante varia con il gochujang. Contiene soia e sesamo; gochujang e salsa di soia spesso contengono frumento. Metti gli avanzi a non più di 4 °C entro 2 ore e consumali entro 2 giorni, ben riscaldati con poca acqua.',
'tteok di riso cilindrici refrigerati, senza salsa|acqua per la salsa, più altra per l’ammollo|gochujang, pasta coreana di peperoncino|salsa di soia|zucchero|aglio grattugiato|cipollotto|semi di sesamo',
'''Metti in ammollo i tteok::Sciacqua 400 g di tteok refrigerati e separali delicatamente. Copri con altra acqua tiepida e lascia in ammollo 10 minuti mentre prepari il resto. Se la confezione indica un trattamento diverso, seguilo.
Trita gli aromi::Trita 30 g di cipollotto separando parte bianca e verde. Grattugia 5 g d’aglio. Tieni il verde per la finitura.
Sciogli il gochujang::Mescola 50 g di gochujang, 15 g di salsa di soia e 15 g di zucchero con 100 ml dei 500 ml d’acqua per la salsa, eliminando i grumi grandi.
Scalda la base::Versa i 400 ml d’acqua restanti in una padella profonda di circa 28 cm. Aggiungi composto al gochujang, aglio e parte bianca del cipollotto. Porta a lieve bollore.
Cuoci i tteok::Scola i tteok e aggiungili alla salsa. Fai sobbollire per 8–12 minuti, mescolando con una spatola perché non si attacchino, finché sono teneri ed elastici. Rispetta anche il tempo della confezione.
Addensa la salsa::Cuoci altri 2–3 minuti mescolando, finché la salsa avvolge i tteok ma resta fluida. Se addensa prima che siano teneri, aggiungi altra acqua un cucchiaio alla volta.
Controlla la consistenza::Apri un tteok con un cucchiaio: il centro deve essere tenero, senza nucleo duro. Spegni quando sono cotti e la salsa è lucida, senza farli asciugare.
Completa e servi::Dividi in 4 ciotole e aggiungi il verde del cipollotto e 3 g di sesamo. Servi caldo, con salsa ancora fluida; raffreddandosi i tteok induriscono.''',
'''Posso usare gallette di riso soffiato?::No. Servono cilindretti compatti di impasto di riso da cuocere; le gallette croccanti si sfaldano.
Quanto sono piccanti?::Dipende dal gochujang. Scegline uno delicato se necessario; ridurne la quantità cambia la formulazione e l’intensità della salsa.
Perché resta un centro duro?::Il prodotto può richiedere più ammollo o cottura. Segui la confezione e aggiungi poca acqua per prolungare il bollore senza asciugare la salsa.''','1 delle 4 ciotole')
add('pt','tteokbokki-coreano-picante','Tteokbokki coreano: bolinhos de arroz em molho picante','Bolinhos de arroz coreanos macios e elásticos, cozidos em molho agridoce de gochujang. Versão caseira com água, cebolinha e gergelim, pronta em cerca de 35 minutos.',
'Compre tteok cilíndricos sem molho, não bolachas de arroz tufado. Esta versão usa água, sem caldo de anchovas nem bolinhos de peixe. Comece com produto refrigerado; descongele os congelados conforme a embalagem antes de começar, fora do tempo indicado. Os 10 minutos de molho estão incluídos. Siga o cozimento da embalagem e confira se o centro está macio. A ardência varia com o gochujang. Contém soja e gergelim; gochujang e molho de soja costumam conter trigo. Guarde as sobras a 4 °C ou menos em até 2 horas e consuma em 2 dias, bem reaquecidas com um pouco de água.',
'tteok de arroz cilíndricos refrigerados e sem molho|água para o molho, mais água para deixar de molho|gochujang, pasta coreana de pimenta|molho de soja|açúcar|alho ralado|cebolinha|sementes de gergelim',
'''Deixe os tteok de molho::Enxágue 400 g de tteok refrigerados e separe delicadamente. Cubra com água morna adicional e deixe de molho por 10 minutos enquanto prepara o restante. Se a embalagem indicar outro tratamento, siga as instruções.
Pique os aromáticos::Pique 30 g de cebolinha, separando as partes branca e verde. Rale 5 g de alho. Reserve a parte verde para finalizar.
Dissolva o gochujang::Misture 50 g de gochujang, 15 g de molho de soja e 15 g de açúcar com 100 ml dos 500 ml de água para o molho, sem deixar grumos grandes.
Aqueça a base::Coloque os 400 ml de água restantes em uma frigideira funda de cerca de 28 cm. Junte a mistura de gochujang, o alho e a parte branca da cebolinha. Leve à fervura suave.
Cozinhe os tteok::Escorra os bolinhos e coloque no molho. Ferva suavemente por 8–12 minutos, mexendo com espátula para não grudar, até ficarem macios e elásticos. Respeite também o tempo da embalagem.
Engrosse o molho::Cozinhe mais 2–3 minutos, mexendo, até o molho cobrir os tteok e ainda escorrer. Se engrossar antes de amaciarem, junte água adicional de colher de sopa em colher de sopa.
Confira a textura::Abra um bolinho com uma colher: o centro deve estar macio, sem núcleo duro. Desligue quando estiverem cozidos e o molho brilhante, sem deixar secar.
Finalize e sirva::Divida em 4 tigelas e termine com a parte verde da cebolinha e 3 g de gergelim. Sirva quente com molho ainda fluido; os bolinhos endurecem ao esfriar.''',
'''Posso usar bolachas de arroz tufado?::Não. São necessários tteok cilíndricos e compactos feitos de massa de arroz para cozinhar; bolachas crocantes se desfazem.
Fica muito picante?::Depende do gochujang. Escolha um suave se precisar; reduzir a quantidade muda a formulação e a intensidade do molho.
Por que fica um centro duro?::O produto pode precisar de mais hidratação ou cozimento. Siga a embalagem e acrescente um pouco de água para prolongar a fervura sem secar o molho.''','1 das 4 tigelas')
add('ja','spicy-korean-tteokbokki','韓国のトッポッキ：コチュジャンの甘辛ソース','やわらかく弾力のある韓国の棒状の餅を、甘辛いコチュジャンソースで煮ます。水、ねぎ、ごまを使う家庭向けの簡単な配合で、約35分で作れます。',
'ソースの付いていない棒状のトッポッキ用トックを使います。膨らませたライスクラッカーではありません。いりこだしや練り物を使わず、水をベースにする配合です。冷蔵品から始め、冷凍品は表示に従って先に解凍してください。解凍時間は含みません。浸水10分は含みます。製品の加熱表示を守り、中心までやわらかくなったことを確認します。辛さはコチュジャンで変わります。大豆とごまを含み、コチュジャンやしょうゆは小麦を含む場合があります。残りは2時間以内に4 °C以下で冷蔵し、2日以内に少量の水を加えて十分再加熱して食べてください。',
'冷蔵の棒状トック（トッポッキ用、ソースなし）|ソース用の水（浸水用は別途）|コチュジャン|しょうゆ|砂糖|すりおろしにんにく|青ねぎ|ごま',
'''餅を水に浸す::冷蔵のトック400 gを洗い、やさしく離します。別途用意したぬるま湯をかぶるまで注ぎ、ほかの準備をしながら10分浸します。製品表示が異なる場合はそちらを優先します。
香味野菜を切る::青ねぎ30 gを刻み、白い部分と緑の部分を分けます。にんにく5 gをすりおろし、ねぎの緑の部分は仕上げ用に取っておきます。
コチュジャンを溶く::コチュジャン50 g、しょうゆ15 g、砂糖15 gを、ソース用の水500 mlのうち100 mlで混ぜ、大きなだまをなくします。
ソースを温める::直径約28 cmの深いフライパンに残りの水400 mlを入れます。コチュジャンの混合物、にんにく、ねぎの白い部分を加え、穏やかに沸騰させます。
トックを煮る::浸したトックの水を切って加えます。へらで焦げ付かないよう混ぜながら8〜12分、やわらかく弾力が出るまで穏やかに煮ます。製品の指定加熱時間も守ってください。
ソースを煮詰める::さらに2〜3分混ぜながら煮て、餅に絡みながら流れる濃度にします。餅がやわらかくなる前に濃くなったら、別途の水を大さじ1ずつ足します。
食感を確かめる::スプーンで1本を切り、中心に硬い芯がなく、やわらかいことを確認します。火が通ってソースにつやが出たら火を止め、乾くまで煮詰めないでください。
仕上げて出す::4つの器へ分け、ねぎの緑の部分とごま3 gを散らします。ソースがまだ流れる熱いうちに食べます。冷めると餅は硬くなります。''',
'''膨らんだライスクラッカーで作れますか？::いいえ。調理用の米の生地を棒状に固めたトックが必要です。カリカリのライスクラッカーは崩れます。
とても辛いですか？::コチュジャンによって変わります。必要なら辛さの弱い製品を選んでください。量を減らすと配合とソースの濃さが変わります。
中心が硬いのはなぜですか？::浸水や加熱がさらに必要な場合があります。製品表示に従い、少量の水を足してソースを乾かさずに煮続けます。''','4つの器のうち1つ')
for l,r in L.items():assert len(r['steps'])==8 and len(r['ingredients'])==8 and len(r['faq'])==3,l
p=Path(__file__).resolve().parents[1]/'editorial/lote-cinco-20261024/tteokbokki-coreano-picante-locales.json';p.write_text(json.dumps(L,ensure_ascii=False,indent=2)+'\n');print('Tteokbokki: six complete translations')

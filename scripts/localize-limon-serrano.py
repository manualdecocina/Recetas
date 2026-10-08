"""Localize the frozen original recipe; preserve historical paths and shared quantities."""
import copy
import hashlib
import html
import json
import re
import uuid
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SLUG = 'como-preparar-limon-serrano-la-receta-de-ensalada-mas-buscada'

def pairs(text):
    return [line.split('|', 1) for line in text.strip().splitlines()]

T = {
    'en': {
        'path': '/en/how-to-prepare-serrano-lemon-the-most-searched-for-salad-recipe',
        'title': 'Limón serrano: citrus, egg and cured meat salad',
        'seo_title': 'Limón serrano citrus salad | Manual de Cocina',
        'excerpt': 'Make limón serrano with oranges, lemon, hard-boiled eggs and cured meats. Ingredients for 4 servings and an olive oil, garlic and wine dressing.',
        'summary': 'Limón serrano is a salad from the Sierra de Francia area of Salamanca, Spain. This version combines orange, a smaller amount of lemon, hard-boiled eggs, cured ham and dry-cured chorizo, dressed with olive oil, garlic and white wine. These proportions and instructions are an original proposal; local versions vary.\n\nMakes 4 servings of approximately 245 g. Allow about 40 minutes from start to finish, including 5 minutes to cool the eggs. Use only dry-cured chorizo labelled ready to eat.',
        'meta': ['Easy', 'Starter', 'Salamanca, Spain', 'pieces', 'Salad', 'Dressing'],
        'ingredients': ['orange, weighed after peeling', 'lemon, weighed after peeling', 'large eggs, about 200 g cooked without shells', 'ready-to-eat Serrano ham', 'ready-to-eat dry-cured chorizo', 'extra virgin olive oil', 'peeled garlic', 'white wine'],
        'steps': pairs('''Gather the ingredients|Wash the oranges and lemon before peeling. Set out 4 eggs, 80 g Serrano ham, 60 g dry-cured chorizo, 25 g oil, 3 g peeled garlic and 15 ml wine. Check that both cured meats are labelled ready to eat; this preparation does not cook fresh chorizo.
Cook and cool the eggs|Place the eggs in a saucepan and cover with cold water by about 2 cm. Bring to a boil, then simmer gently for 12 minutes; both yolks and whites must be firm. Cool in cold water for about 5 minutes, peel and cut each egg into quarters. Allow approximately 15 minutes for cooking, including heating the water.
Peel and slice the citrus|Use a knife to remove the orange and lemon peel and white pith. Weigh out 500 g peeled orange and 100 g peeled lemon. Cut into slices or pieces about 5 mm thick, remove the seeds and collect any juice in a bowl for the dressing.
Slice the cured meats|Cut the 80 g Serrano ham into short strips and the 60 g dry-cured chorizo into thin rounds; remove the casing if it is not edible. Keep both chilled until assembly. Do not add salt: the cured meats already supply plenty.
Mix the dressing|Finely mince or grate the 3 g garlic. Mix with the 25 g oil, 15 ml white wine and all the juice collected from the citrus. Whisk with a fork until combined. The wine is added uncooked and retains alcohol.
Assemble the salad|Arrange the orange and lemon on a wide platter. Distribute the ham and chorizo, pour over the dressing and move gently without breaking up the citrus. Place the 16 egg quarters on top with their yolks visible.
Portion and serve|Divide into 4 servings, distributing citrus, cured meats and one egg per person. Serve freshly assembled. If not eating immediately, cover and refrigerate; use within 24 hours for the best texture. Do not leave at room temperature for more than 2 hours.'''),
        'notes': 'The larger proportion of orange balances the lemon. Remove the white pith and seeds thoroughly to reduce bitterness. To prepare ahead, refrigerate cooked eggs, citrus, cured meats and dressing separately, then assemble just before serving. The wine remains uncooked: for an alcohol-free version, replace it with 15 ml orange juice; the nutrition calculation is for the wine version. Contains egg; cured meats and wine may contain other allergens or sulphites, so check their labels.',
        'faq': pairs('''How do I prevent a bitter limón serrano?|Remove all the white pith and seeds. Weigh the citrus after peeling and use 500 g orange to 100 g lemon.
Can I make it without wine?|Yes. Replace the 15 ml wine with the same amount of orange juice. Flavour and nutrition change slightly; the published estimate includes wine.
Can I use fresh chorizo?|This recipe uses ready-to-eat dry-cured chorizo. Fresh chorizo requires a different, complete cooking process and must not be served raw following these steps.'''),
        'keywords': ['limón serrano', 'orange and lemon salad', 'Sierra de Francia recipe'],
        'cover_alt': 'Limón serrano with orange, lemon, hard-boiled egg quarters, Serrano ham and dry-cured chorizo',
        'nutrition': ['1 of 4 servings, approximately 245 g', 'Verified USDA values per 100 g are multiplied by each edible ingredient weight and divided by 4. All oil and wine are included; 15 ml wine is approximated as 15 g. No added salt or side dishes.', 'Estimate, not a laboratory analysis of this dish. Serrano ham and dry-cured chorizo are approximated using generic cooked cured ham and dry pork-and-beef salami records; sodium, fat and energy may vary considerably by brand. Check product labels for a more accurate estimate.'],
        'proxies': ['Approximation using generic cooked cured ham, not an exact record for dry-cured Serrano ham.', 'Approximation using dry pork-and-beef salami, not an exact record for the dry-cured chorizo used.'],
    },
    'de': {
        'path': '/de/wie-man-serrano-zitrone-das-meistgesuchte-salat-rezept-zubereitet-2',
        'title': 'Limón serrano: Zitrussalat mit Ei und Wurst',
        'seo_title': 'Limón serrano mit Zitrusfrüchten | Manual de Cocina',
        'excerpt': 'Limón serrano mit Orange, Zitrone, hart gekochten Eiern und gereifter Wurst: Mengen für 4 Portionen und ein Dressing aus Olivenöl, Knoblauch und Wein.',
        'summary': 'Limón serrano ist ein Salat aus der Sierra de Francia in der spanischen Provinz Salamanca. Diese Variante verbindet Orange, einen kleineren Anteil Zitrone, hart gekochte Eier, Serrano-Schinken und gereifte Chorizo mit Olivenöl, Knoblauch und Weißwein. Mengen und Anleitung sind ein eigener Rezeptvorschlag; örtliche Varianten unterscheiden sich.\n\nErgibt 4 Portionen von ungefähr 245 g. Insgesamt etwa 40 Minuten einplanen, einschließlich 5 Minuten zum Abkühlen der Eier. Ausschließlich gereifte Chorizo verwenden, die laut Etikett verzehrfertig ist.',
        'meta': ['Einfach', 'Vorspeise', 'Salamanca, Spanien', 'Stück', 'Salat', 'Dressing'],
        'ingredients': ['Orange, nach dem Schälen gewogen', 'Zitrone, nach dem Schälen gewogen', 'große Eier, gekocht ohne Schale etwa 200 g', 'verzehrfertiger Serrano-Schinken', 'verzehrfertige gereifte Chorizo', 'natives Olivenöl extra', 'geschälter Knoblauch', 'Weißwein'],
        'steps': pairs('''Zutaten bereitstellen|Orangen und Zitrone vor dem Schälen waschen. 4 Eier, 80 g Serrano-Schinken, 60 g gereifte Chorizo, 25 g Öl, 3 g geschälten Knoblauch und 15 ml Wein bereitstellen. Beide Fleischwaren müssen laut Etikett verzehrfertig sein; frische rohe Chorizo wird in diesem Rezept nicht gegart.
Eier kochen und abkühlen|Eier in einen Topf legen und etwa 2 cm hoch mit kaltem Wasser bedecken. Aufkochen, dann 12 Minuten sanft köcheln lassen; Eigelb und Eiweiß müssen fest sein. Etwa 5 Minuten in kaltem Wasser abkühlen, schälen und jedes Ei vierteln. Mit dem Erhitzen des Wassers ungefähr 15 Minuten Kochzeit einplanen.
Zitrusfrüchte schälen und schneiden|Schale und weiße Haut mit einem Messer vollständig von Orangen und Zitrone entfernen. 500 g geschälte Orange und 100 g geschälte Zitrone abwiegen. In etwa 5 mm dicke Scheiben oder Stücke schneiden, Kerne entfernen und austretenden Saft für das Dressing in einer Schüssel auffangen.
Schinken und Chorizo schneiden|80 g Serrano-Schinken in kurze Streifen und 60 g gereifte Chorizo in dünne Scheiben schneiden. Nicht essbare Wursthülle entfernen. Bis zum Anrichten kühl halten. Kein Salz zugeben: Die Fleischwaren enthalten bereits reichlich davon.
Dressing verrühren|3 g Knoblauch sehr fein hacken oder reiben. Mit 25 g Öl, 15 ml Weißwein und dem gesamten aufgefangenen Zitrussaft mischen. Mit einer Gabel verrühren. Der Wein wird nicht erhitzt und enthält weiterhin Alkohol.
Salat anrichten|Orange und Zitrone auf einer breiten Platte verteilen. Schinken und Chorizo daraufgeben, mit dem Dressing beträufeln und vorsichtig bewegen, ohne die Früchte zu zerdrücken. Die 16 Eiviertel mit sichtbarem Eigelb darauflegen.
Aufteilen und servieren|In 4 Portionen aufteilen und dabei Zitrusfrüchte, Fleischwaren und je ein Ei gleichmäßig verteilen. Frisch angerichtet servieren. Bei späterem Verzehr abdecken und kühlen; für eine gute Konsistenz innerhalb von 24 Stunden verwenden. Nicht länger als 2 Stunden bei Zimmertemperatur stehen lassen.'''),
        'notes': 'Der höhere Orangenanteil gleicht die Säure der Zitrone aus. Weiße Haut und Kerne gründlich entfernen, um Bitterkeit zu verringern. Zum Vorbereiten gekochte Eier, Früchte, Fleischwaren und Dressing getrennt im Kühlschrank aufbewahren und erst zum Servieren mischen. Der Wein bleibt unerhitzt; für eine alkoholfreie Variante durch 15 ml Orangensaft ersetzen. Die Nährwertberechnung gilt für die Variante mit Wein. Enthält Ei; je nach Etikett können Fleischwaren und Wein weitere Allergene oder Sulfite enthalten.',
        'faq': pairs('''Wie vermeide ich einen bitteren Salat?|Die weiße Haut und alle Kerne entfernen. Früchte nach dem Schälen wiegen und 500 g Orange auf 100 g Zitrone verwenden.
Geht es ohne Wein?|Ja. Die 15 ml Wein durch dieselbe Menge Orangensaft ersetzen. Geschmack und Nährwerte ändern sich etwas; die veröffentlichte Schätzung enthält Wein.
Kann ich frische Chorizo verwenden?|Dieses Rezept verwendet verzehrfertige gereifte Chorizo. Frische Chorizo benötigt eine andere, vollständige Garung und darf nach diesen Schritten nicht roh serviert werden.'''),
        'keywords': ['Limón serrano', 'Orangen-Zitronen-Salat', 'Rezept aus der Sierra de Francia'],
        'cover_alt': 'Limón serrano mit Orange, Zitrone, hart gekochten Eivierteln, Serrano-Schinken und gereifter Chorizo',
        'nutrition': ['1 von 4 Portionen, ungefähr 245 g', 'Geprüfte USDA-Werte je 100 g werden mit dem essbaren Zutatengewicht multipliziert und durch 4 geteilt. Öl und Wein sind vollständig eingerechnet; 15 ml Wein entsprechen näherungsweise 15 g. Ohne zusätzliches Salz und Beilagen.', 'Schätzung, keine Laboranalyse dieses Gerichts. Serrano-Schinken und gereifte Chorizo werden durch generische Datensätze für gegarten gepökelten Schinken und trockene Schweine-Rind-Salami angenähert. Natrium, Fett und Energie können je nach Marke erheblich abweichen. Für genauere Werte die Produktetiketten prüfen.'],
        'proxies': ['Näherungswert für generischen gegarten gepökelten Schinken; kein exakter Datensatz für luftgetrockneten Serrano-Schinken.', 'Näherungswert für trockene Schweine-Rind-Salami; kein exakter Datensatz für die verwendete gereifte Chorizo.'],
    },
    'fr': {
        'path': '/fr/comment-preparer-le-citron-serrano-la-recette-de-salade-la-plus-recherchee-2',
        'title': 'Limón serrano : salade d’agrumes, œufs et charcuterie',
        'seo_title': 'Salade limón serrano aux agrumes | Manual de Cocina',
        'excerpt': 'Préparez un limón serrano avec orange, citron, œufs durs et charcuterie. Quantités pour 4 portions et assaisonnement à l’huile, à l’ail et au vin.',
        'summary': 'Le limón serrano est une salade de la Sierra de Francia, dans la province de Salamanque, en Espagne. Cette version associe de l’orange, une plus petite quantité de citron, des œufs durs, du jambon serrano et du chorizo sec, avec de l’huile d’olive, de l’ail et du vin blanc. Les proportions et la méthode sont une proposition originale ; les variantes locales diffèrent.\n\nPour 4 portions d’environ 245 g. Comptez environ 40 minutes au total, dont 5 minutes pour refroidir les œufs. Utilisez uniquement du chorizo sec dont l’étiquette indique qu’il est prêt à consommer.',
        'meta': ['Facile', 'Entrée', 'Salamanque, Espagne', 'unités', 'Salade', 'Assaisonnement'],
        'ingredients': ['orange, poids après épluchage', 'citron, poids après épluchage', 'gros œufs, environ 200 g cuits sans coquille', 'jambon serrano prêt à consommer', 'chorizo sec prêt à consommer', 'huile d’olive vierge extra', 'ail épluché', 'vin blanc'],
        'steps': pairs('''Rassembler les ingrédients|Lavez les oranges et le citron avant de les éplucher. Préparez 4 œufs, 80 g de jambon serrano, 60 g de chorizo sec, 25 g d’huile, 3 g d’ail épluché et 15 ml de vin. Vérifiez que les deux charcuteries sont prêtes à consommer selon leurs étiquettes : cette préparation ne cuit pas le chorizo frais.
Cuire et refroidir les œufs|Placez les œufs dans une casserole et couvrez-les d’eau froide jusqu’à environ 2 cm au-dessus. Portez à ébullition, puis laissez frémir 12 minutes ; blanc et jaune doivent être fermes. Refroidissez dans l’eau froide environ 5 minutes, écalez et coupez chaque œuf en quatre. Comptez environ 15 minutes de cuisson, chauffage de l’eau compris.
Éplucher et couper les agrumes|Avec un couteau, retirez la peau et toute la partie blanche des oranges et du citron. Pesez 500 g d’orange et 100 g de citron épluchés. Coupez en rondelles ou morceaux d’environ 5 mm, retirez les pépins et recueillez le jus dans un bol pour l’assaisonnement.
Couper la charcuterie|Coupez les 80 g de jambon serrano en courtes lanières et les 60 g de chorizo sec en fines rondelles. Retirez le boyau s’il n’est pas comestible. Gardez au froid jusqu’au montage. N’ajoutez pas de sel : la charcuterie en contient déjà beaucoup.
Mélanger l’assaisonnement|Hachez très finement ou râpez les 3 g d’ail. Mélangez avec les 25 g d’huile, les 15 ml de vin blanc et tout le jus recueilli en coupant les agrumes. Fouettez à la fourchette. Le vin n’est pas cuit et conserve de l’alcool.
Assembler la salade|Répartissez orange et citron sur un large plat. Ajoutez le jambon et le chorizo, versez l’assaisonnement et remuez délicatement sans écraser les agrumes. Disposez les 16 quartiers d’œuf dessus, jaunes visibles.
Répartir et servir|Divisez en 4 portions en répartissant agrumes, charcuterie et un œuf par personne. Servez juste après le montage. Sinon, couvrez et réfrigérez ; consommez dans les 24 heures pour préserver la texture. Ne laissez pas plus de 2 heures à température ambiante.'''),
        'notes': 'La proportion plus élevée d’orange équilibre le citron. Retirez soigneusement partie blanche et pépins pour limiter l’amertume. Pour anticiper, conservez œufs cuits, agrumes, charcuterie et assaisonnement dans des récipients séparés au réfrigérateur et assemblez au moment de servir. Le vin reste cru : remplacez-le par 15 ml de jus d’orange pour une version sans alcool. Le calcul nutritionnel concerne la version au vin. Contient de l’œuf ; charcuterie et vin peuvent contenir d’autres allergènes ou des sulfites selon leurs étiquettes.',
        'faq': pairs('''Comment éviter une salade amère ?|Retirez toute la partie blanche et les pépins. Pesez les agrumes épluchés et respectez 500 g d’orange pour 100 g de citron.
Peut-on supprimer le vin ?|Oui. Remplacez les 15 ml par la même quantité de jus d’orange. Saveur et nutrition changent légèrement ; l’estimation publiée comprend du vin.
Peut-on utiliser du chorizo frais ?|Cette recette utilise du chorizo sec prêt à consommer. Le chorizo frais exige une cuisson complète différente et ne doit pas être servi cru en suivant ces étapes.'''),
        'keywords': ['limón serrano', 'salade d’orange et de citron', 'recette de la Sierra de Francia'],
        'cover_alt': 'Limón serrano avec orange, citron, quartiers d’œuf dur, jambon serrano et chorizo sec',
        'nutrition': ['1 des 4 portions, environ 245 g', 'Les valeurs USDA vérifiées pour 100 g sont multipliées par le poids comestible de chaque ingrédient puis divisées par 4. Toute l’huile et tout le vin sont inclus ; 15 ml de vin sont assimilés à 15 g. Sans sel ajouté ni accompagnement.', 'Estimation, pas une analyse en laboratoire du plat. Le jambon serrano et le chorizo sec sont approximés par des données génériques de jambon salé cuit et de salami sec de porc et de bœuf. Sodium, matières grasses et énergie peuvent varier sensiblement selon la marque. Vérifiez les étiquettes pour plus de précision.'],
        'proxies': ['Approximation avec un jambon salé cuit générique ; pas une fiche exacte de jambon serrano séché.', 'Approximation avec du salami sec de porc et de bœuf ; pas une fiche exacte du chorizo sec utilisé.'],
    },
    'it': {
        'path': '/it/come-preparare-serrano-limone-la-ricetta-dellinsalata-piu-cercata',
        'title': 'Limón serrano: insalata di agrumi, uova e salumi',
        'seo_title': 'Limón serrano con agrumi e uova | Manual de Cocina',
        'excerpt': 'Prepara il limón serrano con arancia, limone, uova sode e salumi stagionati. Dosi per 4 porzioni e condimento con olio, aglio e vino bianco.',
        'summary': 'Il limón serrano è un’insalata della Sierra de Francia, nella provincia spagnola di Salamanca. Questa versione unisce arancia, una quantità minore di limone, uova sode, prosciutto serrano e chorizo stagionato, con olio d’oliva, aglio e vino bianco. Dosi e procedimento sono una proposta originale; esistono varianti locali.\n\nSi ottengono 4 porzioni di circa 245 g. Calcola circa 40 minuti complessivi, compresi 5 minuti per raffreddare le uova. Usa soltanto chorizo stagionato indicato in etichetta come pronto al consumo.',
        'meta': ['Facile', 'Antipasto', 'Salamanca, Spagna', 'unità', 'Insalata', 'Condimento'],
        'ingredients': ['arancia, peso dopo averla sbucciata', 'limone, peso dopo averlo sbucciato', 'uova grandi, circa 200 g cotte senza guscio', 'prosciutto serrano pronto al consumo', 'chorizo stagionato pronto al consumo', 'olio extravergine d’oliva', 'aglio sbucciato', 'vino bianco'],
        'steps': pairs('''Prepara gli ingredienti|Lava arance e limone prima di sbucciarli. Prepara 4 uova, 80 g di prosciutto serrano, 60 g di chorizo stagionato, 25 g di olio, 3 g di aglio sbucciato e 15 ml di vino. Verifica che entrambi i salumi siano pronti al consumo secondo l’etichetta: questa preparazione non cuoce il chorizo fresco.
Cuoci e raffredda le uova|Metti le uova in un pentolino e coprile con acqua fredda fino a circa 2 cm sopra. Porta a ebollizione e lascia sobbollire dolcemente per 12 minuti; albume e tuorlo devono essere sodi. Raffredda in acqua fredda per circa 5 minuti, sguscia e taglia ogni uovo in quattro. Considera circa 15 minuti di cottura, incluso il riscaldamento dell’acqua.
Sbuccia e taglia gli agrumi|Elimina con un coltello buccia e parte bianca di arance e limone. Pesa 500 g di arancia e 100 g di limone già sbucciati. Taglia a fette o pezzi di circa 5 mm, elimina i semi e raccogli il succo in una ciotola per il condimento.
Taglia i salumi|Taglia gli 80 g di prosciutto serrano a striscioline corte e i 60 g di chorizo stagionato a rondelle sottili. Togli il budello se non è commestibile. Conserva al fresco fino al montaggio. Non aggiungere sale: i salumi ne contengono già molto.
Mescola il condimento|Trita molto finemente o grattugia i 3 g di aglio. Mescola con i 25 g di olio, i 15 ml di vino bianco e tutto il succo raccolto dagli agrumi. Sbatti con una forchetta fino ad amalgamare. Il vino non viene cotto e conserva alcol.
Componi l’insalata|Distribuisci arancia e limone su un piatto da portata largo. Aggiungi prosciutto e chorizo, versa il condimento e mescola delicatamente senza rompere gli agrumi. Sistema sopra i 16 spicchi d’uovo, con i tuorli visibili.
Dividi e servi|Dividi in 4 porzioni, distribuendo agrumi, salumi e un uovo per persona. Servi appena composta. Se non la consumi subito, copri e conserva in frigorifero; usa entro 24 ore per mantenere una buona consistenza. Non lasciare a temperatura ambiente per più di 2 ore.'''),
        'notes': 'La maggiore quantità di arancia bilancia il limone. Elimina bene parte bianca e semi per ridurre l’amaro. Per preparare in anticipo, conserva uova cotte, agrumi, salumi e condimento in contenitori separati in frigorifero e unisci al momento di servire. Il vino rimane crudo: per una versione senza alcol sostituiscilo con 15 ml di succo d’arancia. Il calcolo nutrizionale riguarda la versione con vino. Contiene uova; salumi e vino possono contenere altri allergeni o solfiti secondo l’etichetta.',
        'faq': pairs('''Come evito un’insalata amara?|Elimina tutta la parte bianca e i semi. Pesa gli agrumi sbucciati e usa 500 g di arancia per 100 g di limone.
Posso omettere il vino?|Sì. Sostituisci i 15 ml con la stessa quantità di succo d’arancia. Sapore e valori nutrizionali cambiano leggermente; la stima pubblicata include il vino.
Posso usare chorizo fresco?|Questa ricetta usa chorizo stagionato pronto al consumo. Quello fresco richiede una cottura completa diversa e non deve essere servito crudo seguendo questi passaggi.'''),
        'keywords': ['limón serrano', 'insalata di arancia e limone', 'ricetta della Sierra de Francia'],
        'cover_alt': 'Limón serrano con arancia, limone, spicchi d’uovo sodo, prosciutto serrano e chorizo stagionato',
        'nutrition': ['1 di 4 porzioni, circa 245 g', 'I valori USDA verificati per 100 g sono moltiplicati per il peso commestibile degli ingredienti e divisi per 4. Si conteggiano tutto l’olio e il vino; 15 ml di vino sono approssimati a 15 g. Senza sale aggiunto o contorni.', 'Stima, non analisi di laboratorio del piatto. Prosciutto serrano e chorizo stagionato sono approssimati con dati generici di prosciutto salato cotto e salame secco di maiale e manzo. Sodio, grassi ed energia possono variare molto secondo la marca. Controlla le etichette per maggiore precisione.'],
        'proxies': ['Approssimazione con prosciutto salato cotto generico, non una scheda esatta del prosciutto serrano stagionato.', 'Approssimazione con salame secco di maiale e manzo, non una scheda esatta del chorizo stagionato utilizzato.'],
    },
    'ja': {
        'path': '/ja/limon-serrano-salad',
        'title': 'リモン・セラーノ：柑橘と卵、生ハムのサラダ',
        'seo_title': '柑橘と卵のリモン・セラーノ | Manual de Cocina',
        'excerpt': 'オレンジ、レモン、固ゆで卵、生ハム、熟成チョリソーで作るリモン・セラーノ。4人分の分量と、オリーブオイル、にんにく、白ワインのドレッシングを紹介します。',
        'summary': 'リモン・セラーノは、スペインのサラマンカ県シエラ・デ・フランシア地方のサラダです。このレシピでは、オレンジを多め、レモンを少なめに使い、固ゆで卵、生ハム、熟成チョリソーを合わせます。味付けはオリーブオイル、にんにく、白ワインです。分量と手順は独自の提案で、地域によってさまざまな作り方があります。\n\n4人分、1人分は約245 gです。卵を冷ます5分を含め、全体で約40分を見込んでください。チョリソーは必ず、加熱せず食べられると表示された熟成タイプを使います。',
        'meta': ['簡単', '前菜', 'スペイン・サラマンカ', '個', 'サラダ', 'ドレッシング'],
        'ingredients': ['オレンジ（皮を除いた重量）', 'レモン（皮を除いた重量）', '大きめの卵（ゆでて殻を除くと約200 g）', 'そのまま食べられるセラーノ生ハム', '加熱不要の熟成チョリソー', 'エクストラバージンオリーブオイル', '皮をむいたにんにく', '白ワイン'],
        'steps': pairs('''材料を用意する|オレンジとレモンは皮をむく前に洗います。卵4個、生ハム80 g、熟成チョリソー60 g、オイル25 g、皮をむいたにんにく3 g、白ワイン15 mlを用意します。生ハムとチョリソーの表示を確認し、そのまま食べられる製品を使ってください。この手順では生のチョリソーを加熱しません。
卵をゆでて冷ます|卵を小鍋に入れ、卵の上まで約2 cmの高さになるよう冷水を注ぎます。沸騰させ、弱く沸く状態で12分ゆでます。白身と黄身が完全に固まっていることを確認してください。冷水で約5分冷まし、殻をむいて各卵を4等分します。湯を沸かす時間を含め、加熱時間は約15分です。
柑橘をむいて切る|包丁でオレンジとレモンの皮、白い部分を取り除きます。皮を除いたオレンジ500 g、レモン100 gを量ります。約5 mm厚の輪切りか食べやすい大きさに切り、種を除きます。切るときに出た果汁はドレッシング用に器で受けます。
生ハムとチョリソーを切る|生ハム80 gを短い細切り、熟成チョリソー60 gを薄い輪切りにします。ケーシングが食べられない場合は取り除きます。盛り付けるまで冷やしておきます。加工肉に塩分があるので塩は加えません。
ドレッシングを混ぜる|にんにく3 gを細かく刻むかすりおろします。オイル25 g、白ワイン15 ml、取り分けた果汁全量と合わせ、フォークでよく混ぜます。ワインは加熱しないため、アルコールが残ります。
サラダを盛り付ける|オレンジとレモンを広い盛り皿に並べます。生ハムとチョリソーを散らし、ドレッシングをかけ、柑橘を崩さないよう軽く混ぜます。16切れのゆで卵を、黄身が見えるよう上にのせます。
4人分に分けて出す|柑橘と加工肉を均等に分け、1人につき卵1個分になるよう4人分に取り分けます。盛り付けたらすぐに食べてください。すぐ食べない場合は覆って冷蔵し、食感を保つため24時間以内に食べます。室温に2時間以上置かないでください。'''),
        'notes': 'オレンジを多めにしてレモンの酸味を調整しています。苦味を抑えるため白い部分と種をしっかり除きます。前もって準備する場合は、ゆで卵、柑橘、加工肉、ドレッシングを別々の容器で冷蔵し、食べる直前に合わせます。ワインは加熱しません。アルコールを使わない場合はオレンジ果汁15 mlに置き換えてください。栄養値はワインを使う場合の計算です。卵を含みます。加工肉やワインには、製品によってほかのアレルゲンや亜硫酸塩が含まれる場合があるため表示を確認してください。',
        'faq': pairs('''苦くならないようにするには？|白い部分と種をすべて取り除きます。皮をむいた後に量り、オレンジ500 gに対してレモン100 gの割合を守ります。
ワインなしでも作れますか？|はい。白ワイン15 mlを同量のオレンジ果汁に置き換えます。味と栄養値は少し変わります。掲載した推定値にはワインを含みます。
生のチョリソーを使えますか？|このレシピは加熱せず食べられる熟成チョリソー用です。生のチョリソーには別の十分な加熱工程が必要で、この手順のまま生で出してはいけません。'''),
        'keywords': ['リモン・セラーノ', 'オレンジとレモンのサラダ', 'シエラ・デ・フランシアの料理'],
        'cover_alt': 'オレンジ、レモン、4等分した固ゆで卵、セラーノ生ハム、熟成チョリソーのリモン・セラーノ',
        'nutrition': ['全4人分のうち1人分、約245 g', '確認済みUSDAデータの100 g当たりの値に各材料の可食重量を掛け、合計を4人分で割っています。オイルとワインは全量計上し、ワイン15 mlは約15 gとして計算しています。追加の塩や付け合わせは含みません。', '料理そのものを分析した数値ではなく推定値です。生ハムと熟成チョリソーは、一般的な塩漬け加熱ハムと豚肉・牛肉の乾燥サラミのデータで近似しています。特にナトリウム、脂質、エネルギーは製品によって大きく異なります。精度を上げるには製品表示を確認してください。'],
        'proxies': ['一般的な塩漬け加熱ハムによる近似です。乾燥熟成したセラーノ生ハムそのもののデータではありません。', '豚肉・牛肉の乾燥サラミによる近似です。使用する熟成チョリソーそのもののデータではありません。'],
    },
    'pt': {
        'path': '/pt/salada-limon-serrano',
        'title': 'Limón serrano: salada de cítricos, ovo e enchidos',
        'seo_title': 'Limón serrano com cítricos e ovo | Manual de Cocina',
        'excerpt': 'Prepare limón serrano com laranja, limão, ovos cozidos e enchidos curados. Quantidades para 4 porções e molho de azeite, alho e vinho branco.',
        'summary': 'O limón serrano é uma salada da Sierra de Francia, na província espanhola de Salamanca. Esta versão combina laranja, uma quantidade menor de limão, ovos bem cozidos, presunto serrano e chouriço espanhol curado, temperados com azeite, alho e vinho branco. As proporções e o método são uma proposta original; há variantes locais.\n\nRende 4 porções de cerca de 245 g. Conte com aproximadamente 40 minutos no total, incluindo 5 minutos para arrefecer os ovos. Use apenas chouriço curado cujo rótulo indique que está pronto a consumir.',
        'meta': ['Fácil', 'Entrada', 'Salamanca, Espanha', 'unidades', 'Salada', 'Molho'],
        'ingredients': ['laranja, peso depois de descascada', 'limão, peso depois de descascado', 'ovos grandes, cerca de 200 g cozidos sem casca', 'presunto serrano pronto a consumir', 'chouriço espanhol curado pronto a consumir', 'azeite virgem extra', 'alho descascado', 'vinho branco'],
        'steps': pairs('''Reúna os ingredientes|Lave as laranjas e o limão antes de descascar. Prepare 4 ovos, 80 g de presunto serrano, 60 g de chouriço curado, 25 g de azeite, 3 g de alho descascado e 15 ml de vinho. Confirme nos rótulos que ambos os enchidos estão prontos a consumir; esta preparação não cozinha chouriço fresco.
Coza e arrefeça os ovos|Coloque os ovos num tacho e cubra com água fria até cerca de 2 cm acima deles. Leve a ferver e mantenha uma fervura suave durante 12 minutos; a clara e a gema devem ficar firmes. Arrefeça em água fria durante cerca de 5 minutos, descasque e corte cada ovo em quatro. Conte aproximadamente 15 minutos de cozedura, incluindo o aquecimento da água.
Descasque e corte os cítricos|Retire com uma faca a casca e a parte branca das laranjas e do limão. Pese 500 g de laranja e 100 g de limão já descascados. Corte em rodelas ou pedaços de cerca de 5 mm, retire as sementes e recolha o sumo numa tigela para o molho.
Corte os enchidos|Corte os 80 g de presunto serrano em tiras curtas e os 60 g de chouriço curado em rodelas finas. Retire a tripa se não for comestível. Mantenha no frio até montar a salada. Não acrescente sal: os enchidos já fornecem bastante.
Misture o molho|Pique muito finamente ou rale os 3 g de alho. Misture com os 25 g de azeite, os 15 ml de vinho branco e todo o sumo recolhido dos cítricos. Bata com um garfo até unir. O vinho é acrescentado sem cozinhar e conserva álcool.
Monte a salada|Distribua a laranja e o limão numa travessa larga. Junte o presunto e o chouriço, regue com o molho e envolva suavemente sem desfazer os cítricos. Coloque os 16 quartos de ovo por cima, com as gemas visíveis.
Divida e sirva|Divida em 4 porções, repartindo cítricos, enchidos e um ovo por pessoa. Sirva logo depois de montar. Se não consumir de imediato, tape e leve ao frigorífico; use dentro de 24 horas para preservar a textura. Não deixe mais de 2 horas à temperatura ambiente.'''),
        'notes': 'A maior proporção de laranja equilibra o limão. Retire bem a parte branca e as sementes para reduzir o amargo. Para adiantar, conserve ovos cozidos, cítricos, enchidos e molho em recipientes separados no frigorífico e misture ao servir. O vinho fica cru: para uma versão sem álcool, substitua por 15 ml de sumo de laranja. O cálculo nutricional corresponde à versão com vinho. Contém ovo; os enchidos e o vinho podem conter outros alergénios ou sulfitos, conforme os rótulos.',
        'faq': pairs('''Como evito que a salada fique amarga?|Retire completamente a parte branca e as sementes. Pese os cítricos descascados e use 500 g de laranja para 100 g de limão.
Posso preparar sem vinho?|Sim. Substitua os 15 ml pela mesma quantidade de sumo de laranja. O sabor e a nutrição mudam ligeiramente; a estimativa publicada inclui vinho.
Posso usar chouriço fresco?|Esta receita usa chouriço curado pronto a consumir. O chouriço fresco exige uma cozedura completa diferente e não deve ser servido cru seguindo estes passos.'''),
        'keywords': ['limón serrano', 'salada de laranja e limão', 'receita da Sierra de Francia'],
        'cover_alt': 'Limón serrano com laranja, limão, quartos de ovo cozido, presunto serrano e chouriço curado',
        'nutrition': ['1 de 4 porções, aproximadamente 245 g', 'Valores USDA verificados por 100 g multiplicados pelos pesos comestíveis dos ingredientes e divididos por 4. Todo o azeite e vinho entram no cálculo; 15 ml de vinho são aproximados a 15 g. Sem sal acrescentado nem acompanhamentos.', 'Estimativa, não análise laboratorial do prato. Presunto serrano e chouriço curado são aproximados com dados genéricos de presunto curado cozido e salame seco de porco e bovino. Sódio, gordura e energia podem variar muito conforme a marca. Verifique os rótulos para maior precisão.'],
        'proxies': ['Aproximação com presunto curado cozido genérico, não uma ficha exata de presunto serrano seco.', 'Aproximação com salame seco de porco e bovino, não uma ficha exata do chouriço curado utilizado.'],
    },
}

def build():
    assert set(T) == {'en', 'de', 'fr', 'it', 'ja', 'pt'}
    path = ROOT / 'editorial' / f'{SLUG}-20261008.json'
    item = json.loads(path.read_text())
    es = item['records'][0]
    assert es['language'] == 'es' and item['steps_frozen']
    category_source = (ROOT / 'src/lib/categories.ts').read_text()
    block = re.search(r"ensaladas:\s*\{(.*?)\}", category_source, re.S).group(1)
    labels = dict(re.findall(r"(es|de|en|fr|it|ja|pt):\s*'([^']+)'", block))
    records = [es]
    alts = item['image_alts_by_language']
    for lang in ['de', 'en', 'fr', 'it', 'ja', 'pt']:
        t = T[lang]
        r = copy.deepcopy(es)
        r.update(id=str(uuid.uuid5(uuid.UUID(es['recipe_group_id']), lang)), language=lang, slug=t['path'].split('/')[-1], public_path=t['path'], source_url=('https://manualdecocina.com' + t['path'] + '/') if lang in {'en', 'de', 'fr', 'it'} else None, title=t['title'], excerpt=t['excerpt'], summary=t['summary'], notes=t['notes'], difficulty=t['meta'][0], course=t['meta'][1], cuisine=t['meta'][2], category=labels[lang], keywords=t['keywords'])
        assert len(t['ingredients']) == 8 and len(t['steps']) == 7 and len(t['faq']) == 3
        for i, (ingredient, name) in enumerate(zip(r['ingredients'], t['ingredients'])):
            ingredient['name'] = name
            ingredient['group'] = t['meta'][4 if i < 5 else 5]
            if ingredient['unit'] == 'unidades':
                ingredient['unit'] = t['meta'][3]
        for step, (title, content) in zip(r['steps'], t['steps']):
            step.update(title=title, content=content, image_alt=t['title'] + ': ' + title)
        r['seo'].update(title=t['seo_title'], description=t['excerpt'], image_alt=t['cover_alt'], faq=[{'q': q, 'a': a} for q, a in t['faq']])
        r['content_html'] = ''.join('<p>' + html.escape(p) + '</p>' for p in r['summary'].split('\n\n'))
        for key, text in zip(['serving_size', 'method', 'note'], t['nutrition']):
            r['nutrition'][key] = text
        for i, entry in enumerate(r['nutrition']['inputs']):
            entry['ingredient'] = t['ingredients'][i]
            if 'proxy_note' in entry:
                entry['proxy_note'] = t['proxies'][0 if i == 3 else 1]
        alts[lang] = {'title': r['title'], 'cover': t['cover_alt'], 'steps': [s['image_alt'] for s in r['steps']]}
        records.append(r)
    prefix = f'/recetas/{SLUG}/'
    for r in records:
        r['image_url'] = prefix + 'portada.webp'
        r['gallery'] = [{'url': r['image_url'], 'alt': r['seo']['image_alt']}]
        r['seo']['image_variants'] = [prefix + 'portada-' + ratio + '.webp' for ratio in ['1x1', '4x3', '16x9']]
        for i, step in enumerate(r['steps'], 1):
            step['image_url'] = prefix + f'paso-{i:02d}.webp'
    item['records'] = records
    item['state'] = 'COMPLETE_7_LANGUAGES_AND_IMAGES_BATCH_PUBLICATION_PENDING'
    item['publication_blockers'] = ['BATCH_15_COMPLETION_PENDING', 'PREVIEW_QA_PENDING']
    path.write_text(json.dumps(item, ensure_ascii=False, indent=2) + '\n')
    manifest_path = ROOT / 'editorial' / f'{SLUG}-imagenes.json'
    manifest = json.loads(manifest_path.read_text())
    for image in manifest['images']:
        number = None if image['paso'] == 'portada' else image['paso']['numero']
        image['alt_by_language'] = {lang: alt['cover'] if number is None else alt['steps'][number - 1] for lang, alt in alts.items()}
        image['alt_es'] = image['alt_by_language']['es']
    manifest['state'] = 'COMPLETE_LOCALIZED_ALTS_AND_VISUAL_QA'
    manifest_path.write_text(json.dumps(manifest, ensure_ascii=False, indent=2) + '\n')
    print(json.dumps({'records': len(records), 'images': len(manifest['images']), 'state': item['state']}, ensure_ascii=False))

if __name__ == '__main__':
    build()

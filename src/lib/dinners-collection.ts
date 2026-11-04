import type { Collection } from '@/lib/collections-content'

/** Evergreen selection. Total times include preparation and any stated resting time. */
export const DINNERS_COLLECTION: Collection = {
  id: 'cenas-faciles-rapidas',
  coverDir: '/colecciones/cenas-faciles-rapidas',
  sections: [
    ['/pollo-con-salsa-de-miel-y-mostaza', '/salmon-en-air-fryer-saludable', '/ensalada-de-pollo-y-aguacate', '/hamburguesas-caseras', '/receta-trucha-al-ajillo-con-limon', '/camarones-al-ajillo'],
    ['/receta-de-pollo-teriyaki', '/receta-de-wrap-de-pollo-con-champinones', '/es/receta/tacos-de-carne-molida', '/es/receta/chili-con-carne-express', '/receta-arepa-con-todo', '/espaguetis-a-la-carbonara', '/receta-facil-de-pasta-al-pesto-casera', '/es/receta/sloppy-joes', '/receta-de-wrap-de-pollo-con-vegetales'],
    ['/spaghetti-con-salsa-de-champinones-y-ajo', '/garbanzos-cremosos-tomates-secos', '/receta-de-tortilla-de-espinaca', '/arroz-frito', '/tostadas-de-aguacate-y-huevo'],
  ],
  text: {
    es: {
      slug: 'cenas-faciles-y-rapidas',
      title: 'Cenas fáciles y rápidas para todos los días',
      seoTitle: 'Cenas fáciles y rápidas: ideas de 20 a 40 minutos',
      description: '¿Qué hago de cenar hoy? Ideas fáciles de 20 a 40 minutos con pollo, pescado, pasta, huevos y garbanzos. Recetas paso a paso para variar toda la semana.',
      intro: [
        'Llegar a casa con hambre y volver a pensar qué hacer de cenar cansa. Por eso reunimos platos que resuelven una noche entre semana: pollo en sartén, pescado, wraps, pasta y opciones sin carne, con ingredientes que puedes aprovechar en más de una receta.',
        'Empieza por el tiempo que tienes. Las primeras ideas tardan entre 20 y 30 minutos; después vienen platos de 31 a 40 minutos y una selección sin carne. Los tiempos son los totales de cada receta, incluida la preparación. Cocinar una guarnición aparte o hacer más tandas puede alargarlos.',
        'Para organizarte, elige dos o tres bases para la semana: tortillas, pasta, huevos, verduras y una proteína. Los wraps y los tacos ayudan a variar los rellenos; los garbanzos y el arroz frito dan otra salida a la despensa. Abre cada receta para ver cantidades, fotos y pasos, ajustar las raciones y añadir lo que falte a tu lista de compra.',
      ],
      sections: [
        { heading: 'Cuando tienes de 20 a 30 minutos', note: 'Pollo, pescado, ensalada y hamburguesas para las noches con poco tiempo. Acompaña según el hambre y lo que tengas a mano.' },
        { heading: 'Cenas de 31 a 40 minutos para variar', note: 'Wraps, tacos, pasta y platos de sartén u olla. Lee primero los ingredientes: algunas recetas parten de frijoles cocidos o tortillas listas.' },
        { heading: 'Ideas sin carne con pasta, huevos y garbanzos', note: 'Cinco opciones de 25 a 40 minutos. Algunas llevan huevo, lácteos o caldo: revisa cada ficha si necesitas una versión vegetariana o vegana.' },
      ],
      faq: [
        { q: '¿Qué puedo cenar si tengo poco tiempo?', a: 'El salmón en freidora de aire, la trucha al ajillo y los camarones al ajillo tienen un tiempo total de 20 minutos. La ensalada de pollo y aguacate y el pollo con miel y mostaza están en 30 minutos. Elige también en función de lo que ya tengas descongelado y listo para cocinar.' },
        { q: '¿Hay cenas económicas en esta colección?', a: 'El arroz frito con vegetales, las tostadas con huevo y los garbanzos permiten aprovechar ingredientes de despensa. El costo depende de tu mercado y de las cantidades: compara la lista antes de comprar y reutiliza verduras entre varias cenas.' },
        { q: '¿Todas las recetas se hacen sin horno?', a: 'La mayoría se prepara en sartén u olla, pero no todas: el salmón utiliza freidora de aire y la tortilla de espinaca se termina en el horno. Si no tienes esos equipos, elige los wraps, los tacos, los garbanzos o una pasta de sartén.' },
        { q: '¿Cómo organizo varias cenas sin comprar de más?', a: 'Escoge tres recetas con ingredientes compartidos, ajusta sus raciones y añade los faltantes a la lista de compra. Un pimentón, una cebolla o un paquete de tortillas pueden servir para más de una preparación. Separa de la lista lo que ya tengas.' },
        { q: '¿Los tiempos incluyen preparar los ingredientes?', a: 'Sí: usamos el tiempo total indicado en cada receta, no solamente el de cocción. El tamaño de los cortes, el equipo y las tandas cambian el resultado. Las guarniciones que prepares aparte y cocinar ingredientes que la ficha pide ya cocidos requieren tiempo adicional.' },
      ],
    },
    en: {
      slug: 'quick-easy-dinner-recipes',
      title: 'Quick and easy dinners for every day',
      seoTitle: 'Quick and easy dinners: recipes in 20 to 40 minutes',
      description: 'What should I make for dinner? Easy 20 to 40 minute recipes with chicken, fish, pasta, eggs and chickpeas, with step-by-step instructions for busy nights.',
      intro: [
        'Coming home hungry and deciding what to cook again can feel like a chore. These weeknight dinners offer a starting point: skillet chicken, fish, wraps, pasta and meat-free ideas, using ingredients you can share across several meals.',
        'Start with the time you have. The first recipes take 20 to 30 minutes, followed by 31 to 40 minute dishes and a meat-free selection. Times are the full recipe totals, including preparation. Separate sides or extra batches can take longer.',
        'Choose a few basics for the week: tortillas, pasta, eggs, vegetables and a protein. Vary the fillings in wraps and tacos, or use pantry staples for chickpeas and fried rice. Open a recipe for quantities, photos and instructions, adjust the servings and add missing ingredients to your shopping list.',
      ],
      sections: [
        { heading: 'When you have 20 to 30 minutes', note: 'Chicken, fish, salad and burgers for busy evenings. Add a side to suit your appetite and what is available.' },
        { heading: 'Dinner ideas in 31 to 40 minutes', note: 'Wraps, tacos, pasta and one-pan or one-pot dishes. Check the ingredients first: some call for cooked beans or ready-made tortillas.' },
        { heading: 'Meat-free ideas with pasta, eggs and chickpeas', note: 'Five options taking 25 to 40 minutes. Some contain eggs, dairy or stock: check each recipe if you need a vegetarian or vegan meal.' },
      ],
      faq: [
        { q: 'What can I cook when I am short on time?', a: 'Air fryer salmon, garlic trout and garlic shrimp each have a total time of 20 minutes. Chicken and avocado salad and honey mustard chicken take 30 minutes. Choose according to what is already thawed and ready to cook.' },
        { q: 'Are there budget-friendly dinner ideas?', a: 'Vegetable fried rice, egg and avocado toast and chickpeas make use of pantry ingredients. Costs depend on local prices and portions. Check the ingredient lists before shopping and use the same vegetables across several dinners.' },
        { q: 'Can I make every recipe without an oven?', a: 'Most use a skillet or pot, but the salmon needs an air fryer and the spinach omelet finishes in the oven. Choose wraps, tacos, chickpeas or a skillet pasta if you do not have that equipment.' },
        { q: 'How can I plan several dinners without overbuying?', a: 'Pick three recipes with shared ingredients, adjust the servings and add what is missing to your shopping list. A bell pepper, onion or pack of tortillas can work in more than one dish. Remove anything you already have.' },
        { q: 'Do the times include ingredient preparation?', a: 'Yes. We use the total time stated in each recipe rather than cooking time alone. Cutting size, equipment and batches affect timing. Separate sides and cooking ingredients that the recipe lists as already cooked require extra time.' },
      ],
    },
    de: {
      slug: 'schnelle-einfache-abendessen',
      title: 'Schnelle und einfache Abendessen für jeden Tag',
      seoTitle: 'Schnelle Abendessen: einfache Rezepte in 20–40 Minuten',
      description: 'Was koche ich heute Abend? Einfache Rezepte mit Hähnchen, Fisch, Pasta, Eiern und Kichererbsen in 20 bis 40 Minuten, mit Bildern und klaren Anleitungen.',
      intro: [
        'Hungrig nach Hause kommen und schon wieder überlegen, was auf den Tisch soll: Dafür gibt es diese Sammlung. Hähnchen aus der Pfanne, Fisch, Wraps, Pasta und Ideen ohne Fleisch bringen Abwechslung in den Alltag. Viele Zutaten lassen sich für mehrere Gerichte verwenden.',
        'Wähle zuerst nach deiner verfügbaren Zeit. Den Anfang machen Gerichte in 20 bis 30 Minuten, danach folgen Rezepte in 31 bis 40 Minuten und eine Auswahl ohne Fleisch. Gemeint ist jeweils die gesamte Rezeptzeit einschließlich Vorbereitung. Zusätzliche Beilagen und mehrere Bratdurchgänge können länger dauern.',
        'Plane mit wenigen Grundzutaten: Tortillas, Nudeln, Eier, Gemüse und einer Proteinquelle. Wechsle die Füllung bei Wraps und Tacos oder greife für Kichererbsen und Bratreis auf Vorräte zurück. In jedem Rezept findest du Mengen, Bilder und Schritte. Dort kannst du auch die Portionen anpassen und Fehlendes auf die Einkaufsliste setzen.',
      ],
      sections: [
        { heading: 'Wenn du 20 bis 30 Minuten Zeit hast', note: 'Hähnchen, Fisch, Salat und Burger für volle Tage. Ergänze eine Beilage nach Hunger und Vorrat.' },
        { heading: 'Abwechslung in 31 bis 40 Minuten', note: 'Wraps, Tacos, Pasta und Gerichte aus Pfanne oder Topf. Lies zuerst die Zutatenliste: Teilweise werden gegarte Bohnen oder fertige Tortillas benötigt.' },
        { heading: 'Ohne Fleisch: Pasta, Eier und Kichererbsen', note: 'Fünf Ideen in 25 bis 40 Minuten. Manche enthalten Eier, Milchprodukte oder Brühe. Prüfe das Rezept, wenn du vegetarisch oder vegan kochen möchtest.' },
      ],
      faq: [
        { q: 'Was kann ich mit wenig Zeit zum Abendessen kochen?', a: 'Lachs aus der Heißluftfritteuse, Knoblauchforelle und Knoblauchgarnelen benötigen insgesamt jeweils 20 Minuten. Hähnchen-Avocado-Salat und Honig-Senf-Hähnchen dauern 30 Minuten. Entscheide auch danach, was bereits aufgetaut und kochbereit ist.' },
        { q: 'Gibt es preiswerte Abendessen?', a: 'Gemüsebratreis, Ei-Avocado-Toast und Kichererbsen nutzen Zutaten aus dem Vorrat. Die Kosten hängen von Preisen vor Ort und Portionsgrößen ab. Vergleiche die Zutatenlisten und verwende Gemüse in mehreren Gerichten.' },
        { q: 'Gehen alle Rezepte ohne Backofen?', a: 'Die meisten gelingen in Pfanne oder Topf. Der Lachs braucht jedoch eine Heißluftfritteuse, und das Spinatomelett wird im Ofen fertig gegart. Ohne diese Geräte eignen sich Wraps, Tacos, Kichererbsen oder Pfannenpasta.' },
        { q: 'Wie plane ich mehrere Abendessen ohne zu viel einzukaufen?', a: 'Wähle drei Rezepte mit gemeinsamen Zutaten, passe die Portionen an und ergänze Fehlendes auf der Einkaufsliste. Paprika, Zwiebeln oder eine Packung Tortillas lassen sich mehrfach einsetzen. Streiche vorhandene Vorräte von der Liste.' },
        { q: 'Ist die Vorbereitung in den Zeiten enthalten?', a: 'Ja. Wir verwenden die angegebene Gesamtzeit einschließlich Vorbereitung. Schnittgröße, Geräte und Bratdurchgänge können die Dauer verändern. Separate Beilagen und das Garen von bereits gekocht aufgeführten Zutaten brauchen zusätzliche Zeit.' },
      ],
    },
    fr: {
      slug: 'repas-du-soir-faciles-rapides',
      title: 'Des repas du soir faciles et rapides au quotidien',
      seoTitle: 'Repas du soir faciles et rapides en 20 à 40 minutes',
      description: 'Que cuisiner ce soir ? Des recettes faciles en 20 à 40 minutes : poulet, poisson, pâtes, œufs et pois chiches, avec photos et explications pas à pas.',
      intro: [
        'Rentrer avec faim et chercher encore quoi préparer pour le dîner, cela arrive souvent. Cette sélection propose du poulet à la poêle, du poisson, des wraps, des pâtes et des idées sans viande, avec des ingrédients à utiliser dans plusieurs repas.',
        'Commencez par le temps disponible. Les premières recettes prennent de 20 à 30 minutes, puis viennent les plats de 31 à 40 minutes et les idées sans viande. Il s’agit du temps total indiqué, préparation comprise. Un accompagnement séparé ou plusieurs fournées peuvent le prolonger.',
        'Pour la semaine, choisissez quelques bases : tortillas, pâtes, œufs, légumes et une source de protéines. Variez les garnitures des wraps et des tacos, ou misez sur le placard avec les pois chiches et le riz sauté. Chaque fiche donne les quantités, les photos et les étapes. Vous pouvez ajuster les portions et ajouter les ingrédients manquants à votre liste de courses.',
      ],
      sections: [
        { heading: 'Quand vous avez 20 à 30 minutes', note: 'Poulet, poisson, salade et burgers pour les soirs pressés. Complétez selon votre appétit et vos provisions.' },
        { heading: 'Varier les dîners en 31 à 40 minutes', note: 'Wraps, tacos, pâtes et plats à la poêle ou en casserole. Lisez les ingrédients : certaines recettes demandent des haricots déjà cuits ou des tortillas prêtes.' },
        { heading: 'Sans viande : pâtes, œufs et pois chiches', note: 'Cinq idées de 25 à 40 minutes. Certaines contiennent œufs, produits laitiers ou bouillon : vérifiez la fiche pour un repas végétarien ou végétalien.' },
      ],
      faq: [
        { q: 'Que préparer le soir quand on manque de temps ?', a: 'Le saumon à la friteuse à air, la truite à l’ail et les crevettes à l’ail prennent chacun 20 minutes au total. La salade poulet-avocat et le poulet miel-moutarde demandent 30 minutes. Choisissez aussi selon ce qui est déjà décongelé et prêt à cuire.' },
        { q: 'Y a-t-il des idées de dîners économiques ?', a: 'Le riz sauté aux légumes, les tartines aux œufs et à l’avocat ainsi que les pois chiches utilisent des produits du placard. Le coût dépend des prix locaux et des portions. Comparez les listes et utilisez les mêmes légumes dans plusieurs repas.' },
        { q: 'Toutes les recettes se font-elles sans four ?', a: 'La plupart se préparent à la poêle ou en casserole. Le saumon demande une friteuse à air et l’omelette aux épinards termine sa cuisson au four. Sans ces appareils, choisissez les wraps, les tacos, les pois chiches ou les pâtes à la poêle.' },
        { q: 'Comment organiser plusieurs repas sans trop acheter ?', a: 'Choisissez trois recettes aux ingrédients communs, ajustez les portions et ajoutez ce qui manque à la liste de courses. Un poivron, un oignon ou un paquet de tortillas peuvent servir plusieurs fois. Retirez ce que vous avez déjà.' },
        { q: 'Les durées comprennent-elles la préparation ?', a: 'Oui, nous utilisons le temps total de chaque recette, préparation comprise. La taille des morceaux, le matériel et le nombre de fournées peuvent le modifier. Les accompagnements séparés et la cuisson d’ingrédients demandés déjà cuits prennent du temps en plus.' },
      ],
    },
    it: {
      slug: 'cene-facili-veloci',
      title: 'Cene facili e veloci per tutti i giorni',
      seoTitle: 'Cene facili e veloci: ricette da 20 a 40 minuti',
      description: 'Cosa preparo stasera? Ricette facili da 20 a 40 minuti con pollo, pesce, pasta, uova e ceci, con foto e istruzioni passo passo per variare ogni giorno.',
      intro: [
        'Tornare a casa affamati e decidere ancora cosa cucinare può pesare. Qui trovi pollo in padella, pesce, wrap, pasta e idee senza carne per le sere in settimana, con ingredienti che puoi usare in più preparazioni.',
        'Parti dal tempo disponibile. Le prime ricette richiedono da 20 a 30 minuti, poi trovi piatti da 31 a 40 minuti e una scelta senza carne. I tempi sono quelli totali delle ricette, preparazione compresa. Contorni separati o più turni di cottura possono allungarli.',
        'Per organizzarti, scegli poche basi per la settimana: tortillas, pasta, uova, verdure e una fonte proteica. Cambia i ripieni di wrap e tacos, oppure usa la dispensa per ceci e riso saltato. Apri la ricetta per quantità, foto e passaggi, modifica le porzioni e aggiungi gli ingredienti mancanti alla lista della spesa.',
      ],
      sections: [
        { heading: 'Quando hai da 20 a 30 minuti', note: 'Pollo, pesce, insalata e hamburger per le sere più impegnate. Aggiungi un contorno secondo la fame e ciò che hai in casa.' },
        { heading: 'Cene da 31 a 40 minuti per cambiare', note: 'Wrap, tacos, pasta e piatti in padella o in pentola. Leggi prima gli ingredienti: alcune ricette usano fagioli già cotti o tortillas pronte.' },
        { heading: 'Senza carne: pasta, uova e ceci', note: 'Cinque idee da 25 a 40 minuti. Alcune contengono uova, latticini o brodo: controlla la scheda se cerchi un piatto vegetariano o vegano.' },
      ],
      faq: [
        { q: 'Cosa posso preparare per cena se ho poco tempo?', a: 'Salmone in friggitrice ad aria, trota all’aglio e gamberi all’aglio richiedono ciascuno 20 minuti totali. Insalata di pollo e avocado e pollo con miele e senape richiedono 30 minuti. Scegli anche in base a ciò che è già scongelato e pronto da cuocere.' },
        { q: 'Ci sono idee per cene economiche?', a: 'Riso saltato con verdure, toast con uova e avocado e ceci sfruttano ingredienti da dispensa. Il costo dipende dai prezzi locali e dalle porzioni. Confronta le liste prima della spesa e riutilizza le verdure in più piatti.' },
        { q: 'Tutte le ricette si preparano senza forno?', a: 'La maggior parte usa padella o pentola. Il salmone richiede la friggitrice ad aria e la frittata di spinaci termina la cottura in forno. Senza questi apparecchi scegli wrap, tacos, ceci o una pasta in padella.' },
        { q: 'Come organizzo più cene senza comprare troppo?', a: 'Scegli tre ricette con ingredienti comuni, regola le porzioni e aggiungi i mancanti alla lista della spesa. Un peperone, una cipolla o una confezione di tortillas possono servire per più piatti. Togli dalla lista quello che hai già.' },
        { q: 'I tempi comprendono la preparazione degli ingredienti?', a: 'Sì, usiamo il tempo totale indicato nella ricetta, non solo quello di cottura. Taglio degli ingredienti, attrezzatura e turni di cottura possono cambiarlo. Contorni separati e ingredienti da cuocere quando la ricetta li richiede già cotti necessitano di tempo aggiuntivo.' },
      ],
    },
    pt: {
      slug: 'jantares-faceis-rapidos',
      title: 'Jantares fáceis e rápidos para todos os dias',
      seoTitle: 'Jantares fáceis e rápidos: receitas de 20 a 40 minutos',
      description: 'O que fazer para o jantar? Receitas fáceis de 20 a 40 minutos com frango, peixe, massa, ovos e grão-de-bico, com fotos e passo a passo para variar na semana.',
      intro: [
        'Chegar em casa com fome e ainda decidir o jantar cansa. Esta seleção reúne frango na frigideira, peixe, wraps, massas e ideias sem carne para as noites da semana, com ingredientes que podem entrar em mais de uma receita.',
        'Comece pelo tempo disponível. Primeiro estão as receitas de 20 a 30 minutos; depois vêm pratos de 31 a 40 minutos e uma seleção sem carne. Usamos o tempo total de cada receita, incluindo o preparo. Acompanhamentos separados ou mais levas podem aumentar esse tempo.',
        'Para se organizar, escolha algumas bases para a semana: tortilhas, massa, ovos, legumes e uma fonte de proteína. Varie os recheios dos wraps e tacos ou aproveite a despensa com grão-de-bico e arroz frito. Abra cada receita para ver quantidades, fotos e etapas, ajustar as porções e adicionar o que falta à lista de compras.',
      ],
      sections: [
        { heading: 'Quando você tem de 20 a 30 minutos', note: 'Frango, peixe, salada e hambúrgueres para as noites corridas. Complete conforme a fome e o que tiver em casa.' },
        { heading: 'Jantares de 31 a 40 minutos para variar', note: 'Wraps, tacos, massas e pratos de frigideira ou panela. Leia os ingredientes antes: algumas receitas usam feijão cozido ou tortilhas prontas.' },
        { heading: 'Sem carne: massas, ovos e grão-de-bico', note: 'Cinco opções de 25 a 40 minutos. Algumas levam ovos, laticínios ou caldo: confira a receita se precisar de uma versão vegetariana ou vegana.' },
      ],
      faq: [
        { q: 'O que posso preparar para o jantar com pouco tempo?', a: 'Salmão na air fryer, truta ao alho e camarão ao alho levam 20 minutos no total cada um. Salada de frango com abacate e frango com mel e mostarda ficam em 30 minutos. Escolha também pelo que já estiver descongelado e pronto para cozinhar.' },
        { q: 'Há ideias de jantares econômicos?', a: 'Arroz frito com legumes, torradas com ovo e abacate e grão-de-bico aproveitam ingredientes de despensa. O custo depende dos preços locais e das porções. Compare as listas antes de comprar e use os mesmos legumes em vários pratos.' },
        { q: 'Todas as receitas são feitas sem forno?', a: 'A maioria usa frigideira ou panela. O salmão precisa de air fryer e a omelete de espinafre termina no forno. Sem esses equipamentos, escolha wraps, tacos, grão-de-bico ou uma massa de frigideira.' },
        { q: 'Como organizo vários jantares sem comprar demais?', a: 'Escolha três receitas com ingredientes em comum, ajuste as porções e coloque os faltantes na lista de compras. Um pimentão, uma cebola ou um pacote de tortilhas podem render mais de uma preparação. Retire o que você já tem.' },
        { q: 'Os tempos incluem o preparo dos ingredientes?', a: 'Sim. Usamos o tempo total indicado na receita, não apenas o de cozimento. O corte, os equipamentos e o número de levas podem alterar a duração. Acompanhamentos separados e cozinhar ingredientes pedidos já cozidos exigem tempo extra.' },
      ],
    },
    ja: {
      slug: '簡単時短夕食レシピ',
      title: '毎日に役立つ、簡単で手早い夕食レシピ',
      seoTitle: '簡単夕食レシピ｜20〜40分で作る晩ごはんのアイデア',
      description: '今日の晩ごはんに迷ったら。鶏肉、魚、パスタ、卵、ひよこ豆を使い、下ごしらえを含め20〜40分で作れる夕食を紹介。写真付きの手順、分量調整、買い物リストも活用して、平日の献立を考えましょう。',
      intro: [
        'おなかをすかせて帰宅してから、また夕食を考えるのは大変です。この特集では、フライパンで作る鶏肉料理、魚、ラップサンド、パスタ、肉を使わない料理を集めました。いくつかの献立で材料を共用できるのも便利なところです。',
        'まずは使える時間から選んでみてください。20〜30分の料理、31〜40分の料理、肉を使わない料理の順に紹介しています。表示は下ごしらえを含む各レシピの合計時間です。別に付け合わせを作る場合や、何回かに分けて加熱する場合は時間が延びます。',
        '一週間の基本に、トルティーヤ、パスタ、卵、野菜、たんぱく源をいくつか選ぶと献立を組みやすくなります。ラップサンドやタコスは具を変え、ひよこ豆やチャーハンには常備食材を活用できます。各レシピで分量、写真、手順を確認し、人数を調整して足りない材料を買い物リストに追加してください。',
      ],
      sections: [
        { heading: '20〜30分で作れる夕食', note: '忙しい夜に便利な鶏肉、魚、サラダ、ハンバーガー。食欲や手元の材料に合わせて付け合わせを選びましょう。' },
        { heading: '31〜40分で、いつもと違う晩ごはん', note: 'ラップサンド、タコス、パスタ、フライパンや鍋で作る料理。加熱済みの豆や市販のトルティーヤを使うレシピもあるので、材料を先に確認してください。' },
        { heading: '肉を使わない、パスタ・卵・ひよこ豆の料理', note: '25〜40分で作れる5品。卵、乳製品、スープを使うものもあります。ベジタリアンやヴィーガン向けにする場合は、各レシピの材料を確認してください。' },
      ],
      faq: [
        { q: '時間がない日の夕食は何がおすすめですか？', a: 'エアフライヤーのサーモン、にんにく風味のマス、えびのにんにく炒めは、それぞれ合計20分です。鶏肉とアボカドのサラダ、ハニーマスタードチキンは30分。解凍が済んでいるか、すぐ調理できる材料があるかも考えて選びましょう。' },
        { q: '節約に役立つ料理はありますか？', a: '野菜チャーハン、卵とアボカドのトースト、ひよこ豆の料理は、常備食材を活用できます。費用は地域の価格と分量によって変わります。買い物前に材料を比べ、野菜を複数の献立で使うと無駄を減らせます。' },
        { q: 'すべてオーブンなしで作れますか？', a: '多くはフライパンか鍋で作れますが、サーモンにはエアフライヤー、ほうれん草のオムレツの仕上げにはオーブンを使います。機器がない場合はラップサンド、タコス、ひよこ豆、フライパンで作るパスタを選んでください。' },
        { q: '買いすぎずに数日分の夕食を考えるには？', a: '共通する材料があるレシピを3つ選び、人数分に調整して足りないものを買い物リストへ追加します。パプリカ、玉ねぎ、トルティーヤなどは複数の料理に使えます。家にあるものはリストから外しましょう。' },
        { q: '調理時間に下ごしらえも含まれていますか？', a: 'はい。加熱時間だけでなく、各レシピに記載された合計時間を使っています。切る大きさ、機器、加熱回数で所要時間は変わります。別の付け合わせや、加熱済みとして記載された材料を一から調理する時間は追加になります。' },
      ],
    },
  },
}

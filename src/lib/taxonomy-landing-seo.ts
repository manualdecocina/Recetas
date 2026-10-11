import type { RecipeLanguage } from '@/types/recipe'

/** Localized taxonomy text. Counts are supplied by the live published recipe query. */
type Template = { title: string; description: string; intro: string; heading: string }
type LandingKind = 'category' | 'ingredient'
const TEMPLATES: Record<RecipeLanguage, Record<LandingKind, Template>> = {
  "es": {
    "category": {
      "title": "Recetas de {subject}: {count} ideas paso a paso",
      "description": "{count} recetas de {subject} con ingredientes pesados, tiempos y pasos claros. Encuentra opciones para cocinar en casa.",
      "heading": "Explora {count} recetas de {subject}",
      "intro": "En esta sección reunimos {count} recetas de {subject} disponibles en Manual de Cocina. Puedes revisar distintas preparaciones antes de elegir qué cocinar y comparar sus ingredientes, cantidades, porciones y tiempos estimados. Cada receta presenta las instrucciones en orden para ayudarte a organizar el trabajo en la cocina, desde la preparación inicial hasta el momento de servir. Algunas elaboraciones requieren horno, sartén, refrigeración o tiempo de reposo; comprueba esos detalles antes de empezar y reúne los utensilios necesarios. Si necesitas adaptar una porción, revisa primero las cantidades indicadas y los consejos de conservación. Las fotografías sirven como referencia visual cuando están disponibles, pero el resultado puede variar según los productos y el equipo que utilices. Explora las opciones y abre la receta que mejor se ajuste a tu tiempo y a los ingredientes que tengas."
    },
    "ingredient": {
      "title": "Recetas con {subject}: {count} ideas",
      "description": "{count} recetas que usan {subject}, con ingredientes, cantidades y pasos claros. Descubre distintas formas de prepararlas.",
      "heading": "{count} recetas que incluyen {subject}",
      "intro": "Aquí encontrarás {count} recetas publicadas que incluyen {subject} entre sus ingredientes registrados. La selección te ayuda a descubrir en qué preparaciones se utiliza y a comparar ideas sin tener que revisar todo el recetario. Abre cualquier receta para consultar la cantidad indicada, el resto de ingredientes, las porciones y el tiempo de preparación. Comprueba también si se usa al principio, durante la cocción o al servir: su función puede cambiar según el plato. Antes de sustituirlo u omitirlo, considera cómo afectaría al sabor, la textura y el resultado final. Las imágenes muestran las recetas, mientras que la lista de ingredientes de cada página es la referencia para cocinar. Puedes empezar por una preparación sencilla y seguir explorando otras opciones con este mismo ingrediente."
    }
  },
  "en": {
    "category": {
      "title": "{label} recipes: {count} step-by-step ideas",
      "description": "Discover {count} {subject} recipes with ingredient quantities, cooking times and clear instructions for home cooking.",
      "heading": "Explore {count} {subject} recipes",
      "intro": "Explore {count} published recipes in the {subject} collection at Manual de Cocina. This page brings together different preparations so you can compare ingredients, serving sizes and estimated times before choosing what to cook. Open a recipe to see the full list of ingredients and follow the preparation in order, from the first task through to serving. Some dishes need oven time, stovetop cooking, chilling or resting, so read the whole method before you start and prepare the equipment you will need. If you plan to change the number of servings, check the measurements carefully and review any storage advice. Photographs are provided as a visual reference where available, although results can vary with ingredients and kitchen equipment. Browse the collection to find an idea that suits the time and food you have."
    },
    "ingredient": {
      "title": "Recipes with {subject}: {count} ideas",
      "description": "Browse {count} recipes using {subject}, with ingredient amounts, cooking steps and practical preparation details.",
      "heading": "{count} recipes using {subject}",
      "intro": "Find {count} published recipes that list {subject} among their ingredients. This collection is designed to help you discover different ways to use the same ingredient without searching the entire recipe archive. Open each recipe to check the quantity required, the other ingredients, the number of servings and the estimated preparation time. Look at when the ingredient is added, too: its role may change depending on the recipe, cooking method and final texture. Before leaving it out or replacing it, consider how that choice could affect flavour and consistency. The photographs illustrate completed dishes where available, but the ingredient list and cooking instructions are the best reference when preparing a meal. Compare a few ideas and choose the one that fits your kitchen and schedule."
    }
  },
  "de": {
    "category": {
      "title": "{label}: {count} Rezepte Schritt für Schritt",
      "description": "Entdecke {count} Rezepte für {label} mit genauen Zutatenmengen, Zubereitungszeiten und verständlichen Anleitungen.",
      "heading": "{count} Rezepte für {label} entdecken",
      "intro": "In dieser Sammlung findest du {count} veröffentlichte Rezepte aus der Kategorie {label} bei Manual de Cocina. Vergleiche verschiedene Gerichte, bevor du dich entscheidest, und prüfe Zutatenmengen, Portionen sowie die geschätzte Zubereitungszeit. Jede Rezeptseite erklärt die einzelnen Arbeitsschritte in der richtigen Reihenfolge, von den ersten Vorbereitungen bis zum Servieren. Manche Gerichte benötigen einen Backofen, eine Pfanne, Kühlzeit oder eine Ruhephase. Lies deshalb die gesamte Anleitung und stelle die benötigten Küchengeräte bereit, bevor du beginnst. Wenn du die Portionszahl ändern möchtest, passe die Mengen sorgfältig an und beachte Hinweise zur Aufbewahrung. Fotos helfen bei der Orientierung, sofern sie vorhanden sind; das Ergebnis kann sich je nach Zutaten und Ausstattung unterscheiden. Entdecke ein Rezept, das zu deiner verfügbaren Zeit und deinen Vorräten passt."
    },
    "ingredient": {
      "title": "Rezepte mit {label}: {count} Ideen",
      "description": "Entdecke {count} Rezepte mit {label}, Zutatenmengen, Zubereitungszeiten und verständlichen Arbeitsschritten.",
      "heading": "{count} Rezepte mit {label}",
      "intro": "Hier findest du {count} veröffentlichte Rezepte, in deren Zutatenliste {label} vorkommt. Die Übersicht zeigt dir unterschiedliche Verwendungsmöglichkeiten, ohne dass du das gesamte Rezeptarchiv durchsuchen musst. Öffne ein Rezept, um die benötigte Menge, weitere Zutaten, Portionen und die geschätzte Zubereitungszeit zu prüfen. Achte auch darauf, wann die Zutat hinzugefügt wird: Beim Vorbereiten, während des Garens oder erst beim Servieren kann sie eine unterschiedliche Rolle spielen. Wenn du etwas ersetzen oder weglassen möchtest, überlege zuerst, wie sich das auf Geschmack, Konsistenz und das fertige Gericht auswirkt. Fotos zeigen die Gerichte, sofern verfügbar; maßgeblich für die Zubereitung sind jedoch immer die Zutatenliste und die einzelnen Arbeitsschritte. Vergleiche mehrere Rezepte und wähle eine Idee, die zu deinem Zeitplan und deiner Küche passt."
    }
  },
  "fr": {
    "category": {
      "title": "{label} : {count} recettes pas à pas",
      "description": "Découvrez {count} recettes de {subject}, avec quantités, temps de préparation et étapes détaillées pour cuisiner chez soi.",
      "heading": "Découvrir {count} recettes de {subject}",
      "intro": "Cette sélection réunit {count} recettes publiées dans la catégorie {label} de Manual de Cocina. Parcourez plusieurs préparations avant de choisir et comparez les ingrédients, les quantités, les portions et les durées indiquées. Chaque fiche présente les étapes dans leur ordre de réalisation, depuis la mise en place jusqu'au service. Certaines recettes demandent une cuisson au four, à la poêle, un passage au froid ou un temps de repos. Lisez donc la méthode complète et préparez le matériel nécessaire avant de commencer. Pour adapter le nombre de portions, vérifiez soigneusement les proportions et les conseils de conservation. Les photographies fournissent des repères visuels lorsqu'elles sont disponibles, mais le résultat dépend aussi des produits et de votre équipement. Explorez cette catégorie pour trouver une idée adaptée à votre temps et aux ingrédients dont vous disposez."
    },
    "ingredient": {
      "title": "Recettes avec {subject} : {count} idées",
      "description": "Découvrez {count} recettes utilisant {subject}, avec quantités, temps et préparation expliquée étape par étape.",
      "heading": "{count} recettes avec {subject}",
      "intro": "Retrouvez ici {count} recettes publiées qui indiquent {subject} dans leur liste d'ingrédients. Cette sélection permet de découvrir différentes utilisations d'un même produit sans parcourir tout le catalogue. Ouvrez une recette pour connaître la quantité demandée, les autres ingrédients, les portions et le temps de préparation estimé. Vérifiez également à quel moment cet ingrédient intervient : pendant la préparation, à la cuisson ou au service, son rôle peut varier. Avant de le remplacer ou de le supprimer, réfléchissez aux conséquences possibles sur le goût, la texture et le résultat. Les photos présentent les plats lorsqu'elles sont disponibles, mais les listes d'ingrédients et les instructions restent la référence pour cuisiner. Comparez plusieurs idées et choisissez une préparation adaptée à votre cuisine et au temps dont vous disposez."
    }
  },
  "it": {
    "category": {
      "title": "{label}: {count} ricette passo passo",
      "description": "Scopri {count} ricette di {subject}, con dosi degli ingredienti, tempi e istruzioni chiare per cucinare a casa.",
      "heading": "Scopri {count} ricette di {subject}",
      "intro": "In questa raccolta trovi {count} ricette pubblicate nella categoria {label} di Manual de Cocina. Sfoglia le proposte e confronta ingredienti, quantità, porzioni e tempi stimati prima di decidere cosa cucinare. Ogni ricetta presenta la preparazione in ordine, dai primi passaggi fino al momento di servire. Alcune preparazioni richiedono il forno, la cottura in padella, la refrigerazione oppure un periodo di riposo. Leggi quindi tutto il procedimento e prepara gli utensili necessari prima di iniziare. Se vuoi modificare il numero delle porzioni, controlla con attenzione le dosi e gli eventuali consigli sulla conservazione. Le fotografie sono un riferimento visivo quando disponibili, ma il risultato può cambiare a seconda degli ingredienti e dell'attrezzatura. Esplora la raccolta e scegli una ricetta compatibile con il tempo e i prodotti che hai in cucina."
    },
    "ingredient": {
      "title": "Ricette con {subject}: {count} idee",
      "description": "Esplora {count} ricette che usano {subject}, con dosi, tempi e passaggi chiari per cucinare a casa.",
      "heading": "{count} ricette con {subject}",
      "intro": "Qui puoi trovare {count} ricette pubblicate che includono {subject} tra gli ingredienti. La raccolta ti aiuta a scoprire utilizzi diversi dello stesso prodotto senza dover cercare nell'intero ricettario. Apri ogni ricetta per verificare la quantità prevista, gli altri ingredienti, il numero di porzioni e il tempo stimato. Osserva anche quando viene aggiunto: durante la preparazione, in cottura o al momento di servire può avere funzioni differenti. Prima di sostituirlo o eliminarlo, valuta come cambierebbero gusto, consistenza e risultato finale. Le fotografie mostrano le preparazioni quando disponibili, mentre la lista degli ingredienti e le istruzioni sono il riferimento per cucinare. Confronta alcune proposte e scegli quella più adatta al tempo e agli strumenti che hai a disposizione."
    }
  },
  "pt": {
    "category": {
      "title": "{label}: {count} receitas passo a passo",
      "description": "Conheça {count} receitas de {subject} com quantidades, tempos e instruções claras para preparar em casa.",
      "heading": "Explore {count} receitas de {subject}",
      "intro": "Nesta seleção você encontra {count} receitas publicadas na categoria {label} do Manual de Cocina. Veja diferentes preparações e compare ingredientes, quantidades, porções e tempos estimados antes de decidir o que fazer. Cada receita apresenta o modo de preparo em sequência, desde a organização inicial até a hora de servir. Algumas opções precisam de forno, fogão, refrigeração ou tempo de descanso; por isso, leia as etapas com antecedência e separe os utensílios necessários. Se quiser alterar o número de porções, confira as medidas e as orientações de armazenamento. As fotografias ajudam a visualizar o preparo quando estão disponíveis, mas o resultado pode variar conforme os produtos e os equipamentos utilizados. Explore a categoria e escolha uma ideia que combine com seu tempo e com os ingredientes que você tem em casa."
    },
    "ingredient": {
      "title": "Receitas com {subject}: {count} ideias",
      "description": "Encontre {count} receitas com {subject}, quantidades de ingredientes e preparo explicado passo a passo.",
      "heading": "{count} receitas com {subject}",
      "intro": "Aqui estão {count} receitas publicadas que incluem {subject} entre os ingredientes registrados. A seleção ajuda você a descobrir diferentes maneiras de aproveitar o mesmo ingrediente sem procurar em todo o catálogo. Abra cada receita para conferir a quantidade indicada, os outros ingredientes, as porções e o tempo estimado de preparo. Observe também quando ele entra na receita: no início, durante o cozimento ou na finalização, sua função pode mudar. Antes de substituir ou retirar o ingrediente, considere como essa mudança afetaria o sabor, a textura e o resultado. As fotos ilustram os pratos quando disponíveis, mas a lista de ingredientes e as etapas são a principal referência para cozinhar. Compare algumas opções e escolha a que combina melhor com os utensílios e o tempo que você tem."
    }
  },
  "ja": {
    "category": {
      "title": "{label}のレシピ{count}品｜作り方と材料",
      "description": "{label}の公開レシピ{count}品を紹介。材料の分量、調理時間、手順を確認して、家庭で作りやすい料理を探せます。",
      "heading": "{label}のレシピ{count}品を探す",
      "intro": "Manual de Cocinaの「{label}」カテゴリには、公開中のレシピが{count}品あります。この一覧では、作りたい料理を選ぶ前に材料、分量、人数分、調理時間を比較できます。各レシピのページには準備から盛り付けまでの工程が順番に記載されているため、作業の流れを確認しながら調理を進められます。オーブンやフライパンを使う料理、冷蔵や休ませる時間が必要な料理もあるので、始める前に説明を最後まで読み、調理器具を用意しましょう。人数に合わせて作る場合は、材料の量や保存方法も確かめてください。写真が掲載されている場合は仕上がりの参考になりますが、使用する食材や器具によって結果は変わります。時間や手元の材料に合うレシピを探してみてください。"
    },
    "ingredient": {
      "title": "{label}を使うレシピ{count}品｜簡単に探す",
      "description": "{label}を材料に使う公開レシピ{count}品。必要な分量、ほかの材料、調理時間、作り方を比較できます。",
      "heading": "{label}を使うレシピ{count}品",
      "intro": "ここでは、材料一覧に「{label}」が登録されている公開レシピ{count}品を紹介しています。同じ食材を使った料理をまとめて探せるので、レシピ全体を検索しなくても使い方の違いを比較できます。各料理のページでは、必要な分量、組み合わせる材料、何人分か、目安となる調理時間を確認できます。また、食材を下ごしらえで使うのか、加熱中に加えるのか、仕上げに使うのかにも注目してください。役割が異なるため、別の食材に置き換えたり省いたりすると味や食感が変わることがあります。完成写真があれば見た目の参考にできますが、調理するときは材料一覧と各工程を確認することが大切です。時間や調理器具に合った一品を選んでみましょう。"
    }
  }
}

export function taxonomyLanding(kind: LandingKind, lang: RecipeLanguage, label: string, count: number): Template {
  const template = TEMPLATES[lang][kind]
  const subject = ['es', 'fr', 'it', 'pt'].includes(lang) ? label.toLocaleLowerCase(lang) : label
  const fill = (value: string) => value.replaceAll('{count}', String(count)).replaceAll('{label}', label).replaceAll('{subject}', subject)
  return { title: fill(template.title), description: fill(template.description), intro: fill(template.intro), heading: fill(template.heading) }
}

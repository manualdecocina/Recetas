import type { RecipeLanguage } from '@/types/recipe'

/** Localized taxonomy text. Counts are supplied by the live published recipe query. */
type Template = { title: string; description: string; intro: string; heading: string }
type LandingKind = 'category' | 'ingredient'
const TEMPLATES: Record<RecipeLanguage, Record<LandingKind, Template>> = {
  "es": {
    "category": {
      "title": "Recetas de {subject}: {count} ideas",
      "description": "{count} recetas de {subject} con cantidades de ingredientes, tiempos y pasos claros. Encuentra opciones para cocinar en casa.",
      "heading": "Explora {count} recetas de {subject}",
      "intro": "Encuentra {count} recetas de {subject} y compara sus ingredientes, porciones y tiempos. Elige una preparación para consultar el método completo antes de empezar."
    },
    "ingredient": {
      "title": "Recetas con {subject}: {count} ideas",
      "description": "{count} recetas que usan {subject}, con ingredientes, cantidades y pasos claros. Descubre distintas formas de prepararlas.",
      "heading": "{count} recetas que incluyen {subject}",
      "intro": "Consulta {count} recetas que usan {subject}. En cada ficha puedes comprobar la cantidad, el resto de ingredientes y el momento de incorporarlo a la preparación."
    }
  },
  "en": {
    "category": {
      "title": "{label} recipes: {count} ideas",
      "description": "Discover {count} {subject} recipes with ingredient quantities, cooking times and clear instructions for home cooking.",
      "heading": "Explore {count} {subject} recipes",
      "intro": "Browse {count} {subject} recipes and compare ingredients, serving sizes and cooking times. Open a recipe to read the full method before you start."
    },
    "ingredient": {
      "title": "Recipes with {subject}: {count} ideas",
      "description": "Browse {count} recipes using {subject}, with ingredient amounts, cooking steps and practical preparation details.",
      "heading": "{count} recipes using {subject}",
      "intro": "Explore {count} recipes using {subject}. Each recipe lists the amount needed, the other ingredients and when to add it during preparation."
    }
  },
  "de": {
    "category": {
      "title": "{label}: {count} Rezepte",
      "description": "Entdecke {count} Rezepte für {label} mit genauen Zutatenmengen, Zubereitungszeiten und verständlichen Anleitungen.",
      "heading": "{count} Rezepte für {label} entdecken",
      "intro": "Entdecke {count} Rezepte für {label} und vergleiche Zutaten, Portionen und Zubereitungszeiten. Lies die vollständige Anleitung des gewählten Gerichts, bevor du beginnst."
    },
    "ingredient": {
      "title": "Rezepte mit {label}: {count} Ideen",
      "description": "Entdecke {count} Rezepte mit {label}, Zutatenmengen, Zubereitungszeiten und verständlichen Arbeitsschritten.",
      "heading": "{count} Rezepte mit {label}",
      "intro": "Entdecke {count} Rezepte mit {label}. In jedem Rezept findest du die benötigte Menge, die weiteren Zutaten und den passenden Zeitpunkt zum Hinzufügen."
    }
  },
  "fr": {
    "category": {
      "title": "{label} : {count} recettes pas à pas",
      "description": "Découvrez {count} recettes de {subject}, avec quantités, temps de préparation et étapes détaillées pour cuisiner chez soi.",
      "heading": "Découvrir {count} recettes de {subject}",
      "intro": "Découvrez {count} recettes de {subject} et comparez ingrédients, portions et temps de préparation. Ouvrez une fiche pour lire la méthode complète avant de commencer."
    },
    "ingredient": {
      "title": "Recettes avec {subject} : {count} idées",
      "description": "Découvrez {count} recettes utilisant {subject}, avec quantités, temps et préparation expliquée étape par étape.",
      "heading": "{count} recettes avec {subject}",
      "intro": "Explorez {count} recettes avec {subject}. Chaque fiche précise la quantité nécessaire, les autres ingrédients et le moment où ajouter cet ingrédient."
    }
  },
  "it": {
    "category": {
      "title": "{label}: {count} ricette passo passo",
      "description": "Scopri {count} ricette di {subject}, con dosi degli ingredienti, tempi e istruzioni chiare per cucinare a casa.",
      "heading": "Scopri {count} ricette di {subject}",
      "intro": "Scopri {count} ricette di {subject} e confronta ingredienti, porzioni e tempi. Apri la preparazione scelta per leggere il procedimento completo prima di cominciare."
    },
    "ingredient": {
      "title": "Ricette con {subject}: {count} idee",
      "description": "Esplora {count} ricette che usano {subject}, con dosi, tempi e passaggi chiari per cucinare a casa.",
      "heading": "{count} ricette con {subject}",
      "intro": "Esplora {count} ricette con {subject}. Ogni ricetta indica la dose necessaria, gli altri ingredienti e quando aggiungere questo ingrediente."
    }
  },
  "pt": {
    "category": {
      "title": "{label}: {count} receitas passo a passo",
      "description": "Conheça {count} receitas de {subject} com quantidades, tempos e instruções claras para preparar em casa.",
      "heading": "Explore {count} receitas de {subject}",
      "intro": "Conheça {count} receitas de {subject} e compare ingredientes, porções e tempos de preparo. Abra a receita escolhida e leia o modo de preparo antes de começar."
    },
    "ingredient": {
      "title": "Receitas com {subject}: {count} ideias",
      "description": "Encontre {count} receitas com {subject}, quantidades de ingredientes e preparo explicado passo a passo.",
      "heading": "{count} receitas com {subject}",
      "intro": "Explore {count} receitas com {subject}. Cada receita informa a quantidade necessária, os outros ingredientes e o momento de acrescentar esse ingrediente."
    }
  },
  "ja": {
    "category": {
      "title": "{label}のレシピ{count}品｜作り方と材料",
      "description": "{label}の公開レシピ{count}品を紹介。材料の分量、調理時間、手順を確認して、家庭で作りやすい料理を探せます。",
      "heading": "{label}のレシピ{count}品を探す",
      "intro": "公開中の「{label}」のレシピ{count}品を紹介します。材料、人数分、調理時間を比較し、作りたい料理のページで準備から盛り付けまでの手順を確認してください。"
    },
    "ingredient": {
      "title": "{label}を使うレシピ{count}品｜簡単に探す",
      "description": "{label}を材料に使う公開レシピ{count}品。必要な分量、ほかの材料、調理時間、作り方を比較できます。",
      "heading": "{label}を使うレシピ{count}品",
      "intro": "「{label}」を使う公開レシピ{count}品です。各ページで必要な分量、組み合わせる材料、下ごしらえ・加熱・仕上げのどの段階で使うかを確認できます。"
    }
  }
}

export function taxonomyLanding(kind: LandingKind, lang: RecipeLanguage, label: string, count: number): Template {
  const template = TEMPLATES[lang][kind]
  const subject = ['es', 'fr', 'it', 'pt'].includes(lang) ? label.toLocaleLowerCase(lang) : label
  const singular: Partial<Record<RecipeLanguage, Array<[string, string]>>> = {
    es: [['recetas', 'receta'], ['ideas', 'idea'], ['incluyen', 'incluye'], ['usan', 'usa']],
    en: [['recipes', 'recipe'], ['ideas', 'idea']],
    de: [['Rezepte', 'Rezept'], ['Ideen', 'Idee']],
    fr: [['recettes', 'recette'], ['idées', 'idée']],
    it: [['ricette', 'ricetta'], ['idee', 'idea']],
    pt: [['receitas', 'receita'], ['ideias', 'ideia']],
  }
  const fill = (value: string) => {
    // Apply agreement to the template before inserting an authored subject label.
    let text = value
    if (count === 1) for (const [plural, one] of singular[lang] ?? []) text = text.replaceAll(plural, one)
    return text.replaceAll('{count}', String(count)).replaceAll('{label}', label).replaceAll('{subject}', subject)
  }
  return { title: fill(template.title), description: fill(template.description), intro: fill(template.intro), heading: fill(template.heading) }
}

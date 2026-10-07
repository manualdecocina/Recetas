// Concordancia de número para los contadores automáticos ("1 receta", "2 recetas").
// Singular solo para exactamente 1 (convención editorial común a los 7 idiomas:
// "0 recetas", "1 receta"); el japonés no distingue singular y plural.
type CountKind = 'recipe' | 'vote' | 'missingIngredient'
type Forms = { one: string; other: string }

const FORMS: Record<string, Record<CountKind, Forms>> = {
  es: {
    recipe: { one: 'receta', other: 'recetas' },
    vote: { one: 'voto', other: 'votos' },
    missingIngredient: { one: 'ingrediente por conseguir', other: 'ingredientes por conseguir' },
  },
  en: {
    recipe: { one: 'recipe', other: 'recipes' },
    vote: { one: 'vote', other: 'votes' },
    missingIngredient: { one: 'ingredient to get', other: 'ingredients to get' },
  },
  de: {
    recipe: { one: 'Rezept', other: 'Rezepte' },
    vote: { one: 'Bewertung', other: 'Bewertungen' },
    missingIngredient: { one: 'fehlende Zutat', other: 'fehlende Zutaten' },
  },
  fr: {
    recipe: { one: 'recette', other: 'recettes' },
    vote: { one: 'vote', other: 'votes' },
    missingIngredient: { one: 'ingrédient manquant', other: 'ingrédients manquants' },
  },
  it: {
    recipe: { one: 'ricetta', other: 'ricette' },
    vote: { one: 'voto', other: 'voti' },
    missingIngredient: { one: 'ingrediente mancante', other: 'ingredienti mancanti' },
  },
  pt: {
    recipe: { one: 'receita', other: 'receitas' },
    vote: { one: 'voto', other: 'votos' },
    missingIngredient: { one: 'ingrediente para conseguir', other: 'ingredientes para conseguir' },
  },
  ja: {
    recipe: { one: '件のレシピ', other: '件のレシピ' },
    vote: { one: '件の評価', other: '件の評価' },
    missingIngredient: { one: '個の材料が不足', other: '個の材料が不足' },
  },
}

/** "1 receta", "0 recetas", "12 recetas"… en el idioma indicado. */
export function countLabel(lang: string, count: number, kind: CountKind): string {
  const forms = (FORMS[lang] ?? FORMS.es)[kind]
  const word = count === 1 ? forms.one : forms.other
  // Japonés: el contador va pegado al número ("3件のレシピ").
  return lang === 'ja' ? `${count}${word}` : `${count} ${word}`
}

// Concordancia de número para los contadores automáticos ("1 receta", "2 recetas").
// Singular solo para exactamente 1 (convención editorial común a los 7 idiomas:
// "0 recetas", "1 receta"); el japonés no distingue singular y plural.
type CountKind = 'recipe' | 'vote' | 'missingIngredient' | 'star'
type Forms = { one: string; other: string }

const FORMS: Record<string, Record<CountKind, Forms>> = {
  es: {
    star: { one: 'estrella', other: 'estrellas' },
    recipe: { one: 'receta', other: 'recetas' },
    vote: { one: 'voto', other: 'votos' },
    missingIngredient: { one: 'ingrediente por conseguir', other: 'ingredientes por conseguir' },
  },
  en: {
    star: { one: 'star', other: 'stars' },
    recipe: { one: 'recipe', other: 'recipes' },
    vote: { one: 'vote', other: 'votes' },
    missingIngredient: { one: 'ingredient to get', other: 'ingredients to get' },
  },
  de: {
    star: { one: 'Stern', other: 'Sterne' },
    recipe: { one: 'Rezept', other: 'Rezepte' },
    vote: { one: 'Bewertung', other: 'Bewertungen' },
    missingIngredient: { one: 'fehlende Zutat', other: 'fehlende Zutaten' },
  },
  fr: {
    star: { one: 'étoile', other: 'étoiles' },
    recipe: { one: 'recette', other: 'recettes' },
    vote: { one: 'vote', other: 'votes' },
    missingIngredient: { one: 'ingrédient manquant', other: 'ingrédients manquants' },
  },
  it: {
    star: { one: 'stella', other: 'stelle' },
    recipe: { one: 'ricetta', other: 'ricette' },
    vote: { one: 'voto', other: 'voti' },
    missingIngredient: { one: 'ingrediente mancante', other: 'ingredienti mancanti' },
  },
  pt: {
    star: { one: 'estrela', other: 'estrelas' },
    recipe: { one: 'receita', other: 'receitas' },
    vote: { one: 'voto', other: 'votos' },
    missingIngredient: { one: 'ingrediente para conseguir', other: 'ingredientes para conseguir' },
  },
  ja: {
    star: { one: 'つ星', other: 'つ星' },
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

export function resultCountLabel(lang: string, count: number): string {
 const forms: Record<string, [string, string]> = {
  es: ['receta encontrada', 'recetas encontradas'], en: ['recipe found', 'recipes found'],
  de: ['Rezept gefunden', 'Rezepte gefunden'], fr: ['recette trouvée', 'recettes trouvées'],
  it: ['ricetta trovata', 'ricette trovate'], pt: ['receita encontrada', 'receitas encontradas'],
 };
 if (lang === 'ja') return `${count.toLocaleString(lang)}件のレシピが見つかりました`;
 return `${count.toLocaleString(lang)} ${(forms[lang] ?? forms.es)[count === 1 ? 0 : 1]}`;
}

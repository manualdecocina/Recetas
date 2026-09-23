import type { RecipeLanguage } from '@/types/recipe'

// Textos mínimos de interfaz por idioma, necesarios para metadata única por página.
// TODO(diseño): ampliar cuando se defina la interfaz final.
interface UiText {
  homeTitle: string
  homeDescription: string
  recipesTitle: string
  recipesDescription: string
  noRecipes: string
  previous: string
  next: string
  page: string
  ingredients: string
  preparation: string
}

export const UI_TEXT: Record<RecipeLanguage, UiText> = {
  es: {
    homeTitle: 'Manual de Cocina — Recetas colombianas e internacionales',
    homeDescription: 'Recetas paso a paso: cocina colombiana, latinoamericana e internacional, con ingredientes y tiempos claros.',
    recipesTitle: 'Todas las recetas',
    recipesDescription: 'Catálogo completo de recetas de Manual de Cocina, ordenadas de la más reciente a la más antigua.',
    noRecipes: 'Todavía no hay recetas publicadas en este idioma.',
    previous: 'Anterior', next: 'Siguiente', page: 'Página',
    ingredients: 'Ingredientes', preparation: 'Preparación',
  },
  en: {
    homeTitle: 'Manual de Cocina — Colombian and international recipes',
    homeDescription: 'Step-by-step recipes: Colombian, Latin American and international cooking with clear ingredients and times.',
    recipesTitle: 'All recipes',
    recipesDescription: 'The full Manual de Cocina recipe catalog, newest first.',
    noRecipes: 'No recipes published in this language yet.',
    previous: 'Previous', next: 'Next', page: 'Page',
    ingredients: 'Ingredients', preparation: 'Preparation',
  },
  de: {
    homeTitle: 'Manual de Cocina — Kolumbianische und internationale Rezepte',
    homeDescription: 'Rezepte Schritt für Schritt: kolumbianische, lateinamerikanische und internationale Küche mit klaren Zutaten und Zeiten.',
    recipesTitle: 'Alle Rezepte',
    recipesDescription: 'Der vollständige Rezeptkatalog von Manual de Cocina, neueste zuerst.',
    noRecipes: 'In dieser Sprache sind noch keine Rezepte veröffentlicht.',
    previous: 'Zurück', next: 'Weiter', page: 'Seite',
    ingredients: 'Zutaten', preparation: 'Zubereitung',
  },
  it: {
    homeTitle: 'Manual de Cocina — Ricette colombiane e internazionali',
    homeDescription: 'Ricette passo passo: cucina colombiana, latinoamericana e internazionale, con ingredienti e tempi chiari.',
    recipesTitle: 'Tutte le ricette',
    recipesDescription: 'Il catalogo completo delle ricette di Manual de Cocina, dalla più recente.',
    noRecipes: 'Non ci sono ancora ricette pubblicate in questa lingua.',
    previous: 'Precedente', next: 'Successiva', page: 'Pagina',
    ingredients: 'Ingredienti', preparation: 'Preparazione',
  },
  fr: {
    homeTitle: 'Manual de Cocina — Recettes colombiennes et internationales',
    homeDescription: 'Recettes pas à pas : cuisine colombienne, latino-américaine et internationale, avec ingrédients et temps clairs.',
    recipesTitle: 'Toutes les recettes',
    recipesDescription: 'Le catalogue complet des recettes de Manual de Cocina, de la plus récente à la plus ancienne.',
    noRecipes: 'Aucune recette publiée dans cette langue pour le moment.',
    previous: 'Précédente', next: 'Suivante', page: 'Page',
    ingredients: 'Ingrédients', preparation: 'Préparation',
  },
  ja: {
    homeTitle: 'Manual de Cocina — コロンビア料理と世界のレシピ',
    homeDescription: 'コロンビア料理、中南米料理、世界の料理のレシピを、材料と時間つきで分かりやすく紹介します。',
    recipesTitle: 'すべてのレシピ',
    recipesDescription: 'Manual de Cocina のレシピ一覧（新しい順）。',
    noRecipes: 'この言語で公開されているレシピはまだありません。',
    previous: '前へ', next: '次へ', page: 'ページ',
    ingredients: '材料', preparation: '作り方',
  },
}

import type { RecipeLanguage } from '@/types/recipe'

/** Reusable, editorially accurate category-index copy in each live language.
 * Titles, descriptions and visible introductions describe the same published taxonomy. */
export const CATEGORY_LANDING_COPY: Record<RecipeLanguage, {
  title: string
  description: string
  intro: string
}> = {
  es: {
    title: 'Categorías de recetas: de sopas a postres',
    description: 'Explora recetas de platos principales, pastas, sopas y cremas, ensaladas, panes, salsas, postres y bebidas. Encuentra qué cocinar paso a paso.',
    intro: 'Busca recetas por tipo de plato: desde platos principales, pastas y sopas hasta ensaladas, panes, salsas, postres y bebidas. Entra en una categoría para descubrir sus preparaciones con ingredientes y pasos.',
  },
  en: {
    title: 'Recipe categories: mains, bread and desserts',
    description: 'Browse main dishes, pasta, soups, salads, bread, sauces, desserts and drinks. Find step-by-step cooking ideas in each recipe category.',
    intro: 'Browse recipes by type of dish, from main courses, pasta and soups to salads, bread, sauces, desserts and drinks. Open any category to find recipes with ingredients and instructions.',
  },
  de: {
    title: 'Rezeptkategorien: Hauptgerichte bis Desserts',
    description: 'Entdecke Rezepte für Hauptgerichte, Pasta, Suppen, Salate, Brot, Saucen, Desserts und Getränke. Finde Kochideen mit Schritt-für-Schritt-Anleitung.',
    intro: 'Stöbere nach Gericht: Hauptgerichte, Pasta, Suppen, Salate, Brot, Saucen, Desserts und Getränke. In jeder Kategorie findest du Rezepte mit Zutaten und Zubereitungsschritten.',
  },
  fr: {
    title: 'Catégories de recettes : plats, pains, desserts',
    description: 'Explorez les recettes de plats principaux, pâtes, soupes, salades, pains, sauces, desserts et boissons. Retrouvez les ingrédients et les étapes.',
    intro: 'Choisissez un type de plat : plats principaux, pâtes, soupes, salades, pains, sauces, desserts ou boissons. Ouvrez une catégorie pour découvrir les ingrédients et les étapes des recettes.',
  },
  it: {
    title: 'Categorie di ricette: primi, pane e dolci',
    description: 'Esplora ricette di secondi piatti, pasta, zuppe, insalate, pane, salse, dolci e bevande. Trova ingredienti e preparazioni passo dopo passo.',
    intro: 'Cerca le ricette per tipo di piatto: secondi, pasta, zuppe, insalate, pane, salse, dolci e bevande. Apri una categoria per trovare ingredienti e istruzioni dettagliate.',
  },
  ja: {
    title: 'レシピのカテゴリー｜主菜・パン・デザート',
    description: '主菜、パスタ、スープ、サラダ、パン、ソース、デザート、飲み物など、料理の種類からレシピを探せます。材料と作り方を段階ごとに確認できます。',
    intro: '料理の種類からレシピを選べます。主菜、パスタ、スープ、サラダ、パン、ソース、デザート、飲み物などのカテゴリーを開き、材料と調理手順を確認してください。',
  },
  pt: {
    title: 'Categorias de receitas: pratos, pães e sobremesas',
    description: 'Explore receitas de pratos principais, massas, sopas, saladas, pães, molhos, sobremesas e bebidas. Veja ingredientes e modo de preparo.',
    intro: 'Escolha receitas por tipo de prato: principais, massas, sopas, saladas, pães, molhos, sobremesas e bebidas. Abra uma categoria para encontrar ingredientes e o passo a passo.',
  },
}

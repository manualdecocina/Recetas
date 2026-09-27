/**
 * UI strings. German, Italian, French and Japanese require native-language
 * editorial review before publishing. Only interface strings belong here;
 * real recipe content comes from the database.
 */
import type { MdLanguage } from '@/components/md/md-types';

const es = {
  navRecipes: "Recetas",
  navCategories: "Categorías",
  navIngredients: "Ingredientes",
  searchLabel: "Buscar recetas",
  searchPlaceholder: "Busca por plato o ingrediente",
  searchButton: "Buscar",
  openMenu: "Abrir menú",
  closeMenu: "Cerrar menú",
  featured: "Receta destacada",
  viewRecipe: "Ver receta",
  latest: "Recién publicadas",
  homeHeading: "Cocinar empieza con una buena receta",
  homeLead: "Ideas para encontrar tu próxima receta, con ingredientes claros y pasos que puedes seguir.",
  browseCategories: "Explora por categoría",
  browseIngredients: "Empieza por un ingrediente",
  editorialTitle: "Recetas para volver a cocinar",
  editorialBody: "Manual de Cocina reúne recetas de distintas cocinas para consultar, preparar y compartir, con instrucciones claras y una navegación sencilla.",
  seeAllRecipes: "Ver todas las recetas",
  seeAllCategories: "Ver todas las categorías",
  seeAllIngredients: "Ver ingredientes",
  recipeCatalog: "Todas las recetas",
  categoryCatalog: "Categorías",
  ingredientCatalog: "Ingredientes",
  resultCount: "Recetas encontradas",
  recipesInCategory: "Recetas de esta categoría",
  recipesWithIngredient: "Recetas con este ingrediente",
  filterHeading: "Encuentra tu receta",
  category: "Categoría",
  cuisine: "Cocina",
  difficulty: "Dificultad",
  ingredient: "Ingrediente",
  time: "Tiempo",
  sort: "Ordenar",
  mostRecent: "Más recientes",
  oldest: "Más antiguas",
  any: "Todas",
  applyFilters: "Aplicar filtros",
  clearFilters: "Limpiar filtros",
  activeFilters: "Filtros activos",
  removeFilter: "Eliminar filtro",
  previousPage: "Anterior",
  nextPage: "Siguiente",
  page: "Página",
  noRecipes: "No encontramos recetas con esos filtros.",
  emptyHint: "Prueba otra búsqueda o elimina algún filtro.",
  noPhoto: "Receta sin fotografía",
  recipeContents: "En esta receta",
  ingredients: "Ingredientes",
  preparation: "Preparación",
  notes: "Notas",
  keyPoint: "El punto clave",
  aboutRecipe: "Sobre esta receta",
  toggleTheme: "Cambiar entre tema claro y oscuro",
  relatedRecipes: "También te puede gustar",
  totalTime: "Tiempo total",
  servings: "Porciones",
  save: "Guardar",
  saved: "Guardada",
  share: "Compartir",
  print: "Imprimir",
  cookingMode: "Modo cocina",
  closeCooking: "Cerrar modo cocina",
  previousStep: "Paso anterior",
  nextStep: "Siguiente paso",
  finish: "Terminar",
  step: "Paso",
  of: "de",
  photoOf: "Fotografía de",
  about: "Quiénes somos",
  contact: "Contacto",
  editorialPolicy: "Política editorial",
  privacy: "Privacidad",
  cookies: "Cookies",
  terms: "Términos",
  legalNotice: "Aviso legal",
  intellectualProperty: "Propiedad intelectual",
  footerIntro: "Recetas para descubrir, cocinar y volver a preparar.",
  institutional: "Información",
  legal: "Legal",
  notFoundTitle: "Esta página no existe",
  notFoundBody: "Puede que el enlace haya cambiado. Vuelve al inicio o explora las recetas.",
  backHome: "Volver al inicio",
  skipToContent: "Saltar al contenido",
  emptyTitle: "Este contenido todavía está creciendo",
  emptyBody: "Mientras tanto, puedes explorar todas las recetas.",
} as const;

const en = {
  navRecipes: "Recipes",
  navCategories: "Categories",
  navIngredients: "Ingredients",
  searchLabel: "Search recipes",
  searchPlaceholder: "Search by dish or ingredient",
  searchButton: "Search",
  openMenu: "Open menu",
  closeMenu: "Close menu",
  featured: "Featured recipe",
  viewRecipe: "View recipe",
  latest: "Recently published",
  homeHeading: "Good cooking starts with a good recipe",
  homeLead: "Find ideas for your next meal, with clear ingredients and steps you can follow.",
  browseCategories: "Explore by category",
  browseIngredients: "Start with an ingredient",
  editorialTitle: "Recipes worth cooking again",
  editorialBody: "Manual de Cocina brings together recipes from different cuisines with clear instructions and easy navigation.",
  seeAllRecipes: "Browse all recipes",
  seeAllCategories: "Browse all categories",
  seeAllIngredients: "Browse ingredients",
  recipeCatalog: "All recipes",
  categoryCatalog: "Categories",
  ingredientCatalog: "Ingredients",
  resultCount: "Recipes found",
  recipesInCategory: "Recipes in this category",
  recipesWithIngredient: "Recipes with this ingredient",
  filterHeading: "Find your recipe",
  category: "Category",
  cuisine: "Cuisine",
  difficulty: "Difficulty",
  ingredient: "Ingredient",
  time: "Time",
  sort: "Sort",
  mostRecent: "Newest first",
  oldest: "Oldest first",
  any: "All",
  applyFilters: "Apply filters",
  clearFilters: "Clear filters",
  activeFilters: "Active filters",
  removeFilter: "Remove filter",
  previousPage: "Previous",
  nextPage: "Next",
  page: "Page",
  noRecipes: "No recipes match these filters.",
  emptyHint: "Try another search or remove a filter.",
  noPhoto: "Recipe without a photo",
  recipeContents: "In this recipe",
  ingredients: "Ingredients",
  preparation: "Method",
  notes: "Notes",
  keyPoint: "The key point",
  aboutRecipe: "About this recipe",
  toggleTheme: "Switch between light and dark theme",
  relatedRecipes: "You might also like",
  totalTime: "Total time",
  servings: "Servings",
  save: "Save",
  saved: "Saved",
  share: "Share",
  print: "Print",
  cookingMode: "Cooking mode",
  closeCooking: "Close cooking mode",
  previousStep: "Previous step",
  nextStep: "Next step",
  finish: "Finish",
  step: "Step",
  of: "of",
  photoOf: "Photo of",
  about: "About us",
  contact: "Contact",
  editorialPolicy: "Editorial policy",
  privacy: "Privacy",
  cookies: "Cookies",
  terms: "Terms",
  legalNotice: "Legal notice",
  intellectualProperty: "Intellectual property",
  footerIntro: "Recipes to discover, cook, and make again.",
  institutional: "Information",
  legal: "Legal",
  notFoundTitle: "This page does not exist",
  notFoundBody: "The link may have changed. Return home or browse recipes.",
  backHome: "Back to home",
  skipToContent: "Skip to content",
  emptyTitle: "This section is still growing",
  emptyBody: "In the meantime, browse all recipes.",
};

const de = {
  navRecipes: "Rezepte", // REVISAR
  navCategories: "Kategorien", // REVISAR
  navIngredients: "Zutaten", // REVISAR
  searchLabel: "Rezepte suchen", // REVISAR
  searchPlaceholder: "Nach Gericht oder Zutat suchen", // REVISAR
  searchButton: "Suchen", // REVISAR
  openMenu: "Menü öffnen", // REVISAR
  closeMenu: "Menü schließen", // REVISAR
  featured: "Ausgewähltes Rezept", // REVISAR
  viewRecipe: "Rezept ansehen", // REVISAR
  latest: "Neu veröffentlicht", // REVISAR
  homeHeading: "Gutes Kochen beginnt mit einem guten Rezept", // REVISAR
  homeLead: "Entdecke Ideen für dein nächstes Gericht – mit klaren Zutatenlisten und verständlichen Schritten.", // REVISAR
  browseCategories: "Nach Kategorie entdecken", // REVISAR
  browseIngredients: "Mit einer Zutat beginnen", // REVISAR
  editorialTitle: "Rezepte, die man gerne wieder kocht", // REVISAR
  editorialBody: "Manual de Cocina vereint Rezepte verschiedener Küchen mit klaren Anleitungen und einfacher Navigation.", // REVISAR
  seeAllRecipes: "Alle Rezepte ansehen", // REVISAR
  seeAllCategories: "Alle Kategorien ansehen", // REVISAR
  seeAllIngredients: "Zutaten entdecken", // REVISAR
  recipeCatalog: "Alle Rezepte", // REVISAR
  categoryCatalog: "Kategorien", // REVISAR
  ingredientCatalog: "Zutaten", // REVISAR
  resultCount: "Gefundene Rezepte", // REVISAR
  recipesInCategory: "Rezepte dieser Kategorie", // REVISAR
  recipesWithIngredient: "Rezepte mit dieser Zutat", // REVISAR
  filterHeading: "Finde dein Rezept", // REVISAR
  category: "Kategorie", // REVISAR
  cuisine: "Landesküche", // REVISAR
  difficulty: "Schwierigkeit", // REVISAR
  ingredient: "Zutat", // REVISAR
  time: "Zeit", // REVISAR
  sort: "Sortieren", // REVISAR
  mostRecent: "Neueste zuerst", // REVISAR
  oldest: "Älteste zuerst", // REVISAR
  any: "Alle", // REVISAR
  applyFilters: "Filter anwenden", // REVISAR
  clearFilters: "Filter löschen", // REVISAR
  activeFilters: "Aktive Filter", // REVISAR
  removeFilter: "Filter entfernen", // REVISAR
  previousPage: "Zurück", // REVISAR
  nextPage: "Weiter", // REVISAR
  page: "Seite", // REVISAR
  noRecipes: "Keine Rezepte entsprechen diesen Filtern.", // REVISAR
  emptyHint: "Versuche eine andere Suche oder entferne einen Filter.", // REVISAR
  noPhoto: "Rezept ohne Foto", // REVISAR
  recipeContents: "In diesem Rezept", // REVISAR
  ingredients: "Zutaten", // REVISAR
  preparation: "Zubereitung", // REVISAR
  notes: "Hinweise", // REVISAR
  keyPoint: "Das Wichtigste", // REVISAR
  aboutRecipe: "Über dieses Rezept", // REVISAR
  toggleTheme: "Zwischen hellem und dunklem Design wechseln", // REVISAR
  relatedRecipes: "Das könnte dir auch gefallen", // REVISAR
  totalTime: "Gesamtzeit", // REVISAR
  servings: "Portionen", // REVISAR
  save: "Speichern", // REVISAR
  saved: "Gespeichert", // REVISAR
  share: "Teilen", // REVISAR
  print: "Drucken", // REVISAR
  cookingMode: "Kochmodus", // REVISAR
  closeCooking: "Kochmodus schließen", // REVISAR
  previousStep: "Vorheriger Schritt", // REVISAR
  nextStep: "Nächster Schritt", // REVISAR
  finish: "Fertig", // REVISAR
  step: "Schritt", // REVISAR
  of: "von", // REVISAR
  photoOf: "Foto von", // REVISAR
  about: "Über uns", // REVISAR
  contact: "Kontakt", // REVISAR
  editorialPolicy: "Redaktionelle Richtlinien", // REVISAR
  privacy: "Datenschutz", // REVISAR
  cookies: "Cookies", // REVISAR
  terms: "Nutzungsbedingungen", // REVISAR
  legalNotice: "Impressum", // REVISAR
  intellectualProperty: "Geistiges Eigentum", // REVISAR
  footerIntro: "Rezepte zum Entdecken, Nachkochen und Wiederholen.", // REVISAR
  institutional: "Informationen", // REVISAR
  legal: "Rechtliches", // REVISAR
  notFoundTitle: "Diese Seite gibt es nicht", // REVISAR
  notFoundBody: "Der Link hat sich möglicherweise geändert. Zurück zur Startseite oder zu den Rezepten.", // REVISAR
  backHome: "Zur Startseite", // REVISAR
  skipToContent: "Zum Inhalt springen", // REVISAR
  emptyTitle: "Dieser Bereich wächst noch", // REVISAR
  emptyBody: "Stöbere in der Zwischenzeit in allen Rezepten.", // REVISAR
};

const it = {
  navRecipes: "Ricette", // REVISAR
  navCategories: "Categorie", // REVISAR
  navIngredients: "Ingredienti", // REVISAR
  searchLabel: "Cerca ricette", // REVISAR
  searchPlaceholder: "Cerca per piatto o ingrediente", // REVISAR
  searchButton: "Cerca", // REVISAR
  openMenu: "Apri menu", // REVISAR
  closeMenu: "Chiudi menu", // REVISAR
  featured: "Ricetta in evidenza", // REVISAR
  viewRecipe: "Vedi ricetta", // REVISAR
  latest: "Pubblicate di recente", // REVISAR
  homeHeading: "Cucinare bene inizia da una buona ricetta", // REVISAR
  homeLead: "Trova idee per il prossimo piatto, con ingredienti chiari e passaggi facili da seguire.", // REVISAR
  browseCategories: "Esplora per categoria", // REVISAR
  browseIngredients: "Parti da un ingrediente", // REVISAR
  editorialTitle: "Ricette da cucinare ancora", // REVISAR
  editorialBody: "Manual de Cocina raccoglie ricette di cucine diverse con istruzioni chiare e una navigazione semplice.", // REVISAR
  seeAllRecipes: "Vedi tutte le ricette", // REVISAR
  seeAllCategories: "Vedi tutte le categorie", // REVISAR
  seeAllIngredients: "Esplora gli ingredienti", // REVISAR
  recipeCatalog: "Tutte le ricette", // REVISAR
  categoryCatalog: "Categorie", // REVISAR
  ingredientCatalog: "Ingredienti", // REVISAR
  resultCount: "Ricette trovate", // REVISAR
  recipesInCategory: "Ricette di questa categoria", // REVISAR
  recipesWithIngredient: "Ricette con questo ingrediente", // REVISAR
  filterHeading: "Trova la tua ricetta", // REVISAR
  category: "Categoria", // REVISAR
  cuisine: "Cucina", // REVISAR
  difficulty: "Difficoltà", // REVISAR
  ingredient: "Ingrediente", // REVISAR
  time: "Tempo", // REVISAR
  sort: "Ordina", // REVISAR
  mostRecent: "Più recenti", // REVISAR
  oldest: "Meno recenti", // REVISAR
  any: "Tutte", // REVISAR
  applyFilters: "Applica filtri", // REVISAR
  clearFilters: "Cancella filtri", // REVISAR
  activeFilters: "Filtri attivi", // REVISAR
  removeFilter: "Rimuovi filtro", // REVISAR
  previousPage: "Precedente", // REVISAR
  nextPage: "Successiva", // REVISAR
  page: "Pagina", // REVISAR
  noRecipes: "Nessuna ricetta corrisponde a questi filtri.", // REVISAR
  emptyHint: "Prova un’altra ricerca o rimuovi un filtro.", // REVISAR
  noPhoto: "Ricetta senza foto", // REVISAR
  recipeContents: "In questa ricetta", // REVISAR
  ingredients: "Ingredienti", // REVISAR
  preparation: "Preparazione", // REVISAR
  notes: "Note", // REVISAR
  keyPoint: "Il punto chiave", // REVISAR
  aboutRecipe: "Su questa ricetta", // REVISAR
  toggleTheme: "Passa dal tema chiaro a quello scuro", // REVISAR
  relatedRecipes: "Potrebbe piacerti anche", // REVISAR
  totalTime: "Tempo totale", // REVISAR
  servings: "Porzioni", // REVISAR
  save: "Salva", // REVISAR
  saved: "Salvata", // REVISAR
  share: "Condividi", // REVISAR
  print: "Stampa", // REVISAR
  cookingMode: "Modalità cucina", // REVISAR
  closeCooking: "Chiudi modalità cucina", // REVISAR
  previousStep: "Passaggio precedente", // REVISAR
  nextStep: "Passaggio successivo", // REVISAR
  finish: "Termina", // REVISAR
  step: "Passaggio", // REVISAR
  of: "di", // REVISAR
  photoOf: "Foto di", // REVISAR
  about: "Chi siamo", // REVISAR
  contact: "Contatti", // REVISAR
  editorialPolicy: "Politica editoriale", // REVISAR
  privacy: "Privacy", // REVISAR
  cookies: "Cookie", // REVISAR
  terms: "Termini", // REVISAR
  legalNotice: "Note legali", // REVISAR
  intellectualProperty: "Proprietà intellettuale", // REVISAR
  footerIntro: "Ricette da scoprire, cucinare e rifare.", // REVISAR
  institutional: "Informazioni", // REVISAR
  legal: "Legale", // REVISAR
  notFoundTitle: "Questa pagina non esiste", // REVISAR
  notFoundBody: "Il collegamento potrebbe essere cambiato. Torna alla home o esplora le ricette.", // REVISAR
  backHome: "Torna alla home", // REVISAR
  skipToContent: "Vai al contenuto", // REVISAR
  emptyTitle: "Questa sezione è ancora in crescita", // REVISAR
  emptyBody: "Nel frattempo, sfoglia tutte le ricette.", // REVISAR
};

const fr = {
  navRecipes: "Recettes", // REVISAR
  navCategories: "Catégories", // REVISAR
  navIngredients: "Ingrédients", // REVISAR
  searchLabel: "Rechercher des recettes", // REVISAR
  searchPlaceholder: "Rechercher un plat ou un ingrédient", // REVISAR
  searchButton: "Rechercher", // REVISAR
  openMenu: "Ouvrir le menu", // REVISAR
  closeMenu: "Fermer le menu", // REVISAR
  featured: "Recette à la une", // REVISAR
  viewRecipe: "Voir la recette", // REVISAR
  latest: "Publiées récemment", // REVISAR
  homeHeading: "Bien cuisiner commence par une bonne recette", // REVISAR
  homeLead: "Des idées pour votre prochain plat, avec des ingrédients clairs et des étapes faciles à suivre.", // REVISAR
  browseCategories: "Explorer par catégorie", // REVISAR
  browseIngredients: "Partir d’un ingrédient", // REVISAR
  editorialTitle: "Des recettes à refaire", // REVISAR
  editorialBody: "Manual de Cocina rassemble des recettes de différentes cuisines, avec des instructions claires et une navigation simple.", // REVISAR
  seeAllRecipes: "Voir toutes les recettes", // REVISAR
  seeAllCategories: "Voir toutes les catégories", // REVISAR
  seeAllIngredients: "Explorer les ingrédients", // REVISAR
  recipeCatalog: "Toutes les recettes", // REVISAR
  categoryCatalog: "Catégories", // REVISAR
  ingredientCatalog: "Ingrédients", // REVISAR
  resultCount: "Recettes trouvées", // REVISAR
  recipesInCategory: "Recettes de cette catégorie", // REVISAR
  recipesWithIngredient: "Recettes avec cet ingrédient", // REVISAR
  filterHeading: "Trouvez votre recette", // REVISAR
  category: "Catégorie", // REVISAR
  cuisine: "Cuisine", // REVISAR
  difficulty: "Difficulté", // REVISAR
  ingredient: "Ingrédient", // REVISAR
  time: "Temps", // REVISAR
  sort: "Trier", // REVISAR
  mostRecent: "Plus récentes", // REVISAR
  oldest: "Plus anciennes", // REVISAR
  any: "Toutes", // REVISAR
  applyFilters: "Appliquer les filtres", // REVISAR
  clearFilters: "Effacer les filtres", // REVISAR
  activeFilters: "Filtres actifs", // REVISAR
  removeFilter: "Supprimer le filtre", // REVISAR
  previousPage: "Précédent", // REVISAR
  nextPage: "Suivant", // REVISAR
  page: "Page", // REVISAR
  noRecipes: "Aucune recette ne correspond à ces filtres.", // REVISAR
  emptyHint: "Essayez une autre recherche ou retirez un filtre.", // REVISAR
  noPhoto: "Recette sans photo", // REVISAR
  recipeContents: "Dans cette recette", // REVISAR
  ingredients: "Ingrédients", // REVISAR
  preparation: "Préparation", // REVISAR
  notes: "Notes", // REVISAR
  keyPoint: "Le point clé", // REVISAR
  aboutRecipe: "À propos de cette recette", // REVISAR
  toggleTheme: "Basculer entre thème clair et sombre", // REVISAR
  relatedRecipes: "Vous aimerez aussi", // REVISAR
  totalTime: "Temps total", // REVISAR
  servings: "Portions", // REVISAR
  save: "Enregistrer", // REVISAR
  saved: "Enregistrée", // REVISAR
  share: "Partager", // REVISAR
  print: "Imprimer", // REVISAR
  cookingMode: "Mode cuisine", // REVISAR
  closeCooking: "Fermer le mode cuisine", // REVISAR
  previousStep: "Étape précédente", // REVISAR
  nextStep: "Étape suivante", // REVISAR
  finish: "Terminer", // REVISAR
  step: "Étape", // REVISAR
  of: "sur", // REVISAR
  photoOf: "Photo de", // REVISAR
  about: "Qui sommes-nous", // REVISAR
  contact: "Contact", // REVISAR
  editorialPolicy: "Politique éditoriale", // REVISAR
  privacy: "Confidentialité", // REVISAR
  cookies: "Cookies", // REVISAR
  terms: "Conditions", // REVISAR
  legalNotice: "Mentions légales", // REVISAR
  intellectualProperty: "Propriété intellectuelle", // REVISAR
  footerIntro: "Des recettes à découvrir, cuisiner et refaire.", // REVISAR
  institutional: "Informations", // REVISAR
  legal: "Mentions légales", // REVISAR
  notFoundTitle: "Cette page n’existe pas", // REVISAR
  notFoundBody: "Le lien a peut-être changé. Revenez à l’accueil ou explorez les recettes.", // REVISAR
  backHome: "Retour à l’accueil", // REVISAR
  skipToContent: "Aller au contenu", // REVISAR
  emptyTitle: "Cette section est encore en construction", // REVISAR
  emptyBody: "En attendant, parcourez toutes les recettes.", // REVISAR
};

const ja = {
  navRecipes: "レシピ", // REVISAR
  navCategories: "カテゴリー", // REVISAR
  navIngredients: "食材", // REVISAR
  searchLabel: "レシピを検索", // REVISAR
  searchPlaceholder: "料理名や食材で検索", // REVISAR
  searchButton: "検索", // REVISAR
  openMenu: "メニューを開く", // REVISAR
  closeMenu: "メニューを閉じる", // REVISAR
  featured: "おすすめレシピ", // REVISAR
  viewRecipe: "レシピを見る", // REVISAR
  latest: "新着レシピ", // REVISAR
  homeHeading: "おいしい料理は、よいレシピから", // REVISAR
  homeLead: "わかりやすい材料と手順で、次に作る料理を見つけましょう。", // REVISAR
  browseCategories: "カテゴリーから探す", // REVISAR
  browseIngredients: "食材から探す", // REVISAR
  editorialTitle: "何度も作りたくなるレシピ", // REVISAR
  editorialBody: "Manual de Cocina は、さまざまな国のレシピをわかりやすい手順と使いやすい構成で紹介します。", // REVISAR
  seeAllRecipes: "すべてのレシピ", // REVISAR
  seeAllCategories: "すべてのカテゴリー", // REVISAR
  seeAllIngredients: "食材一覧", // REVISAR
  recipeCatalog: "すべてのレシピ", // REVISAR
  categoryCatalog: "カテゴリー", // REVISAR
  ingredientCatalog: "食材", // REVISAR
  resultCount: "検索結果", // REVISAR
  recipesInCategory: "このカテゴリーのレシピ", // REVISAR
  recipesWithIngredient: "この食材を使うレシピ", // REVISAR
  filterHeading: "レシピを探す", // REVISAR
  category: "カテゴリー", // REVISAR
  cuisine: "料理の種類", // REVISAR
  difficulty: "難易度", // REVISAR
  ingredient: "食材", // REVISAR
  time: "時間", // REVISAR
  sort: "並べ替え", // REVISAR
  mostRecent: "新しい順", // REVISAR
  oldest: "古い順", // REVISAR
  any: "すべて", // REVISAR
  applyFilters: "絞り込む", // REVISAR
  clearFilters: "条件をクリア", // REVISAR
  activeFilters: "適用中の条件", // REVISAR
  removeFilter: "条件を解除", // REVISAR
  previousPage: "前へ", // REVISAR
  nextPage: "次へ", // REVISAR
  page: "ページ", // REVISAR
  noRecipes: "条件に合うレシピが見つかりませんでした。", // REVISAR
  emptyHint: "検索語や絞り込み条件を変えてみてください。", // REVISAR
  noPhoto: "写真のないレシピ", // REVISAR
  recipeContents: "このレシピの内容", // REVISAR
  ingredients: "材料", // REVISAR
  preparation: "作り方", // REVISAR
  notes: "メモ", // REVISAR
  keyPoint: "大切なポイント", // REVISAR
  aboutRecipe: "このレシピについて", // REVISAR
  toggleTheme: "ライト／ダークテーマを切り替える", // REVISAR
  relatedRecipes: "こちらもおすすめ", // REVISAR
  totalTime: "合計時間", // REVISAR
  servings: "人数", // REVISAR
  save: "保存", // REVISAR
  saved: "保存済み", // REVISAR
  share: "共有", // REVISAR
  print: "印刷", // REVISAR
  cookingMode: "調理モード", // REVISAR
  closeCooking: "調理モードを閉じる", // REVISAR
  previousStep: "前の手順", // REVISAR
  nextStep: "次の手順", // REVISAR
  finish: "終了", // REVISAR
  step: "手順", // REVISAR
  of: "／", // REVISAR
  photoOf: "写真：", // REVISAR
  about: "私たちについて", // REVISAR
  contact: "お問い合わせ", // REVISAR
  editorialPolicy: "編集方針", // REVISAR
  privacy: "プライバシー", // REVISAR
  cookies: "Cookie", // REVISAR
  terms: "利用規約", // REVISAR
  legalNotice: "法的通知", // REVISAR
  intellectualProperty: "知的財産", // REVISAR
  footerIntro: "見つけて、作って、また作りたくなるレシピ。", // REVISAR
  institutional: "サイト情報", // REVISAR
  legal: "法的情報", // REVISAR
  notFoundTitle: "ページが見つかりません", // REVISAR
  notFoundBody: "リンクが変更された可能性があります。ホームに戻るか、レシピを探してください。", // REVISAR
  backHome: "ホームへ戻る", // REVISAR
  skipToContent: "本文へ移動", // REVISAR
  emptyTitle: "このセクションは準備中です", // REVISAR
  emptyBody: "その間、すべてのレシピをご覧ください。", // REVISAR
};

export type MdCopy = Record<keyof typeof es, string>;
export const mdCopy: Record<MdLanguage, MdCopy> = { es, en, de, it, fr, ja };
export function getMdCopy(lang: MdLanguage): MdCopy { return mdCopy[lang] ?? mdCopy.es; }

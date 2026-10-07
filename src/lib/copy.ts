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
  editorialPoint1: "Instrucciones claras, paso a paso, con una imagen ilustrativa de cada paso.",
  editorialPoint2: "Notas de conservación, sustituciones y preguntas frecuentes en cada receta.",
  editorialPoint3: "Sin datos inventados: valoraciones solo de lectores reales y fuentes nutricionales citadas.",
  editorialPoint4: "Guarda tus recetas favoritas y compártelas fácilmente.",
  editorialAuthorRole: "Chef · responsable editorial",
  editorialAuthorBlurb: "Más de 15 años de experiencia en cocina profesional en Latinoamérica, Estados Unidos y España.",
  editorialAuthorCta: "Conócenos",
  seeAllRecipes: "Ver todas las recetas",
  seeAllCategories: "Ver todas las categorías",
  seeAllIngredients: "Ver ingredientes",
  recipeCatalog: "Todas las recetas",
  categoryCatalog: "Categorías",
  ingredientCatalog: "Ingredientes",
  ingredientCatalogIntro: "Cada ingrediente reúne las recetas reales que lo usan, con su foto y el número de recetas disponibles.",
  ingredientRecipeCountSuffix: "recetas",
  resultCount: "Recetas encontradas",
  recipesInCategory: "Recetas de esta categoría",
  recipesWithIngredient: "Recetas con este ingrediente",
  navPantryTool: "¿Qué cocino?",
  pantryEyebrow: "Herramienta gratuita",
  pantryBannerTitle: "¿Qué puedo cocinar con lo que tengo?",
  pantryBannerBody: "Elige los ingredientes de tu cocina y te mostramos qué recetas puedes preparar ahora mismo, sin ir a comprar nada.",
  pantryBannerCta: "Probar la herramienta",
  pantryToolHeading: "¿Qué puedo cocinar con lo que tengo?",
  pantryToolIntro: "Marca los ingredientes que tienes a mano y te mostramos las recetas que puedes preparar, ordenadas según cuántos ingredientes te faltan.",
  pantryMetaDescription: "Elige los ingredientes que tienes en casa y descubre qué recetas de Manual de Cocina puedes preparar ahora mismo.",
  pantryPickerHeading: "¿Qué tienes en tu cocina?",
  pantrySearchPlaceholder: "Busca un ingrediente (ajo, limón, arroz...)",
  pantryClearSelection: "Limpiar selección",
  pantryNoIngredientsFound: "No encontramos ningún ingrediente con ese nombre.",
  pantryResultsHeading: "Recetas que puedes preparar",
  pantryEmptyNoSelection: "Elige al menos un ingrediente para ver qué puedes cocinar.",
  pantryEmptyNoMatches: "Todavía no tenemos ninguna receta con esta combinación exacta. Prueba quitando algún ingrediente.",
  pantryComplete: "¡Lo tienes todo!",
  pantryMissingPrefix: "Te faltan:",
  pantryMissingSuffix: "ingredientes por conseguir",
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
  nutritionTitle: "Información nutricional",
  perServing: "por porción",
  nutritionEstimated: "Valores estimados a partir de los ingredientes; pueden variar según marcas y porciones.",
  nutritionSourceLabel: "Fuente de referencia",
  nutritionDisclaimer: "Información orientativa; no sustituye el consejo de un profesional de la salud o de la nutrición.",
  calories: "Calorías",
  protein: "Proteínas",
  carbs: "Carbohidratos",
  fat: "Grasas",
  saturatedFat: "Grasas saturadas",
  fiber: "Fibra",
  sugars: "Azúcares",
  sodium: "Sodio",
  writtenBy: "Por",
  updatedOn: "Actualizada el",
  videoTitle: "Video de la receta",
  faqTitle: "Preguntas frecuentes",
  sourcesTitle: "Fuentes",
  close: "Cerrar",
  playVideo: "Reproducir video",
  stepPhotosNote: "Las fotos de los pasos son ilustrativas.",
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
  photoOf: "Imagen de",
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
  ratingHeading: "Valora esta receta",
  ratingYourVote: "Tu valoración",
  ratingThanks: "¡Gracias por tu voto!",
  ratingAverageOf5: "de 5",
  ratingVotesSuffix: "votos",
  ratingNoVotesYet: "Sé la primera persona en valorarla",
  ratingStarLabel: "estrellas",
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
  editorialPoint1: "Clear, step-by-step instructions with an illustrative image for each step.",
  editorialPoint2: "Storage tips, substitutions and FAQs on every recipe.",
  editorialPoint3: "No invented data: ratings come only from real readers and nutrition sources are cited.",
  editorialPoint4: "Save your favorite recipes and share them easily.",
  editorialAuthorRole: "Chef · Editorial lead",
  editorialAuthorBlurb: "Over 15 years of professional cooking experience in Latin America, the United States and Spain.",
  editorialAuthorCta: "About us",
  seeAllRecipes: "Browse all recipes",
  seeAllCategories: "Browse all categories",
  seeAllIngredients: "Browse ingredients",
  recipeCatalog: "All recipes",
  categoryCatalog: "Categories",
  ingredientCatalog: "Ingredients",
  ingredientCatalogIntro: "Each ingredient gathers the real recipes that use it, with its photo and how many recipes are available.",
  ingredientRecipeCountSuffix: "recipes",
  resultCount: "Recipes found",
  recipesInCategory: "Recipes in this category",
  recipesWithIngredient: "Recipes with this ingredient",
  navPantryTool: "What can I cook?",
  pantryEyebrow: "Free tool",
  pantryBannerTitle: "What can I cook with what I have?",
  pantryBannerBody: "Pick the ingredients in your kitchen and we'll show you which recipes you can make right now, no shopping trip needed.",
  pantryBannerCta: "Try the tool",
  pantryToolHeading: "What can I cook with what I have?",
  pantryToolIntro: "Check off the ingredients you already have and we'll show you which recipes you can make, sorted by how many ingredients you're missing.",
  pantryMetaDescription: "Pick the ingredients you have at home and discover which Manual de Cocina recipes you can make right now.",
  pantryPickerHeading: "What's in your kitchen?",
  pantrySearchPlaceholder: "Search an ingredient (garlic, lemon, rice...)",
  pantryClearSelection: "Clear selection",
  pantryNoIngredientsFound: "We couldn't find any ingredient with that name.",
  pantryResultsHeading: "Recipes you can make",
  pantryEmptyNoSelection: "Pick at least one ingredient to see what you can cook.",
  pantryEmptyNoMatches: "We don't have a recipe with this exact combination yet. Try removing an ingredient.",
  pantryComplete: "You have it all!",
  pantryMissingPrefix: "Missing:",
  pantryMissingSuffix: "ingredients to get",
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
  nutritionTitle: "Nutrition facts",
  perServing: "per serving",
  nutritionEstimated: "Estimated values calculated from the ingredients; they may vary by brand and portion size.",
  nutritionSourceLabel: "Reference source",
  nutritionDisclaimer: "For general information only; it does not replace advice from a qualified health or nutrition professional.",
  calories: "Calories",
  protein: "Protein",
  carbs: "Carbohydrates",
  fat: "Fat",
  saturatedFat: "Saturated fat",
  fiber: "Fiber",
  sugars: "Sugars",
  sodium: "Sodium",
  writtenBy: "By",
  updatedOn: "Updated on",
  videoTitle: "Recipe video",
  faqTitle: "Frequently asked questions",
  sourcesTitle: "Sources",
  close: "Close",
  playVideo: "Play video",
  stepPhotosNote: "The step photos are illustrative.",
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
  photoOf: "Image of",
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
  ratingHeading: "Rate this recipe",
  ratingYourVote: "Your rating",
  ratingThanks: "Thanks for your vote!",
  ratingAverageOf5: "out of 5",
  ratingVotesSuffix: "votes",
  ratingNoVotesYet: "Be the first to rate it",
  ratingStarLabel: "stars",
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
  editorialPoint1: "Klare Schritt-für-Schritt-Anleitungen mit einem illustrativen Bild zu jedem Schritt.",
  editorialPoint2: "Aufbewahrungstipps, Alternativen und FAQ bei jedem Rezept.", // REVISAR
  editorialPoint3: "Keine erfundenen Daten: Bewertungen nur von echten Lesern, Nährwertquellen werden genannt.",
  editorialPoint4: "Speichere deine Lieblingsrezepte und teile sie einfach.", // REVISAR
  editorialAuthorRole: "Koch · Redaktionsleiter", // REVISAR
  editorialAuthorBlurb: "Über 15 Jahre Berufserfahrung in der professionellen Küche in Lateinamerika, den USA und Spanien.", // REVISAR
  editorialAuthorCta: "Über uns", // REVISAR
  seeAllRecipes: "Alle Rezepte ansehen", // REVISAR
  seeAllCategories: "Alle Kategorien ansehen", // REVISAR
  seeAllIngredients: "Zutaten entdecken", // REVISAR
  recipeCatalog: "Alle Rezepte", // REVISAR
  categoryCatalog: "Kategorien", // REVISAR
  ingredientCatalog: "Zutaten", // REVISAR
  ingredientCatalogIntro: "Jede Zutat zeigt die echten Rezepte, die sie verwenden, mit Foto und Anzahl der Rezepte.", // REVISAR
  ingredientRecipeCountSuffix: "Rezepte", // REVISAR
  resultCount: "Gefundene Rezepte", // REVISAR
  recipesInCategory: "Rezepte dieser Kategorie", // REVISAR
  recipesWithIngredient: "Rezepte mit dieser Zutat", // REVISAR
  navPantryTool: "Was koche ich?", // REVISAR
  pantryEyebrow: "Kostenloses Tool", // REVISAR
  pantryBannerTitle: "Was kann ich mit dem kochen, was ich habe?", // REVISAR
  pantryBannerBody: "Wähle die Zutaten aus, die du in der Küche hast, und wir zeigen dir, welche Rezepte du sofort zubereiten kannst.", // REVISAR
  pantryBannerCta: "Tool ausprobieren", // REVISAR
  pantryToolHeading: "Was kann ich mit dem kochen, was ich habe?", // REVISAR
  pantryToolIntro: "Markiere die Zutaten, die du schon hast, und wir zeigen dir die Rezepte, die du zubereiten kannst.", // REVISAR
  pantryMetaDescription: "Wähle die Zutaten, die du zu Hause hast, und entdecke, welche Rezepte von Manual de Cocina du sofort zubereiten kannst.", // REVISAR
  pantryPickerHeading: "Was hast du in deiner Küche?", // REVISAR
  pantrySearchPlaceholder: "Zutat suchen (Knoblauch, Zitrone, Reis...)", // REVISAR
  pantryClearSelection: "Auswahl löschen", // REVISAR
  pantryNoIngredientsFound: "Keine Zutat mit diesem Namen gefunden.", // REVISAR
  pantryResultsHeading: "Rezepte, die du zubereiten kannst", // REVISAR
  pantryEmptyNoSelection: "Wähle mindestens eine Zutat aus, um zu sehen, was du kochen kannst.", // REVISAR
  pantryEmptyNoMatches: "Wir haben noch kein Rezept mit genau dieser Kombination. Entferne eine Zutat.", // REVISAR
  pantryComplete: "Du hast alles!", // REVISAR
  pantryMissingPrefix: "Es fehlt:", // REVISAR
  pantryMissingSuffix: "fehlende Zutaten", // REVISAR
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
  nutritionTitle: "Nährwerte", // REVISAR
  perServing: "pro Portion", // REVISAR
  nutritionEstimated: "Geschätzte Werte auf Basis der Zutaten; sie können je nach Marke und Portion abweichen.", // REVISAR
  nutritionSourceLabel: "Referenzquelle", // REVISAR
  nutritionDisclaimer: "Nur zur allgemeinen Information; ersetzt keine Beratung durch qualifiziertes Gesundheits- oder Ernährungspersonal.", // REVISAR
  calories: "Kalorien", // REVISAR
  protein: "Eiweiß", // REVISAR
  carbs: "Kohlenhydrate", // REVISAR
  fat: "Fett", // REVISAR
  saturatedFat: "Gesättigte Fettsäuren", // REVISAR
  fiber: "Ballaststoffe", // REVISAR
  sugars: "Zucker", // REVISAR
  sodium: "Natrium", // REVISAR
  writtenBy: "Von", // REVISAR
  updatedOn: "Aktualisiert am", // REVISAR
  videoTitle: "Rezeptvideo", // REVISAR
  faqTitle: "Häufige Fragen", // REVISAR
  sourcesTitle: "Quellen", // REVISAR
  close: "Schließen", // REVISAR
  playVideo: "Video abspielen", // REVISAR
  stepPhotosNote: "Die Schrittfotos sind Illustrationen.", // REVISAR
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
  photoOf: "Bild von",
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
  ratingHeading: "Bewerte dieses Rezept",
  ratingYourVote: "Deine Bewertung",
  ratingThanks: "Danke für deine Bewertung!",
  ratingAverageOf5: "von 5",
  ratingVotesSuffix: "Bewertungen",
  ratingNoVotesYet: "Sei die erste Person, die bewertet",
  ratingStarLabel: "Sterne",
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
  editorialPoint1: "Istruzioni chiare, passo dopo passo, con un'immagine illustrativa per ogni passaggio.",
  editorialPoint2: "Consigli di conservazione, sostituzioni e FAQ in ogni ricetta.", // REVISAR
  editorialPoint3: "Nessun dato inventato: valutazioni solo da lettori reali e fonti nutrizionali citate.",
  editorialPoint4: "Salva le tue ricette preferite e condividile facilmente.", // REVISAR
  editorialAuthorRole: "Chef · responsabile editoriale", // REVISAR
  editorialAuthorBlurb: "Oltre 15 anni di esperienza in cucina professionale in America Latina, Stati Uniti e Spagna.", // REVISAR
  editorialAuthorCta: "Chi siamo", // REVISAR
  seeAllRecipes: "Vedi tutte le ricette", // REVISAR
  seeAllCategories: "Vedi tutte le categorie", // REVISAR
  seeAllIngredients: "Esplora gli ingredienti", // REVISAR
  recipeCatalog: "Tutte le ricette", // REVISAR
  categoryCatalog: "Categorie", // REVISAR
  ingredientCatalog: "Ingredienti", // REVISAR
  ingredientCatalogIntro: "Ogni ingrediente raccoglie le ricette reali che lo usano, con la sua foto e il numero di ricette disponibili.", // REVISAR
  ingredientRecipeCountSuffix: "ricette", // REVISAR
  resultCount: "Ricette trovate", // REVISAR
  recipesInCategory: "Ricette di questa categoria", // REVISAR
  recipesWithIngredient: "Ricette con questo ingrediente", // REVISAR
  navPantryTool: "Cosa cucino?", // REVISAR
  pantryEyebrow: "Strumento gratuito", // REVISAR
  pantryBannerTitle: "Cosa posso cucinare con quello che ho?", // REVISAR
  pantryBannerBody: "Scegli gli ingredienti che hai in cucina e ti mostriamo quali ricette puoi preparare subito.", // REVISAR
  pantryBannerCta: "Prova lo strumento", // REVISAR
  pantryToolHeading: "Cosa posso cucinare con quello che ho?", // REVISAR
  pantryToolIntro: "Seleziona gli ingredienti che hai già e ti mostriamo le ricette che puoi preparare.", // REVISAR
  pantryMetaDescription: "Scegli gli ingredienti che hai in casa e scopri quali ricette di Manual de Cocina puoi preparare subito.", // REVISAR
  pantryPickerHeading: "Cosa hai in cucina?", // REVISAR
  pantrySearchPlaceholder: "Cerca un ingrediente (aglio, limone, riso...)", // REVISAR
  pantryClearSelection: "Cancella selezione", // REVISAR
  pantryNoIngredientsFound: "Nessun ingrediente trovato con questo nome.", // REVISAR
  pantryResultsHeading: "Ricette che puoi preparare", // REVISAR
  pantryEmptyNoSelection: "Scegli almeno un ingrediente per vedere cosa puoi cucinare.", // REVISAR
  pantryEmptyNoMatches: "Non abbiamo ancora una ricetta con questa combinazione esatta. Prova a togliere un ingrediente.", // REVISAR
  pantryComplete: "Hai tutto!", // REVISAR
  pantryMissingPrefix: "Manca:", // REVISAR
  pantryMissingSuffix: "ingredienti mancanti", // REVISAR
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
  nutritionTitle: "Valori nutrizionali", // REVISAR
  perServing: "per porzione", // REVISAR
  nutritionEstimated: "Valori stimati in base agli ingredienti; possono variare in base a marca e porzione.", // REVISAR
  nutritionSourceLabel: "Fonte di riferimento", // REVISAR
  nutritionDisclaimer: "Informazioni generali; non sostituiscono il parere di un professionista sanitario o della nutrizione qualificato.", // REVISAR
  calories: "Calorie", // REVISAR
  protein: "Proteine", // REVISAR
  carbs: "Carboidrati", // REVISAR
  fat: "Grassi", // REVISAR
  saturatedFat: "Grassi saturi", // REVISAR
  fiber: "Fibre", // REVISAR
  sugars: "Zuccheri", // REVISAR
  sodium: "Sodio", // REVISAR
  writtenBy: "Di", // REVISAR
  updatedOn: "Aggiornata il", // REVISAR
  videoTitle: "Video della ricetta", // REVISAR
  faqTitle: "Domande frequenti", // REVISAR
  sourcesTitle: "Fonti", // REVISAR
  close: "Chiudi", // REVISAR
  playVideo: "Riproduci il video", // REVISAR
  stepPhotosNote: "Le foto dei passaggi sono illustrative.", // REVISAR
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
  photoOf: "Immagine di",
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
  ratingHeading: "Valuta questa ricetta",
  ratingYourVote: "La tua valutazione",
  ratingThanks: "Grazie per il tuo voto!",
  ratingAverageOf5: "su 5",
  ratingVotesSuffix: "voti",
  ratingNoVotesYet: "Sii il primo a valutarla",
  ratingStarLabel: "stelle",
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
  editorialPoint1: "Instructions claires, étape par étape, avec une image illustrative pour chaque étape.",
  editorialPoint2: "Conseils de conservation, substitutions et FAQ pour chaque recette.", // REVISAR
  editorialPoint3: "Aucune donnée inventée : avis uniquement de vrais lecteurs et sources nutritionnelles citées.",
  editorialPoint4: "Enregistrez vos recettes préférées et partagez-les facilement.", // REVISAR
  editorialAuthorRole: "Chef · responsable éditorial", // REVISAR
  editorialAuthorBlurb: "Plus de 15 ans d'expérience en cuisine professionnelle en Amérique latine, aux États-Unis et en Espagne.", // REVISAR
  editorialAuthorCta: "Qui sommes-nous", // REVISAR
  seeAllRecipes: "Voir toutes les recettes", // REVISAR
  seeAllCategories: "Voir toutes les catégories", // REVISAR
  seeAllIngredients: "Explorer les ingrédients", // REVISAR
  recipeCatalog: "Toutes les recettes", // REVISAR
  categoryCatalog: "Catégories", // REVISAR
  ingredientCatalog: "Ingrédients", // REVISAR
  ingredientCatalogIntro: "Chaque ingrédient réunit les recettes réelles qui l'utilisent, avec sa photo et son nombre de recettes.", // REVISAR
  ingredientRecipeCountSuffix: "recettes", // REVISAR
  resultCount: "Recettes trouvées", // REVISAR
  recipesInCategory: "Recettes de cette catégorie", // REVISAR
  recipesWithIngredient: "Recettes avec cet ingrédient", // REVISAR
  navPantryTool: "Que cuisiner ?", // REVISAR
  pantryEyebrow: "Outil gratuit", // REVISAR
  pantryBannerTitle: "Que puis-je cuisiner avec ce que j'ai ?", // REVISAR
  pantryBannerBody: "Choisissez les ingrédients que vous avez dans votre cuisine et nous vous montrons les recettes que vous pouvez préparer maintenant.", // REVISAR
  pantryBannerCta: "Essayer l'outil", // REVISAR
  pantryToolHeading: "Que puis-je cuisiner avec ce que j'ai ?", // REVISAR
  pantryToolIntro: "Sélectionnez les ingrédients que vous avez déjà et nous vous montrons les recettes que vous pouvez préparer.", // REVISAR
  pantryMetaDescription: "Choisissez les ingrédients que vous avez chez vous et découvrez quelles recettes de Manual de Cocina vous pouvez préparer.", // REVISAR
  pantryPickerHeading: "Qu'avez-vous dans votre cuisine ?", // REVISAR
  pantrySearchPlaceholder: "Cherchez un ingrédient (ail, citron, riz...)", // REVISAR
  pantryClearSelection: "Effacer la sélection", // REVISAR
  pantryNoIngredientsFound: "Aucun ingrédient trouvé avec ce nom.", // REVISAR
  pantryResultsHeading: "Recettes que vous pouvez préparer", // REVISAR
  pantryEmptyNoSelection: "Choisissez au moins un ingrédient pour voir ce que vous pouvez cuisiner.", // REVISAR
  pantryEmptyNoMatches: "Nous n'avons pas encore de recette avec cette combinaison exacte. Essayez de retirer un ingrédient.", // REVISAR
  pantryComplete: "Vous avez tout !", // REVISAR
  pantryMissingPrefix: "Il manque :", // REVISAR
  pantryMissingSuffix: "ingrédients manquants", // REVISAR
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
  nutritionTitle: "Valeurs nutritionnelles", // REVISAR
  perServing: "par portion", // REVISAR
  nutritionEstimated: "Valeurs estimées à partir des ingrédients ; elles peuvent varier selon les marques et les portions.", // REVISAR
  nutritionSourceLabel: "Source de référence", // REVISAR
  nutritionDisclaimer: "Informations générales uniquement ; elles ne remplacent pas l’avis d’un professionnel de santé ou de la nutrition qualifié.", // REVISAR
  calories: "Calories", // REVISAR
  protein: "Protéines", // REVISAR
  carbs: "Glucides", // REVISAR
  fat: "Lipides", // REVISAR
  saturatedFat: "Acides gras saturés", // REVISAR
  fiber: "Fibres", // REVISAR
  sugars: "Sucres", // REVISAR
  sodium: "Sodium", // REVISAR
  writtenBy: "Par", // REVISAR
  updatedOn: "Mise à jour le", // REVISAR
  videoTitle: "Vidéo de la recette", // REVISAR
  faqTitle: "Questions fréquentes", // REVISAR
  sourcesTitle: "Sources", // REVISAR
  close: "Fermer", // REVISAR
  playVideo: "Lire la vidéo", // REVISAR
  stepPhotosNote: "Les photos des étapes sont illustratives.", // REVISAR
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
  photoOf: "Image de",
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
  ratingHeading: "Note cette recette",
  ratingYourVote: "Ta note",
  ratingThanks: "Merci pour ton vote !",
  ratingAverageOf5: "sur 5",
  ratingVotesSuffix: "votes",
  ratingNoVotesYet: "Sois la première personne à la noter",
  ratingStarLabel: "étoiles",
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
  editorialPoint1: "各手順にイメージ画像を添えて、わかりやすく紹介。",
  editorialPoint2: "保存方法、代用品、よくある質問を各レシピに掲載。", // REVISAR
  editorialPoint3: "架空のデータはなし。評価は実際の読者によるもの、栄養情報は出典を明記。",
  editorialPoint4: "お気に入りのレシピを保存して、簡単に共有できます。", // REVISAR
  editorialAuthorRole: "シェフ・編集責任者", // REVISAR
  editorialAuthorBlurb: "ラテンアメリカ、アメリカ、スペインで15年以上のプロの料理経験。", // REVISAR
  editorialAuthorCta: "私たちについて", // REVISAR
  seeAllRecipes: "すべてのレシピ", // REVISAR
  seeAllCategories: "すべてのカテゴリー", // REVISAR
  seeAllIngredients: "食材一覧", // REVISAR
  recipeCatalog: "すべてのレシピ", // REVISAR
  categoryCatalog: "カテゴリー", // REVISAR
  ingredientCatalog: "食材", // REVISAR
  ingredientCatalogIntro: "各食材には、それを使う実際のレシピと写真、レシピ数が表示されます。", // REVISAR
  ingredientRecipeCountSuffix: "件のレシピ", // REVISAR
  resultCount: "検索結果", // REVISAR
  recipesInCategory: "このカテゴリーのレシピ", // REVISAR
  recipesWithIngredient: "この食材を使うレシピ", // REVISAR
  navPantryTool: "何を作る?", // REVISAR
  pantryEyebrow: "無料ツール", // REVISAR
  pantryBannerTitle: "今ある材料で何が作れる?", // REVISAR
  pantryBannerBody: "キッチンにある材料を選ぶと、今すぐ作れるレシピを表示します。", // REVISAR
  pantryBannerCta: "ツールを試す", // REVISAR
  pantryToolHeading: "今ある材料で何が作れる?", // REVISAR
  pantryToolIntro: "持っている材料を選ぶと、作れるレシピを表示します。", // REVISAR
  pantryMetaDescription: "家にある材料を選んで、Manual de Cocinaで今すぐ作れるレシピを見つけましょう。", // REVISAR
  pantryPickerHeading: "キッチンに何がありますか?", // REVISAR
  pantrySearchPlaceholder: "材料を検索(にんにく、レモン、米など)", // REVISAR
  pantryClearSelection: "選択をクリア", // REVISAR
  pantryNoIngredientsFound: "その名前の材料は見つかりませんでした。", // REVISAR
  pantryResultsHeading: "作れるレシピ", // REVISAR
  pantryEmptyNoSelection: "材料を1つ以上選んでください。", // REVISAR
  pantryEmptyNoMatches: "この組み合わせのレシピはまだありません。材料を減らしてみてください。", // REVISAR
  pantryComplete: "すべて揃っています!", // REVISAR
  pantryMissingPrefix: "不足:", // REVISAR
  pantryMissingSuffix: "個の材料が不足", // REVISAR
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
  nutritionTitle: "栄養成分", // REVISAR
  perServing: "1人分", // REVISAR
  nutritionEstimated: "材料から算出した推定値です。ブランドや分量により異なる場合があります。", // REVISAR
  nutritionSourceLabel: "参考情報源", // REVISAR
  nutritionDisclaimer: "一般的な情報を目的としており、資格を持つ医療・栄養専門家の助言に代わるものではありません。", // REVISAR
  calories: "カロリー", // REVISAR
  protein: "たんぱく質", // REVISAR
  carbs: "炭水化物", // REVISAR
  fat: "脂質", // REVISAR
  saturatedFat: "飽和脂肪酸", // REVISAR
  fiber: "食物繊維", // REVISAR
  sugars: "糖類", // REVISAR
  sodium: "ナトリウム", // REVISAR
  writtenBy: "著者", // REVISAR
  updatedOn: "更新日", // REVISAR
  videoTitle: "レシピ動画", // REVISAR
  faqTitle: "よくある質問", // REVISAR
  sourcesTitle: "出典", // REVISAR
  close: "閉じる", // REVISAR
  playVideo: "動画を再生", // REVISAR
  stepPhotosNote: "手順の写真はイメージです。", // REVISAR
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
  photoOf: "画像：",
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
  ratingHeading: "このレシピを評価する",
  ratingYourVote: "あなたの評価",
  ratingThanks: "評価ありがとうございます！",
  ratingAverageOf5: "/ 5",
  ratingVotesSuffix: "件の評価",
  ratingNoVotesYet: "最初に評価してみましょう",
  ratingStarLabel: "つ星",
};

export type MdCopy = Record<keyof typeof es, string>;
const pt = {
  navRecipes: "Receitas",
  navCategories: "Categorias",
  navIngredients: "Ingredientes",
  searchLabel: "Buscar receitas",
  searchPlaceholder: "Busque por prato ou ingrediente",
  searchButton: "Buscar",
  openMenu: "Abrir menu",
  closeMenu: "Fechar menu",
  featured: "Receita em destaque",
  viewRecipe: "Ver receita",
  latest: "Publicadas recentemente",
  homeHeading: "Cozinhar começa com uma boa receita",
  homeLead: "Ideias para encontrar sua próxima receita, com ingredientes claros e passos fáceis de seguir.",
  browseCategories: "Explore por categoria",
  browseIngredients: "Comece por um ingrediente",
  editorialTitle: "Receitas para voltar a cozinhar",
  editorialBody: "O Manual de Cocina reúne receitas de diferentes cozinhas para consultar, preparar e compartilhar, com instruções claras e navegação simples.",
  editorialPoint1: "Instruções claras, passo a passo, com uma imagem ilustrativa de cada passo.",
  editorialPoint2: "Dicas de conservação, substituições e perguntas frequentes em cada receita.",
  editorialPoint3: "Sem dados inventados: avaliações só de leitores reais e fontes nutricionais citadas.",
  editorialPoint4: "Salve suas receitas favoritas e compartilhe facilmente.",
  editorialAuthorRole: "Chef · responsável editorial",
  editorialAuthorBlurb: "Mais de 15 anos de experiência em cozinha profissional na América Latina, Estados Unidos e Espanha.",
  editorialAuthorCta: "Quem somos",
  seeAllRecipes: "Ver todas as receitas",
  seeAllCategories: "Ver todas as categorias",
  seeAllIngredients: "Ver ingredientes",
  recipeCatalog: "Todas as receitas",
  categoryCatalog: "Categorias",
  ingredientCatalog: "Ingredientes",
  ingredientCatalogIntro: "Cada ingrediente reúne as receitas reais que o usam, com foto e o número de receitas disponíveis.",
  ingredientRecipeCountSuffix: "receitas",
  resultCount: "Receitas encontradas",
  recipesInCategory: "Receitas desta categoria",
  recipesWithIngredient: "Receitas com este ingrediente",
  navPantryTool: "O que eu cozinho?",
  pantryEyebrow: "Ferramenta gratuita",
  pantryBannerTitle: "O que posso cozinhar com o que tenho?",
  pantryBannerBody: "Escolha os ingredientes que você tem na cozinha e mostramos quais receitas você pode preparar agora, sem precisar comprar nada.",
  pantryBannerCta: "Experimentar a ferramenta",
  pantryToolHeading: "O que posso cozinhar com o que tenho?",
  pantryToolIntro: "Marque os ingredientes que você já tem e mostramos as receitas que você pode preparar, ordenadas por quantos ingredientes faltam.",
  pantryMetaDescription: "Escolha os ingredientes que você tem em casa e descubra quais receitas do Manual de Cocina você pode preparar agora.",
  pantryPickerHeading: "O que você tem na sua cozinha?",
  pantrySearchPlaceholder: "Busque um ingrediente (alho, limão, arroz...)",
  pantryClearSelection: "Limpar seleção",
  pantryNoIngredientsFound: "Não encontramos nenhum ingrediente com esse nome.",
  pantryResultsHeading: "Receitas que você pode preparar",
  pantryEmptyNoSelection: "Escolha pelo menos um ingrediente para ver o que pode cozinhar.",
  pantryEmptyNoMatches: "Ainda não temos nenhuma receita com essa combinação exata. Tente remover algum ingrediente.",
  pantryComplete: "Você tem tudo!",
  pantryMissingPrefix: "Faltam:",
  pantryMissingSuffix: "ingredientes para conseguir",
  filterHeading: "Encontre sua receita",
  category: "Categoria",
  cuisine: "Cozinha",
  difficulty: "Dificuldade",
  ingredient: "Ingrediente",
  time: "Tempo",
  sort: "Ordenar",
  mostRecent: "Mais recentes",
  oldest: "Mais antigas",
  any: "Todas",
  applyFilters: "Aplicar filtros",
  clearFilters: "Limpar filtros",
  activeFilters: "Filtros ativos",
  removeFilter: "Remover filtro",
  previousPage: "Anterior",
  nextPage: "Próxima",
  page: "Página",
  noRecipes: "Não encontramos receitas com esses filtros.",
  emptyHint: "Tente outra busca ou remova algum filtro.",
  noPhoto: "Receita sem foto",
  recipeContents: "Nesta receita",
  ingredients: "Ingredientes",
  preparation: "Modo de preparo",
  notes: "Notas",
  keyPoint: "O ponto-chave",
  aboutRecipe: "Sobre esta receita",
  toggleTheme: "Alternar entre tema claro e escuro",
  nutritionTitle: "Informação nutricional",
  perServing: "por porção",
  nutritionEstimated: "Valores estimados a partir dos ingredientes; podem variar conforme marcas e porções.",
  nutritionSourceLabel: "Fonte de referência",
  nutritionDisclaimer: "Informação geral; não substitui a orientação de um profissional qualificado de saúde ou nutrição.",
  calories: "Calorias",
  protein: "Proteínas",
  carbs: "Carboidratos",
  fat: "Gorduras",
  saturatedFat: "Gorduras saturadas",
  fiber: "Fibras",
  sugars: "Açúcares",
  sodium: "Sódio",
  writtenBy: "Por",
  updatedOn: "Atualizada em",
  videoTitle: "Vídeo da receita",
  faqTitle: "Perguntas frequentes",
  sourcesTitle: "Fontes",
  close: "Fechar",
  playVideo: "Reproduzir vídeo",
  stepPhotosNote: "As fotos dos passos são ilustrativas.",
  relatedRecipes: "Você também pode gostar",
  totalTime: "Tempo total",
  servings: "Porções",
  save: "Salvar",
  saved: "Salva",
  share: "Compartilhar",
  print: "Imprimir",
  cookingMode: "Modo cozinha",
  closeCooking: "Fechar modo cozinha",
  previousStep: "Passo anterior",
  nextStep: "Próximo passo",
  finish: "Concluir",
  step: "Passo",
  of: "de",
  photoOf: "Imagem de",
  about: "Quem somos",
  contact: "Contato",
  editorialPolicy: "Política editorial",
  privacy: "Privacidade",
  cookies: "Cookies",
  terms: "Termos",
  legalNotice: "Aviso legal",
  intellectualProperty: "Propriedade intelectual",
  footerIntro: "Receitas para descobrir, cozinhar e preparar de novo.",
  institutional: "Informações",
  legal: "Legal",
  notFoundTitle: "Esta página não existe",
  notFoundBody: "O link pode ter mudado. Volte ao início ou explore as receitas.",
  backHome: "Voltar ao início",
  skipToContent: "Pular para o conteúdo",
  emptyTitle: "Este conteúdo ainda está crescendo",
  emptyBody: "Enquanto isso, você pode explorar todas as receitas.",
  ratingHeading: "Avalie esta receita",
  ratingYourVote: "Sua avaliação",
  ratingThanks: "Obrigado pelo seu voto!",
  ratingAverageOf5: "de 5",
  ratingVotesSuffix: "votos",
  ratingNoVotesYet: "Seja a primeira pessoa a avaliar",
  ratingStarLabel: "estrelas",
} as const; // REVISAR: revisão por falante nativo antes de divulgar

export const mdCopy: Record<MdLanguage, MdCopy> = { es, en, de, it, fr, ja, pt };
export function getMdCopy(lang: MdLanguage): MdCopy { return mdCopy[lang] ?? mdCopy.es; }

import type { RecipeLanguage } from '@/types/recipe'

const COPY = {
  es: ['Así funciona', 'Marca los ingredientes que tienes.', 'Pulsa el botón para ver recetas.', 'Primero aparecen las recetas para las que te falta menos.', 'Marca uno o varios ingredientes para empezar.', 'Ver qué puedo cocinar', 'Actualizar recetas', 'Ver ingredientes', 'ingrediente seleccionado', 'ingredientes seleccionados', 'Ingrediente adicional en proceso de catalogación', 'Ingredientes adicionales en proceso de catalogación'],
  en: ['How it works', 'Select the ingredients you have.', 'Press the button to see recipes.', 'Recipes with the fewest missing ingredients appear first.', 'Select one or more ingredients to start.', 'See what I can cook', 'Update recipes', 'View ingredients', 'ingredient selected', 'ingredients selected', 'Additional ingredient being catalogued', 'Additional ingredients being catalogued'],
  de: ['So funktioniert es', 'Wähle die Zutaten aus, die du hast.', 'Drücke den Button, um Rezepte zu sehen.', 'Rezepte mit den wenigsten fehlenden Zutaten erscheinen zuerst.', 'Wähle eine oder mehrere Zutaten aus.', 'Zeige, was ich kochen kann', 'Rezepte aktualisieren', 'Zutaten ansehen', 'Zutat ausgewählt', 'Zutaten ausgewählt', 'Weitere Zutat wird katalogisiert', 'Weitere Zutaten werden katalogisiert'],
  fr: ['Comment ça marche', 'Sélectionnez les ingrédients que vous avez.', 'Appuyez sur le bouton pour voir les recettes.', 'Les recettes avec le moins d’ingrédients manquants apparaissent en premier.', 'Sélectionnez un ou plusieurs ingrédients pour commencer.', 'Voir ce que je peux cuisiner', 'Actualiser les recettes', 'Voir les ingrédients', 'ingrédient sélectionné', 'ingrédients sélectionnés', 'Ingrédient supplémentaire en cours de classement', 'Ingrédients supplémentaires en cours de classement'],
  it: ['Come funziona', 'Seleziona gli ingredienti che hai.', 'Premi il pulsante per vedere le ricette.', 'Le ricette con meno ingredienti mancanti appaiono per prime.', 'Seleziona uno o più ingredienti per iniziare.', 'Scopri cosa posso cucinare', 'Aggiorna ricette', 'Vedi ingredienti', 'ingrediente selezionato', 'ingredienti selezionati', 'Ingrediente aggiuntivo in fase di catalogazione', 'Ingredienti aggiuntivi in fase di catalogazione'],
  ja: ['使い方', '持っている材料を選びます。', 'ボタンを押してレシピを表示します。', '不足する材料が少ないレシピから表示します。', '材料を1つ以上選んで始めましょう。', '作れる料理を見る', 'レシピを更新', '材料を見る', '個の材料を選択中', '個の材料を選択中', '追加の材料を登録中', '追加の材料を登録中'],
  pt: ['Como funciona', 'Marque os ingredientes que você tem.', 'Pressione o botão para ver as receitas.', 'As receitas com menos ingredientes faltando aparecem primeiro.', 'Marque um ou mais ingredientes para começar.', 'Ver o que posso cozinhar', 'Atualizar receitas', 'Ver ingredientes', 'ingrediente selecionado', 'ingredientes selecionados', 'Ingrediente adicional em processo de catalogação', 'Ingredientes adicionais em processo de catalogação'],
} satisfies Record<RecipeLanguage, string[]>

export function getPantryCopy(lang: RecipeLanguage) {
  const [how, step1, step2, step3, start, view, update, checklist, selectedOne, selectedMany, pendingOne, pendingMany] = COPY[lang]
  return { how, step1, step2, step3, start, view, update, checklist,
    selected: (n: number) => `${n}${lang === 'ja' ? '' : ' '}${n === 1 ? selectedOne : selectedMany}`,
    pending: (n: number) => `${n} · ${n === 1 ? pendingOne : pendingMany}` }
}

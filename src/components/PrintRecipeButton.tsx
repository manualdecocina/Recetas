'use client'

export function PrintRecipeButton() {
  return (
    <button type="button" className="print-recipe-button" onClick={() => window.print()} aria-label="Imprimir receta">
      Imprimir receta
    </button>
  )
}

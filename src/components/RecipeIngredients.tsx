'use client'

import { useEffect, useState } from 'react'

type Ingredient = { amount: string; unit?: string; name: string; preparation?: string; note?: string }

export function RecipeIngredients({ recipeId, ingredients }: { recipeId: string | number; ingredients: Ingredient[] }) {
  const key = `manualdecocina:ingredients:${recipeId}`
  const [checked, setChecked] = useState<Record<number, boolean>>({})

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(key)
      if (raw) setChecked(JSON.parse(raw))
    } catch {}
  }, [key])

  function toggle(index: number) {
    setChecked((current) => {
      const next = { ...current, [index]: !current[index] }
      try { window.localStorage.setItem(key, JSON.stringify(next)) } catch {}
      return next
    })
  }

  return (
    <ul className="recipe-ingredients">
      {ingredients.map((ing, i) => {
        const hasAmount = Boolean(ing.amount?.trim())
        const hasUnit = Boolean(ing.unit?.trim())
        const hasPreparation = Boolean(ing.preparation?.trim())
        const hasNote = Boolean(ing.note?.trim())
        return (
          <li key={i} className={checked[i] ? 'is-checked' : ''}>
            <label>
              <input type="checkbox" checked={Boolean(checked[i])} onChange={() => toggle(i)} />
              <span className="recipe-ingredient__text">
                {hasAmount && <span className="recipe-ingredient__amount">{ing.amount}</span>}
                {hasUnit && <span className="recipe-ingredient__unit">{ing.unit}</span>}
                <span className="recipe-ingredient__name">{ing.name}</span>
                {hasPreparation && <span className="recipe-ingredient__preparation">, {ing.preparation}</span>}
                {hasNote && <span className="recipe-ingredient__note"> ({ing.note})</span>}
              </span>
            </label>
          </li>
        )
      })}
    </ul>
  )
}

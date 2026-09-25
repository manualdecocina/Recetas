'use client'

import { useEffect, useState } from 'react'

type Ingredient = { amount: string; unit?: string; name: string }

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
        const label = [ing.amount, ing.unit, ing.name].filter(Boolean).join(' ')
        return (
          <li key={i} className={checked[i] ? 'is-checked' : ''}>
            <label>
              <input type="checkbox" checked={Boolean(checked[i])} onChange={() => toggle(i)} />
              <span>{label}</span>
            </label>
          </li>
        )
      })}
    </ul>
  )
}

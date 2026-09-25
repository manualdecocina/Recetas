'use client'

import { useEffect, useState } from 'react'

const STORAGE_KEY = 'manualdecocina:favorites'

function readFavorites(): string[] {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    const parsed = raw ? JSON.parse(raw) : []
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

export function FavoriteStar({ recipeId }: { recipeId: string | number }) {
  const key = String(recipeId)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    setSaved(readFavorites().includes(key))
  }, [key])

  function toggleFavorite() {
    const favorites = readFavorites()
    const next = favorites.includes(key)
      ? favorites.filter((id) => id !== key)
      : [...favorites, key]

    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
      setSaved(next.includes(key))
      window.dispatchEvent(new CustomEvent('manualdecocina:favorites-changed'))
    } catch {
      // Si el navegador bloquea el almacenamiento, la receta sigue funcionando.
    }
  }

  return (
    <button
      type="button"
      className={`favorite-star${saved ? ' is-saved' : ''}`}
      onClick={toggleFavorite}
      aria-pressed={saved}
      aria-label={saved ? 'Quitar de favoritas' : 'Guardar en favoritas'}
      title={saved ? 'Quitar de favoritas' : 'Guardar en favoritas'}
    >
      <span aria-hidden="true">★</span>
    </button>
  )
}

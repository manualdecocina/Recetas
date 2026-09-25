'use client'

import { useState } from 'react'

export function ShareRecipeButton({ title }: { title: string }) {
  const [copied, setCopied] = useState(false)

  async function share() {
    const url = window.location.href
    const data = { title, text: `Mira esta receta en Manual de Cocina: ${title}`, url }
    try {
      if (navigator.share && (!navigator.canShare || navigator.canShare(data))) {
        await navigator.share(data)
        return
      }
      await navigator.clipboard.writeText(url)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 1800)
    } catch {}
  }

  return (
    <button type="button" className="share-recipe-button" onClick={share}>
      {copied ? 'Enlace copiado' : 'Compartir receta'}
    </button>
  )
}

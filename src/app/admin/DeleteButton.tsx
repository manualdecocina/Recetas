'use client'

export function DeleteButton({ title }: { title: string }) {
  return (
    <button
      type="submit"
      onClick={(event) => {
        if (!window.confirm(`¿Eliminar "${title}"? Esta acción no se puede deshacer.`)) {
          event.preventDefault()
        }
      }}
    >
      Eliminar
    </button>
  )
}

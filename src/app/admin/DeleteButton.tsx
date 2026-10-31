'use client'

export function DeleteButton({ title }: { title: string }) {
  return (
    <button
      type="submit"
      className="adm-link-danger"
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

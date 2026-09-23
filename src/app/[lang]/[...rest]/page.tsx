import { notFound } from 'next/navigation'

// Cualquier ruta inexistente bajo /{idioma}/... responde 404 dentro del layout del
// idioma (con su <html lang>), en vez de caer en el 404 genérico sin layout.
export default function CatchAllNotFound() {
  notFound()
}

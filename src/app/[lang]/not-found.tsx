import Link from 'next/link'

// 404 mínimo (sin diseño en esta fase). Next 14 no pasa params a not-found,
// por eso el texto es neutro y el enlace lleva a la raíz (que redirige a /es).
export default function NotFound() {
  return (
    <main>
      <h1>404</h1>
      <p>
        <Link href="/">Manual de Cocina</Link>
      </p>
    </main>
  )
}

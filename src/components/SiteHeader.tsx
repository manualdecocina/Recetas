import Link from 'next/link'
import Image from 'next/image'

const links = [
  ['Recetas', '/recetas/'],
  ['Categorías', '/categorias/'],
  ['Colecciones', '/colecciones/'],
  ['Guías', '/guias/'],
]

export function SiteHeader({ lang }: { lang: string }) {
  return (
    <header className="site-header">
      <div className="site-header__inner">
        <Link className="brand" href={'/' + lang} aria-label="Manual de Cocina, inicio">
          <Image
            className="brand__logo"
            src="https://manualdecocina.com/wp-content/uploads/2026/06/Logo-Manual-de-Cocina.png"
            alt="Manual de Cocina"
            width={360}
            height={120}
            priority
          />
        </Link>

        <nav className="site-nav" aria-label="Principal">
          {links.map(([label, href]) => <Link key={href} href={'/' + lang + href}>{label}</Link>)}
        </nav>

        <Link className="header-search" href={'/' + lang + '/recetas/'} aria-label="Buscar recetas">
          <span aria-hidden="true">⌕</span>
          <span>Buscar</span>
        </Link>

        <details className="mobile-menu">
          <summary>Menú</summary>
          <nav aria-label="Menú móvil">
            {links.map(([label, href]) => <Link key={href} href={'/' + lang + href}>{label}</Link>)}
            <Link href={'/' + lang + '/ingredientes/'}>Ingredientes</Link>
            <Link href={'/' + lang + '/quienes-somos/'}>Quiénes somos</Link>
            <Link href={'/' + lang + '/contacto/'}>Contacto</Link>
          </nav>
        </details>
      </div>
    </header>
  )
}

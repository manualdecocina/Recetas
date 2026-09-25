import Link from 'next/link'

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
          <span className="brand__mark" aria-hidden="true">
            <span className="brand__fold" />
            <span className="brand__pot"><i /><i /><i /></span>
          </span>
          <span className="brand__text">
            <strong>manual</strong>
            <small>de cocina</small>
          </span>
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

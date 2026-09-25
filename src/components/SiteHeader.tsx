import Link from 'next/link'

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
          <Link href={'/' + lang + '/recetas'}>Recetas</Link>
          <Link href={'/' + lang + '/categorias'}>Categorías</Link>
          <Link href={'/' + lang + '/colecciones'}>Colecciones</Link>
          <Link href={'/' + lang + '/guias'}>Guías</Link>
        </nav>
        <Link className="header-search" href={'/' + lang + '/recetas'} aria-label="Buscar recetas">
          <span aria-hidden="true">⌕</span>
          <span>Buscar</span>
        </Link>
      </div>
    </header>
  )
}

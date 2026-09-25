import Link from 'next/link'

const links = [
  ['Recetas', '/recetas/'],
  ['Ingredientes', '/ingredientes/'],
  ['Técnicas', '/aprender-tecnicas/'],
  ['Escuela', '/escuela/'],
] as const

export function SiteHeader({ lang }: { lang: string }) {
  return (
    <header className="mc-header">
      <div className="mc-header__inner">
        <Link className="mc-brand" href={'/' + lang} aria-label="Manual de Cocina, inicio">
          <img src="/brand/manual-master.svg" alt="Manual de Cocina" />
        </Link>

        <nav className="mc-nav" aria-label="Principal">
          {links.map(([label, href]) => (
            <Link key={href} href={'/' + lang + href}>{label}</Link>
          ))}
        </nav>

        <div className="mc-header__actions">
          <Link className="mc-search" href={'/' + lang + '/recetas/'} aria-label="Buscar recetas">
            <span aria-hidden="true">⌕</span>
          </Link>
          <details className="mc-menu">
            <summary>Menú</summary>
            <nav aria-label="Menú">
              {links.map(([label, href]) => (
                <Link key={href} href={'/' + lang + href}>{label}</Link>
              ))}
            </nav>
          </details>
        </div>
      </div>
    </header>
  )
}

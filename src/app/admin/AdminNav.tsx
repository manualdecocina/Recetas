import Link from 'next/link'
import { signOutAction } from './actions'

const LINKS = [
  { key: 'cola', href: '/admin', label: 'Cola de publicación' },
  { key: 'salud', href: '/admin/salud', label: 'Salud del sitio' },
  { key: 'todas', href: '/admin/todas', label: 'Todas las recetas' },
] as const

/** Barra común del panel. */
export function AdminNav({ current }: { current: (typeof LINKS)[number]['key'] }) {
  return (
    <header className="adm-header">
      <nav className="adm-nav adm-main-nav" aria-label="Panel">
        {LINKS.map((link) => (
          <Link key={link.key} href={link.href} aria-current={link.key === current ? 'page' : undefined}>{link.label}</Link>
        ))}
        <a href="/es" target="_blank" rel="noreferrer">Ver la web ↗</a>
      </nav>
      <form action={signOutAction}><button type="submit" className="adm-link-button">Cerrar sesión</button></form>
    </header>
  )
}

import Link from 'next/link'
import { signOutAction } from './actions'
import { AdminThemeToggle } from './AdminThemeToggle'

const LINKS = [
  { key: 'cola', href: '/admin', label: 'Cola de publicación' },
  { key: 'salud', href: '/admin/salud', label: 'Salud del sitio' },
  { key: 'todas', href: '/admin/todas', label: 'Todas las recetas' },
] as const

/** Barra común del panel: fija arriba, con el tema oscuro/claro y cerrar sesión. */
export function AdminNav({ current }: { current: (typeof LINKS)[number]['key'] }) {
  return (
    <header className="adm-header">
      <Link href="/admin" className="adm-brand"><span className="adm-brand-dot" aria-hidden="true">M</span>Panel</Link>
      <nav className="adm-nav adm-main-nav" aria-label="Panel">
        {LINKS.map((link) => (
          <Link key={link.key} href={link.href} aria-current={link.key === current ? 'page' : undefined}>{link.label}</Link>
        ))}
        <a href="/es" target="_blank" rel="noreferrer">Ver la web ↗</a>
      </nav>
      <div className="adm-header-tools">
        <AdminThemeToggle />
        <form action={signOutAction}><button type="submit" className="adm-link-button">Cerrar sesión</button></form>
      </div>
    </header>
  )
}

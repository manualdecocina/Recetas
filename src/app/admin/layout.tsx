import type { Metadata } from 'next'
import '../globals.css'
import './admin.css'
import { editorialSerif, uiSans } from '../fonts'

// Layout raíz del panel (separado del sitio público). Nunca indexable.
export const metadata: Metadata = {
  title: 'Panel — Manual de Cocina',
  robots: { index: false, follow: false },
}

export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={`${editorialSerif.variable} ${uiSans.variable}`}>
      <body className="adm-body">{children}</body>
    </html>
  )
}

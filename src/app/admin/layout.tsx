import type { Metadata } from 'next'
import '../globals.css'
import './admin.css'
import { editorialSerif, uiSans } from '../fonts'

// Layout raíz del panel (separado del sitio público). Nunca indexable.
export const metadata: Metadata = {
  title: 'Panel — Manual de Cocina',
  robots: { index: false, follow: false },
}

// Oscuro por defecto (como pidió el chef). Si eligió claro, se aplica antes de pintar para que no parpadee.
const THEME_SCRIPT = "try{if(localStorage.getItem('md-admin-theme')==='light')document.documentElement.dataset.theme='light'}catch(e){}"

export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" data-theme="dark" suppressHydrationWarning className={`${editorialSerif.variable} ${uiSans.variable}`}>
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_SCRIPT }} />
      </head>
      <body className="adm-body">{children}</body>
    </html>
  )
}

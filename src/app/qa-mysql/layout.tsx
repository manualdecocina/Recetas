import type { Metadata } from 'next'
import '../globals.css'
import { editorialSerif, uiSans } from '../fonts'

/** Layout raíz exclusivo de /qa-mysql: nunca afecta /es, /admin ni producción. */
export const metadata: Metadata = {
  title: 'Vista previa MySQL — Manual de Cocina',
  robots: { index: false, follow: false },
}

export default function MysqlQAStandaloneLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={`${editorialSerif.variable} ${uiSans.variable}`}>
      <body>{children}</body>
    </html>
  )
}

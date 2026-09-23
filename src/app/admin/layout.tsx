import type { Metadata } from 'next'

// Layout raíz del panel (separado del sitio público). Nunca indexable.
export const metadata: Metadata = {
  title: 'Panel — Manual de Cocina',
  robots: { index: false, follow: false },
}

export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  )
}

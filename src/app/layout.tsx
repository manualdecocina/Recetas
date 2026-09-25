import type { Metadata } from 'next'
import './globals.css'
import './editorial.css'
import './home-discovery.css'
import { getSiteUrl, isIndexingAllowed } from '@/lib/site'

const allowIndexing = isIndexingAllowed()

export const metadata: Metadata = {
  metadataBase: new URL(getSiteUrl()),
  title: 'Manual de Cocina',
  robots: { index: allowIndexing, follow: allowIndexing },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  )
}

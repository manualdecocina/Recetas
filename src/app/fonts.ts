import { Bricolage_Grotesque, Figtree } from 'next/font/google'

// Diseño "Mercado": ambos son variable fonts. Al no fijar arrays de pesos, next/font usa
// el archivo variable y evita descargar una familia separada por cada peso usado.
export const editorialSerif = Bricolage_Grotesque({
  subsets: ['latin'],
  variable: '--font-editorial-serif',
  display: 'swap',
})

export const uiSans = Figtree({
  subsets: ['latin'],
  variable: '--font-ui-sans',
  display: 'swap',
})

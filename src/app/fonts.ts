import { Bricolage_Grotesque, Figtree } from 'next/font/google'

// Diseño "Mercado": Bricolage Grotesque para títulos (variable --font-editorial-serif, nombre
// conservado para no tocar el resto del código) y Figtree para interfaz y texto.
export const editorialSerif = Bricolage_Grotesque({
  subsets: ['latin'],
  weight: ['600', '700', '800'],
  variable: '--font-editorial-serif',
  display: 'swap',
})

export const uiSans = Figtree({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-ui-sans',
  display: 'swap',
})

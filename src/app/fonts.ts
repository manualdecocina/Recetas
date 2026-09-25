import { Cormorant_Garamond, Inter } from 'next/font/google'

export const editorialSerif = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-editorial-serif',
  display: 'swap',
})

export const uiSans = Inter({
  subsets: ['latin'],
  variable: '--font-ui-sans',
  display: 'swap',
})

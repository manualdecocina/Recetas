import type { MetadataRoute } from 'next'

// Manifest PWA. Sin esto, Chrome/Android no tienen forma de saber qué icono usar
// al "Añadir a pantalla de inicio" y generan uno propio (recortado sobre un fondo
// blanco) a partir del favicon — el "borde blanco" reportado por el usuario.
// Los iconos son a sangre completa (negro de marca #171614 borde a borde, sin
// esquinas transparentes) para que ese relleno automático nunca sea necesario.
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Manual de Cocina',
    short_name: 'Manual de Cocina',
    description: 'Recetas claras, paso a paso, con imágenes ilustrativas.',
    start_url: '/',
    display: 'standalone',
    background_color: '#171614',
    theme_color: '#171614',
    icons: [
      { src: '/icon.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
      { src: '/apple-icon.png', sizes: '180x180', type: 'image/png', purpose: 'any' },
    ],
  }
}

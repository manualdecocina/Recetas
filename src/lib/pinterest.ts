import { absoluteUrl } from '@/lib/site'

/** Enlace al formulario oficial "Guardar" de Pinterest (sin scripts de terceros). */
export function pinterestSaveUrl({ url, image, description }: { url: string; image: string; description: string }): string {
  const params = new URLSearchParams({ url, media: absoluteUrl(image), description })
  return `https://www.pinterest.com/pin/create/button/?${params.toString()}`
}

import { getSiteUrl } from '@/lib/site'

// English discovery alias only. No duplicate indexable page: permanent redirect
// to the existing Spanish canonical About page, preserving SEO and navigation.
export function GET() {
  return Response.redirect(new URL('/es/quienes-somos', getSiteUrl()), 308)
}

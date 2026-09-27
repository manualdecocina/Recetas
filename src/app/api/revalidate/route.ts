import { NextRequest, NextResponse } from 'next/server'
import { revalidateTag } from 'next/cache'
import { RECIPES_CACHE_TAG } from '@/lib/cache'

// Ruta de revalidación bajo demanda, protegida por secreto compartido.
//
// Por qué existe: todas las lecturas públicas de recetas se sirven desde el Data
// Cache de Next (etiqueta RECIPES_CACHE_TAG, ver src/lib/supabase/public.ts) y ese
// caché normalmente se purga con revalidateTag() dentro de las Server Actions del
// panel (src/app/admin/actions.ts). Una escritura que NO pasa por el panel —SQL
// directo en Supabase, un script de importación— no dispara esa invalidación: el
// contenido nuevo queda visible de inmediato en su propia página (primera visita =
// caché MISS = datos frescos) pero la home, /recetas y el sitemap siguen sirviendo
// la versión cacheada hasta el respaldo de 1 hora (PUBLIC_REVALIDATE_SECONDS).
// Esta ruta permite forzar esa invalidación al instante desde fuera del panel.
// Documentado como pendiente en docs/cache.md, "Limitaciones conocidas".
//
// Configuración requerida en el servidor (Hostinger, preview y producción):
//   REVALIDATE_SECRET=<valor secreto elegido>
// Uso: POST o GET a /api/revalidate con el secreto en el header `x-revalidate-secret`
// o en la query `?secret=...`. Sin REVALIDATE_SECRET configurado, la ruta responde
// 500 en vez de quedar abierta sin protección.

function handleRevalidate(request: NextRequest) {
  const secret = process.env.REVALIDATE_SECRET
  if (!secret) {
    return NextResponse.json(
      { error: 'REVALIDATE_SECRET no está configurado en el servidor.' },
      { status: 500 },
    )
  }

  const provided = request.headers.get('x-revalidate-secret') ?? request.nextUrl.searchParams.get('secret')
  if (provided !== secret) {
    return NextResponse.json({ error: 'No autorizado.' }, { status: 401 })
  }

  revalidateTag(RECIPES_CACHE_TAG, 'max')
  return NextResponse.json({ revalidated: true, tag: RECIPES_CACHE_TAG, at: new Date().toISOString() })
}

export async function POST(request: NextRequest) {
  return handleRevalidate(request)
}

export async function GET(request: NextRequest) {
  return handleRevalidate(request)
}

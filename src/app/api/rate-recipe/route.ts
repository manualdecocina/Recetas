import { createHmac, randomUUID } from 'node:crypto'
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { readRatingsSecrets } from '@/lib/ratings-config'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? 'https://eqbdtctxbpepbeickhqi.supabase.co'
const ratingsEnabled = process.env.NEXT_PUBLIC_RATINGS_ENABLED === 'true'

function disabled() {
  return NextResponse.json({ error: 'Valoraciones no disponibles.' }, { status: 404 })
}

export async function POST(request: NextRequest) {
  if (!ratingsEnabled) return disabled()

  const { serviceKey, hashSecret } = readRatingsSecrets(process.env)

  // Fail closed: nunca usar anon/publishable para una escritura privilegiada.
  if (!serviceKey || !hashSecret) {
    console.error('[ratings] configuración incompleta', { serviceKeyConfigured: Boolean(serviceKey), hashSecretConfigured: Boolean(hashSecret) })
    return NextResponse.json({ error: 'Valoraciones temporalmente no disponibles.' }, { status: 503 })
  }

  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'JSON inválido.' }, { status: 400 })
  }

  const recipeId = (body as { recipeId?: unknown })?.recipeId
  const rating = (body as { rating?: unknown })?.rating

  if (typeof recipeId !== 'string' || !/^[0-9a-f-]{36}$/i.test(recipeId)) {
    return NextResponse.json({ error: 'recipeId inválido.' }, { status: 400 })
  }
  if (typeof rating !== 'number' || !Number.isInteger(rating) || rating < 1 || rating > 5) {
    return NextResponse.json({ error: 'rating debe ser un entero entre 1 y 5.' }, { status: 400 })
  }

  const existingVisitorId = request.cookies.get('md-rating-id')?.value
  const visitorId = existingVisitorId && /^[0-9a-f-]{36}$/i.test(existingVisitorId)
    ? existingVisitorId
    : randomUUID()
  const forwardedFor = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? ''
  const userAgent = request.headers.get('user-agent') ?? ''
  const voterHash = createHmac('sha256', hashSecret)
    .update(`${visitorId}|${forwardedFor}|${userAgent}`)
    .digest('hex')

  const supabaseServer = createClient(supabaseUrl, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  })

  const { data, error } = await supabaseServer.rpc('rate_recipe_once', {
    p_recipe_id: recipeId,
    p_rating: rating,
    p_voter_hash: voterHash,
  })

  if (error) {
    const duplicate = /ya votó esta receta/i.test(error.message)
    const response = NextResponse.json(
      { error: duplicate ? 'Ya registramos tu valoración para esta receta.' : 'No se pudo registrar la valoración.' },
      { status: duplicate ? 409 : 400 },
    )
    if (!existingVisitorId) {
      response.cookies.set('md-rating-id', visitorId, {
        httpOnly: true,
        secure: true,
        sameSite: 'lax',
        path: '/',
        maxAge: 60 * 60 * 24 * 365,
      })
    }
    return response
  }

  const row = Array.isArray(data) ? data[0] : data
  const response = NextResponse.json({
    rating_count: row?.rating_count ?? 0,
    rating_sum: row?.rating_sum ?? 0,
  })
  if (!existingVisitorId) {
    response.cookies.set('md-rating-id', visitorId, {
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 365,
    })
  }
  return response
}

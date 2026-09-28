import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// Ruta para registrar un voto real (1-5 estrellas) en una receta. No usa el cliente
// cacheado de src/lib/supabase/public.ts (pensado para lecturas GET con Data Cache de
// Next): esto es una escritura y debe llegar siempre a Supabase, sin caché de por medio.
//
// La única puerta de escritura es la función Postgres rate_recipe(uuid, integer)
// (SECURITY DEFINER): el rol anon no tiene permiso de UPDATE directo sobre `recipes`
// (ver política RLS), así que ni con la anon key expuesta en el navegador se puede
// escribir nada más que sumar un voto a esa receta. Ver la migración add_recipe_ratings.
//
// Límite honesto: sin cuentas de usuario ni CAPTCHA, esto no impide que alguien decidido
// llame la ruta varias veces con distintos recipeId falsos o burle el bloqueo del cliente
// (localStorage) borrando su almacenamiento. Es el mismo modelo de confianza que ya usa
// el sitio para "favoritas": no hay verificación fuerte de identidad. Si en el futuro esto
// se vuelve un problema real, la solución es un límite por IP en esta misma ruta.

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? 'https://eqbdtctxbpepbeickhqi.supabase.co'
const supabaseKey =
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ??
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ??
  'sb_publishable_5j3BnF3q24MVuU-BTEVzbg_UXTyp6CM'

const supabaseAnon = createClient(supabaseUrl, supabaseKey, {
  auth: { persistSession: false, autoRefreshToken: false },
})

export async function POST(request: NextRequest) {
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

  const { data, error } = await supabaseAnon.rpc('rate_recipe', {
    p_recipe_id: recipeId,
    p_rating: rating,
  })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 })
  }

  const row = Array.isArray(data) ? data[0] : data
  return NextResponse.json({
    rating_count: row?.rating_count ?? 0,
    rating_sum: row?.rating_sum ?? 0,
  })
}

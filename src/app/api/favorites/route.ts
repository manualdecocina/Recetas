import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase/public';
import { SUPPORTED_LANGUAGES } from '@/types/recipe';
const headers = { 'Cache-Control': 'private, no-store', 'CDN-Cache-Control': 'no-store' };
export const dynamic = 'force-dynamic';
/** Read published cards only. Saved IDs remain on the device, not in a user profile. */
export async function POST(request: NextRequest) {
  const fail = (status: number) => NextResponse.json({ error: 'Favorites unavailable' }, { status, headers });
  if (Number(request.headers.get('content-length') ?? 0) > 50000) return fail(413);
  try {
    const { ids, lang } = await request.json();
    if (!SUPPORTED_LANGUAGES.includes(lang) || !Array.isArray(ids) || ids.length > 1000 || !ids.every(id => typeof id === 'string' && /^[0-9a-f]{8}-(?:[0-9a-f]{4}-){3}[0-9a-f]{12}$/i.test(id))) return fail(400);
    if (!ids.length) return NextResponse.json({ recipes: [] }, { headers });
    const { data: saved, error } = await supabase.from('recipes').select('id, recipe_group_id').in('id', [...new Set(ids)]).eq('published', true);
    if (error) return fail(503);
    const groups = [...new Set((saved ?? []).map(r => r.recipe_group_id))];
    if (!groups.length) return NextResponse.json({ recipes: [] }, { headers });
    const { data, error: cardError } = await supabase.from('recipes').select('id, language, slug, public_path, source_url, title, excerpt, category, image_url, recipe_group_id').in('recipe_group_id', groups).eq('language', lang).eq('published', true);
    if (cardError) return fail(503);
    return NextResponse.json({ recipes: (data ?? []).map(({ recipe_group_id, ...card }) => ({ ...card, savedIds: (saved ?? []).filter(r => r.recipe_group_id === recipe_group_id).map(r => r.id) })) }, { headers });
  } catch { return fail(400); }
}

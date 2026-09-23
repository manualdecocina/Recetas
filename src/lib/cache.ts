// Etiqueta única de caché para TODO el contenido público de recetas.
// Se aplica a cada lectura del cliente público (src/lib/supabase/public.ts) y se
// invalida con revalidateTag() en cada escritura del panel (src/app/admin/actions.ts).
export const RECIPES_CACHE_TAG = 'recipes'

// Respaldo por tiempo: aunque falle una invalidación, nada queda obsoleto más de 1 hora.
// Las páginas públicas repiten este valor como literal en `export const revalidate`
// porque Next exige un número estático allí (no acepta una constante importada).
export const PUBLIC_REVALIDATE_SECONDS = 3600

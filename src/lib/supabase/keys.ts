// Única fuente de la URL y la llave pública de Supabase para TODOS los clientes
// (sitio público, panel /admin y middleware). La llave "publishable" es pública por
// diseño: los permisos los decide la RLS. Antes el panel solo leía
// NEXT_PUBLIC_SUPABASE_ANON_KEY y, sin ese valor válido en el hosting, Supabase
// respondía 401 al iniciar sesión y al pedir el correo de recuperación.
export const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://eqbdtctxbpepbeickhqi.supabase.co'

export const SUPABASE_PUBLIC_KEY =
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  'sb_publishable_5j3BnF3q24MVuU-BTEVzbg_UXTyp6CM'

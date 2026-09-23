// Dominios permitidos para imágenes de recetas. Misma lógica que next.config.mjs:
// siempre el host de Supabase (Storage) + los que se agreguen explícitamente en
// NEXT_PUBLIC_IMAGE_HOSTS (separados por coma). Nunca "**".
export function getAllowedImageHosts(): string[] {
  const hosts = new Set<string>()
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  if (supabaseUrl) hosts.add(new URL(supabaseUrl).hostname)
  for (const host of (process.env.NEXT_PUBLIC_IMAGE_HOSTS ?? '').split(',')) {
    const trimmed = host.trim()
    if (trimmed) hosts.add(trimmed)
  }
  return Array.from(hosts)
}

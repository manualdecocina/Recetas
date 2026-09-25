// Imágenes restringidas a dominios reales (antes: hostname "**", abierto a cualquiera).
// Debe coincidir con src/lib/image-hosts.ts, que valida lo mismo al guardar una receta.
const hosts = new Set(['eqbdtctxbpepbeickhqi.supabase.co'])
if (process.env.NEXT_PUBLIC_SUPABASE_URL) {
  hosts.add(new URL(process.env.NEXT_PUBLIC_SUPABASE_URL).hostname)
}
for (const host of (process.env.NEXT_PUBLIC_IMAGE_HOSTS ?? '').split(',')) {
  if (host.trim()) hosts.add(host.trim())
}
// WordPress legacy media remains valid during migration; the browser may still request it.
for (const host of ['manualdecocina.com', 'www.manualdecocina.com']) hosts.add(host)


/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: Array.from(hosts).map((hostname) => ({ protocol: 'https', hostname })),
  },
}

export default nextConfig

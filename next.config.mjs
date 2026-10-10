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
  // Historical KEEP URLs must respond directly, including their original slash.
  skipTrailingSlashRedirect: true,
  images: {
    qualities: [65, 70, 75],
    remotePatterns: Array.from(hosts).map((hostname) => ({ protocol: 'https', hostname })),
    // Las fotos del recetario cambian con poca frecuencia; un día reduce trabajo del
    // optimizador y transferencias repetidas sin impedir correcciones editoriales rápidas.
    minimumCacheTTL: 86400,
  },
  async redirects() {
    // La categoría "Desayunos y brunch" se eliminó (7 oct 2026): sus recetas pasaron a categorías canónicas.
    return [
      // One canonical host: preserve path and query; never serve two indexable hosts.
      {
        source: '/:path*',
        has: [{ type: 'host', value: 'www.manualdecocina.com' }],
        destination: 'https://manualdecocina.com/:path*',
        permanent: true,
      },
      { source: '/:lang(es|de|en|fr|it|ja|pt)/categorias/desayunos-y-brunch', destination: '/:lang/categorias', permanent: true },
    ]
  },
  async headers() {
    const assetCache = 'public, max-age=86400, stale-while-revalidate=604800'
    // Safe security baseline: these directives do not restrict AdSense scripts,
    // CMP integrations or Next.js inline runtime code. A nonce-based script-src
    // policy / Trusted Types require a separate compatibility review.
    const safePageHeaders = [
      { key: 'X-Content-Type-Options', value: 'nosniff' },
      { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
      { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
      { key: 'Content-Security-Policy', value: "object-src 'none'; base-uri 'self'; frame-ancestors 'self'" },
      { key: 'Cross-Origin-Opener-Policy', value: 'same-origin-allow-popups' },
      // Start HSTS with a short max-age. Do not force subdomains or preload
      // until all hostnames and certificate renewal have been verified.
      { key: 'Strict-Transport-Security', value: 'max-age=86400' },
    ]
    return [
      { source: '/:path*', headers: safePageHeaders },
      { source: '/recetas/:path*', headers: [{ key: 'Cache-Control', value: assetCache }] },
      { source: '/brand/:path*', headers: [{ key: 'Cache-Control', value: assetCache }] },
      { source: '/autor/:path*', headers: [{ key: 'Cache-Control', value: assetCache }] },
    ]
  },
}

export default nextConfig

import { getSiteUrl } from '@/lib/site'

// Keep the full editorial biography indexed only at /es/quienes-somos.
// This small, read-only discovery page responds with HTTP 200 for agents that
// do not count redirected /about links as a real About page.
export function GET() {
  const canonical = `${getSiteUrl()}/es/quienes-somos`
  const html = `<!doctype html>
<html lang="es">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>About us — Quiénes somos | Manual de Cocina</title>
<meta name="description" content="About Manual de Cocina: un proyecto editorial de recetas dirigido por Néstor Bastidas.">
<meta name="robots" content="noindex,follow">
<link rel="canonical" href="${canonical}">
<style>
:root{color-scheme:light}*{box-sizing:border-box}
body{margin:0;background:#faf7f2;color:#26231f;font-family:system-ui,-apple-system,Segoe UI,sans-serif;line-height:1.7}
header,main,footer{max-width:820px;margin:auto;padding:24px}
header{border-bottom:1px solid #e5dfd6;display:flex;justify-content:space-between;gap:16px;flex-wrap:wrap}
a{color:#6a3c22;text-underline-offset:3px}
h1{font-size:clamp(2rem,5vw,3rem);line-height:1.2;margin-top:1.5rem}
main{min-height:55vh}main p{font-size:1.1rem}
nav{display:flex;flex-wrap:wrap;gap:20px}
footer{border-top:1px solid #e5dfd6;font-size:.94rem}
</style>
</head>
<body>
<header><a href="/es"><strong>Manual de Cocina</strong></a><nav aria-label="Navegación"><a href="/es">Inicio</a><a href="/es/recetas">Recetas</a><a href="/es/contacto">Contacto</a></nav></header>
<main>
<p>Manual de Cocina · Información institucional</p>
<h1>About us — Quiénes somos</h1>
<p>Manual de Cocina es un proyecto editorial gastronómico dirigido por Néstor Bastidas. Compartimos recetas con ingredientes claros, instrucciones paso a paso y recursos prácticos para cocinar en casa.</p>
<p><a href="/es/quienes-somos" rel="about"><strong>Conoce nuestra historia y al responsable editorial de Manual de Cocina</strong></a>.</p>
<p>Read more about us on our <a href="/en/quienes-somos">English About us page</a>.</p>
</main>
<footer><nav aria-label="Información"><a href="/es/quienes-somos">Quiénes somos</a><a href="/es/contacto">Contacto</a><a href="/es/privacidad">Privacidad</a><a href="/es/terminos">Términos</a><a href="/es/aviso-legal">Aviso legal</a></nav></footer>
</body></html>`
  return new Response(html, {
    status: 200,
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      'X-Robots-Tag': 'noindex, follow',
      'Cache-Control': 'public, max-age=300, s-maxage=3600',
    },
  })
}

#!/usr/bin/env bash
# Print-mode regression QA with a real Chromium PDF, including simulated AdSense placements.
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
TMP="$(mktemp -d)"
trap 'rm -rf "$TMP"' EXIT

if command -v google-chrome >/dev/null 2>&1; then
  CHROME=google-chrome
elif command -v chromium >/dev/null 2>&1; then
  CHROME=chromium
else
  echo 'Chrome/Chromium required for print smoke test' >&2
  exit 1
fi
command -v pdftotext >/dev/null || { echo 'pdftotext required'; exit 1; }

cat > "$TMP/print-fixture.html" <<HTML
<!doctype html>
<html lang="es"><head><meta charset="utf-8">
<link rel="stylesheet" href="file://$ROOT/src/app/site.css">
</head><body>
  <div class="md-site">
    <header class="md-header">PUBLICIDAD_CABECERA</header>
    <main id="md-main">
      <article class="md-article">
        <div class="md-print-brand">Manual de Cocina</div>
        <h1>RECETA_IMPRIMIBLE</h1>
        <section><h2>INGREDIENTES_IMPRIMIBLES</h2>
          <ins class="adsbygoogle">ANUNCIO_ADSBYGOOGLE</ins>
          <div class="google-auto-placed">ANUNCIO_AUTOMATICO</div>
          <div class="md-ad-slot">ANUNCIO_PLACEHOLDER</div>
          <div data-ad-client="ca-pub-test">ANUNCIO_DATA_CLIENT</div>
          <div data-google-query-id="test">ANUNCIO_QUERY</div>
          <div id="google_ads_iframe_test">ANUNCIO_IFRAME_WRAPPER</div>
          <p>HARINA_AGUA_SAL</p>
        </section>
        <section><h2>PREPARACION_IMPRIMIBLE</h2><p>MEZCLAR_Y_COCINAR</p></section>
        <div class="md-print-foot">manualdecocina.com</div>
      </article>
      <div class="google-auto-placed">ANUNCIO_AL_LADO_DEL_ARTICULO</div>
      <div class="md-related">CONTENIDO_RELACIONADO</div>
    </main>
    <footer class="md-footer">PUBLICIDAD_PIE</footer>
  </div>
  <div class="adsbygoogle-noablate">ANUNCIO_FLOTANTE</div>
  <div class="fc-consent-root">CONSENTIMIENTO_FLOTANTE</div>
</body></html>
HTML

"$CHROME" --headless --no-sandbox --disable-gpu --no-pdf-header-footer \
  --disable-dev-shm-usage --virtual-time-budget=1500 \
  --print-to-pdf="$TMP/recipe.pdf" "file://$TMP/print-fixture.html" >/dev/null 2>&1
test -s "$TMP/recipe.pdf"
pdftotext -layout "$TMP/recipe.pdf" "$TMP/recipe.txt"

for expected in RECETA_IMPRIMIBLE INGREDIENTES_IMPRIMIBLES HARINA_AGUA_SAL PREPARACION_IMPRIMIBLE MEZCLAR_Y_COCINAR; do
  if ! grep -q "$expected" "$TMP/recipe.txt"; then
    echo "ERROR: print omitted recipe content: $expected"
    cat "$TMP/recipe.txt"
    exit 1
  fi
done

for forbidden in ANUNCIO_ PUBLICIDAD_ CONTENIDO_RELACIONADO CONSENTIMIENTO_FLOTANTE; do
  if grep -q "$forbidden" "$TMP/recipe.txt"; then
    echo "ERROR: advertisement or page chrome printed: $forbidden"
    cat "$TMP/recipe.txt"
    exit 1
  fi
done

echo 'PASS: Chromium PDF retains recipe and excludes AdSense, floating ads and website chrome.'

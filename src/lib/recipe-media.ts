// These corrected photos replaced older files at the same paths. Version their
// display URLs so browser/CDN/Next image caches cannot keep the previous photos.
const CORRECTED_RECIPE_PHOTO = /^\/recetas\/(?:porra-antequerana|pandebono-casero|pan-matza)\/(?:portada(?:-(?:1x1|4x3|16x9))?|paso-0[1-5])\.webp(?:[?#]|$)/;
const PHOTO_REVISION = 'f55c7e1';

export function recipeImageSrc(src: string): string {
  if (!CORRECTED_RECIPE_PHOTO.test(src)) return src;
  const url = new URL(src, 'https://manualdecocina.com');
  url.pathname = url.pathname.replace(/\.webp$/, `.${PHOTO_REVISION}.webp`);
  return url.pathname + url.search + url.hash;
}

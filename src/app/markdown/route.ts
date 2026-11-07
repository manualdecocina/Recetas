import { getHomeData } from '@/lib/md-data'
import { getMdCopy } from '@/lib/copy'
import { recipeHref } from '@/lib/site'
import { SUPPORTED_LANGUAGES, type RecipeLanguage } from '@/types/recipe'

// Equivalent content for agents requesting Accept: text/markdown on a homepage.
// This is a read-only representation of live published homepage data, not a second indexable page.
export const revalidate = 3600

function oneLine(value: string): string {
  return value.replace(/[\r\n\t]+/g, ' ').replace(/[<>\[\]]/g, '').trim().slice(0, 240)
}

export async function GET(request: Request) {
  const url = new URL(request.url)
  const requested = url.searchParams.get('lang') ?? 'es'
  if (!(SUPPORTED_LANGUAGES as string[]).includes(requested)) {
    return new Response('Unsupported language', { status: 400, headers: { 'Content-Type': 'text/plain; charset=utf-8' } })
  }
  const lang = requested as RecipeLanguage
  const t = getMdCopy(lang)
  const data = await getHomeData(lang)
  const origin = url.origin
  const recipes = [data.featured, ...data.latest].filter((r): r is NonNullable<typeof r> => r != null)
  const lines = [
    `# ${oneLine(t.homeHeading)} — Manual de Cocina`,
    '',
    oneLine(t.homeLead),
    '',
    `- [${oneLine(t.navRecipes)}](${origin}/${lang}/recetas)`,
    `- [${oneLine(t.navCategories)}](${origin}/${lang}/categorias)`,
    `- [${oneLine(t.navIngredients)}](${origin}/${lang}/ingredientes)`,
    `- [${oneLine(t.navCollections)}](${origin}/${lang}/colecciones)`,
    `- [${oneLine(t.navPantryTool)}](${origin}/${lang}/que-puedo-cocinar)`,
    '',
    `## ${oneLine(t.latest)}`,
    '',
    ...recipes.map((recipe) => `- [${oneLine(recipe.title)}](${origin}${recipeHref(recipe)})`),
    '',
    `## ${oneLine(t.institutional)}`,
    '',
    `- [${oneLine(t.about)}](${origin}/${lang}/quienes-somos)`,
    `- [${oneLine(t.contact)}](${origin}/${lang}/contacto)`,
    `- [${oneLine(t.editorialPolicy)}](${origin}/${lang}/politica-editorial)`,
    `- [${oneLine(t.privacy)}](${origin}/${lang}/privacidad)`,
    '',
    `- [llms.txt](${origin}/llms.txt)`,
    '',
  ]
  return new Response(lines.join('\n'), {
    headers: {
      'Content-Type': 'text/markdown; charset=utf-8',
      'X-Robots-Tag': 'noindex, follow',
      'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=3600',
      'Link': `<${origin}/${lang}>; rel="canonical", </llms.txt>; rel="describedby"; type="text/plain"`,
      'Vary': 'Accept',
    },
  })
}

import assert from 'node:assert/strict'
import { readRecipeForm } from '@/lib/validation'
function form(path: string, image = '') {
  const data = new FormData()
  Object.entries({ slug:'receta-valida', public_path:path, title:'Receta válida', excerpt:'', category:'Platos principales', ingredients:'200 | g | harina de trigo', steps:'Mezclar\nMezclar todos los ingredientes.', image_url:image, prep_time_minutes:'',cook_time_minutes:'',servings:'4' }).forEach(([k,v])=>data.set(k,v))
  return data
}
for (const path of ['/es/receta/salsa-casera', '/ja/レシピ', '/receta-historica/']) assert.equal(readRecipeForm(form(path),'es').success,true,`accept ${path}`)
for (const path of ['/es/contiene espacio', '//otro-dominio.test', '/es/receta?x=1', '/es/receta#paso', '/es/\\receta']) assert.equal(readRecipeForm(form(path),'es').success,false,`reject ${path}`)
assert.doesNotThrow(()=>readRecipeForm(form('/es/receta','invalid URL'),'es'))
assert.equal(readRecipeForm(form('/es/receta','invalid URL'),'es').success,false)
assert.equal(readRecipeForm(form('/es/receta','http://manualdecocina.com/image.webp'),'es').success,false)
console.log('OK validation: localized and historical paths, whitespace/host/query/backslash rejection, malformed image input and Zod 4 compatibility')

const { reviewedRecipeSeo, REVIEWED_SNIPPETS } = await import('@/lib/recipe-snippet-repairs')
const { withSiteName } = await import('@/lib/seo')
for (const [id, entry] of Object.entries(REVIEWED_SNIPPETS)) {
  const after = reviewedRecipeSeo(id, entry.before)
  if (typeof after.title === 'string') assert.ok(withSiteName(after.title).length <= 75)
  if (typeof after.description === 'string') assert.ok(after.description.length <= 170)
  const future = { title: 'Nueva edición del responsable editorial', description: 'Texto actualizado por el responsable editorial.' }
  assert.deepEqual(reviewedRecipeSeo(id, future), future, 'future editorial updates must win')
  assert.deepEqual(REVIEWED_SNIPPETS[id].before, entry.before, 'source metadata remains unchanged')
}

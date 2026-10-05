import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { CATEGORY_TAXONOMY, MD_CATEGORIES, categoryLabel, categorySlugFromLabel, canonicalCategoryLabel } from '../../src/lib/categories.ts'
import { readRecipeForm } from '../../src/lib/validation.ts'
import { SUPPORTED_LANGUAGES } from '../../src/types/recipe.ts'
assert.equal(CATEGORY_TAXONOMY.length, 11)
assert.equal(new Set(CATEGORY_TAXONOMY.map(x => x.slug)).size, 11)
assert.deepEqual(MD_CATEGORIES, CATEGORY_TAXONOMY.map(x => ({slug:x.slug,label:x.labels.es})))
for (const lang of SUPPORTED_LANGUAGES) {
  assert.equal(new Set(CATEGORY_TAXONOMY.map(x => x.labels[lang])).size, 11)
  for (const entry of CATEGORY_TAXONOMY) {
    assert.equal(categoryLabel(lang,entry.slug),entry.labels[lang])
    assert.equal(categorySlugFromLabel(lang,entry.labels[lang]),entry.slug)
    assert.equal(canonicalCategoryLabel(lang,entry.labels[lang]),entry.labels[lang])
  }
}
for (const label of ['Sopas','Entrantes','Desayunos','Categoría inventada','SOPAS Y CREMAS']) assert.equal(categorySlugFromLabel('es', label),undefined)
assert.equal(categoryLabel('es','sopas'),undefined)
assert.equal(categoryLabel('es','pastas'),'Pastas')
assert.equal(categoryLabel('es','desayunos-y-brunch'),'Desayunos y brunch')
function form(category:string, published=false) {
  const f=new FormData()
  for (const [key,value] of Object.entries({public_path:'',excerpt:'',image_url:'',slug:'receta-valida',title:'Receta de prueba',category,ingredients:'1 | ingrediente',steps:'Preparar\nCocinar el ingrediente.'})) f.set(key,value)
  if(published) f.set('published','on')
  return f
}
const edit = form('Sopas y cremas'); edit.delete('public_path')
assert.equal(readRecipeForm(edit,'es').success,true)
assert.equal(readRecipeForm(form('Sopas'),'es').success,false)
assert.equal(readRecipeForm(form('Soups & creams'),'es').success,false)
assert.equal(readRecipeForm(form(''),'es').success,true)
assert.equal(readRecipeForm(form('',true),'es').success,false)
for(const lang of SUPPORTED_LANGUAGES) for(const entry of CATEGORY_TAXONOMY) assert.equal(readRecipeForm(form(entry.labels[lang],true),lang).success,true)
const sql=readFileSync(new URL('../../supabase/migrations/20261005100242_reconcile_recipe_categories.sql',import.meta.url),'utf8')
for(const lang of SUPPORTED_LANGUAGES) for(const entry of CATEGORY_TAXONOMY) assert.ok(sql.includes("'"+entry.labels[lang].replaceAll("'","''")+"'"))
console.log('OK: 11 categorías, 77 nombres canónicos, correspondencia de idiomas y rechazo de categorías libres/vacías al publicar.')

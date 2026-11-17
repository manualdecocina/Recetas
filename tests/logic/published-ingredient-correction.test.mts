import assert from 'node:assert/strict'
import fs from 'node:fs'
import { fileURLToPath } from 'node:url'
import { correctedIngredientDetails } from '../../src/lib/mysql/published-ingredient-correction.ts'

const original = [
  { name:'Aceite de oliva', preparation:'vegetal o de oliva', amount:'20', unit:'g',
    note:'Dividir en dos', group:'Grasas', canonicalIngredientSlug:'aceite', storagePosition:5 },
  { name:'Pollo entero', amount:'1800', unit:'g', photo:'https://example.com/photo.webp' },
]
const snapshot = structuredClone(original)
const edit = correctedIngredientDetails(original, 0, original[0].name, original[0].preparation,
  'Aceite vegetal o de oliva', '')
assert.equal(edit.changed, true)
assert.equal((edit.ingredients[0] as {name:string}).name, 'Aceite vegetal o de oliva')
assert.equal(Object.hasOwn(edit.ingredients[0] as object, 'preparation'), false)
assert.deepEqual(edit.ingredients[1], original[1])
const originalMetadata = {...original[0]}
delete (originalMetadata as {preparation?:string}).preparation
delete (originalMetadata as {name?:string}).name
const updatedMetadata = {...edit.ingredients[0] as object}
delete (updatedMetadata as {preparation?:string}).preparation
delete (updatedMetadata as {name?:string}).name
assert.deepEqual(updatedMetadata, originalMetadata, 'Cantidades, notas, referencias y orden no deben modificarse')
assert.deepEqual(original, snapshot, 'El original no debe mutarse')
assert.deepEqual(correctedIngredientDetails(original, 0, original[0].name, original[0].preparation,
  original[0].name, original[0].preparation), {changed:false,ingredients:original})
assert.throws(() => correctedIngredientDetails(original, 0, 'Nombre antiguo', original[0].preparation, 'Aceite vegetal', ''), /cambió/)
assert.throws(() => correctedIngredientDetails(original, 0, original[0].name, 'prep antigua', 'Aceite vegetal', ''), /cambió/)
assert.throws(() => correctedIngredientDetails(original, 3, original[0].name, original[0].preparation, 'Aceite vegetal', ''), /Posición/)
assert.throws(() => correctedIngredientDetails(original, 0, original[0].name, original[0].preparation, ' ', ''), /inválidos/)
assert.throws(() => correctedIngredientDetails(original, 0, original[0].name, original[0].preparation, 'Aceite\nvegetal', ''), /inválidos/)
assert.throws(() => correctedIngredientDetails(original, 0, original[0].name, original[0].preparation, 'Aceite', 'A'.repeat(201)), /inválidos/)

const read = (name:string) => fs.readFileSync(fileURLToPath(new URL(name, import.meta.url)), 'utf8')
const server = read('../../src/lib/mysql/published-ingredient-correction-db.ts')
const action = read('../../src/app/admin/platos/ingredient-actions.ts')
const basic = read('../../src/lib/mysql/editorial-crud.ts')
assert.match(server, /await requireMysqlAdminWrites\(\)/)
assert.match(server, /FOR UPDATE/)
assert.match(server, /published=1/)
assert.match(server, /JSON\.stringify\(result\.ingredients\)/)
assert.match(action, /revalidateTag\(RECIPES_CACHE_TAG, 'max'\)/)
assert.match(basic, /Usar editor aprobado para recetas publicadas/, 'El editor básico conserva el bloqueo protector')
console.log('Published ingredient correction guards PASS')

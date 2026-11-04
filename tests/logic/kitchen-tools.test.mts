import assert from 'node:assert/strict'
import { parseQuantity, scaleAmount, scaleIngredients, scaleSteps, stepTimerSeconds } from '../../src/lib/recipe-quantities.ts'
import { shoppingRows, addShoppingSource, emptyShopping } from '../../src/lib/shopping-list.ts'
import { kitchenCopy } from '../../src/lib/kitchen-copy.ts'
import { rankRelated, recipeTechniques } from '../../src/lib/related-recipes.ts'
import { resultCountLabel } from '../../src/lib/plural.ts'
import type { MdIngredient, MdLanguage } from '../../src/components/md/md-types.ts'
assert.equal(parseQuantity('1 1/4'), 1.25)
assert.equal(parseQuantity('1½'), 1.5)
assert.equal(parseQuantity('1,2'), 1.2)
assert.equal(parseQuantity('1/0'), null)
assert.equal(parseQuantity('al gusto'), null)
assert.equal(scaleAmount('10–12', .5, 'es'), '5–6')
assert.equal(scaleAmount('1/4', 2, 'es'), '0,5')
assert.equal(scaleAmount('al gusto', 2, 'es'), 'al gusto')
const ingredients: MdIngredient[] = [{name:'leche',amount:'1000',unit:'ml'}, {name:'huevos',amount:'2',unit:'unidades'}, {name:'yemas de huevo, unas 6 grandes; pesar 108 g',amount:'108',unit:'g'}]
const steps = [{title:'Calienta 1000 ml de leche',content:'Usa 250 ml de leche y 2 huevos a 80–85 °C durante 2 minutos. Reparte en 8 porciones.',timer_seconds:120}]
const scaled = scaleSteps(steps, 2, 'es', ingredients)
assert.equal(scaled[0].content, 'Usa 500 ml de leche y 4 huevos a 80–85 °C durante 2 minutos. Reparte en 16 porciones.')
assert.equal(scaled[0].timer_seconds, 120)
assert.equal(scaleSteps([{title:'',content:'Añade una pizca de sal en tres veces durante dos minutos.'}],2,'es',[])[0].content, 'Añade 2 pizcas de sal en tres veces durante dos minutos.')
assert.equal(scaleIngredients([{name:'rice, about 100 g',amount:'100',unit:'g'}],2,'en')[0].name,'rice, about 200 g')
assert.equal(steps[0].timer_seconds, 120)
assert.equal(scaleIngredients(ingredients, 2, 'es')[2].name, 'yemas de huevo, unas 12 grandes; pesar 216 g')
assert.equal(stepTimerSeconds({title:'',content:'Cocina de 15 a 20 minutos.'}),null)
assert.equal(stepTimerSeconds({title:'',content:'Cocina 15–20 minutos.'}),null)
assert.equal(stepTimerSeconds({title:'',content:'Cocina 15 minutos y reposa 5 minutos.'}),null)
assert.equal(stepTimerSeconds({title:'',content:'Mezcla 2 minutos.'}),120)
assert.equal(stepTimerSeconds({title:'',content:'30秒混ぜる。'}),30)
assert.equal(scaleSteps([{title:'',content:'牛乳250mlと卵2個を混ぜ、小さじ1を加え、2分加熱する。'}],2,'ja',[])[0].content,'牛乳500 mlと卵4個を混ぜ、小さじ2を加え、2分加熱する。')
assert.equal(scaleSteps([{title:'',content:'Add one cup and two eggs. Bake 20 minutes at 180 °C.'}],2,'en',[{name:'eggs',amount:'2'}])[0].content,'Add 2 cups and 4 eggs. Bake 20 minutes at 180 °C.')
for (const lang of ['es','en','de','fr','it','ja','pt'] as MdLanguage[]) {
 const t = kitchenCopy(lang)
 assert(Object.values(t).every(value => typeof value === 'string' && value.length > 0))
 const source = {id:'one',title:'One',href:'/recipe',lang,ingredients:[{name:'Arroz',amount:'500',unit:'g',pantryIngredientSlug:'arroz'}]}
 let list = addShoppingSource(emptyShopping(),source)
 list = addShoppingSource(list,source)
 assert.equal(list.sources.length,1,'same recipe is idempotent')
 list = addShoppingSource(list,{...source,id:'two',ingredients:[{...source.ingredients[0],amount:'1',unit:'kg'}]})
 assert.equal(shoppingRows(list,lang)[0].amount,'1500')
 list = addShoppingSource(list,{...source,id:'three',ingredients:[{...source.ingredients[0],amount:'2',unit:'taza'}]})
 assert.equal(shoppingRows(list,lang).length,2,'cups never merge with grams')
 const volume=addShoppingSource(list,{...source,id:'four',ingredients:[{name:'Leche',amount:'1',unit:'l',pantryIngredientSlug:'leche'},{name:'Leche',amount:'250',unit:'ml',pantryIngredientSlug:'leche'}]})
 assert.equal(shoppingRows(volume,lang).find(row => row.unit === 'ml')?.amount,'1250')
 assert.equal(shoppingRows(addShoppingSource(list,{...source,ingredients:[]}),lang)[0].amount,'1000','empty contribution removes old amounts')
}
assert.equal(resultCountLabel('en',1),'1 recipe found')
assert.equal(resultCountLabel('en',0),'0 recipes found')
const target={id:'target',group:'a',ingredients:['leche','arroz'],techniques:['boil'],minutes:30,category:'Postres',cuisine:'Colombiana'}
assert.deepEqual(rankRelated(target,[target,{...target,id:'bad',group:'b',ingredients:['pollo'],techniques:['grill'],minutes:200},{...target,id:'good',group:'c'}],1),['c'])
assert(recipeTechniques('Pollo al horno',[{content:'Hornea a 180 °C.'}]).includes('bake'))
console.log('OK kitchen tools: fractions, ranges, partial step quantities, unchanged times/temperatures, seven languages, safe shopping aggregation, idempotency, timers, related scoring and English singular')

const spoons = shoppingRows({sources:[{id:'a',title:'a',href:'/a',lang:'es',ingredients:[{name:'Azúcar',amount:'1',unit:'cucharada',pantryIngredientSlug:'azucar'},{name:'Azúcar',amount:'2',unit:'cucharadas',pantryIngredientSlug:'azucar'}]}],checked:[]},'es')
assert.equal(spoons.length,1)
assert.equal(spoons[0].text,'3 cucharadas de Azúcar')

// Display SI quantities compactly without changing totals or purchased keys.
const beer = { sources: [{ id: 'beer', title: 'Beer', href: '/beer', lang: 'es' as MdLanguage, ingredients: [
 { name: 'Agua', amount: '14000', unit: 'ml' }, { name: 'Malta', amount: '1200', unit: 'g' },
 { name: 'Lúpulo', amount: '20', unit: 'g' }, { name: 'Azúcar', amount: 'al gusto', unit: '' },
]}], checked: [] }
const beerRows = shoppingRows(beer, 'es')
assert.equal(beerRows[0].text, '14 L Agua')
assert.equal(beerRows[1].text, '1,2 kg Malta')
assert.equal(beerRows[2].text, '20 g Lúpulo')
assert.equal(beerRows[3].text, 'al gusto Azúcar')
assert.equal(beerRows[0].amount, '14000')
assert.equal(beerRows[0].quantity, '14 L')
assert.equal(shoppingRows(beer, 'en')[1].quantity, '1.2 kg')
assert.equal(shoppingRows({ ...beer, checked: [beerRows[0].key] }, 'es')[0].key, beerRows[0].key)

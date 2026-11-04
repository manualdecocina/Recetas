import assert from 'node:assert/strict'
import { parseQuantity, scaleAmount, scaleIngredients, scaleSteps, stepTimerSeconds } from '../../src/lib/recipe-quantities.ts'
import { shoppingRows, addShoppingSource, emptyShopping, readShopping, SHOPPING_KEY } from '../../src/lib/shopping-list.ts'
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

// A textual range keeps its original unit and each recipe's contribution.
const rangeSource = {id:'r1',title:'Papa',href:'/papa',lang:'es' as MdLanguage,ingredients:[{name:'Papa',amount:'1–2',unit:'kg',pantryIngredientSlug:'papa'}]}
const rangeState={sources:[rangeSource,{...rangeSource,id:'r2'},{...rangeSource,id:'r3',ingredients:[{...rangeSource.ingredients[0],unit:'g'}]}],checked:[]}
const ranges=shoppingRows(rangeState,'es')
assert.equal(ranges.length,3)
assert.equal(ranges[0].text,'1–2 kg Papa')
assert.equal(ranges[1].text,'1–2 kg Papa')
assert.equal(ranges[2].text,'1–2 g Papa')
const storageBefore=globalThis.localStorage
try {
 const saved=JSON.stringify({...rangeState,checked:[JSON.stringify(['papa','mass','1–2'])]})
 Object.defineProperty(globalThis,'localStorage',{configurable:true,value:{getItem:(key:string)=>key===SHOPPING_KEY?saved:null}})
 const restored=readShopping()
 assert(ranges.every(row=>restored.checked.includes(row.key)),'old purchased marks migrate without losing checked rows')
} finally { Object.defineProperty(globalThis,'localStorage',{configurable:true,value:storageBefore}) }
assert.equal(scaleIngredients([{name:'huevos medianos, unos 50 g sin cáscara cada uno',amount:'4',unit:'unidades'}],2,'es')[0].name,'huevos medianos, unos 50 g sin cáscara cada uno')
assert.equal(scaleIngredients([{name:'huevos medianos, unos 50 g sin cáscara cada uno',amount:'4',unit:'unidades'}],2,'es')[0].amount,'8')
assert.equal(scaleIngredients([{name:'rice, cooked for about 20 minutes',amount:'100',unit:'g'}],2,'en')[0].name,'rice, cooked for about 20 minutes')
assert.equal(scaleIngredients([{name:'arroz precocido aprox. 20 minutos',amount:'100',unit:'g'}],2,'es')[0].name,'arroz precocido aprox. 20 minutos')
assert.equal(scaleIngredients([{name:'eggs, about 50 g each',amount:'4',unit:'units'}],2,'en')[0].name,'eggs, about 50 g each')
assert.equal(scaleIngredients([{name:'Eier, je 50 g',amount:'4',unit:'Stück'}],2,'de')[0].name,'Eier, je 50 g')
assert.equal(scaleIngredients([{name:'œufs, environ 50 g chacun',amount:'4'}],2,'fr')[0].name,'œufs, environ 50 g chacun')
assert.equal(scaleIngredients([{name:'uova, circa 50 g ciascuno',amount:'4'}],2,'it')[0].name,'uova, circa 50 g ciascuno')
assert.equal(scaleIngredients([{name:'ovos, cerca de 50 g cada',amount:'4'}],2,'pt')[0].name,'ovos, cerca de 50 g cada')
assert.equal(scaleIngredients([{name:'卵（1個約50g）',amount:'4',unit:'個'}],2,'ja')[0].name,'卵（1個約50g）')
console.log('OK audit edge cases: textual-range units, separate contributions, purchased-key migration, per-item weights and annotation durations')

const attributes=scaleIngredients([{name:'eggs',amount:'4',unit:'units',note:'about 50 g each',preparation:'boiled for about 10 minutes'}],2,'en')[0]
assert.equal(attributes.amount,'8')
assert.equal(attributes.note,'about 50 g each')
assert.equal(attributes.preparation,'boiled for about 10 minutes')
assert.equal(scaleIngredients([{name:'arroz, aprox. 20 min',amount:'100',unit:'g'}],2,'es')[0].name,'arroz, aprox. 20 min')

const arepaShape=scaleSteps([{title:'Forma cuatro discos',content:'Reserva una cucharadita de masa para sellar. Divide el resto en 4 bolas iguales y aplánalas: discos de unos 12 cm y 6–7 mm de grosor.'}],2,'es',[])[0]
assert.equal(arepaShape.title,'Forma 8 discos')
assert.match(arepaShape.content,/8 bolas/)
assert.match(arepaShape.content,/12 cm y 6–7 mm/)
assert.equal(scaleSteps([{title:'Fríe',content:'Desliza un disco y fríe 2–3 minutos.'}],2,'es',[])[0].content,'Desliza 1 disco y fríe 2–3 minutos.')
assert.equal(scaleSteps([{title:'Forma',content:'Forma 2 discos por arepa.'}],2,'es',[])[0].content,'Forma 2 discos por arepa.')
for(const [lang,content,expected] of [
 ['en','Shape four balls.','Shape 8 balls.'],['de','Forme vier Kugeln.','Forme 8 Kugeln.'],
 ['fr','Formez quatre boules.','Formez 8 boules.'],['it','Forma quattro palline.','Forma 8 palline.'],
 ['pt','Forme quatro bolas.','Forme 8 bolas.'],['ja','生地を4等分にします。','生地を8等分にします。'],
] as [MdLanguage,string,string][]) assert.equal(scaleSteps([{title:'',content}],2,lang,[])[0].content,expected)
assert.equal(scaleSteps([{title:'',content:'卵1個を4等分にします。'}],2,'ja',[])[0].content,'卵2個を4等分にします。')
console.log('OK recipe shaping: batch yield adjusts, single-item frying and per-item divisions stay unchanged')

assert.equal(scaleSteps([{title:'Forma cuatro discos',content:'Divide la masa en 4 bolas.'}],.25,'es',[])[0].title,'Forma 1 disco')
assert.equal(scaleSteps([{title:'',content:'Shape four balls.'}],.25,'en',[])[0].content,'Shape 1 ball.')

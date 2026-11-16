/** Consulta pura, comprobable sin conexión: el RPC de Supabase es la fuente de verdad.
 * La condición impide que una respuesta HTTP atrasada sobrescriba una valoración
 * más reciente que ya quedó reflejada en MySQL.
 */
const UUID=/^[0-9a-f]{8}-(?:[0-9a-f]{4}-){3}[0-9a-f]{12}$/i
export function ratingCounterMirrorUpdate(recipeId:string,ratingCount:number,ratingSum:number){
  if(!UUID.test(recipeId))throw Error('Identificador de receta inválido')
  if(!Number.isSafeInteger(ratingCount)||ratingCount<1||
     !Number.isSafeInteger(ratingSum)||ratingSum<ratingCount||
     ratingSum>ratingCount*5)throw Error('Contadores de valoración inválidos')
  return {
    sql:'UPDATE recipes SET rating_sum=?,rating_count=? WHERE id=? AND published=1 AND rating_count<=?',
    params:[ratingSum,ratingCount,recipeId,ratingCount],
  }
}

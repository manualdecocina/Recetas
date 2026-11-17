import 'server-only'
import { type RowDataPacket, type ResultSetHeader } from 'mysql2/promise'
import { adminConnection } from './admin-db'
import { requireMysqlAdminWrites } from './editorial-writes'
import { correctedIngredientDetails } from './published-ingredient-correction'

const UUID = /^[0-9a-f]{8}-(?:[0-9a-f]{4}-){3}[0-9a-f]{12}$/i
const LANGUAGES = new Set(['es','en','de','fr','it','ja','pt'])

/** Cambia únicamente el nombre y/o aclaración de un ingrediente dentro del JSON, bajo bloqueo transaccional.
 * Preserva todas las demás propiedades de cada ingrediente y las columnas
 * editoriales (pasos, SEO, fechas de publicación, imágenes y calificaciones).
 */
export async function correctPublishedIngredientNameMysql(args: {
  recipeId: string; groupId: string; language: string
  position: number; expectedName: string; expectedPreparation: string
  nextName: string; nextPreparation: string
}): Promise<'updated' | 'unchanged'> {
  if (!UUID.test(args.recipeId) || !UUID.test(args.groupId) ||
      !LANGUAGES.has(args.language)) throw new Error('Receta inválida')
  await requireMysqlAdminWrites()
  const connection = await adminConnection()
  try {
    await connection.beginTransaction()
    const [rows] = await connection.execute<RowDataPacket[]>(
      'SELECT recipe_group_id,language,published,ingredients FROM recipes WHERE id=? FOR UPDATE',
      [args.recipeId],
    )
    const row = rows[0]
    if (rows.length !== 1 || String(row.recipe_group_id) !== args.groupId ||
        String(row.language) !== args.language || Number(row.published) !== 1) {
      throw new Error('Receta publicada no encontrada en el idioma esperado')
    }
    const source = typeof row.ingredients === 'string' ? JSON.parse(row.ingredients) : row.ingredients
    const result = correctedIngredientDetails(source, args.position,
      args.expectedName, args.expectedPreparation, args.nextName, args.nextPreparation)
    if (!result.changed) {
      await connection.rollback()
      return 'unchanged'
    }
    const [saved] = await connection.execute<ResultSetHeader>(
      'UPDATE recipes SET ingredients=?,updated_at=UTC_TIMESTAMP(6) ' +
        'WHERE id=? AND recipe_group_id=? AND published=1',
      [JSON.stringify(result.ingredients), args.recipeId, args.groupId],
    )
    if (saved.affectedRows !== 1) throw new Error('Corrección no guardada')
    await connection.commit()
    return 'updated'
  } catch (error) {
    await connection.rollback()
    throw error
  } finally {
    connection.release()
  }
}

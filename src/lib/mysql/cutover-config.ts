/** El corte es atómico: impide editar MySQL mientras la web lee Supabase
 * y evita que los votos se sigan guardando en una base diferente.
 * No activa nada por sí solo; todas las variables se fijan en Hostinger.
 */
export function isMysqlCutoverEnabled():boolean {
  return process.env.MYSQL_READS_ENABLED==='true' &&
    process.env.ADMIN_AUTH_PROVIDER==='mysql' &&
    process.env.ADMIN_WRITE_PROVIDER==='mysql' &&
    process.env.MYSQL_RATINGS_ENABLED==='true'
}

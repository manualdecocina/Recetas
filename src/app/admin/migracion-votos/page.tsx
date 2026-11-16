import Link from 'next/link'
import { requireAdmin } from '@/lib/supabase/admin-guard'

export const dynamic='force-dynamic'
export const metadata={title:'Sincronizar valoraciones — Manual de Cocina',robots:{index:false,follow:false}}
type Query={estado?:string;votos?:string;totales?:string;insertados?:string}
const number=(value:unknown)=>typeof value==='string'&&/^\d{1,6}$/.test(value)?Number(value):null

export default async function RatingMigrationPage({searchParams}:{searchParams:Promise<Query>}) {
  const {isAdmin}=await requireAdmin()
  if(!isAdmin)return <main className="adm"><h1>Acceso no autorizado</h1></main>
  const params=await searchParams
  const ready=process.env.MYSQL_READS_ENABLED==='true'&&
    process.env.MYSQL_RATINGS_ENABLED!=='true'&&process.env.ADMIN_AUTH_PROVIDER!=='mysql'
  const correct=params.estado==='correcto'
  const votes=number(params.votos),total=number(params.totales),inserted=number(params.insertados)
  return <main className="adm" style={{maxWidth:850,margin:'0 auto',padding:'32px 20px'}}>
    <p><Link href="/admin">Volver al panel editorial</Link></p>
    <h1>Trasladar valoraciones a MySQL</h1>
    <p>Las recetas públicas ya se leen desde MySQL. Esta herramienta conserva las valoraciones
      de Supabase y copia su historial privado directamente entre servidores. No descarga
      ni muestra datos individuales de visitantes y no elimina la información original.</p>
    <p>Los contadores pueden incluir valoraciones antiguas sin voto individual.
      Se conservan exactamente los totales del origen; no se recalculan solo con los votos exportados.</p>
    {correct&&votes!==null&&total!==null&&inserted!==null&&
      <p role="status" className="adm-notice adm-notice-ok">
        Comprobación correcta: {votes} votos individuales; {total} valoraciones acumuladas.
        Se copiaron {inserted} votos nuevos a MySQL y se conservaron los anteriores.
        Las valoraciones siguen activas en Supabase hasta el cambio final del proveedor.
      </p>}
    {params.estado==='error'&&<p role="alert" className="adm-notice adm-notice-error">
      No se confirmó la sincronización. No se modificaron los votos originales de Supabase.
      Comprueba el registro técnico del servidor y vuelve a probar cuando esté resuelto.
    </p>}
    {params.estado==='no_disponible'&&<p role="status">
      El corte no está disponible con las variables actuales. No se cambió ningún voto.
    </p>}
    {ready
      ? <form method="post" action="/api/admin/migrate-ratings" className="adm-auth-form">
          <input type="hidden" name="confirmar" value="SINCRONIZAR"/>
          <button type="submit" className="adm-btn adm-btn-primary">
            Sincronizar y verificar los votos
          </button>
        </form>
      : <p>Sincronización desactivada porque MySQL aún no está listo o ya recibe las valoraciones.</p>}
    <p className="adm-hint">La operación es idempotente. No activa todavía las nuevas votaciones
      MySQL ni desconecta Supabase. Si se recibe una valoración nueva durante la copia,
      se cancela y puede repetirse sin perder datos.</p>
  </main>
}

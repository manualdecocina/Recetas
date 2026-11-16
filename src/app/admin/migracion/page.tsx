import Link from 'next/link'
import type { Metadata } from 'next'
import { type RowDataPacket } from 'mysql2/promise'
import { requireAdmin } from '@/lib/supabase/admin-guard'
import { mysqlServerPool } from '@/lib/mysql/public'
import { AdminNav } from '../AdminNav'
import { NotAdmin } from '../NotAdmin'
import { reconcileRatingCountersAction } from './actions'

export const dynamic='force-dynamic'
export const metadata:Metadata={
  title:'Conciliación de valoraciones MySQL — Manual de Cocina',
  robots:{index:false,follow:false},
}
type Totals={recipes:number;votes:number;stars:number}
function totals(rows:ReadonlyArray<{rating_count:number|null;rating_sum:number|null}>):Totals{
  const rated=rows.filter(r=>Number(r.rating_count)>0)
  return {recipes:rated.length,
    votes:rated.reduce((v,r)=>v+Number(r.rating_count||0),0),
    stars:rated.reduce((v,r)=>v+Number(r.rating_sum||0),0)}
}
export default async function MigrationPage({searchParams}:{
  searchParams:Promise<{estado?:string}>
}){
  const {supabase,user,isAdmin}=await requireAdmin()
  if(!isAdmin)return <NotAdmin email={user.email}/>
  const {estado}=await searchParams
  const enabled=process.env.MYSQL_READS_ENABLED==='true'
  const canReconcile=enabled && process.env.MYSQL_RATINGS_ENABLED!=='true' &&
    process.env.ADMIN_AUTH_PROVIDER!=='mysql'
  let source:Totals|null=null, target:Totals|null=null
  if(process.env.ADMIN_AUTH_PROVIDER!=='mysql'){
    try{
      const rows:{rating_count:number|null;rating_sum:number|null}[]=[]
      for(let from=0;from<10000;from+=1000){
        const {data,error}=await supabase.from('recipes').select('rating_count,rating_sum')
          .gt('rating_count',0).order('id').range(from,from+999)
        if(error)throw Error('source unavailable')
        rows.push(...(data??[]))
        if(!data||data.length<1000)break
      }
      source=totals(rows)
    }catch {source=null}
  }
  if(enabled){
    try{
      const [rows]=await mysqlServerPool().execute<RowDataPacket[]>(
        'SELECT COUNT(*) AS recipes,COALESCE(SUM(rating_count),0) AS votes,'+
        'COALESCE(SUM(rating_sum),0) AS stars FROM recipes WHERE rating_count>0',
      )
      target={recipes:Number(rows[0]?.recipes??0),
        votes:Number(rows[0]?.votes??0),stars:Number(rows[0]?.stars??0)}
    }catch {target=null}
  }
  const equal=source!==null&&target!==null &&
    source.recipes===target.recipes&&source.votes===target.votes&&source.stars===target.stars
  return <main className="adm">
    <AdminNav current="salud"/>
    <h1>Valoraciones: Supabase → MySQL</h1>
    <p className="adm-sub">Comprobación privada de contadores. No se copian datos personales ni se reinician votos.</p>
    {estado==='sincronizado'&&<p role="status" className="adm-notice adm-notice-ok">Los totales de MySQL se reconciliaron con Supabase.</p>}
    {estado==='error'&&<p role="alert" className="adm-notice adm-notice-error">No se aplicaron cambios: la operación falló o los totales no coincidieron. Los datos anteriores se conservaron.</p>}
    {estado==='desactivado'&&<p role="alert" className="adm-notice">Esta operación no está habilitada en este entorno.</p>}
    <ul className="adm-counters">
      <li><strong>{source?.recipes??'—'}</strong> recetas valoradas en Supabase</li>
      <li><strong>{source?.votes??'—'}</strong> votos totales en Supabase</li>
      <li><strong>{target?.votes??'—'}</strong> votos reflejados en MySQL</li>
      <li className={equal?'good':'bad'}><strong>{equal?'Iguales':'Por revisar'}</strong> contadores</li>
    </ul>
    <p>El historial individual de votos se migra por separado. Esta comprobación
      solo sincroniza <code>rating_count</code> y <code>rating_sum</code>
      de las recetas, sin modificar el registro original.</p>
    {canReconcile&&source&&target&&<form action={reconcileRatingCountersAction}>
      <button className="adm-btn adm-btn-primary" type="submit">
        Sincronizar contadores de forma segura
      </button>
    </form>}
    {!enabled&&<p role="alert">Las lecturas públicas de MySQL no están activadas aquí. No se realizan escrituras.</p>}
    {enabled&&!target&&<p role="alert">No se pudo consultar MySQL desde este servidor. La sincronización queda bloqueada.</p>}
    <p><Link href="/admin">Volver al centro de publicación</Link></p>
  </main>
}

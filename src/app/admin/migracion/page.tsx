import Link from 'next/link'
import { createClient } from '@supabase/supabase-js'
import type { Metadata } from 'next'
import { type RowDataPacket } from 'mysql2/promise'
import { requireAdmin } from '@/lib/supabase/admin-guard'
import { mysqlServerPool } from '@/lib/mysql/public'
import { readRatingsSecrets } from '@/lib/ratings-config'
import { validateRatingHistorySnapshot, type HistoricalVote } from '@/lib/mysql/rating-history-snapshot'
import { AdminNav } from '../AdminNav'
import { NotAdmin } from '../NotAdmin'
import { reconcileRatingCountersAction } from './actions'
import { migrateIndividualRatingVotesAction } from './history-actions'

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
  let sourceHistory:number|null=null, targetHistory:number|null=null
  let sourceRows:HistoricalVote[]|null=null, targetRows:RowDataPacket[]|null=null
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
  if(canReconcile&&source){
    try{
      const {serviceKey}=readRatingsSecrets(process.env)
      if(serviceKey){
        const server=createClient(
          process.env.NEXT_PUBLIC_SUPABASE_URL??'https://eqbdtctxbpepbeickhqi.supabase.co',
          serviceKey,{auth:{persistSession:false,autoRefreshToken:false}},
        )
        const {data,error}=await server.rpc('mdc_rating_migration_snapshot')
        if(!error){
          const snapshot=validateRatingHistorySnapshot(data)
          sourceHistory=snapshot.source_vote_count
          sourceRows=snapshot.votes
        }
      }
    }catch {sourceHistory=null}
  }
  if(enabled){
    try{
      const [rows]=await mysqlServerPool().execute<RowDataPacket[]>(
        'SELECT id,recipe_id,voter_hash,rating FROM recipe_rating_votes',
      )
      targetRows=rows
      targetHistory=rows.length
    }catch {targetHistory=null}
  }
  const equal=source!==null&&target!==null &&
    source.recipes===target.recipes&&source.votes===target.votes&&source.stars===target.stars
  // Comparar filas una a una en el servidor, no solo el total (que podría
  // coincidir accidentalmente con hashes o ratings equivocados).
  const byId=new Map<string,RowDataPacket>(targetRows?.map(row=>[String(row.id),row] as const)??[])
  const sameHistory=equal&&sourceRows!==null&&targetRows!==null&&
    sourceRows.length===targetRows.length&&sourceRows.every(v=>{
      const row=byId.get(v.id)
      return row && String(row.recipe_id)===v.recipe_id&&
        String(row.voter_hash)===v.voter_hash&&Number(row.rating)===v.rating
    })
  return <main className="adm">
    <AdminNav current="salud"/>
    <h1>Valoraciones: Supabase → MySQL</h1>
    <p className="adm-sub">Comprobación privada de contadores. No se copian datos personales ni se reinician votos.</p>
    {estado==='sincronizado'&&<p role="status" className="adm-notice adm-notice-ok">Los totales de MySQL se reconciliaron con Supabase.</p>}
    {estado==='historial_ok'&&<p role="status" className="adm-notice adm-notice-ok">Se importó y verificó el historial individual de votos en MySQL. Supabase permanece activo por seguridad.</p>}
    {estado==='historial_error'&&<p role="alert" className="adm-notice adm-notice-error">No se pudo completar la importación del historial. No se alteraron los votos de Supabase ni los contadores existentes.</p>}
    {estado==='historial_desactivado'&&<p role="alert" className="adm-notice">La importación privada no está habilitada en este entorno.</p>}
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
    {canReconcile&&source&&target&&!equal&&<form action={reconcileRatingCountersAction}>
      <button className="adm-btn adm-btn-primary" type="submit">
        Sincronizar contadores de forma segura
      </button>
    </form>}
    {canReconcile&&<section>
      <h2>Historial individual de votos</h2>
      <p>Registro de protección contra votos duplicados. Esta operación no borra
        ninguna valoración ni reconstruye los 31 votos a partir de los 25 registros individuales.</p>
      <ul className="adm-counters">
        <li><strong>{sourceHistory??'—'}</strong> registros individuales en Supabase</li>
        <li><strong>{targetHistory??'—'}</strong> registros individuales en MySQL</li>
        <li className={sameHistory?'good':'bad'}><strong>{sameHistory?'Iguales':'Pendiente'}</strong> historial</li>
      </ul>
      {equal&&sourceHistory!==null&&!sameHistory&&
        <form action={migrateIndividualRatingVotesAction}>
          <button className="adm-btn adm-btn-primary" type="submit">
            Migrar historial individual a MySQL de forma segura
          </button>
        </form>}
      {sameHistory&&<p role="status">Los registros individuales y los contadores coinciden. Mantén Supabase activo hasta completar el panel administrativo.</p>}
      {sourceHistory===null&&<p role="alert">No se pudo consultar el registro privado del origen. La importación se mantiene desactivada.</p>}
    </section>}
    {!enabled&&<p role="alert">Las lecturas públicas de MySQL no están activadas aquí. No se realizan escrituras.</p>}
    {enabled&&!target&&<p role="alert">No se pudo consultar MySQL desde este servidor. La sincronización queda bloqueada.</p>}
    <p><Link href="/admin">Volver al centro de publicación</Link></p>
  </main>
}

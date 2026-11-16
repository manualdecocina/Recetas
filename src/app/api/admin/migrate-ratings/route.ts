import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/supabase/admin-guard'
import { synchronizeRatingsMysql } from '@/lib/mysql/rating-migration'

export const runtime='nodejs'
export const dynamic='force-dynamic'
const ORIGIN='https://manualdecocina.com'
const response=(status:string)=>NextResponse.redirect(
  new URL('/admin/migracion-votos?estado='+encodeURIComponent(status),ORIGIN),303,
)

/** Únicamente el administrador real de Supabase puede iniciar la importación.
 * Nunca se aceptan datos de votantes ni credenciales desde el formulario.
 */
export async function POST(request:NextRequest){
  if(request.nextUrl.hostname!=='manualdecocina.com'||request.headers.get('origin')!==ORIGIN)
    return NextResponse.json({error:'Origen no autorizado'},{status:403})
  if(!request.headers.get('content-type')?.startsWith('application/x-www-form-urlencoded'))
    return NextResponse.json({error:'Formato no permitido'},{status:415})
  const size=Number(request.headers.get('content-length')??0)
  if(size>1024)return NextResponse.json({error:'Solicitud demasiado grande'},{status:413})
  if(process.env.MYSQL_READS_ENABLED!=='true'||process.env.MYSQL_RATINGS_ENABLED==='true'||
     process.env.ADMIN_AUTH_PROVIDER==='mysql')return response('no_disponible')
  const {isAdmin}=await requireAdmin()
  if(!isAdmin)return NextResponse.json({error:'Sin autorización'},{status:403})
  const form=await request.formData().catch(()=>null)
  if(form?.get('confirmar')!=='SINCRONIZAR')return response('no_confirmado')
  try{
    const result=await synchronizeRatingsMysql()
    const url=new URL('/admin/migracion-votos',ORIGIN)
    url.searchParams.set('estado','correcto')
    url.searchParams.set('votos',String(result.sourceVotes))
    url.searchParams.set('totales',String(result.sourceRatingCount))
    url.searchParams.set('insertados',String(result.imported))
    return NextResponse.redirect(url,303)
  }catch(error){
    // No imprimir SQL, correos, claves ni voter_hash en los registros del hosting.
    console.error('[mysql-rating-migration] failed',{code:(error as {code?:string})?.code??'reconciliation'})
    return response('error')
  }
}

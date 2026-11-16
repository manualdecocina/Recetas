import { NextRequest, NextResponse } from 'next/server'
import { adminMysqlPool } from '@/lib/mysql/admin-db'
import {
  ADMIN_COOKIE, SESSION_DAYS, bootstrapFirstAdmin, loginAdmin, revokeAdminSession,
  constantTimeSecret, getAdminByToken,
} from '@/lib/mysql/admin-auth'
import { testMysqlEditorialWritesRollback } from '@/lib/mysql/qa-editorial-writes'
import type { RowDataPacket } from 'mysql2'

export const runtime='nodejs'
export const dynamic='force-dynamic'
const PREVIEWS=new Set(['mintcream-squirrel-383743.hostingersite.com','valiant-tan-hornet-51.hostingersite.com'])
const PREVIEW_URLS=new Set([...PREVIEWS].map(host=>'https://'+host))
const headers={'Cache-Control':'private, no-store','X-Robots-Tag':'noindex, nofollow','X-Content-Type-Options':'nosniff'}
function isPreview(request:NextRequest):boolean{
  const hosts=[
    request.nextUrl.hostname,request.headers.get('host')?.split(':')[0],
    request.headers.get('x-forwarded-host')?.split(',')[0]?.trim()?.split(':')[0],
  ]
  return hosts.some(host=>typeof host==='string'&&PREVIEWS.has(host))
}
function response(message:string,status:number){
  return NextResponse.json({status:message},{status,headers})
}
function go(request:NextRequest,notice:string){
  const origin=request.headers.get('origin')??''
  const safeOrigin=PREVIEW_URLS.has(origin)?origin:'https://mintcream-squirrel-383743.hostingersite.com'
  const url=new URL('/admin/qa-mysql',safeOrigin)
  url.searchParams.set('aviso',notice)
  return NextResponse.redirect(url,{status:303,headers})
}
/** Diagnóstico del esquema exclusivamente. No entrega correos, usuarios ni secretos. */
export async function GET(request:NextRequest){
  if(!isPreview(request))return response('not_found',404)
  if(process.env.ADMIN_AUTH_PROVIDER!=='mysql')return response('not_enabled',200)
  try{
    const [rows]=await adminMysqlPool().execute<RowDataPacket[]>('SELECT COUNT(*) AS n FROM admin_auth_users')
    return NextResponse.json({status:'schema_ready',bootstrap_required:Number(rows[0]?.n??0)===0},{headers})
  }catch{
    return response('schema_not_installed',503)
  }
}
/** Formulario QA privado en preview, no integrado al panel actual /admin. */
export async function POST(request:NextRequest){
  if(!isPreview(request))return response('not_found',404)
  if(process.env.ADMIN_AUTH_PROVIDER!=='mysql')return response('not_enabled',404)
  // Sin CORS. No admitir formularios lanzados desde dominios ajenos.
  if(!PREVIEW_URLS.has(request.headers.get('origin')??''))return response('invalid_origin',403)
  if(!request.headers.get('content-type')?.startsWith('application/x-www-form-urlencoded'))return response('invalid_type',415)
  const size=Number(request.headers.get('content-length')??0)
  if(size>4096)return response('too_large',413)
  let form:FormData
  try{form=await request.formData()}catch{return response('invalid_form',400)}
  const action=form.get('action')
  if(action==='logout'){
    try{await revokeAdminSession(request.cookies.get(ADMIN_COOKIE)?.value)}catch{return response('unavailable',503)}
    const redirect=go(request,'salida')
    redirect.cookies.set(ADMIN_COOKIE,'',{path:'/',httpOnly:true,secure:true,sameSite:'strict',expires:new Date(0)})
    return redirect
  }
  if(action==='smoke'){
    const current=await getAdminByToken(request.cookies.get(ADMIN_COOKIE)?.value)
    if(!current)return go(request,'entrada_invalida')
    try {
      const ok=await testMysqlEditorialWritesRollback(current.id)
      return go(ok?'qa_escritura_ok':'qa_escritura_error')
    }catch{return go(request,'qa_escritura_error')}
  }
  if(action==='bootstrap'){
    const secret=process.env.ADMIN_BOOTSTRAP_SECRET??''
    // La clave se define exclusivamente en variables privadas de Hostinger.
    if(secret.length<48||!constantTimeSecret(form.get('setup_secret'),secret))return go(request,'no_autorizado')
    const email=form.get('email'),password=form.get('password'),confirm=form.get('confirm')
    if(typeof email!=='string'||typeof password!=='string'||password!==confirm)return go(request,'datos_invalidos')
    try{
      if(!await bootstrapFirstAdmin(email,password))return go(request,'ya_configurado')
      return go(request,'cuenta_creada')
    }catch{
      return go(request,'datos_invalidos')
    }
  }
  if(action==='login'){
    const email=form.get('email'),password=form.get('password')
    if(typeof email!=='string'||typeof password!=='string')return go(request,'entrada_invalida')
    try{
      const result=await loginAdmin(email,password)
      if(!result.ok)return go(request,'entrada_invalida')
      const redirect=go(request,'bienvenido')
      redirect.cookies.set(ADMIN_COOKIE,result.token,{
        path:'/',httpOnly:true,secure:true,sameSite:'strict',
        maxAge:SESSION_DAYS*24*60*60,
      })
      return redirect
    }catch{
      return go(request,'entrada_invalida')
    }
  }
  return response('unknown_action',400)
}

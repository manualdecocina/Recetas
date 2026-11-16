/**
 * Cliente de lectura pública compatible con la cadena de consultas Supabase.
 * SOLO SELECT, sin escritura ni acceso a admins/auth. Todas las variables SQL se parametrizan.
 */
type Row = Record<string, any>
type Executor = (sql: string, params: unknown[]) => Promise<Row[]>
type ResponseShape = { data: any; error: { message: string; code?: string } | null; count: number | null }
type Criterion = { sql: string; args: unknown[] }
const bt = String.fromCharCode(96)
const tables = new Set(['recipes','content_pages','content_redirects','ingredients','ingredient_aliases',
  'recipe_ingredients','recipe_ingredient_pending','recipe_cuisines','cuisines','media_assets','recipe_reviews'])
const bools = new Set(['published','searchable','indexable'])
const jsonFields: Record<string,string[]> = {
  recipes: ['ingredients','steps','keywords','nutrition','gallery','video_urls','seo'],
  content_pages: ['seo'],
}
function name(value:string) {
  if(!/^[a-z_][a-z0-9_]*$/i.test(value)) throw Error('Identificador MySQL no permitido')
  return bt + value + bt
}
// En MySQL la URL se sirve desde Hostinger; conservar la ruta relativa real.
// No sustituir URLs externas, de terceros ni source_url (proveniencia editorial).
const storagePrefix='https://eqbdtctxbpepbeickhqi.supabase.co/storage/v1/object/public/'
function rewritePublicMedia(value:any):any {
  if(typeof value==='string') {
    if(value.startsWith(storagePrefix+'recetas/')) return '/recetas/'+value.slice((storagePrefix+'recetas/').length)
    if(value.startsWith(storagePrefix+'receta-videos/')) return '/videos/'+value.slice((storagePrefix+'receta-videos/').length)
    return value
  }
  if(Array.isArray(value)) return value.map(rewritePublicMedia)
  if(value && typeof value==='object') return Object.fromEntries(Object.entries(value).map(([k,v])=>[k,rewritePublicMedia(v)]))
  return value
}
function normalize(table:string,row:Row,preserveMediaUrls=false):Row {
  const result = {...row}
  for(const field of jsonFields[table]??[]) if(typeof result[field]==='string') result[field]=JSON.parse(result[field])
  if(!preserveMediaUrls) for(const field of ['image_url','featured_image_url','ingredients','steps','gallery','video_urls','seo']) {
    if(Object.hasOwn(result,field)) result[field]=rewritePublicMedia(result[field])
  }
  for(const field of Object.keys(result)){
    if(bools.has(field) && (result[field]===0||result[field]===1))result[field]=!!result[field]
    // mysql2 devuelve Date cuando dateStrings no está activado; el código editorial
    // espera una cadena ISO con localeCompare y no debe recibir un Date.
    if(/^(created_at|updated_at|published_at|ready_at|reviewed_at)$/.test(field)) {
      const value=result[field]
      if(value instanceof Date) {
        if(Number.isNaN(value.getTime())) throw Error('Fecha MySQL no válida')
        result[field]=value.toISOString()
      } else if(typeof value==='string' && /^\d{4}-\d\d-\d\d \d\d:\d\d:\d\d/.test(value)) {
        result[field]=value.replace(' ','T')+'Z'
      }
    }
  }
  return result
}
class ReadBuilder implements PromiseLike<ResponseShape> {
  private fields='*'
  private relations=false
  private filters:Criterion[]=[]
  private sorts:string[]=[]
  private start=0
  private size=1000
  private counting=false
  private head=false
  private table:string
  private execute:Executor
  private includeUnpublished:boolean
  private preserveMediaUrls:boolean
  constructor(table:string,execute:Executor,includeUnpublished=false,preserveMediaUrls=false) {
    this.table=table
    this.execute=execute
    this.includeUnpublished=includeUnpublished
    this.preserveMediaUrls=preserveMediaUrls
    if(!tables.has(table))throw Error('Tabla no autorizada: '+table)
    // Seguro por defecto: jamás exponer borradores a una lectura pública.
    if(!includeUnpublished&&(table==='recipes'||table==='content_pages'))this.filters.push({sql:name('published')+' = ?',args:[1]})
  }
  select(fields='*',opts?:{count?:string;head?:boolean}) {
    const relation=/,\s*recipe_ingredients\(position,\s*ingredients\(name,\s*slug,\s*indexable\)\)\s*$/
    this.relations=relation.test(fields)
    const cols=fields.replace(relation,'').split(',').map(x=>x.trim())
    if(cols.length===1&&cols[0]==='*')this.fields='*'
    else this.fields=cols.map(name).join(', ')
    this.counting=opts?.count==='exact';this.head=opts?.head===true
    return this
  }
  eq(col:string,val:unknown){if(val===null)return this.is(col,null);this.filters.push({sql:name(col)+' = ?',args:[typeof val==='boolean'?Number(val):val]});return this}
  neq(col:string,val:unknown){this.filters.push({sql:name(col)+' <> ?',args:[val]});return this}
  is(col:string,val:null){if(val!==null)throw Error('IS solo soporta NULL');this.filters.push({sql:name(col)+' IS NULL',args:[]});return this}
  not(col:string,op:string,val:unknown){if(op==='is'&&val===null){this.filters.push({sql:name(col)+' IS NOT NULL',args:[]});return this}if(op==='eq')return this.neq(col,val);throw Error('NOT desconocido')}
  in(col:string,list:readonly unknown[]){if(!Array.isArray(list)||list.length>2000)throw Error('IN demasiado largo');this.filters.push(list.length?{sql:name(col)+' IN ('+list.map(()=>'?').join(',')+')',args:[...list]}:{sql:'1=0',args:[]});return this}
  gte(col:string,val:unknown){this.filters.push({sql:name(col)+' >= ?',args:[val]});return this}
  lte(col:string,val:unknown){this.filters.push({sql:name(col)+' <= ?',args:[val]});return this}
  gt(col:string,val:unknown){this.filters.push({sql:name(col)+' > ?',args:[val]});return this}
  lt(col:string,val:unknown){this.filters.push({sql:name(col)+' < ?',args:[val]});return this}
  ilike(col:string,val:string){this.filters.push({sql:name(col)+' LIKE ? COLLATE utf8mb4_unicode_ci',args:[val]});return this}
  or(text:string){
    // Solo el filtro OR del buscador, nunca SQL arbitrario de un visitante.
    const parts=/^title\.ilike\."(.*)",excerpt\.ilike\."(.*)"$/.exec(text)
    if(!parts)throw Error('OR no autorizado')
    const decode=(v:string)=>v.replace(/\\"/g,'"').replace(/\\\\/g,'\\')
    this.filters.push({sql:'(title LIKE ? COLLATE utf8mb4_unicode_ci OR excerpt LIKE ? COLLATE utf8mb4_unicode_ci)',args:[decode(parts[1]),decode(parts[2])]})
    return this
  }
  order(col:string,opts?:{ascending?:boolean;nullsFirst?:boolean}){
    const field=name(col)
    if(typeof opts?.nullsFirst==='boolean')this.sorts.push(field+' IS NULL '+(opts.nullsFirst?'DESC':'ASC'))
    this.sorts.push(field+(opts?.ascending===false?' DESC':' ASC'))
    return this
  }
  range(from:number,to:number){if(!Number.isSafeInteger(from)||!Number.isSafeInteger(to)||from<0||to<from||to-from>=2000)throw Error('Rango inválido');this.start=from;this.size=to-from+1;return this}
  limit(n:number){if(!Number.isSafeInteger(n)||n<0||n>2000)throw Error('Límite inválido');this.size=n;return this}
  private async run(single=false,optional=false):Promise<ResponseShape>{
    try{
      const predicate=this.filters.length?' WHERE '+this.filters.map(f=>'('+f.sql+')').join(' AND '):''
      const params=this.filters.flatMap(f=>f.args)
      let count:null|number=null
      if(this.counting){const result=await this.execute('SELECT COUNT(*) AS total FROM '+name(this.table)+predicate,params);count=Number(result[0]?.total??0)}
      if(this.head)return {data:null,error:null,count}
      const ordering=this.sorts.length?' ORDER BY '+this.sorts.join(', '):''
      const rows=await this.execute('SELECT '+this.fields+' FROM '+name(this.table)+predicate+ordering+' LIMIT ? OFFSET ?',[...params,this.size,this.start])
      const data=rows.map(row=>normalize(this.table,row,this.preserveMediaUrls))
      if(this.relations&&data.length){
        if(this.table!=='recipes')throw Error('Relación anidada no autorizada')
        const ids=data.map(r=>r.id)
        if(ids.some(x=>typeof x!=='string'))throw Error('ID de receta ausente')
        const rel=await this.execute(
          'SELECT ri.recipe_id,ri.position,i.name,i.slug,i.indexable FROM recipe_ingredients ri LEFT JOIN ingredients i ON i.id=ri.ingredient_id WHERE ri.recipe_id IN ('+
          ids.map(()=>'?').join(',')+') ORDER BY ri.position ASC',ids)
        const byId=new Map<string,any[]>()
        for(const item of rel){
          const arr=byId.get(item.recipe_id)??[]
          arr.push({position:item.position,ingredients:item.name==null?null:{name:item.name,slug:item.slug,indexable:item.indexable===1||item.indexable===true}})
          byId.set(item.recipe_id,arr)
        }
        for(const row of data)row.recipe_ingredients=byId.get(row.id)??[]
      }
      if(!single)return {data,error:null,count}
      if(!data.length&&optional)return {data:null,error:null,count}
      if(data.length!==1)return {data:null,error:{message:'Se esperaba una sola fila',code:'PGRST116'},count}
      return {data:data[0],error:null,count}
    }catch(error){return {data:null,error:{message:error instanceof Error?error.message:'Error de lectura MySQL'},count:null}}
  }
  // Respetar .limit(1) y .range(0,0): antes se forzaban 2 filas y la home
  // fallaba durante el prerender al detectar dos recetas destacadas.
  maybeSingle(){this.size=Math.min(this.size,2);return this.run(true,true)}
  single(){this.size=Math.min(this.size,2);return this.run(true,false)}
  then<R1=ResponseShape,R2=never>(ok?:((v:ResponseShape)=>R1|PromiseLike<R1>)|null,fail?:((e:any)=>R2|PromiseLike<R2>)|null):Promise<R1|R2>{return this.run().then(ok,fail)}
}
export function createMysqlReadClient(execute:Executor,options?:{includeUnpublished?:boolean;preserveMediaUrls?:boolean}) {
  return {from(table:string){return new ReadBuilder(table,execute,options?.includeUnpublished===true,options?.preserveMediaUrls===true).select('*')}}
}

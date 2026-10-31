const EXPECTED: Record<string,string> = {"tamal-tolimense/paso-30.webp": "8b822fd2922bc03985c25178ef70d72f523ea93ee56c9b4b776bb9da0ed22e85", "tamal-tolimense/paso-27.webp": "de03676b0370aaf31cf99059d01a60c14169dd36eaf5f1a547c53f8051be8b9e", "tamal-tolimense/portada-16x9.webp": "142ea074ce8ab02aa9a51c0019b495be92ca296c430cf442a5e9caccfab86cb9", "tamal-tolimense/portada-1x1.webp": "e68d8bca7be26026089a1bc43a4f0e763d6fb30f6e0cbf97781a4c680439e043", "tamal-tolimense/paso-06.webp": "efdb3ab32b76ce77654242e151908460c67bd4a739fd97d67f9a60ac32e85a1d", "tamal-tolimense/paso-19.webp": "4b144ae2b23a711f5b069bb1d1d476e28af64edaa2612cea7887a28bec95e8e6", "tamal-tolimense/paso-33.webp": "f7c6046157df9953bfbdbd8318716ec220f484d29b364a19d19915eafb4a32f7", "tamal-tolimense/paso-14.webp": "4bb8ee3b6f3ec16b8d03c104ae11511612cf947ffbb87e040802c24f2fcb154b", "tamal-tolimense/portada-4x3.webp": "a403d1868031f33e2cd8415e41b81f4a71f48a235ae4d8baa008f5134963aafd", "tamal-tolimense/portada.webp": "a403d1868031f33e2cd8415e41b81f4a71f48a235ae4d8baa008f5134963aafd", "tamal-tolimense/ingredientes.webp": "66aad7fc68328a212fff66be3ef64628635552a806134e5b0d5913c85a816226"};
const TOKEN_HASH = "3ff0f1ba8d1215488ab2a40bddb8e8343ceb82c8fe9b697ea887535de6a201d3";
const REVISION = "987bf900c665db50f102895aaf01021c9d55570d";
const enc = new TextEncoder();
async function hash(data: Uint8Array) { return Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256',data))).map(b=>b.toString(16).padStart(2,'0')).join(''); }
function reply(body: unknown,status=200){return new Response(JSON.stringify(body),{status,headers:{'Content-Type':'application/json','Cache-Control':'no-store'}});}
Deno.serve(async(req: Request)=>{
 if(req.method!== 'POST')return reply({error:'POST required'},405);
 if(await hash(enc.encode(req.headers.get('x-upload-token')??''))!==TOKEN_HASH)return reply({error:'Unauthorized'},403);
 const service=Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');const base=Deno.env.get('SUPABASE_URL');
 if(!service||!base)return reply({error:'Server configuration missing'},500);
 const headers={Authorization:`Bearer ${service}`,apikey:service};
 const results=[];
 for(const [path,digest] of Object.entries(EXPECTED)){
  const remote=await fetch(`https://raw.githubusercontent.com/manualdecocina/Recetas/${REVISION}/public/recetas/${path}`);
  if(!remote.ok)return reply({error:'Source unavailable',path},502);
  const bytes=new Uint8Array(await remote.arrayBuffer());
  if(bytes.length>5242880||await hash(bytes)!==digest||new TextDecoder().decode(bytes.slice(8,12))!=='WEBP')return reply({error:'Source validation failed',path},422);
  const check=await fetch(`${base}/storage/v1/object/public/recetas/${path}`);
  if(check.ok){const old=new Uint8Array(await check.arrayBuffer());if(await hash(old)!==digest)return reply({error:'Destination exists with different bytes',path},409);results.push({path,status:'already-present'});continue;}
  if(check.status!==400&&check.status!==404)return reply({error:'Destination check failed',path,status:check.status},502);
  const uploaded=await fetch(`${base}/storage/v1/object/recetas/${path}`,{method:'POST',headers:{...headers,'Content-Type':'image/webp','cache-control':'31536000','x-upsert':'false'},body:bytes});
  if(!uploaded.ok)return reply({error:'Upload failed',path,status:uploaded.status},502);
  results.push({path,status:'uploaded',bytes:bytes.length});
 }
 return reply({ok:true,bucket:'recetas',files:results});
});

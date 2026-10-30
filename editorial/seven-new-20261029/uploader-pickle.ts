const ALLOWED:Record<string,string> = {"dip-pepinillos-tocineta/portada.webp": "9728252a631398b192a9c5f9ebdd2c3ee136b780a68c435de9b34263d1216659", "dip-pepinillos-tocineta/portada-4x3.webp": "9728252a631398b192a9c5f9ebdd2c3ee136b780a68c435de9b34263d1216659", "dip-pepinillos-tocineta/portada-1x1.webp": "2fac7641aa87eacf682bba8b5125e66378d2a9b4dbb89cc23ad96495ad954a8b", "dip-pepinillos-tocineta/portada-16x9.webp": "36ddab7f04b91ba64f68854a5e661997b3fa784143a2adfa5fd40c77364be71b", "dip-pepinillos-tocineta/paso-08.webp": "fa37024b9f230c9acc58e0f657be87de7660d61de99bbf5c38478389d15b84e7", "dip-pepinillos-tocineta/paso-01.webp": "54a4df2b668834f5c764dee0775a148ad89914bee4e1ce8f6279fa117fe5503c", "dip-pepinillos-tocineta/paso-02.webp": "1c1a08cbc660a92a1ad4a1313a0c0b98cb4c9e1b8b2433c511faa445d0347f76", "dip-pepinillos-tocineta/paso-03.webp": "77a83a674a58026b9064adac8799cace600f2a22de8fe085cac741ee68cc04c9", "dip-pepinillos-tocineta/paso-04.webp": "0ab1b2708c998944100d565c1b2239c62c2a3c52187d8d4d1b07bb042adf0680", "dip-pepinillos-tocineta/paso-05.webp": "0789b15de607449b5793db6167e8a6c7581a811557cb27fcc2d2738945f4bb44", "dip-pepinillos-tocineta/paso-06.webp": "18ed319a256d8a10596784c28f22b2980f86538aa7124cb9f2a1a3eddd667990", "dip-pepinillos-tocineta/paso-07.webp": "7c29854466f878b62ae0f8be7d7d81b0f901181708a11f32fe3362fd25a3cb67"};
const EXPIRES="2026-10-29T20:39:20.953Z";
Deno.serve(async(req:Request)=>{
const reply=(body:unknown,status=200)=>new Response(JSON.stringify(body),{status,headers:{"Content-Type":"application/json"}});
if(req.method!=="POST")return reply({error:"POST required"},405);
if(Date.now()>Date.parse(EXPIRES))return reply({error:"Upload window closed"},410);
const path=new URL(req.url).searchParams.get("path")||"";
if(!Object.hasOwn(ALLOWED,path))return reply({error:"Unapproved asset"},403);
if(req.headers.get("content-type")!=="image/webp")return reply({error:"WebP only"},415);
const body=await req.arrayBuffer();
if(body.byteLength>150000||body.byteLength<100)return reply({error:"Invalid size"},413);
const hash=Array.from(new Uint8Array(await crypto.subtle.digest("SHA-256",body))).map(x=>x.toString(16).padStart(2,"0")).join("");
if(hash!==ALLOWED[path])return reply({error:"Unapproved bytes"},403);
const base=Deno.env.get("SUPABASE_URL");
const key=Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")||Object.values(JSON.parse(Deno.env.get("SUPABASE_SECRET_KEYS")||"{}"))[0];
if(!base||!key)return reply({error:"Storage configuration unavailable"},503);
const r=await fetch(base+"/storage/v1/object/recetas/"+path,{method:"POST",headers:{"Authorization":"Bearer "+key,"apikey":String(key),"Content-Type":"image/webp","Cache-Control":"max-age=31536000","x-upsert":"false"},body});
if(!r.ok)return reply({error:"Storage write rejected",status:r.status},r.status);
return reply({uploaded:true,path,sha256:hash});
});


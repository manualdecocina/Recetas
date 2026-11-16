/**
 * Núcleo criptográfico de sesiones administrativas (Node, no runtime Edge).
 * No almacena contraseñas ni tokens en claro; todos los secretos están en el servidor.
 * Algoritmo: scrypt N=2^15, r=8, p=1, 64 bytes; salts aleatorios individuales.
 */
import { createHash, createHmac, randomBytes, scrypt as nodeScrypt, timingSafeEqual } from 'node:crypto'
import { promisify } from 'node:util'
const scrypt = promisify(nodeScrypt)
export const ADMIN_COOKIE = 'mdc-admin-session'
export const SESSION_DAYS = 7
export const RESET_MINUTES = 20
export const SCRYPT_PARAMS = Object.freeze({ N: 32768, r: 8, p: 1, maxmem: 64 * 1024 * 1024 })
export function emailKey(email:string):string {
  if(typeof email!=='string') throw Error('Email inválido')
  return email.normalize('NFC').trim().toLowerCase()
}
export function strongPassword(password:unknown):password is string {
  return typeof password==='string' && password.length>=14 && password.length<=256 &&
    password.trim()===password && !password.includes('\0') &&
    /[a-z]/.test(password) && /[A-Z]/.test(password) && /\d/.test(password)
}
export function sessionToken():string { return randomBytes(32).toString('hex') }
export function validToken(token:unknown):token is string {
  return typeof token==='string' && /^[0-9a-f]{64}$/.test(token)
}
export function tokenHash(token:string):Buffer {
  if(!validToken(token)) throw Error('Token de sesión inválido')
  return createHash('sha256').update(token,'ascii').digest()
}
export function constantTimeSecret(received:unknown,expected:string):boolean {
  if(typeof received!=='string'||!expected||received.length!==expected.length) return false
  const a=Buffer.from(received,'utf8'),b=Buffer.from(expected,'utf8')
  return a.length===b.length && timingSafeEqual(a,b)
}
export async function passwordHash(password:string,salt:Buffer=randomBytes(32)):
  Promise<{salt:Buffer;hash:Buffer}> {
  if(!strongPassword(password)||salt.length!==32)throw Error('Contraseña inválida')
  const hash=await scrypt(password,salt,64,SCRYPT_PARAMS) as Buffer
  return {salt,hash}
}
export async function verifyPassword(password:unknown,salt:Buffer,hash:Buffer):Promise<boolean>{
  const candidate=typeof password==='string'?password:''
  if(candidate.length>256||salt.length!==32||hash.length!==64)return false
  const digest=await scrypt(candidate,salt,64,SCRYPT_PARAMS) as Buffer
  return timingSafeEqual(digest,hash)
}
export function attemptsKey(secret:string,type:'email'|'ip-email',email:string,ip=''):Buffer {
  if(secret.length<32)throw Error('ADMIN_AUTH_KEY debe contener al menos 32 caracteres')
  return createHmac('sha256',secret).update(type).update('\0').update(emailKey(email)).update('\0').update(ip).digest()
}

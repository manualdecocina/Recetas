import assert from 'node:assert/strict'
import {
  ADMIN_COOKIE, SESSION_DAYS, attemptsKey, adminAttemptsSecret, constantTimeSecret, emailKey, passwordHash, passwordHashVerifiedExisting,
  sessionToken, strongPassword, tokenHash, validToken, verifyPassword,
} from '../../src/lib/mysql/admin-crypto.ts'

assert.equal(ADMIN_COOKIE,'mdc-admin-session')
assert.equal(SESSION_DAYS,7)
assert.equal(emailKey('  Admin@ManualDeCocina.COM  '),'admin@manualdecocina.com')
assert.equal(strongPassword('short'),false)
assert.equal(strongPassword('Long Secure PASSWORD 12345'),true)

const password='DemoMdcPassword_2026!NeverDeploy'
const hashed=await passwordHash(password)
assert.equal(hashed.salt.length,32)
assert.equal(hashed.hash.length,64)
assert.equal(await verifyPassword(password,hashed.salt,hashed.hash),true)
assert.equal(await verifyPassword('another secure wrong password',hashed.salt,hashed.hash),false)
const existingShort='Clave123' // 8 caracteres: válida en Supabase, sin cumplir la nueva política 14
assert.equal(strongPassword(existingShort),false)
const migrated=await passwordHashVerifiedExisting(existingShort)
assert.equal(await verifyPassword(existingShort,migrated.salt,migrated.hash),true)
assert.equal(await verifyPassword('otraClave',migrated.salt,migrated.hash),false)
await assert.rejects(()=>passwordHashVerifiedExisting('corta'))
const second=await passwordHash(password)
assert.notDeepEqual(second.salt,hashed.salt)
assert.notDeepEqual(second.hash,hashed.hash)

const token=sessionToken(),other=sessionToken()
assert.equal(validToken(token),true)
assert.equal(validToken(other),true)
assert.equal(token.length,64)
assert.notEqual(token,other)
assert.deepEqual(tokenHash(token),tokenHash(token))
assert.notDeepEqual(tokenHash(token),tokenHash(other))
assert.equal(validToken('abc'),false)
assert.equal(constantTimeSecret('private-bootstrap-token','private-bootstrap-token'),true)
assert.equal(constantTimeSecret('wrong-bootstrap-token','private-bootstrap-token'),false)
assert.deepEqual(attemptsKey('A'.repeat(32),'email','ADMIN@TEST.COM'),
  attemptsKey('A'.repeat(32),'email','admin@test.com'))
assert.notDeepEqual(attemptsKey('A'.repeat(32),'email','a@test.com'),
  attemptsKey('A'.repeat(32),'email','b@test.com'))
// La nueva cuenta puede utilizar una clave privada derivada de un secreto HMAC
// ya existente sin reutilizar directamente el mismo secreto entre sistemas.
const hmacKey='s'.repeat(64)
const derived=adminAttemptsSecret({RATINGS_HASH_SECRET:hmacKey})
assert.equal(derived.length,64)
assert.notEqual(derived,hmacKey)
assert.equal(derived,adminAttemptsSecret({RATINGS_HASH_SECRET:hmacKey}))
assert.notEqual(derived,adminAttemptsSecret({RATINGS_HASH_SECRET:'t'.repeat(64)}))
assert.equal(adminAttemptsSecret({ADMIN_AUTH_KEY:'d'.repeat(48),RATINGS_HASH_SECRET:hmacKey}),'d'.repeat(48))
assert.throws(()=>adminAttemptsSecret({RATINGS_HASH_SECRET:'too-short'}))
console.log('MySQL admin crypto security tests PASS')

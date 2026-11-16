import assert from 'node:assert/strict'
import {
  ADMIN_COOKIE, SESSION_DAYS, attemptsKey, constantTimeSecret, emailKey, passwordHash,
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
console.log('MySQL admin crypto security tests PASS')

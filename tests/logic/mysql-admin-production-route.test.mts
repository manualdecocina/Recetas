import assert from 'node:assert/strict'
import fs from 'node:fs'
import { fileURLToPath } from 'node:url'

const read = (name:string) => fs.readFileSync(fileURLToPath(new URL(name, import.meta.url)), 'utf8')
const middleware=read('../../src/middleware.ts')
const guard=read('../../src/lib/supabase/admin-guard.ts')
const actions=read('../../src/app/admin/actions.ts')
const login=read('../../src/app/admin/login/page.tsx')

assert.match(middleware, /if \(process\.env\.ADMIN_AUTH_PROVIDER === 'mysql'\)/)
assert.match(middleware, /return NextResponse\.next\(\)/)
assert.match(middleware, /pathname === '\/admin\/recuperar'/)
assert.match(middleware, /pathname === '\/admin\/auth\/callback'/)
assert.match(guard, /const mysql = await getMysqlAdminRead\(\)/)
assert.match(guard, /if \(!mysql\) redirect\('\/admin\/login'\)/)
assert.doesNotMatch(guard, /mintcream-squirrel/)
assert.match(actions, /function isMysqlAdminActive\(\): boolean/)
assert.match(actions, /await loginAdmin\(parsed\.data\.email, parsed\.data\.password\)/)
assert.match(actions, /await revokeAdminSession\(/)
assert.doesNotMatch(actions, /mintcream-squirrel/)
assert.match(login, /process\.env\.ADMIN_AUTH_PROVIDER !== 'mysql'/)
console.log('Admin MySQL production cutover routing checks PASS')

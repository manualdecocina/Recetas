import { supabase } from '@/lib/supabase/public'
import { MCP_NAME, MCP_PROTOCOL_VERSION, MCP_TOOLS, MCP_VERSION } from '@/lib/mcp-manifest'
import { getSiteUrl, recipeCanonicalUrl } from '@/lib/site'

// A stateless, read-only MCP Streamable HTTP endpoint. No login, user data,
// database writes, or external fetches; all queries use public RLS and hard limits.
export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

type RpcId = string | number | null
type RpcRequest = {
  jsonrpc?: unknown
  id?: RpcId
  method?: unknown
  params?: unknown
}

const responseHeaders = { 'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff' }

function ok(id: RpcId, result: unknown) {
  return Response.json({ jsonrpc: '2.0', id, result }, { headers: responseHeaders })
}
function fail(id: RpcId, code: number, message: string, status = 200) {
  return Response.json({ jsonrpc: '2.0', id, error: { code, message } }, { status, headers: responseHeaders })
}
function object(value: unknown): Record<string, unknown> {
  return value && typeof value === 'object' && !Array.isArray(value) ? value as Record<string, unknown> : {}
}
function toolText(data: unknown) {
  return { content: [{ type: 'text', text: JSON.stringify(data) }] }
}
function invalidTool(message: string) {
  return { isError: true, content: [{ type: 'text', text: message }] }
}
function languageArg(value: unknown): string | null {
  return value === undefined ? 'es' :
    (typeof value === 'string' && ['es','en','de','fr','it','ja','pt'].includes(value) ? value : null)
}

async function callTool(name: unknown, args: Record<string, unknown>) {
  if (name === 'search_recipes') {
    const raw = args.query
    const lang = languageArg(args.language)
    const limit = args.limit === undefined ? 5 : args.limit
    if (typeof raw !== 'string' || raw.trim().length < 2 || raw.length > 80 || !lang ||
        !Number.isInteger(limit) || (limit as number) < 1 || (limit as number) > 10) {
      return invalidTool('Enter a title query (2–80 characters), a supported language, and a limit of 1–10.')
    }
    // Wildcards / PostgREST punctuation must not turn title search into a broad table scan.
    const query = raw.trim().replace(/[%_*,()]/g, ' ').replace(/\s+/g, ' ').trim()
    if (query.length < 2) return invalidTool('Search query must contain at least two normal characters.')
    const { data, error } = await supabase
      .from('recipes')
      .select('title, excerpt, language, public_path, source_url, updated_at')
      .eq('published', true)
      .eq('language', lang)
      .ilike('title', `%${query}%`)
      .order('updated_at', { ascending: false })
      .limit(limit as number)
    if (error) return invalidTool('Recipe search is temporarily unavailable.')
    return toolText((data ?? []).map(recipe => ({
      title: recipe.title, excerpt: recipe.excerpt, language: recipe.language,
      url: recipeCanonicalUrl(recipe), updated_at: recipe.updated_at,
    })))
  }

  if (name === 'get_recipe') {
    const path = args.path
    if (typeof path !== 'string' || path.length < 2 || path.length > 240 ||
        !path.startsWith('/') || path.includes('?') || path.includes('#')) {
      return invalidTool('Provide a published recipe URL path beginning with /, without query or fragment.')
    }
    const { data, error } = await supabase
      .from('recipes')
      .select('title, excerpt, public_path, source_url, language, ingredients, steps, category, prep_time_minutes, cook_time_minutes, servings, updated_at')
      .eq('published', true)
      .eq('public_path', path)
      .maybeSingle()
    if (error) return invalidTool('Recipe lookup is temporarily unavailable.')
    if (!data) return toolText({ found: false })
    return toolText({
      found: true, title: data.title, description: data.excerpt,
      url: recipeCanonicalUrl(data), language: data.language, category: data.category,
      prep_time_minutes: data.prep_time_minutes, cook_time_minutes: data.cook_time_minutes,
      servings: data.servings, ingredients: data.ingredients, steps: data.steps,
      updated_at: data.updated_at,
    })
  }

  return invalidTool('Unknown tool. Call tools/list for supported tool names.')
}

export async function POST(request: Request) {
  const origin = request.headers.get('origin')
  if (origin && origin !== new URL(request.url).origin && origin !== getSiteUrl()) {
    return new Response('Forbidden origin', { status: 403, headers: responseHeaders })
  }
  const accept = request.headers.get('accept') ?? ''
  if (accept && !accept.includes('application/json') && !accept.includes('*/*')) {
    return new Response('This server uses JSON responses. Accept application/json.', { status: 406, headers: responseHeaders })
  }

  let body: RpcRequest
  try { body = await request.json() as RpcRequest } catch { return fail(null, -32700, 'Parse error', 400) }
  if (!body || Array.isArray(body) || body.jsonrpc !== '2.0' || typeof body.method !== 'string') {
    return fail(null, -32600, 'Invalid JSON-RPC request', 400)
  }
  if (body.id !== undefined && body.id !== null && typeof body.id !== 'string' && typeof body.id !== 'number') {
    return fail(null, -32600, 'Invalid request id', 400)
  }
  const id = body.id ?? null

  // MCP notifications have no id and must not get a JSON-RPC result.
  if (body.id === undefined && body.method.startsWith('notifications/')) {
    return new Response(null, { status: 202, headers: responseHeaders })
  }

  if (body.method === 'initialize') {
    return ok(id, {
      protocolVersion: MCP_PROTOCOL_VERSION,
      capabilities: { tools: { listChanged: false } },
      serverInfo: { name: MCP_NAME, title: 'Manual de Cocina', version: MCP_VERSION },
      instructions: 'Read only public published recipes. No authenticated or mutating actions.',
    })
  }
  if (body.method === 'ping') return ok(id, {})
  if (body.method === 'tools/list') return ok(id, { tools: MCP_TOOLS })
  if (body.method === 'tools/call') {
    const params = object(body.params)
    try { return ok(id, await callTool(params.name, object(params.arguments))) }
    catch { return ok(id, invalidTool('The recipe service is temporarily unavailable.')) }
  }
  return fail(id, -32601, 'Method not found')
}

// Stateless Streamable HTTP: no server-push SSE stream or sessions.
export function GET() {
  return new Response('This MCP endpoint accepts POST JSON-RPC requests.', {
    status: 405, headers: { ...responseHeaders, Allow: 'POST, OPTIONS' },
  })
}
export function OPTIONS() {
  return new Response(null, { status: 204, headers: { Allow: 'POST, OPTIONS', ...responseHeaders } })
}

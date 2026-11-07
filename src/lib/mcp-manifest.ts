// Public, read-only MCP discovery. Do not advertise write operations or user data.
export const MCP_PROTOCOL_VERSION = '2025-06-18'
export const MCP_VERSION = '1.0.0'
export const MCP_NAME = 'com.manualdecocina/recipes'

export const MCP_TOOLS = [
  {
    name: 'search_recipes',
    description: 'Find published recipes by title, in one of the seven supported languages.',
    inputSchema: {
      type: 'object',
      properties: {
        query: { type: 'string', minLength: 2, maxLength: 80, description: 'Words from the recipe title' },
        language: { type: 'string', enum: ['es', 'en', 'de', 'fr', 'it', 'ja', 'pt'], default: 'es' },
        limit: { type: 'integer', minimum: 1, maximum: 10, default: 5 },
      },
      required: ['query'],
      additionalProperties: false,
    },
    annotations: { readOnlyHint: true, destructiveHint: false, idempotentHint: true },
  },
  {
    name: 'get_recipe',
    description: 'Read the published ingredients and cooking steps for a known canonical recipe path.',
    inputSchema: {
      type: 'object',
      properties: {
        path: { type: 'string', minLength: 2, maxLength: 240, description: 'Recipe URL path, beginning with /' },
      },
      required: ['path'],
      additionalProperties: false,
    },
    annotations: { readOnlyHint: true, destructiveHint: false, idempotentHint: true },
  },
]

export function legacyMcpCard(site: string) {
  return {
    $schema: 'https://static.modelcontextprotocol.io/schemas/mcp-server-card/v1.json',
    version: '1.0',
    protocolVersion: MCP_PROTOCOL_VERSION,
    serverInfo: { name: MCP_NAME, title: 'Manual de Cocina — recetas públicas', version: MCP_VERSION },
    description: 'Búsqueda y lectura de recetas publicadas. Herramientas de solo lectura, sin datos privados.',
    documentationUrl: `${site}/llms.txt`,
    transport: { type: 'streamable-http', endpoint: `${site}/mcp` },
    capabilities: { tools: { listChanged: false } },
    authentication: { required: false, schemes: [] },
    tools: MCP_TOOLS,
    resources: [],
    prompts: [],
  }
}

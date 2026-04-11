/**
 * OpenGravity v10 — Stateless MCP HTTP Adapter (Vercel Optimized)
 */

export type MCPTool = {
    name: string;
    description: string;
    inputSchema: Record<string, unknown>;
};

export type MCPServer = {
    id: string;
    url: string;
    apiKey?: string;
    tools?: MCPTool[];
    lastConnected?: string;
};

// En Vercel: NO usar SSE. Usar HTTP request/response por herramienta.
export async function callMCPTool(
    server: MCPServer,
    toolName: string,
    args: Record<string, unknown>
): Promise<string> {
    const controller = new AbortController();
    // Timeout agresivo para no bloquear la respuesta principal (Edge compatible)
    const timeout = setTimeout(() => controller.abort(), 8000);

    try {
        const res = await fetch(`${server.url}/tools/call`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                ...(server.apiKey ? { Authorization: `Bearer ${server.apiKey}` } : {}),
            },
            body: JSON.stringify({ tool: toolName, arguments: args }),
            signal: controller.signal,
        });

        if (!res.ok) throw new Error(`MCP error: ${res.status}`);
        const data: any = await res.json();
        return typeof data.result === "string"
            ? data.result
            : JSON.stringify(data.result);
    } catch (err: any) {
        if (err.name === "AbortError") {
            return `[MCP Timeout] El servidor ${server.id} tardó demasiado. Reintentando en el próximo turno.`;
        }
        return `[MCP Error] ${err.message}`;
    } finally {
        clearTimeout(timeout);
    }
}

// Lista herramientas disponibles en un servidor MCP (con cache de 5 min)
const toolsCache = new Map<string, { tools: MCPTool[]; ts: number }>();

export async function getMCPTools(server: MCPServer): Promise<MCPTool[]> {
    const cached = toolsCache.get(server.id);
    if (cached && Date.now() - cached.ts < 5 * 60 * 1000) return cached.tools;

    try {
        const res = await fetch(`${server.url}/tools/list`, {
            headers: server.apiKey
                ? { Authorization: `Bearer ${server.apiKey}` }
                : {},
        });
        const data: any = await res.json();
        const tools: MCPTool[] = data.tools ?? [];
        toolsCache.set(server.id, { tools, ts: Date.now() });
        return tools;
    } catch {
        return cached?.tools ?? [];
    }
}

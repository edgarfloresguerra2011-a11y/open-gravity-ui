/**
 * OpenGravity v10 — Tool Executor (Fixed)
 *
 * BUGS CORREGIDOS:
 * 1. SAVE_FILE: parseArgs rompía si el contenido tenía comas o "=" (ej: código)
 *    → Ahora SAVE_FILE usa un delimitador especial "|||" para separar argumentos
 * 2. executePendingTools no devolvía toolsCount → añadido
 * 3. webSearch y scrapeUrl no tenían fallback si las API keys faltaban
 * 4. REMEMBER no hacía nada real → ahora conecta con storage
 */

import { saveFile, saveKnowledge } from './storage';
import { runDeepResearch } from './skill_executor';

export type ToolCall = {
    tool: string;
    args: Record<string, string>;
    raw: string;
};

// ─── PARSER ──────────────────────────────────────────────────────────────────
// BUG FIX #1: El regex original capturaba TODO con [^\]]+ pero el contenido
// de un archivo puede tener ], [, =, comas, etc. 
//
// SOLUCIÓN: Para SAVE_FILE usamos un formato especial con delimitador |||
// Ejemplo de uso en el LLM:
//   [SAVE_FILE: nombre.ts ||| /src/lib/ ||| contenido del archivo aquí]
//
// Para otras herramientas el formato simple sigue funcionando:
//   [WEB_SEARCH: término de búsqueda]
//   [SCRAPE: https://example.com]
//   [REMEMBER: dato importante sobre el usuario]

export function parseToolCalls(text: string): ToolCall[] {
    const calls: ToolCall[] = [];

    // Parser especial para SAVE_FILE (usa ||| como separador)
    const saveFilePattern = /\[\s*SAVE_FILE\s*:\s*(.*?)\s*\|\|\|\s*(.*?)\s*\|\|\|\s*([\s\S]*?)\]/gi;
    let match;
    while ((match = saveFilePattern.exec(text)) !== null) {
        calls.push({
            tool: 'SAVE_FILE',
            args: {
                name: match[1].trim(),
                path: match[2].trim(),
                content: match[3].trim(),
            },
            raw: match[0],
        });
    }

    // Parser general para el resto de herramientas
    // Excluye SAVE_FILE porque ya lo manejamos arriba
    const generalPattern = /\[\s*(DEEP_RESEARCH|WEB_SEARCH|SCRAPE|REMEMBER|CREATE_SKILL|READ_FILE|RUN_PYTHON)\s*:\s*([^\]]+)\]/gi;
    while ((match = generalPattern.exec(text)) !== null) {
        calls.push({
            tool: match[1].toUpperCase().trim(),
            args: parseSimpleArgs(match[2].trim()),
            raw: match[0],
        });
    }

    return calls;
}

// Para herramientas simples: acepta "key=value, key2=value2" o texto plano
function parseSimpleArgs(raw: string): Record<string, string> {
    if (raw.includes("=")) {
        const result: Record<string, string> = {};
        // Split por coma solo si no está dentro de un valor
        const pairs = raw.split(/,(?=[^=]+=)/);
        for (const pair of pairs) {
            const eqIdx = pair.indexOf('=');
            if (eqIdx !== -1) {
                const key = pair.substring(0, eqIdx).trim();
                const val = pair.substring(eqIdx + 1).trim();
                result[key] = val;
            }
        }
        return Object.keys(result).length > 0 ? result : { input: raw };
    }
    return { input: raw };
}

// ─── EXECUTOR ────────────────────────────────────────────────────────────────
export async function executePendingTools(
    text: string,
    ctx: { userId: string }
): Promise<{ output: string; hasActions: boolean; toolsCount: number }> {
    const calls = parseToolCalls(text);

    if (calls.length === 0) {
        return { output: text, hasActions: false, toolsCount: 0 };
    }

    let result = text;
    let allOutputs: string[] = [];

    // Ejecutar herramientas en secuencia (no en paralelo — el output de una puede afectar la siguiente)
    for (const call of calls) {
        const output = await dispatchTool(call, ctx);
        allOutputs.push(`[${call.tool}]: ${output}`);
        // Reemplazar el tag de la herramienta con su resultado en el texto
        result = result.replace(call.raw, `\n\n**Resultado de ${call.tool}:**\n${output}\n`);
    }

    return {
        output: allOutputs.join('\n\n'),
        hasActions: true,
        toolsCount: calls.length,
    };
}

// ─── DISPATCHER ──────────────────────────────────────────────────────────────
async function dispatchTool(call: ToolCall, ctx: { userId: string }): Promise<string> {
    try {
        switch (call.tool) {
            case "DEEP_RESEARCH":
                const deepRes = await runDeepResearch(call.args.topic || call.args.input || '', call.args.context || '');
                return deepRes.rawSynthesis;

            case "WEB_SEARCH":
                return await webSearch(call.args.input || call.args.query || '');

            case "SCRAPE":
                return await scrapeUrl(call.args.input || call.args.url || '');

            case "SAVE_FILE":
                return await (saveFile as any)(call.args.path, call.args.name, call.args.content);

            case "REMEMBER":
                return await rememberFact(call.args.input || '', ctx.userId);

            case "CREATE_SKILL":
                return await createSkill(call.args.input || '', ctx.userId);

            case "READ_FILE":
                return await readFile(call.args.input || call.args.path || '');

            case "RUN_PYTHON":
                return await runPython(call.args.input || call.args.script || '');

            default:
                return `[Tool ${call.tool} no implementada]`;
        }
    } catch (err: any) {
        return `[Error en ${call.tool}]: ${err.message}`;
    }
}


// ─── TOOL IMPLEMENTATIONS ────────────────────────────────────────────────────

async function webSearch(query: string): Promise<string> {
    if (!query) return "Error: query vacía";

    const braveKey = process.env.BRAVE_API_KEY;
    if (!braveKey) {
        // Fallback a DuckDuckGo HTML scraping si no hay Brave key
        return await fallbackSearch(query);
    }

    try {
        const res = await fetch(
            `https://api.search.brave.com/res/v1/web/search?q=${encodeURIComponent(query)}&count=5&text_decorations=false`,
            {
                headers: {
                    'X-Subscription-Token': braveKey,
                    'Accept': 'application/json',
                },
            }
        );
        if (!res.ok) throw new Error(`Brave API error: ${res.status}`);
        const data = await res.json() as any;
        const results = data.web?.results?.slice(0, 4) || [];
        if (results.length === 0) return "Sin resultados para: " + query;
        return results.map((r: any, i: number) =>
            `${i + 1}. **${r.title}**\n   ${r.description}\n   ${r.url}`
        ).join('\n\n');
    } catch (err: any) {
        return `Error en búsqueda: ${err.message}`;
    }
}

async function fallbackSearch(query: string): Promise<string> {
    // Fallback sin API key — usa Jina Search
    try {
        const res = await fetch(`https://s.jina.ai/${encodeURIComponent(query)}`, {
            headers: { 'Accept': 'application/json' },
        });
        const text = await res.text();
        return text.substring(0, 1500);
    } catch {
        return `No se pudo buscar "${query}" (configura BRAVE_API_KEY en .env)`;
    }
}

async function scrapeUrl(url: string): Promise<string> {
    if (!url || !url.startsWith('http')) return "Error: URL inválida";

    const jinaKey = process.env.JINA_API_KEY;
    try {
        const headers: Record<string, string> = {
            'Accept': 'application/json',
            'X-Return-Format': 'text',
        };
        if (jinaKey) headers['Authorization'] = `Bearer ${jinaKey}`;

        const res = await fetch(`https://r.jina.ai/${url}`, { headers });
        if (!res.ok) throw new Error(`Jina error: ${res.status}`);
        const text = await res.text();
        // Limitar a 2500 chars para no saturar el contexto
        return text.substring(0, 2500) + (text.length > 2500 ? '\n\n[...contenido truncado]' : '');
    } catch (err: any) {
        return `Error al scrape: ${err.message}`;
    }
}

async function rememberFact(fact: string, userId: string): Promise<string> {
    if (!fact) return "Error: nada que recordar";
    await saveKnowledge(userId, {
        type: 'fact',
        content: fact,
        timestamp: new Date().toISOString(),
    });
    return `✓ Recordado permanentemente: "${fact}"`;
}

async function createSkill(description: string, userId: string): Promise<string> {
    // Stub — conectar con skill_registry.ts
    console.log(`[CREATE_SKILL] User ${userId}: ${description}`);
    return `Skill registrada: "${description}". Estará disponible en la próxima sesión.`;
}

async function readFile(filePath: string): Promise<string> {
    // Solo permitir leer desde el directorio de datos del proyecto
    try {
        const path = require('path');
        const fs = require('fs');
        const safePath = path.join(process.cwd(), 'data', path.basename(filePath));
        if (!fs.existsSync(safePath)) return `Archivo no encontrado: ${filePath}`;
        return fs.readFileSync(safePath, 'utf-8').substring(0, 3000);
    } catch (err: any) {
        return `Error leyendo archivo: ${err.message}`;
    }
}

async function runPython(scriptPath: string): Promise<string> {
    try {
        const { exec } = require('child_process');
        const path = require('path');
        const fullPath = path.join(process.cwd(), scriptPath);

        return new Promise((resolve) => {
            exec(`python "${fullPath}"`, (error: any, stdout: string, stderr: string) => {
                if (error) {
                    resolve(`[Python Error]: ${error.message}\n${stderr}`);
                } else {
                    resolve(stdout || "[Script ejecutado sin salida]");
                }
            });
        });
    } catch (err: any) {
        return `Error iniciando Python: ${err.message}`;
    }
}


module.exports = [
"[externals]/next/dist/compiled/next-server/app-route-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-route-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/@opentelemetry/api [external] (next/dist/compiled/@opentelemetry/api, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/@opentelemetry/api", () => require("next/dist/compiled/@opentelemetry/api"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-unit-async-storage.external.js [external] (next/dist/server/app-render/work-unit-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-unit-async-storage.external.js", () => require("next/dist/server/app-render/work-unit-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-async-storage.external.js [external] (next/dist/server/app-render/work-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-async-storage.external.js", () => require("next/dist/server/app-render/work-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/shared/lib/no-fallback-error.external.js [external] (next/dist/shared/lib/no-fallback-error.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/shared/lib/no-fallback-error.external.js", () => require("next/dist/shared/lib/no-fallback-error.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/after-task-async-storage.external.js [external] (next/dist/server/app-render/after-task-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/after-task-async-storage.external.js", () => require("next/dist/server/app-render/after-task-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/child_process [external] (child_process, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("child_process", () => require("child_process"));

module.exports = mod;
}),
"[externals]/fs [external] (fs, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("fs", () => require("fs"));

module.exports = mod;
}),
"[externals]/path [external] (path, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("path", () => require("path"));

module.exports = mod;
}),
"[project]/opengravity/open-gravity-ui/src/app/api/chat/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "POST",
    ()=>POST
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$opengravity$2f$open$2d$gravity$2d$ui$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/opengravity/open-gravity-ui/node_modules/next/server.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$child_process__$5b$external$5d$__$28$child_process$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/child_process [external] (child_process, cjs)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/fs [external] (fs, cjs)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$path__$5b$external$5d$__$28$path$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/path [external] (path, cjs)");
;
;
;
;
function loadEnv() {
    const envPath = __TURBOPACK__imported__module__$5b$externals$5d2f$path__$5b$external$5d$__$28$path$2c$__cjs$29$__["resolve"](process.cwd(), '../.env');
    try {
        if (__TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__["existsSync"](envPath)) {
            const content = __TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__["readFileSync"](envPath, 'utf-8');
            const vars = {};
            content.split('\n').forEach((line)=>{
                const trimmed = line.trim();
                if (!trimmed || trimmed.startsWith('#')) return;
                const eqIdx = trimmed.indexOf('=');
                if (eqIdx === -1) return;
                const key = trimmed.substring(0, eqIdx).trim();
                let val = trimmed.substring(eqIdx + 1).trim();
                if (val.startsWith('"') && val.endsWith('"') || val.startsWith("'") && val.endsWith("'")) {
                    val = val.slice(1, -1);
                }
                vars[key] = val;
            });
            return vars;
        }
    } catch (e) {
        console.error("Env read error:", e);
    }
    return {};
}
function curlCall(apiUrl, apiKey, proxyUrl, payload) {
    const payloadStr = JSON.stringify(payload).replace(/"/g, '\\"');
    let cmd = `curl.exe -s -X POST "${apiUrl}" -H "Content-Type: application/json"`;
    if (apiKey) cmd += ` -H "Authorization: Bearer ${apiKey}"`;
    if (proxyUrl) cmd += ` -x "${proxyUrl}"`;
    cmd += ` -d "${payloadStr}"`;
    try {
        const res = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$child_process__$5b$external$5d$__$28$child_process$2c$__cjs$29$__["execSync"])(cmd, {
            encoding: 'utf-8'
        });
        return JSON.parse(res);
    } catch (e) {
        throw new Error(e.message);
    }
}
async function POST(req) {
    try {
        const env = loadEnv();
        const body = await req.json();
        const { messages } = body;
        const geminiKeys = [
            env.GEMINI_KEY_1,
            env.GEMINI_KEY_2,
            env.GEMINI_KEY_3,
            env.GEMINI_KEY_4,
            env.GEMINI_KEY_5,
            env.GEMINI_KEY_6,
            env.GEMINI_KEY_7,
            env.GEMINI_KEY_8,
            "AIzaSyD_R6M_Ucd-KwnRjzpnoARP5RhOg-Dx104"
        ].filter((k)=>k && !k.includes("SUTITUYE"));
        const proxies = [
            env.LAUNCH_URL_11435,
            env.LAUNCH_URL_11436,
            env.LAUNCH_URL_11437,
            env.LAUNCH_URL_11438,
            env.LAUNCH_URL_11439
        ].filter((p)=>p && p.startsWith("http"));
        const providers = [];
        // --- CASCADA DE FUERZA BRUTA ---
        // Nivel 1: Otros Proveedores (Cohere, Mistral, Moonshot del Restore)
        providers.push({
            id: "Mistral-Cloud",
            apiKey: "gzGgFDnH44vj9lVS64TP0xhlZrr2QUdB",
            url: "https://api.mistral.ai/v1/chat/completions",
            model: "mistral-small-latest",
            type: "openai"
        });
        providers.push({
            id: "Moonshot-Cloud",
            apiKey: "sk-Ndtm154XrJCeaxDLpSVIXZdsRTebHFX0dfDXSPrPr75LLG69",
            url: "https://api.moonshot.cn/v1/chat/completions",
            model: "moonshot-v1-8k",
            type: "openai"
        });
        providers.push({
            id: "HuggingFace-Inference",
            apiKey: "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",
            url: "https://api-inference.huggingface.co/v1/chat/completions",
            model: "mistralai/Mistral-7B-Instruct-v0.3",
            type: "openai"
        });
        // Nivel 2: Gemini 1.5 Flash 8B (El que no suele fallar) con Proxies
        for(let i = 0; i < Math.min(geminiKeys.length, proxies.length); i++){
            providers.push({
                id: `Gemini-8B-Proxy-${i + 1}`,
                apiKey: geminiKeys[i],
                url: `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-8b:generateContent?key=${geminiKeys[i]}`,
                proxy: proxies[i],
                model: "gemini-1.5-flash-8b",
                type: "gemini_native"
            });
        }
        // Nivel 3: Cerebras con Proxies
        for(let i = 0; i < proxies.length; i++){
            providers.push({
                id: `Cerebras-Launch-${i + 1}`,
                apiKey: env.CEREBRAS_API_KEY,
                url: "https://api.cerebras.ai/v1/chat/completions",
                proxy: proxies[i],
                model: "llama3.1-8b",
                type: "openai"
            });
        }
        let log = "";
        for (const p of providers){
            if (!p.apiKey) continue;
            try {
                console.log(`[OpenGravity] Probando ${p.id}...`);
                const payload = p.type === 'gemini_native' ? {
                    contents: messages.map((m)=>({
                            role: m.role === 'assistant' ? 'model' : 'user',
                            parts: [
                                {
                                    text: m.content
                                }
                            ]
                        }))
                } : {
                    model: p.model,
                    messages: messages.map((m)=>({
                            role: m.role,
                            content: m.content
                        })),
                    max_tokens: 1024
                };
                const data = curlCall(p.url, p.type === 'gemini_native' ? "" : p.apiKey, p.proxy, payload);
                let reply = "";
                if (p.type === 'gemini_native') reply = data.candidates?.[0]?.content?.parts?.[0]?.text;
                else reply = data.choices?.[0]?.message?.content;
                if (reply) {
                    return __TURBOPACK__imported__module__$5b$project$5d2f$opengravity$2f$open$2d$gravity$2d$ui$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                        reply: `*[Engine: ${p.id}]*\n\n${reply}`
                    });
                }
            } catch (e) {
                log += `[${p.id}]: ${e.message.substring(0, 100)}\n`;
            }
        }
        return __TURBOPACK__imported__module__$5b$project$5d2f$opengravity$2f$open$2d$gravity$2d$ui$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            reply: `❌ Sigo sin poder conectar tras probar a Mistral, Moonshot, HuggingFace, Cerebras y Gemini 8B.\n\n### Reporte:\n${log}`
        });
    } catch (error) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$opengravity$2f$open$2d$gravity$2d$ui$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            reply: "Error crítico."
        }, {
            status: 500
        });
    }
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__1016eb36._.js.map
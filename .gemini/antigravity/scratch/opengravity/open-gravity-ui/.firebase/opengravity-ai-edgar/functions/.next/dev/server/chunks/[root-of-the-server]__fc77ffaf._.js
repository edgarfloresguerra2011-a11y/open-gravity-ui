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
var __TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/fs [external] (fs, cjs)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$path__$5b$external$5d$__$28$path$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/path [external] (path, cjs)");
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
async function POST(req) {
    try {
        const env = loadEnv();
        const body = await req.json();
        const { messages } = body;
        // DEFINICIÓN DE PROVEEDORES ÚNICAMENTE EN LA NUBE (NADA DE LOCAL/OLLAMA)
        const providers = [
            // 🚀 GOOGLE GEMINI NATIVA (8 FALLBACKS DE NUBE)
            ...[
                1,
                2,
                3,
                4,
                5,
                6,
                7,
                8
            ].map((i)=>({
                    id: `Gemini-Cloud-${i}`,
                    key: env[`GEMINI_KEY_${i}`],
                    url: `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${env[`GEMINI_KEY_${i}`]}`,
                    model: "gemini-2.0-flash",
                    type: "gemini_native"
                })),
            // 🚀 CEREBRAS (NUBE)
            {
                id: "Cerebras-Cloud",
                key: env.CEREBRAS_API_KEY,
                url: "https://api.cerebras.ai/v1/chat/completions",
                model: "llama3.3-70b",
                type: "openai"
            }
        ];
        let log = "";
        let validWaysFound = 0;
        for (const p of providers){
            if (!p.key || p.key.includes("SUTITUYE") || p.key === "") continue;
            validWaysFound++;
            try {
                console.log(`[OpenGravity] Intentando con ${p.id} (Nube)...`);
                let response;
                if (p.type === 'gemini_native') {
                    response = await fetch(p.url, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            contents: messages.map((m)=>({
                                    role: m.role === 'assistant' ? 'model' : 'user',
                                    parts: [
                                        {
                                            text: m.content
                                        }
                                    ]
                                }))
                        })
                    });
                } else {
                    response = await fetch(p.url, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${p.key}`
                        },
                        body: JSON.stringify({
                            model: p.model,
                            messages: messages.map((m)=>({
                                    role: m.role,
                                    content: m.content
                                })),
                            max_tokens: 1024
                        })
                    });
                }
                if (!response.ok) {
                    const errText = await response.text();
                    throw new Error(`HTTP ${response.status}: ${errText.substring(0, 50)}...`);
                }
                const data = await response.json();
                let reply = "";
                if (p.type === 'gemini_native') reply = data.candidates?.[0]?.content?.parts?.[0]?.text;
                else reply = data.choices?.[0]?.message?.content;
                if (reply) {
                    console.log(`[OpenGravity] ✅ ${p.id} OK (NUBE)`);
                    return __TURBOPACK__imported__module__$5b$project$5d2f$opengravity$2f$open$2d$gravity$2d$ui$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                        reply: `*[Engine: ${p.id}]*\n\n${reply}`
                    });
                }
            } catch (e) {
                log += `[❌ ${p.id}]: ${e.message}\n`;
                console.warn(`[OpenGravity] Falló ${p.id}`);
            }
        }
        if (validWaysFound === 0) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$opengravity$2f$open$2d$gravity$2d$ui$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                reply: "⚠️ No hay motores de NUBE configurados. Revisa el archivo .env."
            });
        }
        return __TURBOPACK__imported__module__$5b$project$5d2f$opengravity$2f$open$2d$gravity$2d$ui$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            reply: `❌ Fallo total en la nube. Reporte:\n${log}`
        });
    } catch (error) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$opengravity$2f$open$2d$gravity$2d$ui$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            reply: "Error crítico en el router de OpenGravity."
        }, {
            status: 500
        });
    }
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__fc77ffaf._.js.map
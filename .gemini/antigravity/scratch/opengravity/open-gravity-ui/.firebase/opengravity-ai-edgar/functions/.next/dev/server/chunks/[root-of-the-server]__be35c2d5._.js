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
"[externals]/os [external] (os, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("os", () => require("os"));

module.exports = mod;
}),
"[externals]/crypto [external] (crypto, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("crypto", () => require("crypto"));

module.exports = mod;
}),
"[project]/opengravity/open-gravity-ui/src/app/api/chat/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "POST",
    ()=>POST
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$opengravity$2f$open$2d$gravity$2d$ui$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/opengravity/open-gravity-ui/node_modules/next/server.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$opengravity$2f$open$2d$gravity$2d$ui$2f$node_modules$2f$dotenv$2f$lib$2f$main$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/opengravity/open-gravity-ui/node_modules/dotenv/lib/main.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$path__$5b$external$5d$__$28$path$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/path [external] (path, cjs)");
;
;
;
async function POST(req) {
    try {
        // Escaneamos el .env root
        __TURBOPACK__imported__module__$5b$project$5d2f$opengravity$2f$open$2d$gravity$2d$ui$2f$node_modules$2f$dotenv$2f$lib$2f$main$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].config({
            path: __TURBOPACK__imported__module__$5b$externals$5d2f$path__$5b$external$5d$__$28$path$2c$__cjs$29$__["default"].resolve(process.cwd(), '../.env')
        });
        const body = await req.json();
        const { messages } = body;
        // Lista de proveedores gratuitos y sus llaves como fallback
        const providers = [
            {
                id: "Groq",
                envVar: "GROQ_API_KEY",
                url: "https://api.groq.com/openai/v1/chat/completions",
                model: "llama-3.3-70b-versatile"
            },
            {
                id: "Cerebras",
                envVar: "CEREBRAS_API_KEY",
                url: "https://api.cerebras.ai/v1/chat/completions",
                model: "llama-3.3-70b"
            },
            {
                id: "Gemini",
                envVar: "GEMINI_API_KEY",
                url: "https://generativelanguage.googleapis.com/v1beta/openai/chat/completions",
                model: "gemini-2.0-flash"
            },
            {
                id: "OpenRouter",
                envVar: "OPENROUTER_API_KEY",
                url: "https://openrouter.ai/api/v1/chat/completions",
                model: "meta-llama/llama-3.3-70b-instruct:free" // Modelo gratuito en openrouter
            },
            {
                id: "DeepSeek",
                envVar: "DEEPSEEK_API_KEY",
                url: "https://api.deepseek.com/v1/chat/completions",
                model: "deepseek-chat"
            }
        ];
        let errorsLog = "";
        let validKeysFound = 0;
        // Iteramos e intentamos enviar la solicitud hasta que uno funcione
        for (const provider of providers){
            const apiKey = process.env[provider.envVar];
            if (!apiKey || apiKey === 'SUTITUYE POR EL TUYO' || apiKey.trim() === '') {
                errorsLog += `\`[❌ ${provider.id}]\`: Llave no configurada.\n`;
                continue;
            }
            validKeysFound++;
            try {
                const fetchUrl = provider.id === 'Gemini' ? `https://generativelanguage.googleapis.com/v1beta/openai/chat/completions` : provider.url;
                // Todos estos endpoints modernos ahora soportan la compatibilidad OpenAI (headers y body)
                const response = await fetch(fetchUrl, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${apiKey}`
                    },
                    body: JSON.stringify({
                        model: provider.model,
                        messages: messages.map((m)=>({
                                role: m.role,
                                content: m.content
                            })),
                        max_tokens: 1024,
                        temperature: 0.7
                    }) // Config estandard
                });
                if (!response.ok) {
                    const errText = await response.text();
                    throw new Error(`Código ${response.status} -> ${errText}`);
                }
                const data = await response.json();
                const reply = data.choices?.[0]?.message?.content;
                if (reply) {
                    // Éxito. Retornamos la respuesta añadiendo el prefijo para saber qué API funcionó
                    return __TURBOPACK__imported__module__$5b$project$5d2f$opengravity$2f$open$2d$gravity$2d$ui$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                        reply: `*[Powered by ${provider.id}]* \n\n${reply}`
                    });
                }
            } catch (err) {
                // Guardamos el error de este provider específico y continuamos con el siguiente
                errorsLog += `\`[❌ ${provider.id} Falló]\`: ${err.message}\n`;
            }
        }
        // -- SI LLEGA A ESTE PUNTO: Fallaron todos los providers o no había llaves --
        if (validKeysFound === 0) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$opengravity$2f$open$2d$gravity$2d$ui$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                reply: "⚠️ *Alerta Crítica*: No he encontrado **ninguna** llave API configurada. \nPor favor, abre el archivo `.env` maestro ubicado en `opengravity\\.env` e inserta al menos una clave gratuita (Groq, Cerebras, Gemini, DeepSeek u OpenRouter) para que mi cerebro encienda."
            }, {
                status: 200
            });
        }
        return __TURBOPACK__imported__module__$5b$project$5d2f$opengravity$2f$open$2d$gravity$2d$ui$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            reply: `❌ **Cerebro Desconectado**. Intenté conectarme a todas las APIs que tenían llaves pero fallaron o dieron Time-Out.\n\n### Reporte de Motor de Fallback:\n${errorsLog}`
        }, {
            status: 200
        });
    } catch (error) {
        console.error("Chat API Fatal error:", error);
        return __TURBOPACK__imported__module__$5b$project$5d2f$opengravity$2f$open$2d$gravity$2d$ui$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            reply: `❌ *Error interno*: ${error.message || 'Fallo catastrófico en la red'}. Revisa los logs de Next.js.`
        }, {
            status: 500
        });
    }
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__be35c2d5._.js.map
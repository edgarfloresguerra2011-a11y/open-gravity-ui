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
"[project]/opengravity/open-gravity-ui/src/lib/firebaseAdmin.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "db",
    ()=>db
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$firebase$2d$admin__$5b$external$5d$__$28$firebase$2d$admin$2c$__cjs$2c$__$5b$project$5d2f$opengravity$2f$open$2d$gravity$2d$ui$2f$node_modules$2f$firebase$2d$admin$29$__ = __turbopack_context__.i("[externals]/firebase-admin [external] (firebase-admin, cjs, [project]/opengravity/open-gravity-ui/node_modules/firebase-admin)");
;
if (!__TURBOPACK__imported__module__$5b$externals$5d2f$firebase$2d$admin__$5b$external$5d$__$28$firebase$2d$admin$2c$__cjs$2c$__$5b$project$5d2f$opengravity$2f$open$2d$gravity$2d$ui$2f$node_modules$2f$firebase$2d$admin$29$__["apps"].length) {
    try {
        // En local, si no hay credenciales por defecto, inicializamos solo con el Project ID
        // Esto permite que el backend no explote, aunque Firestore de error si no tiene permisos
        const config = process.env.GOOGLE_APPLICATION_CREDENTIALS ? {
            credential: __TURBOPACK__imported__module__$5b$externals$5d2f$firebase$2d$admin__$5b$external$5d$__$28$firebase$2d$admin$2c$__cjs$2c$__$5b$project$5d2f$opengravity$2f$open$2d$gravity$2d$ui$2f$node_modules$2f$firebase$2d$admin$29$__["credential"].applicationDefault()
        } : {
            projectId: 'opengravity-ai-edgar'
        };
        __TURBOPACK__imported__module__$5b$externals$5d2f$firebase$2d$admin__$5b$external$5d$__$28$firebase$2d$admin$2c$__cjs$2c$__$5b$project$5d2f$opengravity$2f$open$2d$gravity$2d$ui$2f$node_modules$2f$firebase$2d$admin$29$__["initializeApp"](config);
        console.log('Firebase Admin Initialized for project:', 'opengravity-ai-edgar');
    } catch (error) {
        console.error('Firebase admin initialization error:', error);
    }
}
const db = __TURBOPACK__imported__module__$5b$externals$5d2f$firebase$2d$admin__$5b$external$5d$__$28$firebase$2d$admin$2c$__cjs$2c$__$5b$project$5d2f$opengravity$2f$open$2d$gravity$2d$ui$2f$node_modules$2f$firebase$2d$admin$29$__["firestore"]();
}),
"[project]/opengravity/open-gravity-ui/src/lib/memory.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "addMessage",
    ()=>addMessage,
    "clearHistory",
    ()=>clearHistory,
    "getHistory",
    ()=>getHistory
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$opengravity$2f$open$2d$gravity$2d$ui$2f$src$2f$lib$2f$firebaseAdmin$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/opengravity/open-gravity-ui/src/lib/firebaseAdmin.ts [app-route] (ecmascript)");
;
async function addMessage(role, content) {
    try {
        await __TURBOPACK__imported__module__$5b$project$5d2f$opengravity$2f$open$2d$gravity$2d$ui$2f$src$2f$lib$2f$firebaseAdmin$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["db"].collection('messages').add({
            role,
            content,
            timestamp: new Date()
        });
    } catch (error) {
        console.error('Firestore addMessage error:', error);
    }
}
async function getHistory(limit = 20) {
    try {
        const snapshot = await __TURBOPACK__imported__module__$5b$project$5d2f$opengravity$2f$open$2d$gravity$2d$ui$2f$src$2f$lib$2f$firebaseAdmin$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["db"].collection('messages').orderBy('timestamp', 'desc').limit(limit).get();
        const messages = snapshot.docs.map((doc)=>({
                role: doc.data().role,
                content: doc.data().content
            }));
        return messages.reverse();
    } catch (error) {
        console.error('Firestore getHistory error:', error);
        return [];
    }
}
async function clearHistory() {
    try {
        const snapshot = await __TURBOPACK__imported__module__$5b$project$5d2f$opengravity$2f$open$2d$gravity$2d$ui$2f$src$2f$lib$2f$firebaseAdmin$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["db"].collection('messages').get();
        const batch = __TURBOPACK__imported__module__$5b$project$5d2f$opengravity$2f$open$2d$gravity$2d$ui$2f$src$2f$lib$2f$firebaseAdmin$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["db"].batch();
        snapshot.docs.forEach((doc)=>batch.delete(doc.ref));
        await batch.commit();
    } catch (error) {
        console.error('Firestore clearHistory error:', error);
    }
}
}),
"[project]/opengravity/open-gravity-ui/src/lib/ai_logic.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "processAiMessage",
    ()=>processAiMessage
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$child_process__$5b$external$5d$__$28$child_process$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/child_process [external] (child_process, cjs)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/fs [external] (fs, cjs)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$path__$5b$external$5d$__$28$path$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/path [external] (path, cjs)");
var __TURBOPACK__imported__module__$5b$project$5d2f$opengravity$2f$open$2d$gravity$2d$ui$2f$src$2f$lib$2f$memory$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/opengravity/open-gravity-ui/src/lib/memory.ts [app-route] (ecmascript)");
;
;
;
;
function loadEnv() {
    const envPath = __TURBOPACK__imported__module__$5b$externals$5d2f$path__$5b$external$5d$__$28$path$2c$__cjs$29$__["resolve"](process.cwd(), '../.env');
    let vars = {
        ...process.env
    };
    try {
        if (__TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__["existsSync"](envPath)) {
            const content = __TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__["readFileSync"](envPath, 'utf-8');
            content.split('\n').forEach((line)=>{
                const trimmed = line.trim();
                if (!trimmed || trimmed.startsWith('#')) return;
                const eqIdx = trimmed.indexOf('=');
                if (eqIdx !== -1) {
                    let val = trimmed.substring(eqIdx + 1).trim();
                    if (val.startsWith('"') && val.endsWith('"') || val.startsWith("'") && val.endsWith("'")) {
                        val = val.slice(1, -1);
                    }
                    vars[trimmed.substring(0, eqIdx).trim()] = val;
                }
            });
        }
    } catch (e) {
        __TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__["appendFileSync"]('debug-log.txt', `Env Load Error: ${e.message}\n`);
    }
    return vars;
}
function curlCall(apiUrl, apiKey, proxyUrl, payload) {
    const isWindows = process.platform === 'win32';
    const curlCmd = ("TURBOPACK compile-time truthy", 1) ? 'curl.exe' : "TURBOPACK unreachable";
    const tmpFile = ("TURBOPACK compile-time truthy", 1) ? __TURBOPACK__imported__module__$5b$externals$5d2f$path__$5b$external$5d$__$28$path$2c$__cjs$29$__["join"](process.cwd(), `tmp-${Date.now()}.json`) : "TURBOPACK unreachable";
    try {
        __TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__["writeFileSync"](tmpFile, JSON.stringify(payload));
        let cmd = `${curlCmd} -s -X POST "${apiUrl}" -H "Content-Type: application/json"`;
        if (apiKey) cmd += ` -H "Authorization: Bearer ${apiKey}"`;
        if (proxyUrl) cmd += ` -x "${proxyUrl}"`;
        cmd += ` -d "@${tmpFile}"`;
        const res = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$child_process__$5b$external$5d$__$28$child_process$2c$__cjs$29$__["execSync"])(cmd, {
            encoding: 'utf-8'
        });
        if (__TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__["existsSync"](tmpFile)) __TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__["unlinkSync"](tmpFile);
        return JSON.parse(res);
    } catch (e) {
        if (__TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__["existsSync"](tmpFile)) try {
            __TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__["unlinkSync"](tmpFile);
        } catch (err) {}
        __TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__["appendFileSync"]('debug-log.txt', `CURL Error: ${e.message}\n`);
        return null;
    }
}
async function processAiMessage(userMessage) {
    const env = loadEnv();
    let history = [];
    __TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__["appendFileSync"]('debug-log.txt', `Processing: ${userMessage}\n`);
    try {
        history = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$opengravity$2f$open$2d$gravity$2d$ui$2f$src$2f$lib$2f$memory$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getHistory"])(15);
    } catch (e) {
        __TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__["appendFileSync"]('debug-log.txt', `History Fetch Error: ${e.message}\n`);
    }
    const fullMessages = [
        ...history,
        {
            role: 'user',
            content: userMessage
        }
    ];
    const providers = [
        {
            id: "Mistral",
            apiKey: "gzGgFDnH44vj9lVS64TP0xhlZrr2QUdB",
            url: "https://api.mistral.ai/v1/chat/completions",
            model: "mistral-small-latest",
            type: "openai"
        },
        {
            id: "Moonshot",
            apiKey: "sk-Ndtm154XrJCeaxDLpSVIXZdsRTebHFX0dfDXSPrPr75LLG69",
            url: "https://api.moonshot.cn/v1/chat/completions",
            model: "moonshot-v1-8k",
            type: "openai"
        },
        {
            id: "Cerebras",
            apiKey: env.CEREBRAS_API_KEY,
            url: "https://api.cerebras.ai/v1/chat/completions",
            model: "llama3.3-70b",
            type: "openai"
        }
    ];
    const geminiKeys = [
        env.GEMINI_KEY_8,
        env.GEMINI_KEY_1,
        env.GEMINI_KEY_2,
        env.GEMINI_KEY_3,
        env.GEMINI_KEY_4,
        env.GEMINI_KEY_5,
        env.GEMINI_KEY_6,
        env.GEMINI_KEY_7
    ].filter((k)=>k && k !== "SUTITUYE POR EL TUYO" && !k.includes("..."));
    const proxies = [
        env.LAUNCH_URL_11435,
        env.LAUNCH_URL_11436,
        env.LAUNCH_URL_11437,
        env.LAUNCH_URL_11438,
        env.LAUNCH_URL_11439
    ].filter((p)=>p);
    geminiKeys.forEach((key, i)=>{
        providers.push({
            id: `Gemini-${i + 1}`,
            apiKey: key,
            url: `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-8b:generateContent?key=${key}`,
            proxy: proxies[i % (proxies.length || 1)] || null,
            model: "gemini-1.5-flash-8b",
            type: "gemini_native"
        });
    });
    for (const p of providers){
        if (!p.apiKey && !p.proxy) continue;
        try {
            __TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__["appendFileSync"]('debug-log.txt', `Trying: ${p.id}\n`);
            const payload = p.type === 'gemini_native' ? {
                contents: fullMessages.map((m)=>({
                        role: m.role === 'assistant' ? 'model' : 'user',
                        parts: [
                            {
                                text: m.content
                            }
                        ]
                    }))
            } : {
                model: p.model,
                messages: fullMessages,
                max_tokens: 1024
            };
            const data = curlCall(p.url, p.type === 'gemini_native' ? "" : p.apiKey, p.proxy, payload);
            if (!data) continue;
            let reply = "";
            if (p.type === 'gemini_native') reply = data.candidates?.[0]?.content?.parts?.[0]?.text;
            else reply = data.choices?.[0]?.message?.content;
            if (reply) {
                __TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__["appendFileSync"]('debug-log.txt', `Success: ${p.id}\n`);
                try {
                    await (0, __TURBOPACK__imported__module__$5b$project$5d2f$opengravity$2f$open$2d$gravity$2d$ui$2f$src$2f$lib$2f$memory$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["addMessage"])('user', userMessage);
                    await (0, __TURBOPACK__imported__module__$5b$project$5d2f$opengravity$2f$open$2d$gravity$2d$ui$2f$src$2f$lib$2f$memory$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["addMessage"])('assistant', reply);
                } catch (dbErr) {
                    __TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__["appendFileSync"]('debug-log.txt', `DB Save Error: ${dbErr.message}\n`);
                }
                return {
                    reply,
                    engine: p.id
                };
            }
        } catch (e) {
            __TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__["appendFileSync"]('debug-log.txt', `${p.id} Error: ${e.message}\n`);
        }
    }
    __TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__["appendFileSync"]('debug-log.txt', `All providers failed.\n`);
    return {
        reply: "❌ No Engine responded. Check proxies and .env keys.",
        engine: "Offline"
    };
}
}),
"[project]/opengravity/open-gravity-ui/src/app/api/chat/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "POST",
    ()=>POST
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$opengravity$2f$open$2d$gravity$2d$ui$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/opengravity/open-gravity-ui/node_modules/next/server.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$opengravity$2f$open$2d$gravity$2d$ui$2f$src$2f$lib$2f$ai_logic$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/opengravity/open-gravity-ui/src/lib/ai_logic.ts [app-route] (ecmascript)");
;
;
async function POST(req) {
    try {
        const { messages } = await req.json();
        if (!messages || messages.length === 0) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$opengravity$2f$open$2d$gravity$2d$ui$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                reply: "No messages provided",
                engine: "None"
            }, {
                status: 400
            });
        }
        const lastMsg = messages[messages.length - 1].content;
        const result = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$opengravity$2f$open$2d$gravity$2d$ui$2f$src$2f$lib$2f$ai_logic$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["processAiMessage"])(lastMsg);
        return __TURBOPACK__imported__module__$5b$project$5d2f$opengravity$2f$open$2d$gravity$2d$ui$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json(result);
    } catch (e) {
        console.error('CHAT_API_ERROR:', e.message || e);
        return __TURBOPACK__imported__module__$5b$project$5d2f$opengravity$2f$open$2d$gravity$2d$ui$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            reply: "❌ Server Error: " + (e.message || "Unknown error"),
            engine: "Offline"
        }, {
            status: 500
        });
    }
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__ef13d448._.js.map
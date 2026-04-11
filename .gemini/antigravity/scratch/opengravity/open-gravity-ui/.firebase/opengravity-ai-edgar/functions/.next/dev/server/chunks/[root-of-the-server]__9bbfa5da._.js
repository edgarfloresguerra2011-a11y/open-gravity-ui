module.exports = [
"[externals]/next/dist/compiled/next-server/app-route-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-route-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js"));

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
"[project]/opengravity/open-gravity-ui/src/lib/storage.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Collection",
    ()=>Collection,
    "db",
    ()=>db,
    "getIsMock",
    ()=>getIsMock,
    "initDb",
    ()=>initDb,
    "persist",
    ()=>persist
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/fs [external] (fs, cjs)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$path__$5b$external$5d$__$28$path$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/path [external] (path, cjs)");
;
;
/**
 * AliceLabs Universal Storage v11.0 (PRO-LEVEL)
 * - Persistent JSON Fallback
 * - Zero Dependency
 * - Fast Search
 */ const DB_FILE = __TURBOPACK__imported__module__$5b$externals$5d2f$path__$5b$external$5d$__$28$path$2c$__cjs$29$__["join"](process.cwd(), '.alice_db.json');
let store = {
    knowledge: [],
    files: [],
    cron_jobs: [],
    skills: [],
    messages: [],
    memory_summaries: []
};
function initDb() {
    try {
        if (__TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__["existsSync"](DB_FILE)) {
            const content = __TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__["readFileSync"](DB_FILE, 'utf-8');
            const data = JSON.parse(content);
            store = {
                ...store,
                ...data
            };
            console.log('✅ Local Database LOADED from .alice_db.json');
        }
    } catch (e) {
        console.warn('⚠️ Could not load database file, using in-memory only');
    }
}
function persist() {
    try {
        __TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__["writeFileSync"](DB_FILE, JSON.stringify(store, null, 2), 'utf-8');
    } catch (e) {
    // Fail silently in environments like Vercel where Disk is read-only
    }
}
// Ensure loaded at import
initDb();
class Collection {
    colName;
    constructor(name){
        this.colName = name;
    }
    async add(data) {
        const id = `rec_${Date.now()}_${Math.random().toString(36).substring(7)}`;
        const newItem = {
            id,
            ...data
        };
        store[this.colName].push(newItem);
        persist();
        return {
            id
        };
    }
    async get() {
        return {
            docs: store[this.colName].map((item)=>({
                    id: item.id,
                    exists: true,
                    data: ()=>item
                })),
            size: store[this.colName].length
        };
    }
    doc(id) {
        return {
            get: async ()=>{
                const item = store[this.colName].find((i)=>i.id === id);
                return {
                    exists: !!item,
                    data: ()=>item || null
                };
            },
            delete: async ()=>{
                store[this.colName] = store[this.colName].filter((i)=>i.id !== id);
                persist();
            },
            update: async (updates)=>{
                const idx = store[this.colName].findIndex((i)=>i.id === id);
                if (idx !== -1) {
                    store[this.colName][idx] = {
                        ...store[this.colName][idx],
                        ...updates
                    };
                    persist();
                }
            },
            set: async (data)=>{
                const idx = store[this.colName].findIndex((i)=>i.id === id);
                if (idx !== -1) {
                    Object.assign(store[this.colName][idx], data);
                } else {
                    store[this.colName].push({
                        id,
                        ...data
                    });
                }
                persist();
            }
        };
    }
    // Chainable query stubs (we do filtering in RAM)
    where() {
        return this;
    }
    orderBy() {
        return this;
    }
    limit() {
        return this;
    }
}
const db = {
    collection: (name)=>new Collection(name)
};
const getIsMock = ()=>false;
}),
"[project]/opengravity/open-gravity-ui/src/lib/knowledge_graph.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "KnowledgeGraph",
    ()=>KnowledgeGraph,
    "injectFileAsNode",
    ()=>injectFileAsNode,
    "injectLeadAsNode",
    ()=>injectLeadAsNode
]);
/**
 * OpenGravity v10 — Semantic Knowledge Graph (Neural Memory)
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$opengravity$2f$open$2d$gravity$2d$ui$2f$src$2f$lib$2f$storage$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/opengravity/open-gravity-ui/src/lib/storage.ts [app-route] (ecmascript)");
;
class KnowledgeGraph {
    static async addNode(node) {
        const id = `node_${Date.now()}`;
        await __TURBOPACK__imported__module__$5b$project$5d2f$opengravity$2f$open$2d$gravity$2d$ui$2f$src$2f$lib$2f$storage$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["db"].collection('knowledge').add({
            ...node,
            id,
            createdAt: new Date().toISOString(),
            isNode: true // Marcador para distinguirlo de la memoria plana
        });
        return id;
    }
    static async addRelation(rel) {
        await __TURBOPACK__imported__module__$5b$project$5d2f$opengravity$2f$open$2d$gravity$2d$ui$2f$src$2f$lib$2f$storage$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["db"].collection('knowledge').add({
            ...rel,
            isRelation: true,
            createdAt: new Date().toISOString()
        });
    }
    static async searchRelated(nodeId) {
        const snap = await __TURBOPACK__imported__module__$5b$project$5d2f$opengravity$2f$open$2d$gravity$2d$ui$2f$src$2f$lib$2f$storage$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["db"].collection('knowledge').get();
        const items = snap.docs.map((d)=>d.data());
        // Buscar relaciones donde este nodo participe
        const relations = items.filter((i)=>i.isRelation && (i.from === nodeId || i.to === nodeId));
        // Buscar los nodos vinculados
        const relatedIds = relations.map((r)=>r.from === nodeId ? r.to : r.from);
        return items.filter((i)=>i.isNode && relatedIds.includes(i.id));
    }
}
async function injectLeadAsNode(lead) {
    const nodeId = await KnowledgeGraph.addNode({
        label: lead.email,
        type: 'lead',
        properties: {
            topic: lead.topic,
            source: lead.source,
            timestamp: lead.timestamp
        }
    });
    if (lead.topic === 'Tax/LLC') {
        await KnowledgeGraph.addRelation({
            from: nodeId,
            to: 'concept_tax_software',
            predicate: 'INTERESADO_EN'
        });
    }
}
async function injectFileAsNode(file) {
    const nodeId = await KnowledgeGraph.addNode({
        label: file.name,
        type: file.mime.startsWith('image/') ? 'concept' : 'file',
        properties: {
            path: file.path,
            mime: file.mime,
            size: file.size,
            preview: file.content_preview
        }
    });
    // Auto-relacionar por extensión o carpeta si es posible
    if (file.path.toLowerCase().includes('design') || file.mime.startsWith('image/')) {
        await KnowledgeGraph.addRelation({
            from: nodeId,
            to: 'concept_design_system',
            predicate: 'PARTE_DE'
        });
    }
}
}),
"[project]/opengravity/open-gravity-ui/src/app/api/ingest/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "POST",
    ()=>POST
]);
/**
 * OpenGravity v10 — Unified Ingestion API
 * Permite que scripts externos (ej: Lead Sniper) inyecten datos al Knowledge Graph.
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$opengravity$2f$open$2d$gravity$2d$ui$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/opengravity/open-gravity-ui/node_modules/next/server.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$opengravity$2f$open$2d$gravity$2d$ui$2f$src$2f$lib$2f$knowledge_graph$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/opengravity/open-gravity-ui/src/lib/knowledge_graph.ts [app-route] (ecmascript)");
;
;
async function POST(req) {
    try {
        const body = await req.json();
        const { type, data } = body;
        console.log(`[INGEST] v10 Recibida carga útil: ${type}`);
        if (type === 'lead') {
            await (0, __TURBOPACK__imported__module__$5b$project$5d2f$opengravity$2f$open$2d$gravity$2d$ui$2f$src$2f$lib$2f$knowledge_graph$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["injectLeadAsNode"])(data);
            return __TURBOPACK__imported__module__$5b$project$5d2f$opengravity$2f$open$2d$gravity$2d$ui$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                success: true,
                message: "Lead inyectado."
            });
        }
        if (type === 'file') {
            await (0, __TURBOPACK__imported__module__$5b$project$5d2f$opengravity$2f$open$2d$gravity$2d$ui$2f$src$2f$lib$2f$knowledge_graph$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["injectFileAsNode"])(data);
            return __TURBOPACK__imported__module__$5b$project$5d2f$opengravity$2f$open$2d$gravity$2d$ui$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                success: true,
                message: "Archivo/Asset inyectado."
            });
        }
        return __TURBOPACK__imported__module__$5b$project$5d2f$opengravity$2f$open$2d$gravity$2d$ui$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            success: false,
            error: "Tipo no soportado."
        }, {
            status: 400
        });
    } catch (e) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$opengravity$2f$open$2d$gravity$2d$ui$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            success: false,
            error: e.message
        }, {
            status: 500
        });
    }
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__9bbfa5da._.js.map
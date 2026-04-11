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
"[project]/opengravity/open-gravity-ui/src/lib/tools.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "createCronJob",
    ()=>createCronJob,
    "dbTimeout",
    ()=>dbTimeout,
    "deleteCronJob",
    ()=>deleteCronJob,
    "deleteFile",
    ()=>deleteFile,
    "deleteKnowledge",
    ()=>deleteKnowledge,
    "deleteSkill",
    ()=>deleteSkill,
    "getAgentStats",
    ()=>getAgentStats,
    "getAllKnowledge",
    ()=>getAllKnowledge,
    "installSkill",
    ()=>installSkill,
    "listCronJobs",
    ()=>listCronJobs,
    "listFiles",
    ()=>listFiles,
    "listSkills",
    ()=>listSkills,
    "markCronJobRun",
    ()=>markCronJobRun,
    "readFile",
    ()=>readFile,
    "saveFile",
    ()=>saveFile,
    "saveKnowledge",
    ()=>saveKnowledge,
    "searchKnowledge",
    ()=>searchKnowledge,
    "toggleCronJob",
    ()=>toggleCronJob,
    "updateFile",
    ()=>updateFile,
    "updateKnowledge",
    ()=>updateKnowledge
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$opengravity$2f$open$2d$gravity$2d$ui$2f$src$2f$lib$2f$storage$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/opengravity/open-gravity-ui/src/lib/storage.ts [app-route] (ecmascript)");
;
function dbTimeout(promise, fallback, ms = 10000) {
    return Promise.race([
        promise,
        new Promise((resolve)=>setTimeout(()=>resolve(fallback), ms))
    ]);
}
async function saveKnowledge(entry) {
    const now = new Date();
    return await __TURBOPACK__imported__module__$5b$project$5d2f$opengravity$2f$open$2d$gravity$2d$ui$2f$src$2f$lib$2f$storage$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["db"].collection('knowledge').add({
        ...entry,
        createdAt: now,
        updatedAt: now
    });
}
async function searchKnowledge(query, limit = 10) {
    const words = query.toLowerCase().split(/\s+/).filter((w)=>w.length > 2);
    const snap = await __TURBOPACK__imported__module__$5b$project$5d2f$opengravity$2f$open$2d$gravity$2d$ui$2f$src$2f$lib$2f$storage$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["db"].collection('knowledge').get();
    return snap.docs.map((doc)=>({
            ...doc.data()
        })).filter((entry)=>{
        const text = `${entry.title} ${entry.content} ${entry.tags.join(' ')}`.toLowerCase();
        return words.length === 0 || words.some((w)=>text.includes(w));
    }).sort((a, b)=>new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()).slice(0, limit);
}
async function getAllKnowledge(limit = 50) {
    const snap = await __TURBOPACK__imported__module__$5b$project$5d2f$opengravity$2f$open$2d$gravity$2d$ui$2f$src$2f$lib$2f$storage$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["db"].collection('knowledge').get();
    return snap.docs.map((doc)=>({
            ...doc.data()
        })).sort((a, b)=>new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()).slice(0, limit);
}
async function deleteKnowledge(id) {
    await __TURBOPACK__imported__module__$5b$project$5d2f$opengravity$2f$open$2d$gravity$2d$ui$2f$src$2f$lib$2f$storage$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["db"].collection('knowledge').doc(id).delete();
    return {
        success: true
    };
}
async function updateKnowledge(id, updates) {
    await __TURBOPACK__imported__module__$5b$project$5d2f$opengravity$2f$open$2d$gravity$2d$ui$2f$src$2f$lib$2f$storage$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["db"].collection('knowledge').doc(id).update({
        ...updates,
        updatedAt: new Date()
    });
    return {
        success: true
    };
}
async function saveFile(name, path, content, mimeType = 'text/plain') {
    const now = new Date();
    return await __TURBOPACK__imported__module__$5b$project$5d2f$opengravity$2f$open$2d$gravity$2d$ui$2f$src$2f$lib$2f$storage$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["db"].collection('files').add({
        name,
        path: path || '/',
        content,
        mimeType,
        sizeBytes: Buffer.byteLength(content, 'utf-8'),
        createdAt: now,
        updatedAt: now
    });
}
async function readFile(fileId) {
    const doc = await __TURBOPACK__imported__module__$5b$project$5d2f$opengravity$2f$open$2d$gravity$2d$ui$2f$src$2f$lib$2f$storage$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["db"].collection('files').doc(fileId).get();
    return doc.exists ? doc.data() : null;
}
async function listFiles(dirPath = '/') {
    const snap = await __TURBOPACK__imported__module__$5b$project$5d2f$opengravity$2f$open$2d$gravity$2d$ui$2f$src$2f$lib$2f$storage$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["db"].collection('files').get();
    return snap.docs.map((doc)=>doc.data()).filter((f)=>f.path === dirPath).map((f)=>({
            id: f.id,
            name: f.name,
            path: f.path,
            mimeType: f.mimeType,
            sizeBytes: f.sizeBytes,
            createdAt: f.createdAt,
            updatedAt: f.updatedAt
        }));
}
async function deleteFile(fileId) {
    await __TURBOPACK__imported__module__$5b$project$5d2f$opengravity$2f$open$2d$gravity$2d$ui$2f$src$2f$lib$2f$storage$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["db"].collection('files').doc(fileId).delete();
    return {
        success: true
    };
}
async function createCronJob(job) {
    const now = new Date();
    return await __TURBOPACK__imported__module__$5b$project$5d2f$opengravity$2f$open$2d$gravity$2d$ui$2f$src$2f$lib$2f$storage$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["db"].collection('cron_jobs').add({
        ...job,
        createdAt: now,
        lastRun: null,
        nextRun: new Date(now.getTime() + 3600000),
        runCount: 0,
        lastResult: null
    });
}
async function listCronJobs() {
    const snap = await __TURBOPACK__imported__module__$5b$project$5d2f$opengravity$2f$open$2d$gravity$2d$ui$2f$src$2f$lib$2f$storage$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["db"].collection('cron_jobs').get();
    return snap.docs.map((doc)=>doc.data());
}
async function toggleCronJob(id, enabled) {
    await __TURBOPACK__imported__module__$5b$project$5d2f$opengravity$2f$open$2d$gravity$2d$ui$2f$src$2f$lib$2f$storage$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["db"].collection('cron_jobs').doc(id).update({
        enabled
    });
    return {
        success: true
    };
}
async function deleteCronJob(id) {
    await __TURBOPACK__imported__module__$5b$project$5d2f$opengravity$2f$open$2d$gravity$2d$ui$2f$src$2f$lib$2f$storage$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["db"].collection('cron_jobs').doc(id).delete();
    return {
        success: true
    };
}
async function updateFile(id, content) {
    await __TURBOPACK__imported__module__$5b$project$5d2f$opengravity$2f$open$2d$gravity$2d$ui$2f$src$2f$lib$2f$storage$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["db"].collection('files').doc(id).update({
        content,
        sizeBytes: Buffer.byteLength(content, 'utf-8'),
        updatedAt: new Date()
    });
    return {
        success: true
    };
}
async function markCronJobRun(id, result) {
    const now = new Date();
    const doc = await __TURBOPACK__imported__module__$5b$project$5d2f$opengravity$2f$open$2d$gravity$2d$ui$2f$src$2f$lib$2f$storage$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["db"].collection('cron_jobs').doc(id).get();
    const data = doc.data();
    if (data) {
        await __TURBOPACK__imported__module__$5b$project$5d2f$opengravity$2f$open$2d$gravity$2d$ui$2f$src$2f$lib$2f$storage$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["db"].collection('cron_jobs').doc(id).update({
            lastRun: now,
            runCount: (data.runCount || 0) + 1,
            lastResult: result
        });
    }
}
async function installSkill(skill) {
    const now = new Date();
    return await __TURBOPACK__imported__module__$5b$project$5d2f$opengravity$2f$open$2d$gravity$2d$ui$2f$src$2f$lib$2f$storage$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["db"].collection('skills').add({
        ...skill,
        status: 'active',
        installedAt: now
    });
}
async function listSkills() {
    const snap = await __TURBOPACK__imported__module__$5b$project$5d2f$opengravity$2f$open$2d$gravity$2d$ui$2f$src$2f$lib$2f$storage$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["db"].collection('skills').get();
    return snap.docs.map((doc)=>doc.data());
}
async function deleteSkill(id) {
    await __TURBOPACK__imported__module__$5b$project$5d2f$opengravity$2f$open$2d$gravity$2d$ui$2f$src$2f$lib$2f$storage$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["db"].collection('skills').doc(id).delete();
    return {
        success: true
    };
}
async function getAgentStats() {
    const [know, file, cron, skill] = await Promise.all([
        __TURBOPACK__imported__module__$5b$project$5d2f$opengravity$2f$open$2d$gravity$2d$ui$2f$src$2f$lib$2f$storage$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["db"].collection('knowledge').get(),
        __TURBOPACK__imported__module__$5b$project$5d2f$opengravity$2f$open$2d$gravity$2d$ui$2f$src$2f$lib$2f$storage$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["db"].collection('files').get(),
        __TURBOPACK__imported__module__$5b$project$5d2f$opengravity$2f$open$2d$gravity$2d$ui$2f$src$2f$lib$2f$storage$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["db"].collection('cron_jobs').get(),
        __TURBOPACK__imported__module__$5b$project$5d2f$opengravity$2f$open$2d$gravity$2d$ui$2f$src$2f$lib$2f$storage$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["db"].collection('skills').get()
    ]);
    return {
        totalMessages: 0,
        totalKnowledge: know.size,
        totalFiles: file.size,
        totalCronJobs: cron.size,
        totalSkills: skill.size,
        activeCronJobs: cron.docs.filter((d)=>d.data().enabled).length
    };
}
}),
"[project]/opengravity/open-gravity-ui/src/app/api/files/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "DELETE",
    ()=>DELETE,
    "GET",
    ()=>GET,
    "POST",
    ()=>POST,
    "PUT",
    ()=>PUT
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$opengravity$2f$open$2d$gravity$2d$ui$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/opengravity/open-gravity-ui/node_modules/next/server.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$opengravity$2f$open$2d$gravity$2d$ui$2f$src$2f$lib$2f$tools$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/opengravity/open-gravity-ui/src/lib/tools.ts [app-route] (ecmascript)");
;
;
async function GET(req) {
    try {
        const id = req.nextUrl.searchParams.get('id');
        if (id) {
            const file = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$opengravity$2f$open$2d$gravity$2d$ui$2f$src$2f$lib$2f$tools$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["readFile"])(id);
            if (!file) return __TURBOPACK__imported__module__$5b$project$5d2f$opengravity$2f$open$2d$gravity$2d$ui$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: 'File not found'
            }, {
                status: 404
            });
            return __TURBOPACK__imported__module__$5b$project$5d2f$opengravity$2f$open$2d$gravity$2d$ui$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json(file);
        }
        const dir = req.nextUrl.searchParams.get('path') || '/';
        const files = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$opengravity$2f$open$2d$gravity$2d$ui$2f$src$2f$lib$2f$tools$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["listFiles"])(dir);
        return __TURBOPACK__imported__module__$5b$project$5d2f$opengravity$2f$open$2d$gravity$2d$ui$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            files
        });
    } catch (e) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$opengravity$2f$open$2d$gravity$2d$ui$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: e.message
        }, {
            status: 500
        });
    }
}
async function POST(req) {
    try {
        const body = await req.json();
        const result = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$opengravity$2f$open$2d$gravity$2d$ui$2f$src$2f$lib$2f$tools$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["saveFile"])(body.name || 'untitled.txt', body.path || '/', body.content || '', body.mimeType || 'text/plain');
        return __TURBOPACK__imported__module__$5b$project$5d2f$opengravity$2f$open$2d$gravity$2d$ui$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json(result);
    } catch (e) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$opengravity$2f$open$2d$gravity$2d$ui$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: e.message
        }, {
            status: 500
        });
    }
}
async function PUT(req) {
    try {
        const body = await req.json();
        if (!body.id) return __TURBOPACK__imported__module__$5b$project$5d2f$opengravity$2f$open$2d$gravity$2d$ui$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: 'Missing id'
        }, {
            status: 400
        });
        await (0, __TURBOPACK__imported__module__$5b$project$5d2f$opengravity$2f$open$2d$gravity$2d$ui$2f$src$2f$lib$2f$tools$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["updateFile"])(body.id, body.content);
        return __TURBOPACK__imported__module__$5b$project$5d2f$opengravity$2f$open$2d$gravity$2d$ui$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            success: true
        });
    } catch (e) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$opengravity$2f$open$2d$gravity$2d$ui$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: e.message
        }, {
            status: 500
        });
    }
}
async function DELETE(req) {
    try {
        const id = req.nextUrl.searchParams.get('id');
        if (!id) return __TURBOPACK__imported__module__$5b$project$5d2f$opengravity$2f$open$2d$gravity$2d$ui$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: 'Missing id'
        }, {
            status: 400
        });
        await (0, __TURBOPACK__imported__module__$5b$project$5d2f$opengravity$2f$open$2d$gravity$2d$ui$2f$src$2f$lib$2f$tools$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["deleteFile"])(id);
        return __TURBOPACK__imported__module__$5b$project$5d2f$opengravity$2f$open$2d$gravity$2d$ui$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            success: true
        });
    } catch (e) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$opengravity$2f$open$2d$gravity$2d$ui$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: e.message
        }, {
            status: 500
        });
    }
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__fed9ec73._.js.map
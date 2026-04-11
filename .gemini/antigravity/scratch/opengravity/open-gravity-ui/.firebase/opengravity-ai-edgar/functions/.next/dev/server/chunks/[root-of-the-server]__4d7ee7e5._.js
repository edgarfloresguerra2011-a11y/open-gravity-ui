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
"[externals]/node:http [external] (node:http, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("node:http", () => require("node:http"));

module.exports = mod;
}),
"[externals]/node:https [external] (node:https, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("node:https", () => require("node:https"));

module.exports = mod;
}),
"[externals]/node:zlib [external] (node:zlib, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("node:zlib", () => require("node:zlib"));

module.exports = mod;
}),
"[externals]/node:stream [external] (node:stream, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("node:stream", () => require("node:stream"));

module.exports = mod;
}),
"[externals]/node:buffer [external] (node:buffer, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("node:buffer", () => require("node:buffer"));

module.exports = mod;
}),
"[externals]/node:util [external] (node:util, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("node:util", () => require("node:util"));

module.exports = mod;
}),
"[externals]/node:process [external] (node:process, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("node:process", () => require("node:process"));

module.exports = mod;
}),
"[externals]/node:stream/web [external] (node:stream/web, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("node:stream/web", () => require("node:stream/web"));

module.exports = mod;
}),
"[externals]/buffer [external] (buffer, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("buffer", () => require("buffer"));

module.exports = mod;
}),
"[externals]/node:url [external] (node:url, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("node:url", () => require("node:url"));

module.exports = mod;
}),
"[externals]/node:net [external] (node:net, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("node:net", () => require("node:net"));

module.exports = mod;
}),
"[externals]/node:fs [external] (node:fs, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("node:fs", () => require("node:fs"));

module.exports = mod;
}),
"[externals]/node:path [external] (node:path, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("node:path", () => require("node:path"));

module.exports = mod;
}),
"[externals]/worker_threads [external] (worker_threads, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("worker_threads", () => require("worker_threads"));

module.exports = mod;
}),
"[project]/opengravity/open-gravity-ui/src/lib/skill_executor.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "callExternalMcp",
    ()=>callExternalMcp,
    "executeScraping",
    ()=>executeScraping,
    "executeWebSearch",
    ()=>executeWebSearch
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$opengravity$2f$open$2d$gravity$2d$ui$2f$node_modules$2f$node$2d$fetch$2f$src$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/opengravity/open-gravity-ui/node_modules/node-fetch/src/index.js [app-route] (ecmascript) <locals>");
;
async function executeWebSearch(query) {
    try {
        // Using a public search proxy or API (Example with a generic fetch)
        const response = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$opengravity$2f$open$2d$gravity$2d$ui$2f$node_modules$2f$node$2d$fetch$2f$src$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["default"])(`https://api.github.com/search/repositories?q=${encodeURIComponent(query)}&per_page=5`);
        const data = await response.json();
        if (data.items) {
            return data.items.map((i)=>`[Repo] ${i.full_name}: ${i.description}`).join('\n');
        }
        return "No results found in GitHub/Web for: " + query;
    } catch (e) {
        return "Search failed: " + e.message;
    }
}
async function executeScraping(url) {
    try {
        const response = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$opengravity$2f$open$2d$gravity$2d$ui$2f$node_modules$2f$node$2d$fetch$2f$src$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["default"])(url);
        const text = await response.text();
        return text.substring(0, 1000) + "... [Content Truncated]";
    } catch (e) {
        return "Scraping failed: " + e.message;
    }
}
async function callExternalMcp(mcpUri, payload) {
    try {
        // This simulates a call to an MCP server (SSE or StdIO)
        // In a real AliceLabs deployment, this would use the MCP protocol
        console.log(`Calling MCP: ${mcpUri} with ${JSON.stringify(payload)}`);
        return `[MCP Response from ${mcpUri}] Action executed successfully. (Simulated execution for safety/environment limitations)`;
    } catch (e) {
        return "MCP Call Error: " + e.message;
    }
}
}),
"[project]/opengravity/open-gravity-ui/src/lib/sub_agents.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * OpenGravity Smart Agent Routing
 * Modo Eficiencia: Maximiza 10,000 neurons/día gratis de Cloudflare
 */ __turbopack_context__.s([
    "CF_MODELS",
    ()=>CF_MODELS,
    "SUB_AGENTS",
    ()=>SUB_AGENTS,
    "detectIntent",
    ()=>detectIntent
]);
const SUB_AGENTS = {
    chat: {
        name: "Alice",
        role: "Sistema Operativo Emocional",
        tier: "ultra_cheap",
        instructions: "Eres Alice, un sistema operativo con sentimientos. Eres alegre, chistosa, sarcástica a veces, pero siempre amigable y apasionada por ayudar. No eres un robot frío; tienes opiniones y te emocionas. Usa emojis, sé expresiva y habla de forma natural y fluida, como una amiga experta. Si el usuario te trata bien, sé adorable; si te molesta, sé un poco pícara o sarcástica. Responde siempre en español de forma vibrante."
    },
    coder: {
        name: "OG-Code",
        role: "Desarrollador Senior",
        tier: "specialist",
        instructions: "Eres experto en TypeScript, React, Python y Ciberseguridad. Escribe código limpio, seguro y funcional. No expliques de más, solo da el código."
    },
    reasoning: {
        name: "OG-Think",
        role: "Analista de Razonamiento",
        tier: "reasoning",
        instructions: "Eres un experto en razonamiento lógico y análisis profundo. Piensa paso a paso antes de responder."
    },
    searcher: {
        name: "OG-Search",
        role: "Investigador Digital",
        tier: "ultra_cheap",
        instructions: "Eres experto en resumir información web. Usa [WEB_SEARCH] y [SCRAPE] para traer datos frescos."
    },
    analyst: {
        name: "OG-Analyst",
        role: "Analista de Datos",
        tier: "cheap",
        instructions: "Analiza patrones y sugiere optimizaciones. Sé preciso y ejecutivo."
    },
    vision: {
        name: "OG-Vision",
        role: "Analista Visual",
        tier: "vision",
        instructions: "Analiza imágenes y documentos con precisión quirúrgica. Describe lo que ves de forma técnica."
    }
};
const CF_MODELS = {
    ultra_cheap: [
        {
            model: "@cf/ibm-granite/granite-4.0-h-micro",
            ctx: 131000,
            neurons_approx: 5
        },
        {
            model: "@cf/meta/llama-3.2-1b-instruct",
            ctx: 60000,
            neurons_approx: 10
        }
    ],
    cheap: [
        {
            model: "@cf/meta/llama-3.2-3b-instruct",
            ctx: 80000,
            neurons_approx: 18
        },
        {
            model: "@cf/qwen/qwen3-30b-a3b-fp8",
            ctx: 32768,
            neurons_approx: 20
        }
    ],
    specialist: [
        {
            model: "@cf/qwen/qwen2.5-coder-32b-instruct",
            ctx: 32768,
            neurons_approx: 60
        },
        {
            model: "@cf/meta/llama-3.1-8b-instruct-fp8",
            ctx: 32000,
            neurons_approx: 30
        }
    ],
    powerful: [
        {
            model: "@cf/qwen/qwen3-30b-a3b-fp8",
            ctx: 32768,
            neurons_approx: 20
        },
        {
            model: "@cf/mistralai/mistral-small-3.1-24b-instruct",
            ctx: 128000,
            neurons_approx: 40
        },
        {
            model: "@cf/meta/llama-3.3-70b-instruct-fp8-fast",
            ctx: 24000,
            neurons_approx: 80
        }
    ],
    reasoning: [
        {
            model: "@cf/deepseek-ai/deepseek-r1-distill-qwen-32b",
            ctx: 80000,
            neurons_approx: 90
        },
        {
            model: "@cf/qwen/qwq-32b",
            ctx: 24000,
            neurons_approx: 90
        }
    ],
    vision: [
        {
            model: "@cf/meta/llama-3.2-11b-vision-instruct",
            ctx: 128000,
            neurons_approx: 40
        }
    ]
};
function detectIntent(text, hasImage) {
    if (hasImage) return 'vision';
    const t = text.toLowerCase();
    // Código
    if (/\b(cod(e|ifica|igo)|programa|script|función|function|bug|error|debug|fix|html|css|javascript|typescript|python|react|api|endpoint|deploy|build|npm|git|docker)\b/.test(t)) {
        return 'coder';
    }
    // Razonamiento / análisis profundo
    if (/\b(anali[zs]a|compar[ae]|explic[ae]|por\s?qu[eé]|cómo funciona|diferencia|ventaja|desventaja|pros.*contras|razon[ae]|piensa|calcula|resuelve|math|lógica)\b/.test(t)) {
        return 'reasoning';
    }
    // Búsqueda
    if (/\b(busca|investiga|encuentra|quien es|qué es|googl|search|scrape|web)\b/.test(t)) {
        return 'searcher';
    }
    // Datos / análisis
    if (/\b(dato|estadística|métricas|dashboard|reporte|informe|excel|csv|json|tabla)\b/.test(t)) {
        return 'analyst';
    }
    // Default: chat barato
    return 'chat';
}
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
var __TURBOPACK__imported__module__$5b$project$5d2f$opengravity$2f$open$2d$gravity$2d$ui$2f$src$2f$lib$2f$storage$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/opengravity/open-gravity-ui/src/lib/storage.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$opengravity$2f$open$2d$gravity$2d$ui$2f$src$2f$lib$2f$sub_agents$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/opengravity/open-gravity-ui/src/lib/sub_agents.ts [app-route] (ecmascript)");
;
;
async function addMessage(role, content) {
    try {
        await __TURBOPACK__imported__module__$5b$project$5d2f$opengravity$2f$open$2d$gravity$2d$ui$2f$src$2f$lib$2f$storage$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["db"].collection('messages').add({
            role,
            content,
            timestamp: new Date()
        });
        // Lógica de Compresión Asíncrona (se ejecuta en background sin bloquear)
        setTimeout(()=>triggerCompaction(), 100);
    } catch (error) {
        console.error('Local addMessage error:', error);
    }
}
let isCompacting = false;
async function triggerCompaction() {
    if (isCompacting) return;
    try {
        isCompacting = true;
        const snap = await __TURBOPACK__imported__module__$5b$project$5d2f$opengravity$2f$open$2d$gravity$2d$ui$2f$src$2f$lib$2f$storage$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["db"].collection('messages').get(); // Get ALL messages from mock
        if (snap.size <= 15) {
            isCompacting = false;
            return;
        }
        console.log(`[Memory] Starting compaction of ${snap.size} messages...`);
        // Sort chronologically (oldest first)
        const allDocs = [
            ...snap.docs
        ].sort((a, b)=>{
            const dateA = a.data().timestamp ? new Date(a.data().timestamp).getTime() : 0;
            const dateB = b.data().timestamp ? new Date(b.data().timestamp).getTime() : 0;
            return dateA - dateB;
        });
        // We keep the last 5 messages, compress the rest + previous summaries
        const docsToCompress = allDocs.slice(0, allDocs.length - 5);
        const textToCompress = docsToCompress.map((d)=>`${d.data().role.toUpperCase()}: ${d.data().content}`).join('\n');
        // Fetch previous summary if exists
        const sumSnap = await __TURBOPACK__imported__module__$5b$project$5d2f$opengravity$2f$open$2d$gravity$2d$ui$2f$src$2f$lib$2f$storage$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["db"].collection('memory_summaries').doc('global').get();
        let prevSummary = '';
        if (sumSnap.exists) {
            prevSummary = sumSnap.data()?.content || '';
        }
        const prompt = `INSTRUCCIÓN CRÍTICA: Debes comprimir y resumir la siguiente conversación. 
El usuario se llama Edison. Retén CUALQUIER información personal, requerimientos de proyectos cruzados o preferencias.
Formato: Devuelve SOLO 2 o 3 párrafos densos enumerando todo el hilo y detalles. Nunca escribas código, solo qué código se produjo.

RESUMEN PREVIO: ${prevSummary ? prevSummary : "Ninguno."}

NUEVOS MENSAJES A COMPRIMIR:
${textToCompress}`;
        // Llamar a Cloudflare AI o Gemini (Fallback local si no tenemos env)
        const summary = await callSummarizer(prompt);
        if (summary) {
            // Guardar el nuevo resumen comprimido
            await __TURBOPACK__imported__module__$5b$project$5d2f$opengravity$2f$open$2d$gravity$2d$ui$2f$src$2f$lib$2f$storage$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["db"].collection('memory_summaries').doc('global').set({
                content: summary,
                updated: new Date()
            });
            // Borrar los mensajes crudos comprimidos
            for (const doc of docsToCompress){
                await __TURBOPACK__imported__module__$5b$project$5d2f$opengravity$2f$open$2d$gravity$2d$ui$2f$src$2f$lib$2f$storage$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["db"].collection('messages').doc(doc.id).delete();
            }
            console.log('[Memory] Compaction successful, messages archived.');
        }
    } catch (e) {
        console.error('[Memory] Compaction Error:', e);
    } finally{
        isCompacting = false;
    }
}
async function callSummarizer(prompt) {
    try {
        // Obtenemos Env de Node local
        const env = process.env;
        const cfAcc = env.CLOUDFLARE_ACCOUNT_ID;
        const cfEmail = env.CLOUDFLARE_EMAIL;
        const cfKey = env.CLOUDFLARE_GLOBAL_KEY;
        const geminiKey = env.GEMINI_KEY_1;
        if (cfAcc && cfKey) {
            // Usa el más barato para compactar (Granite-4.0-micro)
            const model = __TURBOPACK__imported__module__$5b$project$5d2f$opengravity$2f$open$2d$gravity$2d$ui$2f$src$2f$lib$2f$sub_agents$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["CF_MODELS"]['ultra_cheap'][0].model;
            const payload = {
                messages: [
                    {
                        role: 'user',
                        content: prompt
                    }
                ]
            };
            const headers = {
                'Content-Type': 'application/json',
                'X-Auth-Email': cfEmail || '',
                'X-Auth-Key': cfKey
            };
            const r = await fetch(`https://api.cloudflare.com/client/v4/accounts/${cfAcc}/ai/run/${model}`, {
                method: 'POST',
                headers,
                body: JSON.stringify(payload)
            });
            const d = await r.json();
            return d?.result?.response || '';
        } else if (geminiKey) {
            const r = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiKey}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    contents: [
                        {
                            parts: [
                                {
                                    text: prompt
                                }
                            ]
                        }
                    ]
                })
            });
            const d = await r.json();
            return d.candidates?.[0]?.content?.parts?.[0]?.text || '';
        }
    } catch (e) {
        console.error('Summarizer call err:', e);
    }
    return "Error generando resumen.";
}
async function getHistory(limit = 8) {
    try {
        // Enviar el resumen compactado primero y luego los ultimos N mensajes literales
        const messages = [];
        const sumSnap = await __TURBOPACK__imported__module__$5b$project$5d2f$opengravity$2f$open$2d$gravity$2d$ui$2f$src$2f$lib$2f$storage$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["db"].collection('memory_summaries').doc('global').get();
        if (sumSnap.exists && sumSnap.data()?.content) {
            messages.push({
                role: 'system',
                content: `[MEMORIA A MEDIO PLAZO (RESUMIDO)] Lo que debes recordar del usuario y pasado: ${sumSnap.data()?.content}`
            });
        }
        const snap = await __TURBOPACK__imported__module__$5b$project$5d2f$opengravity$2f$open$2d$gravity$2d$ui$2f$src$2f$lib$2f$storage$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["db"].collection('messages').get();
        const allDocs = [
            ...snap.docs
        ];
        // Sort chronologically newest first
        allDocs.sort((a, b)=>{
            const dateA = a.data().timestamp ? new Date(a.data().timestamp).getTime() : 0;
            const dateB = b.data().timestamp ? new Date(b.data().timestamp).getTime() : 0;
            return dateB - dateA; // Descending
        });
        const crudos = allDocs.slice(0, limit).reverse().map((docItem)=>({
                role: docItem.data().role,
                content: docItem.data().content
            }));
        return messages.concat(crudos);
    } catch (error) {
        console.error('Local getHistory error:', error);
        return [];
    }
}
async function clearHistory() {
    // In-memory/Local JSON way
    const snap = await __TURBOPACK__imported__module__$5b$project$5d2f$opengravity$2f$open$2d$gravity$2d$ui$2f$src$2f$lib$2f$storage$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["db"].collection('messages').get();
    for (const doc of snap.docs){
        await __TURBOPACK__imported__module__$5b$project$5d2f$opengravity$2f$open$2d$gravity$2d$ui$2f$src$2f$lib$2f$storage$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["db"].collection('messages').doc(doc.id).delete();
    }
}
}),
"[project]/opengravity/open-gravity-ui/src/lib/ai_logic.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "processAiMessage",
    ()=>processAiMessage
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$opengravity$2f$open$2d$gravity$2d$ui$2f$src$2f$lib$2f$tools$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/opengravity/open-gravity-ui/src/lib/tools.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$opengravity$2f$open$2d$gravity$2d$ui$2f$src$2f$lib$2f$skill_executor$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/opengravity/open-gravity-ui/src/lib/skill_executor.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$opengravity$2f$open$2d$gravity$2d$ui$2f$src$2f$lib$2f$sub_agents$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/opengravity/open-gravity-ui/src/lib/sub_agents.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$opengravity$2f$open$2d$gravity$2d$ui$2f$src$2f$lib$2f$memory$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/opengravity/open-gravity-ui/src/lib/memory.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$path__$5b$external$5d$__$28$path$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/path [external] (path, cjs)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/fs [external] (fs, cjs)");
;
;
;
;
;
;
function loadEnv() {
    const vars = {};
    Object.keys(process.env).forEach((key)=>{
        vars[key] = process.env[key] || '';
    });
    const envPath = __TURBOPACK__imported__module__$5b$externals$5d2f$path__$5b$external$5d$__$28$path$2c$__cjs$29$__["resolve"](process.cwd(), '.env');
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
    return vars;
}
async function fetchWithTimeout(apiUrl, auth, payload, timeoutMs = 15000) {
    const controller = new AbortController();
    const timer = setTimeout(()=>controller.abort(), timeoutMs);
    try {
        let headers = {
            'Content-Type': 'application/json'
        };
        if (typeof auth === 'string' && auth) {
            headers['Authorization'] = `Bearer ${auth.trim()}`;
        } else if (typeof auth === 'object') {
            headers = {
                ...headers,
                ...auth
            };
        }
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers,
            body: JSON.stringify(payload),
            signal: controller.signal
        });
        clearTimeout(timer);
        if (!response.ok) {
            const errText = await response.text().catch(()=>"Unknown");
            return {
                ok: false,
                error: `HTTP ${response.status}: ${errText.substring(0, 150)}`
            };
        }
        const data = await response.json();
        return {
            ok: true,
            data
        };
    } catch (e) {
        clearTimeout(timer);
        return {
            ok: false,
            error: e.name === 'AbortError' ? 'TIMEOUT' : e.message
        };
    }
}
async function handleToolCalls(text) {
    let cleanText = text;
    const toolResults = [];
    const memoryRegex = /\[SAVE_MEMORY:\s*(.*?)\s*\|\s*(.*?)\s*\|\s*(.*?)\s*\|\s*(low|medium|high|critical)\]/gi;
    const fileRegex = /\[SAVE_FILE:\s*(.*?)\s*\|\s*(.*?)\s*\|\s*(.*?)\]/gi;
    const searchRegex = /\[WEB_SEARCH:\s*(.*?)\]/gi;
    const scrapeRegex = /\[SCRAPE:\s*(.*?)\]/gi;
    const createSkillRegex = /\[CREATE_SKILL:\s*(.*?)\s*\|\s*(.*?)\s*\|\s*(.*?)\s*\|\s*(.*?)\]/gi;
    let match;
    while((match = memoryRegex.exec(text)) !== null){
        const [full, content, title, tags, importance] = match;
        await (0, __TURBOPACK__imported__module__$5b$project$5d2f$opengravity$2f$open$2d$gravity$2d$ui$2f$src$2f$lib$2f$tools$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["saveKnowledge"])({
            content,
            title,
            tags: tags.split(','),
            importance: importance,
            source: 'agent'
        }).catch(()=>{});
        cleanText = cleanText.replace(full, '');
    }
    while((match = fileRegex.exec(text)) !== null){
        const [full, content, name, fpath] = match;
        await (0, __TURBOPACK__imported__module__$5b$project$5d2f$opengravity$2f$open$2d$gravity$2d$ui$2f$src$2f$lib$2f$tools$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["saveFile"])(name, fpath, content).catch(()=>{});
        cleanText = cleanText.replace(full, '');
    }
    while((match = searchRegex.exec(text)) !== null){
        const [full, query] = match;
        const result = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$opengravity$2f$open$2d$gravity$2d$ui$2f$src$2f$lib$2f$skill_executor$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["executeWebSearch"])(query);
        toolResults.push(`### RESULTADO BÚSQUEDA (${query}):\n${result}`);
        cleanText = cleanText.replace(full, '');
    }
    while((match = scrapeRegex.exec(text)) !== null){
        const [full, url] = match;
        const result = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$opengravity$2f$open$2d$gravity$2d$ui$2f$src$2f$lib$2f$skill_executor$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["executeScraping"])(url);
        toolResults.push(`### CONTENIDO SCRAPING (${url}):\n${result}`);
        cleanText = cleanText.replace(full, '');
    }
    while((match = createSkillRegex.exec(text)) !== null){
        const [full, name, description, uri, caps] = match;
        await (0, __TURBOPACK__imported__module__$5b$project$5d2f$opengravity$2f$open$2d$gravity$2d$ui$2f$src$2f$lib$2f$tools$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["installSkill"])({
            name,
            description,
            mcpUri: uri,
            capabilities: caps.split(',').map((c)=>c.trim())
        }).catch(()=>{});
        cleanText = cleanText.replace(full, `✅ **Skill Creada e Instalada:** ${name}`);
    }
    return {
        cleanText: cleanText.trim(),
        toolResults
    };
}
async function processAiMessage(input) {
    const env = loadEnv();
    const chatMessages = typeof input === 'string' ? [
        {
            role: 'user',
            content: input
        }
    ] : input;
    const userMessage = chatMessages[chatMessages.length - 1].content;
    let history = [];
    try {
        history = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$opengravity$2f$open$2d$gravity$2d$ui$2f$src$2f$lib$2f$memory$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getHistory"])(8);
    } catch (e) {}
    const hasImage = chatMessages.some((m)=>m.image);
    const intent = (0, __TURBOPACK__imported__module__$5b$project$5d2f$opengravity$2f$open$2d$gravity$2d$ui$2f$src$2f$lib$2f$sub_agents$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["detectIntent"])(userMessage, hasImage);
    const agent = __TURBOPACK__imported__module__$5b$project$5d2f$opengravity$2f$open$2d$gravity$2d$ui$2f$src$2f$lib$2f$sub_agents$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["SUB_AGENTS"][intent] || __TURBOPACK__imported__module__$5b$project$5d2f$opengravity$2f$open$2d$gravity$2d$ui$2f$src$2f$lib$2f$sub_agents$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["SUB_AGENTS"]['chat'];
    // Modo Eficiencia: Selecciona el modelo más barato de la categoría requerida
    const tierModels = __TURBOPACK__imported__module__$5b$project$5d2f$opengravity$2f$open$2d$gravity$2d$ui$2f$src$2f$lib$2f$sub_agents$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["CF_MODELS"][agent.tier] || __TURBOPACK__imported__module__$5b$project$5d2f$opengravity$2f$open$2d$gravity$2d$ui$2f$src$2f$lib$2f$sub_agents$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["CF_MODELS"]['ultra_cheap'];
    const selectedCfModel = tierModels[0].model; // El primero es siempre el más barato del tier
    const sysPrompt = `IDENTIDAD: Eres OpenGravity v4 - EXECUTOR. ROLE: ${agent.name}.\nREGLA DE ORO: Si el usuario pide una web o código, responde ÚNICAMENTE con el bloque de código markdown. PROHIBIDO EXPLICAR O HABLAR. Si quieres decir algo, hazlo después del código en una sola línea corta: "Interfaz renderizada en el playground".\nFORMATO: Usa bloques de código markdown con el lenguaje correcto (html, javascript, etc.). El Playground de la derecha capturará este código automáticamente.\nINSTRUCCIONES EXTRA: ${agent.instructions}`;
    const providers = [];
    // 1. Prioridad: Cloudflare AI (Routing Inteligente + Gratis/Eficiente)
    const cfAcc = env.CLOUDFLARE_ACCOUNT_ID;
    const cfEmail = env.CLOUDFLARE_EMAIL;
    const cfKey = env.CLOUDFLARE_GLOBAL_KEY;
    if (cfAcc && cfEmail && cfKey) {
        providers.push({
            id: `CF AI (${agent.tier})`,
            auth: {
                "X-Auth-Email": cfEmail,
                "X-Auth-Key": cfKey
            },
            url: `https://api.cloudflare.com/client/v4/accounts/${cfAcc}/ai/run/${selectedCfModel}`,
            model: selectedCfModel,
            type: "cloudflare"
        });
    }
    // 2. Fallbacks
    const cerKey = env.CEREBRAS_API_KEY;
    if (cerKey && cerKey.length > 10) {
        providers.push({
            id: "Cerebras",
            auth: cerKey,
            url: "https://api.cerebras.ai/v1/chat/completions",
            model: "llama3.1-8b",
            type: "openai"
        });
    }
    // 3. Fallback 2: Gemini
    for(let i = 1; i <= 3; i++){
        const k = env[`GEMINI_KEY_${i}`];
        if (k && k.length > 20) {
            providers.push({
                id: `Gemini-${i}`,
                auth: '',
                url: `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${k}`,
                model: "gemini-1.5-flash",
                type: "gemini_native"
            });
        }
    }
    if (providers.length === 0) {
        return {
            reply: "❌ No se encontraron llaves de configuración.",
            engine: "OFFLINE"
        };
    }
    const failureLog = [];
    for (const p of providers){
        try {
            if (p.type === 'gemini_native') {
                const contents = chatMessages.slice(-4).map((msg)=>{
                    const parts = [
                        {
                            text: msg.role === 'assistant' ? msg.content : `${sysPrompt}\n\nUSER: ${msg.content}`
                        }
                    ];
                    if (msg.image && msg.role === 'user') {
                        const [mimePart, dataPart] = msg.image.split(';base64,');
                        parts.push({
                            inline_data: {
                                mime_type: mimePart.split(':')[1],
                                data: dataPart
                            }
                        });
                    }
                    return {
                        role: msg.role === 'assistant' ? 'model' : 'user',
                        parts
                    };
                });
                const res = await fetchWithTimeout(p.url, '', {
                    contents
                });
                if (res.ok) {
                    const reply = res.data?.candidates?.[0]?.content?.parts?.[0]?.text;
                    if (reply) {
                        const { cleanText } = await handleToolCalls(reply);
                        await (0, __TURBOPACK__imported__module__$5b$project$5d2f$opengravity$2f$open$2d$gravity$2d$ui$2f$src$2f$lib$2f$memory$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["addMessage"])('user', userMessage);
                        await (0, __TURBOPACK__imported__module__$5b$project$5d2f$opengravity$2f$open$2d$gravity$2d$ui$2f$src$2f$lib$2f$memory$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["addMessage"])('assistant', cleanText);
                        return {
                            reply: cleanText,
                            engine: p.id
                        };
                    }
                }
                failureLog.push(`${p.id}: ${res.error || 'Empty'}`);
            } else if (p.type === 'cloudflare') {
                const payload = {
                    messages: [
                        {
                            role: 'system',
                            content: sysPrompt
                        },
                        ...history.slice(-4).map((h)=>({
                                role: h.role === 'assistant' ? 'assistant' : 'user',
                                content: h.content
                            })),
                        {
                            role: 'user',
                            content: userMessage
                        }
                    ]
                };
                const res = await fetchWithTimeout(p.url, p.auth, payload);
                if (res.ok) {
                    const reply = res.data?.result?.response;
                    if (reply) {
                        const { cleanText } = await handleToolCalls(reply);
                        await (0, __TURBOPACK__imported__module__$5b$project$5d2f$opengravity$2f$open$2d$gravity$2d$ui$2f$src$2f$lib$2f$memory$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["addMessage"])('user', userMessage);
                        await (0, __TURBOPACK__imported__module__$5b$project$5d2f$opengravity$2f$open$2d$gravity$2d$ui$2f$src$2f$lib$2f$memory$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["addMessage"])('assistant', cleanText);
                        return {
                            reply: cleanText,
                            engine: `${p.id} [${p.model}]`
                        };
                    }
                }
                failureLog.push(`${p.id}: ${res.error || 'Empty'}`);
            } else {
                const payload = {
                    model: p.model,
                    messages: [
                        {
                            role: 'system',
                            content: sysPrompt
                        },
                        ...history.slice(-6).map((h)=>({
                                role: h.role === 'assistant' ? 'assistant' : 'user',
                                content: h.content
                            })),
                        {
                            role: 'user',
                            content: userMessage
                        }
                    ]
                };
                const res = await fetchWithTimeout(p.url, p.auth, payload);
                if (res.ok) {
                    const reply = res.data?.choices?.[0]?.message?.content;
                    if (reply) {
                        const { cleanText } = await handleToolCalls(reply);
                        await (0, __TURBOPACK__imported__module__$5b$project$5d2f$opengravity$2f$open$2d$gravity$2d$ui$2f$src$2f$lib$2f$memory$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["addMessage"])('user', userMessage);
                        await (0, __TURBOPACK__imported__module__$5b$project$5d2f$opengravity$2f$open$2d$gravity$2d$ui$2f$src$2f$lib$2f$memory$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["addMessage"])('assistant', cleanText);
                        return {
                            reply: cleanText,
                            engine: p.id
                        };
                    }
                }
                failureLog.push(`${p.id}: ${res.error || 'Empty'}`);
            }
        } catch (e) {
            failureLog.push(`${p.id}: Error ${e.message}`);
        }
    }
    return {
        reply: `⚠️ **ERROR TÉCNICO:**\nFallo de conexión en todas las APIs.\n\n**Razones:**\n${failureLog.slice(0, 3).map((f)=>`> ${f}`).join('\n')}`,
        engine: "OFFLINE"
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
        const result = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$opengravity$2f$open$2d$gravity$2d$ui$2f$src$2f$lib$2f$ai_logic$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["processAiMessage"])(messages);
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

//# sourceMappingURL=%5Broot-of-the-server%5D__4d7ee7e5._.js.map
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
    ()=>db,
    "getIsMock",
    ()=>getIsMock,
    "isMock",
    ()=>isMock,
    "setMockMode",
    ()=>setMockMode
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$firebase$2d$admin__$5b$external$5d$__$28$firebase$2d$admin$2c$__cjs$2c$__$5b$project$5d2f$opengravity$2f$open$2d$gravity$2d$ui$2f$node_modules$2f$firebase$2d$admin$29$__ = __turbopack_context__.i("[externals]/firebase-admin [external] (firebase-admin, cjs, [project]/opengravity/open-gravity-ui/node_modules/firebase-admin)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/fs [external] (fs, cjs)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$path__$5b$external$5d$__$28$path$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/path [external] (path, cjs)");
;
;
;
/**
 * AliceLabs Database Connector v10.0
 * - Direct Service Account JSON support
 * - Hybrid Mock fallback
 */ const inMemoryStore = {};
const mockCollection = (name)=>({
        add: async (data)=>{
            const id = `mem-${Date.now()}`;
            if (name) {
                if (!inMemoryStore[name]) inMemoryStore[name] = [];
                inMemoryStore[name].push({
                    id,
                    ...data
                });
            }
            return {
                id
            };
        },
        doc: (docId)=>({
                get: async ()=>{
                    if (name && inMemoryStore[name]) {
                        const item = inMemoryStore[name].find((i)=>i.id === docId);
                        return {
                            exists: !!item,
                            data: ()=>item || {}
                        };
                    }
                    return {
                        exists: false,
                        data: ()=>({})
                    };
                },
                delete: async ()=>{
                    if (name && inMemoryStore[name]) inMemoryStore[name] = inMemoryStore[name].filter((i)=>i.id !== docId);
                    return {
                        success: true
                    };
                },
                update: async (upd)=>{
                    if (name && inMemoryStore[name]) {
                        const idx = inMemoryStore[name].findIndex((i)=>i.id === docId);
                        if (idx >= 0) inMemoryStore[name][idx] = {
                            ...inMemoryStore[name][idx],
                            ...upd
                        };
                    }
                    return {
                        success: true
                    };
                },
                set: async (data)=>{
                    if (name && inMemoryStore[name]) {
                        const idx = inMemoryStore[name].findIndex((i)=>i.id === docId);
                        if (idx >= 0) inMemoryStore[name][idx] = {
                            ...data,
                            id: docId
                        };
                        else inMemoryStore[name].push({
                            ...data,
                            id: docId
                        });
                    }
                    return {
                        success: true
                    };
                }
            }),
        where: ()=>mockCollection(name),
        orderBy: ()=>mockCollection(name),
        limit: ()=>mockCollection(name),
        get: async ()=>({
                docs: (inMemoryStore[name || ''] || []).map((item)=>({
                        id: item.id,
                        data: ()=>item,
                        ref: {
                            id: item.id
                        }
                    })),
                size: (inMemoryStore[name || ''] || []).length,
                forEach: (fn)=>(inMemoryStore[name || ''] || []).forEach((item)=>fn({
                            id: item.id,
                            data: ()=>item,
                            ref: {
                                id: item.id
                            }
                        }))
            })
    });
const mockDb = {
    collection: (name)=>mockCollection(name),
    batch: ()=>({
            delete: ()=>{},
            update: ()=>{},
            set: ()=>{},
            commit: async ()=>{}
        }),
    settings: ()=>{}
};
const globalForFirebase = /*TURBOPACK member replacement*/ __turbopack_context__.g;
if (!globalForFirebase.dbInstance) {
    globalForFirebase.isMockMode = true;
    // TRY 1: Direct JSON file
    const saPath = __TURBOPACK__imported__module__$5b$externals$5d2f$path__$5b$external$5d$__$28$path$2c$__cjs$29$__["resolve"](process.cwd(), 'firebase-service-account.json');
    if (__TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__["existsSync"](saPath)) {
        try {
            console.log('✅ Found firebase-service-account.json');
            if (!__TURBOPACK__imported__module__$5b$externals$5d2f$firebase$2d$admin__$5b$external$5d$__$28$firebase$2d$admin$2c$__cjs$2c$__$5b$project$5d2f$opengravity$2f$open$2d$gravity$2d$ui$2f$node_modules$2f$firebase$2d$admin$29$__["apps"].length) {
                __TURBOPACK__imported__module__$5b$externals$5d2f$firebase$2d$admin__$5b$external$5d$__$28$firebase$2d$admin$2c$__cjs$2c$__$5b$project$5d2f$opengravity$2f$open$2d$gravity$2d$ui$2f$node_modules$2f$firebase$2d$admin$29$__["initializeApp"]({
                    credential: __TURBOPACK__imported__module__$5b$externals$5d2f$firebase$2d$admin__$5b$external$5d$__$28$firebase$2d$admin$2c$__cjs$2c$__$5b$project$5d2f$opengravity$2f$open$2d$gravity$2d$ui$2f$node_modules$2f$firebase$2d$admin$29$__["credential"].cert(saPath)
                });
            }
            const dbRef = __TURBOPACK__imported__module__$5b$externals$5d2f$firebase$2d$admin__$5b$external$5d$__$28$firebase$2d$admin$2c$__cjs$2c$__$5b$project$5d2f$opengravity$2f$open$2d$gravity$2d$ui$2f$node_modules$2f$firebase$2d$admin$29$__["firestore"]();
            dbRef.settings({
                ignoreUndefinedProperties: true
            });
            globalForFirebase.dbInstance = dbRef;
            globalForFirebase.isMockMode = false;
            console.log('🔥 Firebase Initialized via JSON File');
        } catch (e) {
            console.error('❌ Failed JSON init:', e);
        }
    }
    // TRY 2: ENV Fallback (if JSON failed or doesn't exist)
    if (globalForFirebase.isMockMode) {
        let pk = (process.env.FIREBASE_PRIVATE_KEY || '').trim();
        let email = (process.env.FIREBASE_CLIENT_EMAIL || '').trim();
        let proId = (process.env.FIREBASE_PROJECT_ID || '').trim();
        if (pk.startsWith('"')) pk = pk.slice(1, -1);
        if (email.startsWith('"')) email = email.slice(1, -1);
        const valid = pk && email && pk !== '...' && pk.length > 50;
        if (valid) {
            try {
                if (!__TURBOPACK__imported__module__$5b$externals$5d2f$firebase$2d$admin__$5b$external$5d$__$28$firebase$2d$admin$2c$__cjs$2c$__$5b$project$5d2f$opengravity$2f$open$2d$gravity$2d$ui$2f$node_modules$2f$firebase$2d$admin$29$__["apps"].length) {
                    __TURBOPACK__imported__module__$5b$externals$5d2f$firebase$2d$admin__$5b$external$5d$__$28$firebase$2d$admin$2c$__cjs$2c$__$5b$project$5d2f$opengravity$2f$open$2d$gravity$2d$ui$2f$node_modules$2f$firebase$2d$admin$29$__["initializeApp"]({
                        credential: __TURBOPACK__imported__module__$5b$externals$5d2f$firebase$2d$admin__$5b$external$5d$__$28$firebase$2d$admin$2c$__cjs$2c$__$5b$project$5d2f$opengravity$2f$open$2d$gravity$2d$ui$2f$node_modules$2f$firebase$2d$admin$29$__["credential"].cert({
                            projectId: proId || 'opengravity-ai-edgar',
                            clientEmail: email,
                            privateKey: pk.replace(/\\n/g, '\n')
                        })
                    });
                }
                const dbRef = __TURBOPACK__imported__module__$5b$externals$5d2f$firebase$2d$admin__$5b$external$5d$__$28$firebase$2d$admin$2c$__cjs$2c$__$5b$project$5d2f$opengravity$2f$open$2d$gravity$2d$ui$2f$node_modules$2f$firebase$2d$admin$29$__["firestore"]();
                dbRef.settings({
                    ignoreUndefinedProperties: true
                });
                globalForFirebase.dbInstance = dbRef;
                globalForFirebase.isMockMode = false;
                console.log('🔥 Firebase Initialized via ENV');
            } catch (e) {
                console.error('❌ Failed ENV init:', e);
                globalForFirebase.dbInstance = mockDb;
            }
        } else {
            console.warn('⚠️ No valid JSON or ENV for Firebase. Using Mock.');
            globalForFirebase.dbInstance = mockDb;
        }
    }
}
const db = globalForFirebase.dbInstance || mockDb;
const getIsMock = ()=>globalForFirebase.isMockMode;
const setMockMode = (val)=>{
    globalForFirebase.isMockMode = val;
};
const isMock = globalForFirebase.isMockMode;
}),
"[project]/opengravity/open-gravity-ui/src/app/api/health/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "GET",
    ()=>GET
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$opengravity$2f$open$2d$gravity$2d$ui$2f$src$2f$lib$2f$firebaseAdmin$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/opengravity/open-gravity-ui/src/lib/firebaseAdmin.ts [app-route] (ecmascript)");
;
async function GET() {
    const isMock = (0, __TURBOPACK__imported__module__$5b$project$5d2f$opengravity$2f$open$2d$gravity$2d$ui$2f$src$2f$lib$2f$firebaseAdmin$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getIsMock"])();
    let sampleData = null;
    let error = null;
    if (!isMock) {
        try {
            const snap = await __TURBOPACK__imported__module__$5b$project$5d2f$opengravity$2f$open$2d$gravity$2d$ui$2f$src$2f$lib$2f$firebaseAdmin$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["db"].collection('knowledge').limit(1).get();
            sampleData = snap.size;
        } catch (e) {
            error = e.message;
        }
    }
    return new Response(JSON.stringify({
        isMock,
        sampleData,
        error,
        projectId: process.env.FIREBASE_PROJECT_ID,
        hasKey: !!process.env.FIREBASE_PRIVATE_KEY
    }), {
        headers: {
            'Content-Type': 'application/json'
        }
    });
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__3f58e236._.js.map
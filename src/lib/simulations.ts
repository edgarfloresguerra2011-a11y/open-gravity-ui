/**
 * OpenGravity — Persistencia de simulaciones por usuario.
 *
 * Cada simulación completada se guarda en:
 *   og:store:u:{userId}:simulations:{jobId}
 *
 * Funciones:
 *   - saveSimulation(userId, jobId, payload) — guarda resultado
 *   - getSimulation(userId, jobId) — recupera uno
 *   - listUserSimulations(userId, limit) — lista paginada
 *   - deleteSimulation(userId, jobId) — borrar uno
 *   - countUserSimulations(userId) — para quota check
 */

import { db } from './storage';

export interface SavedSimulation {
    jobId: string;
    idea: string;
    status: 'completed' | 'failed';
    createdAt: number;
    completedAt?: number;
    viabilityScore?: number;
    marketVerdict?: string;
    quantPayload?: unknown;
    narrativePayload?: unknown;
    error?: string;
}

const COLLECTION = 'simulations';
const MAX_SIMULATIONS_PER_USER = 100; // rotar — solo últimas 100

/**
 * Guarda el resultado final de una simulación.
 * Se llama cuando el job completa o falla.
 */
export async function saveSimulation(
    userId: string,
    jobId: string,
    data: Omit<SavedSimulation, 'jobId' | 'createdAt'>
): Promise<void> {
    const coll = db.collection(COLLECTION, userId);
    await coll.doc(jobId).set({
        jobId,
        createdAt: Date.now(),
        ...data,
    });

    // Rotar — borrar el más viejo si excede el límite
    const count = await countUserSimulations(userId);
    if (count > MAX_SIMULATIONS_PER_USER) {
        await deleteOldestSimulation(userId, count - MAX_SIMULATIONS_PER_USER);
    }
}

export async function getSimulation(
    userId: string,
    jobId: string
): Promise<SavedSimulation | null> {
    const coll = db.collection(COLLECTION, userId);
    const doc = await coll.doc(jobId).get();
    return doc.exists ? (doc.data() as SavedSimulation) : null;
}

export async function listUserSimulations(
    userId: string,
    limit = 20
): Promise<SavedSimulation[]> {
    const coll = db.collection(COLLECTION, userId);
    const snap = await coll.get();
    const items = snap.docs
        .map(d => d.data() as SavedSimulation)
        .sort((a, b) => (b.completedAt ?? b.createdAt) - (a.completedAt ?? a.createdAt))
        .slice(0, limit);
    return items;
}

export async function deleteSimulation(
    userId: string,
    jobId: string
): Promise<void> {
    const coll = db.collection(COLLECTION, userId);
    await coll.doc(jobId).delete();
}

export async function countUserSimulations(userId: string): Promise<number> {
    const coll = db.collection(COLLECTION, userId);
    const snap = await coll.get();
    return snap.size;
}

/**
 * Borra las N simulaciones más viejas (para mantener el límite).
 */
async function deleteOldestSimulation(userId: string, count: number): Promise<void> {
    const coll = db.collection(COLLECTION, userId);
    const snap = await coll.get();
    const sorted = snap.docs
        .map(d => d.data() as SavedSimulation)
        .sort((a, b) => a.createdAt - b.createdAt)
        .slice(0, count);
    for (const item of sorted) {
        await coll.doc(item.jobId).delete();
    }
}

// ─── Quota checks por plan ────────────────────────────────────────────────────

const QUOTA_PER_PLAN = {
    free: 3,    // 3 simulaciones por mes
    pro: 50,    // 50 por mes
    agency: Infinity, // ilimitado
};

/**
 * Verifica si el usuario puede lanzar otra simulación este mes.
 * Devuelve { allowed, used, quota, remaining }.
 */
export async function checkSimulationQuota(
    userId: string,
    plan: 'free' | 'pro' | 'agency'
): Promise<{ allowed: boolean; used: number; quota: number; remaining: number }> {
    const quota = QUOTA_PER_PLAN[plan];
    if (quota === Infinity) {
        return { allowed: true, used: 0, quota: -1, remaining: -1 };
    }

    const coll = db.collection(COLLECTION, userId);
    const snap = await coll.get();
    const now = Date.now();
    const monthStart = new Date();
    monthStart.setDate(1);
    monthStart.setHours(0, 0, 0, 0);
    const monthStartMs = monthStart.getTime();

    const usedThisMonth = snap.docs
        .map(d => d.data() as SavedSimulation)
        .filter(s => s.createdAt >= monthStartMs)
        .length;

    const remaining = Math.max(0, quota - usedThisMonth);
    return {
        allowed: usedThisMonth < quota,
        used: usedThisMonth,
        quota,
        remaining,
    };
}

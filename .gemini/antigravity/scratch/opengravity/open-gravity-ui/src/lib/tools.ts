import { db, getIsMock } from './storage';

// Simplified Timeout guard (mostly unnecessary for local JS, but kept for compatibility)
export function dbTimeout<T>(promise: Promise<T>, fallback: T, ms = 10000): Promise<T> {
    return Promise.race([
        promise,
        new Promise<T>(resolve => setTimeout(() => resolve(fallback), ms))
    ]);
}

// ═══════════════════════════════════════════════════
// LONG-TERM MEMORY (Persistent Knowledge Store)
// ═══════════════════════════════════════════════════

export interface KnowledgeEntry {
    id?: string;
    title: string;
    content: string;
    tags: string[];
    createdAt: Date;
    updatedAt: Date;
    source: 'user' | 'agent' | 'system';
    importance: 'low' | 'medium' | 'high' | 'critical';
}

export async function saveKnowledge(entry: Omit<KnowledgeEntry, 'id' | 'createdAt' | 'updatedAt'>) {
    const now = new Date();
    return await db.collection('knowledge').add({
        ...entry,
        createdAt: now,
        updatedAt: now
    });
}

export async function searchKnowledge(query: string, limit = 10): Promise<KnowledgeEntry[]> {
    const words = query.toLowerCase().split(/\s+/).filter(w => w.length > 2);
    const snap = await db.collection('knowledge').get();

    return snap.docs
        .map((doc: any) => ({ ...doc.data() } as KnowledgeEntry))
        .filter((entry: any) => {
            const text = `${entry.title} ${entry.content} ${entry.tags.join(' ')}`.toLowerCase();
            return words.length === 0 || words.some(w => text.includes(w));
        })
        .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
        .slice(0, limit);
}

export async function getAllKnowledge(limit = 50): Promise<KnowledgeEntry[]> {
    const snap = await db.collection('knowledge').get();
    return snap.docs
        .map((doc: any) => ({ ...doc.data() } as KnowledgeEntry))
        .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
        .slice(0, limit);
}

export async function deleteKnowledge(id: string) {
    await db.collection('knowledge').doc(id).delete();
    return { success: true };
}

export async function updateKnowledge(id: string, updates: Partial<KnowledgeEntry>) {
    await db.collection('knowledge').doc(id).update({
        ...updates,
        updatedAt: new Date()
    });
    return { success: true };
}

// ═══════════════════════════════════════════════════
// CLOUD FILE MANAGER
// ═══════════════════════════════════════════════════

export interface CloudFile {
    id?: string;
    name: string;
    path: string;
    content: string;
    mimeType: string;
    sizeBytes: number;
    createdAt: Date;
    updatedAt: Date;
}

export async function saveFile(name: string, path: string, content: string, mimeType = 'text/plain') {
    const now = new Date();
    return await db.collection('files').add({
        name,
        path: path || '/',
        content,
        mimeType,
        sizeBytes: Buffer.byteLength(content, 'utf-8'),
        createdAt: now,
        updatedAt: now
    });
}

export async function readFile(fileId: string): Promise<CloudFile | null> {
    const doc = await db.collection('files').doc(fileId).get();
    return doc.exists ? (doc.data() as CloudFile) : null;
}

export async function listFiles(dirPath = '/'): Promise<Omit<CloudFile, 'content'>[]> {
    const snap = await db.collection('files').get();
    return snap.docs
        .map((doc: any) => doc.data())
        .filter((f: any) => f.path === dirPath)
        .map((f: any) => ({
            id: f.id,
            name: f.name,
            path: f.path,
            mimeType: f.mimeType,
            sizeBytes: f.sizeBytes,
            createdAt: f.createdAt,
            updatedAt: f.updatedAt
        }));
}

export async function deleteFile(fileId: string) {
    await db.collection('files').doc(fileId).delete();
    return { success: true };
}

// ═══════════════════════════════════════════════════
// CRON JOBS
// ═══════════════════════════════════════════════════

export interface CronJob {
    id?: string;
    name: string;
    description: string;
    schedule: string;
    action: string;
    enabled: boolean;
    lastRun: Date | null;
    nextRun: Date | null;
    createdAt: Date;
    runCount: number;
    lastResult: string | null;
}

export async function createCronJob(job: Omit<CronJob, 'id' | 'createdAt' | 'lastRun' | 'nextRun' | 'runCount' | 'lastResult'>) {
    const now = new Date();
    return await db.collection('cron_jobs').add({
        ...job,
        createdAt: now,
        lastRun: null,
        nextRun: new Date(now.getTime() + 3600000), // Stub next run
        runCount: 0,
        lastResult: null
    });
}

export async function listCronJobs(): Promise<CronJob[]> {
    const snap = await db.collection('cron_jobs').get();
    return snap.docs.map((doc: any) => doc.data() as CronJob);
}

export async function toggleCronJob(id: string, enabled: boolean) {
    await db.collection('cron_jobs').doc(id).update({ enabled });
    return { success: true };
}

export async function deleteCronJob(id: string) {
    await db.collection('cron_jobs').doc(id).delete();
    return { success: true };
}

export async function updateFile(id: string, content: string) {
    await db.collection('files').doc(id).update({
        content,
        sizeBytes: Buffer.byteLength(content, 'utf-8'),
        updatedAt: new Date()
    });
    return { success: true };
}

export async function markCronJobRun(id: string, result: string) {
    const now = new Date();
    const doc = await db.collection('cron_jobs').doc(id).get();
    const data = doc.data();
    if (data) {
        await db.collection('cron_jobs').doc(id).update({
            lastRun: now,
            runCount: (data.runCount || 0) + 1,
            lastResult: result
        });
    }
}

// ═══════════════════════════════════════════════════
// SKILLS & MCP
// ═══════════════════════════════════════════════════

export interface Skill {
    id?: string;
    name: string;
    description: string;
    mcpUri: string;
    capabilities: string[];
    installedAt: Date;
    status: 'active' | 'configuring' | 'beta';
}

export async function installSkill(skill: Omit<Skill, 'id' | 'installedAt' | 'status'>) {
    const now = new Date();
    return await db.collection('skills').add({
        ...skill,
        status: 'active',
        installedAt: now
    });
}

export async function listSkills(): Promise<Skill[]> {
    const snap = await db.collection('skills').get();
    return snap.docs.map((doc: any) => doc.data() as Skill);
}

export async function deleteSkill(id: string) {
    await db.collection('skills').doc(id).delete();
    return { success: true };
}

export async function getAgentStats() {
    const [know, file, cron, skill] = await Promise.all([
        db.collection('knowledge').get(),
        db.collection('files').get(),
        db.collection('cron_jobs').get(),
        db.collection('skills').get()
    ]);
    return {
        totalMessages: 0,
        totalKnowledge: know.size,
        totalFiles: file.size,
        totalCronJobs: cron.size,
        totalSkills: skill.size,
        activeCronJobs: cron.docs.filter((d: any) => d.data().enabled).length
    };
}

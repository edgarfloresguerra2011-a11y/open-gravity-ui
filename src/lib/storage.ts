/**
 * OpenGravity V3 — Storage Layer (Industrial Version)
 *
 * FIX: Replaced all fs.writeFileSync / fs.readFileSync with Redis.
 * Data is now persistent across Vercel cold starts.
 *
 * Architecture:
 *   [+] Namespaced: All keys under `og:store:`
 *   [+] Injection Safe: Path traversal protection via `safeKey`
 *   [+] Backward Compatible: Preserves `db.collection` API for tools.ts
 */

import { Redis } from "@upstash/redis";
import { randomUUID } from "crypto";

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

const NS = "og:store";

// ─── Path traversal fix ───────────────────────────────────────────────────────

function safeKey(folder: string, filename: string): string {
  const clean = (s: string) => s.replace(/[^a-zA-Z0-9_\-\.]/g, "_").slice(0, 128);
  return `${NS}:${clean(folder)}:${clean(filename)}`;
}

/**
 * Construye un key namespaced por userId.
 * Todas las collections pasan a ser: og:store:u:{userId}:{colName}:{id}
 *
 * Si userId es null/undefined, usa el namespace global (backwards-compatible
 * con datos pre-existing). Las rutas API autenticadas siempre pasan userId.
 */
function userNamespacedKey(userId: string | null | undefined, folder: string, filename: string): string {
  const clean = (s: string) => s.replace(/[^a-zA-Z0-9_\-\.]/g, "_").slice(0, 128);
  if (userId) {
    return `${NS}:u:${clean(userId)}:${clean(folder)}:${clean(filename)}`;
  }
  return safeKey(folder, filename);
}

function userNamespacedPattern(userId: string | null | undefined, folder: string): string {
  const clean = (s: string) => s.replace(/[^a-zA-Z0-9_\-\.]/g, "_").slice(0, 128);
  if (userId) {
    return `${NS}:u:${clean(userId)}:${clean(folder)}:*`;
  }
  return `${NS}:${clean(folder)}:*`;
}

// ─── Core operations ──────────────────────────────────────────────────────────

export async function saveFile(
  folder: string,
  filename: string,
  data: unknown,
  ttlSeconds?: number
): Promise<void> {
  const key = safeKey(folder, filename);
  const value = JSON.stringify(data);

  if (ttlSeconds) {
    await redis.set(key, value, { ex: ttlSeconds });
  } else {
    await redis.set(key, value);
  }
}

export async function loadFile<T = unknown>(
  folder: string,
  filename: string
): Promise<T | null> {
  const key = safeKey(folder, filename);
  const raw = await redis.get<string>(key);
  if (!raw) return null;
  try {
    return (typeof raw === "string" ? JSON.parse(raw) : raw) as T;
  } catch {
    return null;
  }
}

export async function deleteFile(folder: string, filename: string): Promise<void> {
  const key = safeKey(folder, filename);
  await redis.del(key);
}

export async function listFiles(folder: string): Promise<string[]> {
  const pattern = `${NS}:${folder.replace(/[^a-zA-Z0-9_\-\.]/g, "_")}:*`;
  const keys = await redis.keys(pattern);
  const prefix = `${NS}:${folder.replace(/[^a-zA-Z0-9_\-\.]/g, "_")}:`;
  return keys.map((k) => k.replace(prefix, ""));
}

// ─── Compatibility Layer (db.collection API) ─────────────────────────────────

/**
 * Collection con namespace opcional por userId.
 *
 * Uso sin auth (legacy):
 *   db.collection('knowledge').add(...)
 *
 * Uso con auth (multi-tenant):
 *   db.collection('knowledge', userId).add(...)
 *
 * Si userId está presente, los keys se aíslan: og:store:u:{userId}:{col}:{id}
 */
export class Collection {
    private colName: string;
    private userId: string | null;

    constructor(name: string, userId?: string | null) {
        this.colName = name;
        this.userId = userId ?? null;
    }

    async add(data: any) {
        const id = `rec_${randomUUID()}`;
        await this.doc(id).set(data);
        return { id };
    }

    async get() {
        const filenames = await this.listFilesInternal();
        const docs = await Promise.all(filenames.map(async (id) => {
            const content = await this.loadDoc(id);
            return {
                id,
                exists: !!content,
                data: () => content
            };
        }));
        return {
            docs,
            size: docs.length
        };
    }

    doc(id: string) {
        return {
            get: async () => {
                const data = await this.loadDoc(id);
                return { exists: !!data, data: () => data };
            },
            delete: async () => {
                await this.deleteDoc(id);
            },
            update: async (updates: any) => {
                const existing: any = await this.loadDoc(id);
                if (existing) {
                    await this.saveDoc(id, { ...existing, ...updates });
                }
            },
            set: async (data: any) => {
                await this.saveDoc(id, { id, ...data });
            }
        };
    }

    // ── Helpers internos que respetan el userId ──
    private async loadDoc(id: string) {
        const key = userNamespacedKey(this.userId, this.colName, id);
        const raw = await redis.get<string>(key);
        if (!raw) return null;
        try {
            return (typeof raw === "string" ? JSON.parse(raw) : raw) as any;
        } catch {
            return null;
        }
    }

    private async saveDoc(id: string, data: any) {
        const key = userNamespacedKey(this.userId, this.colName, id);
        await redis.set(key, JSON.stringify(data));
    }

    private async deleteDoc(id: string) {
        const key = userNamespacedKey(this.userId, this.colName, id);
        await redis.del(key);
    }

    private async listFilesInternal(): Promise<string[]> {
        const pattern = userNamespacedPattern(this.userId, this.colName);
        const keys = await redis.keys(pattern);
        const cleanFolder = this.colName.replace(/[^a-zA-Z0-9_\-\.]/g, "_").slice(0, 128);
        const prefix = this.userId
            ? `${NS}:u:${this.userId.replace(/[^a-zA-Z0-9_\-\.]/g, "_").slice(0, 128)}:${cleanFolder}:`
            : `${NS}:${cleanFolder}:`;
        return keys.map((k) => k.replace(prefix, ""));
    }
}

/**
 * Factory de collections.
 * Uso: db.collection('knowledge') o db.collection('knowledge', userId)
 */
export const db = {
    collection: (name: string, userId?: string | null) => new Collection(name, userId)
};

export const getIsMock = () => false;

// ─── Typed helpers for known collections ─────────────────────────────────────

export const KnowledgeStore = {
  save: (key: string, value: unknown) => saveFile("knowledge", key, value),
  load: <T>(key: string) => loadFile<T>("knowledge", key),
  delete: (key: string) => deleteFile("knowledge", key),
  list: () => listFiles("knowledge"),
};

export const MessageStore = {
  save: (sessionId: string, messages: unknown[]) =>
    saveFile("messages", sessionId, messages, 60 * 60 * 48), // 48h TTL
  load: (sessionId: string) => loadFile<unknown[]>("messages", sessionId),
  delete: (sessionId: string) => deleteFile("messages", sessionId),
};

// ─── LEGACY EXPORTS (V2 Compatibility) ───────────────────────────────────────

/**
 * Legacy wrapper for tool_executor.ts
 */
export async function saveKnowledge(userId: string, data: any) {
  // Use collection to avoid overwriting previous knowledge
  return await db.collection("knowledge").add({ ...data, userId });
}

/**
 * Note: saveFile is already exported, but tool_executor might call it with (name, path, content).
 * We handle the remapping in the tool_executor or here. 
 * Since storage.ts is the core, we keep the clean signature (folder, filename, data).
 */

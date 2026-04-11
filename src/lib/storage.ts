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

export class Collection {
    private colName: string;

    constructor(name: string) {
        this.colName = name;
    }

    async add(data: any) {
        const id = `rec_${Date.now()}_${Math.random().toString(36).substring(7)}`;
        await this.doc(id).set(data);
        return { id };
    }

    async get() {
        const filenames = await listFiles(this.colName);
        const docs = await Promise.all(filenames.map(async (id) => {
            const content = await loadFile<any>(this.colName, id);
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
                const data = await loadFile<any>(this.colName, id);
                return { exists: !!data, data: () => data };
            },
            delete: async () => {
                await deleteFile(this.colName, id);
            },
            update: async (updates: any) => {
                const existing: any = await loadFile(this.colName, id);
                if (existing) {
                    await saveFile(this.colName, id, { ...existing, ...updates });
                }
            },
            set: async (data: any) => {
                await saveFile(this.colName, id, { id, ...data });
            }
        };
    }
}

export const db = {
    collection: (name: string) => new Collection(name)
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

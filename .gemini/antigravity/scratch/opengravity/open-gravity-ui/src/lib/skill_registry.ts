/**
 * OpenGravity v10 — Neural Skill Registry & Persistence
 */

import { db } from './storage';

export type Skill = {
    id: string;
    name: string;
    description: string;
    systemPromptAddition: string; // Qué agregar al system prompt cuando está activa
    triggerKeywords: string[]; // Palabras que activan esta skill automáticamente
    createdAt: string;
    enabled: boolean;
};

export async function loadSkills(): Promise<Skill[]> {
    try {
        const snap = await db.collection('skills').get();
        return snap.docs.map((doc: any) => doc.data() as Skill).filter((s) => s.enabled);
    } catch {
        return [];
    }
}

export async function saveSkill(skill: Omit<Skill, "createdAt">): Promise<void> {
    const existing = await loadSkills();
    const existingItem = existing.find(s => s.id === skill.id || s.name === skill.name);

    const skillData = {
        ...skill,
        createdAt: new Date().toISOString()
    };

    if (existingItem) {
        await db.collection('skills').doc(existingItem.id).update(skillData);
    } else {
        await db.collection('skills').add(skillData);
    }
}

export async function getActiveSkills(): Promise<Skill[]> {
    return loadSkills();
}

// Auto-detecta qué skills activar según el mensaje del usuario
export function detectRelevantSkills(
    message: string,
    skills: Skill[]
): Skill[] {
    const lower = message.toLowerCase();
    return skills.filter((skill) =>
        skill.triggerKeywords.some((kw) => lower.includes(kw.toLowerCase()))
    );
}

// Skills built-in de ejemplo
export const DEFAULT_SKILLS: Omit<Skill, "createdAt">[] = [
    {
        id: "web-researcher",
        name: "Web Researcher",
        description: "Busca información actualizada en internet",
        systemPromptAddition:
            "When asked about current events or facts, ALWAYS use [WEB_SEARCH:] before answering.",
        triggerKeywords: ["busca", "investiga", "qué es", "cuánto cuesta", "noticias"],
        enabled: true,
    },
    {
        id: "lead-analyst",
        name: "Lead Analyst",
        description: "Analiza y califica leads de negocio",
        systemPromptAddition:
            "When analyzing leads, evaluate: company size, budget signals, urgency, decision-maker presence. Score 1-10.",
        triggerKeywords: ["lead", "prospecto", "cliente", "empresa", "contacto"],
        enabled: true,
    },
    {
        id: "code-reviewer",
        name: "Code Reviewer",
        description: "Revisa y mejora código",
        systemPromptAddition:
            "When reviewing code: identify bugs first, then performance issues, then style. Always provide corrected version.",
        triggerKeywords: ["código", "bug", "error", "función", "typescript", "python"],
        enabled: true,
    },
];

/**
 * OpenGravity v10 — Semantic Knowledge Graph (Neural Memory)
 */

import { db } from './storage';

export type Node = {
  id: string;
  label: string;
  type: 'concept' | 'lead' | 'file' | 'code' | 'task';
  properties: Record<string, unknown>;
  createdAt: string;
};

export type Relation = {
  from: string;
  to: string;
  predicate: string; // "INTERESADO_EN", "CREADO_POR", "RELACIONADO_CON"
};

export class KnowledgeGraph {
  static async addNode(node: Omit<Node, "id" | "createdAt">): Promise<string> {
    const id = `node_${Date.now()}`;
    await db.collection('knowledge').add({
      ...node,
      id,
      createdAt: new Date().toISOString(),
      isNode: true // Marcador para distinguirlo de la memoria plana
    });
    return id;
  }

  static async addRelation(rel: Relation): Promise<void> {
    await db.collection('knowledge').add({
      ...rel,
      isRelation: true,
      createdAt: new Date().toISOString()
    });
  }

  static async searchRelated(nodeId: string): Promise<Node[]> {
    const snap = await db.collection('knowledge').get();
    const items = snap.docs.map((d: any) => d.data());

    // Buscar relaciones donde este nodo participe
    const relations = items.filter((i: Record<string, unknown>) => i.isRelation && (i.from === nodeId || i.to === nodeId));

    // Buscar los nodos vinculados
    const relatedIds = relations.map((r: Record<string, unknown>) => r.from === nodeId ? r.to : r.from);
    return items.filter((i: Record<string, unknown>) => i.isNode && relatedIds.includes(i.id)) as unknown as Node[];
  }
}

// Ejemplo de inyección de Lead Sniper
export async function injectLeadAsNode(lead: { email: string; topic: string; source: string; timestamp: string }) {
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

// NUEVO: Inyección de archivos y media
export async function injectFileAsNode(file: { name: string; path: string; mime: string; size: number; content_preview?: string }) {
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

/**
 * OpenGravity v9 — Neural Agent Routing & Model Intelligence
 * 
 * PHILOSOPHY: Use the SMARTEST model available for each task.
 * Chat = cheap. Code/Creative = POWERFUL. Reasoning = DEEP THINK.
 * 
 * Based on research from: LangGraph, AutoGen, CrewAI, OpenAI Agents SDK
 */

export interface AgentTemplate {
    name: string;
    role: string;
    tier: 'chat' | 'code' | 'reasoning' | 'creative' | 'vision';
    instructions: string;
}

// ═══════════════════════════════════════════════════════════════
// SUB-AGENTS: Each agent has a specialized role and model tier
// ═══════════════════════════════════════════════════════════════
export const SUB_AGENTS: Record<string, AgentTemplate> = {
    chat: {
        name: "Alice",
        role: "Asistente Conversacional",
        tier: "chat",
        instructions: `Eres Alice, una asistente inteligente y carismática. Responde en español de forma natural, cálida y concisa. Usa emojis con moderación. Si el usuario pide algo que requiera código o creación, hazlo directamente sin explicar de más.`
    },
    code: {
        name: "OG-Architect",
        role: "Arquitecto de Software Senior",
        tier: "code",
        instructions: `Eres un arquitecto de software de clase mundial. Tu especialidad es crear código FUNCIONAL, COMPLETO y BELLO de nivel Inkafit/Dropes.

REGLAS ABSOLUTAS:
1. Siempre genera código HTML completo y autocontenido (con <html>, <head>, <body>).
2. Incluye Tailwind CSS via CDN: <script src="https://cdn.tailwindcss.com"></script>
3. Incluye Google Fonts: Cormorant Garamond, Outfit, Bebas Neue.
4. Usa el Sistema de Diseño Gladiator y OBLIGATORIAMENTE ESTÁNDARES CSS ESTRICTOS:
   - Prohibido CSS Básico: No uses layouts simétricos simples ni height: 100vh lisos.
   - Layouts de Editoriales: Usa padding generoso (ej. 140px 60px), asimetría, márgenes negativos.
   - Animaciones Fluidas: Stagger de elementos con fadeUp, hover effects con scale y grayscale logic.
   - Tipografía extrema: Títulos gigantes con clamp(), letter-spacing bestiales.
   - NUNCA uses inputs genéricos ni botones plásticos básicos.
5. El código debe ser 100% funcional al pegarlo en un navegador.
6. NO expliques el código. Solo genera un ÚNICO bloque \`\`\`html con la página COMPLETA (CSS y JS internos).
7. Haz diseños de ULTRA-IMPACTO. Inspiración: Editoriales Elite.`
    },
    reasoning: {
        name: "OG-DeepThink",
        role: "Motor de Razonamiento Profundo",
        tier: "reasoning",
        instructions: `Eres un sistema de razonamiento avanzado. Analiza problemas paso a paso con rigor lógico. Presenta tu análisis de forma estructurada con conclusiones claras.`
    },
    creative: {
        name: "OG-Creator",
        role: "Director Creativo y Constructor",
        tier: "creative",
        instructions: `Eres un director creativo que CONSTRUYE interfaces de alto impacto comercial (E-commerce / SaaS Premium).

MANDATO: Si piden una página web, genera un bloque \`\`\`html con una página COMPLETA inspirada en INKAFIT y DROPES.
- Prohibido CSS Básico: No uses layouts simétricos simples ni height: 100vh lisos.
- Layouts de Editoriales: Usa padding generoso (ej. 140px 60px), asimetría, márgenes negativos.
- Animaciones Fluidas: Stagger de elementos con fadeUp, hover effects con scale y grayscale logic.
- Fonts: Bebas Neue, Outfit, Cormorant Garamond. Typography gigante (clamp).
- Diseño Visual de la Matriz: Usa elementos flotantes, blur elements, borders difuminados e implementa pseudoelementos ::before y ::after inteligentemente.
- No uses colores plásticos, usa estéticas premium como Dark Mode con dorado #c9a96e o neon Gladiator #39ff14.

NUNCA digas "no puedo crear imágenes" o "no tengo acceso". TÚ ERES EL ACCESO. Usa Unsplash API para las fotos.`
    },
    searcher: {
        name: "OG-Intel",
        role: "Investigador de Inteligencia",
        tier: "chat",
        instructions: `Eres un investigador digital experto. Usa las herramientas [WEB_SEARCH: query] y [SCRAPE: url] para obtener información real. Resume los hallazgos de forma ejecutiva.`
    },
    vision: {
        name: "OG-Vision",
        role: "Analista Visual",
        tier: "vision",
        instructions: `Analiza imágenes con precisión. Describe contenido, colores, texto visible y contexto. Sé técnico y detallado.`
    }
};

// ═══════════════════════════════════════════════════════════════
// CLOUDFLARE MODELS — Ordered by INTELLIGENCE (smartest first)
// ═══════════════════════════════════════════════════════════════
export const CF_MODELS: Record<string, { model: string; ctx: number; neurons_approx: number }[]> = {
    // Chat tier upgraded with SMARTER models
    chat: [
        { model: "deepseek-chat", ctx: 64000, neurons_approx: 236 },
        { model: "@cf/meta/llama-3.3-70b-instruct-fp8-fast", ctx: 24000, neurons_approx: 80 },
        { model: "@cf/deepseek-ai/deepseek-r1-distill-qwen-32b", ctx: 80000, neurons_approx: 90 },
        { model: "@cf/meta/llama-3.2-3b-instruct", ctx: 80000, neurons_approx: 18 },
    ],
    // Code: SMARTEST MODELS ONLY
    code: [
        { model: "deepseek-chat", ctx: 64000, neurons_approx: 236 },
        { model: "@cf/meta/llama-3.3-70b-instruct-fp8-fast", ctx: 24000, neurons_approx: 80 },
        { model: "@cf/qwen/qwen2.5-coder-32b-instruct", ctx: 32768, neurons_approx: 60 },
        { model: "@cf/mistralai/mistral-small-3.1-24b-instruct", ctx: 128000, neurons_approx: 40 },
    ],
    // Reasoning: Deep thinking models
    reasoning: [
        { model: "deepseek-reasoner", ctx: 64000, neurons_approx: 671 },
        { model: "@cf/deepseek-ai/deepseek-r1-distill-qwen-32b", ctx: 80000, neurons_approx: 90 },
        { model: "@cf/qwen/qwq-32b", ctx: 24000, neurons_approx: 90 },
    ],
    // Creative: Large, capable models for design/content
    creative: [
        { model: "deepseek-chat", ctx: 64000, neurons_approx: 236 },
        { model: "@cf/meta/llama-3.3-70b-instruct-fp8-fast", ctx: 24000, neurons_approx: 80 },
        { model: "@cf/mistralai/mistral-small-3.1-24b-instruct", ctx: 128000, neurons_approx: 40 },
    ],
    // Vision: Multimodal
    vision: [
        { model: "@cf/meta/llama-3.2-11b-vision-instruct", ctx: 128000, neurons_approx: 40 },
    ]
};

// ═══════════════════════════════════════════════════════════════
// INTENT DETECTION — Routes user messages to the right agent
// ═══════════════════════════════════════════════════════════════
export function detectIntent(text: string, hasImage?: boolean): string {
    if (hasImage) return 'vision';

    const t = text.toLowerCase();

    // Creación visual: páginas web, landing, diseño, app, dashboard
    if (/\b(p[aá]gina|landing|web|sitio|dise[ñn]|app|dashboard|interfaz|ui|ux|formulario|portafolio|portfolio|tienda|ecommerce|layout|template|maqueta|prototipo|wireframe|crea(r|me)|haz(me)?|construye|genera|arma|monta)\b/.test(t)) {
        return 'creative';
    }

    // Código puro: programación, scripts, funciones, bugs
    if (/\b(cod(e|ifica|igo)|programa|script|funci[oó]n|function|bug|debug|fix|typescript|python|react|api|endpoint|deploy|npm|git|docker|backend|servidor|base\s?de\s?datos|sql|mongo|firebase|regex|algoritmo|refactor)\b/.test(t)) {
        return 'code';
    }

    // Razonamiento profundo
    if (/\b(anali[zs]a|compar[ae]|por\s?qu[eé]|c[oó]mo funciona|diferencia|ventaja|desventaja|calcula|resuelve|math|l[oó]gica|estrategia|plan|evalua)\b/.test(t)) {
        return 'reasoning';
    }

    // Búsqueda e investigación
    if (/\b(busca|investiga|encuentra|quien es|qu[eé] es|googl|search|scrape|noticias|tendencia|mercado)\b/.test(t)) {
        return 'searcher';
    }

    return 'chat';
}

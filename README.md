# OpenGravity — Simula la viabilidad de tu negocio con IA

**Antes de invertir $50K, simula tu startup en 60 segundos.** OpenGravity combina Deep Research (5 crawlers Tavily en paralelo), agentes sintéticos (DeepSeek), simulación Monte Carlo (1,000 iteraciones con PRNG Mulberry32) y síntesis LLM para darte un reporte de viabilidad P10/P50/P90 con scoring de confianza.

## ✨ Features

- **Landing pública** con propuesta de valor, demos en vivo y pricing
- **Auth con GitHub / Google** (NextAuth.js v5)
- **Dashboard** en `/app` con chat IA, simulador y prospectos
- **Predicción de viabilidad** con Monte Carlo + scoring de confianza por fuente
- **Planes Free / Pro / Agency** con Stripe Checkout + Customer Portal
- **Export PDF** de cada reporte de simulación
- **Historial persistente** por usuario (últimas 100 simulaciones)
- **Cron jobs**: Facebook poster (Dropea-Shop) + Lead Sniper worker
- **Multi-tenant**: cada usuario con namespace aislado en Redis
- **Hardening**: CSP estricta, HSTS, rate limiting en todas las rutas, fail-closed auth
- **Accesibilidad**: lang=es, ARIA labels, prefers-reduced-motion, focus visible, skip-link

## 🚀 Quickstart

```bash
# 1. Clonar
git clone https://github.com/edgarfloresguerra2011-a11y/open-gravity-ui.git
cd open-gravity-ui

# 2. Instalar
npm install

# 3. Configurar env vars
cp .env.example .env
# Edita .env con tus API keys

# 4. Dev server
npm run dev
```

Abrir [http://localhost:3000](http://localhost:3000).

## 📋 Variables de entorno

Ver `.env.example` para la lista completa. **Críticas** (sin ellas el server no arranca en prod):

- `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN`
- `DEEPSEEK_API_KEY`
- `TAVILY_API_KEY`
- `CRON_SECRET`
- `AUTH_SECRET` (generar con `openssl rand -hex 32`)
- `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`

OAuth providers (al menos uno):
- `AUTH_GITHUB_ID`, `AUTH_GITHUB_SECRET` — crear en https://github.com/settings/developers
- `AUTH_GOOGLE_ID`, `AUTH_GOOGLE_SECRET` — crear en https://console.cloud.google.com/apis/credentials

## 🧱 Stack

- **Framework:** Next.js 16.2.10 (App Router, `output: 'standalone'`)
- **UI:** React 19, Tailwind CSS 3.4, Framer Motion, Lucide Icons
- **Auth:** NextAuth.js v5 (Auth.js) con GitHub + Google OAuth
- **Storage:** Upstash Redis (multi-tenant con namespace por userId)
- **LLM:** DeepSeek API (`deepseek-chat`)
- **Research:** Tavily API (5 crawlers paralelos por query)
- **Payments:** Stripe Checkout + Webhooks + Customer Portal
- **PDF:** pdfkit (server-side, sin puppeteer)
- **TTS:** Microsoft Edge Neural TTS (gratuito, español)
- **Bot:** grammY para webhook de Telegram
- **Testing:** Vitest (49 tests)
- **Linter:** ESLint con `eslint-config-next`

## 📂 Estructura

```
src/
├── app/
│   ├── page.tsx              # 🌐 Landing pública
│   ├── login/page.tsx        # OAuth login
│   ├── privacy/              # Política de privacidad
│   ├── terms/                # Términos de servicio
│   ├── app/                  # 🔒 Dashboard (requiere auth)
│   │   ├── page.tsx          # Chat + Sniper + Skills
│   │   ├── predict/          # Simulador Monte Carlo
│   │   └── billing/          # Stripe billing
│   └── api/
│       ├── auth/[...nextauth]/  # NextAuth handler
│       ├── chat/                # SSE streaming con DeepSeek
│       ├── predict/             # Pipeline de simulación
│       │   └── status/          # Polling del job
│       ├── simulations/
│       │   └── [jobId]/pdf/     # Export PDF
│       ├── stripe/
│       │   ├── checkout/        # Crear Checkout Session
│       │   ├── portal/          # Customer Portal
│       │   └── webhook/         # Webhook handler
│       ├── research/            # Deep Research standalone
│       ├── tts/                 # Text-to-speech
│       ├── files/, /knowledge/, /skills/, /cron/, /stats/
│       ├── ingest/              # API externa (API key auth)
│       ├── health/              # Health check con probe Redis
│       ├── cron/facebook-poster/, /lead-sniper/
│       └── webhook/telegram/
├── components/
│   ├── ErrorBoundary.tsx
│   ├── SessionProvider.tsx
│   └── PredictionReport.tsx
└── lib/
    ├── ai_logic.ts           # Orquestador V3
    ├── auth.ts               # requireCronAuth, requireApiKey, safeCompare
    ├── auth-config.ts        # NextAuth v5 config
    ├── session.ts            # getSession, requireSession
    ├── env.ts                # Validación fail-fast
    ├── stripe.ts             # Stripe SDK wrapper
    ├── user-plan.ts          # Plan persistence en Redis
    ├── simulations.ts        # SaveSimulation + quota check
    ├── storage.ts            # Redis + namespace por userId
    ├── job_queue.ts          # Async jobs con timeout race
    ├── rate_limiter.ts       # 6 limiters específicos
    ├── security.ts           # Sanitización + prompt injection detection
    ├── simulation_runner.ts  # Monte Carlo core
    ├── skill_executor.ts     # Deep Research Agent
    ├── prediction_synthesizer.ts
    ├── persona_generator.ts
    ├── master_pipeline.ts    # Bridge
    ├── system_builder.ts     # System prompts (sin GODMODE)
    ├── tool_executor.ts      # Tool parser
    ├── memory.ts             # Memoria + compactación
    ├── knowledge_graph.ts
    ├── skill_registry.ts
    ├── mcp_adapter.ts
    ├── sub_agents.ts
    ├── tools.ts              # API de alto nivel
    ├── logger.ts             # Logger con redacción
    ├── types.ts
    └── firebaseAdmin.ts      # Re-export de storage (legacy)
```

## 🔒 Seguridad

- **Auth:** OAuth con GitHub/Google, JWT en cookie httpOnly
- **Multi-tenant:** namespace `og:store:u:{userId}:{col}:{id}` aísla datos
- **Rate limiting:** sliding window por IP en todas las rutas (chat/research/tts/api/predict)
- **Input validation:** `validateUserInput` detecta patrones peligrosos + prompt injection
- **Body size limits:** `readJsonBody` con maxBytes por endpoint
- **Path traversal protection:** `safeKey` + allowlist de extensiones
- **Headers:** CSP, HSTS, X-Frame-Options DENY, Referrer-Policy, Permissions-Policy
- **Fail-closed auth:** si CRON_SECRET falta, ruta devuelve 503 (no bypass)
- **Constant-time comparison:** `safeCompare` para todos los secrets
- **PDF endpoint** requiere sesión y verifica que el job pertenezca al usuario

## 💳 Planes

| Plan | Precio | Simulaciones/mes | Features |
|---|---|---|---|
| **Free** | $0 | 3 | Chat limitado, reporte básico |
| **Pro** | $29/mes | 50 | PDF export, historial, soporte |
| **Agency** | $99/mes | Ilimitadas | Multi-usuario, API, marca blanca |

## 🧪 Testing

```bash
npm test            # Vitest run
npm run test:watch  # Watch mode
npm run test:coverage
npm run typecheck   # tsc --noEmit
```

49 tests cubren:
- `simulation_runner.ts` — 29 tests (reproducibilidad, economía, casos extremos, backtesting)
- `security.ts` — 20 tests (sanitización, patrones peligrosos, prompt injection)

## 🚢 Deploy en Vercel

1. Conecta el repo en Vercel
2. Configura las env vars (ver `.env.example`)
3. Crea OAuth apps en GitHub y Google con callback URL `https://TU-DOMINIO/api/auth/callback/github` y `.../google`
4. Crea productos en Stripe (Pro $29/mes, Agency $99/mes) y copia los Price IDs a `STRIPE_PRICE_PRO_ID` y `STRIPE_PRICE_AGENCY_ID`
5. Configura Stripe webhook endpoint a `https://TU-DOMINIO/api/stripe/webhook`
6. Deploy automático en push a `main`

## 📈 Roadmap

Ver `docs/ROADMAP.md` para la lista completa de próximas features:
- Integración Shopify/WooCommerce
- API pública B2B
- Vector store para memoria semántica
- Comunidad Discord para usuarios Pro
- Programa de afiliados (30% comisión)

## 📄 Legal

- [Política de Privacidad](/privacy)
- [Términos de Servicio](/terms)

## 📞 Contacto

- Email: hola@opengravity.dev
- Privacidad: privacidad@opengravity.dev
- Seguridad: security@opengravity.dev

## 📝 Licencia

Privado. © 2026 OpenGravity. Hecho en LatAm.

import './globals.css'
import type { Metadata, Viewport } from 'next'
import { Geist, Inter, JetBrains_Mono } from 'next/font/google'
import ErrorBoundary from '@/components/ErrorBoundary'
import SessionProviderWrapper from '@/components/SessionProvider'
import { I18nProvider } from '@/i18n'
import { assertEnv } from '@/lib/env'

// Validar env vars al cargar el módulo (fail-fast en producción)
assertEnv();

// V2 design system:
//   - Geist  → display headlines (very tight tracking, weight 700) — Vercel-grade
//   - Inter  → body / UI text
//   - JetBrains Mono → code, numbers, tickers, technical labels
// No serif fonts — too editorial for the OpenGravity brand.
const geist = Geist({
  subsets: ['latin'],
  variable: '--font-display',
  weight: ['400', '500', '600', '700'],
  display: 'swap',
})
const inter = Inter({ subsets: ['latin'], variable: '--font-sans', display: 'swap' })
const mono = JetBrains_Mono({ subsets: ['latin'], variable: '--font-mono', display: 'swap' })

export const metadata: Metadata = {
  title: 'OpenGravity — Simula la viabilidad de tu negocio con IA',
  description: 'Antes de invertir $50K, simula tu startup en 60 segundos. Deep Research + 1,000 iteraciones Monte Carlo + síntesis LLM. Reportes P10/P50/P90 con scoring de confianza.',
  applicationName: 'OpenGravity',
  authors: [{ name: 'OpenGravity' }],
  keywords: ['viabilidad negocio', 'simulación Monte Carlo', 'startup LatAm', 'análisis IA', 'predicción de negocio', 'validar idea de negocio'],
  robots: { index: true, follow: true },
  openGraph: {
    title: 'OpenGravity — Simula la viabilidad de tu negocio con IA',
    description: 'Antes de invertir $50K, simula tu startup en 60 segundos. 1,000 iteraciones Monte Carlo + IA.',
    type: 'website',
    locale: 'es_ES',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'OpenGravity — Simula la viabilidad de tu negocio',
    description: 'Antes de invertir $50K, simula tu startup en 60 segundos.',
  },
}

export const viewport: Viewport = {
  themeColor: '#050505',
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es" className={`${geist.variable} ${inter.variable} ${mono.variable}`}>
      <body className={`${inter.className} bg-og-bg text-paper`}>
        <I18nProvider>
          <SessionProviderWrapper>
            <ErrorBoundary>{children}</ErrorBoundary>
          </SessionProviderWrapper>
        </I18nProvider>
      </body>
    </html>
  )
}

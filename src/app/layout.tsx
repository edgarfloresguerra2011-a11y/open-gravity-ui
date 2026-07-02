import './globals.css'
import type { Metadata, Viewport } from 'next'
import { Inter, Playfair_Display, JetBrains_Mono } from 'next/font/google'
import ErrorBoundary from '@/components/ErrorBoundary'
import SessionProviderWrapper from '@/components/SessionProvider'
import { I18nProvider } from '@/i18n'
import { assertEnv } from '@/lib/env'

// Validar env vars al cargar el módulo (fail-fast en producción)
assertEnv();

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' })
const playfair = Playfair_Display({ subsets: ['latin'], variable: '--font-serif', style: ['normal', 'italic'] })
const mono = JetBrains_Mono({ subsets: ['latin'], variable: '--font-mono' })

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
  themeColor: '#050508',
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es" className={`${inter.variable} ${playfair.variable} ${mono.variable}`}>
      <body className={inter.className}>
        <I18nProvider>
          <SessionProviderWrapper>
            <ErrorBoundary>{children}</ErrorBoundary>
          </SessionProviderWrapper>
        </I18nProvider>
      </body>
    </html>
  )
}

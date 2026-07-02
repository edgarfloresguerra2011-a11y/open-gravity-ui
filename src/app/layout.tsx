import './globals.css'
import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import ErrorBoundary from '@/components/ErrorBoundary'
import SessionProviderWrapper from '@/components/SessionProvider'
import { assertEnv } from '@/lib/env'

// Validar env vars al cargar el módulo (fail-fast en producción)
assertEnv();

const inter = Inter({ subsets: ['latin'] })

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
    <html lang="es">
      <body className={inter.className}>
        <SessionProviderWrapper>
          <ErrorBoundary>{children}</ErrorBoundary>
        </SessionProviderWrapper>
      </body>
    </html>
  )
}

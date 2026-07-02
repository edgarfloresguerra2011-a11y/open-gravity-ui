'use client';

import { signIn, signOut, useSession } from 'next-auth/react';
import { Github, Mail, ArrowRight, AlertCircle, Terminal, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Suspense, useState } from 'react';
import { useI18n } from '@/i18n';

// Pequeño componente para mostrar el estado de configuración OAuth
function OAuthStatus() {
  // Estos valores se evalúan en el cliente — para que sean reales
  // tendrían que venir del server. Para el MVP, asumimos que si los
  // botones no están listados abajo, no están configurados.
  // El login page los muestra condicionalmente basado en respuesta de /api/auth/providers
  return null;
}

function LoginContent() {
  const { data: session, status } = useSession();
  const { t } = useI18n();
  const searchParams = useSearchParams();
  const error = searchParams.get('error');
  const [email, setEmail] = useState('');
  const [loadingProvider, setLoadingProvider] = useState<string | null>(null);
  const [providers, setProviders] = useState<{ id: string; name: string }[] | null>(null);

  // Fetch providers para saber cuáles están disponibles
  useState(() => {
    fetch('/api/auth/providers')
      .then(r => r.json())
      .then(data => {
        if (Array.isArray(data)) {
          setProviders(data.map(p => ({ id: p.id, name: p.name })));
        }
      })
      .catch(() => setProviders([]));
  });

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-og-bg flex items-center justify-center">
        <Loader2 size={28} className="animate-spin text-mint" />
      </div>
    );
  }

  if (session) {
    return (
      <div className="min-h-screen bg-og-bg text-paper flex items-center justify-center px-6">
        <div className="max-w-md w-full text-center space-y-6">
          <div className="w-20 h-20 mx-auto rounded-md bg-gradient-to-br from-mint to-cyan-elec flex items-center justify-center">
            <Terminal size={36} className="text-og-bg" />
          </div>
          <div>
            <h1 className="text-2xl font-display font-bold mb-2">{t.login.welcomeBack}</h1>
            <p className="text-paper/50 font-mono text-sm">{session.user?.email}</p>
          </div>
          <Link
            href="/app"
            className="block w-full bg-mint text-og-bg py-4 rounded-md font-bold hover:bg-mint/90 transition-colors"
          >
            {t.login.goToDashboard} <ArrowRight size={16} className="inline ml-2" />
          </Link>
          <button
            onClick={() => signOut({ callbackUrl: '/' })}
            className="text-sm text-paper/40 hover:text-paper transition-colors"
          >
            {t.login.signOut}
          </button>
        </div>
      </div>
    );
  }

  const handleSignIn = (provider: string) => {
    setLoadingProvider(provider);
    signIn(provider, { callbackUrl: '/app' }).finally(() => setLoadingProvider(null));
  };

  const handleDevLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoadingProvider('credentials');
    signIn('credentials', {
      email: email || undefined,
      callbackUrl: '/app',
    }).finally(() => setLoadingProvider(null));
  };

  const hasGitHub = providers?.some(p => p.id === 'github');
  const hasGoogle = providers?.some(p => p.id === 'google');
  const hasCredentials = providers?.some(p => p.id === 'credentials');

  return (
    <div className="min-h-screen bg-og-bg text-paper flex items-center justify-center px-6 relative overflow-hidden">
      {/* Background grid */}
      <div className="og-grid-bg" aria-hidden />
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse 50% 50% at 50% 30%, rgba(0, 242, 153, 0.08), transparent 70%)',
        }}
      />

      <div className="max-w-md w-full relative">
        <Link href="/" className="flex items-center justify-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-md bg-gradient-to-br from-mint to-cyan-elec flex items-center justify-center">
            <Terminal size={20} className="text-og-bg" />
          </div>
          <span className="font-mono text-xl font-medium">OpenGravity<span className="text-mint">_</span></span>
        </Link>

        <div className="terminal">
          <div className="terminal-titlebar">
            <span className="terminal-dot" style={{ background: '#ff5f57' }} />
            <span className="terminal-dot" style={{ background: '#febc2e' }} />
            <span className="terminal-dot" style={{ background: '#28c840' }} />
            <span className="ml-2">auth — bash</span>
          </div>
          <div className="terminal-body p-8">
            <h1 className="font-display text-2xl mb-2 tracking-tight">{t.login.title}</h1>
            <p className="font-mono text-[12px] text-paper/50 mb-8">{t.login.subtitle}</p>

            {error && (
              <div className="mb-6 p-3 rounded-md bg-red-500/10 border border-red-500/30 flex items-start gap-2">
                <AlertCircle size={16} className="text-red-400 mt-0.5 shrink-0" />
                <p className="font-mono text-[11px] text-red-300">
                  {t.login.error}
                </p>
              </div>
            )}

            {/* Aviso si solo hay dev login disponible */}
            {hasCredentials && !hasGitHub && !hasGoogle && (
              <div className="mb-6 p-3 rounded-md bg-amber-500/10 border border-amber-500/30 flex items-start gap-2">
                <AlertCircle size={14} className="text-amber-400 mt-0.5 shrink-0" />
                <p className="font-mono text-[11px] text-amber-300 leading-relaxed">
                  {t.login.devModeNotice}
                </p>
              </div>
            )}

            <div className="space-y-3">
              {hasGitHub && (
                <button
                  onClick={() => handleSignIn('github')}
                  disabled={loadingProvider !== null}
                  className="w-full flex items-center justify-center gap-3 bg-paper text-og-bg py-3.5 rounded-md font-mono font-semibold text-[13px] hover:bg-paper/90 transition-colors disabled:opacity-50"
                >
                  {loadingProvider === 'github' ? <Loader2 size={16} className="animate-spin" /> : <Github size={18} />}
                  {t.login.github}
                </button>
              )}

              {hasGoogle && (
                <button
                  onClick={() => handleSignIn('google')}
                  disabled={loadingProvider !== null}
                  className="w-full flex items-center justify-center gap-3 bg-transparent border border-hairline text-paper py-3.5 rounded-md font-mono font-semibold text-[13px] hover:bg-paper/5 transition-colors disabled:opacity-50"
                >
                  {loadingProvider === 'google' ? <Loader2 size={16} className="animate-spin" /> : (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                    </svg>
                  )}
                  {t.login.google}
                </button>
              )}

              {hasCredentials && (
                <form onSubmit={handleDevLogin} className="space-y-3 pt-3 border-t border-hairline mt-3">
                  <div>
                    <label className="font-mono text-[10px] uppercase tracking-wider text-paper/40 mb-1 block">
                      {t.login.devEmail}
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="dev@opengravity.local"
                      className="w-full bg-og-bg border border-hairline rounded-md px-3 py-2.5 font-mono text-[13px] text-paper placeholder:text-paper/30 focus:outline-none focus:border-mint/50"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={loadingProvider !== null}
                    className="w-full flex items-center justify-center gap-2 bg-mint text-og-bg py-3.5 rounded-md font-mono font-semibold text-[13px] hover:bg-mint/90 transition-colors disabled:opacity-50"
                  >
                    {loadingProvider === 'credentials' ? <Loader2 size={16} className="animate-spin" /> : <Mail size={16} />}
                    {t.login.devButton}
                  </button>
                </form>
              )}

              {/* Si no hay providers todavía cargando */}
              {providers === null && (
                <div className="text-center font-mono text-[11px] text-paper/40 py-4">
                  <Loader2 size={14} className="animate-spin inline mr-2" />
                  {t.login.loading}
                </div>
              )}

              {/* Si no hay ningún provider configurado */}
              {providers !== null && providers.length === 0 && (
                <div className="text-center font-mono text-[11px] text-paper/40 py-4">
                  {t.login.noProviders}
                </div>
              )}
            </div>

            <p className="font-mono text-[10px] text-paper/35 text-center mt-6 leading-relaxed">
              {t.login.legalPrefix}{' '}
              <Link href="/terms" className="text-mint hover:underline">{t.footer.terms}</Link>{' '}
              {t.login.legalAnd}{' '}
              <Link href="/privacy" className="text-mint hover:underline">{t.footer.privacy}</Link>.
            </p>
          </div>
        </div>

        <p className="text-center font-mono text-[11px] text-paper/35 mt-6">
          {t.login.noAccount}{' '}
          <Link href="/" className="text-mint hover:underline">
            {t.login.seeDemos}
          </Link>
        </p>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-og-bg" />}>
      <LoginContent />
    </Suspense>
  );
}

'use client';

import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { Check, Crown, Loader2, AlertCircle, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

function BillingContent() {
    const { data: session, status } = useSession();
    const searchParams = useSearchParams();
    const [loading, setLoading] = useState<'pro' | 'agency' | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [portalUrl, setPortalUrl] = useState<string | null>(null);

    const successPlan = searchParams.get('success');
    const canceled = searchParams.get('canceled');

    if (status === 'loading') {
        return (
            <div className="min-h-screen bg-[#050508] flex items-center justify-center">
                <Loader2 size={32} className="animate-spin text-emerald-400" />
            </div>
        );
    }

    if (!session) {
        return (
            <div className="min-h-screen bg-[#050508] text-white flex items-center justify-center">
                <div className="text-center">
                    <p className="text-gray-400 mb-4">Inicia sesión para gestionar tu plan</p>
                    <Link href="/login" className="text-emerald-400 hover:underline">Ir a login →</Link>
                </div>
            </div>
        );
    }

    const handleUpgrade = async (plan: 'pro' | 'agency') => {
        setLoading(plan);
        setError(null);
        try {
            const res = await fetch('/api/stripe/checkout', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ plan }),
            });
            const data = await res.json();
            if (data.url) {
                window.location.href = data.url;
            } else {
                setError(data.error || 'Error al crear checkout');
            }
        } catch (e: any) {
            setError(e.message);
        } finally {
            setLoading(null);
        }
    };

    const handlePortal = async () => {
        setLoading('pro');
        try {
            const res = await fetch('/api/stripe/portal', { method: 'POST' });
            const data = await res.json();
            if (data.url) setPortalUrl(data.url);
            else setError(data.error);
        } catch (e: any) {
            setError(e.message);
        } finally {
            setLoading(null);
        }
    };

    const currentPlan = (session as any)?.plan ?? 'free';

    return (
        <div className="min-h-screen bg-[#050508] text-white p-6">
            <div className="max-w-4xl mx-auto py-12">
                <Link href="/app" className="text-sm text-gray-400 hover:text-white mb-8 inline-flex items-center gap-2">
                    ← Volver al dashboard
                </Link>

                <h1 className="text-4xl font-black tracking-tight mb-2">Billing</h1>
                <p className="text-gray-400 mb-8">Gestiona tu suscripción a OpenGravity</p>

                {/* Status banner */}
                {successPlan && (
                    <div className="mb-8 p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center gap-3">
                        <Check size={20} className="text-emerald-400" />
                        <div>
                            <p className="font-semibold text-emerald-300">
                                ¡Felicitaciones! Tu plan {successPlan} está activo.
                            </p>
                            <p className="text-xs text-emerald-400/70">
                                Refresca la página en unos segundos para ver los cambios reflejados.
                            </p>
                        </div>
                    </div>
                )}
                {canceled && (
                    <div className="mb-8 p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center gap-3">
                        <AlertCircle size={20} className="text-amber-400" />
                        <p className="text-amber-300">Checkout cancelado. No se realizó ningún cargo.</p>
                    </div>
                )}
                {error && (
                    <div className="mb-8 p-4 rounded-2xl bg-red-500/10 border border-red-500/30 flex items-center gap-3">
                        <AlertCircle size={20} className="text-red-400" />
                        <p className="text-red-300 text-sm">{error}</p>
                    </div>
                )}

                {/* Plan actual */}
                <div className="mb-8 p-6 rounded-2xl bg-white/[0.02] border border-white/10">
                    <div className="flex items-center justify-between">
                        <div>
                            <div className="text-xs uppercase tracking-wider text-gray-500 mb-1">Plan actual</div>
                            <div className="text-2xl font-bold capitalize flex items-center gap-2">
                                {currentPlan}
                                {currentPlan !== 'free' && <Crown size={20} className="text-amber-400" />}
                            </div>
                        </div>
                        <div className="text-right">
                            <div className="text-xs uppercase tracking-wider text-gray-500 mb-1">Email</div>
                            <div className="text-sm text-gray-300">{session.user?.email}</div>
                        </div>
                    </div>

                    {currentPlan !== 'free' && (
                        <button
                            onClick={handlePortal}
                            disabled={loading !== null}
                            className="mt-6 text-sm text-gray-400 hover:text-white border border-white/10 px-4 py-2 rounded-lg hover:bg-white/5 transition-colors disabled:opacity-50"
                        >
                            {loading ? <Loader2 size={14} className="animate-spin inline" /> : null}
                            Gestionar suscripción en Stripe →
                        </button>
                    )}
                </div>

                {/* Plans */}
                <div className="grid md:grid-cols-2 gap-6">
                    {/* Pro */}
                    <div className={`p-8 rounded-3xl border ${currentPlan === 'pro' ? 'bg-emerald-500/5 border-emerald-500/40' : 'bg-white/[0.02] border-white/10'}`}>
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-xl font-bold">Pro</h3>
                            {currentPlan === 'pro' && (
                                <span className="text-xs bg-emerald-500/20 text-emerald-400 px-3 py-1 rounded-full">ACTUAL</span>
                            )}
                        </div>
                        <div className="mb-6">
                            <span className="text-4xl font-black">$29</span>
                            <span className="text-gray-500">/mes</span>
                        </div>
                        <ul className="space-y-2 mb-8 text-sm text-gray-300">
                            <li className="flex items-center gap-2"><Check size={14} className="text-emerald-400" /> 50 simulaciones/mes</li>
                            <li className="flex items-center gap-2"><Check size={14} className="text-emerald-400" /> Chat ilimitado</li>
                            <li className="flex items-center gap-2"><Check size={14} className="text-emerald-400" /> Export PDF</li>
                            <li className="flex items-center gap-2"><Check size={14} className="text-emerald-400" /> Historial persistente</li>
                        </ul>
                        <button
                            onClick={() => handleUpgrade('pro')}
                            disabled={loading !== null || currentPlan === 'pro'}
                            className="w-full bg-emerald-400 text-black py-3 rounded-xl font-bold hover:bg-emerald-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {loading === 'pro' ? <Loader2 size={16} className="animate-spin" /> : null}
                            {currentPlan === 'pro' ? 'Plan actual' : 'Upgrade a Pro'}
                            {currentPlan !== 'pro' && <ArrowRight size={14} />}
                        </button>
                    </div>

                    {/* Agency */}
                    <div className={`p-8 rounded-3xl border ${currentPlan === 'agency' ? 'bg-violet-500/5 border-violet-500/40' : 'bg-white/[0.02] border-white/10'}`}>
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-xl font-bold">Agency</h3>
                            {currentPlan === 'agency' && (
                                <span className="text-xs bg-violet-500/20 text-violet-400 px-3 py-1 rounded-full">ACTUAL</span>
                            )}
                        </div>
                        <div className="mb-6">
                            <span className="text-4xl font-black">$99</span>
                            <span className="text-gray-500">/mes</span>
                        </div>
                        <ul className="space-y-2 mb-8 text-sm text-gray-300">
                            <li className="flex items-center gap-2"><Check size={14} className="text-violet-400" /> Simulaciones ilimitadas</li>
                            <li className="flex items-center gap-2"><Check size={14} className="text-violet-400" /> 5 usuarios incluidos</li>
                            <li className="flex items-center gap-2"><Check size={14} className="text-violet-400" /> API access</li>
                            <li className="flex items-center gap-2"><Check size={14} className="text-violet-400" /> Marca blanca</li>
                        </ul>
                        <button
                            onClick={() => handleUpgrade('agency')}
                            disabled={loading !== null || currentPlan === 'agency'}
                            className="w-full bg-violet-500 text-white py-3 rounded-xl font-bold hover:bg-violet-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {loading === 'agency' ? <Loader2 size={16} className="animate-spin" /> : null}
                            {currentPlan === 'agency' ? 'Plan actual' : 'Upgrade a Agency'}
                            {currentPlan !== 'agency' && <ArrowRight size={14} />}
                        </button>
                    </div>
                </div>

                <p className="text-xs text-gray-500 text-center mt-8">
                    Pagos procesados por Stripe. Cancela cuando quieras.
                </p>
            </div>
        </div>
    );
}

export default function BillingPage() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-[#050508]" />}>
            <BillingContent />
        </Suspense>
    );
}

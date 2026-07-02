'use client';

import React, { useState, useEffect } from 'react';
import PredictionReport from '@/components/PredictionReport';
import type { QuantPayload, NarrativePayload } from '@/components/PredictionReport';

const PROGRESS_STAGES = [
    "Iniciando Módulo de Deep Research (Tavily)...",
    "Analizando Competidores y Tendencias Macroeconómicas...",
    "Construyendo Agentes Sintéticos (DeepSeek)...",
    "Modelando Perfiles Psicológicos y Sensibilidad de Precio...",
    "Lanzando Simulación Monte Carlo (1,000 Universos)...",
    "Calculando Percentiles P10/P50/P90 y Distribución...",
    "Evaluando LTV, CAC, Drawdown y Riesgo Estocástico...",
    "Sintetizando Datos con el Oráculo (Prediction Synthesizer)...",
    "Formulando Veredicto Industrial Final..."
];

export default function PredictPage() {
    const [proposal, setProposal] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [quantData, setQuantData] = useState<QuantPayload | null>(null);
    const [narrativeData, setNarrativeData] = useState<NarrativePayload | null>(null);
    const [errorData, setErrorData] = useState<string | null>(null);
    const [progressIndex, setProgressIndex] = useState(0);
    const [currentJobId, setCurrentJobId] = useState<string | null>(null);

    // Efecto para simular progreso logico en pantalla basado en el tiempo que suele tomar la API (aprox 35-50s)
    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (isLoading) {
            interval = setInterval(() => {
                setProgressIndex(prev => {
                    const next = prev + 1;
                    return next >= PROGRESS_STAGES.length ? prev : next;
                });
            }, 6000); // Avanza de "log" visual cada 6 segundos
        } else {
            setProgressIndex(0);
        }
        return () => clearInterval(interval);
    }, [isLoading]);

    const pollJobStatus = (jobId: string) => {
        let attempt = 1;
        
        const doPoll = async () => {
            try {
                const req = await fetch(`/api/predict/status?jobId=${jobId}`);
                if (!req.ok) throw new Error("Fallo de red conectando al puente de Status.");
                const res = await req.json();

                if (res.status === 'completed') {
                    // Separación Quant / Narrative
                    setQuantData(res.quantPayload);
                    setNarrativeData(res.narrativePayload);
                    setIsLoading(false);
                } else if (res.status === 'failed' || res.status === 'error') {
                    // FIX A2: backend usa "failed", no "error"
                    setErrorData(res.error || 'El Worker colapsó durante la simulación estocástica.');
                    setIsLoading(false);
                } else {
                    // processing: backoff dinámico (3s → 6s → 9s → ... → cap 15s)
                    attempt++;
                    const intervalMs = Math.min(3000 * attempt, 15000);
                    setTimeout(doPoll, intervalMs);
                }
            } catch (err: any) {
                console.error("Polling Error:", err);
                setErrorData(err.message || 'Pérdida de conexión con el Orquestador Asíncrono.');
                setIsLoading(false);
            }
        };

        // Arranque inicial a los 3s
        setTimeout(doPoll, 3000);
    };

    const handleSimulate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!proposal.trim() || isLoading) return;

        setIsLoading(true);
        setQuantData(null);
        setNarrativeData(null);
        setErrorData(null);
        setProgressIndex(0);
        setCurrentJobId(null);

        try {
            const req = await fetch('/api/predict', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ proposal })
            });

            if (!req.ok) {
                 throw new Error("HTTP Crash. El enrutamiento de OpenGravity Matrix falló.");
            }

            const res = await req.json();

            if (res.jobId) {
                // Orquestación Asíncrona Iniciada
                setCurrentJobId(res.jobId);
                pollJobStatus(res.jobId);
            } else {
                throw new Error(res.error || 'Fallo de Inicialización. No se recuperó Job ID.');
            }

        } catch (err: any) {
            console.error("Predict Error:", err);
            setErrorData(err.message || 'Error de conexión catastrófico con OpenGravity Matrix.');
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#050505] text-white p-4 sm:p-8 font-sans selection:bg-neutral-800">
            <div className="max-w-5xl mx-auto">
                
                {/* Header App */}
                <div className="mb-12 text-center space-y-4 pt-8">
                    <div className="inline-block px-3 py-1 mb-4 rounded-full border border-neutral-800 bg-neutral-900/50 text-xs font-mono text-neutral-400">
                        OPENGRAVITY_V3_INDUSTRIAL
                    </div>
                    <h1 className="text-4xl sm:text-6xl font-black tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-zinc-100 to-zinc-600">
                        Simulation Core
                    </h1>
                    <p className="text-neutral-400 max-w-2xl mx-auto text-base sm:text-lg">
                        Testea estrés de startups. Ingresa una matriz de negocio y lanzaremos un ejército de inteligencias artificiales para atacarla económicamente.
                    </p>
                </div>

                {/* Input Hub */}
                <div className="bg-neutral-900/50 border border-neutral-800/80 p-2 rounded-2xl max-w-3xl mx-auto mb-16 shadow-2xl backdrop-blur-xl transition-all duration-300 hover:border-neutral-700">
                    <form onSubmit={handleSimulate} className="flex flex-col sm:flex-row gap-2 relative">
                        <input 
                            type="text" 
                            disabled={isLoading}
                            value={proposal}
                            onChange={e => setProposal(e.target.value)}
                            aria-label="Propuesta de negocio a simular"
                            placeholder="Ej. SaaS B2B de logística para flotillas en Colombia"
                            className="flex-grow bg-transparent text-white px-6 py-4 outline-none border-b sm:border-b-0 sm:border-r border-neutral-800/80 placeholder-neutral-600 font-medium disabled:opacity-50"
                            required
                        />
                        <button 
                            type="submit" 
                            disabled={isLoading || !proposal.trim()}
                            aria-label={isLoading ? "Simulando, espera" : "Lanzar simulación"}
                            className="bg-white text-black px-8 py-4 rounded-xl font-bold uppercase tracking-widest text-[11px] sm:text-xs hover:bg-neutral-200 transition-all active:scale-95 disabled:opacity-50 disabled:active:scale-100 disabled:cursor-not-allowed flex items-center justify-center gap-3 shrink-0"
                        >
                            {isLoading ? (
                                <>
                                    <div className="w-4 h-4 border-2 border-black/20 border-t-black rounded-full animate-spin" />
                                    <span>Compilando...</span>
                                </>
                            ) : 'Lanzar Simulación'}
                        </button>
                    </form>
                </div>

                {/* Loading State Cinematic */}
                {isLoading && (
                    <div className="py-24 flex flex-col items-center justify-center gap-8 animate-in fade-in duration-1000">
                        <div className="relative flex justify-center items-center w-32 h-32">
                            <div className="absolute inset-0 border border-emerald-500/20 rounded-full animate-ping opacity-20"></div>
                            <div className="absolute inset-2 border-2 border-t-emerald-500 border-r-transparent border-b-emerald-800 border-l-transparent rounded-full animate-spin"></div>
                            <div className="absolute inset-6 border border-zinc-800 rounded-full animate-spin-reverse"></div>
                            <div className="w-3 h-3 bg-emerald-400 rounded-full blur-[2px] shadow-[0_0_15px_rgba(52,211,153,0.8)]"></div>
                        </div>
                        <div className="text-center space-y-2">
                            <h3 className="text-sm font-bold tracking-[0.25em] text-emerald-400 uppercase">Motor Trabajando</h3>
                            <p className="text-neutral-500 font-mono text-sm max-w-md mx-auto transition-opacity duration-300">
                                {PROGRESS_STAGES[progressIndex]}
                            </p>
                        </div>
                    </div>
                )}

                {/* Error State */}
                {errorData && !isLoading && (
                    <div className="bg-rose-500/5 border border-rose-500/20 p-8 rounded-2xl text-center max-w-2xl mx-auto backdrop-blur-sm animate-in zoom-in-95 duration-300">
                        <div className="w-16 h-16 bg-rose-500/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-rose-500/20">
                            <span className="text-2xl">⚠️</span>
                        </div>
                        <h3 className="text-rose-400 font-bold text-xl mb-2">Falla Crítica de Conexión</h3>
                        <p className="text-rose-300/80 font-mono text-sm">{errorData}</p>
                        <button 
                            onClick={() => setErrorData(null)}
                            className="mt-6 text-xs text-rose-400 uppercase tracking-widest hover:text-rose-300 border-b border-rose-500/30 pb-1"
                        >
                            Desechar logs y reintentar
                        </button>
                    </div>
                )}

                {/* Output Report — New High-Fidelity Component */}
                {quantData && !isLoading && !errorData && (
                    <div className="pb-24">
                        <PredictionReport
                            quantPayload={quantData}
                            narrativePayload={narrativeData || undefined}
                            jobId={currentJobId ?? undefined}
                        />
                    </div>
                )}
            </div>
        </div>
    );
}

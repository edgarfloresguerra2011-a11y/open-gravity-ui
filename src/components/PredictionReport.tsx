"use client";

import { useState, useEffect } from "react";
import { Download, Loader2 } from "lucide-react";

// ─── TYPES ────────────────────────────────────────────────────────────────────

interface PercentileRow {
  p10: number;
  p50: number;
  p90: number;
}

interface StatisticalDistribution {
  ltv: PercentileRow;
  cac: PercentileRow;
  drawdown: PercentileRow;
  bankruptcyRate: number;
  breakEvenMonth: number;
}

interface RiskMatrix {
  marketRisk: number;       // 0-1
  executionRisk: number;
  capitalRisk: number;
  regulatoryRisk: number;
}

interface EmergentInsights {
  elasticityAssumed: number;
  churnAssumed: number;
  conversionAssumed: number;
  researchIntegrityStatus: number;
}

export interface QuantPayload {
  jobId: string;
  seed: string;
  simulatedAt: string;
  iterationsRun: number;
  horizonMonths: number;
  financials: {
    initialCash: number;
    price: number;
    baseCac: number;
    fixedOpEx: number;
    estimatedTAM: number;
  };
  statisticalDistribution: StatisticalDistribution;
  riskMatrix: RiskMatrix;
  emergentInsights: EmergentInsights;
  researchTrustScore: number;
  verdict: "VIABLE" | "MARGINAL" | "HIGH_RISK" | "CRITICAL";
  viabilityScore: number; // 0-100
}

export interface NarrativePayload {
  executiveSummary: string;
  keyRisks: string[];
  recommendations: string[];
  blackSwanWarning: string | null;
}

interface PredictionReportProps {
  quantPayload?: QuantPayload;
  narrativePayload?: NarrativePayload;
  jobId?: string;
}

// ─── HELPERS ──────────────────────────────────────────────────────────────────

function pct(n: number) {
  return (n * 100).toFixed(1) + "%";
}

function verdictConfig(v: QuantPayload["verdict"]) {
  const map = {
    VIABLE:    { label: "VIABLE",     color: "#00D68F", bg: "rgba(0,214,143,0.08)", ring: "rgba(0,214,143,0.3)" },
    MARGINAL:  { label: "MARGINAL",   color: "#F5A623", bg: "rgba(245,166,35,0.08)", ring: "rgba(245,166,35,0.3)" },
    HIGH_RISK: { label: "ALTO RIESGO",color: "#FF6B4A", bg: "rgba(255,107,74,0.08)", ring: "rgba(255,107,74,0.3)" },
    CRITICAL:  { label: "CRÍTICO",    color: "#FF2D55", bg: "rgba(255,45,85,0.08)",  ring: "rgba(255,45,85,0.3)" },
  };
  return map[v];
}

function ScoreArc({ score }: { score: number }) {
  const r = 54;
  const cx = 70;
  const cy = 70;
  const circumference = Math.PI * r; // half circle
  const offset = circumference * (1 - score / 100);
  const color = score >= 70 ? "#00D68F" : score >= 45 ? "#F5A623" : "#FF6B4A";

  return (
    <svg width="140" height="80" viewBox="0 0 140 80">
      <path
        d={`M ${cx - r} ${cy} A ${r} ${r} 0 0 1 ${cx + r} ${cy}`}
        fill="none"
        stroke="rgba(255,255,255,0.06)"
        strokeWidth="10"
        strokeLinecap="round"
      />
      <path
        d={`M ${cx - r} ${cy} A ${r} ${r} 0 0 1 ${cx + r} ${cy}`}
        fill="none"
        stroke={color}
        strokeWidth="10"
        strokeLinecap="round"
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        style={{ transition: "stroke-dashoffset 1.2s cubic-bezier(0.4,0,0.2,1)" }}
      />
      <text x={cx} y={cy - 8} textAnchor="middle" fill={color} fontSize="22" fontWeight="700" fontFamily="'DM Mono', monospace">
        {score}
      </text>
      <text x={cx} y={cy + 8} textAnchor="middle" fill="rgba(255,255,255,0.35)" fontSize="9" fontFamily="'DM Sans', sans-serif" letterSpacing="2">
        VIABILIDAD
      </text>
    </svg>
  );
}

function PercentileBar({ label, row, unit = "$", invert = false }: {
  label: string;
  row: PercentileRow;
  unit?: string;
  invert?: boolean;
}) {
  return (
    <div style={{ marginBottom: "18px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
        <span style={{ fontSize: "11px", letterSpacing: "1.5px", color: "rgba(255,255,255,0.4)", textTransform: "uppercase" }}>{label}</span>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "6px" }}>
        {([
          ["P10", row.p10, invert ? "rgba(0,214,143,0.15)" : "rgba(255,107,74,0.15)", invert ? "#00D68F" : "#FF6B4A"],
          ["P50", row.p50, "rgba(245,166,35,0.15)", "#F5A623"],
          ["P90", row.p90, invert ? "rgba(255,107,74,0.15)" : "rgba(0,214,143,0.15)", invert ? "#FF6B4A" : "#00D68F"]
        ] as const).map(
          ([pLabel, val, bg, color]) => (
            <div key={pLabel} style={{ background: bg, borderRadius: "8px", padding: "10px 12px", border: `1px solid ${color}22` }}>
              <div style={{ fontSize: "9px", letterSpacing: "1.5px", color: "rgba(255,255,255,0.4)", marginBottom: "4px" }}>{pLabel}</div>
              <div style={{ fontSize: "15px", fontWeight: 700, color, fontFamily: "'DM Mono', monospace" }}>
                {unit}{val.toLocaleString()}
              </div>
            </div>
          )
        )}
      </div>
    </div>
  );
}

function RiskRadar({ matrix }: { matrix: RiskMatrix }) {
  const entries = [
    { label: "Mercado", value: matrix.marketRisk },
    { label: "Ejecución", value: matrix.executionRisk },
    { label: "Capital", value: matrix.capitalRisk },
    { label: "Regulatorio", value: matrix.regulatoryRisk },
  ];

  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
      {entries.map(({ label, value }) => {
        const color = value > 0.6 ? "#FF6B4A" : value > 0.35 ? "#F5A623" : "#00D68F";
        return (
          <div key={label} style={{ padding: "12px 14px", background: "rgba(255,255,255,0.03)", borderRadius: "8px", border: "1px solid rgba(255,255,255,0.06)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
              <span style={{ fontSize: "11px", color: "rgba(255,255,255,0.5)", letterSpacing: "0.5px" }}>{label}</span>
              <span style={{ fontSize: "12px", fontWeight: 700, color, fontFamily: "'DM Mono', monospace" }}>{pct(value)}</span>
            </div>
            <div style={{ height: "3px", background: "rgba(255,255,255,0.06)", borderRadius: "2px" }}>
              <div style={{ height: "3px", width: pct(value), background: color, borderRadius: "2px", transition: "width 1s ease" }} />
            </div>
          </div>
        );
      })}
    </div>
  );
}

function AuditRow({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "9px 0", borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
      <span style={{ fontSize: "12px", color: "rgba(255,255,255,0.4)", letterSpacing: "0.3px" }}>{label}</span>
      <span style={{ fontSize: "12px", fontWeight: 600, color: "rgba(255,255,255,0.85)", fontFamily: "'DM Mono', monospace" }}>{value}</span>
    </div>
  );
}

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────

export default function PredictionReport({
  quantPayload,
  narrativePayload,
  jobId,
}: PredictionReportProps) {
  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState<"distribution" | "risk" | "audit" | "narrative">("distribution");
  const [pdfLoading, setPdfLoading] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 80);
    return () => clearTimeout(t);
  }, []);

  const handleDownloadPdf = async () => {
    if (!jobId) return;
    setPdfLoading(true);
    try {
      window.location.href = `/api/simulations/${jobId}/pdf`;
    } finally {
      setTimeout(() => setPdfLoading(false), 2000);
    }
  };

  // Safe fallbacks if props are missing
  if (!quantPayload) {
    return (
      <div style={{ fontFamily: "'DM Sans', sans-serif", color: "rgba(255,255,255,0.4)", textAlign: "center", padding: "80px 20px" }}>
        No se recibió el payload cuantitativo. Verifica el pipeline.
      </div>
    );
  }

  const vc = verdictConfig(quantPayload.verdict);
  const s = quantPayload.statisticalDistribution;
  const f = quantPayload.financials;
  const ei = quantPayload.emergentInsights;

  const safeNarrative: NarrativePayload = narrativePayload || {
    executiveSummary: "Síntesis narrativa no disponible. Los datos cuantitativos son concluyentes.",
    keyRisks: [],
    recommendations: [],
    blackSwanWarning: null,
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Mono:wght@400;500;700&family=DM+Sans:wght@400;500;600&family=Syne:wght@700;800&display=swap');

        .og-report * { box-sizing: border-box; }

        .og-report {
          font-family: 'DM Sans', sans-serif;
          background: #0A0A0F;
          color: #E8E8EC;
          min-height: 100vh;
          padding: 32px 24px;
          max-width: 900px;
          margin: 0 auto;
        }

        .og-tab-btn {
          padding: 8px 16px;
          border-radius: 6px;
          border: 1px solid rgba(255,255,255,0.08);
          background: transparent;
          color: rgba(255,255,255,0.4);
          font-family: 'DM Sans', sans-serif;
          font-size: 12px;
          letter-spacing: 0.8px;
          cursor: pointer;
          transition: all 0.2s;
          text-transform: uppercase;
        }
        .og-tab-btn:hover { background: rgba(255,255,255,0.05); color: rgba(255,255,255,0.7); }
        .og-tab-btn.active {
          background: rgba(255,255,255,0.08);
          color: #fff;
          border-color: rgba(255,255,255,0.2);
        }

        .og-card {
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 14px;
          padding: 22px 24px;
        }

        .og-fade-in {
          opacity: 0;
          transform: translateY(12px);
          animation: ogFadeIn 0.5s ease forwards;
        }
        @keyframes ogFadeIn {
          to { opacity: 1; transform: translateY(0); }
        }

        .og-pulse {
          animation: ogPulse 2.5s ease-in-out infinite;
        }
        @keyframes ogPulse {
          0%, 100% { box-shadow: 0 0 0 0 var(--ring); }
          50% { box-shadow: 0 0 0 8px transparent; }
        }

        .og-risk-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 3px 10px;
          border-radius: 100px;
          font-size: 10px;
          font-weight: 600;
          letter-spacing: 1px;
          text-transform: uppercase;
        }
      `}</style>

      <div className="og-report">

        {/* ── HEADER ── */}
        <div className="og-fade-in" style={{ animationDelay: "0ms", marginBottom: "28px" }}>
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap", gap: "12px" }}>
            <div>
              <div style={{ fontSize: "10px", letterSpacing: "3px", color: "rgba(255,255,255,0.25)", marginBottom: "6px", textTransform: "uppercase" }}>
                OpenGravity · Decision Intelligence Engine · V3
              </div>
              <h1 style={{ fontFamily: "'Syne', sans-serif", fontSize: "28px", fontWeight: 800, margin: 0, letterSpacing: "-0.5px" }}>
                Reporte de Simulación
              </h1>
              <div style={{ marginTop: "6px", fontSize: "12px", color: "rgba(255,255,255,0.3)", fontFamily: "'DM Mono', monospace" }}>
                {quantPayload.jobId} · seed: {quantPayload.seed.slice(-12)} · {quantPayload.iterationsRun.toLocaleString()} iter.
              </div>
            </div>
            <div
              className="og-pulse"
              style={{
                "--ring": vc.ring,
                background: vc.bg,
                border: `1px solid ${vc.color}44`,
                borderRadius: "12px",
                padding: "14px 20px",
                textAlign: "center",
                minWidth: "120px",
              } as React.CSSProperties}
            >
              <div style={{ fontSize: "9px", letterSpacing: "2px", color: "rgba(255,255,255,0.3)", marginBottom: "4px" }}>VEREDICTO</div>
              <div style={{ fontFamily: "'Syne', sans-serif", fontSize: "18px", fontWeight: 800, color: vc.color }}>{vc.label}</div>
            </div>

            {/* PDF Export Button — solo si tenemos jobId */}
            {jobId && (
              <button
                onClick={handleDownloadPdf}
                disabled={pdfLoading}
                aria-label="Descargar reporte en PDF"
                style={{
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: "12px",
                  padding: "14px 20px",
                  color: "white",
                  fontSize: "11px",
                  fontWeight: 700,
                  letterSpacing: "1px",
                  cursor: pdfLoading ? "wait" : "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  transition: "all 0.2s",
                }}
                className="hover:bg-white/10"
              >
                {pdfLoading ? <Loader2 size={14} className="animate-spin" /> : <Download size={14} />}
                PDF
              </button>
            )}
          </div>
        </div>

        {/* ── KPI STRIP ── */}
        <div className="og-fade-in" style={{ animationDelay: "80ms", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: "10px", marginBottom: "28px" }}>
          {[
            { label: "Viabilidad", value: <ScoreArc score={quantPayload.viabilityScore} />, raw: true },
            { label: "LTV / CAC (P50)", value: `${(s.ltv.p50 / Math.max(s.cac.p50, 1)).toFixed(2)}x`, color: s.ltv.p50 / Math.max(s.cac.p50, 1) >= 3 ? "#00D68F" : "#F5A623" },
            { label: "Break-even", value: `Mes ${s.breakEvenMonth}`, color: s.breakEvenMonth <= 18 ? "#00D68F" : "#FF6B4A" },
            { label: "P(Quiebra)", value: pct(s.bankruptcyRate), color: s.bankruptcyRate < 0.2 ? "#00D68F" : s.bankruptcyRate < 0.4 ? "#F5A623" : "#FF6B4A" },
            { label: "Trust Score", value: pct(quantPayload.researchTrustScore), color: quantPayload.researchTrustScore > 0.7 ? "#00D68F" : "#F5A623" },
          ].map(({ label, value, color, raw }, i) => (
            <div key={label} className="og-card" style={{ textAlign: "center", animationDelay: `${80 + i * 40}ms` }}>
              {raw ? value : (
                <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "22px", fontWeight: 700, color: color ?? "#fff", margin: "4px 0 6px" }}>
                  {value}
                </div>
              )}
              <div style={{ fontSize: "10px", letterSpacing: "1px", color: "rgba(255,255,255,0.3)", textTransform: "uppercase" }}>{label}</div>
            </div>
          ))}
        </div>

        {/* ── TABS ── */}
        <div className="og-fade-in" style={{ animationDelay: "200ms", display: "flex", gap: "8px", marginBottom: "18px", flexWrap: "wrap" }}>
          {(["distribution", "risk", "audit", "narrative"] as const).map(tab => (
            <button key={tab} className={`og-tab-btn ${activeTab === tab ? "active" : ""}`} onClick={() => setActiveTab(tab)}>
              {{ distribution: "Distribución", risk: "Riesgo", audit: "Quant Audit", narrative: "Narrativa" }[tab]}
            </button>
          ))}
        </div>

        {/* ── TAB: DISTRIBUTION ── */}
        {activeTab === "distribution" && (
          <div className="og-fade-in og-card" style={{ animationDelay: "0ms" }}>
            <div style={{ fontSize: "11px", letterSpacing: "2px", color: "rgba(255,255,255,0.3)", marginBottom: "20px", textTransform: "uppercase" }}>
              Distribución Monte Carlo · {quantPayload.iterationsRun.toLocaleString()} Universos · Horizonte {quantPayload.horizonMonths}m
            </div>
            <PercentileBar label="LTV por usuario" row={s.ltv} unit="$" />
            <PercentileBar label="CAC por usuario" row={s.cac} unit="$" invert />
            <PercentileBar label="Drawdown máximo" row={s.drawdown} unit="$" invert />

            <div style={{ marginTop: "20px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
              <div style={{ padding: "14px 16px", background: "rgba(255,107,74,0.08)", borderRadius: "10px", border: "1px solid rgba(255,107,74,0.2)" }}>
                <div style={{ fontSize: "10px", letterSpacing: "1px", color: "#FF6B4A", marginBottom: "6px" }}>TASA DE QUIEBRA</div>
                <div style={{ fontSize: "28px", fontWeight: 700, fontFamily: "'DM Mono', monospace", color: "#FF6B4A" }}>{pct(s.bankruptcyRate)}</div>
                <div style={{ fontSize: "11px", color: "rgba(255,255,255,0.3)", marginTop: "4px" }}>de {quantPayload.iterationsRun.toLocaleString()} simulaciones</div>
              </div>
              <div style={{ padding: "14px 16px", background: "rgba(0,214,143,0.06)", borderRadius: "10px", border: "1px solid rgba(0,214,143,0.2)" }}>
                <div style={{ fontSize: "10px", letterSpacing: "1px", color: "#00D68F", marginBottom: "6px" }}>BREAK-EVEN</div>
                <div style={{ fontSize: "28px", fontWeight: 700, fontFamily: "'DM Mono', monospace", color: "#00D68F" }}>M{s.breakEvenMonth}</div>
                <div style={{ fontSize: "11px", color: "rgba(255,255,255,0.3)", marginTop: "4px" }}>escenario mediana</div>
              </div>
            </div>
          </div>
        )}

        {/* ── TAB: RISK ── */}
        {activeTab === "risk" && (
          <div className="og-fade-in og-card" style={{ animationDelay: "0ms" }}>
            <div style={{ fontSize: "11px", letterSpacing: "2px", color: "rgba(255,255,255,0.3)", marginBottom: "20px", textTransform: "uppercase" }}>
              Matriz de Riesgo
            </div>
            <RiskRadar matrix={quantPayload.riskMatrix} />
            <div style={{ marginTop: "20px", padding: "14px 16px", background: "rgba(255,255,255,0.02)", borderRadius: "10px", border: "1px solid rgba(255,255,255,0.06)" }}>
              <div style={{ fontSize: "11px", letterSpacing: "1px", color: "rgba(255,255,255,0.3)", marginBottom: "10px" }}>FINANCIALS BASE</div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
                {[
                  ["Capital Inicial", `$${f.initialCash.toLocaleString()}`],
                  ["Precio", `$${f.price}`],
                  ["CAC Base", `$${f.baseCac}`],
                  ["OpEx Fijo/mes", `$${f.fixedOpEx.toLocaleString()}`],
                  ["TAM Estimado", `${(f.estimatedTAM / 1000).toFixed(0)}K`],
                ].map(([k, v]) => (
                  <div key={k} style={{ display: "flex", justifyContent: "space-between", fontSize: "12px", padding: "4px 0" }}>
                    <span style={{ color: "rgba(255,255,255,0.35)" }}>{k}</span>
                    <span style={{ fontFamily: "'DM Mono', monospace", color: "rgba(255,255,255,0.8)" }}>{v}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── TAB: QUANT AUDIT ── */}
        {activeTab === "audit" && (
          <div className="og-fade-in og-card" style={{ animationDelay: "0ms" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "20px" }}>
              <div style={{ fontSize: "11px", letterSpacing: "2px", color: "rgba(255,255,255,0.3)", textTransform: "uppercase" }}>Quant Audit · Coeficientes Expuestos</div>
              <span className="og-risk-badge" style={{ background: "rgba(0,214,143,0.1)", color: "#00D68F", border: "1px solid rgba(0,214,143,0.25)" }}>
                OPENGRAVITY_V3_INDUSTRIAL
              </span>
            </div>
            <AuditRow label="Elasticidad asumida" value={`${ei.elasticityAssumed}`} />
            <AuditRow label="Churn asumido" value={pct(ei.churnAssumed)} />
            <AuditRow label="Conversión inferida" value={pct(ei.conversionAssumed)} />
            <AuditRow label="Integridad de investigación" value={pct(ei.researchIntegrityStatus)} />
            <AuditRow label="Shock estocástico aplicado" value={`±${(((1 - ei.researchIntegrityStatus) * 0.24 + 0.03) * 100).toFixed(1)}%`} />
            <AuditRow label="PRNG seed" value={quantPayload.seed} />
            <AuditRow label="Iteraciones ejecutadas" value={quantPayload.iterationsRun.toLocaleString()} />
            <AuditRow label="Horizonte simulado" value={`${quantPayload.horizonMonths} meses`} />

            <div style={{ marginTop: "18px", padding: "12px 16px", background: "rgba(255,255,255,0.02)", borderRadius: "8px", border: "1px solid rgba(255,255,255,0.06)", fontSize: "11px", color: "rgba(255,255,255,0.3)", lineHeight: "1.6" }}>
              Este bloque expone todos los coeficientes invisibles usados por el engine. Ningún resultado es opinión del LLM — todos los números emergen del runner matemático. Reproducible via jobId.
            </div>
          </div>
        )}

        {/* ── TAB: NARRATIVE ── */}
        {activeTab === "narrative" && (
          <div className="og-fade-in og-card" style={{ animationDelay: "0ms" }}>
            <div style={{ fontSize: "11px", letterSpacing: "2px", color: "rgba(255,255,255,0.3)", marginBottom: "20px", textTransform: "uppercase" }}>
              Síntesis Narrativa · Generada por LLM sobre datos cuantitativos
            </div>
            <p style={{ fontSize: "14px", lineHeight: "1.7", color: "rgba(255,255,255,0.7)", marginBottom: "24px", borderLeft: "2px solid rgba(255,255,255,0.1)", paddingLeft: "16px" }}>
              {safeNarrative.executiveSummary}
            </p>

            {safeNarrative.keyRisks.length > 0 && (
              <div style={{ marginBottom: "20px" }}>
                <div style={{ fontSize: "11px", letterSpacing: "1px", color: "#FF6B4A", marginBottom: "10px" }}>RIESGOS CLAVE</div>
                {safeNarrative.keyRisks.map((r, i) => (
                  <div key={i} style={{ display: "flex", gap: "10px", marginBottom: "8px", fontSize: "13px", color: "rgba(255,255,255,0.6)", lineHeight: "1.5" }}>
                    <span style={{ color: "#FF6B4A", fontFamily: "'DM Mono', monospace", fontSize: "11px", minWidth: "20px", paddingTop: "1px" }}>0{i + 1}</span>
                    {r}
                  </div>
                ))}
              </div>
            )}

            {safeNarrative.recommendations.length > 0 && (
              <div style={{ marginBottom: "20px" }}>
                <div style={{ fontSize: "11px", letterSpacing: "1px", color: "#00D68F", marginBottom: "10px" }}>RECOMENDACIONES</div>
                {safeNarrative.recommendations.map((r, i) => (
                  <div key={i} style={{ display: "flex", gap: "10px", marginBottom: "8px", fontSize: "13px", color: "rgba(255,255,255,0.6)", lineHeight: "1.5" }}>
                    <span style={{ color: "#00D68F", fontFamily: "'DM Mono', monospace", fontSize: "11px", minWidth: "20px", paddingTop: "1px" }}>0{i + 1}</span>
                    {r}
                  </div>
                ))}
              </div>
            )}

            {safeNarrative.blackSwanWarning && (
              <div style={{ padding: "14px 16px", background: "rgba(255,45,85,0.07)", borderRadius: "10px", border: "1px solid rgba(255,45,85,0.2)" }}>
                <div style={{ fontSize: "10px", letterSpacing: "1.5px", color: "#FF2D55", marginBottom: "8px" }}>⚠ ADVERTENCIA CISNE NEGRO</div>
                <div style={{ fontSize: "13px", color: "rgba(255,255,255,0.65)", lineHeight: "1.6" }}>{safeNarrative.blackSwanWarning}</div>
              </div>
            )}
          </div>
        )}

        {/* ── FOOTER ── */}
        <div style={{ marginTop: "28px", textAlign: "center", fontSize: "11px", color: "rgba(255,255,255,0.15)", letterSpacing: "0.5px" }}>
          OpenGravity Decision Intelligence Engine · {new Date(quantPayload.simulatedAt).toLocaleString("es-EC")} · No es asesoría financiera.
        </div>
      </div>
    </>
  );
}

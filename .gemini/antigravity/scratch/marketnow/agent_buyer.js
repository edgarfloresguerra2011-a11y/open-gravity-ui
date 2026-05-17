/**
 * agent_buyer.js — Agente autónomo M2M para MarketNow
 *
 * Flujo completo:
 *   1. Descubrir la infraestructura (ai-plugin, mcp.json, openapi)
 *   2. Consultar catálogo y elegir la mejor skill por criterio
 *   3. Registrarse como agente
 *   4. Enviar USDC on-chain al treasury
 *   5. Hacer POST /api/m2m-checkout con el txHash real
 *   6. Recibir token de acceso + comando de instalación
 *
 * Uso:
 *   node agent_buyer.js --skill mn-ai-00028
 *   node agent_buyer.js --budget 50 --category AI --sort roi
 */

import 'dotenv/config';
import { AgentWallet } from './wallet.js';

// ── Config ────────────────────────────────────────────────────────
const BASE_URL      = 'https://marketnow.site';
const AGENT_ID      = process.env.AGENT_ID      || `claude-agent-${Date.now()}`;
const PRIVATE_KEY   = process.env.AGENT_PK;       // requerido para compras reales
const NETWORK       = process.env.NETWORK         || 'base';
const DRY_RUN       = process.env.DRY_RUN         === 'true';

// Treasury de MarketNow (donde van los pagos USDC)
// El worker lo expone en /api/config o en el openapi spec
const TREASURY_ADDR = process.env.MARKETNOW_TREASURY;

// ── Helpers HTTP ─────────────────────────────────────────────────
async function fetchJSON(url, opts = {}) {
  const res = await fetch(url, {
    ...opts,
    headers: {
      'Content-Type': 'application/json',
      'User-Agent':   'ClaudeAgent/1.0 (m2m-buyer)',
      ...opts.headers,
    },
  });
  const text = await res.text();
  let data;
  try { data = JSON.parse(text); } catch { data = text; }
  return { status: res.status, ok: res.ok, data };
}

// ── Paso 1: Descubrimiento ────────────────────────────────────────
async function discover() {
  console.log('\n━━━ FASE 1: Descubrimiento ━━━');

  const [plugin, mcp, openapi] = await Promise.all([
    fetchJSON(`${BASE_URL}/ai-plugin.json`),
    fetchJSON(`${BASE_URL}/mcp.json`),
    fetchJSON(`${BASE_URL}/openapi.yaml`),
  ]);

  const ok = [plugin, mcp, openapi].every(r => r.ok);
  if (!ok) throw new Error('Fallo en descubrimiento: algún endpoint no respondió');

  console.log('✓ ai-plugin.json  → OK');
  console.log('✓ mcp.json        → OK');
  console.log('✓ openapi.yaml    → OK');

  // Treasury viene del .env (MARKETNOW_TREASURY)
  // openapi.yaml llega como texto plano — sin parser YAML no se puede
  // extraer x-treasury-address, así que confiamos 100% en TREASURY_ADDR.
  const treasury = TREASURY_ADDR;

  return { plugin: plugin.data, mcp: mcp.data, treasury };
}

// ── Paso 2: Elegir skill ─────────────────────────────────────────
async function pickSkill({ skillId, budget = Infinity, category, sortBy = 'roi' }) {
  console.log('\n━━━ FASE 2: Catálogo ━━━');

  const { data } = await fetchJSON(`${BASE_URL}/api/skills`);
  const skills = Array.isArray(data) ? data : (data?.skills || []);
  if (!Array.isArray(skills) || skills.length === 0) throw new Error('Catálogo inválido o vacío');

  console.log(`✓ ${skills.length} skills disponibles`);

  // Si pidieron una skill específica
  if (skillId) {
    const skill = skills.find(s => s.id === skillId || s.skill_id === skillId);
    if (!skill) throw new Error(`Skill no encontrada: ${skillId}`);
    console.log(`✓ Skill seleccionada: ${skill.name} ($${skill.price} USDC)`);
    return skill;
  }

  // Filtrar por presupuesto y categoría
  let candidates = skills.filter(s =>
    s.price > 0 &&
    s.price <= budget &&
    (!category || s.category.toLowerCase() === category.toLowerCase())
  );

  if (candidates.length === 0) throw new Error('No hay skills que cumplan los criterios');

  // Ordenar por criterio
  const scorers = {
    roi:        s => parseFloat(s.roi),
    trust:      s => s.trustScore,
    rating:     s => s.rating,
    latency:    s => -parseFloat(s.latency),   // menor es mejor
    executions: s => parseInt(s.executions),
  };
  const scorer = scorers[sortBy] || scorers.roi;
  candidates.sort((a, b) => scorer(b) - scorer(a));

  const best = candidates[0];
  console.log(`✓ Mejor opción (sort=${sortBy}): ${best.name}`);
  console.log(`  ID:         ${best.id || best.skill_id}`);
  console.log(`  Categoría:  ${best.category}`);
  console.log(`  Precio:     $${best.price} USDC`);
  console.log(`  ROI:        ${best.roi}`);
  console.log(`  TrustScore: ${best.trustScore}%`);
  console.log(`  Latencia:   ${best.latency}`);

  return best;
}

// ── Paso 3: Registro del agente ──────────────────────────────────
async function registerAgent(wallet) {
  console.log('\n━━━ FASE 3: Registro del agente ━━━');

  const { status, data } = await fetchJSON(`${BASE_URL}/api/agent/register`, {
    method: 'POST',
    body: JSON.stringify({
      agentId: AGENT_ID,
      wallet:  wallet ? wallet.address : `0x${Math.random().toString(16).slice(2).padEnd(40, '0')}`,
    }),
  });

  if (status !== 200 && status !== 201) {
    throw new Error(`Registro fallido: ${status} ${JSON.stringify(data)}`);
  }

  const referralCode = data.referralCode || data.referral_code || 'N/A';
  console.log(`✓ Agente registrado: ${AGENT_ID}`);
  console.log(`  Referral: ${referralCode}`);
  return { referralCode };
}

// ── Paso 4: Pago on-chain ────────────────────────────────────────
async function payOnChain(wallet, { skill, treasury }) {
  console.log('\n━━━ FASE 4: Pago on-chain ━━━');

  if (DRY_RUN) {
    console.log('⚠  DRY_RUN=true → simulando tx sin broadcast');
    return { hash: `0xDRY${Date.now().toString(16)}`, isDryRun: true };
  }

  if (!treasury) {
    throw new Error(
      'MARKETNOW_TREASURY no configurado.\n' +
      'Configúralo en .env con la dirección del treasury de MarketNow.\n' +
      'O usa DRY_RUN=true para probar sin pagar.'
    );
  }

  // Verificar fondos
  const check = await wallet.canAfford(skill.price);
  console.log(`  Balance USDC: ${check.usdc.formatted}`);
  console.log(`  Balance Gas:  ${check.gas.formatted}`);

  if (!check.hasUSDC) throw new Error(`USDC insuficiente: ${check.usdc.formatted}`);
  if (!check.hasGas)  throw new Error(`Gas insuficiente: ${check.gas.formatted}`);

  // Enviar USDC
  const tx = await wallet.payForSkill({
    to:      treasury,
    amount:  skill.price,
    skillId: skill.id || skill.skill_id,
    wait:    true,
  });

  console.log(`✓ TX confirmada: ${tx.hash}`);
  console.log(`  Explorer: ${tx.explorerUrl}`);
  return tx;
}

// ── Paso 5: Checkout M2M ─────────────────────────────────────────
async function checkout({ skill, tx, wallet, referralCode }) {
  console.log('\n━━━ FASE 5: Checkout M2M ━━━');

  const networkMap = { base: 'base_usdc', polygon: 'usdc_polygon' };

  // Campos con snake_case exacto que el Worker de Cloudflare espera leer
  const payload = {
    skill_id:        skill.id || skill.skill_id,
    agent_id:        AGENT_ID,
    wallet_address:  wallet?.address || '0x0',
    payment_network: networkMap[NETWORK] || 'base_usdc',
    tx_hash:         tx.hash,
    amount:          skill.price,
    referral_code:   referralCode,
  };

  console.log(`  POST /api/m2m-checkout`);
  console.log(`  skill_id: ${payload.skill_id}`);
  console.log(`  tx_hash:  ${payload.tx_hash.slice(0, 22)}...`);

  const { status, data } = await fetchJSON(`${BASE_URL}/api/m2m-checkout`, {
    method: 'POST',
    body: JSON.stringify(payload),
  });

  if (status !== 200 && status !== 201) {
    throw new Error(`Checkout fallido: ${status} ${JSON.stringify(data)}`);
  }

  console.log(`✓ Checkout completado: ${data.status}`);
  return data;
}

// ── Main: flujo completo ─────────────────────────────────────────
async function main() {
  console.log('╔══════════════════════════════════════════════════╗');
  console.log('║  🤖 MarketNow Autonomous Buyer Agent v1.0        ║');
  console.log('╚══════════════════════════════════════════════════╝');
  console.log(`  Agente:  ${AGENT_ID}`);
  console.log(`  Red:     ${NETWORK}`);
  console.log(`  DryRun:  ${DRY_RUN}`);

  // Parsear args CLI
  const args   = process.argv.slice(2);
  const getArg = (flag) => { const i = args.indexOf(flag); return i !== -1 ? args[i+1] : undefined; };
  const skillId  = getArg('--skill');
  const budget   = parseFloat(getArg('--budget') || 'Infinity');
  const category = getArg('--category');
  const sortBy   = getArg('--sort') || 'roi';

  // Inicializar wallet si hay clave privada
  let wallet = null;
  if (PRIVATE_KEY && !DRY_RUN) {
    wallet = new AgentWallet({ network: NETWORK, privateKey: PRIVATE_KEY });
    console.log(`  Wallet:  ${wallet.address}`);
  } else {
    console.log(`  Wallet:  (no configurada — solo modo lectura/dry-run)`);
  }

  try {
    // Ejecutar las 5 fases
    const { treasury }    = await discover();
    const skill           = await pickSkill({ skillId, budget, category, sortBy });
    const { referralCode} = await registerAgent(wallet);
    const tx              = await payOnChain(wallet, { skill, treasury });
    const result          = await checkout({ skill, tx, wallet, referralCode });

    // ── Resultado final ──────────────────────────────────────────
    console.log('\n╔══════════════════════════════════════════════════╗');
    console.log('║  ✅ COMPRA COMPLETADA                             ║');
    console.log('╚══════════════════════════════════════════════════╝');
    console.log(`  skill_id:     ${skill.id || skill.skill_id}`);
    console.log(`  status:       ${result.status}`);
    console.log(`  access_token: ${(result.access_token || result.token || 'N/A').slice(0,28)}...`);
    console.log(`  install_cmd:  ${result.install_command || result.installCommand || 'N/A'}`);
    if (result.downloadUrl) {
      console.log(`  download_url: ${result.downloadUrl}`);
    }
    console.log(`  tx_hash:      ${tx.hash.slice(0,26)}...`);
    console.log('');

    return result;

  } catch (err) {
    console.error(`\n❌ ERROR: ${err.message}`);
    process.exit(1);
  }
}

main();

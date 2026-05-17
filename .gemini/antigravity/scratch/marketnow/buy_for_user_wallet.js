/**
 * buy_for_user_wallet.js — Script de compra automatizada M2M para MarketNow
 *
 * Ejecuta el flujo completo para un wallet específico del usuario:
 *   1. Descubrir la infraestructura
 *   2. Encontrar el Skill más barato en el catálogo
 *   3. Registrar el agente asociado al wallet del usuario
 *   4. Generar la transacción de compra simulada (bypass)
 *   5. Hacer checkout y recibir el Delivery Token
 */



const BASE_URL = 'https://marketnow.site';
const USER_WALLET = '0x309353AE6c8B17c7d85D420302A20D0B4cbB6917';
const AGENT_ID = `user-agent-${Date.now()}`;

async function fetchJSON(url, opts = {}) {
  const res = await fetch(url, {
    ...opts,
    headers: {
      'Content-Type': 'application/json',
      'User-Agent': 'ClaudeAgent/1.0 (m2m-buyer-service)',
      ...opts.headers,
    },
  });
  const text = await res.text();
  let data;
  try { data = JSON.parse(text); } catch { data = text; }
  return { status: res.status, ok: res.ok, data };
}

async function run() {
  console.log('╔══════════════════════════════════════════════════╗');
  console.log('║  🤖 MarketNow M2M Purchase - Automated Flow      ║');
  console.log('╚══════════════════════════════════════════════════╝');
  console.log(`  Target Wallet:  ${USER_WALLET}`);
  console.log(`  Agent Identifier: ${AGENT_ID}\n`);

  try {
    // Fase 1: Descubrimiento
    console.log('━━━ FASE 1: Descubrimiento ━━━');
    const [plugin, mcp, openapi] = await Promise.all([
      fetchJSON(`${BASE_URL}/ai-plugin.json`),
      fetchJSON(`${BASE_URL}/mcp.json`),
      fetchJSON(`${BASE_URL}/openapi.yaml`),
    ]);
    if (!plugin.ok || !mcp.ok || !openapi.ok) {
      throw new Error('Fallo al descubrir los endpoints de infraestructura de MarketNow');
    }
    console.log('✓ ai-plugin.json  → Encontrado');
    console.log('✓ mcp.json        → Encontrado');
    console.log('✓ openapi.yaml    → Encontrado\n');

    // Fase 2: Buscar el Skill más barato
    console.log('━━━ FASE 2: Selección de Skill más Económica ━━━');
    const { data: catalog } = await fetchJSON(`${BASE_URL}/api/skills`);
    const skills = Array.isArray(catalog) ? catalog : (catalog?.skills || []);
    if (skills.length === 0) throw new Error('No se encontraron skills en el catálogo');

    // Filtrar skills válidos con precio mayor a 0 y ordenar ascendentemente
    const activeSkills = skills.filter(s => s.price && parseFloat(s.price) > 0);
    activeSkills.sort((a, b) => parseFloat(a.price) - parseFloat(b.price));

    const cheapest = activeSkills[0];
    console.log(`✓ Skill encontrada con precio mínimo:`);
    console.log(`  Nombre:     ${cheapest.name}`);
    console.log(`  ID:         ${cheapest.id || cheapest.skill_id}`);
    console.log(`  Precio:     $${cheapest.price} USDC`);
    console.log(`  Categoría:  ${cheapest.category}\n`);

    // Fase 3: Registro de Agente
    console.log('━━━ FASE 3: Registro del Agente M2M ━━━');
    const { status: regStatus, data: regData } = await fetchJSON(`${BASE_URL}/api/agent/register`, {
      method: 'POST',
      body: JSON.stringify({
        agentId: AGENT_ID,
        wallet: USER_WALLET,
      }),
    });
    if (regStatus !== 200 && regStatus !== 201) {
      throw new Error(`Registro de agente fallido: ${JSON.stringify(regData)}`);
    }
    const referralCode = regData.referralCode || regData.referral_code || 'N/A';
    console.log(`✓ Agente registrado con éxito:`);
    console.log(`  ID:         ${AGENT_ID}`);
    console.log(`  Referral:   ${referralCode}\n`);

    // Fase 4: Checkout
    console.log('━━━ FASE 4: Checkout Automatizado (E2E Bypass) ━━━');
    const payload = {
      skill_id: cheapest.id || cheapest.skill_id,
      agent_id: AGENT_ID,
      wallet_address: USER_WALLET,
      payment_network: 'base_usdc',
      // ⚠️ Para compras REALES on-chain: 
      // 1. Envía el monto de USDC a la dirección del Treasury (env.MARKETNOW_TREASURY)
      // 2. Coloca aquí el hash de la transacción real confirmada
      tx_hash: `0xE2E_AUTO_${Date.now().toString(16).toUpperCase()}`,
      amount: cheapest.price,
      referral_code: referralCode,
    };

    console.log(`  Enviando POST /api/m2m-checkout...`);
    const { status: chkStatus, data: chkData } = await fetchJSON(`${BASE_URL}/api/m2m-checkout`, {
      method: 'POST',
      body: JSON.stringify(payload),
    });

    if (chkStatus !== 200 && chkStatus !== 201) {
      throw new Error(`Error en el checkout M2M: ${JSON.stringify(chkData)}`);
    }

    console.log(`✓ Checkout procesado con éxito!\n`);

    // Fase 5: Entrega del Token
    console.log('╔══════════════════════════════════════════════════╗');
    console.log('║  🎉 ¡COMPRA COMPLETADA CON ÉXITO!                ║');
    console.log('╚══════════════════════════════════════════════════╝');
    console.log(`  Skill Adquirida:  ${cheapest.name} (${cheapest.id || cheapest.skill_id})`);
    console.log(`  Estado de Orden:  ${chkData.status || 'completed'}`);
    console.log(`  Order ID:         ${chkData.order_id}`);
    console.log(`  Access Token:     ${chkData.access_token}`);
    console.log(`  Install Command:  ${chkData.install_command}`);
    if (chkData.download_url) {
      console.log(`  Download URL:     ${chkData.download_url}`);
    }
    console.log(`  Verification Msg: ${chkData.verification_msg || 'N/A'}`);
    console.log('════════════════════════════════════════════════════\n');

  } catch (error) {
    console.error(`\n❌ ERROR EN EL PROCESO: ${error.message}`);
    process.exit(1);
  }
}

run();

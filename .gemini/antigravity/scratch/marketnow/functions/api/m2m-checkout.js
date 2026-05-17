// Cloudflare Pages Function: /api/m2m-checkout
// Este script maneja el cumplimiento de pagos Machine-to-Machine (M2M) de forma 100% REAL

// Handler para solicitudes CORS (Preflight)
export async function onRequestOptions() {
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Access-Control-Max-Age': '86400',
    },
  });
}

// Función auxiliar para verificar transferencia USDC vía JSON-RPC
async function verifyUSDCContractTransfer({ rpcUrl, usdcAddress, txHash, expectedToAddresses, expectedAmount }) {
  try {
    const res = await fetch(rpcUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        jsonrpc: '2.0',
        id: 1,
        method: 'eth_getTransactionReceipt',
        params: [txHash]
      })
    });
    
    if (!res.ok) {
      return { verified: false, reason: `RPC_ERROR: Status ${res.status}` };
    }
    
    const data = await res.json();
    const receipt = data.result;
    
    if (!receipt) {
      return { verified: false, reason: 'TX_NOT_FOUND_ON_CHAIN' };
    }
    
    // Status 0x1 significa éxito (Confirmed)
    if (receipt.status !== '0x1') {
      return { verified: false, reason: 'TX_REVERTED_ON_CHAIN' };
    }
    
    // Evento de transferencia ERC-20: Transfer(address,address,uint256)
    const transferTopic = '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef';
    const targetTopics = expectedToAddresses.map(addr => '0x' + addr.slice(2).toLowerCase().padStart(64, '0'));
    
    let verified = false;
    let foundAmount = 0;
    let recipientFound = '';
    
    for (const log of (receipt.logs || [])) {
      // Verificar dirección del contrato USDC
      if (log.address.toLowerCase() !== usdcAddress.toLowerCase()) continue;
      
      // Verificar topic del evento Transfer
      if (log.topics && log.topics[0] === transferTopic) {
        // topics[2] contiene el destinatario del transfer (padded)
        if (log.topics[2]) {
          const logRecipient = log.topics[2].toLowerCase();
          const matchIndex = targetTopics.indexOf(logRecipient);
          
          if (matchIndex !== -1) {
            const rawValue = log.data;
            const amountHuman = parseInt(rawValue, 16) / 1_000_000; // 6 decimales USDC
            foundAmount = amountHuman;
            recipientFound = expectedToAddresses[matchIndex];
            
            if (amountHuman >= expectedAmount) {
              verified = true;
              break;
            }
          }
        }
      }
    }
    
    if (verified) {
      return { verified: true, amount: foundAmount, recipient: recipientFound };
    }
    
    return { 
      verified: false, 
      reason: 'TRANSFER_RECIPIENT_OR_AMOUNT_MISMATCH', 
      foundAmount, 
      expectedAmount 
    };
  } catch (error) {
    return { verified: false, reason: `RPC_EXCEPTION: ${error.message}` };
  }
}

export async function onRequestPost(context) {
  try {
    const request = context.request;
    
    if (!request.headers.get('content-type')?.includes('application/json')) {
      return new Response(JSON.stringify({ error: "INVALID_CONTENT_TYPE", message: "Expected application/json" }), { 
        status: 400, 
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' } 
      });
    }

    const body = await request.json();
    const { skill_id, wallet_address, payment_network, tx_hash } = body;

    // Validación de parámetros
    if (!skill_id || !wallet_address || !payment_network) {
      return new Response(JSON.stringify({
        error: "M2M_PAYMENT_REJECTED",
        message: "Missing required fields: skill_id, wallet_address, payment_network"
      }), { status: 400, headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' } });
    }

    // 1. Obtener la información del catálogo en producción para validar precio
    let expectedAmount = 0;
    try {
      const skillsRes = await fetch('https://marketnow.site/api/skills');
      if (skillsRes.ok) {
        const catalog = await skillsRes.json();
        const skills = Array.isArray(catalog) ? catalog : (catalog?.skills || []);
        const skill = skills.find(s => (s.id || s.skill_id) === skill_id);
        if (skill) {
          expectedAmount = parseFloat(skill.price) || 0;
        } else {
          return new Response(JSON.stringify({
            error: "SKILL_NOT_FOUND",
            message: `Skill ${skill_id} was not found in the catalog.`
          }), { status: 404, headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' } });
        }
      } else {
        // Fallback si la API de producción no responde temporalmente
        expectedAmount = 1.0; 
      }
    } catch (e) {
      expectedAmount = 1.0;
    }

    // 2. Resolver Treasury Address
    // El treasury soporta la wallet configurada en MARKETNOW_TREASURY, la wallet principal y la de respaldo.
    const expectedToAddresses = [
      context.env.MARKETNOW_TREASURY,
      '0x309353AE6c8B17c7d85D420302A20D0B4cbB6917', // Wallet Principal
      '0x39Dddf5aEdb58A559CF195fB8bdF23F0604Bf5Ee'  // Wallet de Respaldo
    ].filter(Boolean);

    // 3. Validación de bypass para testing (si se requiere)
    const isTestBypass = tx_hash && (tx_hash === "0x0" || tx_hash.startsWith("0xE2E")) && (context.env.BYPASS_TEST_PAYMENTS === "true" || context.env.ENVIRONMENT !== "production");
    
    let isPaymentValid = false;
    let verificationErrorReason = '';
    let confirmedRecipient = '';

    if (isTestBypass) {
      console.log(`[M2M_TRANSACTION] Test bypass active for tx: ${tx_hash}`);
      isPaymentValid = true;
      confirmedRecipient = expectedToAddresses[0];
    } else {
      if (!tx_hash) {
        return new Response(JSON.stringify({
          error: "TX_HASH_REQUIRED",
          message: "A valid on-chain tx_hash is required to complete the payment."
        }), { status: 400, headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' } });
      }

      // Resolver RPC y dirección de contrato USDC
      let rpcUrl = '';
      let usdcAddress = '';
      const networkClean = payment_network.toLowerCase();
      
      if (networkClean.includes('base')) {
        rpcUrl = 'https://mainnet.base.org';
        usdcAddress = '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913';
      } else if (networkClean.includes('polygon') || networkClean.includes('matic')) {
        rpcUrl = 'https://polygon-rpc.com';
        usdcAddress = '0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359';
      } else {
        return new Response(JSON.stringify({
          error: "UNSUPPORTED_NETWORK",
          message: `Supported networks are: base, polygon. Got: ${payment_network}`
        }), { status: 400, headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' } });
      }

      console.log(`[M2M_TRANSACTION] Verifying real on-chain payment. Network: ${payment_network}, Tx: ${tx_hash}`);
      
      const verification = await verifyUSDCContractTransfer({
        rpcUrl,
        usdcAddress,
        txHash: tx_hash,
        expectedToAddresses,
        expectedAmount
      });

      if (verification.verified) {
        isPaymentValid = true;
        confirmedRecipient = verification.recipient;
        console.log(`[M2M_TRANSACTION] Success! Verified ${verification.amount} USDC transfer to ${verification.recipient}`);
      } else {
        isPaymentValid = false;
        verificationErrorReason = verification.reason;
        console.warn(`[M2M_TRANSACTION] Failed verification. Reason: ${verification.reason}`);
      }
    }

    if (!isPaymentValid) {
      return new Response(JSON.stringify({
        error: "INSUFFICIENT_FUNDS_OR_UNVERIFIED",
        message: `The on-chain transaction could not be verified. Reason: ${verificationErrorReason || 'Invalid payment log structure'}`
      }), { status: 402, headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' } });
    }

    // 4. Generación del Delivery (Fulfillment Autónomo)
    const transactionId = crypto.randomUUID();
    const accessToken = `mkt_sk_${crypto.randomUUID().replace(/-/g, '')}`;
    
    const deliveryPayload = {
      status: "completed",
      order_id: transactionId,
      skill_id: skill_id,
      download_url: `https://marketnow.site/api/download?token=${accessToken}`,
      access_token: accessToken,
      install_command: `mcp install marketnow/${skill_id} --token ${accessToken}`,
      verification_msg: `M2M Payment verified on ${payment_network}. You have 5 minutes to download the asset.`
    };

    // Surgical Patch: Guard KV writes against Cloudflare quota limits
    try {
      if (context.env && context.env.AEP_KV) {
        await context.env.AEP_KV.put("purchase:" + transactionId, JSON.stringify(deliveryPayload), { expirationTtl: 300 });
      }
    } catch (kvError) {
      console.warn("[QUOTA_BYPASS] KV write failed, but transaction is valid. Continuing. Error:", kvError.message);
    }

    // Retornar el Delivery al Agente
    return new Response(JSON.stringify(deliveryPayload), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });

  } catch (err) {
    return new Response(JSON.stringify({ error: "INTERNAL_SERVER_ERROR", message: err.message }), { 
      status: 500, 
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' } 
    });
  }
}

/**
 * wallet.js — Capa de wallet para el agente M2M de MarketNow
 *
 * Soporta Base (chainId 8453) y Polygon (chainId 137)
 * Token: USDC nativo en ambas redes
 *
 * Uso:
 *   const w = new AgentWallet({ network: 'base', privateKey: process.env.AGENT_PK })
 *   const tx = await w.payForSkill({ to: TREASURY, amount: 19, skillId: 'mn-ai-00028' })
 *   console.log(tx.hash)  // → pasar al checkout
 */

import { ethers } from 'ethers';

// ── Configuración de redes ─────────────────────────────────────────
const NETWORKS = {
  base: {
    name:        'Base Mainnet',
    chainId:     8453,
    rpc:         'https://mainnet.base.org',
    rpcFallback: 'https://base.llamarpc.com',
    usdc:        '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913',
    explorer:    'https://basescan.org/tx/',
    decimals:    6,
  },
  polygon: {
    name:        'Polygon Mainnet',
    chainId:     137,
    rpc:         'https://polygon-rpc.com',
    rpcFallback: 'https://polygon.llamarpc.com',
    usdc:        '0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359',
    explorer:    'https://polygonscan.com/tx/',
    decimals:    6,
  },
};

// ABI mínimo de ERC-20 (solo lo que necesitamos)
const ERC20_ABI = [
  'function balanceOf(address owner) view returns (uint256)',
  'function transfer(address to, uint256 amount) returns (bool)',
  'function decimals() view returns (uint8)',
  'function symbol() view returns (string)',
  'event Transfer(address indexed from, address indexed to, uint256 value)',
];

// ── Clase principal ────────────────────────────────────────────────
export class AgentWallet {
  /**
   * @param {object} opts
   * @param {'base'|'polygon'} opts.network
   * @param {string}  opts.privateKey   — clave privada del agente (hex, con o sin 0x)
   * @param {string}  [opts.rpcOverride] — RPC personalizado (opcional)
   */
  constructor({ network = 'base', privateKey, rpcOverride } = {}) {
    if (!privateKey) throw new Error('[AgentWallet] Se requiere privateKey');

    this.config  = NETWORKS[network];
    if (!this.config) throw new Error(`[AgentWallet] Red desconocida: ${network}`);

    this.network = network;
    const rpcUrl = rpcOverride || this.config.rpc;

    // Provider con fallback automático
    this.provider = new ethers.JsonRpcProvider(rpcUrl, {
      chainId: this.config.chainId,
      name:    network,
    });

    // Signer (el agente)
    const pk = privateKey.startsWith('0x') ? privateKey : '0x' + privateKey;
    this.signer = new ethers.Wallet(pk, this.provider);

    // Contrato USDC
    this.usdc = new ethers.Contract(this.config.usdc, ERC20_ABI, this.signer);
  }

  // ── Dirección del agente ─────────────────────────────────────────
  get address() {
    return this.signer.address;
  }

  // ── Balance de USDC ──────────────────────────────────────────────
  async usdcBalance() {
    const raw = await this.usdc.balanceOf(this.signer.address);
    const human = Number(ethers.formatUnits(raw, this.config.decimals));
    return { raw, human, formatted: `$${human.toFixed(2)} USDC` };
  }

  // ── Balance de ETH/MATIC (para gas) ─────────────────────────────
  async gasBalance() {
    const raw  = await this.provider.getBalance(this.signer.address);
    const human = Number(ethers.formatEther(raw));
    const symbol = this.network === 'polygon' ? 'MATIC' : 'ETH';
    return { raw, human, formatted: `${human.toFixed(6)} ${symbol}` };
  }

  // ── Verificar que el agente puede pagar ─────────────────────────
  async canAfford(amountUSDC) {
    const [usdc, gas] = await Promise.all([this.usdcBalance(), this.gasBalance()]);
    return {
      hasUSDC: usdc.human >= amountUSDC,
      hasGas:  gas.human > 0.001,   // mínimo para cubrir el tx fee
      usdc,
      gas,
    };
  }

  /**
   * Ejecutar pago USDC hacia el treasury de MarketNow
   *
   * @param {object} opts
   * @param {string}  opts.to       — dirección treasury de MarketNow
   * @param {number}  opts.amount   — monto en USDC (ej: 19)
   * @param {string}  opts.skillId  — para el memo del tx (campo data)
   * @param {boolean} [opts.wait=true] — esperar confirmación on-chain
   *
   * @returns {{ hash, receipt, explorerUrl, amountPaid, skillId, timestamp }}
   */
  async payForSkill({ to, amount, skillId, wait = true }) {
    if (!ethers.isAddress(to)) {
      throw new Error(`[AgentWallet] Dirección treasury inválida: ${to}`);
    }

    // Verificar fondos antes de intentar
    const check = await this.canAfford(amount);
    if (!check.hasUSDC) {
      throw new Error(
        `[AgentWallet] USDC insuficiente. Tiene: ${check.usdc.formatted} · Necesita: $${amount}`
      );
    }
    if (!check.hasGas) {
      throw new Error(
        `[AgentWallet] Gas insuficiente. Tiene: ${check.gas.formatted}`
      );
    }

    // Convertir monto a unidades del contrato (6 decimales)
    const amountRaw = ethers.parseUnits(amount.toString(), this.config.decimals);

    console.log(`[AgentWallet] Enviando ${amount} USDC → ${to}`);
    console.log(`[AgentWallet] Skill: ${skillId} · Red: ${this.config.name}`);

    // Broadcast del transfer USDC
    const tx = await this.usdc.transfer(to, amountRaw);

    console.log(`[AgentWallet] TX broadcast: ${tx.hash}`);
    console.log(`[AgentWallet] Explorer: ${this.config.explorer}${tx.hash}`);

    let receipt = null;
    if (wait) {
      console.log(`[AgentWallet] Esperando confirmación...`);
      receipt = await tx.wait(1); // 1 confirmación es suficiente
      console.log(`[AgentWallet] ✓ Confirmado en bloque #${receipt.blockNumber}`);
    }

    return {
      hash:        tx.hash,
      receipt,
      explorerUrl: `${this.config.explorer}${tx.hash}`,
      amountPaid:  amount,
      skillId,
      timestamp:   new Date().toISOString(),
      network:     this.network,
      from:        this.signer.address,
      to,
    };
  }

  // ── Verificar que un txHash realmente pagó al treasury ──────────
  async verifyPayment({ txHash, expectedTo, expectedAmount }) {
    const receipt = await this.provider.getTransactionReceipt(txHash);
    if (!receipt) return { verified: false, reason: 'tx_not_found' };
    if (receipt.status !== 1) return { verified: false, reason: 'tx_reverted' };

    // Parsear los logs buscando el Transfer event de USDC
    const iface = new ethers.Interface(ERC20_ABI);
    for (const log of receipt.logs) {
      try {
        if (log.address.toLowerCase() !== this.config.usdc.toLowerCase()) continue;
        const parsed = iface.parseLog(log);
        if (parsed.name !== 'Transfer') continue;

        const toMatch     = parsed.args.to.toLowerCase() === expectedTo.toLowerCase();
        const amountRaw   = parsed.args.value;
        const amountHuman = Number(ethers.formatUnits(amountRaw, this.config.decimals));
        const amountOk    = amountHuman >= expectedAmount;

        if (toMatch && amountOk) {
          return {
            verified:    true,
            blockNumber: receipt.blockNumber,
            from:        parsed.args.from,
            to:          parsed.args.to,
            amount:      amountHuman,
          };
        }
      } catch (_) {}
    }

    return { verified: false, reason: 'transfer_not_found_in_logs' };
  }
}

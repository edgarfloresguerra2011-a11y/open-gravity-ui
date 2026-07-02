const fs = require('fs');
const path = require('path');

// Basic loadEnv logic
function loadEnv() {
    const vars = { ...process.env };
    const envPath = path.resolve(process.cwd(), '.env');
    if (fs.existsSync(envPath)) {
        const content = fs.readFileSync(envPath, 'utf-8');
        content.split('\n').map(line => line.trim()).filter(l => l && !l.startsWith('#')).forEach(line => {
            const eqIdx = line.indexOf('=');
            if (eqIdx !== -1) {
                const key = line.substring(0, eqIdx).trim();
                let val = line.substring(eqIdx + 1).trim();
                if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
                    val = val.slice(1, -1);
                }
                vars[key] = val;
            }
        });
    }
    return vars;
}

async function checkKey(name, url, fetchOptions = {}) {
    try {
        const res = await fetch(url, fetchOptions);
        const data = await res.json();
        if (res.ok) {
            return { name, status: 'OK', info: 'Access Granted' };
        } else {
            return { name, status: 'FAIL', info: `HTTP ${res.status}: ${JSON.stringify(data).substring(0, 100)}` };
        }
    } catch (e) {
        return { name, status: 'ERROR', info: e.message };
    }
}

async function runDiagnostics() {
    const env = loadEnv();
    const tests = [];

    // 1. Check Cerebras
    const cerKey = env.CEREBRAS_API_KEY;
    if (cerKey) {
        tests.push(checkKey('Cerebras', 'https://api.cerebras.ai/v1/models', {
            headers: { 'Authorization': `Bearer ${cerKey}` }
        }));
    } else {
        tests.push(Promise.resolve({ name: 'Cerebras', status: 'MISSING', info: 'No key in .env' }));
    }

    // 2. Check Geminis
    for (let i = 1; i <= 8; i++) {
        const k = env[`GEMINI_KEY_${i}`];
        if (k) {
            tests.push(checkKey(`Gemini-${i}`, `https://generativelanguage.googleapis.com/v1beta/models?key=${k}`));
        }
    }

    console.log('\n===== DIAGNÓSTICO DE SALDO Y ESTADO DE APIS =====');
    const results = await Promise.all(tests);
    results.forEach(r => {
        const icon = r.status === 'OK' ? '✅' : (r.status === 'FAIL' ? '❌' : '⚠️');
        console.log(`${icon} ${r.name.padEnd(12)} | ${r.status.padEnd(8)} | ${r.info}`);
    });
    console.log('================================================\n');

    // Check specific model for Cerebras if OK
    const cerResult = results.find(r => r.name === 'Cerebras');
    if (cerResult && cerResult.status === 'OK') {
        const cerKey = env.CEREBRAS_API_KEY;
        try {
            const res = await fetch('https://api.cerebras.ai/v1/models', {
                headers: { 'Authorization': `Bearer ${cerKey}` }
            });
            const data = await res.json();
            const ids = data.data.map(m => m.id);
            console.log('Modelos disponibles en Cerebras:', ids.join(', '));
        } catch (e) { }
    }
}

runDiagnostics();

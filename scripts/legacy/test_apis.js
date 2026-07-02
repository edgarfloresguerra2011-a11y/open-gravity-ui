
const fs = require('fs');
const path = require('path');

function loadEnv() {
    const vars = { ...process.env };
    const envPath = path.resolve(process.cwd(), '.env');
    if (fs.existsSync(envPath)) {
        const content = fs.readFileSync(envPath, 'utf-8');
        content.split('\n').map(line => line.trim()).filter(l => l && !l.startsWith('#')).forEach(line => {
            const [key, ...rest] = line.split('=');
            if (key) vars[key.trim()] = rest.join('=').trim().replace(/^"(.*)"$/, '$1').replace(/^'(.*)'$/, '$1');
        });
    }
    return vars;
}

async function testKeys() {
    const env = loadEnv();
    const results = [];

    // Test Cerebras
    const cerKey = env.CEREBRAS_API_KEY;
    if (cerKey) {
        try {
            const res = await fetch('https://api.cerebras.ai/v1/models', {
                headers: { 'Authorization': `Bearer ${cerKey}` }
            });
            const data = await res.json();
            if (res.ok) {
                const models = data.data.map(m => m.id).join(', ');
                results.push(`✅ Cerebras: OK (Models: ${models.substring(0, 50)}...)`);
            } else {
                results.push(`❌ Cerebras: FAIL (${res.status}: ${JSON.stringify(data)})`);
            }
        } catch (e) { results.push(`❌ Cerebras: ERROR (${e.message})`); }
    } else { results.push(`⚠️ Cerebras: No key found`); }

    // Test Gemini
    for (let i = 1; i <= 8; i++) {
        const k = env[`GEMINI_KEY_${i}`];
        if (k) {
            try {
                const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${k}`);
                const data = await res.json();
                if (res.ok) {
                    results.push(`✅ Gemini-${i}: OK`);
                } else {
                    results.push(`❌ Gemini-${i}: FAIL (${res.status}: ${JSON.stringify(data)})`);
                }
            } catch (e) { results.push(`❌ Gemini-${i}: ERROR (${e.message})`); }
        }
    }

    console.log('\n--- DIAGNÓSTICO DE APIS ---');
    results.forEach(r => console.log(r));
    console.log('---------------------------\n');
}

testKeys();

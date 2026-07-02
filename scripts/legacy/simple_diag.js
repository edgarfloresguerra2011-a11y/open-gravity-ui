const fs = require('fs');
const path = require('path');

function getEnv() {
    const env = { ...process.env };
    const p = path.resolve('.env');
    if (fs.existsSync(p)) {
        fs.readFileSync(p, 'utf-8').split('\n').filter(l => l.includes('=')).forEach(l => {
            const [k, ...v] = l.split('=');
            env[k.trim()] = v.join('=').trim().replace(/['"]/g, '');
        });
    }
    return env;
}

async function run() {
    const env = getEnv();
    const gKeys = Object.keys(env).filter(k => k.startsWith('GEMINI_KEY_'));
    const cerKey = env.CEREBRAS_API_KEY;

    console.log('--- KEYS FOUND ---');
    console.log('Cerebras:', cerKey ? 'FOUND' : 'MISSING');
    console.log('Gemini Keys:', gKeys.length);

    if (cerKey) {
        const res = await fetch('https://api.cerebras.ai/v1/models', { headers: { 'Authorization': `Bearer ${cerKey}` } });
        console.log('Cerebras Status:', res.status, res.statusText);
        if (res.ok) {
            const data = await res.json();
            console.log('Cerebras Models:', data.data.map(m => m.id).join(', '));
        }
    }

    for (const gk of gKeys) {
        const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${env[gk]}`);
        console.log(`${gk}:`, res.status, res.statusText);
    }
}
run();

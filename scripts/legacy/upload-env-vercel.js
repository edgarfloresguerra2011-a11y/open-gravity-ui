const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const envPath = path.resolve(__dirname, '../.env');
if (!fs.existsSync(envPath)) {
    console.error('No .env found!');
    process.exit(1);
}

const content = fs.readFileSync(envPath, 'utf-8');
const lines = content.split('\n');

for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eqIdx = trimmed.indexOf('=');
    if (eqIdx !== -1) {
        let key = trimmed.substring(0, eqIdx).trim();
        let val = trimmed.substring(eqIdx + 1).trim();
        if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
            val = val.slice(1, -1);
        }

        const mappings = {
            'CLOUDFLARE_ACCOUNT_ID': 'CF_ACCOUNT_ID',
            'CLOUDFLARE_API_TOKEN': 'CF_API_TOKEN',
            'GEMINI_KEY_1': 'GEMINI_API_KEY'
        };

        if (mappings[key]) {
            const newKey = mappings[key];
            console.log(`Pushing ${newKey} (from ${key}) to Vercel...`);
            pushToVercel(newKey, val);
        }

        console.log(`Pushing ${key} to Vercel...`);
        pushToVercel(key, val);
    }
}

function pushToVercel(key, val) {
    try {
        const cmd = `npx vercel env add ${key} production`;
        const commandToRun = `powershell -NoProfile -Command "Write-Output '${val.replace(/'/g, "''")}' | ${cmd}"`;
        execSync(commandToRun, { stdio: 'ignore' });
        console.log(`✅  Uploaded ${key}`);
    } catch (e) {
        console.error(`❌ Failed to upload ${key}`);
    }
}

console.log('Done uploading env keys.');

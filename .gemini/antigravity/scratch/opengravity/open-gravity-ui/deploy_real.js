const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const envPath = path.join(__dirname, '.env');
if (!fs.existsSync(envPath)) {
    console.error('.env not found');
    process.exit(1);
}

const lines = fs.readFileSync(envPath, 'utf-8').split('\n');

for (const line of lines) {
    const match = line.match(/^([^=]+)=(.*)$/);
    if (match) {
        const key = match[1].trim();
        let val = match[2].trim();
        if (val.startsWith('"') && val.endsWith('"')) val = val.slice(1, -1);

        console.log(`Setting ${key}...`);
        try {
            execSync(`vercel env rm ${key} production --yes`, { stdio: 'ignore' });
        } catch (e) { }

        const tmpFile = `tmp_${key}.txt`;
        fs.writeFileSync(tmpFile, val);
        try {
            execSync(`vercel env add ${key} production < ${tmpFile}`, { shell: true });
        } catch (e) {
            console.error(`Failed to set ${key}`);
        }
        fs.unlinkSync(tmpFile);
    }
}

console.log('Redeploying...');
execSync('vercel --prod --yes --force', { stdio: 'inherit' });

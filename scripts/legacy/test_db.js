const { searchKnowledge, saveKnowledge } = require('./src/lib/tools');
require('dotenv').config();

async function test() {
    console.log('Testing Firestore Search...');
    try {
        await saveKnowledge({
            title: 'Test Entry',
            content: 'The secret code is 12345',
            tags: ['test'],
            source: 'system',
            importance: 'high'
        });
        console.log('Saved. Waiting 3s...');
        await new Promise(r => setTimeout(r, 3000));
        const hits = await searchKnowledge('secret code');
        console.log('Found hits:', hits.length);
        if (hits.length > 0) {
            console.log('Match:', hits[0].content);
        } else {
            console.log('No hits found. Check keys/connection.');
        }
    } catch (e) {
        console.error('Error:', e);
    }
}

test();

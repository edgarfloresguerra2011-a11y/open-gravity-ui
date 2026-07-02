const { processAiMessage } = require('./src/lib/ai_logic');

async function test() {
    try {
        console.log('Testing processAiMessage...');
        const res = await processAiMessage('Test message');
        console.log('Result:', JSON.stringify(res, null, 2));
    } catch (e) {
        console.error('TEST_FAILED:', e.message);
        console.error(e.stack);
    }
}

test();

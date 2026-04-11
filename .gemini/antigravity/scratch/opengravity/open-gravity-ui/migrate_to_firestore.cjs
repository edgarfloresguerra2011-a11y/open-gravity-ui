const sqlite3 = require('better-sqlite3');
const admin = require('firebase-admin');
const path = require('path');

// Init Firebase
if (!admin.apps.length) {
    admin.initializeApp({
        projectId: 'opengravity-ai-edgar'
    });
}
const firestore = admin.firestore();

// Connect to SQLite
const dbPath = path.resolve(__dirname, '../memory.db');
const db = new sqlite3(dbPath);

async function migrate() {
    console.log('Migrating local memory to Firestore...');
    const rows = db.prepare('SELECT * FROM conversation_history').all();

    const batch = firestore.batch();
    for (const row of rows) {
        const docRef = firestore.collection('messages').doc();
        batch.set(docRef, {
            role: row.role,
            content: row.content,
            timestamp: new Date(row.timestamp)
        });
    }

    await batch.commit();
    console.log(`Successfully migrated ${rows.length} messages to Firestore!`);
}

migrate().catch(console.error);

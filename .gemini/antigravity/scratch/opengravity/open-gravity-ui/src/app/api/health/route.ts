import { getIsMock, db } from '@/lib/firebaseAdmin';

export async function GET() {
    const isMock = getIsMock();
    let sampleData = null;
    let error = null;

    if (!isMock) {
        try {
            const snap = await db.collection('knowledge').limit(1).get();
            sampleData = snap.size;
        } catch (e: any) {
            error = e.message;
        }
    }

    return new Response(JSON.stringify({
        isMock,
        sampleData,
        error,
        projectId: process.env.FIREBASE_PROJECT_ID,
        hasKey: !!process.env.FIREBASE_PRIVATE_KEY
    }), {
        headers: { 'Content-Type': 'application/json' }
    });
}

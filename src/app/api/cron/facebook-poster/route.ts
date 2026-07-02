import { NextRequest, NextResponse } from 'next/server';
import { db as storageDb } from '@/lib/storage';
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import { requireCronAuth } from '@/lib/auth';

export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const maxDuration = 60;

// Configuración Firebase desde variables de entorno (FIX: antes estaba hardcodeada en Git)
// Vars requeridas en .env:
//   NEXT_PUBLIC_FB_SHOP_API_KEY, NEXT_PUBLIC_FB_SHOP_AUTH_DOMAIN,
//   NEXT_PUBLIC_FB_SHOP_PROJECT_ID, NEXT_PUBLIC_FB_SHOP_STORAGE_BUCKET,
//   NEXT_PUBLIC_FB_SHOP_SENDER_ID, NEXT_PUBLIC_FB_SHOP_APP_ID
function getShopFirebaseConfig() {
    const required = [
        'NEXT_PUBLIC_FB_SHOP_API_KEY',
        'NEXT_PUBLIC_FB_SHOP_AUTH_DOMAIN',
        'NEXT_PUBLIC_FB_SHOP_PROJECT_ID',
        'NEXT_PUBLIC_FB_SHOP_STORAGE_BUCKET',
        'NEXT_PUBLIC_FB_SHOP_SENDER_ID',
        'NEXT_PUBLIC_FB_SHOP_APP_ID',
    ];
    const missing = required.filter(k => !process.env[k]);
    if (missing.length) {
        throw new Error(`Config Firebase incompleta. Faltan: ${missing.join(', ')}`);
    }
    return {
        apiKey: process.env.NEXT_PUBLIC_FB_SHOP_API_KEY!,
        authDomain: process.env.NEXT_PUBLIC_FB_SHOP_AUTH_DOMAIN!,
        projectId: process.env.NEXT_PUBLIC_FB_SHOP_PROJECT_ID!,
        storageBucket: process.env.NEXT_PUBLIC_FB_SHOP_STORAGE_BUCKET!,
        messagingSenderId: process.env.NEXT_PUBLIC_FB_SHOP_SENDER_ID!,
        appId: process.env.NEXT_PUBLIC_FB_SHOP_APP_ID!,
    };
}

// Singleton lazy — solo se inicializa si la ruta realmente se invoca
let fbDb: ReturnType<typeof getFirestore> | null = null;
function getFbDb() {
    if (!fbDb) {
        const cfg = getShopFirebaseConfig();
        const app = !getApps().length ? initializeApp(cfg) : getApp();
        fbDb = getFirestore(app);
    }
    return fbDb;
}

export async function GET(req: NextRequest) {
    try {
        // 1. Auth — denegar por defecto (FIX: antes el if permitía bypass si CRON_SECRET no estaba seteado)
        const authError = requireCronAuth(req);
        if (authError) return authError;

        // 2. Extraer Credenciales de Facebook desde el .env
        const FB_PAGE_ID = process.env.FB_PAGE_ID;
        const FB_PAGE_TOKEN = process.env.FB_PAGE_TOKEN;

        if (!FB_PAGE_ID || !FB_PAGE_TOKEN) {
            return NextResponse.json({ error: 'Página o Token de Facebook no configurados en .env' }, { status: 400 });
        }

        // 3. Conectarse DIRECTO a Firebase y extraer productos
        const fbDb = getFbDb();
        const productsCol = collection(fbDb, "products");
        const productSnapshot = await getDocs(productsCol);

        const products = productSnapshot.docs.map(doc => ({
            id: doc.id,
            ...(doc.data() as any)
        }));

        if (products.length === 0) {
            return NextResponse.json({ error: 'La tienda no tiene productos en Firebase.' });
        }

        // 4. Filtrar para no repetir
        const publishedSnap = await storageDb.collection('cron_jobs').get();
        const publishedIds = publishedSnap.docs.map(doc => (doc.data() as any).productId);

        const availableProducts = products.filter(p => !publishedIds.includes(p.id));
        let selectedProduct = availableProducts[0];

        // Si ya publicamos todos, tomamos uno al azar
        if (!selectedProduct) {
            selectedProduct = products[Math.floor(Math.random() * products.length)];
        }

        // Construir URL en base a si tiene o no
        const productUrl = selectedProduct.url || `https://www.shopes.shop/producto/${selectedProduct.id}`;
        const productImage = selectedProduct.image_url || selectedProduct.image || selectedProduct.photo || "https://www.shopes.shop/default.jpg";

        // 5. Cloudflare AI: Redactar el Copy perfecto
        const prompt = `Eres un Social Media Manager creativo y experto en E-commerce.
Redacta una publicación para Facebook vendiendo el siguiente producto de nuestra tienda Shopes:
Nombre: ${selectedProduct.name || selectedProduct.nombre || selectedProduct.title}
Precio: ${selectedProduct.price || selectedProduct.precio}
Descripción: ${selectedProduct.description || selectedProduct.descripcion || "Lleva el mejor estilo hoy mismo."}
Enlace de compra: ${productUrl}

Instrucciones:
- Usa un tono magnético y enérgico.
- Usa Emojis (🔥, 👇, 🛍️).
- Aplica sentido de urgencia ("Últimas unidades", "Solo por hoy").
- Termina obligatoriamente con una llamada a la acción ("Haz clic aquí: [Enlace]").
- No escribas "Aquí tienes el texto". Salida final y lista para copiar.`;

        const cfAcc = process.env.CLOUDFLARE_ACCOUNT_ID;
        const cfKey = process.env.CLOUDFLARE_GLOBAL_KEY;
        const cfEmail = process.env.CLOUDFLARE_EMAIL;

        // Qwen2.5-coder o Llama 3
        const aiUrl = `https://api.cloudflare.com/client/v4/accounts/${cfAcc}/ai/run/@cf/qwen/qwen2.5-coder-32b-instruct`;

        const aiRes = await fetch(aiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'X-Auth-Email': cfEmail!, 'X-Auth-Key': cfKey! },
            body: JSON.stringify({ messages: [{ role: 'user', content: prompt }] })
        });

        const aiData = await aiRes.json();
        const generatedCopy = aiData?.result?.response || `¡Descubre nuestro nuevo producto estrella por solo ${selectedProduct.price || selectedProduct.precio}! 🔥 Consíguelo aquí: ${productUrl}`;

        // 6. Publicar en Facebook
        const fbUrl = `https://graph.facebook.com/v20.0/${FB_PAGE_ID}/photos`;
        const fbPayload = {
            url: productImage,
            message: generatedCopy,
            access_token: FB_PAGE_TOKEN
        };

        const fbReq = await fetch(fbUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(fbPayload)
        });

        const fbData = await fbReq.json();

        if (fbData.error) {
            throw new Error(`Error Graph API Meta: ${fbData.error.message}`);
        }

        // 7. Guardar en Memoria
        await storageDb.collection('cron_jobs').add({
            type: 'facebook_post',
            productId: selectedProduct.id,
            postId: fbData.id,
            timestamp: new Date()
        });

        return NextResponse.json({
            success: true,
            product_id: selectedProduct.id,
            facebook_post_id: fbData.id,
            copy: generatedCopy
        });

    } catch (e: any) {
        console.error('CRON_FB_ERROR:', e);
        return NextResponse.json({ error: e.message || 'Fatal Error Posting' }, { status: 500 });
    }
}

import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Política de Privacidad — OpenGravity',
  description: 'Cómo OpenGravity recopila, usa y protege tus datos.',
  robots: { index: true, follow: true },
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-[#050508] text-white">
      <div className="max-w-3xl mx-auto px-6 py-24">
        <Link href="/" className="text-sm text-gray-400 hover:text-white mb-8 inline-block">
          ← Volver a OpenGravity
        </Link>

        <h1 className="text-4xl font-black tracking-tight mb-2">Política de Privacidad</h1>
        <p className="text-sm text-gray-500 mb-12">Última actualización: 2026</p>

        <div className="space-y-8 text-gray-300 leading-relaxed">
          <section>
            <h2 className="text-xl font-bold text-white mb-3">1. Datos que recopilamos</h2>
            <p className="mb-3">Cuando usas OpenGravity, recopilamos:</p>
            <ul className="list-disc pl-6 space-y-1 text-sm">
              <li><strong>Email</strong> y nombre de tu cuenta de GitHub o Google (vía OAuth).</li>
              <li><strong>Ideas de negocio</strong> que ingresas para simular.</li>
              <li><strong>Resultados de simulaciones</strong> (LTV, CAC, viabilidad, etc.) asociados a tu cuenta.</li>
              <li><strong>Mensajes de chat</strong> que envías al asistente IA.</li>
              <li><strong>Datos de pago</strong> procesados por Stripe (no almacenamos el número de tarjeta).</li>
              <li><strong>Datos de uso</strong> anónimos (páginas visitadas, features usadas) para mejorar el producto.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">2. Cómo usamos tus datos</h2>
            <ul className="list-disc pl-6 space-y-1 text-sm">
              <li>Procesar tus simulaciones y devolverte resultados.</li>
              <li>Personalizar tu experiencia y guardar tu historial.</li>
              <li>Cobrarte la suscripción (vía Stripe).</li>
              <li>Enviar emails transaccionales (confirmación de pago, cambios en tu cuenta).</li>
              <li>Mejorar la calidad de nuestros modelos de IA (solo datos agregados y anónimos).</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">3. Proveedores terceros</h2>
            <p className="mb-3 text-sm">Compartimos datos con estos servicios para que OpenGravity funcione:</p>
            <ul className="list-disc pl-6 space-y-2 text-sm">
              <li><strong>DeepSeek</strong> — recibe tus prompts de chat y las ideas a simular.</li>
              <li><strong>Tavily</strong> — recibe los temas de research para hacer web crawling.</li>
              <li><strong>Upstash Redis</strong> — almacena tus simulaciones e historial, namespaced por tu userId.</li>
              <li><strong>Stripe</strong> — procesa pagos. No vemos tu número de tarjeta.</li>
              <li><strong>Vercel</strong> — hospeda la aplicación.</li>
              <li><strong>GitHub / Google</strong> — autenticación OAuth. Solo recibimos email, nombre y avatar.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">4. Retención de datos</h2>
            <ul className="list-disc pl-6 space-y-1 text-sm">
              <li><strong>Simulaciones:</strong> guardamos tus últimas 100 simulaciones. Las más antiguas se eliminan automáticamente.</li>
              <li><strong>Mensajes de chat:</strong> se conservan 30 días, después se compactan en resúmenes anónimos.</li>
              <li><strong>Datos de cuenta:</strong> mientras tu cuenta esté activa. Puedes solicitar eliminación total.</li>
              <li><strong>Logs de sistema:</strong> 90 días para troubleshooting.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">5. Tus derechos</h2>
            <p className="mb-3 text-sm">Puedes:</p>
            <ul className="list-disc pl-6 space-y-1 text-sm">
              <li>Acceder a todos tus datos desde el dashboard.</li>
              <li>Exportar tus simulaciones en PDF.</li>
              <li>Solicitar eliminación total de tu cuenta escribiendo a privacidad@opengravity.dev.</li>
              <li>Cancelar tu suscripción en cualquier momento desde Billing.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">6. Seguridad</h2>
            <p className="text-sm">
              Aplicamos medidas técnicas y organizativas razonables para proteger tus datos:
              HTTPS obligatorio (HSTS), CSP estricta, rate limiting, validación de input,
              secrets en variables de entorno, y namespace por usuario en storage.
              Sin embargo, ningún sistema es 100% seguro. Si descubres una vulnerabilidad,
              repórtala a security@opengravity.dev.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">7. Cambios a esta política</h2>
            <p className="text-sm">
              Podemos actualizar esta política. Te notificaremos por email sobre cambios materiales
              al menos 30 días antes de que entren en vigor.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">8. Contacto</h2>
            <p className="text-sm">
              Para cualquier duda sobre privacidad: privacidad@opengravity.dev
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}

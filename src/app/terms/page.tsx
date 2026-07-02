import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Términos de Servicio — OpenGravity',
  description: 'Términos y condiciones de uso de OpenGravity.',
  robots: { index: true, follow: true },
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-[#050508] text-white">
      <div className="max-w-3xl mx-auto px-6 py-24">
        <Link href="/" className="text-sm text-gray-400 hover:text-white mb-8 inline-block">
          ← Volver a OpenGravity
        </Link>

        <h1 className="text-4xl font-black tracking-tight mb-2">Términos de Servicio</h1>
        <p className="text-sm text-gray-500 mb-12">Última actualización: 2026</p>

        <div className="space-y-8 text-gray-300 leading-relaxed">
          <section>
            <h2 className="text-xl font-bold text-white mb-3">1. Aceptación</h2>
            <p className="text-sm">
              Al usar OpenGravity, aceptas estos términos. Si no estás de acuerdo, no uses el servicio.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">2. Descripción del servicio</h2>
            <p className="text-sm">
              OpenGravity es una plataforma de análisis de viabilidad de negocios que combina
              investigación profunda web, generación de agentes sintéticos, simulación Monte Carlo
              y síntesis con LLM. Los resultados son estimaciones estadísticas basadas en datos
              públicos y no constituyen asesoría financiera, legal ni de inversión.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">3. No es asesoría financiera</h2>
            <p className="text-sm">
              <strong>Importante:</strong> Los reportes generados por OpenGravity son herramientas
              de análisis exploratorio. No son recomendaciones de inversión. Las decisiones que tomes
              basándote en estos reportes son tu responsabilidad. Consulta un asesor financiero
              certificado antes de invertir dinero real.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">4. Planes y pagos</h2>
            <ul className="list-disc pl-6 space-y-1 text-sm">
              <li><strong>Free:</strong> 3 simulaciones/mes gratis, sin tarjeta requerida.</li>
              <li><strong>Pro ($29/mes):</strong> 50 simulaciones/mes, export PDF, historial persistente.</li>
              <li><strong>Agency ($99/mes):</strong> Simulaciones ilimitadas, multi-usuario, API access.</li>
            </ul>
            <p className="mt-3 text-sm">
              Los pagos se procesan vía Stripe. Las suscripciones se renuevan automáticamente
              hasta que canceles. Puedes cancelar en cualquier momento desde Billing.
              No se devuelven pagos parciales de meses no usados.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">5. Uso aceptable</h2>
            <p className="mb-3 text-sm">No puedes usar OpenGravity para:</p>
            <ul className="list-disc pl-6 space-y-1 text-sm">
              <li>Actividades ilegales o fraudulentas.</li>
              <li>Intentar extraer datos de otros usuarios.</li>
              <li>Hacer reverse engineering del código o modelos.</li>
              <li>Spam, scraping masivo, o abuso de la API.</li>
              <li>Generar contenido que viole derechos de terceros.</li>
            </ul>
            <p className="mt-3 text-sm">
              El incumplimiento puede resultar en suspensión inmediata sin reembolso.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">6. Propiedad intelectual</h2>
            <p className="text-sm">
              Tú conservas la propiedad de las ideas de negocio que ingresas.
              OpenGravity conserva la propiedad del código, modelos, prompts y algoritmos.
              Los reportes generados son tuyos para uso personal o comercial (con atribución si es público).
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">7. Limitación de responsabilidad</h2>
            <p className="text-sm">
              OpenGravity se proporciona &ldquo;tal cual&rdquo; sin garantías de ningún tipo.
              No nos hacemos responsables de pérdidas financieras, decisiones de negocio
              o cualquier daño derivado del uso de los reportes. La responsabilidad máxima
              de OpenGravity está limitada al monto pagado en los últimos 12 meses.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">8. Suspensión de cuentas</h2>
            <p className="text-sm">
              Podemos suspender o cancelar cuentas por incumplimiento de estos términos,
              actividad sospechosa, o no pago. Te notificaremos por email antes de suspender,
              salvo en casos de abuso grave.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">9. Cambios al servicio</h2>
            <p className="text-sm">
              Podemos cambiar features, precios o disponibilidad con 30 días de aviso.
              Los cambios materiales a estos términos se notificarán también con 30 días.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">10. Ley aplicable</h2>
            <p className="text-sm">
              Estos términos se rigen por las leyes de Ecuador. Cualquier disputa se resolverá
              en los tribunales de Guayaquil, Ecuador.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">11. Contacto</h2>
            <p className="text-sm">
              Para preguntas sobre estos términos: legal@opengravity.dev
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}

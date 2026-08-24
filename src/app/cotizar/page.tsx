import type { Metadata } from 'next'
import { Clock, EyeOff, HandCoins, ShieldCheck } from 'lucide-react'
import { ButtonLink } from '../components/ui/Button'

export const metadata: Metadata = {
  title: 'Cotizá tu auto — ofertas de automotoras en 72 horas | TodoMotor',
  description:
    'Cargá tu auto una vez y recibí ofertas de compra de las automotoras registradas en TodoMotor. No se publica en internet, es gratis y no estás obligado a vender.',
  alternates: { canonical: '/cotizar' },
}

/**
 * The public door to the feature, and the only page in it that a crawler sees.
 * Everything behind it — the form, the offers, the dealership feed — is
 * noindex, because it holds cars whose owners asked us not to publish them.
 */
const PASOS = [
  {
    icon: HandCoins,
    title: 'Cargás tu auto una vez',
    body: 'Fotos y datos en un par de minutos. No se publica en internet: sólo lo ven las automotoras registradas en TodoMotor.',
  },
  {
    icon: EyeOff,
    title: 'Las automotoras ofertan a ciegas',
    body: 'Ninguna ve lo que ofrecieron las demás, así que a cada una le conviene poner su mejor precio de entrada.',
  },
  {
    icon: Clock,
    title: 'Elegís vos, cuando quieras',
    body: 'Ves las ofertas llegar en vivo y aceptás la que más te convenga. A las 72 horas se cierra sola.',
  },
]

export default function CotizarPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12 space-y-16">
      <section className="text-center space-y-5">
        <h1
          className="font-display text-3xl sm:text-4xl font-bold text-ink"
          style={{ letterSpacing: '-0.02em' }}
        >
          Averiguá cuánto vale tu auto
        </h1>
        <p className="text-base text-muted max-w-xl mx-auto">
          Las automotoras registradas en TodoMotor compiten por comprártelo durante 72 horas. Sin
          publicarlo en internet, sin curiosos y sin que tu teléfono circule.
        </p>
        <ButtonLink href="/cotizar/nuevo" size="lg">
          Cotizar mi auto
        </ButtonLink>
        <p className="text-sm text-muted">Gratis · Sin comisiones · No estás obligado a vender</p>
      </section>

      <section className="space-y-6">
        <h2 className="font-display text-xl font-bold text-ink text-center">Cómo funciona</h2>
        <ol className="space-y-6">
          {PASOS.map(({ icon: Icon, title, body }, i) => (
            <li key={title} className="flex gap-4">
              <div
                aria-hidden="true"
                className="w-10 h-10 shrink-0 rounded-full bg-surface-2 grid place-items-center"
              >
                <Icon size={18} />
              </div>
              <div className="space-y-1">
                <h3 className="font-medium text-ink">
                  {i + 1}. {title}
                </h3>
                <p className="text-sm text-muted">{body}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <section className="rounded-2xl border border-line p-6 space-y-4">
        <div className="flex gap-3">
          <ShieldCheck size={20} className="shrink-0 mt-0.5" aria-hidden="true" />
          <div className="space-y-1">
            <h2 className="font-medium text-ink">Qué significa una oferta acá</h2>
            <p className="text-sm text-muted">
              Es una estimación firme hecha sobre lo que declaraste y las fotos que subiste, sujeta
              a ver el auto en persona. Si una automotora ofrece un precio para ganar y después lo
              baja sin motivo, podés reportarla: llevamos el registro y podemos suspenderle la
              cuenta.
            </p>
          </div>
        </div>
      </section>

      <section className="space-y-5">
        <h2 className="font-display text-xl font-bold text-ink">Preguntas frecuentes</h2>
        <dl className="space-y-5">
          <div className="space-y-1">
            <dt className="font-medium text-ink">¿Cuánto cuesta?</dt>
            <dd className="text-sm text-muted">
              Nada. Cotizar y recibir ofertas es gratis, y no cobramos comisión si vendés.
            </dd>
          </div>
          <div className="space-y-1">
            <dt className="font-medium text-ink">¿Mi auto se publica en internet?</dt>
            <dd className="text-sm text-muted">
              No. No aparece en los clasificados ni en Google. Sólo lo ven las automotoras
              aprobadas, y tu teléfono no se lo damos a ninguna hasta que aceptes su oferta.
            </dd>
          </div>
          <div className="space-y-1">
            <dt className="font-medium text-ink">¿Estoy obligado a vender?</dt>
            <dd className="text-sm text-muted">
              No. Si ninguna oferta te convence, no hacés nada y listo.
            </dd>
          </div>
          <div className="space-y-1">
            <dt className="font-medium text-ink">¿Qué pasa si no acepto en 72 horas?</dt>
            <dd className="text-sm text-muted">
              La cotización deja de recibir ofertas nuevas, pero podés aceptar cualquiera de las que
              ya te hicieron. También podés volver a publicar el auto cuando quieras.
            </dd>
          </div>
          <div className="space-y-1">
            <dt className="font-medium text-ink">¿Tengo que poner un precio?</dt>
            <dd className="text-sm text-muted">
              No, y es a propósito: si ponés uno, las ofertas se acomodan ahí. Que arranquen de cero
              es lo que hace que compitan.
            </dd>
          </div>
        </dl>
      </section>

      <section className="text-center space-y-4">
        <h2 className="font-display text-xl font-bold text-ink">¿Cuánto vale tu auto hoy?</h2>
        <ButtonLink href="/cotizar/nuevo" size="lg">
          Cotizar mi auto
        </ButtonLink>
      </section>
    </div>
  )
}

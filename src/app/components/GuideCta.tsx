import { Compass, ArrowRight } from 'lucide-react'
import { ButtonLink } from './ui/Button'

/** Home banner pointing to the interactive buying guide. */
export default function GuideCta() {
  return (
    <section className="h-sect h-guide-sect" aria-labelledby="h-guide-title">
      <div className="h-guide">
        <div className="h-guide__ic"><Compass size={28} aria-hidden="true" /></div>
        <div className="h-guide__txt">
          <h2 id="h-guide-title" className="h-guide__t">¿No sabés qué auto comprar?</h2>
          <p className="h-guide__s">Respondé seis preguntas — uso, presupuesto, personas, motor — y te armamos un Top 3 con las razones. Sin humo: datos de fichas técnicas.</p>
        </div>
        <ButtonLink href="/guia-de-compra" variant="primary" size="lg" iconRight={<ArrowRight size={18} aria-hidden="true" />}>
          Empezar la guía
        </ButtonLink>
      </div>
    </section>
  )
}

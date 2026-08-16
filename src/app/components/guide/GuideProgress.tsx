'use client'

import { Check } from 'lucide-react'
import type { Answers, StepParam } from '@/lib/buying-guide/types'
import { STEPS, answerLabel } from '@/lib/buying-guide/questions'
import { stepNumber } from '@/lib/buying-guide/url-state'

interface Props {
  step: StepParam
  answers: Answers
  onJump: (to: StepParam) => void
}

export default function GuideProgress({ step, answers, onJump }: Props) {
  const current = step === 'res' ? STEPS.length + 1 : stepNumber(step)
  const label = step === 'res' ? 'Resultados' : `Paso ${current} de ${STEPS.length}`

  return (
    <div className="gd__progress" role="group" aria-label="Progreso de la guía">
      <div className="gd__bar-track" aria-hidden="true">
        {STEPS.map((s, i) => (
          <span key={s.id} className={`gd__seg${i + 1 < current ? ' is-done' : ''}${i + 1 === current ? ' is-current' : ''}`} />
        ))}
      </div>
      <div className="gd__progress-row">
        <span className="gd__progress-label">{label}</span>
        <ol className="gd__chips" aria-label="Respuestas dadas">
          {STEPS.map((s, i) => {
            const val = answerLabel(s.id, answers)
            const isCurrent = step === s.id
            if (!val && !isCurrent) return null
            return (
              <li key={s.id}>
                <button
                  type="button"
                  className={`gd__chip${isCurrent ? ' is-current' : ''}`}
                  onClick={() => onJump(s.id)}
                  aria-current={isCurrent ? 'step' : undefined}
                  title={`Volver a: ${s.title}`}
                >
                  {val ? <Check size={12} aria-hidden="true" /> : <span className="gd__chip-n">{i + 1}</span>}
                  <span className="gd__chip-k">{s.short}</span>
                  {val && <span className="gd__chip-v">{val}</span>}
                </button>
              </li>
            )
          })}
        </ol>
      </div>
    </div>
  )
}

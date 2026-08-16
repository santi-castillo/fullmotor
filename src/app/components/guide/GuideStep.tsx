'use client'

import { useEffect, useMemo, useRef, useState, type RefObject } from 'react'
import { ArrowLeft, ArrowRight, Check } from 'lucide-react'
import type { Answers, GuideVehicle, StepId } from '@/lib/buying-guide/types'
import { STEPS, BUDGET_CHIPS, type StepOption } from '@/lib/buying-guide/questions'
import { countMatches } from '@/lib/buying-guide/scoring'
import { parseBudget } from '@/lib/buying-guide/url-state'
import { formatNumber } from '@/lib/format'
import { Button } from '@/app/components/ui/Button'
import { GuideIconGlyph } from './guide-icons'

interface Props {
  stepId: StepId
  index: GuideVehicle[]
  answers: Answers
  total: { vehicles: number; families: number }
  headingRef: RefObject<HTMLHeadingElement | null>
  onAnswer: <K extends keyof Answers>(key: K, value: Answers[K], advance: boolean) => void
  onBack: () => void
  onSkip: () => void
  onResults: () => void
}

const ADVANCE_DELAY_MS = 180

function prefersReducedMotion(): boolean {
  return typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
}

export default function GuideStep({ stepId, index, answers, total, headingRef, onAnswer, onBack, onSkip, onResults }: Props) {
  const step = STEPS.find((s) => s.id === stepId)!
  const stepIndex = STEPS.indexOf(step)
  const isFirst = stepIndex === 0
  const isLast = stepIndex === STEPS.length - 1
  const current = answers[stepId]

  // Per-option live counts ("what would be left if I pick this").
  const counts = useMemo(() => {
    const m = new Map<string | number, number>()
    for (const o of step.options) {
      m.set(o.value, countMatches(index, { ...answers, [stepId]: o.value } as Answers).vehicles)
    }
    return m
  }, [index, answers, step, stepId])

  // Brief "selected" flash before auto-advancing, so the tap feels acknowledged.
  const [pending, setPending] = useState<string | number | null>(null)
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null)
  useEffect(() => () => { if (timer.current) clearTimeout(timer.current) }, [])

  const choose = (o: StepOption) => {
    if (timer.current) clearTimeout(timer.current)
    setPending(o.value)
    const delay = prefersReducedMotion() ? 0 : ADVANCE_DELAY_MS
    timer.current = setTimeout(() => {
      onAnswer(stepId, o.value as Answers[typeof stepId], true)
    }, delay)
  }

  return (
    <section className="gd__step" aria-labelledby="gd-question">
      <h2 id="gd-question" className="gd__q" ref={headingRef} tabIndex={-1}>{step.title}</h2>
      {step.subtitle && <p className="gd__sub">{step.subtitle}</p>}

      <div className="gd__options" role="radiogroup" aria-labelledby="gd-question">
        {step.options.map((o) => {
          const n = counts.get(o.value) ?? 0
          const selected = current === o.value || pending === o.value
          return (
            <button
              key={String(o.value)}
              type="button"
              role="radio"
              aria-checked={selected}
              className={`gd__opt${selected ? ' is-selected' : ''}${n === 0 ? ' is-empty' : ''}`}
              onClick={() => choose(o)}
            >
              <span className="gd__opt-ic"><GuideIconGlyph name={o.icon} size={24} /></span>
              <span className="gd__opt-body">
                <span className="gd__opt-l">{o.label}</span>
                {o.desc && <span className="gd__opt-d">{o.desc}</span>}
              </span>
              <span className="gd__opt-count" aria-label={`${n} vehículos`}>
                {n === 0 ? 'ninguno' : formatNumber(n)}
              </span>
              {selected && <span className="gd__opt-check" aria-hidden="true"><Check size={14} /></span>}
            </button>
          )
        })}
      </div>

      {stepId === 'max' && (
        <BudgetInput
          value={answers.max}
          onChange={(v) => onAnswer('max', v, false)}
          onSubmit={(v) => onAnswer('max', v, true)}
        />
      )}

      {step.caption && <p className="gd__caption">{step.caption}</p>}

      <div className="gd__bar">
        <div className="gd__counter" aria-live="polite">
          <strong>{formatNumber(total.vehicles)}</strong>
          <span>{total.vehicles === 1 ? 'vehículo coincide' : 'vehículos coinciden'} · {formatNumber(total.families)} {total.families === 1 ? 'modelo' : 'modelos'}</span>
          {total.vehicles === 0 && (
            <span className="gd__counter-hint">Con estas respuestas no queda ninguno — probá subir el presupuesto o tocá &ldquo;{step.skipLabel}&rdquo;.</span>
          )}
        </div>
        <div className="gd__actions">
          {!isFirst && (
            <Button variant="ghost" onClick={onBack} iconLeft={<ArrowLeft size={16} aria-hidden="true" />}>Atrás</Button>
          )}
          {isLast ? (
            <Button variant="primary" onClick={onResults} iconRight={<ArrowRight size={16} aria-hidden="true" />}>Ver resultados</Button>
          ) : (
            <>
              <Button variant="secondary" onClick={onSkip}>{step.skipLabel}</Button>
              {stepIndex >= 1 && (
                <Button variant="ghost" onClick={onResults} iconRight={<ArrowRight size={16} aria-hidden="true" />}>Ver resultados</Button>
              )}
            </>
          )}
        </div>
      </div>
    </section>
  )
}

const DEBOUNCE_MS = 400

function BudgetInput({ value, onChange, onSubmit }: { value?: number; onChange: (v?: number) => void; onSubmit: (v?: number) => void }) {
  const isChip = value != null && BUDGET_CHIPS.some((c) => c.value === value)
  const [text, setText] = useState(value != null && !isChip ? String(value) : '')
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null)
  useEffect(() => () => { if (timer.current) clearTimeout(timer.current) }, [])

  const commit = (raw: string) => {
    if (timer.current) clearTimeout(timer.current)
    timer.current = setTimeout(() => onChange(parseBudget(raw)), DEBOUNCE_MS)
  }

  return (
    <form
      className="gd__budget"
      onSubmit={(e) => {
        e.preventDefault()
        if (timer.current) clearTimeout(timer.current)
        onSubmit(parseBudget(text))
      }}
    >
      <label htmlFor="gd-budget" className="gd__budget-l">Otro monto (USD)</label>
      <div className="gd__budget-row">
        <input
          id="gd-budget"
          className="tm-input gd__budget-in"
          type="text"
          inputMode="numeric"
          placeholder="ej. 25000"
          value={text}
          onChange={(e) => { setText(e.target.value); commit(e.target.value) }}
        />
        <Button type="submit" variant="secondary" disabled={!parseBudget(text)}>Usar este monto</Button>
      </div>
    </form>
  )
}

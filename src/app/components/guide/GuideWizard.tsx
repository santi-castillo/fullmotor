'use client'

import { useCallback, useEffect, useMemo, useRef } from 'react'
import { useSearchParams } from 'next/navigation'
import type { Answers, GuideVehicle, ResolvedPick, SalesMeta, StepId, StepParam } from '@/lib/buying-guide/types'
import { STEPS } from '@/lib/buying-guide/questions'
import { buildGuideUrl, nextStep, parseAnswers, parseStep, prevStep } from '@/lib/buying-guide/url-state'
import { countMatches, runGuide } from '@/lib/buying-guide/scoring'
import GuideProgress from './GuideProgress'
import GuideStep from './GuideStep'
import GuideResults from './GuideResults'

interface Props {
  index: GuideVehicle[]
  curated: ResolvedPick[]
  /** ACAU dataset metadata (year / months covered) for wording and the source line. */
  salesMeta?: SalesMeta
}

/**
 * URL-driven wizard. All state (answers + current step) is derived from the
 * query string; navigation uses the History API directly so answering a
 * question doesn't refetch the page (the index is already in memory) while
 * the back button still walks the steps.
 */
export default function GuideWizard({ index, curated, salesMeta }: Props) {
  const sp = useSearchParams()
  const answers = useMemo(() => parseAnswers(sp), [sp])
  const step = useMemo(() => parseStep(sp), [sp])

  const navigate = useCallback((next: Answers, to: StepParam, replace = false) => {
    const url = buildGuideUrl(next, to)
    if (typeof window === 'undefined') return
    if (replace) window.history.replaceState(null, '', url)
    else window.history.pushState(null, '', url)
  }, [])

  const setAnswer = useCallback(<K extends keyof Answers>(key: K, value: Answers[K], advance: boolean) => {
    const next: Answers = { ...answers }
    if (value === undefined) delete next[key]
    else next[key] = value
    const to: StepParam = advance && step !== 'res' ? nextStep(step as StepId) : step
    navigate(next, to, !advance)
  }, [answers, step, navigate])

  const goTo = useCallback((to: StepParam) => navigate(answers, to), [answers, navigate])
  const goBack = useCallback(() => navigate(answers, prevStep(step)), [answers, step, navigate])
  const skip = useCallback(() => {
    if (step === 'res') return
    navigate(answers, nextStep(step))
  }, [answers, step, navigate])
  const restart = useCallback(() => navigate({}, STEPS[0].id), [navigate])

  const total = useMemo(() => countMatches(index, answers), [index, answers])
  const result = useMemo(() => (step === 'res' ? runGuide(index, curated, answers, { salesYear: salesMeta?.year }) : null), [index, curated, answers, step, salesMeta?.year])

  // Move focus to the new question so keyboard / screen-reader users follow
  // the step change; scroll the wizard back into view on small screens.
  const headingRef = useRef<HTMLHeadingElement>(null)
  const firstRender = useRef(true)
  useEffect(() => {
    if (firstRender.current) { firstRender.current = false; return }
    headingRef.current?.focus({ preventScroll: true })
    const top = headingRef.current?.getBoundingClientRect().top ?? 0
    if (top < 0 || top > window.innerHeight * 0.5) headingRef.current?.scrollIntoView({ block: 'start', behavior: 'smooth' })
  }, [step])

  return (
    <div className="gd__wizard">
      <GuideProgress step={step} answers={answers} onJump={goTo} />
      {step === 'res' && result ? (
        <GuideResults
          result={result}
          answers={answers}
          salesMeta={salesMeta}
          headingRef={headingRef}
          onAdjust={() => goTo(STEPS[0].id)}
          onRestart={restart}
        />
      ) : (
        <GuideStep
          key={step}
          stepId={step as StepId}
          index={index}
          answers={answers}
          total={total}
          headingRef={headingRef}
          onAnswer={setAnswer}
          onBack={goBack}
          onSkip={skip}
          onResults={() => goTo('res')}
        />
      )}
    </div>
  )
}

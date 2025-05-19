import React, { useState } from 'react'
import s from './StepProgressBar.module.scss'

interface Step {
  label: string
  positionPercent?: number
}

interface StepProgressBarProps {
  steps: Step[]
  initialStep?: number
  currentStep?: number  // controlled
  onStepChange?: (stepIndex: number) => void
  disableClick?: boolean
}

export const StepProgressBar: React.FC<StepProgressBarProps> = ({
  steps,
  initialStep = 0,
  currentStep: currentStepProp,
  onStepChange,
  disableClick = false
}) => {
  const [currentStepInternal, setCurrentStepInternal] = useState<number>(initialStep)

  const isControlled = currentStepProp !== undefined
  const currentStep = isControlled ? currentStepProp! : currentStepInternal

  const handleClick = (index: number) => {
    if (disableClick) return

    if (!isControlled) {
      setCurrentStepInternal(index)
    }

    onStepChange?.(index)
  }

  const getStepPosition = (stepIndex: number): number => {
    const step = steps[stepIndex]
    if (step?.positionPercent != null) {
      return Math.min(100, Math.max(0, step.positionPercent))
    }
    return (stepIndex / (steps.length - 1)) * 100
  }

  const prevStep = Math.max(currentStep - 1, 0)
  const pulseLeft = getStepPosition(prevStep)
  const pulseWidth = getStepPosition(currentStep) - pulseLeft
  const progressPercent = getStepPosition(currentStep)

  return (
    <div className={s.progress}>
      <div className={s.bar}>
        <span
          className={s.bar__fill}
          style={{ width: `${progressPercent}%` }}
        />
        <span
          className={s.bar__pulseSegment}
          style={{
            left: `${pulseLeft}%`,
            width: `${pulseWidth}%`
          }}
        />
      </div>

      {steps.map((step, index) => (
        <div
          key={index}
          className={`${s.point} ${
            index < currentStep
              ? s['point--complete']
              : index === currentStep
              ? s['point--active']
              : ''
          }`}
          onClick={() => handleClick(index)}
        >
          <span className={s.bullet} />
          <label className={s.label}>{step.label}</label>
        </div>
      ))}
    </div>
  )
}


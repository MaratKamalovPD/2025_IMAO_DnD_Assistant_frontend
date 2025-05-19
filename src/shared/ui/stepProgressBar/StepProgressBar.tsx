import React, { useState } from 'react'
import styles from './StepProgressBar.module.scss'

interface Step {
  label: string
  positionPercent?: number
}

interface StepProgressBarProps {
  steps: Step[]
  initialStep?: number
  onStepChange?: (stepIndex: number) => void
}

export const StepProgressBar: React.FC<StepProgressBarProps> = ({
  steps,
  initialStep = 0,
  onStepChange
}) => {
  const [currentStep, setCurrentStep] = useState<number>(initialStep)

  const handleClick = (index: number) => {
    setCurrentStep(index)
    onStepChange?.(index)
  }

  const getStepPosition = (stepIndex: number): number => {
    const step = steps[stepIndex]
    if (step?.positionPercent != null) {
      return Math.min(100, Math.max(0, step.positionPercent))
    }
  
    // fallback к авторасчёту
    return (stepIndex / (steps.length - 1)) * 100
  }
  
  
  const prevStep = Math.max(currentStep - 1, 0)
  const pulseLeft = getStepPosition(prevStep)
  const pulseWidth = getStepPosition(currentStep) - pulseLeft
  

  const progressPercent =
    steps.length > 1 ? (currentStep / (steps.length - 1)) * 100 : 0

  return (
    <div className={styles.progress}>
      <div className={styles.bar}>
        <span
          className={styles.bar__fill}
          style={{ width: `${progressPercent}%` }}
        />
        <span
          className={styles.bar__pulseSegment}
          style={{
            left: `${pulseLeft}%`,
            width: `${pulseWidth}%`
          }}
        />
      </div>


      {steps.map((step, index) => (
        <div
          key={index}
          className={`${styles.point} ${
            index < currentStep
              ? styles['point--complete']
              : index === currentStep
              ? styles['point--active']
              : ''
          }`}
          onClick={() => handleClick(index)}
        >
          <span className={styles.bullet} />
          <label className={styles.label}>{step.label}</label>
        </div>
      ))}
    </div>
  )
}

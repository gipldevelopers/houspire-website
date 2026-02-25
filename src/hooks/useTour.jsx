import { useState, useEffect, useCallback } from 'react'

export function useTour(tourId, steps) {
  const [isActive, setIsActive] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)
  const [targetPosition, setTargetPosition] = useState({ top: 0, left: 0 })

  const storageKey = `tour-completed-${tourId}`

  useEffect(() => {
    const completed = localStorage.getItem(storageKey)
    if (!completed && steps.length > 0) {
      setTimeout(() => {
        setIsActive(true)
        updateTargetPosition()
      }, 1000)
    }
  }, [storageKey, steps.length])

  const updateTargetPosition = useCallback(() => {
    if (!steps[currentStep]) return

    const target = document.querySelector(steps[currentStep].target)
    if (target) {
      const rect = target.getBoundingClientRect()
      
      target.classList.add('tour-highlight')
      target.scrollIntoView({ behavior: 'smooth', block: 'center' })

      setTargetPosition({
        top: rect.top + rect.height / 2,
        left: rect.left + rect.width / 2,
      })
    }
  }, [currentStep, steps])

  useEffect(() => {
    if (isActive) {
      updateTargetPosition()
    }
  }, [currentStep, isActive, updateTargetPosition])

  const next = useCallback(() => {
    const currentTarget = document.querySelector(steps[currentStep].target)
    if (currentTarget) {
      currentTarget.classList.remove('tour-highlight')
    }

    if (currentStep < steps.length - 1) {
      setCurrentStep((prev) => prev + 1)
    }
  }, [currentStep, steps])

  const prev = useCallback(() => {
    const currentTarget = document.querySelector(steps[currentStep].target)
    if (currentTarget) {
      currentTarget.classList.remove('tour-highlight')
    }

    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1)
    }
  }, [currentStep, steps])

  const skip = useCallback(() => {
    const currentTarget = document.querySelector(steps[currentStep].target)
    if (currentTarget) {
      currentTarget.classList.remove('tour-highlight')
    }

    setIsActive(false)
    localStorage.setItem(storageKey, 'true')
  }, [currentStep, steps, storageKey])

  const finish = useCallback(() => {
    const currentTarget = document.querySelector(steps[currentStep].target)
    if (currentTarget) {
      currentTarget.classList.remove('tour-highlight')
    }

    setIsActive(false)
    localStorage.setItem(storageKey, 'true')

    if (steps[currentStep].action) {
      steps[currentStep].action?.onClick()
    }
  }, [currentStep, steps, storageKey])

  const restart = useCallback(() => {
    localStorage.removeItem(storageKey)
    setCurrentStep(0)
    setIsActive(true)
    updateTargetPosition()
  }, [storageKey, updateTargetPosition])

  return {
    isActive,
    currentStep,
    targetPosition,
    currentStepData: steps[currentStep],
    totalSteps: steps.length,
    next,
    prev,
    skip,
    finish,
    restart,
  }
}

import { useState, useEffect } from 'react'
import { supabase } from '@/integrations/supabase/client'

export function useTimer(projectId) {
  const [timer, setTimer] = useState({
    timeRemaining: '72h 00m 00s',
    hours: 72,
    minutes: 0,
    seconds: 0,
    percentage: 0,
    isRunning: false,
    isExpired: false,
  })

  useEffect(() => {
    if (!projectId) return

    let localElapsed = 0
    let totalSeconds = 259200 // 72 hours default
    let isRunning = false
    let intervalId = null

    const calculateTimeDisplay = (elapsed) => {
      const remaining = Math.max(0, totalSeconds - elapsed)
      const hours = Math.floor(remaining / 3600)
      const minutes = Math.floor((remaining % 3600) / 60)
      const seconds = remaining % 60

      return {
        timeRemaining: `${hours}h ${minutes.toString().padStart(2, '0')}m ${seconds.toString().padStart(2, '0')}s`,
        hours,
        minutes,
        seconds,
        percentage: (elapsed / totalSeconds) * 100,
        isRunning,
        isExpired: remaining <= 0,
      }
    }

    const fetchTimer = async () => {
      const { data: project } = await supabase
        .from('projects')
        .select('timer_total_seconds, timer_elapsed_seconds, timer_status, timer_started_at')
        .eq('id', projectId)
        .maybeSingle()

      if (!project) return

      totalSeconds = project.timer_total_seconds || 259200
      localElapsed = project.timer_elapsed_seconds || 0
      isRunning = project.timer_status === 'running'

      if (isRunning && project.timer_started_at) {
        const startedAt = new Date(project.timer_started_at).getTime()
        const now = Date.now()
        const additionalSeconds = Math.floor((now - startedAt) / 1000)
        localElapsed += additionalSeconds
      }

      setTimer(calculateTimeDisplay(localElapsed))
    }

    fetchTimer()

    intervalId = setInterval(() => {
      if (isRunning) {
        localElapsed += 1
        setTimer(calculateTimeDisplay(localElapsed))
      }
    }, 1000)

    return () => {
      if (intervalId) clearInterval(intervalId)
    }
  }, [projectId])

  return timer
}

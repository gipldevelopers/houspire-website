import { useState, useEffect, useCallback } from 'react'
import { supabase } from '@/integrations/supabase/client'
import { useAuth } from '@/contexts/AuthContext'
import { useToast } from '@/hooks/use-toast'

export function useQuizSession() {
  const { user } = useAuth()
  const { toast } = useToast()
  
  const [session, setSession] = useState(null)
  const [sessionToken, setSessionToken] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [hasExistingSession, setHasExistingSession] = useState(false)

  useEffect(() => {
    initializeSession()
  }, [])

  const initializeSession = async () => {
    setLoading(true)
    
    let token = localStorage.getItem('quiz_session_token')
    
    if (!token) {
      token = `quiz_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      localStorage.setItem('quiz_session_token', token)
    }
    
    setSessionToken(token)
    await loadSession(token)
    setLoading(false)
  }

  const loadSession = async (token) => {
    try {
      const { data, error } = await supabase
        .from('quiz_sessions')
        .select('*')
        .eq('session_token', token)
        .maybeSingle()

      if (error) throw error

      if (data && !data.completed) {
        setSession(data)
        setHasExistingSession(true)
        
        toast({
          title: 'Welcome back! 👋',
          description: 'We saved your progress. Continue where you left off.',
        })
      }
    } catch (error) {
      console.error('Failed to load quiz session:', error)
    }
  }

  const saveProgress = useCallback(async (currentStep, quizData) => {
    if (!sessionToken) return

    setSaving(true)
    
    try {
      const { data, error } = await supabase.rpc('save_quiz_progress', {
        p_session_token: sessionToken,
        p_current_step: currentStep,
        p_quiz_data: quizData,
        p_user_id: user?.id || null,
      })

      if (error) throw error
      
      return data
    } catch (error) {
      console.error('Failed to save quiz progress:', error)
    } finally {
      setSaving(false)
    }
  }, [sessionToken, user?.id])

  const completeSession = async () => {
    if (!sessionToken) return

    try {
      await supabase
        .from('quiz_sessions')
        .update({ 
          completed: true, 
          completed_at: new Date().toISOString() 
        })
        .eq('session_token', sessionToken)

      localStorage.removeItem('quiz_session_token')
      setSession(null)
      setHasExistingSession(false)
    } catch (error) {
      console.error('Failed to complete session:', error)
    }
  }

  const resetSession = async () => {
    localStorage.removeItem('quiz_session_token')
    setSession(null)
    setHasExistingSession(false)
    await initializeSession()
  }

  return {
    session,
    sessionToken,
    loading,
    saving,
    hasExistingSession,
    saveProgress,
    completeSession,
    resetSession,
    initialStep: session?.current_step || 0,
    initialAnswers: session?.quiz_data || {},
  }
}

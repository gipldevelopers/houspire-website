import { useState, useEffect, useCallback } from 'react'
import { appDataClient } from '@/lib/static-client'
import { useAuth } from '@/contexts/AuthContext'
import { useToast } from '@/hooks/use-toast'

export function useQuizResults() {
  const { user } = useAuth()
  const { toast } = useToast()
  const [quizResults, setQuizResults] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user) {
      fetchQuizResults()
    } else {
      setLoading(false)
    }
  }, [user])

  const fetchQuizResults = async () => {
    if (!user) return

    const { data, error } = await appDataClient
      .from('quiz_results')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle()

    if (!error && data) {
      setQuizResults(data)
    }
    setLoading(false)
  }

  const saveQuizResults = async (answers, designerMatch) => {
    if (!user) {
      localStorage.setItem('quizResults', JSON.stringify({
        answers,
        designerMatch,
        timestamp: Date.now(),
      }))
      return { success: true }
    }

    const styleScores = calculateStyleScores(answers)

    const { data, error } = await appDataClient
      .from('quiz_results')
      .upsert({
        user_id: user.id,
        styles: answers.styles,
        colors: answers.colors,
        vibe: answers.vibe,
        personality: answers.personality,
        lifestyle: answers.lifestyle,
        budget: answers.budget,
        primary_designer: designerMatch.designer.id,
        all_matches: designerMatch.designers,
        style_scores: styleScores,
        result_summary: `Your style is ${designerMatch.styleProfile} with a ${designerMatch.matchPercentage}% match!`,
        updated_at: new Date().toISOString(),
      })
      .select()
      .maybeSingle()

    if (error) {
      console.error('Error saving quiz results:', error)
      return { success: false, error }
    }

    try {
      await appDataClient.rpc('record_quiz_completion', {
        p_room_type: answers.lifestyle?.room_type || 'living_room',
        p_style_preference: answers.styles[0] || 'modern',
        p_budget_range: answers.budget,
      })
    } catch (analyticsError) {
      console.error('Failed to record quiz analytics:', analyticsError)
    }

    if (data) {
      setQuizResults(data)
    }
    return { success: true, data }
  }

  const generateShareToken = useCallback(async (resultId) => {
    try {
      const { data, error } = await appDataClient.rpc('generate_quiz_share_token', {
        p_result_id: resultId,
      })

      if (error) throw error

      toast({
        title: 'Share link created! 🔗',
        description: 'Your results can now be shared with others.',
      })

      return data
    } catch (error) {
      console.error('Failed to generate share token:', error)
      toast({
        title: 'Failed to create share link',
        description: 'Please try again.',
        variant: 'destructive',
      })
      return null
    }
  }, [toast])

  const getStoredResults = () => {
    const stored = localStorage.getItem('quizResults')
    if (stored) {
      try {
        return JSON.parse(stored)
      } catch {
        return null
      }
    }
    return quizResults
  }

  return {
    quizResults,
    loading,
    saveQuizResults,
    getStoredResults,
    generateShareToken,
    refetch: fetchQuizResults,
  }
}

function calculateStyleScores(answers) {
  const scores = {
    modern: 0,
    contemporary: 0,
    traditional: 0,
    minimalist: 0,
    luxury: 0,
    bohemian: 0,
  }

  if (answers.styles.length > 0) {
    const primaryStyle = answers.styles[0].toLowerCase()
    if (primaryStyle in scores) {
      scores[primaryStyle] += 40
    }
    answers.styles.slice(1).forEach(style => {
      const s = style.toLowerCase()
      if (s in scores) {
        scores[s] += 20
      }
    })
  }

  const neutralColors = ['white', 'gray', 'beige', 'cream']
  const boldColors = ['blue', 'green', 'teal', 'navy']
  const warmColors = ['brown', 'terracotta', 'orange', 'red']

  answers.colors.forEach(color => {
    const c = color.toLowerCase()
    if (neutralColors.some(nc => c.includes(nc))) {
      scores.modern += 10
      scores.minimalist += 10
    }
    if (boldColors.some(bc => c.includes(bc))) {
      scores.contemporary += 10
      scores.bohemian += 5
    }
    if (warmColors.some(wc => c.includes(wc))) {
      scores.traditional += 10
    }
  })

  switch (answers.budget) {
    case 'budget':
      scores.minimalist += 15
      break
    case 'mid_range':
      scores.modern += 10
      scores.contemporary += 10
      break
    case 'premium':
      scores.luxury += 20
      scores.contemporary += 10
      break
  }

  Object.keys(scores).forEach(key => {
    scores[key] = Math.min(scores[key], 100)
  })

  return scores
}


import { useState, useEffect, useCallback } from 'react'
import { supabase } from '@/integrations/supabase/client'

export function useProjectStatus(userId) {
  const [projects, setProjects] = useState([])
  const [activeProject, setActiveProject] = useState(null)
  const [loading, setLoading] = useState(true)

  const fetchProjects = useCallback(async () => {
    if (!userId) {
      setLoading(false)
      return
    }

    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching projects:', error)
      setLoading(false)
      return
    }

    const typedData = data || []
    setProjects(typedData)
    
    if (typedData.length > 0 && !activeProject) {
      setActiveProject(typedData[0])
    }
    setLoading(false)
  }, [userId, activeProject])

  useEffect(() => {
    if (!userId) {
      setLoading(false)
      return
    }

    fetchProjects()

    const subscription = supabase
      .channel('projects_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'projects',
          filter: `user_id=eq.${userId}`,
        },
        () => {
          fetchProjects()
        }
      )
      .subscribe()

    return () => {
      subscription.unsubscribe()
    }
  }, [userId, fetchProjects])

  const refetch = useCallback(async () => {
    setLoading(true)
    await fetchProjects()
  }, [fetchProjects])

  return { projects, activeProject, loading, setActiveProject, refetch }
}

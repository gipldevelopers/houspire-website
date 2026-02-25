import { useState, useEffect } from 'react'
import { supabase } from '@/integrations/supabase/client'

export function useProjectContent(projectId) {
  const [content, setContent] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!projectId) {
      setLoading(false)
      return
    }

    fetchContent()
  }, [projectId])

  const fetchContent = async () => {
    if (!projectId) return

    setLoading(true)
    setError(null)

    const { data, error: fetchError } = await supabase
      .from('project_content')
      .select('*')
      .eq('project_id', projectId)
      .eq('is_published', true)
      .order('content_type')
      .order('created_at', { ascending: false })

    if (fetchError) {
      setError(fetchError)
    } else {
      setContent(data || [])
    }

    setLoading(false)
  }

  const getContentByType = (type) => {
    return content.filter((c) => c.content_type === type)
  }

  return {
    content,
    loading,
    error,
    refetch: fetchContent,
    renders: getContentByType('render'),
    moodboards: getContentByType('moodboard'),
    floorplans: getContentByType('floorplan'),
    documents: getContentByType('document'),
  }
}

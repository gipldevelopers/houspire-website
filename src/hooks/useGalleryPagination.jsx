import { useState, useCallback, useEffect, useRef } from 'react'
import { supabase } from '@/integrations/supabase/client'

const PAGE_SIZE = 24

export function useGalleryPagination(filters) {
  const [designs, setDesigns] = useState([])
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  const [error, setError] = useState(null)
  const [totalCount, setTotalCount] = useState(0)
  
  const cursorRef = useRef(null)
  const filtersRef = useRef('')

  const buildQuery = useCallback((cursor) => {
    let query = supabase
      .from('gallery_designs')
      .select('*', { count: 'exact' })
      .eq('is_published', true)

    if (filters.room && filters.room !== 'all') {
      query = query.eq('room_type', filters.room)
    }
    
    if (filters.style && filters.style !== 'all') {
      query = query.eq('style_primary', filters.style)
    }
    
    if (filters.budget && filters.budget !== 'all') {
      query = query.eq('budget_range', filters.budget)
    }
    
    if (filters.search) {
      query = query.or(
        `design_title.ilike.%${filters.search}%,design_description.ilike.%${filters.search}%,room_type.ilike.%${filters.search}%,style_primary.ilike.%${filters.search}%`
      )
    }

    switch (filters.sort) {
      case 'random':
        query = query.order('id', { ascending: false })
        break
      case 'popular':
        query = query
          .order('view_count', { ascending: false, nullsFirst: false })
          .order('save_count', { ascending: false, nullsFirst: false })
          .order('id', { ascending: false })
        break
      case 'most_viewed':
        query = query
          .order('view_count', { ascending: false, nullsFirst: false })
          .order('created_at', { ascending: false })
          .order('id', { ascending: false })
        break
      case 'most_liked':
        query = query
          .order('save_count', { ascending: false, nullsFirst: false })
          .order('created_at', { ascending: false })
          .order('id', { ascending: false })
        break
      case 'newest':
      default:
        query = query
          .order('is_featured', { ascending: false })
          .order('created_at', { ascending: false })
          .order('id', { ascending: false })
        break
    }

    if (cursor && filters.sort !== 'random') {
      switch (filters.sort) {
        case 'most_viewed':
          query = query.or(
            `view_count.lt.${cursor.view_count ?? 0},and(view_count.eq.${cursor.view_count ?? 0},id.lt.${cursor.id})`
          )
          break
        case 'most_liked':
          query = query.or(
            `save_count.lt.${cursor.save_count ?? 0},and(save_count.eq.${cursor.save_count ?? 0},id.lt.${cursor.id})`
          )
          break
        case 'popular':
          query = query.or(
            `view_count.lt.${cursor.view_count ?? 0},and(view_count.eq.${cursor.view_count ?? 0},id.lt.${cursor.id})`
          )
          break
        case 'newest':
        default:
          query = query.or(
            `created_at.lt.${cursor.created_at},and(created_at.eq.${cursor.created_at},id.lt.${cursor.id})`
          )
          break
      }
    }

    query = query.limit(PAGE_SIZE)

    return query
  }, [filters])

  const fetchInitial = useCallback(async () => {
    setLoading(true)
    setError(null)
    cursorRef.current = null
    
    try {
      const [queryResult, totalResult] = await Promise.all([
        buildQuery(null),
        supabase
          .from('gallery_designs')
          .select('*', { count: 'exact', head: true })
          .eq('is_published', true)
      ])

      const { data, error: fetchError, count: filteredCount } = queryResult
      const { count: publishedCount, error: countError } = totalResult

      if (fetchError) throw fetchError
      if (countError) console.warn('Failed to fetch total count:', countError)

      let resultData = data || []
      if (filters.sort === 'random' && resultData.length > 0) {
        resultData = [...resultData].sort(() => Math.random() - 0.5)
      }

      setDesigns(resultData)
      setTotalCount(publishedCount || filteredCount || 0)
      setHasMore((resultData.length) === PAGE_SIZE)

      if (data && data.length > 0) {
        const last = data[data.length - 1]
        cursorRef.current = {
          created_at: last.created_at,
          id: last.id,
          view_count: last.view_count,
          save_count: last.save_count,
        }
      }
    } catch (err) {
      setError(err.message || 'Failed to load designs')
      setDesigns([])
    } finally {
      setLoading(false)
    }
  }, [buildQuery])

  const loadMore = useCallback(async () => {
    if (loadingMore || !hasMore || !cursorRef.current) return

    setLoadingMore(true)

    try {
      const query = buildQuery(cursorRef.current)
      const { data, error: fetchError } = await query

      if (fetchError) throw fetchError

      if (data && data.length > 0) {
        setDesigns(prev => [...prev, ...data])
        setHasMore(data.length === PAGE_SIZE)

        const last = data[data.length - 1]
        cursorRef.current = {
          created_at: last.created_at,
          id: last.id,
          view_count: last.view_count,
          save_count: last.save_count,
        }
      } else {
        setHasMore(false)
      }
    } catch (err) {
      setError(err.message || 'Failed to load more designs')
    } finally {
      setLoadingMore(false)
    }
  }, [buildQuery, loadingMore, hasMore])

  useEffect(() => {
    const filterKey = JSON.stringify(filters)
    if (filterKey !== filtersRef.current) {
      filtersRef.current = filterKey
      fetchInitial()
    }
  }, [filters, fetchInitial])

  useEffect(() => {
    if (filtersRef.current === '') {
      filtersRef.current = JSON.stringify(filters)
      fetchInitial()
    }
  }, [])

  return {
    designs,
    loading,
    loadingMore,
    hasMore,
    error,
    loadMore,
    totalCount,
    refetch: fetchInitial,
  }
}

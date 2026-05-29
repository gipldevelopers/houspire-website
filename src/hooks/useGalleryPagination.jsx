import { useState, useCallback, useEffect, useRef } from 'react'
import { FALLBACK_GALLERY_DESIGNS } from '@/lib/fallback-gallery'

const PAGE_SIZE = 24
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'
const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:5000'

function getImageUrl(path) {
  if (!path) return ''
  if (path.startsWith('http://') || path.startsWith('https://')) return path
  if (path.startsWith('/uploads') || path.startsWith('/temp_uploads')) {
    return `${SERVER_URL}${path}`
  }
  return path
}

export function useGalleryPagination(filters) {
  const [designs, setDesigns] = useState([])
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  const [error, setError] = useState(null)
  const [totalCount, setTotalCount] = useState(0)
  
  const pageRef = useRef(1)
  const filtersRef = useRef('')

  const fetchDesignsFromApi = useCallback(async (pageNumber) => {
    const params = new URLSearchParams({
      page: pageNumber,
      limit: PAGE_SIZE,
      room: filters.room || 'all',
      style: filters.style || 'all',
      budget: filters.budget || 'all',
      search: filters.search || '',
      sort: filters.sort || 'newest',
    })

    const res = await fetch(`${API_URL}/gallery?${params.toString()}`)
    if (!res.ok) {
      throw new Error(`API error: ${res.status} ${res.statusText}`)
    }
    const json = await res.json()
    if (!json.success) {
      throw new Error(json.message || 'Failed to fetch designs')
    }

    const mapped = (json.data || []).map(design => ({
      ...design,
      cover_image_url: getImageUrl(design.cover_image_url),
      cloudinary_url: getImageUrl(design.cloudinary_url),
      render_urls: (design.render_urls || []).map(getImageUrl),
    }))

    return {
      designs: mapped,
      total: json.pagination?.total || 0,
      pages: json.pagination?.pages || 1,
    }
  }, [filters])

  // Local fallback mock pagination logic
  const fetchDesignsMock = useCallback((pageNumber) => {
    let list = [...FALLBACK_GALLERY_DESIGNS]

    if (filters.room && filters.room !== 'all') {
      list = list.filter(d => d.room_type === filters.room)
    }
    if (filters.style && filters.style !== 'all') {
      list = list.filter(d => d.style_primary === filters.style)
    }
    if (filters.budget && filters.budget !== 'all') {
      list = list.filter(d => d.budget_range === filters.budget)
    }
    if (filters.search) {
      const searchLower = filters.search.toLowerCase()
      list = list.filter(d => 
        (d.design_title || '').toLowerCase().includes(searchLower) ||
        (d.design_description || '').toLowerCase().includes(searchLower)
      )
    }

    if (filters.sort === 'random') {
      list.sort(() => Math.random() - 0.5)
    } else if (filters.sort === 'popular' || filters.sort === 'most_viewed') {
      list.sort((a, b) => (b.view_count || 0) - (a.view_count || 0))
    } else if (filters.sort === 'most_liked') {
      list.sort((a, b) => (b.save_count || 0) - (a.save_count || 0))
    }

    const startIndex = (pageNumber - 1) * PAGE_SIZE
    const endIndex = startIndex + PAGE_SIZE
    const sliced = list.slice(startIndex, endIndex)

    return {
      designs: sliced,
      total: list.length,
      pages: Math.ceil(list.length / PAGE_SIZE),
    }
  }, [filters])

  const fetchInitial = useCallback(async () => {
    setLoading(true)
    setError(null)
    pageRef.current = 1

    try {
      const result = await fetchDesignsFromApi(1)
      setDesigns(result.designs)
      setTotalCount(result.total)
      setHasMore(result.designs.length === PAGE_SIZE && 1 < result.pages)
    } catch (err) {
      console.warn('Backend API request failed. Falling back to local static mock data.', err)
      const result = fetchDesignsMock(1)
      setDesigns(result.designs)
      setTotalCount(result.total)
      setHasMore(result.designs.length === PAGE_SIZE && 1 < result.pages)
    } finally {
      setLoading(false)
    }
  }, [fetchDesignsFromApi, fetchDesignsMock])

  const loadMore = useCallback(async () => {
    if (loadingMore || !hasMore) return

    setLoadingMore(true)
    const nextPage = pageRef.current + 1

    try {
      const result = await fetchDesignsFromApi(nextPage)
      if (result.designs.length > 0) {
        setDesigns(prev => [...prev, ...result.designs])
        pageRef.current = nextPage
        setHasMore(result.designs.length === PAGE_SIZE && nextPage < result.pages)
      } else {
        setHasMore(false)
      }
    } catch (err) {
      console.warn('Backend API loadMore failed. Falling back to local static mock data.', err)
      const result = fetchDesignsMock(nextPage)
      if (result.designs.length > 0) {
        setDesigns(prev => [...prev, ...result.designs])
        pageRef.current = nextPage
        setHasMore(result.designs.length === PAGE_SIZE && nextPage < result.pages)
      } else {
        setHasMore(false)
      }
    } finally {
      setLoadingMore(false)
    }
  }, [fetchDesignsFromApi, fetchDesignsMock, loadingMore, hasMore])

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

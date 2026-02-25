import { useState, useEffect, useCallback } from 'react'

const STORAGE_KEY = 'houspire_liked_designs'

export function useLikedDesigns() {
  const [likedDesigns, setLikedDesigns] = useState(new Set())
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        const parsed = JSON.parse(stored)
        if (Array.isArray(parsed)) {
          setLikedDesigns(new Set(parsed))
        }
      }
    } catch (error) {
      console.error('Failed to load liked designs:', error)
    }
    setIsLoaded(true)
  }, [])

  useEffect(() => {
    if (isLoaded) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(Array.from(likedDesigns)))
      } catch (error) {
        console.error('Failed to save liked designs:', error)
      }
    }
  }, [likedDesigns, isLoaded])

  const toggleLike = useCallback((designId) => {
    setLikedDesigns((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(designId)) {
        newSet.delete(designId)
      } else {
        newSet.add(designId)
      }
      return newSet
    })
  }, [])

  const isLiked = useCallback((designId) => {
    return likedDesigns.has(designId)
  }, [likedDesigns])

  const addLike = useCallback((designId) => {
    setLikedDesigns((prev) => new Set(prev).add(designId))
  }, [])

  const removeLike = useCallback((designId) => {
    setLikedDesigns((prev) => {
      const newSet = new Set(prev)
      newSet.delete(designId)
      return newSet
    })
  }, [])

  return {
    likedDesigns,
    isLiked,
    toggleLike,
    addLike,
    removeLike,
    isLoaded,
    likedCount: likedDesigns.size,
  }
}

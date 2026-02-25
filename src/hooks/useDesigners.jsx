import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/integrations/supabase/client'

// Fetch all designers with optional filters
export function useDesigners(options = {}) {
  return useQuery({
    queryKey: ['designers', options],
    queryFn: async () => {
      let query = supabase
        .from('designer_profiles')
        .select('*')
        .eq('status', 'active')

      if (options.specialty) {
        query = query.or(`primary_specialty.eq.${options.specialty},specialties.cs.{${options.specialty}}`)
      }

      if (options.city) {
        query = query.eq('city', options.city)
      }

      if (options.minRating) {
        query = query.gte('rating', options.minRating)
      }

      if (options.availableOnly) {
        query = query.eq('is_available', true)
      }

      if (options.query) {
        query = query.or(`full_name.ilike.%${options.query}%,bio.ilike.%${options.query}%,primary_specialty.ilike.%${options.query}%`)
      }

      query = query
        .order('is_featured', { ascending: false })
        .order('rating', { ascending: false })
        .order('projects_completed', { ascending: false })

      if (options.limit) {
        query = query.limit(options.limit)
      }

      if (options.offset) {
        query = query.range(options.offset, options.offset + (options.limit || 50) - 1)
      }

      const { data, error } = await query

      if (error) throw error
      return data || []
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  })
}

// Fetch a single designer by slug
export function useDesigner(slug) {
  return useQuery({
    queryKey: ['designer', slug],
    queryFn: async () => {
      if (!slug) throw new Error('Slug is required')

      const { data, error } = await supabase
        .from('designer_profiles')
        .select('*')
        .eq('slug', slug)
        .eq('status', 'active')
        .maybeSingle()

      if (error) throw error
      return data || null
    },
    enabled: !!slug,
    staleTime: 1000 * 60 * 5,
  })
}

// Fetch designer reviews
export function useDesignerReviews(designerId, limit = 10) {
  return useQuery({
    queryKey: ['designer-reviews', designerId, limit],
    queryFn: async () => {
      if (!designerId) throw new Error('Designer ID is required')

      const { data, error } = await supabase
        .from('designer_reviews')
        .select('*')
        .eq('designer_id', designerId)
        .order('is_featured', { ascending: false })
        .order('created_at', { ascending: false })
        .limit(limit)

      if (error) throw error
      return data || []
    },
    enabled: !!designerId,
    staleTime: 1000 * 60 * 5,
  })
}

// Get unique cities from designers
export function useDesignerCities() {
  return useQuery({
    queryKey: ['designer-cities'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('designer_profiles')
        .select('city, country')
        .eq('status', 'active')

      if (error) throw error

      const uniqueCities = [...new Set(data?.map(d => d.city) || [])]
      return uniqueCities.sort()
    },
    staleTime: 1000 * 60 * 30, // 30 minutes
  })
}

// Get unique specialties from designers
export function useDesignerSpecialties() {
  return useQuery({
    queryKey: ['designer-specialties'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('designer_profiles')
        .select('primary_specialty')
        .eq('status', 'active')

      if (error) throw error

      const uniqueSpecialties = [...new Set(data?.map(d => d.primary_specialty) || [])]
      return uniqueSpecialties.sort()
    },
    staleTime: 1000 * 60 * 30,
  })
}

// Featured designers only
export function useFeaturedDesigners(limit = 6) {
  return useQuery({
    queryKey: ['featured-designers', limit],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('designer_profiles')
        .select('*')
        .eq('status', 'active')
        .eq('is_featured', true)
        .order('rating', { ascending: false })
        .limit(limit)

      if (error) throw error
      return data || []
    },
    staleTime: 1000 * 60 * 5,
  })
}

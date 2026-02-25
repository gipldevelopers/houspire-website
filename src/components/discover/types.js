export const GRID_SIZE_CONFIG = {
  compact: { rowHeight: 180, gap: 2, label: 'Compact' },
  default: { rowHeight: 280, gap: 4, label: 'Default' },
  large: { rowHeight: 380, gap: 6, label: 'Large' },
}

export const BENTO_PATTERNS = [
  { cols: 2, rows: 2, featured: true },
  { cols: 1, rows: 1, featured: false },
  { cols: 1, rows: 1, featured: false },
  { cols: 1, rows: 2, featured: false },
  { cols: 2, rows: 1, featured: false },
  { cols: 1, rows: 1, featured: false },
  { cols: 1, rows: 2, featured: false },
  { cols: 1, rows: 1, featured: false },
  { cols: 1, rows: 1, featured: false },
  { cols: 1, rows: 1, featured: false },
  { cols: 2, rows: 1, featured: true },
  { cols: 1, rows: 1, featured: false },
]

export const ROOM_TYPES = [
  { value: 'all', label: 'All Rooms' },
  { value: 'living_room', label: 'Living Room' },
  { value: 'master_bedroom', label: 'Master Bedroom' },
  { value: 'kids_bedroom', label: 'Kids Bedroom' },
  { value: 'guest_bedroom', label: 'Guest Bedroom' },
  { value: 'nursery', label: 'Nursery' },
  { value: 'kitchen', label: 'Kitchen' },
  { value: 'pantry', label: 'Pantry' },
  { value: 'dining_room', label: 'Dining Room' },
  { value: 'home_office', label: 'Home Office' },
  { value: 'bathroom', label: 'Bathroom' },
  { value: 'pooja_room', label: 'Pooja Room' },
  { value: 'balcony', label: 'Balcony' },
  { value: 'entryway', label: 'Entryway/Foyer' },
  { value: 'home_theatre', label: 'Home Theatre' },
  { value: 'gym', label: 'Home Gym' },
  { value: 'walk_in_wardrobe', label: 'Walk-in Wardrobe' },
  { value: 'laundry', label: 'Laundry Room' },
  { value: 'bar', label: 'Bar/Wine Room' },
  { value: 'library', label: 'Library/Study' },
  { value: 'terrace', label: 'Terrace/Outdoor' },
]

export const STYLES = [
  { value: 'all', label: 'All Styles' },
  { value: 'modern', label: 'Modern' },
  { value: 'contemporary', label: 'Contemporary' },
  { value: 'scandinavian', label: 'Scandinavian' },
  { value: 'minimalist', label: 'Minimalist' },
  { value: 'traditional_indian', label: 'Traditional Indian' },
  { value: 'rustic_farmhouse', label: 'Rustic Farmhouse' },
  { value: 'industrial', label: 'Industrial' },
  { value: 'bohemian', label: 'Bohemian' },
]

export const BUDGET_RANGES = [
  { value: 'all', label: 'All Budgets' },
  { value: 'budget', label: 'Budget (Rs50K-1L)' },
  { value: 'mid', label: 'Mid-Range (Rs1L-3L)' },
  { value: 'premium', label: 'Premium (Rs3L-5L)' },
  { value: 'luxury', label: 'Luxury (Rs5L+)' },
]

export const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest First' },
  { value: 'popular', label: 'Most Popular' },
  { value: 'most_viewed', label: 'Most Viewed' },
  { value: 'most_liked', label: 'Most Liked' },
  { value: 'random', label: 'Shuffle' },
]

export const formatText = (text) => {
  if (!text) return ''
  return String(text).replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase())
}

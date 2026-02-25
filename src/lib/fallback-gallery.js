/**
 * Fallback gallery designs when DB is empty or unavailable.
 * Used by /api/gallery and /api/gallery/[id].
 */
export const FALLBACK_GALLERY_DESIGNS = [
  { id: 'fb-1', design_title: 'Serene Minimalist Home Office', design_description: 'Clean lines and natural light.', room_type: 'living_room', style_primary: 'modern', budget_range: 'mid', cover_image_url: '/styles/japanese-zen/portfolio-6-home-office.png', cloudinary_url: '/styles/japanese-zen/portfolio-6-home-office.png', is_featured: true, render_urls: [] },
  { id: 'fb-2', design_title: 'Cozy Scandinavian Dining', design_description: 'Warm and inviting dining space.', room_type: 'dining_room', style_primary: 'scandinavian', budget_range: 'mid', cover_image_url: '/styles/japanese-zen/portfolio-4-dining-room.png', cloudinary_url: '/styles/japanese-zen/portfolio-4-dining-room.png', is_featured: false, render_urls: [] },
  { id: 'fb-3', design_title: 'Traditional Indian Kids Room', design_description: 'Heritage touches for the little ones.', room_type: 'master_bedroom', style_primary: 'traditional_indian', budget_range: 'premium', cover_image_url: '/styles/traditional-indian/portfolio-7-kids-bedroom.png', cloudinary_url: '/styles/traditional-indian/portfolio-7-kids-bedroom.png', is_featured: true, render_urls: [] },
  { id: 'fb-4', design_title: 'Modern Bathroom Retreat', design_description: 'Spa-like bathroom design.', room_type: 'bathroom', style_primary: 'contemporary', budget_range: 'luxury', cover_image_url: '/styles/japanese-zen/portfolio-5-bathroom.png', cloudinary_url: '/styles/japanese-zen/portfolio-5-bathroom.png', is_featured: false, render_urls: [] },
  { id: 'fb-5', design_title: 'Balcony Garden Oasis', design_description: 'Green escape in the city.', room_type: 'living_room', style_primary: 'scandinavian', budget_range: 'budget', cover_image_url: '/styles/traditional-indian/portfolio-8-balcony.png', cloudinary_url: '/styles/traditional-indian/portfolio-8-balcony.png', is_featured: false, render_urls: [] },
  { id: 'fb-6', design_title: 'Contemporary Dining Room', design_description: 'Elegant everyday dining.', room_type: 'dining_room', style_primary: 'contemporary', budget_range: 'mid', cover_image_url: '/styles/japanese-zen/portfolio-4-dining-room.png', cloudinary_url: '/styles/japanese-zen/portfolio-4-dining-room.png', is_featured: false, render_urls: [] },
];

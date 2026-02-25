import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DesignerAvatar } from '@/components/shared/DesignerAvatar';
import { Star, MapPin, Briefcase, Calendar, MessageCircle, ChevronRight, CheckCircle2, Video, Clock } from 'lucide-react';
// Helper to format next available date
function formatNextAvailable(dateStr) {
    if (!dateStr)
        return null;
    const date = new Date(dateStr);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const nextWeek = new Date(today);
    nextWeek.setDate(nextWeek.getDate() + 7);
    if (date <= today)
        return 'Available now';
    if (date <= tomorrow)
        return 'Tomorrow';
    if (date <= nextWeek) {
        const days = Math.ceil((date.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
        return `In ${days} days`;
    }
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}
export function DesignerCard({ designer, index, featured = false, viewMode, isSelected, onToggleSelect }) {
    const navigate = useNavigate();
    const [isHovered, setIsHovered] = useState(false);
    const [showBooking, setShowBooking] = useState(false);
    const initials = designer.full_name?.split(' ').map((n) => n[0]).join('') || 'D';
    // Get portfolio images (use first 3)
    const portfolioImages = designer.portfolio_images?.slice(0, 3) || [];
    const hasPortfolio = portfolioImages.length > 0;
    // Video and availability
    const hasVideoIntro = !!designer.video_intro_url;
    const nextAvailable = formatNextAvailable(designer.next_available_date);
    const handleQuickBook = (e) => {
        e.stopPropagation();
        navigate(`/designers/${designer.slug}?book=true`);
    };
    const handleContact = (e) => {
        e.stopPropagation();
        navigate(`/designers/${designer.slug}?contact=true`);
    };
    const handleWatchVideo = (e) => {
        e.stopPropagation();
        navigate(`/designers/${designer.slug}?video=true`);
    };
    // List View
    if (viewMode === 'list') {
        return (<motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * 0.05, duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}>
        <Card onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)} onClick={() => navigate(`/designers/${designer.slug}`)} className={`group p-5 cursor-pointer transition-all duration-300 ${featured
                ? 'border-amber-200 bg-gradient-to-r from-amber-50/50 to-orange-50/30 dark:from-amber-950/20 dark:to-orange-950/10'
                : 'hover:border-primary/30 hover:shadow-lg'} ${isSelected ? 'ring-2 ring-primary' : ''}`}>
          <div className="flex items-start gap-5">
            {/* Avatar Section */}
            <div className="relative flex-shrink-0">
              <DesignerAvatar avatarUrl={designer.avatar_url} slug={designer.slug} fullName={designer.full_name} className="w-20 h-20 ring-2 ring-background shadow-md" fallbackClassName="text-xl"/>
              {designer.is_available && (<span className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-3 border-background flex items-center justify-center">
                  <CheckCircle2 className="w-3 h-3 text-white"/>
                </span>)}
              {featured && (<span className="absolute -top-1 -left-1 w-6 h-6 bg-amber-500 rounded-full flex items-center justify-center shadow-md">
                  <Star className="w-3.5 h-3.5 text-white fill-white"/>
                </span>)}
            </div>

            {/* Main Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-4 mb-2">
                <div>
                  <h3 className="font-semibold text-lg group-hover:text-primary transition-colors">
                    {designer.display_name}
                  </h3>
                  <p className="text-sm text-muted-foreground">{designer.title}</p>
                </div>
                <div className="flex items-center gap-1.5 bg-amber-50 dark:bg-amber-950/30 px-2.5 py-1 rounded-full">
                  <Star className="w-4 h-4 text-amber-500 fill-amber-500"/>
                  <span className="font-semibold text-sm">{Number(designer.rating).toFixed(1)}</span>
                  <span className="text-xs text-muted-foreground">({designer.review_count})</span>
                </div>
              </div>

              {designer.tagline && (<p className="text-sm text-muted-foreground italic mb-3 line-clamp-1">
                  "{designer.tagline}"
                </p>)}

              {/* Video & Availability Badges */}
              <div className="flex flex-wrap items-center gap-2 mb-3">
                {hasVideoIntro && (<button onClick={handleWatchVideo} className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-purple-100 dark:bg-purple-950/30 text-purple-700 dark:text-purple-300 text-xs font-medium hover:bg-purple-200 dark:hover:bg-purple-900/40 transition-colors">
                    <Video className="w-3.5 h-3.5"/>
                    Watch Intro
                  </button>)}
                {nextAvailable && !designer.is_available && (<span className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-blue-100 dark:bg-blue-950/30 text-blue-700 dark:text-blue-300 text-xs font-medium">
                    <Clock className="w-3.5 h-3.5"/>
                    {nextAvailable}
                  </span>)}
              </div>

              <div className="flex flex-wrap items-center gap-4 text-sm mb-3">
                <span className="flex items-center gap-1.5 text-muted-foreground">
                  <Briefcase className="w-4 h-4"/>
                  <strong className="text-foreground">{designer.projects_completed}</strong> projects
                </span>
                <span className="flex items-center gap-1.5 text-muted-foreground">
                  <MapPin className="w-4 h-4"/>
                  {designer.city}, {designer.country}
                </span>
              </div>

              <div className="flex items-center justify-between gap-4">
                <div className="flex flex-wrap gap-1.5">
                  {designer.specialties?.slice(0, 3).map((s) => (<Badge key={s} variant="secondary" className="text-xs font-normal">
                      {s}
                    </Badge>))}
                  {designer.specialties && designer.specialties.length > 3 && (<Badge variant="outline" className="text-xs">
                      +{designer.specialties.length - 3}
                    </Badge>)}
                </div>
                
                {/* Quick Actions */}
                <div className="flex items-center gap-2">
                  <Button size="sm" variant="outline" onClick={handleContact} className="rounded-full gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                    <MessageCircle className="w-3.5 h-3.5"/>
                    Contact
                  </Button>
                  <Button size="sm" onClick={handleQuickBook} className="rounded-full gap-1.5">
                    <Calendar className="w-3.5 h-3.5"/>
                    Book ₹{designer.consultation_fee || 999}
                  </Button>
                </div>
              </div>
            </div>

            {/* Portfolio Preview (List) */}
            <AnimatePresence>
              {isHovered && hasPortfolio && (<motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className="hidden lg:flex gap-2 flex-shrink-0">
                  {portfolioImages.slice(0, 2).map((img, i) => (<div key={i} className="w-20 h-20 rounded-lg overflow-hidden bg-muted">
                      <img src={img} alt={`Portfolio ${i + 1}`} className="w-full h-full object-cover"/>
                    </div>))}
                </motion.div>)}
            </AnimatePresence>
          </div>
        </Card>
      </motion.div>);
    }
    // Grid View
    return (<motion.div initial={{ opacity: 0, y: 20, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{
            delay: index * 0.05,
            duration: 0.4,
            ease: [0.25, 0.1, 0.25, 1]
        }} className="h-full">
      <Card onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => { setIsHovered(false); setShowBooking(false); }} onClick={() => navigate(`/designers/${designer.slug}`)} className={`group relative h-full p-5 cursor-pointer transition-all duration-300 hover:shadow-xl ${featured
            ? 'border-amber-200 bg-gradient-to-br from-amber-50/50 to-orange-50/30 dark:from-amber-950/20 dark:to-orange-950/10'
            : 'hover:border-primary/30 hover:-translate-y-1'} ${isSelected ? 'ring-2 ring-primary' : ''}`}>
        {/* Featured Badge */}
        {featured && (<div className="absolute -top-2 -right-2 z-10">
            <span className="flex items-center gap-1 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs font-medium px-2.5 py-1 rounded-full shadow-lg">
              <Star className="w-3 h-3 fill-white"/>
              Featured
            </span>
          </div>)}

        {/* Header with Avatar */}
        <div className="flex items-start gap-4 mb-4">
          <div className="relative flex-shrink-0">
            <DesignerAvatar avatarUrl={designer.avatar_url} slug={designer.slug} fullName={designer.full_name} className="w-14 h-14 ring-2 ring-background shadow-md transition-transform group-hover:scale-105"/>
            {designer.is_available && (<span className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-green-500 rounded-full border-2 border-background"/>)}
          </div>

          <div className="flex-1 min-w-0">
            <h3 className="font-semibold truncate group-hover:text-primary transition-colors">
              {designer.display_name}
            </h3>
            <p className="text-sm text-muted-foreground truncate">{designer.title}</p>
            <div className="flex items-center gap-1.5 mt-1">
              <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500"/>
              <span className="text-sm font-medium">{Number(designer.rating).toFixed(1)}</span>
              <span className="text-xs text-muted-foreground">({designer.review_count})</span>
            </div>
          </div>
        </div>

        {/* Portfolio Preview on Hover */}
        <AnimatePresence mode="wait">
          {isHovered && hasPortfolio ? (<motion.div key="portfolio" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.2 }} className="mb-4 overflow-hidden">
              <div className="grid grid-cols-3 gap-2">
                {portfolioImages.map((img, i) => (<motion.div key={i} initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.05 }} className="aspect-square rounded-lg overflow-hidden bg-muted">
                    <img src={img} alt={`Portfolio ${i + 1}`} className="w-full h-full object-cover transition-transform hover:scale-110"/>
                  </motion.div>))}
              </div>
              <p className="text-xs text-muted-foreground text-center mt-2">
                View full portfolio →
              </p>
            </motion.div>) : (<motion.div key="tagline" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              {designer.tagline && (<p className="text-sm text-muted-foreground italic mb-4 line-clamp-2">
                  "{designer.tagline}"
                </p>)}
            </motion.div>)}
        </AnimatePresence>

        {/* Specialties */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {designer.specialties?.slice(0, 3).map((s) => (<Badge key={s} variant="secondary" className="text-xs font-normal">
              {s}
            </Badge>))}
          {designer.specialties && designer.specialties.length > 3 && (<Badge variant="outline" className="text-xs">
              +{designer.specialties.length - 3}
            </Badge>)}
        </div>

        {/* Video & Availability Row */}
        <div className="flex flex-wrap items-center gap-2 mb-3">
          {hasVideoIntro && (<button onClick={handleWatchVideo} className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-purple-100 dark:bg-purple-950/30 text-purple-700 dark:text-purple-300 text-xs font-medium hover:bg-purple-200 dark:hover:bg-purple-900/40 transition-colors">
              <Video className="w-3 h-3"/>
              Video
            </button>)}
          {nextAvailable && !designer.is_available && (<span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-950/30 text-blue-700 dark:text-blue-300 text-xs">
              <Clock className="w-3 h-3"/>
              {nextAvailable}
            </span>)}
        </div>

        {/* Stats Row */}
        <div className="flex items-center gap-4 text-xs text-muted-foreground mb-4">
          <span className="flex items-center gap-1">
            <Briefcase className="w-3.5 h-3.5"/>
            <strong className="text-foreground">{designer.projects_completed}</strong> projects
          </span>
          <span className="flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5"/>
            {designer.city}
          </span>
        </div>

        {/* CTA Buttons */}
        <div className="space-y-2">
          <Button onClick={handleQuickBook} className="w-full rounded-xl gap-2 transition-all" size="sm">
            <Calendar className="w-4 h-4"/>
            Book Consultation - ₹{designer.consultation_fee || 999}
          </Button>
          
          <AnimatePresence>
            {isHovered && (<motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}>
                <Button variant="outline" onClick={(e) => {
                e.stopPropagation();
                navigate(`/designers/${designer.slug}`);
            }} className="w-full rounded-xl gap-2" size="sm">
                  View Full Profile
                  <ChevronRight className="w-4 h-4"/>
                </Button>
              </motion.div>)}
          </AnimatePresence>
        </div>
      </Card>
    </motion.div>);
}
// Enhanced Loading Skeleton
export function DesignerCardSkeleton({ index = 0 }) {
    return (<motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: index * 0.1 }}>
      <Card className="p-5 h-full">
        <div className="flex gap-4 mb-4">
          <div className="w-14 h-14 rounded-full bg-muted animate-pulse"/>
          <div className="flex-1 space-y-2">
            <div className="h-5 w-3/4 bg-muted rounded animate-pulse"/>
            <div className="h-4 w-1/2 bg-muted rounded animate-pulse"/>
            <div className="h-3 w-1/3 bg-muted rounded animate-pulse"/>
          </div>
        </div>
        
        {/* Tagline skeleton */}
        <div className="space-y-2 mb-4">
          <div className="h-4 w-full bg-muted rounded animate-pulse"/>
          <div className="h-4 w-2/3 bg-muted rounded animate-pulse"/>
        </div>
        
        {/* Badges skeleton */}
        <div className="flex gap-2 mb-4">
          <div className="h-6 w-20 bg-muted rounded-full animate-pulse"/>
          <div className="h-6 w-16 bg-muted rounded-full animate-pulse"/>
          <div className="h-6 w-24 bg-muted rounded-full animate-pulse"/>
        </div>
        
        {/* Stats skeleton */}
        <div className="flex gap-4 mb-4">
          <div className="h-4 w-20 bg-muted rounded animate-pulse"/>
          <div className="h-4 w-16 bg-muted rounded animate-pulse"/>
        </div>
        
        {/* Button skeleton */}
        <div className="h-9 w-full bg-muted rounded-xl animate-pulse"/>
      </Card>
    </motion.div>);
}

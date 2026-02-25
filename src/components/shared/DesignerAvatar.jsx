import { useState, useCallback } from 'react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
/**
 * Resilient designer avatar component with multi-step fallback:
 * 1. Uses provided avatarUrl first
 * 2. Falls back to deterministic path: /designers/avatars/{slug}.jpg
 * 3. Falls back to DiceBear generated avatar
 * 4. Final fallback: initials
 */
export function DesignerAvatar({ avatarUrl, slug, fullName, className, fallbackClassName, }) {
    const [fallbackLevel, setFallbackLevel] = useState(0);
    const [imageLoaded, setImageLoaded] = useState(false);
    const initials = fullName
        ?.split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2) || 'D';
    // Generate fallback sources in order
    const getImageSrc = useCallback(() => {
        switch (fallbackLevel) {
            case 0:
                // First try: provided avatar URL
                return avatarUrl || undefined;
            case 1:
                // Second try: slug-based path
                return `/designers/avatars/${slug}.jpg`;
            case 2:
                // Third try: DiceBear API (deterministic based on name)
                return `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(fullName)}&backgroundColor=c084fc,a855f7,9333ea&backgroundType=gradientLinear`;
            default:
                // Final: no image, show initials fallback
                return undefined;
        }
    }, [fallbackLevel, avatarUrl, slug, fullName]);
    const handleError = useCallback(() => {
        // Move to next fallback level (max 3 = initials only)
        if (fallbackLevel < 3) {
            setFallbackLevel((prev) => prev + 1);
            setImageLoaded(false);
        }
    }, [fallbackLevel]);
    const handleLoad = useCallback(() => {
        setImageLoaded(true);
    }, []);
    const currentSrc = getImageSrc();
    return (<Avatar className={cn('bg-muted', className)}>
      {currentSrc && fallbackLevel < 3 && (<AvatarImage src={currentSrc} alt={fullName} onError={handleError} onLoad={handleLoad} className="object-cover"/>)}
      <AvatarFallback className={cn('bg-primary/10 text-primary font-medium', fallbackClassName)}>
        {initials}
      </AvatarFallback>
    </Avatar>);
}
// Re-export for convenience
export default DesignerAvatar;

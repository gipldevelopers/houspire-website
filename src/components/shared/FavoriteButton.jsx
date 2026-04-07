import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { appDataClient } from '@/lib/static-client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Heart } from 'lucide-react';
import { cn } from '@/lib/utils';
export function FavoriteButton({ itemType, itemId, itemData, projectId, size = 'md', showLabel = false, className = '', }) {
    const { user } = useAuth();
    const { toast } = useToast();
    const [isFavorited, setIsFavorited] = useState(false);
    const [loading, setLoading] = useState(false);
    useEffect(() => {
        checkIfFavorited();
    }, [itemType, itemId, user]);
    const checkIfFavorited = async () => {
        if (!user)
            return;
        try {
            const { data, error } = await appDataClient.rpc('is_favorited', {
                p_item_type: itemType,
                p_item_id: itemId,
            });
            if (error)
                throw error;
            setIsFavorited(data || false);
        }
        catch (error) {
            console.error('Failed to check favorite status:', error);
        }
    };
    const toggleFavorite = async (e) => {
        e.stopPropagation();
        e.preventDefault();
        if (!user) {
            toast({
                title: 'Sign in required',
                description: 'Please sign in to save favorites',
                variant: 'destructive',
            });
            return;
        }
        setLoading(true);
        try {
            if (isFavorited) {
                const { error } = await appDataClient.rpc('remove_from_favorites', {
                    p_item_type: itemType,
                    p_item_id: itemId,
                });
                if (error)
                    throw error;
                setIsFavorited(false);
                toast({
                    title: 'Removed from favorites',
                });
            }
            else {
                const { error } = await appDataClient.rpc('add_to_favorites', {
                    p_item_type: itemType,
                    p_item_id: itemId,
                    p_item_data: itemData,
                    p_project_id: projectId || null,
                });
                if (error)
                    throw error;
                setIsFavorited(true);
                toast({
                    title: 'Added to favorites! ❤️',
                    description: 'View all your favorites in your profile',
                });
            }
        }
        catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            toast({
                title: 'Failed to update favorites',
                description: errorMessage,
                variant: 'destructive',
            });
        }
        finally {
            setLoading(false);
        }
    };
    const sizeClasses = {
        sm: 'h-8 w-8',
        md: 'h-10 w-10',
        lg: 'h-12 w-12',
    };
    const iconSizes = {
        sm: 'h-4 w-4',
        md: 'h-5 w-5',
        lg: 'h-6 w-6',
    };
    return (<Button onClick={toggleFavorite} disabled={loading} variant="ghost" size="icon" className={cn(sizeClasses[size], 'rounded-full transition-all duration-300', isFavorited
            ? 'bg-red-50 hover:bg-red-100 text-red-500'
            : 'bg-white/90 hover:bg-white text-neutral-600 hover:text-red-500', className)}>
      {loading ? (<div className={cn(iconSizes[size], 'border-2 border-current border-t-transparent rounded-full animate-spin')}/>) : (<motion.div animate={isFavorited ? { scale: [1, 1.3, 1] } : { scale: 1 }} transition={{ duration: 0.3 }}>
          <Heart className={cn(iconSizes[size], isFavorited && 'fill-current')}/>
        </motion.div>)}
      {showLabel && (<span className="ml-2 text-sm font-medium">
          {isFavorited ? 'Favorited' : 'Favorite'}
        </span>)}
    </Button>);
}


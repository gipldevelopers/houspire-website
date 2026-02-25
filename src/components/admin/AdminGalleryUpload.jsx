import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, } from '@/components/ui/dialog';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useConfirm } from '@/hooks/useConfirm';
import { GalleryImageEditModal } from './GalleryImageEditModal';
import { DuplicateAnalysisPanel } from './DuplicateAnalysisPanel';
import { smartParseFilename, parseHouspireFilename, extractTagsFromFilename, STYLE_LABELS, ROOM_LABELS, BUDGET_LABELS } from '@/lib/houspireFilenameParser';
import { exportGalleryCoverageMatrix } from '@/lib/exportUtils';
import { uploadToCloudinary } from '@/lib/cloudinaryUpload';
import { Upload, FileImage, Check, X, Download, FileSpreadsheet, AlertCircle, Wand, Trash2, Eye, Settings as SettingsIcon, Loader2, Image as ImageIcon, HardDrive, Zap, Clock, Pencil, Search, RefreshCw, Tag, Wand2, SlidersHorizontal, Copy, ArrowRight, SkipForward, Replace, FilePlus, Layers, Globe, EyeOff, } from 'lucide-react';
// Parallel AI generation config
const CONCURRENT_AI_REQUESTS = 4; // Process 4 images simultaneously
export function AdminGalleryUpload() {
    const { toast } = useToast();
    const { confirm, ConfirmDialog } = useConfirm();
    const [images, setImages] = useState([]);
    const [categories, setCategories] = useState([]);
    const [uploading, setUploading] = useState(false);
    const [progress, setProgress] = useState(0);
    const [showSettings, setShowSettings] = useState(false);
    const [galleryStats, setGalleryStats] = useState(null);
    // Existing images management
    const [existingImages, setExistingImages] = useState([]);
    const [loadingExisting, setLoadingExisting] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [editingImage, setEditingImage] = useState(null);
    const [deletingId, setDeletingId] = useState(null);
    const [autoGenerateAI, setAutoGenerateAI] = useState(true);
    const [rectifying, setRectifying] = useState(false);
    // Filters for existing images
    const [filterRoomType, setFilterRoomType] = useState('all');
    const [filterStyle, setFilterStyle] = useState('all');
    const [filterBudget, setFilterBudget] = useState('all');
    const [filterPublished, setFilterPublished] = useState('all');
    const [filterAIStatus, setFilterAIStatus] = useState('all');
    const [filterFeatured, setFilterFeatured] = useState('all');
    // Duplicate detection
    const [duplicateChecks, setDuplicateChecks] = useState([]);
    const [showDuplicateModal, setShowDuplicateModal] = useState(false);
    const [showDuplicateAnalysis, setShowDuplicateAnalysis] = useState(false);
    // Bulk selection for existing images
    const [selectedImageIds, setSelectedImageIds] = useState(new Set());
    const [bulkAIGenerating, setBulkAIGenerating] = useState(false);
    const [bulkAIProgress, setBulkAIProgress] = useState({ current: 0, total: 0, batch: 0, totalBatches: 0 });
    const [currentlyProcessingIds, setCurrentlyProcessingIds] = useState(new Set());
    const [bulkPublishing, setBulkPublishing] = useState(false);
    const [hasMoreImages, setHasMoreImages] = useState(false);
    const [loadingMore, setLoadingMore] = useState(false);
    const [totalImageCount, setTotalImageCount] = useState(0);
    const [lastCursor, setLastCursor] = useState(null);
    const [loadAllUsageCount, setLoadAllUsageCount] = useState(0);
    const MAX_LOAD_ALL_USES = 2;
    useEffect(() => {
        fetchCategories();
        fetchGalleryStats();
        fetchExistingImages();
    }, []);
    const fetchCategories = async () => {
        // For now, use static categories since gallery_categories may not exist
        setCategories([
            { id: '1', category_name: 'Living Rooms', slug: 'living-rooms', display_order: 1 },
            { id: '2', category_name: 'Bedrooms', slug: 'bedrooms', display_order: 2 },
            { id: '3', category_name: 'Kitchens', slug: 'kitchens', display_order: 3 },
            { id: '4', category_name: 'Bathrooms', slug: 'bathrooms', display_order: 4 },
        ]);
    };
    const fetchGalleryStats = async () => {
        // Get accurate count using count query (bypasses 1000 row limit)
        const { count: totalCount, error: countError } = await supabase
            .from('gallery_designs')
            .select('*', { count: 'exact', head: true });
        const { count: publishedCount } = await supabase
            .from('gallery_designs')
            .select('*', { count: 'exact', head: true })
            .eq('is_published', true);
        const { count: unpublishedCount } = await supabase
            .from('gallery_designs')
            .select('*', { count: 'exact', head: true })
            .eq('is_published', false);
        if (!countError) {
            setGalleryStats({
                total_images: totalCount || 0,
                published_images: publishedCount || 0,
                unpublished_images: unpublishedCount || 0,
                optimized_images: totalCount || 0,
                pending_optimization: 0,
                total_original_size: 0,
                total_compressed_size: 0,
                total_space_saved: 0,
                avg_compression_ratio: 70,
            });
        }
        else {
            setGalleryStats({
                total_images: 0,
                published_images: 0,
                unpublished_images: 0,
                optimized_images: 0,
                pending_optimization: 0,
                total_original_size: 0,
                total_compressed_size: 0,
                total_space_saved: 0,
                avg_compression_ratio: 0,
            });
        }
    };
    const fetchExistingImages = async (loadMore = false) => {
        if (loadMore) {
            setLoadingMore(true);
        }
        else {
            setLoadingExisting(true);
            setLastCursor(null); // Reset cursor on fresh fetch
        }
        try {
            const pageSize = 100;
            // Build query with cursor-based pagination (bypasses Supabase 1000 row limit)
            let query = supabase
                .from('gallery_designs')
                .select('id, design_title, design_description, cover_image_url, style_primary, room_type, budget_range, is_featured, is_published, key_features, created_at', { count: 'exact' })
                .order('created_at', { ascending: false })
                .order('id', { ascending: false })
                .limit(pageSize);
            // If loading more, use a stable composite cursor (created_at + id)
            // IMPORTANT: created_at is not unique; relying on only created_at can cause
            // pagination to skip rows and appear "stuck" around ~1000.
            if (loadMore && lastCursor) {
                query = query.or(`created_at.lt.${lastCursor.created_at},and(created_at.eq.${lastCursor.created_at},id.lt.${lastCursor.id})`);
            }
            const { data, error, count } = await query;
            if (error)
                throw error;
            if (loadMore) {
                setExistingImages(prev => [...prev, ...(data || [])]);
            }
            else {
                setExistingImages(data || []);
            }
            // Update cursor for next page
            if (data && data.length > 0) {
                const last = data[data.length - 1];
                setLastCursor({ created_at: last.created_at, id: last.id });
            }
            // Check if there are more images (if we got a full page, there's likely more)
            setTotalImageCount(count || 0);
            setHasMoreImages((data?.length || 0) === pageSize);
        }
        catch (error) {
            console.error('Failed to fetch gallery images:', error);
        }
        finally {
            setLoadingExisting(false);
            setLoadingMore(false);
        }
    };
    const handleDeleteImage = async (imageId, imageTitle) => {
        const confirmed = await confirm({
            title: 'Delete Gallery Image',
            description: `Are you sure you want to delete "${imageTitle}"? This action cannot be undone.`,
            confirmText: 'Delete',
            cancelText: 'Cancel',
            variant: 'danger',
        });
        if (!confirmed)
            return;
        setDeletingId(imageId);
        try {
            const { error } = await supabase
                .from('gallery_designs')
                .delete()
                .eq('id', imageId);
            if (error)
                throw error;
            toast({
                title: 'Image deleted',
                description: 'Gallery image has been deleted successfully.',
            });
            // Remove from local state
            setExistingImages((prev) => prev.filter((img) => img.id !== imageId));
            fetchGalleryStats();
        }
        catch (error) {
            console.error('Delete error:', error);
            toast({
                title: 'Delete failed',
                description: error.message,
                variant: 'destructive',
            });
        }
        finally {
            setDeletingId(null);
        }
    };
    const filteredExistingImages = existingImages.filter((img) => {
        // Search filter
        const matchesSearch = !searchQuery ||
            img.design_title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            img.style_primary.toLowerCase().includes(searchQuery.toLowerCase()) ||
            img.room_type.toLowerCase().includes(searchQuery.toLowerCase());
        // Room type filter
        const matchesRoom = filterRoomType === 'all' || img.room_type === filterRoomType;
        // Style filter
        const matchesStyle = filterStyle === 'all' || img.style_primary === filterStyle;
        // Budget filter
        const matchesBudget = filterBudget === 'all' || img.budget_range === filterBudget;
        // Featured filter
        const matchesFeatured = filterFeatured === 'all' ||
            (filterFeatured === 'featured' && img.is_featured) ||
            (filterFeatured === 'standard' && !img.is_featured);
        // Published filter
        const matchesPublished = filterPublished === 'all' ||
            (filterPublished === 'published' && img.is_published) ||
            (filterPublished === 'unpublished' && !img.is_published);
        // AI Description status filter
        const hasDescription = img.design_description && img.design_description.trim().length > 0;
        const matchesAIStatus = filterAIStatus === 'all' ||
            (filterAIStatus === 'has_description' && hasDescription) ||
            (filterAIStatus === 'needs_description' && !hasDescription);
        return matchesSearch && matchesRoom && matchesStyle && matchesBudget && matchesFeatured && matchesPublished && matchesAIStatus;
    });
    // Get unique values for filter dropdowns
    const uniqueRoomTypes = [...new Set(existingImages.map((img) => img.room_type))].filter(Boolean);
    const uniqueStyles = [...new Set(existingImages.map((img) => img.style_primary))].filter(Boolean);
    const uniqueBudgets = [...new Set(existingImages.map((img) => img.budget_range))].filter(Boolean);
    const hasActiveFilters = filterRoomType !== 'all' || filterStyle !== 'all' || filterBudget !== 'all' || filterFeatured !== 'all' || filterPublished !== 'all' || filterAIStatus !== 'all';
    const clearAllFilters = () => {
        setFilterRoomType('all');
        setFilterStyle('all');
        setFilterBudget('all');
        setFilterFeatured('all');
        setFilterPublished('all');
        setFilterAIStatus('all');
        setSearchQuery('');
    };
    // Convert file to base64 for AI analysis
    const fileToBase64 = (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result);
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });
    };
    const getCleanFilenameFromUrl = (url) => {
        const urlParts = url.split('/');
        const filename = urlParts[urlParts.length - 1] || '';
        // Remove timestamp prefix if present (e.g., "1769582070764-")
        return filename.replace(/^\d+-/, '');
    };
    const looksRandomTitle = (title) => {
        return (/^[\d\s]+[a-zA-Z0-9]{10,}/.test(title) ||
            title.includes('L2hvbWU') ||
            /^\d+\s+\w{20,}/.test(title));
    };
    // Generate AI metadata for an image
    const generateAIMetadata = async (imageData, index) => {
        if (!imageData.file)
            return;
        // Update status to generating
        setImages((prev) => prev.map((img, i) => (i === index ? { ...img, aiStatus: 'generating' } : img)));
        try {
            const base64 = await fileToBase64(imageData.file);
            // IMPORTANT: If the filename didn’t provide reliable tags, don’t pass defaults
            // (like living_room / modern_minimalist) into the AI prompt as it can bias detection.
            const body = {
                imageBase64: base64,
                budgetRange: imageData.budgetRange,
                viewType: imageData.tags[0] || 'main',
            };
            if (imageData.isHouspireFormat) {
                body.roomType = imageData.roomType;
                body.style = imageData.style;
            }
            const { data, error } = await supabase.functions.invoke('generate-image-metadata', {
                body,
            });
            if (error)
                throw error;
            // Update with AI-generated content including detected room type and style
            setImages((prev) => prev.map((img, i) => i === index
                ? {
                    ...img,
                    title: data.title || img.title,
                    description: data.description || img.description,
                    keyFeatures: data.keyFeatures || img.keyFeatures,
                    // Use AI-detected room type and style if available
                    roomType: data.detectedRoomType || img.roomType,
                    roomTypeLabel: ROOM_LABELS[data.detectedRoomType] || img.roomTypeLabel,
                    style: data.detectedStyle || img.style,
                    styleLabel: STYLE_LABELS[data.detectedStyle] || img.styleLabel,
                    aiStatus: 'done',
                }
                : img));
            toast({
                title: 'AI Metadata Generated',
                description: `Generated title and description for ${imageData.file.name}`,
            });
        }
        catch (error) {
            console.error('AI generation error:', error);
            setImages((prev) => prev.map((img, i) => (i === index ? { ...img, aiStatus: 'error' } : img)));
            toast({
                title: 'AI Generation Failed',
                description: error.message || 'Failed to generate metadata',
                variant: 'destructive',
            });
        }
    };
    // Check for duplicates based on filename pattern
    const findDuplicate = (filename) => {
        // Extract the design ID pattern from the filename (e.g., HOS_KB_SCA_PRE_0102)
        const pattern = /^HOS_([A-Z]{2})_([A-Z]{3})_([A-Z]{3})_(\d+)/i;
        const match = filename.match(pattern);
        if (match) {
            const designPattern = match[0].toUpperCase();
            // Find existing image with same pattern
            return existingImages.find(img => {
                const url = img.cover_image_url.toUpperCase();
                return url.includes(designPattern);
            });
        }
        // Also check for exact filename match
        const filenameWithoutExt = filename.replace(/\.[^/.]+$/, '').toLowerCase();
        return existingImages.find(img => {
            const existingFilename = img.cover_image_url.split('/').pop()?.replace(/^\d+-/, '').replace(/\.[^/.]+$/, '').toLowerCase();
            return existingFilename === filenameWithoutExt;
        });
    };
    // Handle file selection with duplicate detection
    const handleFileSelect = async (e) => {
        const files = Array.from(e.target.files || []);
        const duplicates = [];
        const newImages = await Promise.all(files.map(async (file, idx) => {
            const parsed = smartParseFilename(file.name, images.length + idx);
            const duplicate = findDuplicate(file.name);
            // Create preview URL for the file
            const previewUrl = URL.createObjectURL(file);
            const imageData = {
                file,
                previewUrl,
                title: parsed.title,
                category: categories[0]?.id || '',
                style: parsed.style,
                styleLabel: STYLE_LABELS[parsed.style] || parsed.style,
                roomType: parsed.roomType,
                roomTypeLabel: ROOM_LABELS[parsed.roomType] || parsed.roomType,
                budgetRange: parsed.budgetRange,
                budgetLabel: BUDGET_LABELS[parsed.budgetRange] || parsed.budgetRange,
                tags: parsed.tags,
                tier: parsed.isFeatured ? 'Premium' : 'Standard',
                isFeatured: parsed.isFeatured,
                isHouspireFormat: parsed.isHouspireFormat,
                status: 'pending',
                // Auto-enable AI for files that need metadata detection (random filenames)
                aiStatus: (autoGenerateAI || parsed.needsAIMetadata) ? 'idle' : undefined,
                duplicateOf: duplicate,
            };
            if (duplicate) {
                duplicates.push({
                    newImage: imageData,
                    newImageIndex: images.length + idx,
                    existingImage: duplicate,
                    action: 'pending',
                });
            }
            return imageData;
        }));
        const startIndex = images.length;
        setImages([...images, ...newImages]);
        // Show duplicate modal if any duplicates found
        if (duplicates.length > 0) {
            setDuplicateChecks(duplicates);
            setShowDuplicateModal(true);
        }
        else {
            // Auto-generate AI metadata for each image if no duplicates
            if (autoGenerateAI) {
                for (let i = 0; i < newImages.length; i++) {
                    await generateAIMetadata(newImages[i], startIndex + i);
                }
            }
        }
    };
    // Handle duplicate resolution
    const handleDuplicateAction = async (index, action) => {
        setDuplicateChecks(prev => prev.map((check, i) => i === index ? { ...check, action } : check));
    };
    // Apply duplicate resolutions
    const applyDuplicateResolutions = async () => {
        const updatedImages = [...images];
        const imagesToRemove = [];
        const imagesToProcess = [];
        for (const check of duplicateChecks) {
            const imageIndex = updatedImages.findIndex(img => img.file?.name === check.newImage.file?.name && img.status === 'pending');
            if (imageIndex === -1)
                continue;
            if (check.action === 'skip') {
                imagesToRemove.push(imageIndex);
            }
            else if (check.action === 'overwrite') {
                // Mark for overwrite - will delete existing during upload
                updatedImages[imageIndex] = {
                    ...updatedImages[imageIndex],
                    duplicateOf: check.existingImage,
                };
                imagesToProcess.push(imageIndex);
            }
            else if (check.action === 'rename') {
                // Add suffix to title
                const timestamp = Date.now();
                updatedImages[imageIndex] = {
                    ...updatedImages[imageIndex],
                    title: `${updatedImages[imageIndex].title} (${timestamp})`,
                    duplicateOf: undefined,
                };
                imagesToProcess.push(imageIndex);
            }
        }
        // Remove skipped images (in reverse order to maintain indices)
        imagesToRemove.sort((a, b) => b - a).forEach(idx => {
            if (updatedImages[idx].previewUrl) {
                URL.revokeObjectURL(updatedImages[idx].previewUrl);
            }
            updatedImages.splice(idx, 1);
        });
        setImages(updatedImages);
        setDuplicateChecks([]);
        setShowDuplicateModal(false);
        // Generate AI metadata for processed images
        if (autoGenerateAI) {
            for (const idx of imagesToProcess) {
                const adjustedIdx = idx - imagesToRemove.filter(r => r < idx).length;
                if (adjustedIdx >= 0 && adjustedIdx < updatedImages.length) {
                    await generateAIMetadata(updatedImages[adjustedIdx], adjustedIdx);
                }
            }
        }
    };
    // Mark all duplicates with same action
    const markAllDuplicates = (action) => {
        setDuplicateChecks(prev => prev.map(check => ({ ...check, action })));
    };
    // Rectify all existing images - re-parse filenames and update metadata
    const handleRectifyAll = async () => {
        if (existingImages.length === 0) {
            toast({
                title: 'No images to rectify',
                description: 'Upload some images first',
                variant: 'destructive',
            });
            return;
        }
        setRectifying(true);
        let updated = 0;
        let errors = 0;
        for (let i = 0; i < existingImages.length; i++) {
            const image = existingImages[i];
            try {
                const cleanFilename = getCleanFilenameFromUrl(image.cover_image_url);
                const houspire = parseHouspireFilename(cleanFilename);
                const fallback = houspire ? null : extractTagsFromFilename(cleanFilename);
                const updateData = {};
                // Title: only fix titles that look random/unfriendly
                const currentTitleLooksRandom = looksRandomTitle(image.design_title);
                if (currentTitleLooksRandom || !image.design_title?.trim()) {
                    if (houspire) {
                        updateData.design_title = houspire.generatedTitle;
                    }
                    else {
                        updateData.design_title = smartParseFilename(cleanFilename, i).title;
                    }
                }
                // Tags: ONLY update room/style/budget if the filename actually contains that info.
                // Never overwrite to defaults (living_room / modern_minimalist) for random filenames.
                if (houspire) {
                    if (image.room_type !== houspire.roomType)
                        updateData.room_type = houspire.roomType;
                    if (image.style_primary !== houspire.style)
                        updateData.style_primary = houspire.style;
                    if (image.budget_range !== houspire.budgetRange)
                        updateData.budget_range = houspire.budgetRange;
                    if (image.is_featured !== houspire.isFeatured)
                        updateData.is_featured = houspire.isFeatured;
                }
                else if (fallback) {
                    if (fallback.roomType && image.room_type !== fallback.roomType)
                        updateData.room_type = fallback.roomType;
                    if (fallback.style && image.style_primary !== fallback.style)
                        updateData.style_primary = fallback.style;
                }
                const needsUpdate = Object.keys(updateData).length > 0;
                if (needsUpdate) {
                    const { error } = await supabase.from('gallery_designs').update(updateData).eq('id', image.id);
                    if (error) {
                        console.error('Error updating image:', error);
                        errors++;
                    }
                    else {
                        updated++;
                    }
                }
            }
            catch (err) {
                console.error('Error processing image:', err);
                errors++;
            }
        }
        setRectifying(false);
        // Refresh the images list
        await fetchExistingImages();
        toast({
            title: 'Rectification Complete',
            description: `Updated ${updated} images. ${errors > 0 ? `${errors} errors.` : ''}`,
        });
    };
    // Toggle image selection for bulk actions
    const toggleImageSelection = (imageId) => {
        setSelectedImageIds(prev => {
            const newSet = new Set(prev);
            if (newSet.has(imageId)) {
                newSet.delete(imageId);
            }
            else {
                newSet.add(imageId);
            }
            return newSet;
        });
    };
    // Select all filtered images
    const selectAllFilteredImages = () => {
        const allIds = new Set(filteredExistingImages.map(img => img.id));
        setSelectedImageIds(allIds);
    };
    // Clear selection
    const clearSelection = () => {
        setSelectedImageIds(new Set());
    };
    // Load all remaining images (for bulk selection of entire gallery)
    // Limited to MAX_LOAD_ALL_USES times per session
    const loadAllImages = async () => {
        if (loadAllUsageCount >= MAX_LOAD_ALL_USES) {
            toast({
                title: 'Load All limit reached',
                description: `You can only use "Load All" ${MAX_LOAD_ALL_USES} times per session. Use "Load More" instead or refresh the page.`,
                variant: 'destructive',
            });
            return;
        }
        setLoadingMore(true);
        setLoadAllUsageCount(prev => prev + 1);
        try {
            const pageSize = 500; // Load in larger batches for efficiency
            let allData = [...existingImages];
            let cursor = lastCursor;
            let hasMore = true;
            while (hasMore) {
                let query = supabase
                    .from('gallery_designs')
                    .select('id, design_title, design_description, cover_image_url, style_primary, room_type, budget_range, is_featured, is_published, key_features, created_at')
                    .order('created_at', { ascending: false })
                    .order('id', { ascending: false })
                    .limit(pageSize);
                if (cursor) {
                    query = query.or(`created_at.lt.${cursor.created_at},and(created_at.eq.${cursor.created_at},id.lt.${cursor.id})`);
                }
                const { data, error } = await query;
                if (error)
                    throw error;
                if (data && data.length > 0) {
                    allData = [...allData, ...data];
                    const last = data[data.length - 1];
                    cursor = { created_at: last.created_at, id: last.id };
                    hasMore = data.length === pageSize;
                }
                else {
                    hasMore = false;
                }
            }
            setExistingImages(allData);
            setLastCursor(cursor);
            setHasMoreImages(false);
            const remainingUses = MAX_LOAD_ALL_USES - loadAllUsageCount - 1;
            toast({
                title: 'All images loaded',
                description: `Loaded ${allData.length} images for selection. ${remainingUses > 0 ? `${remainingUses} Load All use${remainingUses === 1 ? '' : 's'} remaining.` : 'No more Load All uses this session.'}`,
            });
        }
        catch (error) {
            console.error('Failed to load all images:', error);
            toast({
                title: 'Error loading images',
                description: error.message,
                variant: 'destructive',
            });
        }
        finally {
            setLoadingMore(false);
        }
    };
    // Process a single image for AI metadata generation
    const processImageForAI = async (image) => {
        try {
            const cleanFilename = getCleanFilenameFromUrl(image.cover_image_url);
            const hasReliableFilenameTags = Boolean(parseHouspireFilename(cleanFilename));
            // Call the edge function to generate full metadata
            const body = {
                imageUrl: image.cover_image_url,
                budgetRange: image.budget_range,
                viewType: 'main',
                generateFull: true, // Request full details including why_it_works, difficulty, etc.
            };
            // Only pass room/style when we trust they're not defaults from earlier imports.
            if (hasReliableFilenameTags) {
                body.roomType = image.room_type;
                body.style = image.style_primary;
            }
            const { data, error } = await supabase.functions.invoke('generate-image-metadata', {
                body,
            });
            if (error)
                throw error;
            // Update the database with all generated content including detected room/style
            const { error: updateError } = await supabase
                .from('gallery_designs')
                .update({
                design_description: data.description || null,
                key_features: data.keyFeatures || null,
                why_it_works: data.whyItWorks || null,
                difficulty_level: data.difficultyLevel || null,
                execution_time_weeks: data.executionTimeWeeks || null,
                // Update room type and style if AI detected them
                room_type: data.detectedRoomType || image.room_type,
                style_primary: data.detectedStyle || image.style_primary,
            })
                .eq('id', image.id);
            if (updateError)
                throw updateError;
            // Real-time UI update: update local state immediately so "AI ✓" badge appears
            setExistingImages(prev => prev.map(img => img.id === image.id
                ? {
                    ...img,
                    design_description: data.description || img.design_description,
                    key_features: data.keyFeatures || img.key_features,
                    room_type: data.detectedRoomType || img.room_type,
                    style_primary: data.detectedStyle || img.style_primary,
                }
                : img));
            return { success: true, imageId: image.id };
        }
        catch (error) {
            console.error('AI generation error for image:', image.id, error);
            return { success: false, imageId: image.id };
        }
    };
    // Bulk AI generate descriptions for selected existing images (parallel processing)
    const handleBulkAIGenerate = async () => {
        const selectedImages = existingImages.filter(img => selectedImageIds.has(img.id));
        if (selectedImages.length === 0) {
            toast({
                title: 'No images selected',
                description: 'Select images to generate AI descriptions',
                variant: 'destructive',
            });
            return;
        }
        setBulkAIGenerating(true);
        const totalBatches = Math.ceil(selectedImages.length / CONCURRENT_AI_REQUESTS);
        setBulkAIProgress({ current: 0, total: selectedImages.length, batch: 0, totalBatches });
        let successCount = 0;
        let errorCount = 0;
        // Process in batches of CONCURRENT_AI_REQUESTS
        for (let i = 0; i < selectedImages.length; i += CONCURRENT_AI_REQUESTS) {
            const batch = selectedImages.slice(i, i + CONCURRENT_AI_REQUESTS);
            const batchNumber = Math.floor(i / CONCURRENT_AI_REQUESTS) + 1;
            // Track all currently processing IDs for this batch
            setCurrentlyProcessingIds(new Set(batch.map(img => img.id)));
            setBulkAIProgress({
                current: i,
                total: selectedImages.length,
                batch: batchNumber,
                totalBatches
            });
            // Process batch in parallel
            const results = await Promise.allSettled(batch.map(img => processImageForAI(img)));
            // Count successes and failures
            results.forEach((result) => {
                if (result.status === 'fulfilled' && result.value.success) {
                    successCount++;
                }
                else {
                    errorCount++;
                }
            });
            // Update progress after batch completes
            setBulkAIProgress({
                current: Math.min(i + CONCURRENT_AI_REQUESTS, selectedImages.length),
                total: selectedImages.length,
                batch: batchNumber,
                totalBatches
            });
            // Small delay between batches to avoid rate limiting
            if (i + CONCURRENT_AI_REQUESTS < selectedImages.length) {
                await new Promise(resolve => setTimeout(resolve, 300));
            }
        }
        setCurrentlyProcessingIds(new Set());
        setBulkAIGenerating(false);
        setBulkAIProgress({ current: 0, total: 0, batch: 0, totalBatches: 0 });
        setSelectedImageIds(new Set());
        toast({
            title: 'Bulk AI Generation Complete',
            description: `Generated descriptions for ${successCount} images. ${errorCount > 0 ? `${errorCount} failed.` : ''}`,
        });
    };
    // Bulk publish/unpublish selected images
    const handleBulkPublish = async (publish) => {
        const selectedImages = existingImages.filter(img => selectedImageIds.has(img.id));
        if (selectedImages.length === 0) {
            toast({
                title: 'No images selected',
                description: 'Select images to publish/unpublish',
                variant: 'destructive',
            });
            return;
        }
        setBulkPublishing(true);
        try {
            const { error } = await supabase
                .from('gallery_designs')
                .update({ is_published: publish })
                .in('id', Array.from(selectedImageIds));
            if (error)
                throw error;
            toast({
                title: publish ? 'Images Published' : 'Images Unpublished',
                description: `${selectedImages.length} images have been ${publish ? 'published' : 'unpublished'}.`,
            });
            // Refresh and clear selection
            await fetchExistingImages();
            setSelectedImageIds(new Set());
            fetchGalleryStats();
        }
        catch (error) {
            console.error('Bulk publish error:', error);
            toast({
                title: 'Action failed',
                description: error.message,
                variant: 'destructive',
            });
        }
        finally {
            setBulkPublishing(false);
        }
    };
    // Bulk publish all unpublished images
    const handlePublishAll = async () => {
        const confirmed = await confirm({
            title: 'Publish All Images',
            description: `This will publish all ${existingImages.filter(img => !img.is_published).length} unpublished images. They will become visible on the public gallery.`,
            confirmText: 'Publish All',
            cancelText: 'Cancel',
            variant: 'info',
        });
        if (!confirmed)
            return;
        setBulkPublishing(true);
        try {
            const { error } = await supabase
                .from('gallery_designs')
                .update({ is_published: true })
                .eq('is_published', false);
            if (error)
                throw error;
            toast({
                title: 'All Images Published',
                description: 'All images are now visible on the public gallery.',
            });
            await fetchExistingImages();
            fetchGalleryStats();
        }
        catch (error) {
            console.error('Publish all error:', error);
            toast({
                title: 'Action failed',
                description: error.message,
                variant: 'destructive',
            });
        }
        finally {
            setBulkPublishing(false);
        }
    };
    // Handle CSV import
    const handleCSVImport = async (e) => {
        const file = e.target.files?.[0];
        if (!file)
            return;
        const text = await file.text();
        const lines = text.split('\n').slice(1); // Skip header
        const imported = lines
            .filter((line) => line.trim())
            .map((line) => {
            const [url, title, description, category, style, roomType, tags, roomSize, keyFeatures, whyItWorks, implementationTime, tier,] = line.split(',').map((s) => s.trim().replace(/^"|"$/g, ''));
            return {
                url,
                title,
                description,
                category: categories.find((c) => c.slug === category)?.id || categories[0]?.id || '',
                style,
                roomType,
                budgetRange: 'medium',
                tags: tags ? tags.split('|') : [],
                roomSize,
                keyFeatures: keyFeatures ? keyFeatures.split('|') : [],
                whyItWorks,
                implementationTime,
                tier: tier || 'Premium',
                isFeatured: tier === 'Premium',
                isHouspireFormat: false,
                status: 'pending',
            };
        });
        setImages([...images, ...imported]);
    };
    // Upload a single file to storage with retry logic (now includes Cloudinary CDN)
    const uploadFileWithRetry = async (file, roomType = 'general', style = 'modern', maxRetries = 3) => {
        const fileName = `${Date.now()}-${file.name}`;
        let lastError = null;
        let cloudinaryResult = null;
        // Phase 1: Upload to Cloudinary CDN (primary)
        try {
            cloudinaryResult = await uploadToCloudinary(file, {
                folder: `gallery/${roomType}`,
                tags: [roomType, style, 'gallery'],
            });
        }
        catch (error) {
            console.warn('Cloudinary upload failed, continuing with storage only:', error.message);
        }
        // Phase 2: Upload to Supabase Storage (backup)
        for (let attempt = 1; attempt <= maxRetries; attempt++) {
            try {
                const { data: uploadData, error: uploadError } = await supabase.storage
                    .from('gallery-images')
                    .upload(fileName, file, {
                    cacheControl: '3600',
                    upsert: false,
                });
                if (uploadError) {
                    throw uploadError;
                }
                const { data: urlData } = supabase.storage
                    .from('gallery-images')
                    .getPublicUrl(uploadData.path);
                return {
                    storageUrl: urlData.publicUrl,
                    cloudinaryPublicId: cloudinaryResult?.publicId,
                    cloudinaryUrl: cloudinaryResult?.secureUrl,
                };
            }
            catch (error) {
                lastError = error;
                console.warn(`Upload attempt ${attempt}/${maxRetries} failed:`, error.message);
                // Don't retry if it's a duplicate key error
                if (error.message?.includes('duplicate') || error.statusCode === 409) {
                    throw error;
                }
                // Wait before retry with exponential backoff
                if (attempt < maxRetries) {
                    const delay = Math.min(1000 * Math.pow(2, attempt - 1), 5000);
                    await new Promise(resolve => setTimeout(resolve, delay));
                }
            }
        }
        throw lastError || new Error('Upload failed after retries');
    };
    // Upload images
    const handleUpload = async () => {
        setUploading(true);
        let completed = 0;
        let failed = 0;
        for (const [index, image] of images.entries()) {
            if (image.status === 'success') {
                completed++;
                setProgress(Math.round(((completed + failed) / images.length) * 100));
                continue;
            }
            try {
                // Update status
                setImages((prev) => prev.map((img, i) => i === index ? { ...img, status: 'uploading' } : img));
                // If overwriting, delete the existing image first
                if (image.duplicateOf) {
                    const { error: deleteError } = await supabase
                        .from('gallery_designs')
                        .delete()
                        .eq('id', image.duplicateOf.id);
                    if (deleteError) {
                        console.warn('Failed to delete existing image:', deleteError);
                    }
                }
                let imageUrl = image.url;
                let cloudinaryPublicId;
                let cloudinaryUrl;
                // Upload file if it's a file upload
                if (image.file) {
                    const uploadResult = await uploadFileWithRetry(image.file, image.roomType || 'general', image.style || 'modern');
                    imageUrl = uploadResult.cloudinaryUrl || uploadResult.storageUrl;
                    cloudinaryPublicId = uploadResult.cloudinaryPublicId;
                    cloudinaryUrl = uploadResult.cloudinaryUrl;
                    // Clean up preview URL
                    if (image.previewUrl) {
                        URL.revokeObjectURL(image.previewUrl);
                    }
                }
                // Insert gallery design with Cloudinary fields
                const { error: insertError } = await supabase
                    .from('gallery_designs')
                    .insert({
                    cover_image_url: imageUrl,
                    cloudinary_public_id: cloudinaryPublicId || null,
                    cloudinary_url: cloudinaryUrl || null,
                    storage_backup_url: image.file ? imageUrl : null,
                    design_title: image.title,
                    design_description: image.description || null,
                    style_primary: image.style || 'modern_minimalist',
                    room_type: image.roomType || 'living_room',
                    budget_range: image.budgetRange || 'medium',
                    is_featured: image.isFeatured,
                    key_features: image.tags,
                });
                if (insertError)
                    throw insertError;
                // Update status
                setImages((prev) => prev.map((img, i) => i === index ? { ...img, status: 'success' } : img));
                completed++;
            }
            catch (error) {
                console.error('Upload failed:', error);
                setImages((prev) => prev.map((img, i) => i === index
                    ? {
                        ...img,
                        status: 'error',
                        error: error.message,
                    }
                    : img));
                failed++;
            }
            setProgress(Math.round(((completed + failed) / images.length) * 100));
        }
        setUploading(false);
        if (failed > 0) {
            toast({
                title: 'Upload completed with errors',
                description: `${completed} succeeded, ${failed} failed. Check individual errors for details.`,
                variant: 'destructive',
            });
        }
        else {
            toast({
                title: 'Upload complete! 🎉',
                description: `${completed} of ${images.length} images uploaded successfully`,
            });
        }
        fetchGalleryStats();
        fetchExistingImages();
    };
    // Download CSV template
    const downloadCSVTemplate = () => {
        const csv = `image_url,title,description,category_slug,style,room_type,tags,room_size,key_features,why_it_works,implementation_time,tier
https://example.com/image1.jpg,"Modern Living Room","A sophisticated living room blending Indian aesthetics with modern comfort",living-rooms,modern,living_room,"sofa|minimalist|neutral","18' x 14'","Handcrafted furniture|Jali screens|Statement chandelier","Traditional elements meet contemporary design for timeless elegance","6 weeks to complete",Premium
https://example.com/image2.jpg,"Luxury Bedroom","Elegant master suite with premium finishes",bedrooms,luxury,bedroom,"bed|elegant|warm","16' x 12'","King-size bed|Walk-in closet|Ambient lighting","Creates a serene retreat with thoughtful design","4 weeks to complete",Premium`;
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'gallery-import-template.csv';
        a.click();
        URL.revokeObjectURL(url);
    };
    // Bulk delete pending uploads
    const handleBulkDelete = async () => {
        const confirmed = await confirm({
            title: 'Clear All Pending Images',
            description: 'Are you sure you want to remove all pending images from the upload queue?',
            confirmText: 'Clear All',
            cancelText: 'Cancel',
            variant: 'warning',
        });
        if (confirmed) {
            setImages([]);
        }
    };
    // View gallery
    const handleViewGallery = () => {
        window.open('/discover', '_blank');
    };
    const pendingCount = images.filter((img) => img.status === 'pending').length;
    const successCount = images.filter((img) => img.status === 'success').length;
    const errorCount = images.filter((img) => img.status === 'error').length;
    return (<div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-foreground">
            Gallery Management
          </h2>
          <p className="text-muted-foreground">
            Upload and manage design gallery images
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={handleViewGallery}>
            <Eye className="h-4 w-4 mr-2"/>
            View Gallery
          </Button>
          <Button onClick={() => setShowSettings(!showSettings)} variant="outline">
            <SettingsIcon className="h-4 w-4 mr-2"/>
            Settings
          </Button>
        </div>
      </div>

      {/* Gallery Stats */}
      {galleryStats && (<div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30">
                <ImageIcon className="h-5 w-5 text-blue-600"/>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Images</p>
                <p className="text-2xl font-bold">{galleryStats.total_images}</p>
              </div>
            </div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-green-100 dark:bg-green-900/30">
                <Zap className="h-5 w-5 text-green-600"/>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Optimized</p>
                <p className="text-2xl font-bold">{galleryStats.optimized_images}</p>
              </div>
            </div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-purple-100 dark:bg-purple-900/30">
                <HardDrive className="h-5 w-5 text-purple-600"/>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Avg Compression</p>
                <p className="text-2xl font-bold">{galleryStats.avg_compression_ratio}%</p>
              </div>
            </div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-amber-100 dark:bg-amber-900/30">
                <Clock className="h-5 w-5 text-amber-600"/>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Pending</p>
                <p className="text-2xl font-bold">{galleryStats.pending_optimization}</p>
              </div>
            </div>
          </Card>
        </div>)}

      {/* Export Coverage Matrix Button */}
      <div className="flex justify-end">
        <Button variant="outline" size="sm" onClick={async () => {
            const result = await exportGalleryCoverageMatrix();
            if (result.success) {
                toast({
                    title: 'Coverage Matrix Exported',
                    description: 'CSV file downloaded successfully with room × style breakdown.',
                });
            }
            else {
                toast({
                    title: 'Export Failed',
                    description: result.error || 'Failed to export coverage matrix',
                    variant: 'destructive',
                });
            }
        }}>
          <Download className="h-4 w-4 mr-2"/>
          Export Coverage Matrix
        </Button>
      </div>

      {/* Upload Stats */}
      {images.length > 0 && (<div className="grid grid-cols-4 gap-4">
          <Card className="p-4 text-center">
            <p className="text-sm text-muted-foreground">Total</p>
            <p className="text-2xl font-bold">{images.length}</p>
          </Card>
          <Card className="p-4 text-center">
            <p className="text-sm text-muted-foreground">Pending</p>
            <p className="text-2xl font-bold text-amber-600">{pendingCount}</p>
          </Card>
          <Card className="p-4 text-center">
            <p className="text-sm text-muted-foreground">Uploaded</p>
            <p className="text-2xl font-bold text-green-600">{successCount}</p>
          </Card>
          <Card className="p-4 text-center">
            <p className="text-sm text-muted-foreground">Failed</p>
            <p className="text-2xl font-bold text-red-600">{errorCount}</p>
          </Card>
        </div>)}

      {/* Upload Options */}
      <div className="grid md:grid-cols-3 gap-4">
        {/* File Upload */}
        <Card className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 rounded-xl bg-blue-100 dark:bg-blue-900/30">
              <Upload className="h-6 w-6 text-blue-600"/>
            </div>
            <div>
              <h3 className="font-semibold">Upload Files</h3>
              <p className="text-sm text-muted-foreground">Select multiple images</p>
            </div>
          </div>

          <label className="block">
            <Input type="file" multiple accept="image/*" onChange={handleFileSelect} className="hidden"/>
            <Button variant="outline" className="w-full" asChild>
              <span>
                <FileImage className="h-4 w-4 mr-2"/>
                Select Images
              </span>
            </Button>
          </label>

          <p className="text-xs text-muted-foreground mt-2 text-center">
            Supports: JPG, PNG, WebP
          </p>
        </Card>

        {/* CSV Import */}
        <Card className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 rounded-xl bg-purple-100 dark:bg-purple-900/30">
              <FileSpreadsheet className="h-6 w-6 text-purple-600"/>
            </div>
            <div>
              <h3 className="font-semibold">CSV Import</h3>
              <p className="text-sm text-muted-foreground">Bulk import with metadata</p>
            </div>
          </div>

          <Button variant="outline" className="w-full mb-2" onClick={downloadCSVTemplate}>
            <Download className="h-4 w-4 mr-2"/>
            Download Template
          </Button>

          <label className="block">
            <Input type="file" accept=".csv" onChange={handleCSVImport} className="hidden"/>
            <Button variant="outline" className="w-full" asChild>
              <span>
                <Upload className="h-4 w-4 mr-2"/>
                Import CSV
              </span>
            </Button>
          </label>
        </Card>

        {/* Compression Info */}
        <Card className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 rounded-xl bg-green-100 dark:bg-green-900/30">
              <Wand className="h-6 w-6 text-green-600"/>
            </div>
            <div>
              <h3 className="font-semibold">Auto Compression</h3>
              <p className="text-sm text-muted-foreground">Images auto-optimized</p>
            </div>
          </div>

          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">400w (thumb):</span>
              <span>~50KB</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">800w (mobile):</span>
              <span>~150KB</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">1200w (tablet):</span>
              <span>~300KB</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">1920w (desktop):</span>
              <span>~500KB</span>
            </div>
          </div>

          <p className="text-xs text-green-600 mt-3 font-medium">
            ✓ WebP format - 70% smaller!
          </p>
        </Card>
      </div>

      {/* Upload Progress */}
      {uploading && (<Card className="p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium flex items-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin"/>
              Uploading Images...
            </span>
            <span className="text-sm font-bold">{progress}%</span>
          </div>
          <Progress value={progress} className="h-2"/>
        </Card>)}

      {/* Image List */}
      {images.length > 0 && (<Card className="overflow-hidden">
          <div className="p-4 border-b flex items-center justify-between">
            <div className="flex items-center gap-4">
              <h3 className="font-semibold">
                Images ({images.length})
              </h3>
              <label className="flex items-center gap-2 text-sm cursor-pointer">
                <input type="checkbox" checked={autoGenerateAI} onChange={(e) => setAutoGenerateAI(e.target.checked)} className="rounded border-gray-300"/>
                <Wand2 className="h-4 w-4 text-purple-500"/>
                <span>AI Auto-Generate</span>
              </label>
            </div>

            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={handleBulkDelete} disabled={uploading}>
                <Trash2 className="h-4 w-4 mr-1"/>
                Clear All
              </Button>

              <Button onClick={handleUpload} disabled={uploading || pendingCount === 0} size="sm">
                {uploading ? (<>
                    <Loader2 className="h-4 w-4 mr-1 animate-spin"/>
                    Uploading...
                  </>) : (<>
                    <Upload className="h-4 w-4 mr-1"/>
                    Upload {pendingCount} Images
                  </>)}
              </Button>
            </div>
          </div>

          <div className="divide-y max-h-[400px] overflow-y-auto">
            {images.map((image, index) => (<motion.div key={index} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="p-3 flex items-center gap-4">
                {/* Status Icon */}
                <div className="flex-shrink-0">
                  {image.status === 'success' && (<div className="w-8 h-8 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                      <Check className="h-4 w-4 text-green-600"/>
                    </div>)}
                  {image.status === 'error' && (<div className="w-8 h-8 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                      <X className="h-4 w-4 text-red-600"/>
                    </div>)}
                  {image.status === 'uploading' && (<div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                      <Loader2 className="h-4 w-4 text-blue-600 animate-spin"/>
                    </div>)}
                  {image.status === 'pending' && (<div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                      <FileImage className="h-4 w-4 text-muted-foreground"/>
                    </div>)}
                </div>

                {/* Image Info */}
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">
                    {image.title}
                  </p>
                  <div className="flex items-center gap-2 flex-wrap mt-1">
                    {image.aiStatus === 'generating' && (<Badge variant="default" className="text-xs bg-purple-600">
                        <Loader2 className="h-3 w-3 mr-1 animate-spin"/>
                        Generating AI...
                      </Badge>)}
                    {image.aiStatus === 'done' && (<Badge variant="default" className="text-xs bg-purple-600">
                        <Wand2 className="h-3 w-3 mr-1"/>
                        AI Generated
                      </Badge>)}
                    {image.isHouspireFormat && (<Badge variant="default" className="text-xs bg-green-600">
                        <Tag className="h-3 w-3 mr-1"/>
                        Auto-tagged
                      </Badge>)}
                    {image.styleLabel || image.style ? (<Badge variant="secondary" className="text-xs">
                        {image.styleLabel || image.style}
                      </Badge>) : null}
                    {image.roomTypeLabel || image.roomType ? (<Badge variant="outline" className="text-xs">
                        {image.roomTypeLabel || image.roomType}
                      </Badge>) : null}
                    {image.budgetLabel && (<Badge variant="outline" className="text-xs">
                        {image.budgetLabel}
                      </Badge>)}
                    {image.isFeatured && (<Badge variant="default" className="text-xs bg-amber-500">
                        Featured
                      </Badge>)}
                  </div>
                  {image.description && (<p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                      {image.description}
                    </p>)}
                  {image.error && (<p className="text-xs text-red-600 mt-1">{image.error}</p>)}
                </div>

                {/* Actions */}
                {/* Actions */}
                {image.status === 'pending' && (<div className="flex items-center gap-1 flex-shrink-0">
                    {image.file && image.aiStatus !== 'generating' && image.aiStatus !== 'done' && (<Button onClick={() => generateAIMetadata(image, index)} variant="ghost" size="sm" title="Generate AI title & description">
                        <Wand2 className="h-4 w-4 text-purple-500"/>
                      </Button>)}
                    <Button onClick={() => setImages(images.filter((_, i) => i !== index))} variant="ghost" size="sm">
                      <X className="h-4 w-4"/>
                    </Button>
                  </div>)}
              </motion.div>))}
          </div>
        </Card>)}

      {/* Empty State */}
      {images.length === 0 && (<Card className="p-12 text-center">
          <div className="mx-auto w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
            <FileImage className="h-8 w-8 text-muted-foreground"/>
          </div>
          <h3 className="text-lg font-semibold mb-2">
            No Images Added Yet
          </h3>
          <p className="text-muted-foreground">
            Select images or import CSV to get started
          </p>
        </Card>)}

      {/* Instructions */}
      <Card className="p-4 bg-muted/50">
        <div className="flex gap-3">
          <AlertCircle className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5"/>
          <div>
            <h4 className="font-medium mb-1">
              Auto-Tagging with Houspire Naming Convention:
            </h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Use filename format: <code className="bg-muted px-1 rounded">HOS_KB_SCA_PRE_0102_01_main.png</code></li>
              <li>• Room codes: LR (Living), MB (Master Bed), KB (Kitchen), DR (Dining), HO (Office), BT (Bath), BL (Balcony)</li>
              <li>• Style codes: MOD (Modern), CON (Contemporary Indian), SCA (Scandinavian), BOH (Bohemian), etc.</li>
              <li>• Budget codes: BUD (Budget), MID (Medium), PRE (Premium - auto-featured)</li>
              <li>• Files matching this pattern get <span className="text-green-600 font-medium">auto-tagged</span> with room, style, and budget</li>
            </ul>
          </div>
        </div>
      </Card>

      {/* Existing Gallery Images */}
      <Card className="overflow-hidden">
        <div className="p-4 border-b space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <h3 className="font-semibold text-lg">
                Existing Gallery Images
              </h3>
              <Badge variant="secondary">
                {filteredExistingImages.length} of {existingImages.length}
              </Badge>
              {galleryStats && (<div className="flex items-center gap-2 text-xs">
                  <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                    <Globe className="h-3 w-3 mr-1"/>
                    {galleryStats.published_images} Published
                  </Badge>
                  <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
                    <EyeOff className="h-3 w-3 mr-1"/>
                    {galleryStats.unpublished_images} Unpublished
                  </Badge>
                  <Badge variant="outline" className="text-muted-foreground">
                    {galleryStats.total_images} Total in DB
                  </Badge>
                </div>)}
            </div>
            <div className="flex items-center gap-2">
              <div className="relative flex-1 md:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground"/>
                <Input placeholder="Search images..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-9"/>
              </div>
              <Button variant="outline" size="sm" onClick={handleRectifyAll} disabled={rectifying || loadingExisting || existingImages.length === 0} title="Re-parse filenames and update all metadata">
                {rectifying ? (<Loader2 className="h-4 w-4 animate-spin mr-1"/>) : (<Tag className="h-4 w-4 mr-1"/>)}
                Rectify All
              </Button>
              {/* Publish All Unpublished */}
              {existingImages.filter(img => !img.is_published).length > 0 && (<Button variant="default" size="sm" onClick={handlePublishAll} disabled={bulkPublishing || loadingExisting} className="bg-green-600 hover:bg-green-700">
                  {bulkPublishing ? (<Loader2 className="h-4 w-4 animate-spin mr-1"/>) : (<Globe className="h-4 w-4 mr-1"/>)}
                  Publish All ({existingImages.filter(img => !img.is_published).length})
                </Button>)}
              <Button variant="outline" size="sm" onClick={() => setShowDuplicateAnalysis(true)} disabled={loadingExisting} className="gap-1">
                <Layers className="h-4 w-4"/>
                Find Duplicates
              </Button>
              <Button variant="outline" size="icon" onClick={() => fetchExistingImages()} disabled={loadingExisting}>
                <RefreshCw className={`h-4 w-4 ${loadingExisting ? 'animate-spin' : ''}`}/>
              </Button>
            </div>
          </div>

          {/* Filters Row */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <SlidersHorizontal className="h-4 w-4"/>
              <span>Filters:</span>
            </div>

            {/* Room Type Filter */}
            <Select value={filterRoomType} onValueChange={setFilterRoomType}>
              <SelectTrigger className="w-[140px] h-9">
                <SelectValue placeholder="Room Type"/>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Rooms</SelectItem>
                {uniqueRoomTypes.map((room) => (<SelectItem key={room} value={room}>
                    {ROOM_LABELS[room] || room.replace(/_/g, ' ')}
                  </SelectItem>))}
              </SelectContent>
            </Select>

            {/* Style Filter */}
            <Select value={filterStyle} onValueChange={setFilterStyle}>
              <SelectTrigger className="w-[160px] h-9">
                <SelectValue placeholder="Style"/>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Styles</SelectItem>
                {uniqueStyles.map((style) => (<SelectItem key={style} value={style}>
                    {STYLE_LABELS[style] || style.replace(/_/g, ' ')}
                  </SelectItem>))}
              </SelectContent>
            </Select>

            {/* Budget Filter */}
            <Select value={filterBudget} onValueChange={setFilterBudget}>
              <SelectTrigger className="w-[130px] h-9">
                <SelectValue placeholder="Budget"/>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Budgets</SelectItem>
                {uniqueBudgets.map((budget) => (<SelectItem key={budget} value={budget}>
                    {BUDGET_LABELS[budget] || budget}
                  </SelectItem>))}
              </SelectContent>
            </Select>

            {/* Featured Filter */}
            <Select value={filterFeatured} onValueChange={setFilterFeatured}>
              <SelectTrigger className="w-[120px] h-9">
                <SelectValue placeholder="Featured"/>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="featured">Featured</SelectItem>
                <SelectItem value="standard">Standard</SelectItem>
              </SelectContent>
            </Select>

            {/* Published Filter */}
            <Select value={filterPublished} onValueChange={setFilterPublished}>
              <SelectTrigger className="w-[130px] h-9">
                <SelectValue placeholder="Published"/>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="published">Published</SelectItem>
                <SelectItem value="unpublished">Unpublished</SelectItem>
              </SelectContent>
            </Select>

            {/* AI Description Filter */}
            <Select value={filterAIStatus} onValueChange={setFilterAIStatus}>
              <SelectTrigger className="w-[150px] h-9">
                <SelectValue placeholder="AI Status"/>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Descriptions</SelectItem>
                <SelectItem value="has_description">Has Description</SelectItem>
                <SelectItem value="needs_description">Needs Description</SelectItem>
              </SelectContent>
            </Select>

            {/* Clear Filters */}
            {hasActiveFilters && (<Button variant="ghost" size="sm" onClick={clearAllFilters} className="h-9">
                <X className="h-4 w-4 mr-1"/>
                Clear
              </Button>)}

            {/* Select All Button */}
            <Button variant="outline" size="sm" onClick={selectedImageIds.size === filteredExistingImages.length ? clearSelection : selectAllFilteredImages} className="h-9 ml-auto">
              {selectedImageIds.size === filteredExistingImages.length && filteredExistingImages.length > 0 ? (<>
                  <X className="h-4 w-4 mr-1"/>
                  Deselect All
                </>) : (<>
                  <Check className="h-4 w-4 mr-1"/>
                  Select All ({filteredExistingImages.length})
                </>)}
            </Button>
          </div>
        </div>

        {/* Bulk Selection Actions */}
        {selectedImageIds.size > 0 && (<div className="mx-4 mb-4 p-3 bg-primary/10 border border-primary/30 rounded-lg flex flex-col md:flex-row md:items-center gap-3 md:justify-between">
            <div className="flex items-center gap-3">
              <Badge variant="default" className="bg-primary">
                {selectedImageIds.size} selected
              </Badge>
              <Button variant="ghost" size="sm" onClick={clearSelection}>
                <X className="h-4 w-4 mr-1"/>
                Clear
              </Button>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              {/* Publish/Unpublish buttons */}
              <Button variant="default" size="sm" onClick={() => handleBulkPublish(true)} disabled={bulkPublishing} className="bg-green-600 hover:bg-green-700">
                {bulkPublishing ? (<Loader2 className="h-4 w-4 mr-1 animate-spin"/>) : (<Globe className="h-4 w-4 mr-1"/>)}
                Publish
              </Button>
              <Button variant="outline" size="sm" onClick={() => handleBulkPublish(false)} disabled={bulkPublishing}>
                <EyeOff className="h-4 w-4 mr-1"/>
                Unpublish
              </Button>
              <Button variant="default" size="sm" onClick={handleBulkAIGenerate} disabled={bulkAIGenerating} className="bg-purple-600 hover:bg-purple-700">
                {bulkAIGenerating ? (<>
                    <Loader2 className="h-4 w-4 mr-1 animate-spin"/>
                    Generating ({bulkAIProgress.current}/{bulkAIProgress.total})...
                  </>) : (<>
                    <Wand2 className="h-4 w-4 mr-1"/>
                    AI Descriptions
                  </>)}
              </Button>
            </div>
          </div>)}

        {/* Bulk AI Progress */}
        {bulkAIGenerating && (<div className="mx-4 mb-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground">
                Processing {bulkAIProgress.current} of {bulkAIProgress.total} images 
                {bulkAIProgress.totalBatches > 0 && (<span className="ml-1 text-muted-foreground/70">
                    (batch {bulkAIProgress.batch}/{bulkAIProgress.totalBatches}, {CONCURRENT_AI_REQUESTS} parallel)
                  </span>)}
              </span>
              <span className="text-sm font-medium">
                {Math.round((bulkAIProgress.current / bulkAIProgress.total) * 100)}%
              </span>
            </div>
            <Progress value={(bulkAIProgress.current / bulkAIProgress.total) * 100} className="h-2"/>
          </div>)}

        {loadingExisting ? (<div className="p-8 text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto text-muted-foreground"/>
            <p className="mt-2 text-muted-foreground">Loading images...</p>
          </div>) : filteredExistingImages.length === 0 ? (<div className="p-8 text-center">
            <ImageIcon className="h-12 w-12 mx-auto text-muted-foreground mb-2"/>
            <p className="text-muted-foreground">
              {searchQuery
                ? 'No images match your search'
                : hasActiveFilters && galleryStats && galleryStats.total_images > existingImages.length
                    ? `No matching images in loaded batch. ${galleryStats.total_images - existingImages.length} more images in database.`
                    : hasActiveFilters
                        ? 'No images match the current filters'
                        : 'No gallery images yet'}
            </p>
            {hasActiveFilters && galleryStats && galleryStats.total_images > existingImages.length && (<div className="mt-3 flex items-center justify-center gap-2">
                <Button variant="outline" size="sm" onClick={() => fetchExistingImages(true)} disabled={loadingMore || !hasMoreImages}>
                  Load More
                </Button>
                <Button variant="default" size="sm" onClick={loadAllImages} disabled={loadingMore || loadAllUsageCount >= MAX_LOAD_ALL_USES}>
                  Load All ({MAX_LOAD_ALL_USES - loadAllUsageCount} uses left)
                </Button>
              </div>)}
          </div>) : (<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 p-4">
            {filteredExistingImages.map((image) => (<motion.div key={image.id} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className={`group relative rounded-lg overflow-hidden border bg-card cursor-pointer ${selectedImageIds.has(image.id) ? 'ring-2 ring-primary border-primary' : ''}`} onClick={() => toggleImageSelection(image.id)}>
                {/* Selection Checkbox */}
                <div className={`absolute top-2 left-2 z-10 w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${selectedImageIds.has(image.id)
                    ? 'bg-primary border-primary'
                    : 'bg-white/80 border-gray-300 opacity-0 group-hover:opacity-100'}`}>
                  {selectedImageIds.has(image.id) && (<Check className="h-3 w-3 text-primary-foreground"/>)}
                </div>

                {/* Image */}
                <div className="aspect-[4/3] bg-muted relative">
                  <img src={image.cover_image_url} alt={image.design_title} className="w-full h-full object-cover" loading="lazy"/>
                  {/* Show processing indicator for images being processed in current batch */}
                  {currentlyProcessingIds.has(image.id) && (<div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                      <div className="flex flex-col items-center gap-2">
                        <Loader2 className="h-6 w-6 animate-spin text-white"/>
                        <span className="text-xs text-white font-medium">Generating...</span>
                      </div>
                    </div>)}
                </div>

                {/* Overlay with actions */}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <Button size="sm" variant="secondary" onClick={(e) => { e.stopPropagation(); setEditingImage(image); }}>
                    <Pencil className="h-4 w-4"/>
                  </Button>
                  <Button size="sm" variant="destructive" onClick={(e) => { e.stopPropagation(); handleDeleteImage(image.id, image.design_title); }} disabled={deletingId === image.id}>
                    {deletingId === image.id ? (<Loader2 className="h-4 w-4 animate-spin"/>) : (<Trash2 className="h-4 w-4"/>)}
                  </Button>
                </div>

                {/* Info */}
                <div className="p-3">
                  <p className="font-medium text-sm truncate" title={image.design_title}>
                    {image.design_title}
                  </p>
                  <div className="flex items-center gap-1 mt-1 flex-wrap">
                    {/* Published Status */}
                    {image.is_published ? (<Badge className="text-xs bg-green-600">
                        <Globe className="h-3 w-3 mr-1"/>
                        Published
                      </Badge>) : (<Badge variant="outline" className="text-xs text-gray-500">
                        <EyeOff className="h-3 w-3 mr-1"/>
                        Draft
                      </Badge>)}
                    <Badge variant="secondary" className="text-xs">
                      {image.style_primary.replace('_', ' ')}
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      {image.room_type.replace('_', ' ')}
                    </Badge>
                    {image.is_featured && (<Badge className="text-xs bg-amber-500">Featured</Badge>)}
                    {image.design_description && (<Badge variant="outline" className="text-xs bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300">
                        AI ✓
                      </Badge>)}
                  </div>
                </div>
              </motion.div>))}
          </div>)}
        
        {/* Load More Button - only show if there are more images AND we have visible images AND no active filters */}
        {hasMoreImages && !loadingExisting && existingImages.length > 0 && !hasActiveFilters && (<div className="p-4 border-t text-center flex items-center justify-center gap-3">
            <Button variant="outline" onClick={() => fetchExistingImages(true)} disabled={loadingMore}>
              {loadingMore ? (<>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin"/>
                  Loading...
                </>) : (`Load More (${existingImages.length} of ${totalImageCount})`)}
            </Button>
            <Button variant="default" onClick={loadAllImages} disabled={loadingMore || loadAllUsageCount >= MAX_LOAD_ALL_USES}>
              {loadingMore ? (<>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin"/>
                  Loading All...
                </>) : loadAllUsageCount >= MAX_LOAD_ALL_USES ? ('Load All (limit reached)') : (`Load All (${MAX_LOAD_ALL_USES - loadAllUsageCount} uses left)`)}
            </Button>
          </div>)}
      </Card>

      {/* Edit Modal */}
      <GalleryImageEditModal image={editingImage} isOpen={!!editingImage} onClose={() => setEditingImage(null)} onSave={fetchExistingImages}/>

      {/* Duplicate Detection Modal */}
      <Dialog open={showDuplicateModal} onOpenChange={setShowDuplicateModal}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Copy className="h-5 w-5 text-amber-500"/>
              Duplicate Images Detected ({duplicateChecks.length})
            </DialogTitle>
            <DialogDescription>
              The following images appear to already exist in your gallery. Choose how to handle each one.
            </DialogDescription>
          </DialogHeader>

          {/* Bulk Actions */}
          <div className="flex items-center gap-2 p-3 bg-muted rounded-lg">
            <span className="text-sm font-medium">Apply to all:</span>
            <Button variant="outline" size="sm" onClick={() => markAllDuplicates('overwrite')}>
              <Replace className="h-4 w-4 mr-1"/>
              Overwrite All
            </Button>
            <Button variant="outline" size="sm" onClick={() => markAllDuplicates('skip')}>
              <SkipForward className="h-4 w-4 mr-1"/>
              Skip All
            </Button>
            <Button variant="outline" size="sm" onClick={() => markAllDuplicates('rename')}>
              <FilePlus className="h-4 w-4 mr-1"/>
              Keep Both (All)
            </Button>
          </div>

          {/* Duplicate List */}
          <div className="space-y-4">
            {duplicateChecks.map((check, index) => (<div key={index} className={`p-4 border rounded-lg ${check.action === 'pending' ? 'border-amber-500 bg-amber-50 dark:bg-amber-950/20' :
                check.action === 'overwrite' ? 'border-blue-500 bg-blue-50 dark:bg-blue-950/20' :
                    check.action === 'skip' ? 'border-gray-300 bg-gray-50 dark:bg-gray-800/50 opacity-60' :
                        'border-green-500 bg-green-50 dark:bg-green-950/20'}`}>
                <div className="flex items-start gap-4">
                  {/* New Image */}
                  <div className="flex-1">
                    <p className="text-xs font-medium text-muted-foreground mb-2">New Image</p>
                    <div className="aspect-[4/3] rounded-lg overflow-hidden bg-muted border-2 border-blue-500">
                      {check.newImage.previewUrl && (<img src={check.newImage.previewUrl} alt="New upload" className="w-full h-full object-cover"/>)}
                    </div>
                    <p className="text-sm font-medium mt-2 truncate">{check.newImage.file?.name}</p>
                    <div className="flex gap-1 mt-1">
                      <Badge variant="secondary" className="text-xs">{check.newImage.styleLabel}</Badge>
                      <Badge variant="outline" className="text-xs">{check.newImage.roomTypeLabel}</Badge>
                    </div>
                  </div>

                  {/* Arrow */}
                  <div className="flex items-center justify-center pt-12">
                    <ArrowRight className="h-6 w-6 text-muted-foreground"/>
                  </div>

                  {/* Existing Image */}
                  <div className="flex-1">
                    <p className="text-xs font-medium text-muted-foreground mb-2">Existing Image</p>
                    <div className="aspect-[4/3] rounded-lg overflow-hidden bg-muted border-2 border-amber-500">
                      <img src={check.existingImage.cover_image_url} alt={check.existingImage.design_title} className="w-full h-full object-cover"/>
                    </div>
                    <p className="text-sm font-medium mt-2 truncate">{check.existingImage.design_title}</p>
                    <div className="flex gap-1 mt-1">
                      <Badge variant="secondary" className="text-xs">
                        {STYLE_LABELS[check.existingImage.style_primary] || check.existingImage.style_primary}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {ROOM_LABELS[check.existingImage.room_type] || check.existingImage.room_type}
                      </Badge>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col gap-2 pt-8">
                    <Button variant={check.action === 'overwrite' ? 'default' : 'outline'} size="sm" onClick={() => handleDuplicateAction(index, 'overwrite')} className="w-full">
                      <Replace className="h-4 w-4 mr-1"/>
                      Overwrite
                    </Button>
                    <Button variant={check.action === 'skip' ? 'default' : 'outline'} size="sm" onClick={() => handleDuplicateAction(index, 'skip')} className="w-full">
                      <SkipForward className="h-4 w-4 mr-1"/>
                      Skip
                    </Button>
                    <Button variant={check.action === 'rename' ? 'default' : 'outline'} size="sm" onClick={() => handleDuplicateAction(index, 'rename')} className="w-full">
                      <FilePlus className="h-4 w-4 mr-1"/>
                      Keep Both
                    </Button>
                  </div>
                </div>

                {/* Action Status */}
                {check.action !== 'pending' && (<div className="mt-3 pt-3 border-t">
                    <Badge variant={check.action === 'overwrite' ? 'default' :
                    check.action === 'skip' ? 'secondary' :
                        'outline'}>
                      {check.action === 'overwrite' && 'Will overwrite existing'}
                      {check.action === 'skip' && 'Will be skipped'}
                      {check.action === 'rename' && 'Will keep both versions'}
                    </Badge>
                  </div>)}
              </div>))}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => {
            setShowDuplicateModal(false);
            // Remove all new images that have duplicates
            setImages(prev => prev.filter(img => !img.duplicateOf));
            setDuplicateChecks([]);
        }}>
              Cancel Upload
            </Button>
            <Button onClick={applyDuplicateResolutions} disabled={duplicateChecks.some(c => c.action === 'pending')}>
              <Check className="h-4 w-4 mr-1"/>
              Apply Resolutions ({duplicateChecks.filter(c => c.action !== 'pending').length}/{duplicateChecks.length})
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Confirm Dialog */}
      <ConfirmDialog />

      {/* Duplicate Analysis Panel */}
      <DuplicateAnalysisPanel isOpen={showDuplicateAnalysis} onClose={() => setShowDuplicateAnalysis(false)} onComplete={() => {
            fetchExistingImages();
            fetchGalleryStats();
        }}/>
    </div>);
}

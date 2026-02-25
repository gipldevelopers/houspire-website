'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { apiGet, apiPatch } from '@/lib/api';
import { motion } from 'framer-motion';
import { 
  Image, 
  Star, 
  ThumbsUp, 
  ThumbsDown, 
  ZoomIn, 
  MessageCircle,
  Loader2,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

export function ProjectConceptsTab({ project }) {
  const [concepts, setConcepts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(null);
  const [imageIndex, setImageIndex] = useState(0);
  const progress = project.current_phase >= 3 ? 100 : project.current_phase === 2 ? 50 : 0;

  useEffect(() => {
    fetchConcepts();
  }, [project.id]);

  const fetchConcepts = async () => {
    try {
      const data = await apiGet(`/api/concepts?projectId=${project.id}`);
      setConcepts(data || []);
    } catch (error) {
      console.error('Failed to fetch concepts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRating = async (conceptId, rating) => {
    try {
      await apiPatch(`/api/concepts/${conceptId}`, { user_rating: rating });
      fetchConcepts();
    } catch (error) {
      console.error('Failed to update rating:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (concepts.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
          <Image className="h-8 w-8 text-muted-foreground" />
        </div>
        <h4 className="text-lg font-semibold text-foreground mb-2">
          {progress === 100 ? 'Concepts Ready!' : 'Concepts coming soon'}
        </h4>
        <p className="text-muted-foreground mb-6">
          {progress === 100 
            ? 'Your designer has uploaded concepts' 
            : 'Your designer will upload concepts within 48 hours'}
        </p>
        <Progress value={progress} className="h-2 max-w-xs mx-auto" />
        <p className="text-sm text-muted-foreground mt-2">{progress}% complete</p>
      </div>
    );
  }

  const allImages = concepts.flatMap(c => c.render_urls || []);

  return (
    <div className="space-y-6">
      {/* Concept Grid */}
      {concepts.map((concept, idx) => (
        <motion.div
          key={concept.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: idx * 0.1 }}
          className={`p-4 rounded-xl border ${
            concept.is_selected 
              ? 'border-accent bg-accent/5' 
              : 'border-border/50 bg-card'
          }`}
        >
          {/* Concept Header */}
          <div className="flex items-center justify-between mb-4">
            <div>
              <h4 className="font-semibold text-foreground">{concept.concept_name}</h4>
              <p className="text-sm text-muted-foreground">
                Budget: ₹{concept.estimated_budget.toLocaleString()}
              </p>
            </div>
            {concept.is_selected && (
              <Badge className="bg-accent text-white border-0">Selected</Badge>
            )}
          </div>

          {/* Render Images Grid */}
          {concept.render_urls && concept.render_urls.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-4">
              {concept.render_urls.slice(0, 4).map((url, imgIdx) => (
                <Dialog key={imgIdx}>
                  <DialogTrigger asChild>
                    <button 
                      className="relative aspect-video rounded-lg overflow-hidden group cursor-zoom-in"
                      onClick={() => {
                        setSelectedImage(url);
                        setImageIndex(allImages.indexOf(url));
                      }}
                    >
                      <img
                        src={url}
                        alt={`Design ${imgIdx + 1}`}
                        className="w-full h-full object-cover transition-transform group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <ZoomIn className="h-6 w-6 text-white" />
                      </div>
                      {imgIdx === 3 && concept.render_urls && concept.render_urls.length > 4 && (
                        <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                          <span className="text-white font-medium">
                            +{concept.render_urls.length - 4} more
                          </span>
                        </div>
                      )}
                    </button>
                  </DialogTrigger>
                  <DialogContent className="max-w-4xl p-0 bg-black border-0">
                    <div className="relative">
                      <img
                        src={selectedImage || url}
                        alt="Concept render"
                        className="w-full h-auto"
                      />
                      {allImages.length > 1 && (
                        <>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="absolute left-2 top-1/2 -translate-y-1/2 text-white hover:bg-white/20"
                            onClick={() => {
                              const newIdx = (imageIndex - 1 + allImages.length) % allImages.length;
                              setImageIndex(newIdx);
                              setSelectedImage(allImages[newIdx]);
                            }}
                          >
                            <ChevronLeft className="h-6 w-6" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="absolute right-2 top-1/2 -translate-y-1/2 text-white hover:bg-white/20"
                            onClick={() => {
                              const newIdx = (imageIndex + 1) % allImages.length;
                              setImageIndex(newIdx);
                              setSelectedImage(allImages[newIdx]);
                            }}
                          >
                            <ChevronRight className="h-6 w-6" />
                          </Button>
                        </>
                      )}
                    </div>
                  </DialogContent>
                </Dialog>
              ))}
            </div>
          )}

          {/* Designer Message */}
          {concept.designer_message && (
            <div className="p-3 rounded-lg bg-muted/50 mb-4">
              <p className="text-sm text-muted-foreground italic">
                "{concept.designer_message}"
              </p>
            </div>
          )}

          {/* Rating & Feedback */}
          <div className="flex items-center justify-between pt-4 border-t border-border/50">
            {/* Star Rating */}
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => handleRating(concept.id, star)}
                  className="p-1 hover:scale-110 transition-transform"
                >
                  <Star
                    className={`h-5 w-5 ${
                      concept.user_rating && star <= concept.user_rating
                        ? 'text-yellow-500 fill-yellow-500'
                        : 'text-muted-foreground'
                    }`}
                  />
                </button>
              ))}
              {concept.user_rating && (
                <span className="text-sm text-muted-foreground ml-2">
                  {concept.user_rating}/5
                </span>
              )}
            </div>

            {/* Quick Feedback */}
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" className="h-8">
                <ThumbsUp className="h-4 w-4 mr-1" />
                Like
              </Button>
              <Button variant="ghost" size="sm" className="h-8">
                <ThumbsDown className="h-4 w-4 mr-1" />
                Dislike
              </Button>
              <Button variant="outline" size="sm" className="h-8">
                <MessageCircle className="h-4 w-4 mr-1" />
                Request Revision
              </Button>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}

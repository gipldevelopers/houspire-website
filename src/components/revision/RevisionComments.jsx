import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { MessageSquare, Send, User, Shield, Loader2 } from 'lucide-react';
export function RevisionComments({ revisionRequestId }) {
    const { user, isAdmin } = useAuth();
    const { toast } = useToast();
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    useEffect(() => {
        fetchComments();
        const cleanup = subscribeToComments();
        return cleanup;
    }, [revisionRequestId]);
    const fetchComments = async () => {
        try {
            const { data, error } = await supabase
                .from('revision_comments')
                .select('*')
                .eq('revision_request_id', revisionRequestId)
                .order('created_at', { ascending: true });
            if (error)
                throw error;
            setComments(data || []);
        }
        catch (error) {
            console.error('Failed to fetch comments:', error);
        }
        finally {
            setLoading(false);
        }
    };
    const subscribeToComments = () => {
        const channel = supabase
            .channel(`revision-comments-${revisionRequestId}`)
            .on('postgres_changes', {
            event: 'INSERT',
            schema: 'public',
            table: 'revision_comments',
            filter: `revision_request_id=eq.${revisionRequestId}`,
        }, () => {
            fetchComments();
        })
            .subscribe();
        return () => {
            supabase.removeChannel(channel);
        };
    };
    const handleSubmit = async () => {
        if (!newComment.trim()) {
            toast({
                title: 'Comment is empty',
                description: 'Please write something',
                variant: 'destructive',
            });
            return;
        }
        setSubmitting(true);
        try {
            const { error } = await supabase.from('revision_comments').insert({
                revision_request_id: revisionRequestId,
                user_id: user?.id,
                comment: newComment,
                is_admin: isAdmin,
            });
            if (error)
                throw error;
            setNewComment('');
            toast({
                title: 'Comment added! 💬',
            });
        }
        catch (error) {
            toast({
                title: 'Failed to add comment',
                description: error.message,
                variant: 'destructive',
            });
        }
        finally {
            setSubmitting(false);
        }
    };
    const formatDate = (date) => {
        const d = new Date(date);
        const now = new Date();
        const diffMs = now.getTime() - d.getTime();
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);
        if (diffMins < 1)
            return 'Just now';
        if (diffMins < 60)
            return `${diffMins}m ago`;
        if (diffHours < 24)
            return `${diffHours}h ago`;
        if (diffDays < 7)
            return `${diffDays}d ago`;
        return d.toLocaleDateString();
    };
    return (<Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <MessageSquare className="h-5 w-5"/>
          Comments ({comments.length})
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Comments List */}
        <div className="max-h-80 overflow-y-auto space-y-4">
          {loading ? (<div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground"/>
            </div>) : comments.length === 0 ? (<div className="text-center py-8">
              <MessageSquare className="h-12 w-12 mx-auto text-muted-foreground/50 mb-2"/>
              <p className="font-medium text-muted-foreground">No comments yet</p>
              <p className="text-sm text-muted-foreground">Be the first to comment</p>
            </div>) : (comments.map((comment, index) => (<motion.div key={comment.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.05 }} className="flex gap-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${comment.is_admin
                ? 'bg-primary/10 text-primary'
                : 'bg-muted text-muted-foreground'}`}>
                  {comment.is_admin ? (<Shield className="h-4 w-4"/>) : (<User className="h-4 w-4"/>)}
                </div>

                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium text-sm">
                      {comment.is_admin ? 'Admin' : 'You'}
                    </span>
                    {comment.is_admin && (<Badge variant="secondary" className="text-xs">
                        Admin
                      </Badge>)}
                    <span className="text-xs text-muted-foreground">
                      {formatDate(comment.created_at)}
                    </span>
                  </div>
                  <p className="text-sm text-foreground whitespace-pre-wrap">
                    {comment.comment}
                  </p>
                </div>
              </motion.div>)))}
        </div>

        {/* Add Comment */}
        <div className="pt-4 border-t space-y-3">
          <Textarea value={newComment} onChange={(e) => setNewComment(e.target.value)} placeholder="Add a comment..." rows={3} className="resize-none" onKeyDown={(e) => {
            if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
                handleSubmit();
            }
        }}/>

          <div className="flex items-center justify-between">
            <p className="text-xs text-muted-foreground">
              Press Cmd/Ctrl + Enter to submit
            </p>
            <Button onClick={handleSubmit} disabled={submitting || !newComment.trim()} size="sm">
              {submitting ? (<>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin"/>
                  Sending...
                </>) : (<>
                  <Send className="h-4 w-4 mr-2"/>
                  Comment
                </>)}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>);
}

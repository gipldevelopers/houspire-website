import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, } from '@/components/ui/dialog';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { MessageSquare, Mail, Clock, Reply, CheckCircle, X, ArrowRight, Loader2, } from 'lucide-react';
export function DesignerInquiriesTab() {
    const { user } = useAuth();
    const { toast } = useToast();
    const [inquiries, setInquiries] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedInquiry, setSelectedInquiry] = useState(null);
    const [responseText, setResponseText] = useState('');
    const [sending, setSending] = useState(false);
    const [statusFilter, setStatusFilter] = useState('all');
    useEffect(() => {
        fetchInquiries();
    }, []);
    const fetchInquiries = async () => {
        try {
            const { data, error } = await supabase
                .from('designer_inquiries')
                .select(`
          *,
          designer_profiles:designer_id (
            display_name,
            avatar_url,
            slug
          )
        `)
                .order('created_at', { ascending: false });
            if (error)
                throw error;
            // Fetch user profiles for logged-in users
            const inquiriesWithProfiles = await Promise.all((data || []).map(async (inquiry) => {
                if (inquiry.user_id) {
                    const { data: profile } = await supabase
                        .from('profiles')
                        .select('full_name')
                        .eq('user_id', inquiry.user_id)
                        .maybeSingle();
                    return { ...inquiry, profiles: profile };
                }
                return { ...inquiry, profiles: null };
            }));
            setInquiries(inquiriesWithProfiles);
        }
        catch (error) {
            toast({
                title: 'Failed to load inquiries',
                description: error.message,
                variant: 'destructive',
            });
        }
        finally {
            setLoading(false);
        }
    };
    const handleReply = async () => {
        if (!selectedInquiry || !responseText.trim())
            return;
        setSending(true);
        try {
            const { error } = await supabase
                .from('designer_inquiries')
                .update({
                admin_response: responseText.trim(),
                responded_at: new Date().toISOString(),
                responded_by: user?.id,
                status: 'replied',
            })
                .eq('id', selectedInquiry.id);
            if (error)
                throw error;
            // Create in-app notification for logged-in users
            if (selectedInquiry.user_id) {
                await supabase.rpc('create_in_app_notification', {
                    p_user_id: selectedInquiry.user_id,
                    p_type: 'info',
                    p_title: 'Designer Inquiry Response',
                    p_message: `You received a response to your inquiry about ${selectedInquiry.designer_profiles?.display_name || 'a designer'}`,
                    p_action_url: '/dashboard',
                    p_action_text: 'View Response',
                });
            }
            toast({ title: 'Response sent successfully' });
            setSelectedInquiry(null);
            setResponseText('');
            fetchInquiries();
        }
        catch (error) {
            toast({
                title: 'Failed to send response',
                description: error.message,
                variant: 'destructive',
            });
        }
        finally {
            setSending(false);
        }
    };
    const handleUpdateStatus = async (inquiryId, newStatus) => {
        try {
            const { error } = await supabase
                .from('designer_inquiries')
                .update({ status: newStatus })
                .eq('id', inquiryId);
            if (error)
                throw error;
            toast({ title: `Status updated to ${newStatus}` });
            fetchInquiries();
        }
        catch (error) {
            toast({
                title: 'Failed to update status',
                description: error.message,
                variant: 'destructive',
            });
        }
    };
    const getStatusBadge = (status) => {
        const styles = {
            new: 'bg-blue-500/10 text-blue-600 border-blue-200',
            replied: 'bg-green-500/10 text-green-600 border-green-200',
            converted: 'bg-purple-500/10 text-purple-600 border-purple-200',
            closed: 'bg-muted text-muted-foreground',
        };
        return (<Badge variant="outline" className={styles[status] || ''}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>);
    };
    const formatDate = (date) => {
        return new Date(date).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            hour: 'numeric',
            minute: '2-digit',
        });
    };
    const filteredInquiries = statusFilter === 'all'
        ? inquiries
        : inquiries.filter((i) => i.status === statusFilter);
    const newCount = inquiries.filter((i) => i.status === 'new').length;
    if (loading) {
        return (<div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground"/>
      </div>);
    }
    return (<div className="space-y-4">
      {/* Stats Row */}
      <div className="flex items-center gap-4 flex-wrap">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <MessageSquare className="h-4 w-4"/>
          <span>{inquiries.length} total inquiries</span>
        </div>
        {newCount > 0 && (<Badge variant="destructive">{newCount} new</Badge>)}
      </div>

      {/* Filters */}
      <div className="flex gap-2 flex-wrap">
        {['all', 'new', 'replied', 'converted', 'closed'].map((status) => (<button key={status} onClick={() => setStatusFilter(status)} className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${statusFilter === status
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted text-muted-foreground hover:bg-muted/80'}`}>
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </button>))}
      </div>

      {/* Inquiries List */}
      <ScrollArea className="h-[calc(100vh-280px)]">
        {filteredInquiries.length === 0 ? (<Card className="p-8 text-center">
            <MessageSquare className="h-12 w-12 mx-auto text-muted-foreground/50 mb-3"/>
            <p className="text-muted-foreground">No inquiries found</p>
          </Card>) : (<div className="space-y-3">
            <AnimatePresence mode="popLayout">
              {filteredInquiries.map((inquiry) => (<motion.div key={inquiry.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }} layout>
                  <Card className={`p-4 cursor-pointer transition-all hover:shadow-md ${inquiry.status === 'new' ? 'border-l-4 border-l-blue-500' : ''}`} onClick={() => {
                    setSelectedInquiry(inquiry);
                    setResponseText(inquiry.admin_response || '');
                }}>
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-start gap-3 flex-1 min-w-0">
                        <Avatar className="h-10 w-10 flex-shrink-0">
                          <AvatarImage src={inquiry.designer_profiles?.avatar_url || undefined} alt={inquiry.designer_profiles?.display_name}/>
                          <AvatarFallback>
                            {inquiry.designer_profiles?.display_name?.charAt(0) || 'D'}
                          </AvatarFallback>
                        </Avatar>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap mb-1">
                            <span className="font-medium text-foreground">
                              {inquiry.profiles?.full_name ||
                    inquiry.guest_name ||
                    'Anonymous'}
                            </span>
                            <ArrowRight className="h-3 w-3 text-muted-foreground"/>
                            <span className="text-sm text-muted-foreground">
                              {inquiry.designer_profiles?.display_name || 'Designer'}
                            </span>
                            {getStatusBadge(inquiry.status)}
                          </div>

                          <p className="text-sm text-muted-foreground truncate mb-2">
                            {inquiry.message}
                          </p>

                          <div className="flex items-center gap-4 text-xs text-muted-foreground">
                            {inquiry.guest_email && (<span className="flex items-center gap-1">
                                <Mail className="h-3 w-3"/>
                                {inquiry.guest_email}
                              </span>)}
                            <span className="flex items-center gap-1">
                              <Clock className="h-3 w-3"/>
                              {formatDate(inquiry.created_at)}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 flex-shrink-0">
                        {inquiry.status === 'new' && (<Button size="sm" variant="outline">
                            <Reply className="h-3 w-3 mr-1"/>
                            Reply
                          </Button>)}
                      </div>
                    </div>
                  </Card>
                </motion.div>))}
            </AnimatePresence>
          </div>)}
      </ScrollArea>

      {/* Inquiry Detail Modal */}
      <Dialog open={!!selectedInquiry} onOpenChange={() => setSelectedInquiry(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3">
              <Avatar className="h-10 w-10">
                <AvatarImage src={selectedInquiry?.designer_profiles?.avatar_url || undefined}/>
                <AvatarFallback>
                  {selectedInquiry?.designer_profiles?.display_name?.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div>
                <span className="block">Inquiry for {selectedInquiry?.designer_profiles?.display_name}</span>
                <span className="text-sm font-normal text-muted-foreground">
                  From {selectedInquiry?.profiles?.full_name || selectedInquiry?.guest_name || 'Guest'}
                </span>
              </div>
            </DialogTitle>
            <DialogDescription className="sr-only">
              View and respond to designer inquiry
            </DialogDescription>
          </DialogHeader>

          {selectedInquiry && (<div className="space-y-4">
              {/* Contact Info */}
              {selectedInquiry.guest_email && (<div className="flex items-center gap-2 p-3 bg-muted rounded-lg">
                  <Mail className="h-4 w-4 text-muted-foreground"/>
                  <span className="text-sm">{selectedInquiry.guest_email}</span>
                </div>)}

              {/* Original Message */}
              <div>
                <label className="text-sm font-medium text-muted-foreground mb-1 block">
                  Message
                </label>
                <div className="p-3 bg-muted/50 rounded-lg border">
                  <p className="text-sm whitespace-pre-wrap">{selectedInquiry.message}</p>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Sent {formatDate(selectedInquiry.created_at)}
                </p>
              </div>

              {/* Previous Response */}
              {selectedInquiry.admin_response && (<div>
                  <label className="text-sm font-medium text-muted-foreground mb-1 block">
                    Previous Response
                  </label>
                  <div className="p-3 bg-primary/5 rounded-lg border border-primary/20">
                    <p className="text-sm whitespace-pre-wrap">{selectedInquiry.admin_response}</p>
                  </div>
                  {selectedInquiry.responded_at && (<p className="text-xs text-muted-foreground mt-1">
                      Sent {formatDate(selectedInquiry.responded_at)}
                    </p>)}
                </div>)}

              {/* Response Input */}
              {selectedInquiry.status !== 'closed' && (<div>
                  <label className="text-sm font-medium mb-1 block">
                    {selectedInquiry.admin_response ? 'Update Response' : 'Your Response'}
                  </label>
                  <Textarea value={responseText} onChange={(e) => setResponseText(e.target.value)} placeholder="Write your response..." rows={4} className="resize-none"/>
                </div>)}

              {/* Actions */}
              <div className="flex items-center justify-between gap-2 pt-2">
                <div className="flex gap-2">
                  {selectedInquiry.status !== 'closed' && (<Button variant="outline" size="sm" onClick={() => {
                    handleUpdateStatus(selectedInquiry.id, 'closed');
                    setSelectedInquiry(null);
                }}>
                      <X className="h-3 w-3 mr-1"/>
                      Close
                    </Button>)}
                </div>

                <div className="flex gap-2">
                  <Button variant="outline" onClick={() => setSelectedInquiry(null)}>
                    Cancel
                  </Button>
                  {selectedInquiry.status !== 'closed' && (<Button onClick={handleReply} disabled={sending || !responseText.trim()}>
                      {sending ? (<>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin"/>
                          Sending...
                        </>) : (<>
                          <CheckCircle className="h-4 w-4 mr-2"/>
                          Send Response
                        </>)}
                    </Button>)}
                </div>
              </div>
            </div>)}
        </DialogContent>
      </Dialog>
    </div>);
}

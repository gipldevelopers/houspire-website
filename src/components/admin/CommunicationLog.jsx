import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, } from '@/components/ui/select';
import { Mail, Phone, MessageSquare, Clock, CheckCircle, Plus, User, Bot, } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
export function CommunicationLog({ projectId, userId }) {
    const { toast } = useToast();
    const [entries, setEntries] = useState([]);
    const [showAddDialog, setShowAddDialog] = useState(false);
    const [newEntry, setNewEntry] = useState({
        type: 'note',
        subject: '',
        content: '',
    });
    // Mock data
    useEffect(() => {
        setEntries([
            {
                id: '1',
                type: 'email',
                direction: 'outbound',
                subject: 'Your design concepts are ready! 🎨',
                content: 'Hi! Your 3D renders are ready for review. Please check your dashboard.',
                created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
                created_by: 'Admin',
                status: 'delivered',
            },
            {
                id: '2',
                type: 'system',
                direction: 'system',
                subject: 'Payment received',
                content: 'Payment of ₹499 received via Razorpay',
                created_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
                created_by: 'System',
                status: 'sent',
            },
            {
                id: '3',
                type: 'call',
                direction: 'outbound',
                subject: 'Project kickoff call',
                content: 'Discussed room requirements and timeline. Customer happy with package.',
                created_at: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString(),
                created_by: 'Admin',
                status: 'sent',
            },
        ]);
    }, [projectId]);
    const handleAddEntry = () => {
        if (!newEntry.content) {
            toast({
                title: 'Content required',
                description: 'Please enter the communication content',
                variant: 'destructive',
            });
            return;
        }
        const entry = {
            id: Date.now().toString(),
            type: newEntry.type,
            direction: 'outbound',
            subject: newEntry.subject || getDefaultSubject(newEntry.type),
            content: newEntry.content,
            created_at: new Date().toISOString(),
            created_by: 'Admin',
            status: 'sent',
        };
        setEntries((prev) => [entry, ...prev]);
        setNewEntry({ type: 'note', subject: '', content: '' });
        setShowAddDialog(false);
        toast({
            title: 'Entry logged',
            description: 'Communication added to log',
        });
    };
    const getDefaultSubject = (type) => {
        switch (type) {
            case 'email':
                return 'Email sent';
            case 'call':
                return 'Phone call';
            case 'sms':
                return 'SMS sent';
            default:
                return 'Note added';
        }
    };
    const getTypeIcon = (type) => {
        switch (type) {
            case 'email':
                return Mail;
            case 'call':
                return Phone;
            case 'sms':
                return MessageSquare;
            case 'system':
                return Bot;
            default:
                return MessageSquare;
        }
    };
    const getTypeColor = (type) => {
        switch (type) {
            case 'email':
                return 'bg-blue-100 text-blue-600 dark:bg-blue-900/50 dark:text-blue-400';
            case 'call':
                return 'bg-green-100 text-green-600 dark:bg-green-900/50 dark:text-green-400';
            case 'sms':
                return 'bg-purple-100 text-purple-600 dark:bg-purple-900/50 dark:text-purple-400';
            case 'system':
                return 'bg-muted text-muted-foreground';
            default:
                return 'bg-amber-100 text-amber-600 dark:bg-amber-900/50 dark:text-amber-400';
        }
    };
    const formatTimeAgo = (dateStr) => {
        const diff = Date.now() - new Date(dateStr).getTime();
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const days = Math.floor(hours / 24);
        if (hours < 1)
            return 'Just now';
        if (hours < 24)
            return `${hours}h ago`;
        if (days === 1)
            return 'Yesterday';
        return `${days} days ago`;
    };
    return (<div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="font-semibold">Communication Log</h3>
        <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
          <DialogTrigger asChild>
            <Button size="sm" variant="outline">
              <Plus className="h-4 w-4 mr-2"/>
              Add Entry
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Log Communication</DialogTitle>
              <DialogDescription>
                Record a call, email, or note about this project
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 pt-4">
              <div>
                <label className="text-sm font-medium">Type</label>
                <Select value={newEntry.type} onValueChange={(val) => setNewEntry({ ...newEntry, type: val })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="note">Internal Note</SelectItem>
                    <SelectItem value="call">Phone Call</SelectItem>
                    <SelectItem value="email">Email</SelectItem>
                    <SelectItem value="sms">SMS</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium">Subject (optional)</label>
                <input type="text" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" value={newEntry.subject} onChange={(e) => setNewEntry({ ...newEntry, subject: e.target.value })} placeholder="Brief summary..."/>
              </div>
              <div>
                <label className="text-sm font-medium">Content *</label>
                <Textarea value={newEntry.content} onChange={(e) => setNewEntry({ ...newEntry, content: e.target.value })} placeholder="Details about the communication..." rows={4}/>
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setShowAddDialog(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddEntry}>
                  <Plus className="h-4 w-4 mr-2"/>
                  Add Entry
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Timeline */}
      <div className="space-y-4">
        {entries.map((entry, idx) => {
            const TypeIcon = getTypeIcon(entry.type);
            return (<motion.div key={entry.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: idx * 0.05 }} className="flex gap-4">
              {/* Icon */}
              <div className={`p-2 rounded-xl h-fit ${getTypeColor(entry.type)}`}>
                <TypeIcon className="h-4 w-4"/>
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-medium text-foreground">{entry.subject}</span>
                  <Badge variant="outline" className="text-xs">
                    {entry.type}
                  </Badge>
                  {entry.status === 'delivered' && (<CheckCircle className="h-3.5 w-3.5 text-emerald-500"/>)}
                </div>
                <p className="text-sm text-muted-foreground line-clamp-2">{entry.content}</p>
                <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3"/>
                    {formatTimeAgo(entry.created_at)}
                  </span>
                  <span className="flex items-center gap-1">
                    <User className="h-3 w-3"/>
                    {entry.created_by}
                  </span>
                </div>
              </div>
            </motion.div>);
        })}
      </div>

      {entries.length === 0 && (<div className="text-center py-8 text-muted-foreground">
          <MessageSquare className="h-8 w-8 mx-auto mb-2 opacity-50"/>
          <p>No communication logged yet</p>
        </div>)}
    </div>);
}

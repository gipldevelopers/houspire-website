import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { appDataClient } from '@/lib/static-client';
import { useToast } from '@/hooks/use-toast';
import { User, Phone, MapPin, Calendar, MessageSquare, Send, Loader2, ExternalLink, } from 'lucide-react';
import { format } from 'date-fns';
export function AdminCustomerPanel({ projectId, customer, project }) {
    const { toast } = useToast();
    const [quizData, setQuizData] = useState(null);
    const [intakeData, setIntakeData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState('');
    const [sending, setSending] = useState(false);
    useEffect(() => {
        fetchCustomerData();
    }, [projectId]);
    const fetchCustomerData = async () => {
        // Fetch quiz results
        if (project?.user_id) {
            const { data: quiz } = await appDataClient
                .from('quiz_results')
                .select('*')
                .eq('user_id', project.user_id)
                .order('created_at', { ascending: false })
                .limit(1)
                .single();
            if (quiz) {
                setQuizData(quiz);
            }
        }
        // Fetch intake/project inputs
        const { data: inputs } = await appDataClient
            .from('project_inputs')
            .select('*')
            .eq('project_id', projectId)
            .single();
        if (inputs) {
            setIntakeData(inputs);
        }
        setLoading(false);
    };
    const handleSendMessage = async () => {
        if (!message.trim())
            return;
        setSending(true);
        try {
            await appDataClient.functions.invoke('send-notification', {
                body: {
                    type: 'admin_message',
                    project_id: projectId,
                    message: message,
                },
            });
            toast({
                title: 'Message sent!',
                description: 'Customer has been notified',
            });
            setMessage('');
        }
        catch (error) {
            toast({
                title: 'Failed to send',
                description: 'Please try again',
                variant: 'destructive',
            });
        }
        setSending(false);
    };
    if (loading) {
        return (<Card className="p-6">
        <div className="flex items-center justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground"/>
        </div>
      </Card>);
    }
    return (<div className="space-y-4">
      {/* Customer Info */}
      <Card className="p-4">
        <h4 className="font-medium mb-4 flex items-center gap-2">
          <User className="h-4 w-4"/>
          Customer
        </h4>

        <div className="space-y-3">
          <div>
            <p className="font-semibold">{customer?.full_name || 'Guest User'}</p>
            <p className="text-sm text-muted-foreground">ID: {project?.user_id?.slice(0, 8)}</p>
          </div>

          {customer?.phone && (<div className="flex items-center gap-2 text-sm">
              <Phone className="h-4 w-4 text-muted-foreground"/>
              <a href={`tel:${customer.phone}`} className="hover:underline">
                {customer.phone}
              </a>
            </div>)}

          {customer?.city && (<div className="flex items-center gap-2 text-sm">
              <MapPin className="h-4 w-4 text-muted-foreground"/>
              {customer.city}
            </div>)}

          <div className="flex items-center gap-2 text-sm">
            <Calendar className="h-4 w-4 text-muted-foreground"/>
            Joined {format(new Date(customer?.created_at || project?.created_at), 'MMM d, yyyy')}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="flex gap-2 mt-4 pt-4 border-t">
          <Button size="sm" variant="outline" className="flex-1" onClick={() => window.open(`tel:${customer?.phone}`)}>
            <Phone className="h-4 w-4 mr-1"/>
            Call
          </Button>
          <Button size="sm" variant="outline" className="flex-1" onClick={() => window.open(`https://wa.me/${customer?.phone?.replace(/\D/g, '')}`)}>
            <MessageSquare className="h-4 w-4 mr-1"/>
            WhatsApp
          </Button>
        </div>
      </Card>

      {/* Send Message */}
      <Card className="p-4">
        <h4 className="font-medium mb-3 flex items-center gap-2">
          <Send className="h-4 w-4"/>
          Quick Message
        </h4>
        <Textarea value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Type a message to send to customer..." rows={3} className="mb-3"/>
        <Button size="sm" onClick={handleSendMessage} disabled={sending || !message.trim()} className="w-full">
          {sending && <Loader2 className="h-4 w-4 animate-spin mr-1"/>}
          Send Notification
        </Button>
      </Card>

      {/* Project Details */}
      <Card className="p-4">
        <h4 className="font-medium mb-3">Project Details</h4>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Room Type</span>
            <span className="font-medium capitalize">{project?.room_type?.replace('_', ' ')}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Style</span>
            <span className="font-medium">{project?.design_style || 'Not set'}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Designer</span>
            <span className="font-medium">{project?.designer_persona || 'Not assigned'}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Amount Paid</span>
            <span className="font-medium text-emerald-600">₹{project?.total_paid?.toLocaleString() || 0}</span>
          </div>
        </div>
      </Card>

      {/* Quiz Results */}
      {quizData && (<Card className="p-4">
          <h4 className="font-medium mb-3">Style Quiz Results</h4>
          <div className="space-y-2 text-sm">
            <div>
              <span className="text-muted-foreground">Primary Designer: </span>
              <Badge variant="outline">{quizData.primary_designer}</Badge>
            </div>
            <div>
              <span className="text-muted-foreground">Vibe: </span>
              <span>{quizData.vibe}</span>
            </div>
            <div>
              <span className="text-muted-foreground">Budget: </span>
              <span>{quizData.budget}</span>
            </div>
            <div>
              <span className="text-muted-foreground">Colors: </span>
              <div className="flex gap-1 flex-wrap mt-1">
                {quizData.colors?.map((color) => (<Badge key={color} variant="secondary" className="text-xs">{color}</Badge>))}
              </div>
            </div>
            <div>
              <span className="text-muted-foreground">Styles: </span>
              <div className="flex gap-1 flex-wrap mt-1">
                {quizData.styles?.map((style) => (<Badge key={style} variant="secondary" className="text-xs">{style}</Badge>))}
              </div>
            </div>
          </div>
        </Card>)}

      {/* Intake Data */}
      {intakeData && (<Card className="p-4">
          <h4 className="font-medium mb-3">Intake Data</h4>
          <div className="space-y-2 text-sm">
            {intakeData.room_length && intakeData.room_width && (<div>
                <span className="text-muted-foreground">Dimensions: </span>
                <span>{intakeData.room_length} × {intakeData.room_width} {intakeData.room_height ? `× ${intakeData.room_height}` : ''} ft</span>
              </div>)}
            {intakeData.budget_min && intakeData.budget_max && (<div>
                <span className="text-muted-foreground">Budget Range: </span>
                <span>₹{intakeData.budget_min?.toLocaleString()} - ₹{intakeData.budget_max?.toLocaleString()}</span>
              </div>)}
            {intakeData.must_haves?.length > 0 && (<div>
                <span className="text-muted-foreground">Must Haves: </span>
                <div className="flex gap-1 flex-wrap mt-1">
                  {intakeData.must_haves.map((item) => (<Badge key={item} variant="outline" className="text-xs">{item}</Badge>))}
                </div>
              </div>)}
            {intakeData.avoid?.length > 0 && (<div>
                <span className="text-muted-foreground">Avoid: </span>
                <div className="flex gap-1 flex-wrap mt-1">
                  {intakeData.avoid.map((item) => (<Badge key={item} variant="destructive" className="text-xs">{item}</Badge>))}
                </div>
              </div>)}
            {intakeData.room_photos?.length > 0 && (<div>
                <span className="text-muted-foreground">Photos: </span>
                <span>{intakeData.room_photos.length} uploaded</span>
                <Button variant="link" size="sm" className="p-0 h-auto ml-2" onClick={() => window.open(intakeData.room_photos[0], '_blank')}>
                  View <ExternalLink className="h-3 w-3 ml-1"/>
                </Button>
              </div>)}
          </div>
        </Card>)}
    </div>);
}


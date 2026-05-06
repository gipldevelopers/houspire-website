import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Container } from '@/components/layout/Container';
import { CheckCircle, Clock, Wand2, Camera, ArrowRight, Home, MessageSquare, Download, } from 'lucide-react';
export function IntakeSuccess({ projectId }) {
    const navigate = useNavigate();
    const deadline = new Date();
    deadline.setHours(deadline.getHours() + 72);
    const steps = [
        {
            step: '1',
            icon: Camera,
            title: 'Designer reviews your photos',
            description: 'We analyze your space, dimensions, and preferences',
            time: 'Within 2 hours',
        },
        {
            step: '2',
            icon: Wand2,
            title: 'Creating room designs',
            description: 'Photorealistic designs from multiple angles',
            time: '24-48 hours',
        },
        {
            step: '3',
            icon: Download,
            title: 'Budget & shopping list',
            description: 'Detailed breakdown with vendor recommendations',
            time: '48-60 hours',
        },
        {
            step: '4',
            icon: CheckCircle,
            title: 'Package delivered',
            description: 'All files ready in your dashboard',
            time: 'Within 72 hours',
        },
    ];
    return (<div className="min-h-screen bg-gradient-to-br from-background to-primary/5 flex items-center justify-center p-4">
      <Container className="max-w-2xl">
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }} className="space-y-6">
          {/* Success Animation */}
          <div className="text-center">
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.2, type: 'spring', stiffness: 200 }} className="w-24 h-24 mx-auto mb-6 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
              <CheckCircle className="h-12 w-12 text-green-600"/>
            </motion.div>

            <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="text-3xl font-bold mb-2">
              We're on it! 🎉
            </motion.h1>

            <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="text-muted-foreground">
              Your designer will start creating your photorealistic room designs
            </motion.p>
          </div>

          {/* Timer Card */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
            <Card className="p-6 bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Clock className="h-5 w-5 text-primary"/>
                    <span className="font-semibold text-primary">
                      72-Hour Countdown Started
                    </span>
                  </div>
                  <p className="text-4xl font-bold text-primary mb-1">71:59:45</p>
                  <p className="text-sm text-muted-foreground">
                    Expected delivery:{' '}
                    {deadline.toLocaleString('en-IN', {
            day: 'numeric',
            month: 'short',
            hour: '2-digit',
            minute: '2-digit',
        })}
                  </p>
                </div>
                <div className="text-6xl">⏰</div>
              </div>
            </Card>
          </motion.div>

          {/* What Happens Next */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}>
            <Card className="p-6">
              <div className="flex items-center gap-2 mb-6">
                <Wand2 className="h-5 w-5 text-primary"/>
                <h3 className="font-semibold">What happens next?</h3>
              </div>

              <div className="space-y-4">
                {steps.map((item, idx) => {
            const Icon = item.icon;
            return (<div key={idx} className="flex gap-4">
                      <div className="flex flex-col items-center">
                        <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">
                          {item.step}
                        </div>
                        {idx < steps.length - 1 && (<div className="w-0.5 h-full bg-border my-1"/>)}
                      </div>
                      <div className="flex-1 pb-4">
                        <div className="flex items-center justify-between mb-1">
                          <div className="flex items-center gap-2">
                            <Icon className="h-4 w-4 text-primary"/>
                            <span className="font-medium">{item.title}</span>
                          </div>
                          <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded">
                            {item.time}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {item.description}
                        </p>
                      </div>
                    </div>);
        })}
              </div>
            </Card>
          </motion.div>

          {/* Actions */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }} className="flex flex-col sm:flex-row gap-3">
            <Button size="lg" className="flex-1 gap-2" onClick={() => navigate('/dashboard')}>
              <Home className="h-5 w-5"/>
              Go to Dashboard
              <ArrowRight className="h-5 w-5"/>
            </Button>

            <Button size="lg" variant="outline" className="flex-1" onClick={() => navigate('/discover')}>
              Browse Gallery
            </Button>
          </motion.div>

          {/* Help Section */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}>
            <Card className="p-4 bg-muted/50 text-center">
              <p className="text-sm text-muted-foreground mb-2">
                Need to add more details or have questions?
              </p>
              <div className="flex items-center justify-center gap-4">
                <Button variant="ghost" size="sm" onClick={() => window.open('mailto:hello@houspire.ai')} className="gap-2">
                  <MessageSquare className="h-4 w-4"/>
                  Contact support
                </Button>
              </div>
            </Card>
          </motion.div>
        </motion.div>
      </Container>
    </div>);
}

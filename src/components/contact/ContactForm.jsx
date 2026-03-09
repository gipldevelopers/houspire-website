'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { apiPost } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';
import { contactFormSchema, subjects } from '@/lib/schemas/contactSchema';
import { 
  Send, 
  Loader2, 
  CheckCircle, 
  MessageSquare,
  User,
  Mail,
  Phone,
  FileText,
  ArrowRight,
} from 'lucide-react';

export function ContactForm() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [submitted, setSubmitted] = useState(false);
  
  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: user?.name || '',
      email: user?.email || '',
      phone: '',
      subject: '',
      message: '',
    },
  });

  const messageLength = watch('message')?.length || 0;

  const onSubmit = async (data) => {
    try {
      await apiPost('/api/contact', {
        name: data.name,
        email: data.email,
        phone: data.phone || null,
        subject: subjects.find(s => s.value === data.subject)?.label || data.subject,
        message: data.message,
      });

      setSubmitted(true);
      toast({
        title: 'Message sent! 📧',
        description: "We'll get back to you within 24 hours",
      });

      reset();
    } catch (error) {
      toast({
        title: 'Failed to send',
        description: error.message || 'Please try again',
        variant: 'destructive',
      });
    }
  };

  if (submitted) {
    return (
      <Card className="p-8 md:p-12 border-border/50 bg-gradient-to-br from-green-500/5 to-green-500/10">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <div className="w-20 h-20 rounded-full bg-green-500/10 flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="h-10 w-10 text-green-600" />
          </div>
          <h2 className="text-2xl md:text-3xl font-semibold text-foreground mb-4">
            Message Received! 🎉
          </h2>
          <p className="text-muted-foreground mb-8 max-w-md mx-auto">
            Thank you for reaching out. Our team will review your message and get back to you within 24 hours.
          </p>
          <Button
            onClick={() => setSubmitted(false)}
            variant="outline"
            className="h-12 px-6 rounded-full"
          >
            Send Another Message
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </motion.div>
      </Card>
    );
  }

  return (
    <Card className="p-6 md:p-8 border-border/60 bg-gradient-to-br from-background via-amber-50/30 to-orange-50/40 shadow-sm">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-12 h-12 rounded-2xl bg-orange-100 flex items-center justify-center">
          <MessageSquare className="h-6 w-6 text-accent" />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-foreground">
            Send us a message
          </h2>
          <p className="text-sm text-muted-foreground">
            We'd love to hear from you
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Name & Email Row */}
        <div className="grid sm:grid-cols-2 gap-5">
          <div className="space-y-2">
            <Label htmlFor="name" className="flex items-center gap-2 text-sm font-medium">
              <User className="h-3.5 w-3.5 text-muted-foreground" />
              Full Name
            </Label>
            <Input
              id="name"
              {...register('name')}
              placeholder="John Doe"
              className={`h-12 rounded-xl ${errors.name ? 'border-destructive focus-visible:ring-destructive' : ''}`}
            />
            <AnimatePresence>
              {errors.name && (
                <motion.p
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  className="text-xs text-destructive"
                >
                  {errors.name.message}
                </motion.p>
              )}
            </AnimatePresence>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email" className="flex items-center gap-2 text-sm font-medium">
              <Mail className="h-3.5 w-3.5 text-muted-foreground" />
              Email Address
            </Label>
            <Input
              id="email"
              type="email"
              {...register('email')}
              placeholder="you@example.com"
              className={`h-12 rounded-xl ${errors.email ? 'border-destructive focus-visible:ring-destructive' : ''}`}
            />
            <AnimatePresence>
              {errors.email && (
                <motion.p
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  className="text-xs text-destructive"
                >
                  {errors.email.message}
                </motion.p>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Phone & Subject Row */}
        <div className="grid sm:grid-cols-2 gap-5">
          <div className="space-y-2">
            <Label htmlFor="phone" className="flex items-center gap-2 text-sm font-medium">
              <Phone className="h-3.5 w-3.5 text-muted-foreground" />
              Phone (Optional)
            </Label>
            <Input
              id="phone"
              {...register('phone')}
              placeholder="+91 98765 43210"
              className={`h-12 rounded-xl ${errors.phone ? 'border-destructive focus-visible:ring-destructive' : ''}`}
            />
            <AnimatePresence>
              {errors.phone && (
                <motion.p
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  className="text-xs text-destructive"
                >
                  {errors.phone.message}
                </motion.p>
              )}
            </AnimatePresence>
          </div>

          <div className="space-y-2">
            <Label htmlFor="subject" className="flex items-center gap-2 text-sm font-medium">
              <FileText className="h-3.5 w-3.5 text-muted-foreground" />
              Subject
            </Label>
            <select
              id="subject"
              {...register('subject')}
              className={`w-full h-12 px-4 border bg-background rounded-xl text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 ${
                errors.subject ? 'border-destructive' : 'border-input'
              }`}
            >
              <option value="">Select a topic</option>
              {subjects.map((subject) => (
                <option key={subject.value} value={subject.value}>
                  {subject.label}
                </option>
              ))}
            </select>
            <AnimatePresence>
              {errors.subject && (
                <motion.p
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  className="text-xs text-destructive"
                >
                  {errors.subject.message}
                </motion.p>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Message */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="message" className="flex items-center gap-2 text-sm font-medium">
              <MessageSquare className="h-3.5 w-3.5 text-muted-foreground" />
              Your Message
            </Label>
            <span className={`text-xs ${messageLength >= 20 ? 'text-emerald-600' : 'text-muted-foreground'}`}>
              {messageLength}/2000
            </span>
          </div>
          <Textarea
            id="message"
            {...register('message')}
            placeholder="Tell us about your project, questions, or how we can help..."
            rows={5}
            className={`rounded-xl resize-none ${errors.message ? 'border-destructive focus-visible:ring-destructive' : ''}`}
          />
          <div className="flex items-center justify-between">
            <AnimatePresence>
              {errors.message && (
                <motion.p
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  className="text-xs text-destructive"
                >
                  {errors.message.message}
                </motion.p>
              )}
            </AnimatePresence>
            {!errors.message && (
              <p className="text-xs text-muted-foreground">
                Minimum 20 characters
              </p>
            )}
          </div>
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          disabled={isSubmitting}
          className="w-full h-14 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white rounded-xl text-base font-semibold shadow-lg shadow-orange-500/20"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="h-5 w-5 mr-2 animate-spin" />
              Sending...
            </>
          ) : (
            <>
              <Send className="h-5 w-5 mr-2" />
              Send Message
            </>
          )}
        </Button>
      </form>
    </Card>
  );
}

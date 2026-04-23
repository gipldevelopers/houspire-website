'use client';

import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Mail, 
  Phone, 
  MapPin, 
  Clock, 
  MessageCircle,
  ArrowUpRight,
} from 'lucide-react';

const contactMethods = [
  {
    icon: Mail,
    label: 'Email',
    value: 'support@houspire.com',
    href: 'mailto:support@houspire.com',
    description: 'For general inquiries',
  },
  {
    icon: Phone,
    label: 'Phone',
    value: '+91 98765 43210',
    href: 'tel:+919876543210',
    description: 'Mon-Sat, 10AM-7PM IST',
  },
];

const officeInfo = {
  address: 'Hitech City, Hyderabad',
  state: 'Telangana, India 500081',
  hours: 'Monday - Saturday',
  timing: '10:00 AM - 7:00 PM IST',
};

function ContactSecondaryCards() {
  return (
    <>
      {/* WhatsApp CTA */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        viewport={{ once: true }}
      >
        <Card className="p-6 border-none" style={{ backgroundColor: 'color-mix(in srgb, var(--color-secondary) 10%, var(--color-bg))' }}>
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg" style={{ backgroundColor: 'var(--color-secondary)' }}>
              <MessageCircle className="h-6 w-6 text-white" />
            </div>
            <div>
              <h3 className="font-semibold" style={{ color: 'var(--color-heading-secondary)' }}>
                Prefer WhatsApp?
              </h3>
              <p className="text-sm opacity-60" style={{ color: 'var(--color-description)' }}>
                Get faster responses
              </p>
            </div>
          </div>
          <Button
            onClick={() => window.open('https://wa.me/919876543210?text=Hi%20Houspire!%20I%20have%20a%20question.', '_blank')}
            className="w-full h-11 text-white rounded-xl"
            style={{ backgroundColor: 'color-mix(in srgb, var(--color-secondary) 90%, black)' }}
          >
            <MessageCircle className="h-4 w-4 mr-2" />
            Chat on WhatsApp
          </Button>
        </Card>
      </motion.div>

      {/* Response Promise */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        viewport={{ once: true }}
      >
        <Card className="p-6 border-0 text-white" style={{ backgroundColor: 'var(--color-primary)' }}>
          <div className="flex items-center gap-3 mb-3">
            <Clock className="h-5 w-5" />
            <h3 className="font-semibold">Our Promise</h3>
          </div>
          <p className="text-white opacity-90 text-sm leading-relaxed">
            We respond to every inquiry within 24 hours on business days. Active project customers receive priority support.
          </p>
        </Card>
      </motion.div>
    </>
  );
}

export function ContactSidebar({ includeSecondary = true }) {
  return (
    <div className="space-y-6">
      {/* Quick Contact Methods */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        viewport={{ once: true }}
      >
        <Card className="p-6 border-[var(--color-border)] shadow-sm" style={{ backgroundColor: 'var(--color-bg)' }}>
          <h3 className="text-lg font-semibold mb-5" style={{ color: 'var(--color-heading-secondary)' }}>
            Quick Contact
          </h3>
          <div className="space-y-4">
            {contactMethods.map((method, idx) => {
              const Icon = method.icon;
              return (
                <a
                  key={idx}
                  href={method.href}
                  className="group flex items-start gap-4 p-3 -mx-3 rounded-xl hover:bg-muted/50 transition-colors"
                >
                  <div className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:text-white transition-colors" style={{ backgroundColor: 'color-mix(in srgb, var(--color-primary) 10%, transparent)' }}>
                    <Icon className="h-5 w-5" style={{ color: 'var(--color-primary)' }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm opacity-60" style={{ color: 'var(--color-description)' }}>{method.label}</p>
                    <p className="font-medium truncate transition-colors" style={{ color: 'var(--color-heading-secondary)' }}>
                      {method.value}
                    </p>
                    <p className="text-xs opacity-40 mt-0.5" style={{ color: 'var(--color-description)' }}>{method.description}</p>
                  </div>
                  <ArrowUpRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                </a>
              );
            })}
          </div>
        </Card>
      </motion.div>

      {/* Office Location */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        viewport={{ once: true }}
      >
        <Card className="overflow-hidden border-border/50">
          {/* Map Placeholder */}
          <div className="h-60 bg-gradient-to-br from-slate-100 to-amber-50 flex items-center justify-center relative" style={{ backgroundColor: 'color-mix(in srgb, var(--color-accent) 10%, transparent)' }}>
            <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.02)_1px,transparent_1px)] bg-[size:20px_20px]" />
            <div className="w-12 h-12 rounded-full flex items-center justify-center shadow-lg" style={{ backgroundColor: 'var(--color-primary)' }}>
              <MapPin className="h-6 w-6 text-white" />
            </div>
          </div>
          <div className="p-5">
            <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2" style={{ color: 'var(--color-heading-secondary)' }}>
              <MapPin className="h-4 w-4" style={{ color: 'var(--color-primary)' }} />
              Our Office
            </h3>
            <p className="text-sm text-foreground font-medium">{officeInfo.address}</p>
            <p className="text-sm text-muted-foreground">{officeInfo.state}</p>
            <div className="mt-4 pt-4 border-t border-border/50 flex items-center gap-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-xs text-muted-foreground">{officeInfo.hours}</p>
                <p className="text-sm font-medium text-foreground">{officeInfo.timing}</p>
              </div>
            </div>
          </div>
        </Card>
      </motion.div>

      {includeSecondary && <ContactSecondaryCards />}
    </div>
  );
}

export function ContactSidebarSecondary() {
  return (
    <div className="grid gap-6 md:grid-cols-2">
      <ContactSecondaryCards />
    </div>
  );
}

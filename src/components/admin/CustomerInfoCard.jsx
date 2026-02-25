import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Mail, Phone, MapPin, Calendar, ExternalLink, MessageSquare, } from 'lucide-react';
export function CustomerInfoCard({ customer }) {
    if (!customer) {
        return (<div className="text-center py-6 text-muted-foreground">
        No customer data available
      </div>);
    }
    return (<div className="space-y-4">
      {/* Avatar & Name */}
      <div className="flex items-center gap-3">
        <Avatar className="h-12 w-12">
          <AvatarFallback className="bg-primary/10 text-primary font-semibold">
            {customer.full_name?.charAt(0) || 'U'}
          </AvatarFallback>
        </Avatar>
        <div>
          <h4 className="font-semibold text-foreground">
            {customer.full_name || 'User'}
          </h4>
          <p className="text-xs text-muted-foreground">
            ID: {customer.id.slice(0, 8)}
          </p>
        </div>
      </div>

      {/* Contact Info */}
      <div className="space-y-2 text-sm">
        {customer.email && (<div className="flex items-center gap-2 text-muted-foreground">
            <Mail className="h-4 w-4 flex-shrink-0"/>
            <a href={`mailto:${customer.email}`} className="text-foreground hover:text-primary truncate">
              {customer.email}
            </a>
          </div>)}

        {customer.phone && (<div className="flex items-center gap-2 text-muted-foreground">
            <Phone className="h-4 w-4 flex-shrink-0"/>
            <a href={`tel:${customer.phone}`} className="text-foreground hover:text-primary">
              {customer.phone}
            </a>
          </div>)}

        {customer.city && (<div className="flex items-center gap-2 text-muted-foreground">
            <MapPin className="h-4 w-4 flex-shrink-0"/>
            <span>{customer.city}</span>
          </div>)}

        {customer.created_at && (<div className="flex items-center gap-2 text-muted-foreground">
            <Calendar className="h-4 w-4 flex-shrink-0"/>
            <span>
              Joined {new Date(customer.created_at).toLocaleDateString()}
            </span>
          </div>)}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-2 pt-2">
        <Button variant="outline" size="sm" onClick={() => customer.phone && window.open(`tel:${customer.phone}`)} disabled={!customer.phone}>
          <Phone className="h-4 w-4 mr-2"/>
          Call
        </Button>
        <Button variant="outline" size="sm" onClick={() => customer.email && window.open(`mailto:${customer.email}`)} disabled={!customer.email}>
          <Mail className="h-4 w-4 mr-2"/>
          Email
        </Button>
        <Button variant="outline" size="sm" onClick={() => customer.phone &&
            window.open(`https://wa.me/${customer.phone?.replace(/\D/g, '')}`)} disabled={!customer.phone}>
          <MessageSquare className="h-4 w-4 mr-2"/>
          WhatsApp
        </Button>
        <Button variant="outline" size="sm">
          <ExternalLink className="h-4 w-4 mr-2"/>
          Profile
        </Button>
      </div>
    </div>);
}

import { Card } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { DESIGNER_PERSONAS } from '@/lib/constants';
import { Quote } from 'lucide-react';
export function DesignerMessage({ designerPersona, message }) {
    const designer = DESIGNER_PERSONAS.find(d => d.id === designerPersona) || DESIGNER_PERSONAS[0];
    if (!message)
        return null;
    return (<Card className="p-6 bg-gradient-to-br from-primary/5 to-secondary/5 border-primary/20">
      <div className="flex gap-4">
        <Avatar className="h-12 w-12 border-2 border-primary/20">
          <AvatarImage src={designer.avatar} alt={designer.name}/>
          <AvatarFallback className="bg-primary text-primary-foreground">
            {designer.name.charAt(0)}
          </AvatarFallback>
        </Avatar>
        
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <h4 className="font-semibold">{designer.name}</h4>
            <span className="text-sm text-muted-foreground">• Your Designer</span>
          </div>
          
          <div className="relative">
            <Quote className="absolute -top-2 -left-2 h-6 w-6 text-primary/20"/>
            <p className="text-muted-foreground pl-4 italic">
              {message}
            </p>
          </div>
        </div>
      </div>
    </Card>);
}

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
export function EmptyState({ icon: Icon, title, description, actionLabel, onAction, }) {
    return (<Card className="border-dashed">
      <CardContent className="py-12">
        <div className="text-center">
          <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
            <Icon className="h-8 w-8 text-muted-foreground"/>
          </div>

          <h3 className="text-lg font-semibold mb-2">{title}</h3>

          <p className="text-muted-foreground max-w-sm mx-auto mb-6">
            {description}
          </p>

          {actionLabel && onAction && (<Button onClick={onAction} size="lg">
              {actionLabel}
            </Button>)}
        </div>
      </CardContent>
    </Card>);
}

import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
export function ProjectCardSkeleton() {
    return (<Card className="overflow-hidden">
      <div className="p-6">
        <div className="flex items-center gap-4 mb-4">
          <Skeleton className="h-12 w-12 rounded-full"/>
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-32"/>
            <Skeleton className="h-3 w-24"/>
          </div>
        </div>
        <Skeleton className="h-3 w-full mb-2"/>
        <Skeleton className="h-3 w-2/3"/>
      </div>
    </Card>);
}

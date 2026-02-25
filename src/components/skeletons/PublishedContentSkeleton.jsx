import { Skeleton } from '@/components/ui/skeleton';
export function PublishedContentSkeleton() {
    return (<div className="space-y-6">
      <Skeleton className="h-8 w-48"/>
      <Skeleton className="h-4 w-full"/>
      
      {/* Renders Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {[...Array(6)].map((_, idx) => (<div key={idx} className="space-y-2">
            <Skeleton className="aspect-[4/3] w-full rounded-lg"/>
            <Skeleton className="h-4 w-24"/>
            <Skeleton className="h-3 w-16"/>
          </div>))}
      </div>
    </div>);
}

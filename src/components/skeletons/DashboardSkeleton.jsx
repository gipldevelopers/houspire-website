import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
export function DashboardSkeleton() {
    return (<div className="min-h-screen bg-secondary/30 pt-20">
      <div className="container mx-auto px-6 py-8">
        {/* Header Skeleton */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="space-y-2">
              <Skeleton className="h-10 w-64"/>
              <Skeleton className="h-4 w-48"/>
            </div>
            <div className="flex gap-3">
              <Skeleton className="h-10 w-24 rounded-lg"/>
              <Skeleton className="h-10 w-32 rounded-full"/>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
            {[...Array(4)].map((_, idx) => (<Card key={idx} className="p-5 border-border/50">
                <Skeleton className="h-10 w-10 rounded-xl mb-3"/>
                <Skeleton className="h-8 w-16 mb-2"/>
                <Skeleton className="h-4 w-24"/>
              </Card>))}
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - 2/3 width */}
          <div className="lg:col-span-2 space-y-6">
            {/* Active Project Skeleton */}
            <Card className="overflow-hidden border-border/50">
              <div className="bg-muted p-6 md:p-8">
                <Skeleton className="h-6 w-24 mb-2"/>
                <Skeleton className="h-10 w-48 mb-2"/>
                <Skeleton className="h-4 w-36"/>
              </div>
              <div className="p-6 space-y-4">
                <div className="flex gap-2">
                  {[...Array(5)].map((_, idx) => (<Skeleton key={idx} className="h-12 w-full rounded-xl"/>))}
                </div>
                <Skeleton className="h-2 w-full rounded-full"/>
              </div>
            </Card>

            {/* Tabs Skeleton */}
            <Card className="p-6 border-border/50">
              <div className="flex gap-2 mb-4">
                {[...Array(4)].map((_, idx) => (<Skeleton key={idx} className="h-10 w-24 rounded-lg"/>))}
              </div>
              <div className="space-y-3">
                {[...Array(3)].map((_, idx) => (<Skeleton key={idx} className="h-16 w-full rounded-lg"/>))}
              </div>
            </Card>
          </div>

          {/* Right Column - 1/3 width */}
          <div className="space-y-6">
            {/* Notifications Skeleton */}
            <Card className="p-6 border-border/50">
              <div className="flex items-center justify-between mb-4">
                <Skeleton className="h-6 w-28"/>
                <Skeleton className="h-5 w-8 rounded-full"/>
              </div>
              <div className="space-y-3">
                {[...Array(3)].map((_, idx) => (<div key={idx} className="flex gap-3">
                    <Skeleton className="h-8 w-8 rounded-full"/>
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-4 w-full"/>
                      <Skeleton className="h-3 w-20"/>
                    </div>
                  </div>))}
              </div>
            </Card>

            {/* Style Profile Skeleton */}
            <Card className="p-6 border-border/50">
              <Skeleton className="h-6 w-24 mb-4"/>
              <div className="flex flex-wrap gap-2 mb-4">
                {[...Array(4)].map((_, idx) => (<Skeleton key={idx} className="h-7 w-20 rounded-full"/>))}
              </div>
              <Skeleton className="h-4 w-full"/>
            </Card>

            {/* Quick Actions Skeleton */}
            <Card className="p-6 border-border/50">
              <Skeleton className="h-6 w-28 mb-4"/>
              <div className="space-y-2">
                {[...Array(4)].map((_, idx) => (<Skeleton key={idx} className="h-10 w-full rounded-lg"/>))}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>);
}

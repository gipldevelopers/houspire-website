import { Skeleton } from '@/components/ui/skeleton';
import { Card } from '@/components/ui/card';
export function SkeletonCard() {
    return (<Card className="overflow-hidden">
      <Skeleton className="h-48 w-full"/>
      <div className="p-4 space-y-3">
        <Skeleton className="h-4 w-3/4"/>
        <Skeleton className="h-4 w-1/2"/>
        <Skeleton className="h-4 w-full"/>
      </div>
    </Card>);
}
export function SkeletonTable({ rows = 5 }) {
    return (<Card className="overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          {/* Header */}
          <thead className="bg-muted/50">
            <tr>
              {[1, 2, 3, 4].map((col) => (<th key={col} className="px-4 py-3 text-left">
                  <Skeleton className="h-4 w-20"/>
                </th>))}
            </tr>
          </thead>

          {/* Rows */}
          <tbody>
            {[...Array(rows)].map((_, i) => (<tr key={i} className="border-t border-border">
                <td className="px-4 py-4">
                  <div className="flex items-center gap-3">
                    <Skeleton className="h-10 w-10 rounded-full"/>
                    <Skeleton className="h-4 w-24"/>
                  </div>
                </td>
                <td className="px-4 py-4">
                  <Skeleton className="h-4 w-32"/>
                </td>
                <td className="px-4 py-4">
                  <Skeleton className="h-6 w-20 rounded-full"/>
                </td>
                <td className="px-4 py-4">
                  <div className="flex gap-2">
                    <Skeleton className="h-8 w-8 rounded"/>
                    <Skeleton className="h-8 w-8 rounded"/>
                  </div>
                </td>
              </tr>))}
          </tbody>
        </table>
      </div>
    </Card>);
}
export function SkeletonList({ count = 3 }) {
    return (<div className="space-y-4">
      {[...Array(count)].map((_, i) => (<SkeletonCard key={i}/>))}
    </div>);
}
export function SkeletonStats() {
    return (<div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {[1, 2, 3, 4].map((i) => (<Card key={i} className="p-6">
          <Skeleton className="h-4 w-20 mb-2"/>
          <Skeleton className="h-8 w-16"/>
        </Card>))}
    </div>);
}
export function SkeletonProfile() {
    return (<Card className="p-6">
      <div className="flex items-center gap-4 mb-6">
        <Skeleton className="h-20 w-20 rounded-full"/>
        <div className="space-y-2">
          <Skeleton className="h-6 w-32"/>
          <Skeleton className="h-4 w-48"/>
        </div>
      </div>
      <div className="space-y-4">
        <Skeleton className="h-4 w-full"/>
        <Skeleton className="h-4 w-3/4"/>
        <Skeleton className="h-4 w-1/2"/>
      </div>
    </Card>);
}

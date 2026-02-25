import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
export function AdminProjectsSkeleton() {
    return (<Card className="overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-muted/50">
            <tr>
              {['Project', 'Customer', 'Status', 'Timer', 'Phase', 'Created', 'Actions'].map((header, idx) => (<th key={idx} className="px-4 py-3 text-left">
                  <Skeleton className="h-4 w-20"/>
                </th>))}
            </tr>
          </thead>
          <tbody>
            {[...Array(5)].map((_, idx) => (<tr key={idx} className="border-t border-border/50">
                <td className="px-4 py-4">
                  <Skeleton className="h-5 w-32"/>
                </td>
                <td className="px-4 py-4">
                  <div className="space-y-1">
                    <Skeleton className="h-4 w-28"/>
                    <Skeleton className="h-3 w-40"/>
                  </div>
                </td>
                <td className="px-4 py-4">
                  <Skeleton className="h-6 w-20 rounded-full"/>
                </td>
                <td className="px-4 py-4">
                  <Skeleton className="h-5 w-16"/>
                </td>
                <td className="px-4 py-4">
                  <Skeleton className="h-5 w-12"/>
                </td>
                <td className="px-4 py-4">
                  <Skeleton className="h-4 w-24"/>
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

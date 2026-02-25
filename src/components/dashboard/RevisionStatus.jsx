'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { apiGet } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';
import {
  RefreshCw,
  Clock,
  CheckCircle,
  XCircle,
  ChevronRight,
  Inbox,
} from 'lucide-react';

export function RevisionStatus() {
  const { user } = useAuth();
  const router = useRouter();
  const [revisions, setRevisions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchRevisions();
    }
  }, [user]);

  const fetchRevisions = async () => {
    try {
      const data = await apiGet('/api/revision-requests?limit=5');
      setRevisions(data || []);
    } catch (error) {
      console.error('Failed to fetch revisions:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'in_progress':
        return <RefreshCw className="h-4 w-4 text-blue-500 animate-spin" />;
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'rejected':
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return null;
    }
  };

  const getStatusBadge = (status) => {
    const styles = {
      pending: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
      in_progress: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
      completed: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
      rejected: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
    };

    return (
      <Badge variant="outline" className={styles[status] || ''}>
        {status.replace('_', ' ')}
      </Badge>
    );
  };

  const getContentTypeLabel = (type) => {
    const labels = {
      render: 'Room Designs',
      budget: 'Budget',
      vendor: 'Vendors',
      material: 'Materials',
      all: 'All Content',
    };
    return labels[type] || type;
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <RefreshCw className="h-5 w-5" />
            Revision Requests
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-16 w-full" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (revisions.length === 0) {
    return null;
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <RefreshCw className="h-5 w-5 text-purple-600" />
          Revision Requests
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {revisions.map((revision) => (
            <div
              key={revision.id}
              onClick={() => router.push(`/project/${revision.project_id}`)}
              className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted cursor-pointer transition-colors"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="shrink-0">{getStatusIcon(revision.status)}</div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-medium truncate">
                      {revision.title}
                    </span>
                    {getStatusBadge(revision.status)}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {getContentTypeLabel(revision.content_type)} •{' '}
                    {new Date(revision.created_at).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0" />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

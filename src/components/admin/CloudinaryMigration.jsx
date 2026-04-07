import { useState, useCallback, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Slider } from '@/components/ui/slider';
import { toast } from 'sonner';
import { appDataClient } from '@/lib/static-client';
import { Cloud, Play, Pause, RotateCcw, CheckCircle, XCircle, AlertTriangle, Info } from 'lucide-react';
export function CloudinaryMigration() {
    const [isRunning, setIsRunning] = useState(false);
    const [isPaused, setIsPaused] = useState(false);
    const [stats, setStats] = useState({ total: 0, migrated: 0, remaining: 0, failed: 0 });
    const [logs, setLogs] = useState([]);
    const [batchSize, setBatchSize] = useState(5);
    const [currentCursor, setCurrentCursor] = useState();
    const pauseRef = useRef(false);
    const abortRef = useRef(false);
    const addLog = useCallback((message, type = 'info') => {
        const timestamp = new Date().toLocaleTimeString();
        const prefix = type === 'success' ? '✓' : type === 'error' ? '✗' : '→';
        setLogs(prev => [...prev.slice(-200), `[${timestamp}] ${prefix} ${message}`]);
    }, []);
    const fetchStats = useCallback(async () => {
        try {
            const [totalRes, migratedRes] = await Promise.all([
                appDataClient
                    .from('gallery_designs')
                    .select('id', { count: 'exact', head: true })
                    .not('cover_image_url', 'is', null),
                appDataClient
                    .from('gallery_designs')
                    .select('id', { count: 'exact', head: true })
                    .not('cloudinary_public_id', 'is', null),
            ]);
            const total = totalRes.count || 0;
            const migrated = migratedRes.count || 0;
            setStats(prev => ({
                ...prev,
                total,
                migrated,
                remaining: total - migrated,
            }));
        }
        catch (err) {
            console.error('Failed to fetch stats:', err);
        }
    }, []);
    const runMigrationBatch = useCallback(async (cursor) => {
        if (pauseRef.current || abortRef.current)
            return null;
        try {
            const { data, error } = await appDataClient.functions.invoke('migrate-to-cloudinary', {
                body: {
                    batchSize,
                    startAfter: cursor,
                },
            });
            if (error)
                throw error;
            return data;
        }
        catch (err) {
            addLog(`Batch error: ${err instanceof Error ? err.message : 'Unknown error'}`, 'error');
            return null;
        }
    }, [batchSize, addLog]);
    const startMigration = useCallback(async () => {
        setIsRunning(true);
        setIsPaused(false);
        pauseRef.current = false;
        abortRef.current = false;
        await fetchStats();
        addLog('Starting Cloudinary migration...', 'info');
        let cursor = currentCursor;
        let totalMigrated = 0;
        let totalFailed = 0;
        while (!abortRef.current) {
            if (pauseRef.current) {
                addLog('Migration paused', 'info');
                break;
            }
            addLog(`Processing batch (size: ${batchSize})...`, 'info');
            const result = await runMigrationBatch(cursor);
            if (!result) {
                if (pauseRef.current)
                    break;
                addLog('Batch failed, retrying in 5s...', 'error');
                await new Promise(r => setTimeout(r, 5000));
                continue;
            }
            totalMigrated += result.migrated;
            totalFailed += result.failed;
            if (result.migrated > 0) {
                addLog(`Migrated ${result.migrated} images`, 'success');
            }
            if (result.failed > 0) {
                addLog(`Failed: ${result.failed} images`, 'error');
                result.errors.forEach(err => addLog(err, 'error'));
            }
            setStats(prev => ({
                ...prev,
                migrated: prev.migrated + result.migrated,
                remaining: prev.remaining - result.migrated,
                failed: prev.failed + result.failed,
            }));
            if (!result.hasMore) {
                addLog(`Migration complete! Migrated: ${totalMigrated}, Failed: ${totalFailed}`, 'success');
                toast.success('Migration complete!', {
                    description: `Successfully migrated ${totalMigrated} images`,
                });
                break;
            }
            cursor = result.nextCursor;
            setCurrentCursor(cursor);
            // Small delay between batches to prevent rate limiting
            await new Promise(r => setTimeout(r, 500));
        }
        setIsRunning(false);
        if (abortRef.current) {
            addLog('Migration stopped', 'info');
        }
    }, [currentCursor, batchSize, fetchStats, runMigrationBatch, addLog]);
    const pauseMigration = useCallback(() => {
        pauseRef.current = true;
        setIsPaused(true);
    }, []);
    const resumeMigration = useCallback(() => {
        pauseRef.current = false;
        setIsPaused(false);
        startMigration();
    }, [startMigration]);
    const stopMigration = useCallback(() => {
        abortRef.current = true;
        pauseRef.current = false;
        setIsRunning(false);
        setIsPaused(false);
    }, []);
    const resetMigration = useCallback(() => {
        setCurrentCursor(undefined);
        setStats({ total: 0, migrated: 0, remaining: 0, failed: 0 });
        setLogs([]);
        fetchStats();
        addLog('Migration state reset', 'info');
    }, [fetchStats, addLog]);
    // Fetch stats on mount
    useEffect(() => {
        fetchStats();
    }, [fetchStats]);
    const progress = stats.total > 0 ? (stats.migrated / stats.total) * 100 : 0;
    return (<div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Cloud className="h-5 w-5 text-primary"/>
                Cloudinary Migration
              </CardTitle>
              <CardDescription>
                Migrate gallery images from Supabase Storage to Cloudinary CDN
              </CardDescription>
            </div>
            <Badge variant={isRunning ? (isPaused ? 'secondary' : 'default') : 'outline'}>
              {isRunning ? (isPaused ? 'Paused' : 'Running') : 'Idle'}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Stats */}
          <div className="grid grid-cols-4 gap-4">
            <StatCard label="Total Images" value={stats.total} icon={<Info className="h-4 w-4"/>}/>
            <StatCard label="Migrated" value={stats.migrated} icon={<CheckCircle className="h-4 w-4 text-green-500"/>}/>
            <StatCard label="Remaining" value={stats.remaining} icon={<AlertTriangle className="h-4 w-4 text-yellow-500"/>}/>
            <StatCard label="Failed" value={stats.failed} icon={<XCircle className="h-4 w-4 text-red-500"/>}/>
          </div>

          {/* Progress */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span>Progress</span>
              <span className="text-muted-foreground">{progress.toFixed(1)}%</span>
            </div>
            <Progress value={progress} className="h-3"/>
          </div>

          {/* Batch Size */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span>Batch Size</span>
              <span className="text-muted-foreground">{batchSize} images per batch</span>
            </div>
            <Slider value={[batchSize]} onValueChange={([value]) => setBatchSize(value)} min={3} max={15} step={1} disabled={isRunning}/>
          </div>

          {/* Controls */}
          <div className="flex gap-2">
            {!isRunning ? (<Button onClick={startMigration} className="gap-2">
                <Play className="h-4 w-4"/>
                {currentCursor ? 'Resume' : 'Start Migration'}
              </Button>) : isPaused ? (<Button onClick={resumeMigration} className="gap-2">
                <Play className="h-4 w-4"/>
                Continue
              </Button>) : (<Button onClick={pauseMigration} variant="secondary" className="gap-2">
                <Pause className="h-4 w-4"/>
                Pause
              </Button>)}
            
            {isRunning && (<Button onClick={stopMigration} variant="destructive" className="gap-2">
                Stop
              </Button>)}
            
            <Button onClick={resetMigration} variant="outline" className="gap-2" disabled={isRunning}>
              <RotateCcw className="h-4 w-4"/>
              Reset
            </Button>
            
            <Button onClick={fetchStats} variant="ghost" className="gap-2 ml-auto" disabled={isRunning}>
              Refresh Stats
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Logs */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Migration Logs</CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[300px] rounded-md border bg-muted/30 p-4 font-mono text-xs">
            {logs.length === 0 ? (<p className="text-muted-foreground">No logs yet. Start migration to see progress.</p>) : (logs.map((log, i) => (<div key={i} className={`py-0.5 ${log.includes('✓') ? 'text-emerald-600' :
                log.includes('✗') ? 'text-destructive' :
                    'text-muted-foreground'}`}>
                  {log}
                </div>)))}
          </ScrollArea>
        </CardContent>
      </Card>
    </div>);
}
function StatCard({ label, value, icon }) {
    return (<div className="rounded-lg border bg-card p-4">
      <div className="flex items-center gap-2 text-muted-foreground text-sm">
        {icon}
        {label}
      </div>
      <p className="text-2xl font-bold mt-1">{value.toLocaleString()}</p>
    </div>);
}


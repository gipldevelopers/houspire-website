import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';
import { Save, Trash2, GitCompare, Clock, X, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
const STORAGE_KEY = 'houspire-timeline-scenarios';
const MAX_SCENARIOS = 3;
export function TimelineSaveManager({ currentConfig, onLoadScenario }) {
    const [scenarios, setScenarios] = useState([]);
    const [isNaming, setIsNaming] = useState(false);
    const [scenarioName, setScenarioName] = useState('');
    const [compareMode, setCompareMode] = useState(false);
    useEffect(() => {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
            try {
                setScenarios(JSON.parse(saved));
            }
            catch {
                console.error('Failed to parse saved scenarios');
            }
        }
    }, []);
    const saveScenarios = (updated) => {
        setScenarios(updated);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    };
    const handleSave = () => {
        if (scenarios.length >= MAX_SCENARIOS) {
            toast.error(`Maximum ${MAX_SCENARIOS} scenarios allowed. Delete one first.`);
            return;
        }
        setIsNaming(true);
        setScenarioName(`${currentConfig.roomName} - ${currentConfig.scopeName}`);
    };
    const confirmSave = () => {
        if (!scenarioName.trim()) {
            toast.error('Please enter a name');
            return;
        }
        const newScenario = {
            id: Date.now().toString(),
            name: scenarioName.trim(),
            roomName: currentConfig.roomName,
            scopeName: currentConfig.scopeName,
            totalWeeks: currentConfig.totalWeeks,
            savedAt: new Date().toISOString(),
            config: {
                selectedRoom: currentConfig.selectedRoom,
                selectedScope: currentConfig.selectedScope,
                selectedAdditions: currentConfig.selectedAdditions,
                bufferWeeks: currentConfig.bufferWeeks,
                startDate: currentConfig.startDate.toISOString(),
            },
        };
        saveScenarios([...scenarios, newScenario]);
        setIsNaming(false);
        setScenarioName('');
        toast.success('Scenario saved!');
    };
    const handleDelete = (id) => {
        saveScenarios(scenarios.filter(s => s.id !== id));
        toast.success('Scenario deleted');
    };
    const handleLoad = (scenario) => {
        onLoadScenario(scenario.config);
        toast.success(`Loaded: ${scenario.name}`);
    };
    return (<Card>
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <Save className="h-5 w-5"/>
            Save & Compare
          </CardTitle>
          <div className="flex gap-2">
            {scenarios.length >= 2 && (<Button variant="ghost" size="sm" onClick={() => setCompareMode(!compareMode)}>
                <GitCompare className="h-4 w-4 mr-1"/>
                {compareMode ? 'Hide' : 'Compare'}
              </Button>)}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Save Section */}
        <AnimatePresence mode="wait">
          {isNaming ? (<motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="flex gap-2">
              <Input placeholder="Scenario name" value={scenarioName} onChange={(e) => setScenarioName(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && confirmSave()} autoFocus/>
              <Button size="icon" onClick={confirmSave}>
                <Check className="h-4 w-4"/>
              </Button>
              <Button size="icon" variant="ghost" onClick={() => setIsNaming(false)}>
                <X className="h-4 w-4"/>
              </Button>
            </motion.div>) : (<motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <Button variant="outline" className="w-full" onClick={handleSave} disabled={scenarios.length >= MAX_SCENARIOS}>
                <Save className="h-4 w-4 mr-2"/>
                Save Current Scenario
                {scenarios.length > 0 && (<Badge variant="secondary" className="ml-2">
                    {scenarios.length}/{MAX_SCENARIOS}
                  </Badge>)}
              </Button>
            </motion.div>)}
        </AnimatePresence>

        {/* Saved Scenarios */}
        {scenarios.length > 0 && (<div className="space-y-2">
            <p className="text-sm text-muted-foreground">Saved Scenarios</p>
            {scenarios.map((scenario) => (<motion.div key={scenario.id} layout initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="flex items-center gap-3 p-3 rounded-lg border bg-muted/30 hover:bg-muted/50 transition-colors">
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">{scenario.name}</p>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Clock className="h-3 w-3"/>
                    <span>{scenario.totalWeeks} weeks</span>
                    <span>•</span>
                    <span>{format(new Date(scenario.savedAt), 'dd MMM')}</span>
                  </div>
                </div>
                <div className="flex gap-1">
                  <Button size="sm" variant="ghost" onClick={() => handleLoad(scenario)}>
                    Load
                  </Button>
                  <Button size="icon" variant="ghost" className="h-8 w-8 text-destructive hover:text-destructive" onClick={() => handleDelete(scenario.id)}>
                    <Trash2 className="h-4 w-4"/>
                  </Button>
                </div>
              </motion.div>))}
          </div>)}

        {/* Comparison View */}
        <AnimatePresence>
          {compareMode && scenarios.length >= 2 && (<motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="pt-4 border-t">
              <p className="text-sm font-medium mb-3">Side-by-Side Comparison</p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {scenarios.map((scenario) => {
                const isCurrent = scenario.config.selectedRoom === currentConfig.selectedRoom &&
                    scenario.config.selectedScope === currentConfig.selectedScope;
                return (<div key={scenario.id} className={`p-3 rounded-lg border text-center ${isCurrent ? 'border-primary bg-primary/5' : ''}`}>
                      <p className="font-medium text-sm mb-2">{scenario.name}</p>
                      <p className="text-3xl font-bold text-primary">{scenario.totalWeeks}</p>
                      <p className="text-xs text-muted-foreground">weeks</p>
                      {isCurrent && (<Badge className="mt-2" variant="secondary">Current</Badge>)}
                    </div>);
            })}
              </div>
              
              {/* Difference highlight */}
              {scenarios.length >= 2 && (<div className="mt-3 p-2 rounded bg-muted text-center text-sm text-muted-foreground">
                  Difference: {Math.abs(scenarios[0].totalWeeks - scenarios[1].totalWeeks)} week
                  {Math.abs(scenarios[0].totalWeeks - scenarios[1].totalWeeks) !== 1 ? 's' : ''}
                </div>)}
            </motion.div>)}
        </AnimatePresence>

        {scenarios.length === 0 && (<p className="text-sm text-muted-foreground text-center py-4">
            Save scenarios to compare different project configurations
          </p>)}
      </CardContent>
    </Card>);
}

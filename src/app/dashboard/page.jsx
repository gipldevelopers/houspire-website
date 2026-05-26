'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { useAuth } from '@/contexts/AuthContext';
import { useProjectStatus } from '@/hooks/useProjectStatus';
import { DESIGNER_PERSONAS, ROOM_TYPES } from '@/lib/constants';
import { dataGet } from '@/lib/frontend-data';
import { motion } from 'framer-motion';
import { DashboardSkeleton } from '@/components/skeletons';
import { usePullToRefresh } from '@/hooks/usePullToRefresh';
import { PullToRefreshIndicator, MobileBottomNav } from '@/components/mobile';
import { useIsMobile } from '@/hooks/use-mobile';
import { 
  Archive, 
  ArchiveRestore, 
  Gift, 
  Share2, 
  HelpCircle, 
  ArrowRight, 
  Edit, 
  ChevronRight,
  ChevronDown,
  Plus,
  Settings,
  Sparkles,
  FolderOpen,
  Heart
} from 'lucide-react';

// Import dashboard components
import {
  InlineStats,
  ActiveProjectHero,
  ProjectStatusAccordion,
  ProjectTimelineTab,
  ProjectConceptsTab,
  ProjectShoppingTab,
  ProjectFilesTab,
  ProjectBudgetTab,
  ProjectMessagesTab,
  AllProjectsGrid,
  QuickActionsCard,
  StartProjectModal,
  PendingOrdersCard,
  ActiveOrdersCard,
  MessagesCard,
  InspirationBoardsCard,
  DashboardFAB,
  ProgressiveRevealWrapper,
  LiveTrackingBanner,
} from '@/components/dashboard';

function getTimeBasedGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  return 'Good evening';
}

import { Suspense } from 'react';

function DashboardContent() {
  const { user, loading: authLoading } = useAuth();
  const { projects, activeProject, loading: projectsLoading, setActiveProject, refetch } = useProjectStatus(user?.id);
  const router = useRouter();
  const searchParams = useSearchParams();
  const isMobile = useIsMobile();
  const [profile, setProfile] = useState(null);
  const [showStartModal, setShowStartModal] = useState(false);
  const [activeTab, setActiveTab] = useState('timeline');
  const [showAllProjects, setShowAllProjects] = useState(false);
  const [showArchived, setShowArchived] = useState(false);
  const [showUtilities, setShowUtilities] = useState(false);
  const tabsRef = useRef(null);
  
  // Handle tab query parameter
  useEffect(() => {
    const tabParam = searchParams.get('tab');
    if (tabParam === 'chat' || tabParam === 'messages') {
      setActiveTab('messages');
      setTimeout(() => {
        tabsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 300);
    }
  }, [searchParams]);

  // Pull to refresh
  const handleRefresh = useCallback(async () => {
    if (refetch) await refetch();
    await new Promise((resolve) => setTimeout(resolve, 300));
  }, [refetch]);

  const { isPulling, isRefreshing, pullDistance } = usePullToRefresh({
    onRefresh: handleRefresh,
    threshold: 80,
    disabled: !isMobile,
  });

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (user) {
      const fetchProfile = async () => {
        try {
          const { profile: profileData } = await dataGet('/profile');
          setProfile(profileData);
        } catch (error) {
          console.error('Error fetching profile:', error);
        }
      };
      fetchProfile();
    }
  }, [user]);

  const projectDesigner = activeProject 
    ? DESIGNER_PERSONAS.find(d => d.id === activeProject.designer_persona)
    : null;
  const roomType = activeProject 
    ? ROOM_TYPES.find(r => r.value === activeProject.room_type)
    : null;

  if (authLoading || projectsLoading) {
    return <DashboardSkeleton />;
  }

  const filteredProjects = projects.filter(p => (p.archived === true) === showArchived);
  const greeting = getTimeBasedGreeting();
  const rawName = profile?.fullName?.split(' ')[0] || 'there';
  const displayName = rawName.charAt(0).toUpperCase() + rawName.slice(1).toLowerCase();

  return (
    <div className="min-h-screen bg-secondary/30 pt-20 pb-24 md:pb-8">
      <PullToRefreshIndicator isPulling={isPulling} isRefreshing={isRefreshing} pullDistance={pullDistance} />

      <div className="container mx-auto px-4 md:px-6 py-6 md:py-8 max-w-5xl">
        
        {/* ===== HEADER SECTION ===== */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-6"
        >
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-semibold text-foreground tracking-tight">
                {greeting}, {displayName}!
              </h1>
              <p className="text-muted-foreground text-sm mt-1">
                {projects.length > 0 
                  ? `You have ${projects.filter(p => p.current_phase < 6).length} active project${projects.filter(p => p.current_phase < 6).length !== 1 ? 's' : ''}`
                  : 'Start your first design project today'
                }
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => router.push('/dashboard/settings')}
                className="text-muted-foreground"
              >
                <Settings className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => router.push('/dashboard/inspiration')}
                className="rounded-full"
              >
                <Heart className="h-4 w-4 mr-1.5" />
                My Boards
              </Button>
              <Button
                onClick={() => router.push('/select-package')}
                size="sm"
                className="bg-foreground hover:bg-foreground/90 text-background rounded-full px-4"
              >
                <Plus className="h-4 w-4 mr-1.5" />
                New Project
              </Button>
            </div>
          </div>

          {/* Inline Stats */}
          <InlineStats projects={projects} />
        </motion.div>

        {/* ===== MAIN CONTENT ===== */}
        <div className="space-y-6">

          {/* SECTION 0: Live Tracking Banner */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.05 }}
          >
            <LiveTrackingBanner />
          </motion.div>
          
          {/* SECTION 1: Active Orders (Most Important) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <ActiveOrdersCard />
          </motion.div>

          {/* SECTION 2: Pending Orders */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15 }}
          >
            <PendingOrdersCard />
          </motion.div>

          {/* SECTION 3: Active Project Hero OR Empty State */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            {activeProject ? (
              <ActiveProjectHero 
                project={activeProject} 
                designer={projectDesigner}
                roomType={roomType}
              />
            ) : (
              <Card className="p-8 text-center border-border/50 border-dashed">
                <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
                  <Sparkles className="h-6 w-6 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-1">No active design projects</h3>
                <p className="text-sm text-muted-foreground mb-4 max-w-sm mx-auto">
                  Complete an order above to start working with a designer on your space.
                </p>
                <Button 
                  variant="outline" 
                  onClick={() => setShowStartModal(true)}
                  className="rounded-full"
                >
                  Learn how it works
                </Button>
                <StartProjectModal open={showStartModal} onOpenChange={setShowStartModal} />
              </Card>
            )}
          </motion.div>

          {/* SECTION 4: Project Tabs (if active project) */}
          {activeProject && (
            <motion.div 
              ref={tabsRef}
              initial={{ opacity: 0, y: 20 }} 
              animate={{ opacity: 1, y: 0 }} 
              transition={{ duration: 0.5, delay: 0.25 }}
            >
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="w-full justify-start overflow-x-auto flex-nowrap bg-card border border-border rounded-xl p-1 gap-1">
                  <TabsTrigger value="timeline" className="rounded-lg text-xs md:text-sm whitespace-nowrap data-[state=active]:bg-foreground data-[state=active]:text-background">
                    Timeline
                  </TabsTrigger>
                  <TabsTrigger value="concepts" className="rounded-lg text-xs md:text-sm whitespace-nowrap data-[state=active]:bg-foreground data-[state=active]:text-background">
                    Concepts
                  </TabsTrigger>
                  <TabsTrigger value="shopping" className="rounded-lg text-xs md:text-sm whitespace-nowrap data-[state=active]:bg-foreground data-[state=active]:text-background">
                    Shopping
                  </TabsTrigger>
                  <TabsTrigger value="files" className="rounded-lg text-xs md:text-sm whitespace-nowrap data-[state=active]:bg-foreground data-[state=active]:text-background">
                    Files
                  </TabsTrigger>
                  <TabsTrigger value="budget" className="rounded-lg text-xs md:text-sm whitespace-nowrap data-[state=active]:bg-foreground data-[state=active]:text-background">
                    Budget
                  </TabsTrigger>
                  <TabsTrigger value="messages" className="rounded-lg text-xs md:text-sm whitespace-nowrap data-[state=active]:bg-foreground data-[state=active]:text-background">
                    Messages
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="timeline" className="mt-4">
                  <Card className="p-4 md:p-6 border-border/50"><ProjectTimelineTab project={activeProject} /></Card>
                </TabsContent>
                <TabsContent value="concepts" className="mt-4">
                  <Card className="p-4 md:p-6 border-border/50">
                    <ProgressiveRevealWrapper
                      isLocked={activeProject.current_phase < 3}
                      lockedMessage="Design concepts appear here once your designer starts working."
                      unlockLabel="Unlocks at Design Phase"
                    >
                      <ProjectConceptsTab project={activeProject} />
                    </ProgressiveRevealWrapper>
                  </Card>
                </TabsContent>
                <TabsContent value="shopping" className="mt-4">
                  <Card className="p-4 md:p-6 border-border/50">
                    <ProgressiveRevealWrapper
                      isLocked={activeProject.current_phase < 4}
                      lockedMessage="Your shopping list unlocks when your design is approved."
                      unlockLabel="Unlocks after Design Approval"
                    >
                      <ProjectShoppingTab project={activeProject} />
                    </ProgressiveRevealWrapper>
                  </Card>
                </TabsContent>
                <TabsContent value="files" className="mt-4">
                  <Card className="p-4 md:p-6 border-border/50"><ProjectFilesTab project={activeProject} /></Card>
                </TabsContent>
                <TabsContent value="budget" className="mt-4">
                  <Card className="p-4 md:p-6 border-border/50"><ProjectBudgetTab project={activeProject} /></Card>
                </TabsContent>
                <TabsContent value="messages" className="mt-4">
                  <Card className="p-4 md:p-6 border-border/50"><ProjectMessagesTab project={activeProject} designer={projectDesigner} /></Card>
                </TabsContent>
              </Tabs>
            </motion.div>
          )}

          {/* SECTION 5: Quick Actions + Messages + Inspiration */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="grid md:grid-cols-3 gap-4"
          >
            <QuickActionsCard />
            <MessagesCard />
            <InspirationBoardsCard />
          </motion.div>

          {/* SECTION 6: Project Status (Health + Deadlines + Activity) - Collapsed */}
          {activeProject && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.35 }}
            >
              <ProjectStatusAccordion
                projectId={activeProject.id}
                currentPhase={activeProject.current_phase}
                timerPercentage={(activeProject.timer_elapsed_seconds / activeProject.timer_total_seconds) * 100}
                revisionCount={0}
                hasUnreadMessages={false}
                projectCreatedAt={activeProject.created_at}
              />
            </motion.div>
          )}

          {/* SECTION 7: All Projects (Collapsible) */}
          {projects.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <Collapsible open={showAllProjects} onOpenChange={setShowAllProjects}>
                <Card className="border-border/50 overflow-hidden">
                  <CollapsibleTrigger asChild>
                    <button className="w-full p-4 flex items-center justify-between hover:bg-muted/30 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center">
                           <FolderOpen className="h-5 w-5 text-muted-foreground" />
                        </div>
                        <div className="text-left">
                          <p className="font-medium text-foreground">All Projects</p>
                          <p className="text-sm text-muted-foreground">{projects.length} total projects</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={(e) => { e.stopPropagation(); setShowArchived(!showArchived) }}
                          className="text-xs"
                        >
                          {showArchived ? <ArchiveRestore className="h-3 w-3 mr-1" /> : <Archive className="h-3 w-3 mr-1" />}
                          {showArchived ? 'Active' : 'Archived'}
                        </Button>
                        <ChevronDown className={`h-5 w-5 text-muted-foreground transition-transform ${showAllProjects ? 'rotate-180' : ''}`} />
                      </div>
                    </button>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <div className="px-4 pb-4 border-t border-border/50 pt-4">
                      <AllProjectsGrid projects={filteredProjects} onSelect={setActiveProject} />
                    </div>
                  </CollapsibleContent>
                </Card>
              </Collapsible>
            </motion.div>
          )}

          {/* SECTION 8: Utility Cards (Style + Referral + Help) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.45 }}
          >
            <Collapsible open={showUtilities} onOpenChange={setShowUtilities}>
              <CollapsibleTrigger asChild>
                <button className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-muted/30 transition-colors">
                  <span className="text-sm font-medium text-muted-foreground">More options</span>
                  <ChevronDown className={`h-4 w-4 text-muted-foreground transition-transform ${showUtilities ? 'rotate-180' : ''}`} />
                </button>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
                  {/* Referral */}
                  <Card className="p-4 border-border/50 bg-gradient-to-br from-accent/5 to-purple-500/5">
                    <div className="flex items-center gap-3 mb-2">
                      <Gift className="h-5 w-5 text-accent" />
                      <h4 className="font-medium text-foreground text-sm">Refer & earn ₹500</h4>
                    </div>
                    <p className="text-xs text-muted-foreground mb-3">Give friends ₹500 off their first project</p>
                    <Button variant="outline" size="sm" onClick={() => router.push('/referrals')} className="h-8 rounded-full text-xs">
                      <Share2 className="h-3 w-3 mr-1.5" />Share link
                    </Button>
                  </Card>

                  {/* Help */}
                  <Card className="p-4 border-border/50">
                    <div className="flex items-center gap-3 mb-2">
                      <HelpCircle className="h-5 w-5 text-muted-foreground" />
                      <h4 className="font-medium text-foreground text-sm">Need help?</h4>
                    </div>
                    <p className="text-xs text-muted-foreground mb-3">Our support team is here for you</p>
                    <Button variant="ghost" size="sm" onClick={() => router.push('/faq')} className="h-8 px-0 text-xs text-accent hover:text-accent/80">
                      Contact support <ArrowRight className="h-3 w-3 ml-1" />
                    </Button>
                  </Card>
                </div>
              </CollapsibleContent>
            </Collapsible>
          </motion.div>

        </div>
      </div>

      {/* Mobile FAB */}
      <DashboardFAB />
      
      {/* Mobile Bottom Navigation */}
      <MobileBottomNav />
    </div>
  );
}

export default function Dashboard() {
  return (
    <Suspense fallback={<DashboardSkeleton />}>
      <DashboardContent />
    </Suspense>
  );
}



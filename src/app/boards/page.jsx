'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Container } from '@/components/layout/Container';
import { Button } from '@/components/ui/button';
import { BoardCard } from '@/components/gallery/BoardCard';
import { BoardDetailModal } from '@/components/gallery/BoardDetailModal';
import { CreateBoardModal } from '@/components/gallery/CreateBoardModal';
import { LayoutGrid, Plus, ArrowLeft, Gem } from 'lucide-react';
import Link from 'next/link';
import { getInspirationBoards, createBoard } from '@/lib/inspiration-service';
import { useToast } from '@/hooks/use-toast';
import { SEOHead } from '@/components/SEOHead';
import { motion } from 'framer-motion';

export default function BoardsPage() {
  const { toast } = useToast();
  const [boards, setBoards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedBoard, setSelectedBoard] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  const loadBoards = useCallback(async () => {
    setLoading(true);
    const data = await getInspirationBoards();
    setBoards(data);
    setLoading(false);
  }, []);

  useEffect(() => {
    loadBoards();
  }, [loadBoards]);

  // Sync selected board ifboards update
  useEffect(() => {
    if (selectedBoard) {
      const updated = boards.find(b => b.id === selectedBoard.id);
      if (updated) setSelectedBoard(updated);
    }
  }, [boards, selectedBoard?.id]);

  // Listen for board updates
  useEffect(() => {
    const handleUpdate = () => loadBoards();
    window.addEventListener('boardsUpdated', handleUpdate);
    return () => window.removeEventListener('boardsUpdated', handleUpdate);
  }, [loadBoards]);

  const handleCreateBoard = async (newBoard) => {
    // Note: The modal calls service directly, but we might want custom logic here
    loadBoards();
    toast({
      title: "Board Created! ✨",
      description: `"${newBoard.name}" is ready for your inspirations.`,
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <SEOHead 
        title="My Boards - Houspire"
        description="Your personal collections of interior design inspiration."
      />

      {/* Header / Hero Section */}
      <header className="border-b border-secondary/50 bg-secondary/10 pt-28 pb-12 md:pt-36 md:pb-20">
        <Container>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-4">
              <Link 
                href="/discover" 
                className="inline-flex items-center gap-2 text-primary font-bold text-xs uppercase tracking-widest hover:gap-3 transition-all"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                Back to Gallery
              </Link>
              <div className="flex items-center gap-4">
                <div className="p-4 rounded-[2rem] bg-primary text-white shadow-lg shadow-primary/20">
                  <LayoutGrid className="h-8 w-8" />
                </div>
                <div>
                  <h1 className="text-4xl md:text-5xl font-black tracking-tighter text-foreground">My Boards</h1>
                  <p className="text-muted-foreground font-medium mt-1">Your private collections of design excellence.</p>
                </div>
              </div>
            </div>

            <Button 
              onClick={() => setIsCreateModalOpen(true)}
              className="rounded-full h-14 px-8 bg-foreground text-background hover:bg-foreground/90 font-bold shadow-xl transition-all hover:scale-105 active:scale-95 gap-2"
            >
              <Plus className="h-5 w-5" />
              Create New Board
            </Button>
          </div>
        </Container>
      </header>

      {/* Boards Grid */}
      <main className="py-16 md:py-24">
        <Container>
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="space-y-4 animate-pulse">
                  <div className="aspect-[4/3] rounded-3xl bg-secondary/20" />
                  <div className="h-4 w-1/2 bg-secondary/20 rounded" />
                  <div className="h-3 w-1/4 bg-secondary/10 rounded" />
                </div>
              ))}
            </div>
          ) : boards.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
              {boards.map((board) => (
                <BoardCard 
                  key={board.id} 
                  board={board} 
                  onClick={() => {
                    setSelectedBoard(board);
                    setIsDetailModalOpen(true);
                  }}
                />
              ))}
            </div>
          ) : (
            <div className="max-w-md mx-auto text-center py-20">
              <div className="w-24 h-24 rounded-full bg-secondary/10 flex items-center justify-center mx-auto mb-8">
                <Gem className="h-10 w-10 text-muted-foreground/30" />
              </div>
              <h2 className="text-2xl font-bold text-foreground italic">Your collections are empty</h2>
              <p className="text-muted-foreground mt-4 leading-relaxed">
                Start saving designs you love from the gallery to build your dream home inspiration boards.
              </p>
              <Button 
                asChild
                className="mt-10 rounded-full h-12 px-8 font-bold"
              >
                <Link href="/discover">Browse Gallery</Link>
              </Button>
            </div>
          )}
        </Container>
      </main>

      {/* Modals */}
      <CreateBoardModal 
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onCreate={handleCreateBoard}
      />

      <BoardDetailModal 
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        board={selectedBoard}
        onUpdate={loadBoards}
      />
    </div>
  );
}

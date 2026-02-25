import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Lock, Globe, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export function CreateBoardModal({ isOpen, onClose, onCreate }) {
  const [boardName, setBoardName] = useState('');
  const [isSecret, setIsSecret] = useState(false);
  const [error, setError] = useState('');

  // Reset state when modal opens
  useEffect(() => {
    if (isOpen) {
      setBoardName('');
      setIsSecret(false);
      setError('');
    }
  }, [isOpen]);

  const handleCreate = () => {
    if (boardName.length < 3) {
      setError('Board name must be at least 3 characters');
      return;
    }

    const newBoard = {
      id: Date.now(),
      name: boardName,
      isSecret: isSecret,
      createdAt: new Date(),
      itemsCount: 0,
    };

    onCreate(newBoard);
    setBoardName('');
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
          />

          {/* Modal Content */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-secondary/50">
              <h2 className="text-xl font-bold text-foreground">Create Board</h2>
              <button
                onClick={onClose}
                className="p-2 rounded-full hover:bg-secondary transition-colors"
              >
                <X className="h-5 w-5 text-muted-foreground" />
              </button>
            </div>

            {/* Body */}
            <div className="p-6 space-y-6">
              {/* Name Input */}
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1">
                  Board Name
                </label>
                <input
                  autoFocus
                  type="text"
                  placeholder='e.g., "My Dream Kitchen"'
                  value={boardName}
                  onChange={(e) => {
                    setBoardName(e.target.value);
                    if (e.target.value.length >= 3) setError('');
                  }}
                  className={cn(
                    "w-full px-5 py-4 rounded-2xl bg-secondary/50 border-2 border-transparent focus:border-primary/20 outline-none transition-all text-sm font-medium",
                    error && "border-destructive/20 focus:border-destructive/30"
                  )}
                />
                {error && <p className="text-[11px] text-destructive font-bold ml-1">{error}</p>}
              </div>

              {/* Secret Toggle */}
              <div className="flex items-center justify-between p-4 rounded-2xl bg-secondary/30 border border-secondary/50">
                <div className="flex gap-3">
                  <div className={cn(
                    "p-2 rounded-full",
                    isSecret ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"
                  )}>
                    {isSecret ? <Lock className="h-4 w-4" /> : <Globe className="h-4 w-4" />}
                  </div>
                  <div>
                    <p className="text-xs font-bold text-foreground">Make this board secret</p>
                    <p className="text-[10px] text-muted-foreground">Only you can see this board</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsSecret(!isSecret)}
                  className={cn(
                    "relative w-11 h-6 rounded-full transition-colors duration-200 outline-none",
                    isSecret ? "bg-primary" : "bg-muted"
                  )}
                >
                  <motion.div
                    animate={{ x: isSecret ? 22 : 2 }}
                    className="absolute top-1 left-0 w-4 h-4 bg-white rounded-full shadow-sm"
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  />
                </button>
              </div>
            </div>

            {/* Footer */}
            <div className="px-6 py-5 bg-secondary/20 flex gap-3">
              <Button
                variant="outline"
                onClick={onClose}
                className="flex-1 rounded-2xl h-12 font-bold text-xs uppercase tracking-widest border-secondary/80"
              >
                Cancel
              </Button>
              <Button
                onClick={handleCreate}
                disabled={boardName.length < 3}
                className="flex-1 rounded-2xl h-12 font-bold text-xs uppercase tracking-widest bg-primary text-white hover:bg-primary/90 shadow-lg shadow-primary/20"
              >
                Create
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

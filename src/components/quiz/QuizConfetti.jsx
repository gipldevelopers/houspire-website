import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
const COLORS = [
    '#FFD700', // Gold
    '#FF6B6B', // Coral
    '#4ECDC4', // Teal
    '#45B7D1', // Sky Blue
    '#96CEB4', // Sage
    '#FFEAA7', // Light Yellow
    '#DDA0DD', // Plum
    '#98D8C8', // Mint
];
export function SelectionConfetti({ trigger, originX = 50, originY = 50 }) {
    const [confetti, setConfetti] = useState([]);
    useEffect(() => {
        if (trigger === 0)
            return;
        const pieces = Array.from({ length: 12 }, (_, i) => ({
            id: Date.now() + i,
            x: originX + (Math.random() - 0.5) * 100,
            y: originY,
            rotation: Math.random() * 360,
            scale: 0.5 + Math.random() * 0.5,
            color: COLORS[Math.floor(Math.random() * COLORS.length)],
        }));
        setConfetti(pieces);
        const timer = setTimeout(() => {
            setConfetti([]);
        }, 1000);
        return () => clearTimeout(timer);
    }, [trigger, originX, originY]);
    if (confetti.length === 0)
        return null;
    return (<div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {confetti.map((piece) => (<motion.div key={piece.id} initial={{
                x: piece.x + '%',
                y: piece.y + '%',
                rotate: 0,
                scale: 0,
                opacity: 1,
            }} animate={{
                x: piece.x + (Math.random() - 0.5) * 200 + '%',
                y: piece.y + 200 + '%',
                rotate: piece.rotation,
                scale: piece.scale,
                opacity: 0,
            }} transition={{
                duration: 0.8,
                ease: [0.25, 0.1, 0.25, 1],
            }} style={{
                position: 'absolute',
                width: 10,
                height: 10,
                backgroundColor: piece.color,
                borderRadius: Math.random() > 0.5 ? '50%' : '2px',
            }}/>))}
    </div>);
}
// Simple sparkle effect for selections
export function SelectionSparkle({ show }) {
    if (!show)
        return null;
    return (<motion.div initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1.5, opacity: [0, 1, 0] }} transition={{ duration: 0.4 }} className="absolute inset-0 pointer-events-none">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-yellow-400 rounded-full blur-sm"/>
    </motion.div>);
}
// Celebration animation for completing steps
export function StepCompleteAnimation({ show }) {
    if (!show)
        return null;
    return (<motion.div initial={{ scale: 0, opacity: 0 }} animate={{
            scale: [0, 1.2, 1],
            opacity: [0, 1, 0],
        }} transition={{ duration: 0.6 }} className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-50">
      <div className="text-6xl">✨</div>
    </motion.div>);
}

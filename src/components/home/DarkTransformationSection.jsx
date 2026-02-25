'use client';

import { motion } from 'framer-motion';
import { useState, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import beforeRoom from '@/assets/before-room.jpg';
import afterRoom from '@/assets/after-room.jpg';

const ease = [0.25, 0.46, 0.45, 0.94];

export function DarkTransformationSection() {
  const [position, setPosition] = useState(50);
  const containerRef = useRef(null);
  const isDragging = useRef(false);
  const router = useRouter();

  const updatePosition = useCallback((clientX) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
    setPosition((x / rect.width) * 100);
  }, []);

  const handlePointerDown = () => { isDragging.current = true; };
  const handlePointerUp = () => { isDragging.current = false; };
  const handleMouseMove = (e) => {
    if (isDragging.current) updatePosition(e.clientX);
  };
  const handleTouchMove = (e) => {
    updatePosition(e.touches[0].clientX);
  };

  return (
    <section id="transformation" className="bg-black py-[40px] md:py-[60px]">
      <div className="max-w-[1200px] mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease }}
          viewport={{ once: true, amount: 0.2 }}
          className="text-center mb-14"
        >
          <p className="text-sm font-semibold tracking-[0.04em] uppercase text-[#86868B] mb-3">Transformation</p>
          <h2 className="text-[clamp(36px,5vw,56px)] font-bold tracking-[-0.025em] leading-[1.07] text-white">
            From this. To this.
          </h2>
          <p className="text-[17px] text-white/60 mt-3">Drag to reveal the transformation.</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease }}
          viewport={{ once: true, amount: 0.2 }}
        >
          <div
            ref={containerRef}
            className="relative max-w-[960px] mx-auto aspect-video rounded-[20px] overflow-hidden cursor-ew-resize select-none"
            onMouseDown={handlePointerDown}
            onMouseUp={handlePointerUp}
            onMouseLeave={handlePointerUp}
            onMouseMove={handleMouseMove}
            onTouchStart={handlePointerDown}
            onTouchEnd={handlePointerUp}
            onTouchMove={handleTouchMove}
          >
            {/* After image (full) */}
            <img
              src="/after-room.jpg"
              alt="After transformation"
              className="absolute inset-0 w-full h-full object-cover pointer-events-none"
              draggable={false}
            />
            {/* Before image (clipped) */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none" style={{ width: `${position}%` }}>
              <img
                src="/before-room.jpg"
                alt="Before transformation"
                className="absolute inset-0 h-full object-cover"
                style={{ width: containerRef.current ? `${containerRef.current.offsetWidth}px` : '100vw', maxWidth: 'none' }}
                draggable={false}
              />
            </div>

            {/* Slider line */}
            <div
              className="absolute top-0 bottom-0 w-[2px] bg-white z-10 pointer-events-none"
              style={{ left: `${position}%`, transform: 'translateX(-50%)' }}
            />

            {/* Drag handle */}
            <div
              className="absolute top-1/2 z-20 w-11 h-11 bg-white rounded-full flex items-center justify-center pointer-events-none"
              style={{ left: `${position}%`, transform: 'translateX(-50%) translateY(-50%)', boxShadow: '0 2px 12px rgba(0,0,0,0.3)' }}
            >
              <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
                <path d="M6 10L2 10M2 10L4.5 7.5M2 10L4.5 12.5M14 10L18 10M18 10L15.5 7.5M18 10L15.5 12.5" stroke="#1D1D1F" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>

            {/* Labels - hide when that side is mostly covered by the other */}
            <div
              className={`absolute top-4 left-4 z-10 px-3 py-1.5 bg-black/50 backdrop-blur-[10px] rounded-full text-xs font-medium text-white pointer-events-none transition-opacity duration-200 ${
                position < 20 ? 'opacity-0' : 'opacity-100'
              }`}
            >
              Before
            </div>
            <div
              className={`absolute top-4 right-4 z-10 px-3 py-1.5 bg-black/50 backdrop-blur-[10px] rounded-full text-xs font-medium text-white pointer-events-none transition-opacity duration-200 ${
                position > 80 ? 'opacity-0' : 'opacity-100'
              }`}
            >
              After
            </div>
          </div>

          <div className="text-center mt-10">
            <button
              onClick={() => router.push('/style-quiz')}
              className="px-6 py-3 text-[17px] text-white border-[1.5px] border-white hover:bg-white/10 rounded-full transition-all duration-300"
            >
              Start with One Room →
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

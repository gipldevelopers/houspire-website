'use client';

import { motion } from 'framer-motion';
import { useCallback, useRef, useState } from 'react';
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
  const handleMouseMove = (event) => { if (isDragging.current) updatePosition(event.clientX); };
  const handleTouchMove = (event) => { updatePosition(event.touches[0].clientX); };

  return (
    <section 
      id="transformation" 
      className="py-6 md:py-12 overflow-hidden"
      // Light orange background - you can adjust the shade by changing the color code
      style={{ backgroundColor: '#fff4e6' }} // Very light peach/orange
      // Alternative orange shades:
      // '#fff0e0' - lighter peach
      // '#ffe8d9' - slightly deeper peach
      // '#ffead2' - light apricot
      // '#fff1e0' - soft orange cream
    >
      <div className="container mx-auto px-6">
        
        {/* Top Label - Warm gray for better contrast on light orange */}
        <div className="text-center mb-2 md:mb-12">
          <p className="text-sm font-semibold tracking-[0.18em] uppercase text-[#6B4F3F]">
            Transformation
          </p>
        </div>

        <div className="relative max-w-7xl mx-auto">
          {/* Main Layout Grid: [From this] [Image Slider] [To this] */}
          <div className="flex flex-col lg:flex-row items-center justify-center gap-8 lg:gap-12">
            
            {/* LEFT SIDE: "From this." - Black text */}
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              className="lg:w-1/6 text-left"
            >
              <h2 className="text-[clamp(30px,3vw,48px)] font-bold tracking-[-0.03em] text-black">
                From this.
              </h2>
            </motion.div>

            {/* CENTER: The Image Slider */}
            <div className="relative w-full lg:w-4/6 max-w-4xl">
              {/* Orange-tinted gradient overlay */}
              <div className="absolute -inset-6 rounded-[32px] bg-gradient-to-b from-[#ff8c42]/10 via-transparent to-transparent blur-2xl" />
              
              <div
                ref={containerRef}
                className="relative w-full aspect-video rounded-[24px] overflow-hidden cursor-ew-resize select-none border border-black/10 bg-white shadow-lg shadow-[#ff8c42]/10"
                onMouseDown={handlePointerDown}
                onMouseUp={handlePointerUp}
                onMouseLeave={handlePointerUp}
                onMouseMove={handleMouseMove}
                onTouchStart={handlePointerDown}
                onTouchEnd={handlePointerUp}
                onTouchMove={handleTouchMove}
              >
                <img src={"/after-room.jpg"} alt="After" className="absolute inset-0 w-full h-full object-cover pointer-events-none" />
                <div className="absolute inset-0 overflow-hidden pointer-events-none" style={{ width: `${position}%` }}>
                  <img
                    src={"/before-room.jpg"}
                    alt="Before"
                    className="absolute inset-0 h-full object-cover"
                    style={{ width: containerRef.current ? `${containerRef.current.offsetWidth}px` : '100vw', maxWidth: 'none' }}
                  />
                </div>

                {/* Slider Handle & Line - Updated to orange to match theme */}
                <div className="absolute top-0 bottom-0 w-[2px] bg-[#ff8c42] z-10" style={{ left: `${position}%`, transform: 'translateX(-50%)' }} />
                <div 
                  className="absolute top-1/2 z-20 w-10 h-10 bg-[#ff8c42] rounded-full flex items-center justify-center shadow-xl shadow-[#ff8c42]/30"
                  style={{ left: `${position}%`, transform: 'translateX(-50%) translateY(-50%)' }}
                >
                  <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
                    <path d="M6 10L2 10M2 10L4.5 7.5M2 10L4.5 12.5M14 10L18 10M18 10L15.5 7.5M18 10L15.5 12.5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
              </div>
            </div>

            {/* RIGHT SIDE: "To this." - Black text */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              className="lg:w-1/6 text-right"
            >
              <h2 className="text-[clamp(30px,3vw,48px)] font-bold tracking-[-0.03em] text-black">
                To this.
              </h2>
            </motion.div>

          </div>
        </div>

        {/* Bottom Navigation - Updated with orange accents */}
        <div className="mt-6 text-center">
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              onClick={() => router.push('/style-quiz')} 
              className="px-8 py-4 bg-[#ff8c42] text-white font-medium rounded-full hover:bg-[#ff6b1a] transition-colors shadow-md shadow-[#ff8c42]/30"
            >
              Start with One Room →
            </button>
            <button 
              onClick={() => router.push('/discover')} 
              className="px-8 py-4 border-2 border-[#ff8c42] text-[#ff8c42] font-medium rounded-full hover:bg-[#ff8c42] hover:text-white transition-colors"
            >
              Explore Gallery
            </button>
          </div>
        </div>

      </div>
    </section>
  );
}
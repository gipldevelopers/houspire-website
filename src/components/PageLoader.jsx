'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';

/**
 * Full-screen page loader shown on initial site load.
 * Fades out automatically once the page is ready.
 *
 * Usage:
 *   <PageLoader />   — mounts, waits for window load, then fades out
 */
export function PageLoader() {
  const [visible, setVisible] = useState(true);
  const [fading, setFading] = useState(false);

  useEffect(() => {
    const dismiss = () => {
      setFading(true);
      setTimeout(() => setVisible(false), 500); // match CSS transition
    };

    // If page already loaded (fast nav / cached), dismiss quickly
    if (document.readyState === 'complete') {
      const t = setTimeout(dismiss, 600);
      return () => clearTimeout(t);
    }

    window.addEventListener('load', dismiss, { once: true });

    // Safety fallback — never block the user more than 3s
    const fallback = setTimeout(dismiss, 3000);

    return () => {
      window.removeEventListener('load', dismiss);
      clearTimeout(fallback);
    };
  }, []);

  if (!visible) return null;

  return (
    <div
      aria-hidden="true"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#ffffff',
        transition: 'opacity 0.5s ease',
        opacity: fading ? 0 : 1,
        pointerEvents: fading ? 'none' : 'auto',
      }}
    >
      {/* Logo */}
      <div style={{ marginBottom: '2rem', position: 'relative', width: 140, height: 36 }}>
        <Image
          src="/houspire-logo.png"
          alt="Houspire"
          fill
          style={{ objectFit: 'contain' }}
          priority
        />
      </div>

      {/* Thin animated progress bar */}
      <div
        style={{
          width: 120,
          height: 2,
          borderRadius: 999,
          backgroundColor: '#f0ece8',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            height: '100%',
            borderRadius: 999,
            backgroundColor: '#e48b53',
            animation: 'houspire-loader-bar 1.4s ease-in-out infinite',
          }}
        />
      </div>

      {/* Keyframe injected inline so no extra CSS file is needed */}
      <style>{`
        @keyframes houspire-loader-bar {
          0%   { width: 0%;   margin-left: 0%; }
          50%  { width: 70%;  margin-left: 15%; }
          100% { width: 0%;   margin-left: 100%; }
        }
      `}</style>
    </div>
  );
}

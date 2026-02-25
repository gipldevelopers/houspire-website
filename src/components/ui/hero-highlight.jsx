import { useState, useCallback } from 'react';
export function HeroHighlight({ children, className = '' }) {
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
    const handleMouseMove = useCallback((e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        setMousePos({
            x: e.clientX - rect.left,
            y: e.clientY - rect.top,
        });
    }, []);
    return (<div onMouseMove={handleMouseMove} className={`relative ${className}`} style={{
            '--spotlight-x': `${mousePos.x}px`,
            '--spotlight-y': `${mousePos.y}px`,
        }}>
      <div className="pointer-events-none absolute inset-0 opacity-0 hover:opacity-100 transition-opacity duration-500" style={{
            background: `radial-gradient(600px circle at var(--spotlight-x) var(--spotlight-y), rgba(0,113,227,0.06), transparent 40%)`,
        }}/>
      {children}
    </div>);
}

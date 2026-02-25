export function ShimmerButton({ children, className = '', shimmerColor = 'rgba(255,255,255,0.3)', ...props }) {
    return (<button className={`relative overflow-hidden ${className}`} {...props}>
      {children}
      <span className="absolute inset-0 pointer-events-none" style={{
            background: `linear-gradient(105deg, transparent 40%, ${shimmerColor} 50%, transparent 60%)`,
            backgroundSize: '200% 100%',
            animation: 'shimmer-sweep 3s ease-in-out infinite',
        }}/>
      <style>{`
        @keyframes shimmer-sweep {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
      `}</style>
    </button>);
}

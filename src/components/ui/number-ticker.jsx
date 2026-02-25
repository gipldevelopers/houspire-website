import { useEffect, useRef, useState } from 'react';
import { useInView } from 'framer-motion';
export function NumberTicker({ value, prefix = '', suffix = '', className = '', duration = 1.2, formatOptions = {}, }) {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, amount: 0.5 });
    const [display, setDisplay] = useState(0);
    useEffect(() => {
        if (!isInView)
            return;
        const start = performance.now();
        const durationMs = duration * 1000;
        function tick(now) {
            const elapsed = now - start;
            const progress = Math.min(elapsed / durationMs, 1);
            // Ease-out cubic
            const eased = 1 - Math.pow(1 - progress, 3);
            setDisplay(Math.round(eased * value));
            if (progress < 1)
                requestAnimationFrame(tick);
        }
        requestAnimationFrame(tick);
    }, [isInView, value, duration]);
    const formatted = display.toLocaleString('en-IN', formatOptions);
    return (<span ref={ref} className={className}>
      {prefix}{formatted}{suffix}
    </span>);
}

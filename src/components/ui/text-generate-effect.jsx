import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
export function TextGenerateEffect({ words, className = '', delay = 0 }) {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, amount: 0.5 });
    const wordArray = words.split(' ');
    return (<span ref={ref} className={className}>
      {wordArray.map((word, i) => (<motion.span key={`${word}-${i}`} initial={{ opacity: 0, filter: 'blur(4px)' }} animate={isInView ? { opacity: 1, filter: 'blur(0px)' } : {}} transition={{
                duration: 0.4,
                delay: delay + i * 0.08,
                ease: [0.25, 0.46, 0.45, 0.94],
            }} className="inline-block">
          {word}
          {i < wordArray.length - 1 && '\u00A0'}
        </motion.span>))}
    </span>);
}

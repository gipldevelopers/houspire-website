import { useEffect, useState } from 'react';
export function SkipToContent() {
    const [isVisible, setIsVisible] = useState(false);
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'Tab') {
                setIsVisible(true);
            }
        };
        const handleFocusOut = () => {
            setIsVisible(false);
        };
        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('blur', handleFocusOut, true);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('blur', handleFocusOut, true);
        };
    }, []);
    const skipLinks = [
        { id: 'main-content', label: 'Skip to main content' },
        { id: 'navigation', label: 'Skip to navigation' },
        { id: 'footer', label: 'Skip to footer' },
    ];
    return (<div className={`fixed top-0 left-0 z-[9999] transition-transform duration-200 ${isVisible ? 'translate-y-0' : '-translate-y-full'}`} role="navigation" aria-label="Skip links">
      {skipLinks.map((link) => (<a key={link.id} href={`#${link.id}`} className="block bg-primary text-primary-foreground px-6 py-3 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2" onBlur={() => setIsVisible(false)}>
          {link.label}
        </a>))}
    </div>);
}

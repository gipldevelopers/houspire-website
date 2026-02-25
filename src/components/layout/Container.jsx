'use client';

import { forwardRef } from 'react';

export const Container = forwardRef(function Container({ children, className = '' }, ref) {
  return (
    <div ref={ref} className={`container mx-auto px-4 ${className}`}>
      {children}
    </div>
  );
});

Container.displayName = 'Container';

import { forwardRef } from 'react'

export const MasonryGrid = forwardRef(
  ({ children, className = '' }, ref) => {
    return (
      <div 
        ref={ref}
        className={`columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-4 ${className}`}
      >
        {children}
      </div>
    )
  }
)

MasonryGrid.displayName = 'MasonryGrid'

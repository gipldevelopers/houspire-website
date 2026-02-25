'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { forwardRef } from 'react';
import { cn } from '@/lib/utils';

export const NavLink = forwardRef(function NavLink(
  { className, activeClassName, pendingClassName, href, ...props },
  ref
) {
  const pathname = usePathname();
  const isActive = pathname === href || pathname?.startsWith(href + '/');

  return (
    <Link
      ref={ref}
      href={href}
      className={cn(className, isActive && activeClassName)}
      {...props}
    />
  );
});

NavLink.displayName = 'NavLink';

'use client';

import React from 'react';
import Image from 'next/image';

interface LogoProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  priority?: boolean;
}

const SIZE_MAP = {
  xs: { width: 24, height: 24, className: 'h-6 w-6' },
  sm: { width: 32, height: 32, className: 'h-8 w-8' },
  md: { width: 38, height: 38, className: 'h-9.5 w-9.5' },
  lg: { width: 44, height: 44, className: 'h-11 w-11' },
  xl: { width: 56, height: 56, className: 'h-14 w-14' },
};

/**
 * Official Doc.DOOM Logo Component
 * Uses the uploaded brand asset strictly without recreation, redraws, text, or distortion.
 */
export function Logo({ size = 'md', className = '', priority = false }: LogoProps) {
  const config = SIZE_MAP[size] || SIZE_MAP.md;

  return (
    <div
      className={`relative inline-flex items-center justify-center flex-shrink-0 overflow-hidden rounded-xl border border-[#262626] bg-[#0d0d0d] shadow-sm transition hover:border-[#00E5FF]/40 ${config.className} ${className}`}
    >
      <Image
        src="/logo.png"
        alt="Doc.DOOM Logo"
        width={config.width}
        height={config.height}
        priority={priority}
        className="h-full w-full object-contain p-0.5"
      />
    </div>
  );
}

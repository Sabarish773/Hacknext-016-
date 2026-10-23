'use client';

import React from 'react';
import { useHighlights } from '@/context/HighlightContext';
import { PriorityLevel } from '@/types';

interface PriorityBadgeProps {
  priorityOrCategory: PriorityLevel | string;
  label?: string;
  className?: string;
}

export function PriorityBadge({ priorityOrCategory, label, className = '' }: PriorityBadgeProps) {
  const { getBadgeStyle } = useHighlights();
  const style = getBadgeStyle(priorityOrCategory);

  return (
    <span
      style={style}
      className={`inline-flex items-center rounded-lg border px-2.5 py-1 text-[11px] font-semibold tracking-wide transition ${className}`}
    >
      <span
        className="mr-1.5 h-1.5 w-1.5 rounded-full"
        style={{ backgroundColor: style.color }}
      />
      {label || priorityOrCategory}
    </span>
  );
}

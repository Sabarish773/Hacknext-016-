'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { HighlightColorSettings, PriorityLevel } from '@/types';
import { useAuth } from './AuthContext';

interface HighlightContextType {
  highlights: HighlightColorSettings;
  updateColor: (category: keyof HighlightColorSettings, color: string) => Promise<void>;
  resetToDefaults: () => Promise<void>;
  getColorForCategory: (category: string) => string;
  getColorForPriority: (priority: PriorityLevel) => string;
  getBadgeStyle: (categoryOrPriority: string) => { backgroundColor: string; color: string; borderColor: string };
}

const DEFAULT_COLORS: HighlightColorSettings = {
  critical: '#b91c1c',     // Red
  important: '#c2410c',    // Orange
  warning: '#b45309',      // Amber
  missing: '#7e22ce',      // Purple
  conflict: '#be185d',     // Rose / Pink
  deadline: '#014baa',     // Royal Blue
  informational: '#047857',// Emerald Green
};

const LOCAL_STORAGE_HIGHLIGHTS_KEY = 'docdoom_highlight_settings';

const HighlightContext = createContext<HighlightContextType | undefined>(undefined);

export function HighlightProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [highlights, setHighlights] = useState<HighlightColorSettings>(DEFAULT_COLORS);

  useEffect(() => {
    // 1. Load from localStorage first
    const saved = localStorage.getItem(LOCAL_STORAGE_HIGHLIGHTS_KEY);
    if (saved) {
      try {
        setHighlights(JSON.parse(saved));
      } catch {}
    }

    // 2. Fetch from user settings API if logged in
    if (user?.id) {
      fetch(`/api/settings/highlights?userId=${user.id}`)
        .then((res) => res.json())
        .then((data) => {
          if (data && data.highlights) {
            setHighlights(data.highlights);
            localStorage.setItem(LOCAL_STORAGE_HIGHLIGHTS_KEY, JSON.stringify(data.highlights));
          }
        })
        .catch(() => {});
    }
  }, [user?.id]);

  const updateColor = async (category: keyof HighlightColorSettings, color: string) => {
    const next = { ...highlights, [category]: color };
    setHighlights(next);
    localStorage.setItem(LOCAL_STORAGE_HIGHLIGHTS_KEY, JSON.stringify(next));

    if (user?.id) {
      try {
        await fetch('/api/settings/highlights', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId: user.id, category, color }),
        });
      } catch (err) {
        console.error('Failed to sync highlights with server:', err);
      }
    }
  };

  const resetToDefaults = async () => {
    setHighlights(DEFAULT_COLORS);
    localStorage.setItem(LOCAL_STORAGE_HIGHLIGHTS_KEY, JSON.stringify(DEFAULT_COLORS));
    if (user?.id) {
      try {
        await fetch('/api/settings/highlights/reset', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId: user.id }),
        });
      } catch {}
    }
  };

  const getColorForCategory = (category: string): string => {
    const cat = category.toLowerCase();
    if (cat.includes('critical')) return highlights.critical;
    if (cat.includes('important')) return highlights.important;
    if (cat.includes('warning')) return highlights.warning;
    if (cat.includes('missing')) return highlights.missing;
    if (cat.includes('conflict')) return highlights.conflict;
    if (cat.includes('deadline') || cat.includes('date')) return highlights.deadline;
    return highlights.informational;
  };

  const getColorForPriority = (priority: PriorityLevel): string => {
    switch (priority) {
      case 'CRITICAL':
        return highlights.critical;
      case 'IMPORTANT':
        return highlights.important;
      case 'NEEDS_REVIEW':
        return highlights.warning;
      case 'INFORMATIONAL':
      default:
        return highlights.informational;
    }
  };

  const getBadgeStyle = (categoryOrPriority: string) => {
    const color = getColorForCategory(categoryOrPriority);
    return {
      backgroundColor: `${color}18`, // 10% opacity background
      color: color,
      borderColor: `${color}40`,
    };
  };

  return (
    <HighlightContext.Provider
      value={{
        highlights,
        updateColor,
        resetToDefaults,
        getColorForCategory,
        getColorForPriority,
        getBadgeStyle,
      }}
    >
      {children}
    </HighlightContext.Provider>
  );
}

export function useHighlights() {
  const context = useContext(HighlightContext);
  if (!context) {
    throw new Error('useHighlights must be used within a HighlightProvider');
  }
  return context;
}

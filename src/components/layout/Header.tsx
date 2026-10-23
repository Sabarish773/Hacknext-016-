'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search, Upload, Mail, Sparkles, ShieldCheck } from 'lucide-react';
import { ContactModal } from './ContactModal';

interface HeaderProps {
  onOpenUpload?: () => void;
}

export function Header({ onOpenUpload }: HeaderProps) {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [isContactOpen, setIsContactOpen] = useState(false);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/documents?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-slate-800/80 bg-slate-950/80 px-6 backdrop-blur-md">
      {/* Global Search Bar */}
      <form onSubmit={handleSearchSubmit} className="relative w-72 md:w-96">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search documents, entities, deadlines, insights..."
          className="w-full rounded-xl border border-slate-800 bg-slate-900/90 py-2 pl-10 pr-4 text-sm text-slate-100 placeholder-slate-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition"
        />
      </form>

      {/* Right Controls */}
      <div className="flex items-center space-x-3">
        {/* System Status Pill */}
        <div className="hidden md:flex items-center space-x-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-xs text-emerald-400 font-medium">
          <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>Gemini & OpenAI Ready</span>
        </div>

        {/* Contact Team Action */}
        <button
          onClick={() => setIsContactOpen(true)}
          className="flex items-center space-x-1.5 rounded-xl border border-slate-800 bg-slate-900 px-3 py-2 text-xs font-medium text-slate-300 hover:bg-slate-800 hover:text-white transition"
          title="Contact Development Team"
        >
          <Mail className="h-3.5 w-3.5 text-blue-400" />
          <span className="hidden sm:inline">Contact</span>
        </button>

        {/* Primary Upload CTA */}
        {onOpenUpload && (
          <button
            onClick={onOpenUpload}
            className="flex items-center space-x-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-2 text-xs md:text-sm font-semibold text-white shadow-lg shadow-blue-600/20 hover:from-blue-500 hover:to-indigo-500 transition"
          >
            <Upload className="h-4 w-4" />
            <span>Upload Documents</span>
          </button>
        )}
      </div>

      <ContactModal isOpen={isContactOpen} onClose={() => setIsContactOpen(false)} />
    </header>
  );
}

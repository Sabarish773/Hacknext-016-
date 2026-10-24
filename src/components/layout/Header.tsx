'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search, Upload, Mail } from 'lucide-react';
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
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-[#262626] bg-[#111111]/85 px-6 backdrop-blur-md">
      {/* Global Search Bar */}
      <form onSubmit={handleSearchSubmit} className="relative w-72 md:w-96">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#737373]" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search documents, entities, deadlines, insights..."
          className="w-full rounded-xl border border-[#262626] bg-[#161616] py-2 pl-10 pr-4 text-sm text-[#ededed] placeholder-[#737373] focus:border-[#00E5FF] focus:outline-none focus:ring-1 focus:ring-[#00E5FF] transition"
        />
      </form>

      {/* Right Controls */}
      <div className="flex items-center space-x-3">
        {/* System Status Pill */}
        <div className="hidden md:flex items-center space-x-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs text-emerald-400 font-medium">
          <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>Gemini & OpenAI Ready</span>
        </div>

        {/* Contact Team Action */}
        <button
          onClick={() => setIsContactOpen(true)}
          className="flex items-center space-x-1.5 rounded-xl border border-[#262626] bg-[#161616] px-3 py-2 text-xs font-medium text-[#a3a3a3] hover:bg-[#222222] hover:text-[#00E5FF] hover:border-[#00E5FF]/40 transition"
          title="Contact Development Team"
        >
          <Mail className="h-3.5 w-3.5 text-[#00E5FF]" />
          <span className="hidden sm:inline">Contact</span>
        </button>

        {/* Primary Upload CTA */}
        {onOpenUpload && (
          <button
            onClick={onOpenUpload}
            className="flex items-center space-x-2 rounded-xl bg-[#00E5FF] hover:bg-[#33EBFF] active:bg-[#00B4CC] px-4 py-2 text-xs md:text-sm font-bold text-[#111111] shadow-lg shadow-[#00E5FF]/20 transition"
          >
            <Upload className="h-4 w-4 text-[#111111]" />
            <span>Upload Documents</span>
          </button>
        )}
      </div>

      <ContactModal isOpen={isContactOpen} onClose={() => setIsContactOpen(false)} />
    </header>
  );
}

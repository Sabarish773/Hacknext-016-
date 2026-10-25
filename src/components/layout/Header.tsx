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
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-[#E6DFD8] bg-[#F8F3F0]/90 px-6 backdrop-blur-md">
      {/* Global Search Bar */}
      <form onSubmit={handleSearchSubmit} className="relative w-72 md:w-96">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#64748B]" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search documents, entities, deadlines, insights..."
          className="w-full rounded-xl border border-[#DCE5EE] bg-white py-2 pl-10 pr-4 text-sm text-[#0B192C] placeholder-[#94A3B8] focus:border-[#014BAA] focus:outline-none focus:ring-1 focus:ring-[#014BAA] shadow-sm transition"
        />
      </form>

      {/* Right Controls */}
      <div className="flex items-center space-x-3">
        {/* System Status Pill */}
        <div className="hidden md:flex items-center space-x-2 rounded-full border border-emerald-300 bg-emerald-50 px-3 py-1 text-xs text-emerald-800 font-semibold">
          <span className="h-2 w-2 rounded-full bg-emerald-600 animate-pulse" />
          <span>Gemini &amp; OpenAI Ready</span>
        </div>

        {/* Contact Team Action */}
        <button
          onClick={() => setIsContactOpen(true)}
          className="flex items-center space-x-1.5 rounded-xl border border-[#DCE5EE] bg-white px-3 py-2 text-xs font-semibold text-[#3B4D63] hover:bg-[#F2F7FD] hover:text-[#014BAA] hover:border-[#014BAA]/40 shadow-sm transition"
          title="Contact Development Team"
        >
          <Mail className="h-3.5 w-3.5 text-[#014BAA]" />
          <span className="hidden sm:inline">Contact</span>
        </button>

        {/* Primary Upload CTA */}
        {onOpenUpload && (
          <button
            onClick={onOpenUpload}
            className="flex items-center space-x-2 rounded-xl bg-[#014BAA] hover:bg-[#013C88] active:bg-[#012E69] px-4 py-2 text-xs md:text-sm font-semibold text-white shadow-md shadow-[#014BAA]/20 transition"
          >
            <Upload className="h-4 w-4 text-white" />
            <span>Upload Documents</span>
          </button>
        )}
      </div>

      <ContactModal isOpen={isContactOpen} onClose={() => setIsContactOpen(false)} />
    </header>
  );
}

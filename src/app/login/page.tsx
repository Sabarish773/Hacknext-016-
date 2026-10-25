'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ShieldCheck, Mail, Sparkles, CheckCircle2 } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { ContactModal } from '@/components/layout/ContactModal';
import { Logo } from '@/components/common/Logo';

export default function LoginPage() {
  const { loginWithGoogle, loginAsDemo, isLoading } = useAuth();
  const [isContactOpen, setIsContactOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#F8F3F0] text-[#0B192C] flex flex-col justify-between p-6 selection:bg-[#014BAA]/15 selection:text-[#014BAA]">
      {/* Top Header */}
      <div className="max-w-6xl mx-auto w-full flex items-center justify-between">
        <Link href="/" className="flex items-center space-x-2.5 group">
          <Logo size="sm" priority />
          <span className="text-lg font-bold text-[#0B192C] group-hover:text-[#014BAA] transition font-heading">
            Doc.DOOM
          </span>
        </Link>

        <button
          onClick={() => setIsContactOpen(true)}
          className="text-xs font-semibold text-[#3B4D63] hover:text-[#014BAA] flex items-center space-x-1.5 transition"
        >
          <Mail className="h-3.5 w-3.5 text-[#014BAA]" />
          <span>Support: sanjay9187ram@gmail.com</span>
        </button>
      </div>

      {/* Main Login Card */}
      <div className="max-w-md mx-auto w-full rounded-3xl border border-[#DCE5EE] bg-white p-8 sm:p-10 royal-shadow-lg text-center relative overflow-hidden">
        <div className="absolute top-0 inset-x-0 h-1.5 bg-[#014BAA]" />

        <div className="mx-auto h-14 w-14 rounded-2xl bg-[#EBF3FC] border border-[#BFD7F5] text-[#014BAA] flex items-center justify-center mb-6 shadow-sm">
          <ShieldCheck className="h-7 w-7 text-[#014BAA]" />
        </div>

        <h1 className="text-2xl font-bold text-[#0B192C] tracking-tight font-heading">Enterprise Access</h1>
        <p className="mt-2 text-xs text-[#64748B] leading-relaxed">
          Sign in to access your secure document repository, cross-document intelligence, and cognitive analysis.
        </p>

        {/* Primary Direct Google Sign-In Button */}
        <div className="mt-8 space-y-3.5">
          <button
            onClick={loginWithGoogle}
            disabled={isLoading}
            className="w-full flex items-center justify-center space-x-3 rounded-2xl bg-white hover:bg-[#F8F3F0] border border-[#DCE5EE] px-5 py-3.5 text-sm font-bold text-[#0B192C] shadow-sm transition disabled:opacity-50"
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.66v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.15z"
              />
              <path
                fill="#34A853"
                d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"
              />
              <path
                fill="#FBBC05"
                d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
              />
              <path
                fill="#EA4335"
                d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
              />
            </svg>
            <span>Continue with Google</span>
          </button>

          {/* Quick Jury / Demo Evaluation Button */}
          <button
            onClick={() => loginAsDemo('HackNext Judge')}
            className="w-full flex items-center justify-center space-x-2 rounded-2xl bg-[#014BAA] hover:bg-[#013C88] active:bg-[#012E69] px-5 py-3 text-xs font-bold text-white shadow-md shadow-[#014BAA]/20 transition"
          >
            <Sparkles className="h-4 w-4 text-white" />
            <span>Instant Demo Access (HackNext Jury Review)</span>
          </button>
        </div>

        {/* Security badges */}
        <div className="mt-8 pt-6 border-t border-[#E6DFD8] flex items-center justify-center space-x-4 text-[11px] text-[#64748B]">
          <span className="flex items-center space-x-1 font-medium">
            <CheckCircle2 className="h-3.5 w-3.5 text-[#014BAA]" />
            <span>User Isolation (RLS)</span>
          </span>
          <span className="flex items-center space-x-1 font-medium">
            <CheckCircle2 className="h-3.5 w-3.5 text-[#014BAA]" />
            <span>Private Storage</span>
          </span>
        </div>
      </div>

      {/* Footer */}
      <div className="max-w-6xl mx-auto w-full text-center text-xs text-[#64748B]">
        Doc.DOOM Enterprise • HackNext’26 • Direct Google Sign-In Flow
      </div>

      <ContactModal isOpen={isContactOpen} onClose={() => setIsContactOpen(false)} />
    </div>
  );
}

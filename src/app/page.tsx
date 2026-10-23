'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  FileSearch,
  BrainCircuit,
  Layers,
  ArrowRight,
  ShieldCheck,
  CheckCircle,
  AlertTriangle,
  GitCompare,
  BarChart3,
  Bot,
  Zap,
  Mail,
  ChevronRight,
  ExternalLink,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { ContactModal } from '@/components/layout/ContactModal';

export default function LandingPage() {
  const { loginWithGoogle, user } = useAuth();
  const [isContactOpen, setIsContactOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-blue-500 selection:text-white">
      {/* Top Navigation */}
      <header className="border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-md sticky top-0 z-40 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-violet-600 flex items-center justify-center shadow-lg shadow-blue-500/20 text-white font-black text-lg border border-blue-400/30">
              DD
            </div>
            <div>
              <span className="text-xl font-extrabold tracking-tight text-white">Doc.DOOM</span>
              <span className="ml-2 rounded-full bg-blue-500/10 px-2 py-0.5 text-[10px] font-semibold text-blue-400 border border-blue-500/20">
                HackNext’26 • PS01
              </span>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <button
              onClick={() => setIsContactOpen(true)}
              className="text-sm font-medium text-slate-300 hover:text-white transition flex items-center space-x-1.5"
            >
              <Mail className="h-4 w-4 text-blue-400" />
              <span>Contact Us</span>
            </button>

            {user ? (
              <Link
                href="/dashboard"
                className="flex items-center space-x-2 rounded-xl bg-blue-600 hover:bg-blue-500 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-blue-600/25 transition"
              >
                <span>Enter Dashboard</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            ) : (
              <button
                onClick={loginWithGoogle}
                className="flex items-center space-x-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 px-5 py-2 text-sm font-semibold text-white shadow-lg shadow-blue-600/25 transition"
              >
                <span>Sign In with Google</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-blue-900/20 via-slate-950 to-slate-950 pointer-events-none" />
        <div className="max-w-5xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center space-x-2 rounded-full border border-blue-500/30 bg-blue-500/10 px-4 py-1.5 text-xs font-semibold text-blue-300 mb-6">
            <BrainCircuit className="h-4 w-4 text-blue-400" />
            <span>Problem Statement PS01: Intelligent Information Understanding & Processing</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-white leading-tight">
            Not Just a Summarizer. <br />
            <span className="bg-gradient-to-r from-blue-400 via-indigo-300 to-cyan-400 bg-clip-text text-transparent">
              An Enterprise Information Intelligence System.
            </span>
          </h1>

          <p className="mt-6 text-lg sm:text-xl text-slate-300 max-w-3xl mx-auto font-normal leading-relaxed">
            Organizations drown in fragmented PDFs, spreadsheets, and contracts. <strong>Doc.DOOM</strong> unifies your information journey from
            <span className="text-blue-400 font-semibold"> Find → Understand → Organize → Use</span> with deep cognitive parsing, missing information discovery, cross-document conflict detection, and automated data visualization.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={loginWithGoogle}
              className="w-full sm:w-auto flex items-center justify-center space-x-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 px-7 py-3.5 text-base font-bold text-white shadow-xl shadow-blue-500/25 transition"
            >
              <span>Get Started via Google OAuth</span>
              <ArrowRight className="h-5 w-5" />
            </button>
            <Link
              href="/dashboard"
              className="w-full sm:w-auto flex items-center justify-center space-x-2 rounded-xl border border-slate-700 bg-slate-900/80 hover:bg-slate-800 px-6 py-3.5 text-base font-semibold text-slate-200 transition"
            >
              <span>Explore Live Dashboard</span>
              <ExternalLink className="h-4 w-4 text-slate-400" />
            </Link>
          </div>

          {/* Differentiator Banner */}
          <div className="mt-14 p-6 rounded-2xl border border-blue-500/20 bg-slate-900/60 backdrop-blur-sm text-left max-w-4xl mx-auto shadow-2xl">
            <div className="flex items-start space-x-3">
              <Zap className="h-6 w-6 text-amber-400 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="text-base font-bold text-white">The Doc.DOOM Core Differentiator</h3>
                <blockquote className="mt-1.5 text-sm text-slate-300 italic border-l-2 border-blue-500 pl-3">
                  “We are not building only an AI document summarizer. We are building an AI-powered information intelligence system that understands documents, discovers useful information, identifies missing/conflicting information, creates document-specific insights and visualizations, and helps users act on the information.”
                </blockquote>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* The 4-Step Information Journey */}
      <section className="py-16 px-6 bg-slate-900/40 border-y border-slate-800/60">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-xs font-bold uppercase tracking-widest text-blue-400">The Information Journey</h2>
            <p className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
              From Raw Documents to Verified Decisions
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="rounded-2xl border border-slate-800 bg-slate-950 p-6">
              <div className="h-10 w-10 rounded-xl bg-blue-600/10 text-blue-400 border border-blue-500/20 flex items-center justify-center font-bold text-sm mb-4">
                01
              </div>
              <h3 className="text-lg font-bold text-white">Find</h3>
              <p className="mt-2 text-xs text-slate-400 leading-relaxed">
                Ingest multiple documents simultaneously across PDF, DOCX, CSV, Excel, TXT, and scanned image formats with permanent storage.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-950 p-6">
              <div className="h-10 w-10 rounded-xl bg-emerald-600/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center font-bold text-sm mb-4">
                02
              </div>
              <h3 className="text-lg font-bold text-white">Understand</h3>
              <p className="mt-2 text-xs text-slate-400 leading-relaxed">
                Cognitive understanding discovers facts, deadlines, financial amounts, key entities, and critical requirements with source page traceability.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-950 p-6">
              <div className="h-10 w-10 rounded-xl bg-purple-600/10 text-purple-400 border border-purple-500/20 flex items-center justify-center font-bold text-sm mb-4">
                03
              </div>
              <h3 className="text-lg font-bold text-white">Organize</h3>
              <p className="mt-2 text-xs text-slate-400 leading-relaxed">
                Identifies missing information, detects cross-document contradictions with "Needs Human Review" flags, and structures comparison matrices.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-950 p-6">
              <div className="h-10 w-10 rounded-xl bg-amber-600/10 text-amber-400 border border-amber-500/20 flex items-center justify-center font-bold text-sm mb-4">
                04
              </div>
              <h3 className="text-lg font-bold text-white">Use</h3>
              <p className="mt-2 text-xs text-slate-400 leading-relaxed">
                Renders document-specific charts (Bar, Line, Area, KPI) only when justified, and delivers grounded AI chat with verified source citations.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Grid */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-xs font-bold uppercase tracking-widest text-blue-400">Core Capabilities</h2>
            <p className="text-3xl font-extrabold text-white mt-1">Built for Enterprise Rigor</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6">
              <AlertTriangle className="h-8 w-8 text-purple-400 mb-4" />
              <h3 className="text-base font-bold text-white">Missing Information Detection</h3>
              <p className="mt-2 text-xs text-slate-400 leading-relaxed">
                Categorizes missing items into Explicitly Missing, Not Found, Possibly Missing, and Not Applicable with rigorous context evidence.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6">
              <GitCompare className="h-8 w-8 text-amber-400 mb-4" />
              <h3 className="text-base font-bold text-white">Conflict Detection Engine</h3>
              <p className="mt-2 text-xs text-slate-400 leading-relaxed">
                Compares multiple documents to catch contradictory deadlines, amounts, or terms. Flags status as "Needs Human Review" with side-by-side citations.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6">
              <BarChart3 className="h-8 w-8 text-blue-400 mb-4" />
              <h3 className="text-base font-bold text-white">Document-Specific Charts</h3>
              <p className="mt-2 text-xs text-slate-400 leading-relaxed">
                Generates visualizations only when quantitative data exists. Clear empty state on policy/legal documents prevents misleading or fabricated charts.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6">
              <ShieldCheck className="h-8 w-8 text-emerald-400 mb-4" />
              <h3 className="text-base font-bold text-white">Source Traceability</h3>
              <p className="mt-2 text-xs text-slate-400 leading-relaxed">
                Every extracted fact, deadline, and entity provides its exact source document and section reference for instant audit verification.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6">
              <Bot className="h-8 w-8 text-cyan-400 mb-4" />
              <h3 className="text-base font-bold text-white">Grounded AI Assistant</h3>
              <p className="mt-2 text-xs text-slate-400 leading-relaxed">
                Ask questions across a single document or your entire repository. Zero hallucination tolerance with linked evidence quotes.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6">
              <Layers className="h-8 w-8 text-pink-400 mb-4" />
              <h3 className="text-base font-bold text-white">Configurable Highlights</h3>
              <p className="mt-2 text-xs text-slate-400 leading-relaxed">
                Users can customize and persist highlight colors for Critical, Important, Warning, Missing, Conflict, and Deadline categories.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Us Footer Section */}
      <footer className="mt-auto border-t border-slate-800 bg-slate-950 py-12 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center space-x-3">
            <div className="h-9 w-9 rounded-xl bg-blue-600 flex items-center justify-center font-bold text-white text-sm">
              DD
            </div>
            <div>
              <p className="text-base font-extrabold text-white">Doc.DOOM</p>
              <p className="text-xs text-slate-400">Intelligent Information Understanding & Processing • HackNext’26</p>
            </div>
          </div>

          <div className="flex items-center space-x-6 text-xs text-slate-400">
            <button
              onClick={() => setIsContactOpen(true)}
              className="text-slate-300 hover:text-white flex items-center space-x-1.5 transition"
            >
              <Mail className="h-4 w-4 text-blue-400" />
              <span>Contact: sanjay9187ram@gmail.com</span>
            </button>
            <a
              href="mailto:sanjay9187ram@gmail.com?subject=Doc.DOOM%20HackNext'26"
              className="text-blue-400 hover:underline flex items-center space-x-1"
            >
              <span>Send Mail</span>
              <ExternalLink className="h-3 w-3" />
            </a>
          </div>
        </div>
      </footer>

      <ContactModal isOpen={isContactOpen} onClose={() => setIsContactOpen(false)} />
    </div>
  );
}

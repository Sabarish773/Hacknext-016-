'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  BrainCircuit,
  ArrowRight,
  ShieldCheck,
  AlertTriangle,
  GitCompare,
  BarChart3,
  Bot,
  Zap,
  Mail,
  ExternalLink,
  Layers,
  Sparkles,
  FileSearch,
  CheckCircle2,
  FileCheck,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { ContactModal } from '@/components/layout/ContactModal';
import { Logo } from '@/components/common/Logo';

export default function LandingPage() {
  const { loginWithGoogle, user } = useAuth();
  const [isContactOpen, setIsContactOpen] = useState(false);

  const marqueeKeywords = [
    'Cross-Document Conflict Detection',
    'Missing Information Discovery',
    'Verified Source Page Traceability',
    'Document-Specific Quantitative Charts',
    'Cognitive Entity & Fact Extraction',
    'Multi-Format Ingestion (PDF, CSV, Excel, Scans)',
    'Zero Hallucination AI Assistant',
    'Needs Human Review Audit Flags',
  ];

  return (
    <div className="min-h-screen bg-[#F8F3F0] text-[#0B192C] flex flex-col selection:bg-[#014BAA]/15 selection:text-[#014BAA]">
      {/* Top Header / Navigation */}
      <header className="border-b border-[#E6DFD8] bg-[#F8F3F0]/90 backdrop-blur-md sticky top-0 z-40 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3.5 group">
            <Logo size="md" priority />
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xl font-bold tracking-tight text-[#0B192C] group-hover:text-[#014BAA] transition font-heading">
                  Doc.DOOM
                </span>
                <span className="rounded-full bg-[#EBF3FC] px-2.5 py-0.5 text-[11px] font-semibold text-[#014BAA] border border-[#BFD7F5]">
                  HackNext’26 • PS01
                </span>
              </div>
              <p className="text-[11px] font-medium text-[#64748B]">Enterprise Information Intelligence</p>
            </div>
          </div>

          <div className="flex items-center space-x-3 md:space-x-5">
            <button
              onClick={() => setIsContactOpen(true)}
              className="text-xs md:text-sm font-semibold text-[#3B4D63] hover:text-[#014BAA] transition flex items-center space-x-1.5"
            >
              <Mail className="h-4 w-4 text-[#014BAA]" />
              <span className="hidden sm:inline">Contact Us</span>
            </button>

            {user ? (
              <Link
                href="/dashboard"
                className="flex items-center space-x-2 rounded-xl bg-[#014BAA] hover:bg-[#013C88] active:bg-[#012E69] px-4 md:px-5 py-2 md:py-2.5 text-xs md:text-sm font-semibold text-white shadow-md shadow-[#014BAA]/20 transition"
              >
                <span>Enter Dashboard</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            ) : (
              <button
                onClick={loginWithGoogle}
                className="flex items-center space-x-2 rounded-xl bg-[#014BAA] hover:bg-[#013C88] active:bg-[#012E69] px-4 md:px-5 py-2 md:py-2.5 text-xs md:text-sm font-semibold text-white shadow-md shadow-[#014BAA]/20 transition"
              >
                <span>Sign In with Google</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-14 pb-16 px-6 relative overflow-hidden">
        <div className="max-w-5xl mx-auto text-center relative z-10">
          {/* Tagline Pill */}
          <div className="inline-flex items-center space-x-2 rounded-full border border-[#BFD7F5] bg-[#EBF3FC] px-4 py-1.5 text-xs font-semibold text-[#014BAA] mb-5 royal-shadow-sm">
            <BrainCircuit className="h-4 w-4 text-[#014BAA]" />
            <span>Problem Statement PS01: Intelligent Information Understanding & Processing</span>
          </div>

          {/* Single Cursive Tagline Accent */}
          <p className="font-cursive text-3xl sm:text-4xl text-[#014BAA] mb-2 tracking-wide">
            Where document chaos transforms into clarity
          </p>

          {/* Regal Heading */}
          <h1 className="text-4xl sm:text-6xl font-bold tracking-tight text-[#0B192C] leading-[1.15] font-heading">
            Not Just a Summarizer. <br />
            <span className="text-[#014BAA]">
              An Enterprise Information Intelligence System.
            </span>
          </h1>

          {/* Description */}
          <p className="mt-6 text-base sm:text-lg text-[#3B4D63] max-w-3xl mx-auto font-normal leading-relaxed">
            Organizations drown in fragmented PDFs, spreadsheets, and contracts. <strong className="text-[#0B192C] font-semibold">Doc.DOOM</strong> unifies your information journey from
            <span className="text-[#014BAA] font-semibold"> Find → Understand → Organize → Use</span> with deep cognitive parsing, missing information discovery, cross-document conflict detection, and automated analytics.
          </p>

          {/* Hero CTAs */}
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={loginWithGoogle}
              className="w-full sm:w-auto flex items-center justify-center space-x-2.5 rounded-xl bg-[#014BAA] hover:bg-[#013C88] active:bg-[#012E69] px-7 py-3.5 text-sm sm:text-base font-semibold text-white shadow-lg shadow-[#014BAA]/25 transition"
            >
              <span>Get Started via Google OAuth</span>
              <ArrowRight className="h-4.5 w-4.5" />
            </button>
            <Link
              href="/dashboard"
              className="w-full sm:w-auto flex items-center justify-center space-x-2 rounded-xl border border-[#DCE5EE] bg-white hover:bg-[#F2F7FD] hover:border-[#014BAA]/40 px-6 py-3.5 text-sm sm:text-base font-semibold text-[#0B192C] shadow-sm transition"
            >
              <span>Explore Live Dashboard</span>
              <ExternalLink className="h-4 w-4 text-[#64748B]" />
            </Link>
          </div>

          {/* Visual Showcase with Real-World Photo & Floating Badges */}
          <div className="mt-14 relative max-w-4xl mx-auto">
            {/* Main Hero Photo Container */}
            <div className="relative rounded-3xl overflow-hidden border border-[#DCE5EE] bg-white p-2.5 royal-shadow-lg">
              <div className="relative h-[260px] sm:h-[400px] w-full rounded-2xl overflow-hidden">
                <Image
                  src="/images/hero-workspace.jpg"
                  alt="Modern executive workplace showcasing enterprise information intelligence and document review"
                  fill
                  sizes="(max-width: 1024px) 100vw, 896px"
                  className="object-cover"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0B192C]/75 via-[#0B192C]/25 to-transparent" />
                <div className="absolute bottom-5 left-6 right-6 flex items-end justify-between text-left text-white">
                  <div>
                    <span className="inline-flex items-center space-x-1.5 rounded-md bg-[#014BAA] px-2.5 py-1 text-[11px] font-semibold text-white mb-2">
                      <Sparkles className="h-3 w-3" />
                      <span>Cognitive Multi-Engine Pipeline</span>
                    </span>
                    <h3 className="text-lg sm:text-2xl font-bold font-heading text-white">
                      Rigorous Cross-Document Analysis
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-200 max-w-xl hidden sm:block mt-0.5">
                      Extract structured facts, audit milestone dates, and verify discrepancies with page-level citations.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Floating Element 1 (Top Left) */}
            <div className="absolute -top-4 -left-3 sm:-left-6 hidden sm:flex items-center space-x-2.5 rounded-2xl bg-white border border-[#BFD7F5] p-3 royal-shadow-md animate-float-slow z-20">
              <div className="h-9 w-9 rounded-xl bg-[#EBF3FC] text-[#014BAA] flex items-center justify-center font-bold">
                <GitCompare className="h-4.5 w-4.5" />
              </div>
              <div className="text-left">
                <p className="text-xs font-bold text-[#0B192C]">Detect Conflicts</p>
                <p className="text-[10px] text-[#64748B]">Cross-document contradiction alerts</p>
              </div>
            </div>

            {/* Floating Element 2 (Bottom Left) */}
            <div className="absolute -bottom-4 -left-3 sm:-left-6 hidden sm:flex items-center space-x-2.5 rounded-2xl bg-white border border-[#FECACA] p-3 royal-shadow-md animate-float-reverse z-20">
              <div className="h-9 w-9 rounded-xl bg-[#FEF2F2] text-[#B91C1C] flex items-center justify-center font-bold">
                <AlertTriangle className="h-4.5 w-4.5" />
              </div>
              <div className="text-left">
                <p className="text-xs font-bold text-[#0B192C]">Find Missing Info</p>
                <p className="text-[10px] text-[#64748B]">Omitted clauses & unsigned exhibits</p>
              </div>
            </div>

            {/* Floating Element 3 (Top Right) */}
            <div className="absolute -top-4 -right-3 sm:-right-6 hidden sm:flex items-center space-x-2.5 rounded-2xl bg-white border border-[#BFD7F5] p-3 royal-shadow-md animate-float-reverse z-20">
              <div className="h-9 w-9 rounded-xl bg-[#EBF3FC] text-[#014BAA] flex items-center justify-center font-bold">
                <Bot className="h-4.5 w-4.5" />
              </div>
              <div className="text-left">
                <p className="text-xs font-bold text-[#0B192C]">Chat with Documents</p>
                <p className="text-[10px] text-[#64748B]">Verified answers & page citations</p>
              </div>
            </div>

            {/* Floating Element 4 (Bottom Right) */}
            <div className="absolute -bottom-4 -right-3 sm:-right-6 hidden sm:flex items-center space-x-2.5 rounded-2xl bg-white border border-[#DCE5EE] p-3 royal-shadow-md animate-float-slow z-20">
              <div className="h-9 w-9 rounded-xl bg-[#EBF3FC] text-[#014BAA] flex items-center justify-center font-bold">
                <BarChart3 className="h-4.5 w-4.5" />
              </div>
              <div className="text-left">
                <p className="text-xs font-bold text-[#0B192C]">Automated Visuals</p>
                <p className="text-[10px] text-[#64748B]">Data-driven quantitative charts</p>
              </div>
            </div>
          </div>

          {/* The Core Differentiator Callout */}
          <div className="mt-14 p-6 sm:p-7 rounded-3xl border border-[#DCE5EE] bg-white text-left max-w-4xl mx-auto royal-shadow-md">
            <div className="flex items-start space-x-4">
              <div className="h-10 w-10 rounded-2xl bg-[#EBF3FC] text-[#014BAA] flex items-center justify-center flex-shrink-0 mt-0.5 border border-[#BFD7F5]">
                <Zap className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-[#014BAA] uppercase tracking-wider">
                  The Doc.DOOM Core Differentiator
                </h3>
                <blockquote className="mt-1.5 text-sm sm:text-base text-[#1E2E42] italic border-l-3 border-[#014BAA] pl-3.5 leading-relaxed">
                  “We are not building only an AI document summarizer. We are building an AI-powered information intelligence system that understands documents, discovers useful information, identifies missing/conflicting information, creates document-specific insights and visualizations, and helps users act on the information.”
                </blockquote>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Moving Text: Slow Continuous Horizontal Marquee Band */}
      <div className="py-4 border-y border-[#E6DFD8] bg-[#EBF3FC]/80 overflow-hidden relative">
        <div className="animate-marquee flex items-center space-x-8">
          {[...marqueeKeywords, ...marqueeKeywords].map((keyword, index) => (
            <div key={index} className="flex items-center space-x-8 flex-shrink-0">
              <span className="text-xs sm:text-sm font-bold tracking-wide text-[#014BAA] uppercase">
                {keyword}
              </span>
              <span className="h-1.5 w-1.5 rounded-full bg-[#014BAA]/40" />
            </div>
          ))}
        </div>
      </div>

      {/* The 4-Step Information Journey */}
      <section className="py-20 px-6 bg-white border-b border-[#E6DFD8]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <span className="text-xs font-bold uppercase tracking-widest text-[#014BAA]">
              The Core Framework
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-[#0B192C] mt-1 font-heading">
              The 4-Step Information Journey
            </h2>
            <p className="text-sm sm:text-base text-[#64748B] max-w-2xl mx-auto mt-2">
              Transforming unstructured documents into verified, executive-ready decisions.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {/* Step 1: Find */}
            <div className="rounded-2xl border border-[#DCE5EE] bg-[#F8F3F0] p-6 hover:border-[#014BAA] transition hover:-translate-y-1 duration-200 royal-shadow-sm">
              <div className="h-11 w-11 rounded-xl bg-[#014BAA] text-white flex items-center justify-center font-bold text-sm mb-4 shadow-sm">
                01
              </div>
              <h3 className="text-lg font-bold text-[#0B192C] font-heading">Find</h3>
              <p className="mt-2 text-xs text-[#3B4D63] leading-relaxed">
                Ingest multiple documents simultaneously across PDF, DOCX, CSV, Excel, TXT, and scanned image formats with permanent storage.
              </p>
            </div>

            {/* Step 2: Understand */}
            <div className="rounded-2xl border border-[#DCE5EE] bg-[#F8F3F0] p-6 hover:border-[#014BAA] transition hover:-translate-y-1 duration-200 royal-shadow-sm">
              <div className="h-11 w-11 rounded-xl bg-[#014BAA] text-white flex items-center justify-center font-bold text-sm mb-4 shadow-sm">
                02
              </div>
              <h3 className="text-lg font-bold text-[#0B192C] font-heading">Understand</h3>
              <p className="mt-2 text-xs text-[#3B4D63] leading-relaxed">
                Cognitive understanding discovers facts, deadlines, financial amounts, key entities, and critical requirements with source page traceability.
              </p>
            </div>

            {/* Step 3: Organize */}
            <div className="rounded-2xl border border-[#DCE5EE] bg-[#F8F3F0] p-6 hover:border-[#014BAA] transition hover:-translate-y-1 duration-200 royal-shadow-sm">
              <div className="h-11 w-11 rounded-xl bg-[#014BAA] text-white flex items-center justify-center font-bold text-sm mb-4 shadow-sm">
                03
              </div>
              <h3 className="text-lg font-bold text-[#0B192C] font-heading">Organize</h3>
              <p className="mt-2 text-xs text-[#3B4D63] leading-relaxed">
                Identifies missing information, detects cross-document contradictions with &quot;Needs Human Review&quot; flags, and structures comparison matrices.
              </p>
            </div>

            {/* Step 4: Use */}
            <div className="rounded-2xl border border-[#DCE5EE] bg-[#F8F3F0] p-6 hover:border-[#014BAA] transition hover:-translate-y-1 duration-200 royal-shadow-sm">
              <div className="h-11 w-11 rounded-xl bg-[#014BAA] text-white flex items-center justify-center font-bold text-sm mb-4 shadow-sm">
                04
              </div>
              <h3 className="text-lg font-bold text-[#0B192C] font-heading">Use</h3>
              <p className="mt-2 text-xs text-[#3B4D63] leading-relaxed">
                Renders document-specific charts (Bar, Line, Area, KPI) only when justified, and delivers grounded AI chat with verified source citations.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-xs font-bold uppercase tracking-widest text-[#014BAA]">
              Enterprise Capabilities
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-[#0B192C] mt-1 font-heading">
              Engineered for Audit-Grade Precision
            </h2>
            <p className="text-sm sm:text-base text-[#64748B] max-w-2xl mx-auto mt-2">
              Beyond simple text extraction: deep cognitive analysis that spots what is missing, what conflicts, and what matters.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Feature 1 */}
            <div className="rounded-2xl border border-[#DCE5EE] bg-white p-6 hover:border-[#014BAA] transition hover:shadow-md duration-200 royal-shadow-sm">
              <div className="h-12 w-12 rounded-xl bg-[#EBF3FC] text-[#014BAA] flex items-center justify-center mb-4 border border-[#BFD7F5]">
                <AlertTriangle className="h-6 w-6" />
              </div>
              <h3 className="text-base font-bold text-[#0B192C] font-heading">Missing Information Detection</h3>
              <p className="mt-2 text-xs text-[#3B4D63] leading-relaxed">
                Categorizes missing items into Explicitly Missing, Not Found, Possibly Missing, and Not Applicable with rigorous context evidence.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="rounded-2xl border border-[#DCE5EE] bg-white p-6 hover:border-[#014BAA] transition hover:shadow-md duration-200 royal-shadow-sm">
              <div className="h-12 w-12 rounded-xl bg-[#EBF3FC] text-[#014BAA] flex items-center justify-center mb-4 border border-[#BFD7F5]">
                <GitCompare className="h-6 w-6" />
              </div>
              <h3 className="text-base font-bold text-[#0B192C] font-heading">Cross-Document Conflict Engine</h3>
              <p className="mt-2 text-xs text-[#3B4D63] leading-relaxed">
                Compares multiple documents to catch contradictory deadlines, amounts, or terms. Flags status as &quot;Needs Human Review&quot; with side-by-side citations.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="rounded-2xl border border-[#DCE5EE] bg-white p-6 hover:border-[#014BAA] transition hover:shadow-md duration-200 royal-shadow-sm">
              <div className="h-12 w-12 rounded-xl bg-[#EBF3FC] text-[#014BAA] flex items-center justify-center mb-4 border border-[#BFD7F5]">
                <BarChart3 className="h-6 w-6" />
              </div>
              <h3 className="text-base font-bold text-[#0B192C] font-heading">Document-Specific Charts</h3>
              <p className="mt-2 text-xs text-[#3B4D63] leading-relaxed">
                Generates visualizations only when quantitative data exists. Clear empty state on policy/legal documents prevents misleading or fabricated charts.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="rounded-2xl border border-[#DCE5EE] bg-white p-6 hover:border-[#014BAA] transition hover:shadow-md duration-200 royal-shadow-sm">
              <div className="h-12 w-12 rounded-xl bg-[#EBF3FC] text-[#014BAA] flex items-center justify-center mb-4 border border-[#BFD7F5]">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <h3 className="text-base font-bold text-[#0B192C] font-heading">Source Page Traceability</h3>
              <p className="mt-2 text-xs text-[#3B4D63] leading-relaxed">
                Every extracted fact, deadline, and entity provides its exact source document and section reference for instant audit verification.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="rounded-2xl border border-[#DCE5EE] bg-white p-6 hover:border-[#014BAA] transition hover:shadow-md duration-200 royal-shadow-sm">
              <div className="h-12 w-12 rounded-xl bg-[#EBF3FC] text-[#014BAA] flex items-center justify-center mb-4 border border-[#BFD7F5]">
                <Bot className="h-6 w-6" />
              </div>
              <h3 className="text-base font-bold text-[#0B192C] font-heading">Grounded AI Assistant</h3>
              <p className="mt-2 text-xs text-[#3B4D63] leading-relaxed">
                Ask questions across a single document or your entire repository. Zero hallucination tolerance with linked evidence quotes.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="rounded-2xl border border-[#DCE5EE] bg-white p-6 hover:border-[#014BAA] transition hover:shadow-md duration-200 royal-shadow-sm">
              <div className="h-12 w-12 rounded-xl bg-[#EBF3FC] text-[#014BAA] flex items-center justify-center mb-4 border border-[#BFD7F5]">
                <Layers className="h-6 w-6" />
              </div>
              <h3 className="text-base font-bold text-[#0B192C] font-heading">Configurable Highlights</h3>
              <p className="mt-2 text-xs text-[#3B4D63] leading-relaxed">
                Users can customize and persist highlight colors for Critical, Important, Warning, Missing, Conflict, and Deadline categories.
              </p>
            </div>
          </div>

          {/* Dual Visual Feature Showcase with Real Photos */}
          <div className="mt-14 grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="rounded-3xl border border-[#DCE5EE] bg-white p-6 royal-shadow-md">
              <div className="relative h-56 rounded-2xl overflow-hidden mb-5">
                <Image
                  src="/images/team-collaboration.jpg"
                  alt="Enterprise team collaborating on document intelligence review"
                  fill
                  sizes="(max-width: 768px) 100vw, 500px"
                  loading="lazy"
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0B192C]/70 to-transparent" />
                <div className="absolute bottom-3 left-4 text-white">
                  <span className="text-xs font-bold text-[#BFD7F5] uppercase tracking-wider">Multi-Party Review</span>
                  <p className="text-sm font-semibold">Human-in-the-Loop Conflict Resolution</p>
                </div>
              </div>
              <h4 className="text-base font-bold text-[#0B192C] font-heading">
                Side-by-Side Contradiction Resolution
              </h4>
              <p className="mt-1.5 text-xs text-[#3B4D63] leading-relaxed">
                When two contracts stipulate conflicting dates or payment penalties, Doc.DOOM aligns both excerpts side-by-side with source page numbers and flags them for definitive analyst approval.
              </p>
            </div>

            <div className="rounded-3xl border border-[#DCE5EE] bg-white p-6 royal-shadow-md">
              <div className="relative h-56 rounded-2xl overflow-hidden mb-5">
                <Image
                  src="/images/analytics-dashboard.jpg"
                  alt="Analytical dashboard visualizing document metrics and financial charts"
                  fill
                  sizes="(max-width: 768px) 100vw, 500px"
                  loading="lazy"
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0B192C]/70 to-transparent" />
                <div className="absolute bottom-3 left-4 text-white">
                  <span className="text-xs font-bold text-[#BFD7F5] uppercase tracking-wider">Automated Analytics</span>
                  <p className="text-sm font-semibold">Grounded Data Visualizations</p>
                </div>
              </div>
              <h4 className="text-base font-bold text-[#0B192C] font-heading">
                Truthful Quantitative Visuals
              </h4>
              <p className="mt-1.5 text-xs text-[#3B4D63] leading-relaxed">
                Bar, line, area, and KPI cards are rendered solely when numerical values exist. For non-quantitative documents, clear descriptive notices prevent misleading chart generation.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* "How It Works" Section */}
      <section className="py-20 px-6 bg-white border-y border-[#E6DFD8]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-xs font-bold uppercase tracking-widest text-[#014BAA]">
              Simple & Systematic
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-[#0B192C] mt-1 font-heading">
              How Doc.DOOM Operates
            </h2>
            <p className="text-sm sm:text-base text-[#64748B] max-w-2xl mx-auto mt-2">
              Three seamless stages from multi-document upload to audit-ready insight.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {/* Stage 1 */}
            <div className="rounded-2xl border border-[#DCE5EE] bg-[#F8F3F0] p-6 relative royal-shadow-sm">
              <div className="h-10 w-10 rounded-full bg-[#014BAA] text-white flex items-center justify-center font-bold text-sm mb-4">
                1
              </div>
              <div className="flex items-center space-x-2 text-[#014BAA] font-semibold text-xs mb-1">
                <FileCheck className="h-4 w-4" />
                <span>Upload & Permanent Storage</span>
              </div>
              <h3 className="text-lg font-bold text-[#0B192C] font-heading">Ingest Multiple Formats</h3>
              <p className="mt-2 text-xs text-[#3B4D63] leading-relaxed">
                Drag and drop PDFs, Word documents, Excel workbooks, CSV tables, or scanned images. All documents are securely stored and indexed simultaneously.
              </p>
            </div>

            {/* Stage 2 */}
            <div className="rounded-2xl border border-[#DCE5EE] bg-[#F8F3F0] p-6 relative royal-shadow-sm">
              <div className="h-10 w-10 rounded-full bg-[#014BAA] text-white flex items-center justify-center font-bold text-sm mb-4">
                2
              </div>
              <div className="flex items-center space-x-2 text-[#014BAA] font-semibold text-xs mb-1">
                <FileSearch className="h-4 w-4" />
                <span>Cognitive Analysis Engine</span>
              </div>
              <h3 className="text-lg font-bold text-[#0B192C] font-heading">Extract, Detect & Compare</h3>
              <p className="mt-2 text-xs text-[#3B4D63] leading-relaxed">
                AI extracts entities, dates, and amounts. It checks for missing elements, identifies contradictions between files, and crafts data visualizations.
              </p>
            </div>

            {/* Stage 3 */}
            <div className="rounded-2xl border border-[#DCE5EE] bg-[#F8F3F0] p-6 relative royal-shadow-sm">
              <div className="h-10 w-10 rounded-full bg-[#014BAA] text-white flex items-center justify-center font-bold text-sm mb-4">
                3
              </div>
              <div className="flex items-center space-x-2 text-[#014BAA] font-semibold text-xs mb-1">
                <CheckCircle2 className="h-4 w-4" />
                <span>Grounded Action & Verification</span>
              </div>
              <h3 className="text-lg font-bold text-[#0B192C] font-heading">Act with Absolute Confidence</h3>
              <p className="mt-2 text-xs text-[#3B4D63] leading-relaxed">
                Review conflict matrices, query the AI assistant with precise page citations, and export intelligence with complete audit traceability.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action (CTA) Section */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto rounded-3xl bg-[#014BAA] p-8 sm:p-12 text-center text-white relative overflow-hidden royal-shadow-lg">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-white/10 via-transparent to-transparent pointer-events-none" />
          
          <div className="relative z-10">
            <span className="inline-flex items-center space-x-1.5 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold text-white mb-4">
              <Sparkles className="h-3.5 w-3.5 text-[#BFD7F5]" />
              <span>Ready for Enterprise Evaluation</span>
            </span>

            <h2 className="text-3xl sm:text-5xl font-bold font-heading leading-tight">
              Ready to Upgrade Your Document Intelligence?
            </h2>

            <p className="mt-4 text-sm sm:text-base text-[#BFD7F5] max-w-2xl mx-auto leading-relaxed">
              Experience the full pipeline with Google OAuth or instant demo evaluation. Discover facts, flag missing items, and resolve conflicts in seconds.
            </p>

            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                onClick={loginWithGoogle}
                className="w-full sm:w-auto flex items-center justify-center space-x-2 rounded-xl bg-white hover:bg-[#F8F3F0] px-7 py-3.5 text-sm sm:text-base font-bold text-[#014BAA] shadow-lg transition"
              >
                <span>Launch Google OAuth</span>
                <ArrowRight className="h-4.5 w-4.5" />
              </button>

              <Link
                href="/dashboard"
                className="w-full sm:w-auto flex items-center justify-center space-x-2 rounded-xl border border-white/30 bg-white/10 hover:bg-white/20 px-6 py-3.5 text-sm sm:text-base font-semibold text-white transition"
              >
                <span>Direct Dashboard Access</span>
                <ExternalLink className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Us Footer */}
      <footer className="mt-auto border-t border-[#E6DFD8] bg-[#F8F3F0] py-12 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center space-x-3.5">
            <Logo size="sm" />
            <div>
              <p className="text-base font-bold text-[#0B192C] font-heading">Doc.DOOM</p>
              <p className="text-xs text-[#64748B]">Intelligent Information Understanding & Processing • HackNext’26 PS01</p>
            </div>
          </div>

          <div className="flex items-center space-x-6 text-xs text-[#3B4D63]">
            <button
              onClick={() => setIsContactOpen(true)}
              className="text-[#3B4D63] hover:text-[#014BAA] flex items-center space-x-1.5 transition font-medium"
            >
              <Mail className="h-4 w-4 text-[#014BAA]" />
              <span>Contact: sanjay9187ram@gmail.com</span>
            </button>
            <a
              href="mailto:sanjay9187ram@gmail.com?subject=Doc.DOOM%20HackNext'26"
              className="text-[#014BAA] hover:underline flex items-center space-x-1 font-semibold"
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

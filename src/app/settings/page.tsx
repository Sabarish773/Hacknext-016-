'use client';

import React, { useState } from 'react';
import {
  Settings as SettingsIcon,
  Palette,
  RotateCcw,
  CheckCircle2,
  Cpu,
} from 'lucide-react';
import { Sidebar } from '@/components/layout/Sidebar';
import { Header } from '@/components/layout/Header';
import { PriorityBadge } from '@/components/common/PriorityBadge';
import { useHighlights } from '@/context/HighlightContext';
import { HighlightColorSettings } from '@/types';

interface HighlightCategoryConfig {
  key: keyof HighlightColorSettings;
  label: string;
  description: string;
}

const CATEGORIES: HighlightCategoryConfig[] = [
  { key: 'critical', label: 'Critical Priority', description: 'Urgent operational risks, breaches, and critical requirements.' },
  { key: 'important', label: 'Important Items', description: 'Essential facts, financial commitments, and core deliverables.' },
  { key: 'warning', label: 'Warning / Needs Review', description: 'Ambiguous clauses, unverified terms, or moderate risks.' },
  { key: 'missing', label: 'Missing Information', description: 'Omitted signatures, unattached schedules, or missing contacts.' },
  { key: 'conflict', label: 'Potential Conflicts', description: 'Contradictory dates, mismatched figures, and disputed clauses.' },
  { key: 'deadline', label: 'Milestones & Deadlines', description: 'Target delivery dates, expiration windows, and due dates.' },
  { key: 'informational', label: 'Informational / Verified', description: 'Background context, entity labels, and standard notes.' },
];

export default function SettingsPage() {
  const { highlights, updateColor, resetToDefaults } = useHighlights();
  const [activeModel, setActiveModel] = useState('gemini-2.5-flash');
  const [autoAnalyze, setAutoAnalyze] = useState(true);
  const [savedNotice, setSavedNotice] = useState(false);

  const handleColorChange = (key: keyof HighlightColorSettings, color: string) => {
    updateColor(key, color);
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[#F8F3F0] text-[#0B192C] flex flex-col lg:flex-row selection:bg-[#014BAA]/15 selection:text-[#014BAA]">
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0">
        <Header />

        <main className="flex-1 p-6 max-w-5xl mx-auto w-full space-y-6">
          {/* Header */}
          <div>
            <h1 className="text-2xl font-bold text-[#0B192C] tracking-tight flex items-center space-x-2.5 font-heading">
              <SettingsIcon className="h-6 w-6 text-[#014BAA]" />
              <span>Settings &amp; Highlight Customization</span>
            </h1>
            <p className="text-xs text-[#64748B] mt-1">
              Personalize intelligence highlight colors and AI model processing options.
            </p>
          </div>

          {/* Highlight Customization Section */}
          <div className="rounded-3xl border border-[#DCE5EE] bg-white p-6 md:p-8 space-y-6 royal-shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#E6DFD8] pb-4">
              <div>
                <h2 className="text-base font-bold text-[#0B192C] font-heading flex items-center space-x-2">
                  <Palette className="h-4 w-4 text-[#014BAA]" />
                  <span>Configurable Highlight Colors</span>
                </h2>
                <p className="text-xs text-[#64748B] mt-0.5">
                  Customize the colors applied to intelligence badges, conflict tags, and entity highlights across the entire app.
                </p>
              </div>

              <div className="flex items-center space-x-3">
                {savedNotice && (
                  <span className="text-xs text-emerald-700 font-bold flex items-center space-x-1 animate-pulse">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    <span>Saved</span>
                  </span>
                )}
                <button
                  onClick={resetToDefaults}
                  className="flex items-center space-x-1.5 rounded-xl border border-[#DCE5EE] bg-[#F8F3F0] hover:bg-[#ECE5DF] px-3.5 py-1.5 text-xs font-semibold text-[#0B192C] transition"
                >
                  <RotateCcw className="h-3.5 w-3.5 text-[#64748B]" />
                  <span>Reset to Defaults</span>
                </button>
              </div>
            </div>

            {/* Color Pickers List */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {CATEGORIES.map((cat) => (
                <div
                  key={cat.key}
                  className="rounded-2xl border border-[#DCE5EE] bg-[#F8F3F0] p-4 flex items-center justify-between space-x-3 hover:border-[#014BAA]/30 transition"
                >
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <span
                        className="h-3.5 w-3.5 rounded-full shadow-sm"
                        style={{ backgroundColor: highlights[cat.key] }}
                      />
                      <span className="text-xs font-bold text-[#0B192C]">{cat.label}</span>
                    </div>
                    <p className="text-[11px] text-[#64748B]">{cat.description}</p>
                  </div>

                  <div className="flex items-center space-x-2 flex-shrink-0">
                    <input
                      type="color"
                      value={highlights[cat.key]}
                      onChange={(e) => handleColorChange(cat.key, e.target.value)}
                      className="h-8 w-10 cursor-pointer rounded-lg border border-[#DCE5EE] bg-white p-0.5"
                      title={`Change ${cat.label} color`}
                    />
                    <span className="font-mono text-xs text-[#0B192C] font-semibold uppercase w-16">
                      {highlights[cat.key]}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Live Interactive Preview */}
            <div className="pt-4 border-t border-[#E6DFD8] space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-[#64748B]">
                Live Badge Preview
              </span>
              <div className="flex flex-wrap gap-2.5">
                <PriorityBadge priorityOrCategory="CRITICAL" label="Critical: Breach Penalty" />
                <PriorityBadge priorityOrCategory="IMPORTANT" label="Important: Payment Clause" />
                <PriorityBadge priorityOrCategory="WARNING" label="Needs Review: Unverified Terms" />
                <PriorityBadge priorityOrCategory="MISSING" label="Missing: Exhibit Annex B" />
                <PriorityBadge priorityOrCategory="CONFLICT" label="Conflict: October 12 vs 15" />
                <PriorityBadge priorityOrCategory="DEADLINE" label="Deadline: Dec 31, 2026" />
                <PriorityBadge priorityOrCategory="INFORMATIONAL" label="Info: Jurisdiction Clause" />
              </div>
            </div>
          </div>

          {/* AI Engine Configuration Section */}
          <div className="rounded-3xl border border-[#DCE5EE] bg-white p-6 md:p-8 space-y-5 royal-shadow-sm">
            <div className="border-b border-[#E6DFD8] pb-4">
              <h2 className="text-base font-bold text-[#0B192C] font-heading flex items-center space-x-2">
                <Cpu className="h-4 w-4 text-[#014BAA]" />
                <span>AI Service Layer &amp; Processing Preferences</span>
              </h2>
              <p className="text-xs text-[#64748B] mt-0.5">
                Dual-engine orchestrator with automated provider failover (Google Gemini &amp; OpenAI).
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-xs">
              <div>
                <label className="block font-semibold text-[#3B4D63] mb-1.5">
                  Primary Model Selection
                </label>
                <select
                  value={activeModel}
                  onChange={(e) => setActiveModel(e.target.value)}
                  className="w-full rounded-xl border border-[#DCE5EE] bg-white px-3.5 py-2.5 text-[#0B192C] focus:outline-none focus:border-[#014BAA] shadow-sm"
                >
                  <option value="gemini-2.5-flash">Google Gemini 2.5 Flash (Recommended - Ultra Fast)</option>
                  <option value="gpt-4o-mini">OpenAI GPT-4o Mini (High Fidelity)</option>
                  <option value="gemini-1.5-pro">Google Gemini 1.5 Pro (Deep Reasoning)</option>
                </select>
                <p className="text-[11px] text-[#64748B] mt-1">
                  Automatic fallback engages if rate limits or provider downtime occur.
                </p>
              </div>

              <div>
                <label className="block font-semibold text-[#3B4D63] mb-1.5">
                  Cognitive Pipeline Automation
                </label>
                <div className="p-3.5 rounded-xl border border-[#DCE5EE] bg-[#F8F3F0] flex items-center justify-between">
                  <div>
                    <p className="font-bold text-[#0B192C]">Auto-Analyze Uploaded Documents</p>
                    <p className="text-[11px] text-[#64748B]">Trigger cognitive extraction immediately upon ingestion</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={autoAnalyze}
                    onChange={(e) => setAutoAnalyze(e.target.checked)}
                    className="h-4.5 w-4.5 accent-[#014BAA] rounded cursor-pointer"
                  />
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

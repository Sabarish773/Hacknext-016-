'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Files,
  ArrowLeft,
  Download,
  Trash2,
  Sparkles,
  AlertTriangle,
  CheckCircle2,
  Clock,
  DollarSign,
  Building,
  User,
  MapPin,
  Tag,
  BarChart3,
  Bot,
  FileText,
  ShieldAlert,
  ChevronRight,
  ExternalLink,
  HelpCircle,
} from 'lucide-react';
import { Sidebar } from '@/components/layout/Sidebar';
import { Header } from '@/components/layout/Header';
import { PriorityBadge } from '@/components/common/PriorityBadge';
import { DocumentChartRenderer } from '@/components/visualizations/DocumentChartRenderer';
import { useAuth } from '@/context/AuthContext';
import { useHighlights } from '@/context/HighlightContext';
import { DocumentItem } from '@/types';

export default function DocumentDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const docId = params.id as string;
  const { user } = useAuth();
  const { getColorForCategory } = useHighlights();

  const [document, setDocument] = useState<DocumentItem | null>(null);
  const [activeTab, setActiveTab] = useState<
    'overview' | 'important' | 'entities' | 'missing' | 'insights' | 'charts' | 'raw'
  >('overview');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadDoc() {
      if (!user || !docId) return;
      try {
        const res = await fetch(`/api/documents/${docId}?userId=${user.id}`);
        if (res.ok) {
          const data = await res.json();
          setDocument(data.document);
        } else {
          router.push('/documents');
        }
      } catch (err) {
        console.error('Error loading document:', err);
      } finally {
        setIsLoading(false);
      }
    }
    loadDoc();
  }, [user, docId]);

  const handleDelete = async () => {
    if (!document) return;
    if (!confirm(`Permanently remove "${document.title}" and its cognitive analysis?`)) return;
    try {
      await fetch(`/api/documents/${document.id}?userId=${user?.id}`, { method: 'DELETE' });
      router.push('/documents');
    } catch (err) {
      console.error('Failed to delete doc:', err);
    }
  };

  if (isLoading || !document) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col lg:flex-row">
        <Sidebar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center space-y-3">
            <Sparkles className="h-8 w-8 animate-spin mx-auto text-blue-400" />
            <p className="text-xs text-slate-400">Loading document intelligence...</p>
          </div>
        </div>
      </div>
    );
  }

  // Group entities by category
  const entitiesByCategory: Record<string, typeof document.entities> = {};
  (document.entities || []).forEach((e) => {
    if (!entitiesByCategory[e.category]) entitiesByCategory[e.category] = [];
    entitiesByCategory[e.category]!.push(e);
  });

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col lg:flex-row">
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0">
        <Header />

        <main className="flex-1 p-6 max-w-7xl mx-auto w-full space-y-6">
          {/* Back link & Actions */}
          <div className="flex items-center justify-between">
            <Link
              href="/documents"
              className="inline-flex items-center space-x-1.5 text-xs font-semibold text-slate-400 hover:text-white transition"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Back to Library</span>
            </Link>

            <div className="flex items-center space-x-2">
              <Link
                href={`/chat?docId=${document.id}`}
                className="flex items-center space-x-1.5 rounded-xl border border-blue-500/30 bg-blue-500/10 hover:bg-blue-500/20 px-3 py-1.5 text-xs font-semibold text-blue-300 transition"
              >
                <Bot className="h-3.5 w-3.5 text-blue-400" />
                <span>Ask AI About This Doc</span>
              </Link>

              {document.storagePath && (
                <a
                  href={document.storagePath}
                  download={document.originalName}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-1.5 rounded-xl border border-slate-700 bg-slate-800 hover:bg-slate-700 px-3 py-1.5 text-xs font-semibold text-slate-300 transition"
                >
                  <Download className="h-3.5 w-3.5" />
                  <span>Download File</span>
                </a>
              )}

              <button
                onClick={handleDelete}
                className="flex items-center space-x-1.5 rounded-xl border border-red-800/40 bg-red-950/20 hover:bg-red-950/40 px-3 py-1.5 text-xs font-semibold text-red-400 transition"
              >
                <Trash2 className="h-3.5 w-3.5" />
                <span>Delete</span>
              </button>
            </div>
          </div>

          {/* Document Intelligence Hero Header */}
          <div className="rounded-3xl border border-slate-800 bg-slate-900/90 p-6 md:p-8 space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <div className="flex items-center space-x-2.5">
                  <span className="font-mono text-xs font-bold text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded border border-blue-500/20">
                    DOCUMENT {document.docNumber || 1}
                  </span>
                  <span className="rounded bg-slate-800 px-2 py-0.5 text-xs text-slate-300 border border-slate-700 font-medium">
                    {document.analysis?.category || 'General'}
                  </span>
                  <span className="rounded bg-emerald-950/60 px-2 py-0.5 text-xs text-emerald-400 border border-emerald-800/60 font-medium">
                    {document.status}
                  </span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-black text-white mt-2 tracking-tight">
                  {document.title}
                </h1>
                <p className="text-xs text-slate-400 mt-1">
                  Original: {document.originalName} • {(document.fileSizeBytes / 1024).toFixed(0)} KB •{' '}
                  {document.pageCount || 1} Page(s) • Processed in{' '}
                  {document.analysis?.processingDurationMs || 850}ms
                </p>
              </div>

              {/* Confidence Score Pill */}
              <div className="rounded-2xl border border-slate-800 bg-slate-950 p-4 text-center min-w-[130px] flex-shrink-0">
                <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                  Cognitive Confidence
                </span>
                <p className="text-2xl font-black text-blue-400 mt-0.5">
                  {Math.round((document.analysis?.confidenceScore || 0.95) * 100)}%
                </p>
              </div>
            </div>

            {/* Navigation Tabs */}
            <div className="pt-4 border-t border-slate-800/80 flex items-center space-x-2 overflow-x-auto scrollbar-none text-xs font-semibold">
              <button
                onClick={() => setActiveTab('overview')}
                className={`px-3.5 py-2 rounded-xl transition ${
                  activeTab === 'overview'
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                    : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                }`}
              >
                Overview & Summary
              </button>
              <button
                onClick={() => setActiveTab('important')}
                className={`px-3.5 py-2 rounded-xl transition flex items-center space-x-1.5 ${
                  activeTab === 'important'
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                    : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <span>Important Information & Highlights</span>
              </button>
              <button
                onClick={() => setActiveTab('entities')}
                className={`px-3.5 py-2 rounded-xl transition flex items-center space-x-1.5 ${
                  activeTab === 'entities'
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                    : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <span>Entities ({document.entities?.length || 0})</span>
              </button>
              <button
                onClick={() => setActiveTab('missing')}
                className={`px-3.5 py-2 rounded-xl transition flex items-center space-x-1.5 ${
                  activeTab === 'missing'
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                    : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <span>Missing Info ({document.missingInformation?.length || 0})</span>
              </button>
              <button
                onClick={() => setActiveTab('insights')}
                className={`px-3.5 py-2 rounded-xl transition flex items-center space-x-1.5 ${
                  activeTab === 'insights'
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                    : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <span>Actionable Insights ({document.insights?.length || 0})</span>
              </button>
              <button
                onClick={() => setActiveTab('charts')}
                className={`px-3.5 py-2 rounded-xl transition flex items-center space-x-1.5 ${
                  activeTab === 'charts'
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                    : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <BarChart3 className="h-3.5 w-3.5" />
                <span>Visualizations ({document.visualizations?.length || 0})</span>
              </button>
              <button
                onClick={() => setActiveTab('raw')}
                className={`px-3.5 py-2 rounded-xl transition flex items-center space-x-1.5 ${
                  activeTab === 'raw'
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                    : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <FileText className="h-3.5 w-3.5" />
                <span>Source Text & Traceability</span>
              </button>
            </div>
          </div>

          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6 space-y-4">
                <h3 className="text-base font-bold text-white">Executive Short Summary</h3>
                <p className="text-sm text-slate-200 leading-relaxed">
                  {document.analysis?.shortSummary}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6 space-y-3">
                  <h3 className="text-sm font-bold text-white">Primary Purpose</h3>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {document.analysis?.mainPurpose}
                  </p>
                </div>

                <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6 space-y-3">
                  <h3 className="text-sm font-bold text-white">Key Topics & Taxonomy</h3>
                  <div className="flex flex-wrap gap-2">
                    {document.analysis?.keyTopics &&
                      document.analysis.keyTopics.map((topic, i) => (
                        <span
                          key={i}
                          className="rounded-lg bg-blue-600/10 border border-blue-500/20 px-3 py-1 text-xs font-semibold text-blue-300"
                        >
                          #{topic}
                        </span>
                      ))}
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6 space-y-3">
                <h3 className="text-base font-bold text-white">Detailed Cognitive Breakdown</h3>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed whitespace-pre-line">
                  {document.analysis?.detailedSummary}
                </p>
              </div>
            </div>
          )}

          {/* TAB 2: IMPORTANT INFORMATION & HIGHLIGHTS */}
          {activeTab === 'important' && (
            <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6 space-y-6">
              <div>
                <h3 className="text-base font-bold text-white">Important Information & Rules</h3>
                <p className="text-xs text-slate-400 mt-1">
                  Extracted facts, deadlines, financial figures, and compliance constraints with customizable priority highlights.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {document.insights?.map((ins) => (
                  <div
                    key={ins.id}
                    className="p-4 rounded-xl border border-slate-800 bg-slate-950/70 space-y-2 hover:border-slate-700 transition"
                  >
                    <div className="flex items-center justify-between">
                      <PriorityBadge priorityOrCategory={ins.priority} />
                      <span className="text-[10px] font-mono text-slate-400 bg-slate-800 px-2 py-0.5 rounded">
                        {ins.sourceRef || `${document.title} - Section 1`}
                      </span>
                    </div>
                    <h4 className="text-sm font-bold text-white">{ins.title}</h4>
                    <p className="text-xs text-slate-300 leading-relaxed">{ins.description}</p>
                    {ins.recommendedAction && (
                      <div className="mt-2 pt-2 border-t border-slate-800/80 text-xs text-blue-300">
                        <span className="font-semibold text-blue-400">Next Step (AI Suggestion): </span>
                        {ins.recommendedAction}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: KEY ENTITIES */}
          {activeTab === 'entities' && (
            <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6 space-y-6">
              <div>
                <h3 className="text-base font-bold text-white">Detected Enterprise Entities</h3>
                <p className="text-xs text-slate-400 mt-1">
                  Only categories actually identified in this document are shown. No fabricated entities.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {Object.entries(entitiesByCategory).map(([category, items]) => (
                  <div
                    key={category}
                    className="rounded-xl border border-slate-800 bg-slate-950/70 p-4 space-y-3"
                  >
                    <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                      <span className="text-xs font-bold uppercase tracking-wider text-blue-400">
                        {category}
                      </span>
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-800 text-slate-300">
                        {items?.length || 0}
                      </span>
                    </div>

                    <div className="space-y-2">
                      {items?.map((item) => (
                        <div key={item.id} className="text-xs">
                          <p className="font-semibold text-white">{item.name}</p>
                          {item.context && <p className="text-[11px] text-slate-400">{item.context}</p>}
                          {item.sourceRef && (
                            <p className="text-[10px] font-mono text-slate-400 mt-0.5">{item.sourceRef}</p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: MISSING INFORMATION DETECTION */}
          {activeTab === 'missing' && (
            <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6 space-y-6">
              <div>
                <h3 className="text-base font-bold text-white">Missing Information & Gap Analysis</h3>
                <p className="text-xs text-slate-400 mt-1">
                  Identifies missing or incomplete items based on evidence from document structure.
                </p>
              </div>

              {document.missingInformation && document.missingInformation.length > 0 ? (
                <div className="space-y-4">
                  {document.missingInformation.map((item) => (
                    <div
                      key={item.id}
                      className="p-4 rounded-xl border border-purple-500/20 bg-purple-950/10 space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <PriorityBadge priorityOrCategory="MISSING" label={item.status} />
                          <span className="text-sm font-bold text-white">{item.itemName}</span>
                        </div>
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-purple-900/40 text-purple-300 border border-purple-800/40">
                          Severity: {item.severity}
                        </span>
                      </div>

                      <p className="text-xs text-slate-300">{item.reason}</p>

                      {item.evidence && (
                        <div className="rounded-lg bg-slate-900 p-2.5 text-[11px] text-slate-400 font-mono">
                          <strong>Context Evidence: </strong>
                          {item.evidence}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-12 text-center text-slate-400 text-xs">
                  <CheckCircle2 className="h-8 w-8 text-emerald-400 mx-auto mb-2" />
                  No critical missing information or compliance gaps were identified in this document.
                </div>
              )}
            </div>
          )}

          {/* TAB 5: ACTIONABLE INSIGHTS */}
          {activeTab === 'insights' && (
            <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6 space-y-6">
              <div>
                <h3 className="text-base font-bold text-white">Actionable Enterprise Insights</h3>
                <p className="text-xs text-slate-400 mt-1">
                  Synthesized recommendations labeled clearly as AI-generated suggestions.
                </p>
              </div>

              <div className="space-y-4">
                {document.insights?.map((ins) => (
                  <div
                    key={ins.id}
                    className="p-5 rounded-xl border border-slate-800 bg-slate-950/80 space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <PriorityBadge priorityOrCategory={ins.priority} />
                      <span className="text-xs font-mono text-slate-400">{ins.sourceRef}</span>
                    </div>

                    <h4 className="text-base font-bold text-white">{ins.title}</h4>
                    <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">{ins.description}</p>

                    {ins.recommendedAction && (
                      <div className="rounded-xl border border-blue-500/20 bg-blue-500/10 p-3 text-xs text-blue-200">
                        <span className="font-bold text-blue-400">Recommended Action (AI Suggestion): </span>
                        {ins.recommendedAction}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 6: DOCUMENT-SPECIFIC CHARTS */}
          {activeTab === 'charts' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-base font-bold text-white">Document-Specific Visualizations</h3>
                <p className="text-xs text-slate-400 mt-1">
                  Plots are generated exclusively from quantitative data in this document.
                </p>
              </div>

              {document.visualizations && document.visualizations.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {document.visualizations.map((vis) => (
                    <div key={vis.id} className={vis.chartType === 'kpi' ? 'md:col-span-2' : ''}>
                      <DocumentChartRenderer config={vis} />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="rounded-2xl border border-dashed border-slate-800 bg-slate-900/40 p-12 text-center text-slate-400 space-y-2">
                  <BarChart3 className="h-8 w-8 mx-auto text-slate-600" />
                  <p className="text-sm font-semibold text-slate-300">
                    No meaningful visualization available for this document.
                  </p>
                  <p className="text-xs max-w-md mx-auto text-slate-400">
                    This document contains qualitative narrative or policy guidelines without quantitative numerical series. Doc.DOOM does not generate irrelevant or misleading charts.
                  </p>
                </div>
              )}
            </div>
          )}

          {/* TAB 7: SOURCE TRACEABILITY */}
          {activeTab === 'raw' && (
            <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-white">Source Text & Traceability Viewer</h3>
                  <p className="text-xs text-slate-400">
                    Verify extracted information directly against parsed text.
                  </p>
                </div>
                <span className="text-xs font-mono text-slate-400">
                  {document.rawText?.length || 0} characters
                </span>
              </div>

              <div className="rounded-xl border border-slate-800 bg-slate-950 p-4 font-mono text-xs text-slate-300 leading-relaxed overflow-x-auto max-h-[500px] overflow-y-auto whitespace-pre-wrap select-text">
                {document.rawText || 'No raw text available.'}
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

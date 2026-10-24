'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft,
  Download,
  Trash2,
  Sparkles,
  CheckCircle2,
  BarChart3,
  Bot,
  FileText,
} from 'lucide-react';
import { Sidebar } from '@/components/layout/Sidebar';
import { Header } from '@/components/layout/Header';
import { PriorityBadge } from '@/components/common/PriorityBadge';
import { DocumentChartRenderer } from '@/components/visualizations/DocumentChartRenderer';
import { useAuth } from '@/context/AuthContext';
import { DocumentItem } from '@/types';

export default function DocumentDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const docId = params.id as string;
  const { user } = useAuth();

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
  }, [user, docId, router]);

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
      <div className="min-h-screen bg-[#111111] text-[#ededed] flex flex-col lg:flex-row">
        <Sidebar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center space-y-3">
            <Sparkles className="h-8 w-8 animate-spin mx-auto text-[#00E5FF]" />
            <p className="text-xs text-[#737373]">Loading document intelligence...</p>
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
    <div className="min-h-screen bg-[#111111] text-[#ededed] flex flex-col lg:flex-row selection:bg-[#00E5FF]/20 selection:text-[#00E5FF]">
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0">
        <Header />

        <main className="flex-1 p-6 max-w-7xl mx-auto w-full space-y-6">
          {/* Back link & Actions */}
          <div className="flex items-center justify-between">
            <Link
              href="/documents"
              className="inline-flex items-center space-x-1.5 text-xs font-semibold text-[#a3a3a3] hover:text-[#00E5FF] transition"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Back to Library</span>
            </Link>

            <div className="flex items-center space-x-2">
              <Link
                href={`/chat?docId=${document.id}`}
                className="flex items-center space-x-1.5 rounded-xl border border-[#00E5FF]/30 bg-[#00E5FF]/10 hover:bg-[#00E5FF]/20 px-3 py-1.5 text-xs font-semibold text-[#00E5FF] transition"
              >
                <Bot className="h-3.5 w-3.5 text-[#00E5FF]" />
                <span>Ask AI About This Doc</span>
              </Link>

              {document.storagePath && (
                <a
                  href={document.storagePath}
                  download={document.originalName}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-1.5 rounded-xl border border-[#262626] bg-[#161616] hover:bg-[#222222] px-3 py-1.5 text-xs font-semibold text-[#ededed] transition"
                >
                  <Download className="h-3.5 w-3.5 text-[#a3a3a3]" />
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
          <div className="rounded-3xl border border-[#262626] bg-[#161616] p-6 md:p-8 space-y-4 shadow-sm cyan-glow">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <div className="flex items-center space-x-2.5">
                  <span className="font-mono text-xs font-bold text-[#00E5FF] bg-[#00E5FF]/10 px-2 py-0.5 rounded border border-[#00E5FF]/25">
                    DOCUMENT {document.docNumber || 1}
                  </span>
                  <span className="rounded bg-[#1f1f1f] px-2 py-0.5 text-xs text-[#a3a3a3] border border-[#262626] font-medium">
                    {document.analysis?.category || 'General'}
                  </span>
                  <span className="rounded bg-emerald-950/60 px-2 py-0.5 text-xs text-emerald-400 border border-emerald-800/60 font-medium">
                    {document.status}
                  </span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-black text-white mt-2 tracking-tight">
                  {document.title}
                </h1>
                <p className="text-xs text-[#737373] mt-1">
                  Original: {document.originalName} • {(document.fileSizeBytes / 1024).toFixed(0)} KB •{' '}
                  {document.pageCount || 1} Page(s) • Processed in{' '}
                  {document.analysis?.processingDurationMs || 850}ms
                </p>
              </div>

              {/* Confidence Score Pill */}
              <div className="rounded-2xl border border-[#262626] bg-[#111111] p-4 text-center min-w-[130px] flex-shrink-0">
                <span className="text-[10px] font-semibold text-[#737373] uppercase tracking-wider">
                  Cognitive Confidence
                </span>
                <p className="text-2xl font-black text-[#00E5FF] mt-0.5">
                  {Math.round((document.analysis?.confidenceScore || 0.95) * 100)}%
                </p>
              </div>
            </div>

            {/* Navigation Tabs */}
            <div className="pt-4 border-t border-[#262626] flex items-center space-x-2 overflow-x-auto scrollbar-none text-xs font-semibold">
              <button
                onClick={() => setActiveTab('overview')}
                className={`px-3.5 py-2 rounded-xl transition ${
                  activeTab === 'overview'
                    ? 'bg-[#00E5FF] text-[#111111] font-bold shadow-md shadow-[#00E5FF]/20'
                    : 'text-[#a3a3a3] hover:bg-[#1f1f1f] hover:text-white'
                }`}
              >
                Overview & Summary
              </button>
              <button
                onClick={() => setActiveTab('important')}
                className={`px-3.5 py-2 rounded-xl transition flex items-center space-x-1.5 ${
                  activeTab === 'important'
                    ? 'bg-[#00E5FF] text-[#111111] font-bold shadow-md shadow-[#00E5FF]/20'
                    : 'text-[#a3a3a3] hover:bg-[#1f1f1f] hover:text-white'
                }`}
              >
                <span>Important Information & Highlights</span>
              </button>
              <button
                onClick={() => setActiveTab('entities')}
                className={`px-3.5 py-2 rounded-xl transition flex items-center space-x-1.5 ${
                  activeTab === 'entities'
                    ? 'bg-[#00E5FF] text-[#111111] font-bold shadow-md shadow-[#00E5FF]/20'
                    : 'text-[#a3a3a3] hover:bg-[#1f1f1f] hover:text-white'
                }`}
              >
                <span>Entities ({document.entities?.length || 0})</span>
              </button>
              <button
                onClick={() => setActiveTab('missing')}
                className={`px-3.5 py-2 rounded-xl transition flex items-center space-x-1.5 ${
                  activeTab === 'missing'
                    ? 'bg-[#00E5FF] text-[#111111] font-bold shadow-md shadow-[#00E5FF]/20'
                    : 'text-[#a3a3a3] hover:bg-[#1f1f1f] hover:text-white'
                }`}
              >
                <span>Missing Info ({document.missingInformation?.length || 0})</span>
              </button>
              <button
                onClick={() => setActiveTab('insights')}
                className={`px-3.5 py-2 rounded-xl transition flex items-center space-x-1.5 ${
                  activeTab === 'insights'
                    ? 'bg-[#00E5FF] text-[#111111] font-bold shadow-md shadow-[#00E5FF]/20'
                    : 'text-[#a3a3a3] hover:bg-[#1f1f1f] hover:text-white'
                }`}
              >
                <span>Actionable Insights ({document.insights?.length || 0})</span>
              </button>
              <button
                onClick={() => setActiveTab('charts')}
                className={`px-3.5 py-2 rounded-xl transition flex items-center space-x-1.5 ${
                  activeTab === 'charts'
                    ? 'bg-[#00E5FF] text-[#111111] font-bold shadow-md shadow-[#00E5FF]/20'
                    : 'text-[#a3a3a3] hover:bg-[#1f1f1f] hover:text-white'
                }`}
              >
                <BarChart3 className="h-3.5 w-3.5" />
                <span>Visualizations ({document.visualizations?.length || 0})</span>
              </button>
              <button
                onClick={() => setActiveTab('raw')}
                className={`px-3.5 py-2 rounded-xl transition flex items-center space-x-1.5 ${
                  activeTab === 'raw'
                    ? 'bg-[#00E5FF] text-[#111111] font-bold shadow-md shadow-[#00E5FF]/20'
                    : 'text-[#a3a3a3] hover:bg-[#1f1f1f] hover:text-white'
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
              <div className="rounded-2xl border border-[#262626] bg-[#161616] p-6 space-y-4">
                <h3 className="text-base font-bold text-white">Executive Short Summary</h3>
                <p className="text-sm text-[#ededed] leading-relaxed">
                  {document.analysis?.shortSummary}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="rounded-2xl border border-[#262626] bg-[#161616] p-6 space-y-3">
                  <h3 className="text-sm font-bold text-white">Primary Purpose</h3>
                  <p className="text-xs text-[#a3a3a3] leading-relaxed">
                    {document.analysis?.mainPurpose}
                  </p>
                </div>

                <div className="rounded-2xl border border-[#262626] bg-[#161616] p-6 space-y-3">
                  <h3 className="text-sm font-bold text-white">Key Topics & Taxonomy</h3>
                  <div className="flex flex-wrap gap-2">
                    {document.analysis?.keyTopics &&
                      document.analysis.keyTopics.map((topic, i) => (
                        <span
                          key={i}
                          className="rounded-lg bg-[#00E5FF]/10 border border-[#00E5FF]/20 px-3 py-1 text-xs font-semibold text-[#00E5FF]"
                        >
                          #{topic}
                        </span>
                      ))}
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-[#262626] bg-[#161616] p-6 space-y-3">
                <h3 className="text-base font-bold text-white">Detailed Cognitive Breakdown</h3>
                <p className="text-xs sm:text-sm text-[#a3a3a3] leading-relaxed whitespace-pre-line">
                  {document.analysis?.detailedSummary}
                </p>
              </div>
            </div>
          )}

          {/* TAB 2: IMPORTANT INFORMATION & HIGHLIGHTS */}
          {activeTab === 'important' && (
            <div className="rounded-2xl border border-[#262626] bg-[#161616] p-6 space-y-6">
              <div>
                <h3 className="text-base font-bold text-white">Important Information & Rules</h3>
                <p className="text-xs text-[#737373] mt-1">
                  Extracted facts, deadlines, financial figures, and compliance constraints with customizable priority highlights.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {document.insights?.map((ins) => (
                  <div
                    key={ins.id}
                    className="p-4 rounded-xl border border-[#262626] bg-[#111111] space-y-2 hover:border-[#00E5FF]/30 transition"
                  >
                    <div className="flex items-center justify-between">
                      <PriorityBadge priorityOrCategory={ins.priority} />
                      <span className="text-[10px] font-mono text-[#a3a3a3] bg-[#181818] border border-[#262626] px-2 py-0.5 rounded">
                        {ins.sourceRef || `${document.title} - Section 1`}
                      </span>
                    </div>
                    <h4 className="text-sm font-bold text-white">{ins.title}</h4>
                    <p className="text-xs text-[#a3a3a3] leading-relaxed">{ins.description}</p>
                    {ins.recommendedAction && (
                      <div className="mt-2 pt-2 border-t border-[#262626] text-xs text-[#00E5FF]">
                        <span className="font-semibold text-[#00E5FF]">Next Step (AI Suggestion): </span>
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
            <div className="rounded-2xl border border-[#262626] bg-[#161616] p-6 space-y-6">
              <div>
                <h3 className="text-base font-bold text-white">Detected Enterprise Entities</h3>
                <p className="text-xs text-[#737373] mt-1">
                  Only categories actually identified in this document are shown. No fabricated entities.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {Object.entries(entitiesByCategory).map(([category, items]) => (
                  <div
                    key={category}
                    className="rounded-xl border border-[#262626] bg-[#111111] p-4 space-y-3"
                  >
                    <div className="flex items-center justify-between border-b border-[#262626] pb-2">
                      <span className="text-xs font-bold uppercase tracking-wider text-[#00E5FF]">
                        {category}
                      </span>
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[#181818] border border-[#262626] text-[#a3a3a3]">
                        {items?.length || 0}
                      </span>
                    </div>

                    <div className="space-y-2">
                      {items?.map((item) => (
                        <div key={item.id} className="text-xs">
                          <p className="font-semibold text-white">{item.name}</p>
                          {item.context && <p className="text-[11px] text-[#a3a3a3]">{item.context}</p>}
                          {item.sourceRef && (
                            <p className="text-[10px] font-mono text-[#737373] mt-0.5">{item.sourceRef}</p>
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
            <div className="rounded-2xl border border-[#262626] bg-[#161616] p-6 space-y-6">
              <div>
                <h3 className="text-base font-bold text-white">Missing Information & Gap Analysis</h3>
                <p className="text-xs text-[#737373] mt-1">
                  Identifies missing or incomplete items based on evidence from document structure.
                </p>
              </div>

              {document.missingInformation && document.missingInformation.length > 0 ? (
                <div className="space-y-4">
                  {document.missingInformation.map((item) => (
                    <div
                      key={item.id}
                      className="p-4 rounded-xl border border-[#00E5FF]/20 bg-[#00E5FF]/5 space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <PriorityBadge priorityOrCategory="MISSING" label={item.status} />
                          <span className="text-sm font-bold text-white">{item.itemName}</span>
                        </div>
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-[#181818] text-[#00E5FF] border border-[#00E5FF]/30">
                          Severity: {item.severity}
                        </span>
                      </div>

                      <p className="text-xs text-[#ededed]">{item.reason}</p>

                      {item.evidence && (
                        <div className="rounded-lg bg-[#111111] border border-[#262626] p-2.5 text-[11px] text-[#a3a3a3] font-mono">
                          <strong className="text-white">Context Evidence: </strong>
                          {item.evidence}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-12 text-center text-[#737373] text-xs">
                  <CheckCircle2 className="h-8 w-8 text-emerald-400 mx-auto mb-2" />
                  No critical missing information or compliance gaps were identified in this document.
                </div>
              )}
            </div>
          )}

          {/* TAB 5: ACTIONABLE INSIGHTS */}
          {activeTab === 'insights' && (
            <div className="rounded-2xl border border-[#262626] bg-[#161616] p-6 space-y-6">
              <div>
                <h3 className="text-base font-bold text-white">Actionable Enterprise Insights</h3>
                <p className="text-xs text-[#737373] mt-1">
                  Synthesized recommendations labeled clearly as AI-generated suggestions.
                </p>
              </div>

              <div className="space-y-4">
                {document.insights?.map((ins) => (
                  <div
                    key={ins.id}
                    className="p-5 rounded-xl border border-[#262626] bg-[#111111] space-y-3 hover:border-[#00E5FF]/30 transition"
                  >
                    <div className="flex items-center justify-between">
                      <PriorityBadge priorityOrCategory={ins.priority} />
                      <span className="text-xs font-mono text-[#737373]">{ins.sourceRef}</span>
                    </div>

                    <h4 className="text-base font-bold text-white">{ins.title}</h4>
                    <p className="text-xs sm:text-sm text-[#a3a3a3] leading-relaxed">{ins.description}</p>

                    {ins.recommendedAction && (
                      <div className="rounded-xl border border-[#00E5FF]/25 bg-[#00E5FF]/10 p-3 text-xs text-[#ededed]">
                        <span className="font-bold text-[#00E5FF]">Recommended Action (AI Suggestion): </span>
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
                <p className="text-xs text-[#737373] mt-1">
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
                <div className="rounded-2xl border border-dashed border-[#262626] bg-[#161616]/40 p-12 text-center text-[#737373] space-y-2">
                  <BarChart3 className="h-8 w-8 mx-auto text-[#525252]" />
                  <p className="text-sm font-semibold text-white">
                    No meaningful visualization available for this document.
                  </p>
                  <p className="text-xs max-w-md mx-auto text-[#737373]">
                    This document contains qualitative narrative or policy guidelines without quantitative numerical series. Doc.DOOM does not generate irrelevant or misleading charts.
                  </p>
                </div>
              )}
            </div>
          )}

          {/* TAB 7: SOURCE TRACEABILITY */}
          {activeTab === 'raw' && (
            <div className="rounded-2xl border border-[#262626] bg-[#161616] p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-white">Source Text & Traceability Viewer</h3>
                  <p className="text-xs text-[#737373]">
                    Verify extracted information directly against parsed text.
                  </p>
                </div>
                <span className="text-xs font-mono text-[#00E5FF]">
                  {document.rawText?.length || 0} characters
                </span>
              </div>

              <div className="rounded-xl border border-[#262626] bg-[#111111] p-4 font-mono text-xs text-[#ededed] leading-relaxed overflow-x-auto max-h-[500px] overflow-y-auto whitespace-pre-wrap select-text">
                {document.rawText || 'No raw text available.'}
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

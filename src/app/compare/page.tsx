'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  GitCompare,
  AlertTriangle,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  ShieldAlert,
  HelpCircle,
  FileText,
  Layers,
  ChevronRight,
} from 'lucide-react';
import { Sidebar } from '@/components/layout/Sidebar';
import { Header } from '@/components/layout/Header';
import { PriorityBadge } from '@/components/common/PriorityBadge';
import { useAuth } from '@/context/AuthContext';
import { DocumentItem, Conflict } from '@/types';
import { MultiDocumentComparisonResult } from '@/lib/ai/conflictDetector';

export default function DocumentComparisonPage() {
  const { user } = useAuth();
  const [documents, setDocuments] = useState<DocumentItem[]>([]);
  const [selectedDocIds, setSelectedDocIds] = useState<string[]>([]);
  const [comparisonResult, setComparisonResult] = useState<MultiDocumentComparisonResult | null>(null);
  const [isComparing, setIsComparing] = useState(false);
  const [isLoadingDocs, setIsLoadingDocs] = useState(true);

  useEffect(() => {
    async function fetchDocs() {
      if (!user) return;
      try {
        const res = await fetch(`/api/documents?userId=${user.id}`);
        if (res.ok) {
          const data = await res.json();
          const docs: DocumentItem[] = data.documents || [];
          setDocuments(docs);
          // Pre-select first 2 documents if available for immediate demo
          if (docs.length >= 2) {
            setSelectedDocIds([docs[0].id, docs[1].id]);
          }
        }
      } catch (err) {
        console.error('Error fetching docs for comparison:', err);
      } finally {
        setIsLoadingDocs(false);
      }
    }
    fetchDocs();
  }, [user]);

  const toggleSelectDoc = (id: string) => {
    setSelectedDocIds((prev) =>
      prev.includes(id) ? prev.filter((d) => d !== id) : [...prev, id]
    );
  };

  const handleRunComparison = async () => {
    if (selectedDocIds.length < 2) return;
    setIsComparing(true);
    try {
      const res = await fetch('/api/compare', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user?.id, docIds: selectedDocIds }),
      });
      if (res.ok) {
        const data = await res.json();
        setComparisonResult(data);
      }
    } catch (err) {
      console.error('Comparison error:', err);
    } finally {
      setIsComparing(false);
    }
  };

  // Run initial comparison when docs are loaded
  useEffect(() => {
    if (selectedDocIds.length >= 2 && !comparisonResult) {
      handleRunComparison();
    }
  }, [selectedDocIds.length]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col lg:flex-row">
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0">
        <Header />

        <main className="flex-1 p-6 max-w-7xl mx-auto w-full space-y-6">
          {/* Header */}
          <div>
            <h1 className="text-2xl font-black text-white tracking-tight flex items-center space-x-2.5">
              <GitCompare className="h-6 w-6 text-amber-400" />
              <span>Multi-Document Comparison & Conflict Detection</span>
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Select 2 or more documents to cross-examine clauses, detect contradictions, and review discrepancies.
            </p>
          </div>

          {/* Document Selector Pills */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
                Select Documents to Compare ({selectedDocIds.length} selected)
              </span>
              <button
                onClick={handleRunComparison}
                disabled={selectedDocIds.length < 2 || isComparing}
                className="flex items-center space-x-1.5 rounded-xl bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 px-4 py-1.5 text-xs font-bold text-white shadow-md shadow-orange-600/20 transition disabled:opacity-50"
              >
                {isComparing ? (
                  <>
                    <Sparkles className="h-3.5 w-3.5 animate-spin" />
                    <span>Analyzing Discrepancies...</span>
                  </>
                ) : (
                  <>
                    <GitCompare className="h-3.5 w-3.5" />
                    <span>Run Cross-Document Intelligence</span>
                  </>
                )}
              </button>
            </div>

            {isLoadingDocs ? (
              <p className="text-xs text-slate-400">Loading document library...</p>
            ) : documents.length < 2 ? (
              <div className="rounded-xl border border-dashed border-slate-800 p-6 text-center text-xs text-slate-400">
                You need at least 2 uploaded documents to run multi-document comparison. Please upload additional documents in the{' '}
                <Link href="/documents" className="text-blue-400 underline">
                  Document Library
                </Link>
                .
              </div>
            ) : (
              <div className="flex flex-wrap gap-2 pt-1">
                {documents.map((doc, idx) => {
                  const isSelected = selectedDocIds.includes(doc.id);
                  return (
                    <button
                      key={doc.id}
                      onClick={() => toggleSelectDoc(doc.id)}
                      className={`flex items-center space-x-2 rounded-xl px-3 py-2 text-xs font-medium border transition ${
                        isSelected
                          ? 'border-amber-500/50 bg-amber-500/15 text-amber-200'
                          : 'border-slate-800 bg-slate-950 text-slate-400 hover:border-slate-700 hover:text-white'
                      }`}
                    >
                      <span className="font-mono text-[10px] font-bold text-amber-400">
                        DOC {doc.docNumber || idx + 1}
                      </span>
                      <span className="truncate max-w-[150px]">{doc.title}</span>
                      {isSelected && <CheckCircle2 className="h-3.5 w-3.5 text-amber-400" />}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Conflict Detection Results Banner */}
          {comparisonResult && (
            <div className="space-y-6">
              {/* Conflict Section */}
              <div className="rounded-2xl border border-pink-500/30 bg-pink-950/10 p-6 space-y-4">
                <div className="flex items-center justify-between border-b border-pink-500/20 pb-3">
                  <div className="flex items-center space-x-2">
                    <ShieldAlert className="h-5 w-5 text-pink-400" />
                    <h3 className="text-base font-bold text-white">
                      Potential Conflicts ({comparisonResult.conflicts.length})
                    </h3>
                  </div>
                  <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded bg-pink-500/20 text-pink-300 border border-pink-500/30">
                    Needs Human Review
                  </span>
                </div>

                {comparisonResult.conflicts.length > 0 ? (
                  <div className="space-y-4">
                    {comparisonResult.conflicts.map((conf, i) => (
                      <div
                        key={i}
                        className="rounded-xl border border-slate-800 bg-slate-900/90 p-4 space-y-3"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-pink-400 flex items-center space-x-1.5">
                            <AlertTriangle className="h-4 w-4" />
                            <span>{conf.fieldName}</span>
                          </span>
                          <PriorityBadge priorityOrCategory="CONFLICT" label="Needs Human Review" />
                        </div>

                        <p className="text-xs text-slate-300">{conf.description}</p>

                        {/* Side by side comparison */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
                          <div className="rounded-lg border border-slate-800 bg-slate-950 p-3 space-y-1">
                            <span className="text-[10px] font-mono text-slate-400 uppercase font-semibold">
                              {conf.primaryDocTitle || 'Document 1'}
                            </span>
                            <p className="text-sm font-bold text-emerald-400">{conf.primaryValue}</p>
                            <p className="text-[10px] font-mono text-slate-400">
                              Source: {conf.primarySourceRef || 'Document 1'}
                            </p>
                          </div>

                          <div className="rounded-lg border border-slate-800 bg-slate-950 p-3 space-y-1">
                            <span className="text-[10px] font-mono text-slate-400 uppercase font-semibold">
                              {conf.conflictingDocTitle || 'Document 2'}
                            </span>
                            <p className="text-sm font-bold text-amber-400">{conf.conflictingValue}</p>
                            <p className="text-[10px] font-mono text-slate-400">
                              Source: {conf.conflictingSourceRef || 'Document 2'}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="py-6 text-center text-xs text-slate-400">
                    <CheckCircle2 className="h-6 w-6 text-emerald-400 mx-auto mb-1.5" />
                    No conflicting terms, contradictory dates, or amount discrepancies discovered between these documents.
                  </div>
                )}
              </div>

              {/* Common Information & Differences Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Common Information */}
                <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6 space-y-4">
                  <h3 className="text-sm font-bold text-white flex items-center space-x-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                    <span>Common Information</span>
                  </h3>
                  <div className="space-y-3">
                    {comparisonResult.commonInformation.map((comm, idx) => (
                      <div key={idx} className="rounded-xl border border-slate-800 bg-slate-950 p-3 space-y-1">
                        <p className="text-xs font-semibold text-white">{comm.topic}</p>
                        <p className="text-xs text-slate-300">{comm.description}</p>
                        <p className="text-[10px] text-slate-400 font-mono mt-1">
                          Shared in: {comm.sharedIn.join(', ')}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Differing Information */}
                <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6 space-y-4">
                  <h3 className="text-sm font-bold text-white flex items-center space-x-2">
                    <Layers className="h-4 w-4 text-blue-400" />
                    <span>Differing Information</span>
                  </h3>
                  <div className="space-y-3">
                    {comparisonResult.differingInformation.map((diff, idx) => (
                      <div key={idx} className="rounded-xl border border-slate-800 bg-slate-950 p-3 space-y-1.5">
                        <p className="text-xs font-semibold text-white">{diff.topic}</p>
                        <div className="space-y-1 text-xs">
                          {diff.details.map((item, dIdx) => (
                            <div key={dIdx} className="flex items-center justify-between text-slate-300">
                              <span className="text-slate-400 text-[11px] font-medium">{item.docTitle}:</span>
                              <span className="font-semibold text-white">{item.value}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Consolidated AI Recommendations */}
              <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <h3 className="text-sm font-bold text-white">Consolidated Recommended Actions</h3>
                  <span className="text-[10px] font-semibold text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded border border-blue-500/20">
                    AI Suggestions
                  </span>
                </div>

                <div className="space-y-3">
                  {comparisonResult.consolidatedRecommendations.map((rec, idx) => (
                    <div
                      key={idx}
                      className="rounded-xl border border-slate-800 bg-slate-950 p-4 flex items-start space-x-3 text-xs"
                    >
                      <PriorityBadge priorityOrCategory={rec.priority} className="flex-shrink-0" />
                      <div className="space-y-1">
                        <p className="font-semibold text-white">{rec.action}</p>
                        <p className="text-slate-400">{rec.reason}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

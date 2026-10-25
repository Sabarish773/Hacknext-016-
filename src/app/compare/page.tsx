'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  GitCompare,
  AlertTriangle,
  CheckCircle2,
  Sparkles,
  ShieldAlert,
  Layers,
} from 'lucide-react';
import { Sidebar } from '@/components/layout/Sidebar';
import { Header } from '@/components/layout/Header';
import { PriorityBadge } from '@/components/common/PriorityBadge';
import { useAuth } from '@/context/AuthContext';
import { DocumentItem } from '@/types';
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
    <div className="min-h-screen bg-[#F8F3F0] text-[#0B192C] flex flex-col lg:flex-row selection:bg-[#014BAA]/15 selection:text-[#014BAA]">
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0">
        <Header />

        <main className="flex-1 p-6 max-w-7xl mx-auto w-full space-y-6">
          {/* Header */}
          <div>
            <h1 className="text-2xl font-bold text-[#0B192C] tracking-tight flex items-center space-x-2.5 font-heading">
              <GitCompare className="h-6 w-6 text-[#014BAA]" />
              <span>Multi-Document Comparison &amp; Conflict Detection</span>
            </h1>
            <p className="text-xs text-[#64748B] mt-1">
              Select 2 or more documents to cross-examine clauses, detect contradictions, and review discrepancies.
            </p>
          </div>

          {/* Document Selector Pills */}
          <div className="rounded-2xl border border-[#DCE5EE] bg-white p-5 space-y-3 royal-shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <span className="text-xs font-bold uppercase tracking-wider text-[#3B4D63]">
                Select Documents to Compare ({selectedDocIds.length} selected)
              </span>
              <button
                onClick={handleRunComparison}
                disabled={selectedDocIds.length < 2 || isComparing}
                className="flex items-center space-x-1.5 rounded-xl bg-[#014BAA] hover:bg-[#013C88] active:bg-[#012E69] px-4 py-1.5 text-xs font-bold text-white shadow-md shadow-[#014BAA]/20 transition disabled:opacity-50"
              >
                {isComparing ? (
                  <>
                    <Sparkles className="h-3.5 w-3.5 animate-spin text-white" />
                    <span>Analyzing Discrepancies...</span>
                  </>
                ) : (
                  <>
                    <GitCompare className="h-3.5 w-3.5 text-white" />
                    <span>Run Cross-Document Intelligence</span>
                  </>
                )}
              </button>
            </div>

            {isLoadingDocs ? (
              <p className="text-xs text-[#64748B]">Loading document library...</p>
            ) : documents.length < 2 ? (
              <div className="rounded-xl border border-dashed border-[#DCE5EE] p-6 text-center text-xs text-[#64748B]">
                You need at least 2 uploaded documents to run multi-document comparison. Please upload additional documents in the{' '}
                <Link href="/documents" className="text-[#014BAA] underline font-semibold">
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
                      className={`flex items-center space-x-2 rounded-xl px-3 py-2 text-xs font-semibold border transition ${
                        isSelected
                          ? 'border-[#014BAA] bg-[#EBF3FC] text-[#014BAA] shadow-sm font-bold'
                          : 'border-[#DCE5EE] bg-[#F8F3F0] text-[#3B4D63] hover:border-[#014BAA]/30 hover:text-[#014BAA]'
                      }`}
                    >
                      <span className="font-mono text-[10px] font-bold text-[#014BAA]">
                        DOC {doc.docNumber || idx + 1}
                      </span>
                      <span className="truncate max-w-[150px] font-normal">{doc.title}</span>
                      {isSelected && <CheckCircle2 className="h-3.5 w-3.5 text-[#014BAA]" />}
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
              <div className="rounded-2xl border border-rose-200 bg-white p-6 space-y-4 royal-shadow-sm">
                <div className="flex items-center justify-between border-b border-[#E6DFD8] pb-3">
                  <div className="flex items-center space-x-2">
                    <ShieldAlert className="h-5 w-5 text-rose-600" />
                    <h3 className="text-base font-bold text-[#0B192C] font-heading">
                      Potential Conflicts ({comparisonResult.conflicts.length})
                    </h3>
                  </div>
                  <span className="text-[10px] font-bold uppercase px-2.5 py-1 rounded-full bg-rose-50 text-rose-700 border border-rose-200">
                    Needs Human Review
                  </span>
                </div>

                {comparisonResult.conflicts.length > 0 ? (
                  <div className="space-y-4">
                    {comparisonResult.conflicts.map((conf, i) => (
                      <div
                        key={i}
                        className="rounded-xl border border-[#DCE5EE] bg-[#F8F3F0] p-4 space-y-3"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-rose-700 flex items-center space-x-1.5">
                            <AlertTriangle className="h-4 w-4" />
                            <span>{conf.fieldName}</span>
                          </span>
                          <PriorityBadge priorityOrCategory="CONFLICT" label="Needs Human Review" />
                        </div>

                        <p className="text-xs text-[#3B4D63]">{conf.description}</p>

                        {/* Side by side comparison */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
                          <div className="rounded-xl border border-[#DCE5EE] bg-white p-3.5 space-y-1 shadow-sm">
                            <span className="text-[10px] font-mono text-[#64748B] uppercase font-semibold">
                              {conf.primaryDocTitle || 'Document 1'}
                            </span>
                            <p className="text-sm font-bold text-[#014BAA]">{conf.primaryValue}</p>
                            <p className="text-[10px] font-mono text-[#64748B]">
                              Source: {conf.primarySourceRef || 'Document 1'}
                            </p>
                          </div>

                          <div className="rounded-xl border border-[#DCE5EE] bg-white p-3.5 space-y-1 shadow-sm">
                            <span className="text-[10px] font-mono text-[#64748B] uppercase font-semibold">
                              {conf.conflictingDocTitle || 'Document 2'}
                            </span>
                            <p className="text-sm font-bold text-amber-700">{conf.conflictingValue}</p>
                            <p className="text-[10px] font-mono text-[#64748B]">
                              Source: {conf.conflictingSourceRef || 'Document 2'}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="py-6 text-center text-xs text-[#64748B]">
                    <CheckCircle2 className="h-6 w-6 text-emerald-600 mx-auto mb-1.5" />
                    No conflicting terms, contradictory dates, or amount discrepancies discovered between these documents.
                  </div>
                )}
              </div>

              {/* Common Information & Differences Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Common Information */}
                <div className="rounded-2xl border border-[#DCE5EE] bg-white p-6 space-y-4 royal-shadow-sm">
                  <h3 className="text-sm font-bold text-[#0B192C] font-heading flex items-center space-x-2">
                    <CheckCircle2 className="h-4 w-4 text-[#014BAA]" />
                    <span>Common Information</span>
                  </h3>
                  <div className="space-y-3">
                    {comparisonResult.commonInformation.map((comm, idx) => (
                      <div key={idx} className="rounded-xl border border-[#DCE5EE] bg-[#F8F3F0] p-3 space-y-1">
                        <p className="text-xs font-bold text-[#0B192C]">{comm.topic}</p>
                        <p className="text-xs text-[#3B4D63]">{comm.description}</p>
                        <p className="text-[10px] text-[#64748B] font-mono mt-1">
                          Shared in: {comm.sharedIn.join(', ')}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Differing Information */}
                <div className="rounded-2xl border border-[#DCE5EE] bg-white p-6 space-y-4 royal-shadow-sm">
                  <h3 className="text-sm font-bold text-[#0B192C] font-heading flex items-center space-x-2">
                    <Layers className="h-4 w-4 text-[#014BAA]" />
                    <span>Differing Information</span>
                  </h3>
                  <div className="space-y-3">
                    {comparisonResult.differingInformation.map((diff, idx) => (
                      <div key={idx} className="rounded-xl border border-[#DCE5EE] bg-[#F8F3F0] p-3 space-y-1.5">
                        <p className="text-xs font-bold text-[#0B192C]">{diff.topic}</p>
                        <div className="space-y-1 text-xs">
                          {diff.details.map((item, dIdx) => (
                            <div key={dIdx} className="flex items-center justify-between text-[#3B4D63]">
                              <span className="text-[#64748B] text-[11px] font-medium">{item.docTitle}:</span>
                              <span className="font-bold text-[#0B192C]">{item.value}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Consolidated AI Recommendations */}
              <div className="rounded-2xl border border-[#DCE5EE] bg-white p-6 space-y-4 royal-shadow-sm">
                <div className="flex items-center justify-between border-b border-[#E6DFD8] pb-3">
                  <h3 className="text-sm font-bold text-[#0B192C] font-heading">Consolidated Recommended Actions</h3>
                  <span className="text-[10px] font-bold text-[#014BAA] bg-[#EBF3FC] px-2.5 py-0.5 rounded-full border border-[#BFD7F5]">
                    AI Suggestions
                  </span>
                </div>

                <div className="space-y-3">
                  {comparisonResult.consolidatedRecommendations.map((rec, idx) => (
                    <div
                      key={idx}
                      className="rounded-xl border border-[#DCE5EE] bg-[#F8F3F0] p-4 flex items-start space-x-3 text-xs"
                    >
                      <PriorityBadge priorityOrCategory={rec.priority} className="flex-shrink-0" />
                      <div className="space-y-1">
                        <p className="font-bold text-[#0B192C]">{rec.action}</p>
                        <p className="text-[#3B4D63]">{rec.reason}</p>
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

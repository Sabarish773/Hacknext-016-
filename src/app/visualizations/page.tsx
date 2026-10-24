'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  BarChart3,
  ChevronLeft,
  ChevronRight,
  FileText,
  Info,
} from 'lucide-react';
import { Sidebar } from '@/components/layout/Sidebar';
import { Header } from '@/components/layout/Header';
import { DocumentChartRenderer } from '@/components/visualizations/DocumentChartRenderer';
import { useAuth } from '@/context/AuthContext';
import { DocumentItem } from '@/types';

export default function VisualizationsPage() {
  const { user } = useAuth();
  const [documents, setDocuments] = useState<DocumentItem[]>([]);
  const [selectedIndex, setSelectedIndex] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadDocs() {
      if (!user) return;
      try {
        const res = await fetch(`/api/documents?userId=${user.id}`);
        if (res.ok) {
          const data = await res.json();
          const docs: DocumentItem[] = data.documents || [];
          setDocuments(docs);
          if (docs.length > 0) {
            setSelectedIndex(0);
          }
        }
      } catch (err) {
        console.error('Error fetching docs for visualizations:', err);
      } finally {
        setIsLoading(false);
      }
    }
    loadDocs();
  }, [user]);

  const selectedDoc = documents[selectedIndex] || null;

  const handlePrevDoc = () => {
    if (selectedIndex > 0) setSelectedIndex(selectedIndex - 1);
  };

  const handleNextDoc = () => {
    if (selectedIndex < documents.length - 1) setSelectedIndex(selectedIndex + 1);
  };

  return (
    <div className="min-h-screen bg-[#111111] text-[#ededed] flex flex-col lg:flex-row selection:bg-[#00E5FF]/20 selection:text-[#00E5FF]">
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0">
        <Header />

        <main className="flex-1 p-6 max-w-7xl mx-auto w-full space-y-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-black text-white tracking-tight flex items-center space-x-2.5">
                <BarChart3 className="h-6 w-6 text-[#00E5FF]" />
                <span>Document Analytics & Visualizations</span>
              </h1>
              <p className="text-xs text-[#737373] mt-1">
                Data-driven charts generated strictly when quantitative series exist in the selected document.
              </p>
            </div>
          </div>

          {/* Prominent Document-Number Selector Bar */}
          <div className="rounded-2xl border border-[#262626] bg-[#161616] p-5 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <span className="text-xs font-bold uppercase tracking-wider text-[#a3a3a3]">
                Document-Number Selector (1 to {documents.length || 0})
              </span>

              {/* Stepper buttons */}
              {documents.length > 0 && (
                <div className="flex items-center space-x-2">
                  <button
                    onClick={handlePrevDoc}
                    disabled={selectedIndex <= 0}
                    className="p-1.5 rounded-lg border border-[#262626] bg-[#111111] hover:bg-[#1f1f1f] disabled:opacity-30 transition"
                    title="Previous Document"
                  >
                    <ChevronLeft className="h-4 w-4 text-[#ededed]" />
                  </button>
                  <span className="text-xs font-mono font-bold text-[#00E5FF] px-2">
                    {selectedIndex + 1} / {documents.length}
                  </span>
                  <button
                    onClick={handleNextDoc}
                    disabled={selectedIndex >= documents.length - 1}
                    className="p-1.5 rounded-lg border border-[#262626] bg-[#111111] hover:bg-[#1f1f1f] disabled:opacity-30 transition"
                    title="Next Document"
                  >
                    <ChevronRight className="h-4 w-4 text-[#ededed]" />
                  </button>
                </div>
              )}
            </div>

            {/* Document Number Bar Buttons */}
            {isLoading ? (
              <p className="text-xs text-[#737373]">Loading document library...</p>
            ) : documents.length === 0 ? (
              <div className="p-6 rounded-xl border border-dashed border-[#262626] text-center text-xs text-[#737373]">
                No documents found in your library. Please upload documents to view automated visualizations.
              </div>
            ) : (
              <div className="flex flex-wrap gap-2 pt-1">
                {documents.map((doc, idx) => {
                  const isSelected = idx === selectedIndex;
                  return (
                    <button
                      key={doc.id}
                      onClick={() => setSelectedIndex(idx)}
                      className={`flex items-center space-x-2 rounded-xl px-3.5 py-2 text-xs font-semibold border transition ${
                        isSelected
                          ? 'border-[#00E5FF] bg-[#00E5FF]/15 text-[#00E5FF] shadow-md shadow-[#00E5FF]/20 font-bold'
                          : 'border-[#262626] bg-[#111111] text-[#a3a3a3] hover:border-[#00E5FF]/30 hover:text-white'
                      }`}
                    >
                      <span className="font-mono text-xs font-bold text-[#00E5FF]">
                        Document {idx + 1}
                      </span>
                      <span className="truncate max-w-[140px] font-normal">{doc.title}</span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Visualizations for the Selected Document */}
          {selectedDoc && (
            <div className="space-y-6">
              {/* Selected Document Info Bar */}
              <div className="rounded-2xl border border-[#262626] bg-[#161616] p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-sm">
                <div className="flex items-center space-x-3">
                  <div className="h-10 w-10 rounded-xl bg-[#00E5FF]/10 border border-[#00E5FF]/25 flex items-center justify-center text-[#00E5FF] font-bold text-sm">
                    #{selectedIndex + 1}
                  </div>
                  <div>
                    <h2 className="text-sm sm:text-base font-bold text-white flex items-center space-x-2">
                      <span>{selectedDoc.title}</span>
                      <span className="rounded bg-[#1f1f1f] px-2 py-0.5 text-[10px] font-medium text-[#a3a3a3] border border-[#262626]">
                        {selectedDoc.analysis?.category || 'General'}
                      </span>
                    </h2>
                    <p className="text-xs text-[#737373] mt-0.5">
                      Visualizing quantitative metrics extracted exclusively from Document {selectedIndex + 1}
                    </p>
                  </div>
                </div>

                <Link
                  href={`/documents/${selectedDoc.id}`}
                  className="text-xs font-semibold text-[#00E5FF] hover:text-[#33EBFF] flex items-center space-x-1"
                >
                  <span>Open Intelligence Details</span>
                  <ChevronRight className="h-3.5 w-3.5" />
                </Link>
              </div>

              {/* Render Charts OR Empty State */}
              {selectedDoc.visualizations && selectedDoc.visualizations.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {selectedDoc.visualizations.map((vis) => (
                    <div
                      key={vis.id}
                      className={vis.chartType === 'kpi' ? 'md:col-span-2' : ''}
                    >
                      <DocumentChartRenderer config={vis} />
                    </div>
                  ))}
                </div>
              ) : (
                /* Non-numerical document empty state */
                <div className="rounded-3xl border border-[#262626] bg-[#161616]/70 p-12 text-center max-w-2xl mx-auto space-y-4">
                  <div className="h-14 w-14 rounded-2xl bg-[#00E5FF]/10 border border-[#00E5FF]/25 text-[#00E5FF] flex items-center justify-center mx-auto">
                    <Info className="h-7 w-7 text-[#00E5FF]" />
                  </div>
                  <h3 className="text-lg font-bold text-white">
                    No meaningful visualization available for this document.
                  </h3>
                  <p className="text-xs text-[#a3a3a3] leading-relaxed max-w-lg mx-auto">
                    Document {selectedIndex + 1} (“{selectedDoc.title}”) contains qualitative text, narrative clauses, or policy guidelines without structured numerical datasets. Doc.DOOM does not fabricate irrelevant or misleading charts.
                  </p>
                  <div className="pt-2">
                    <Link
                      href={`/documents/${selectedDoc.id}`}
                      className="inline-flex items-center space-x-1.5 rounded-xl border border-[#262626] bg-[#111111] hover:bg-[#1a1a1a] hover:border-[#00E5FF]/40 px-4 py-2 text-xs font-semibold text-[#ededed] transition"
                    >
                      <FileText className="h-3.5 w-3.5 text-[#00E5FF]" />
                      <span>Review Qualitative Findings & Facts</span>
                    </Link>
                  </div>
                </div>
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

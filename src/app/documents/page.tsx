'use client';

import React, { useEffect, useState, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import {
  Files,
  Search,
  Upload,
  Trash2,
  FileSpreadsheet,
  FileText,
  FileImage,
  Sparkles,
  ArrowRight,
} from 'lucide-react';
import { Sidebar } from '@/components/layout/Sidebar';
import { Header } from '@/components/layout/Header';
import { UploadModal } from '@/components/documents/UploadModal';
import { useAuth } from '@/context/AuthContext';
import { DocumentItem } from '@/types';

function DocumentLibraryContent() {
  const { user } = useAuth();
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get('q') || '';

  const [documents, setDocuments] = useState<DocumentItem[]>([]);
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');
  const [isLoading, setIsLoading] = useState(true);
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);

  const fetchDocuments = async () => {
    if (!user) return;
    setIsLoading(true);
    try {
      const url = `/api/documents?userId=${user.id}${searchQuery ? `&q=${encodeURIComponent(searchQuery)}` : ''}`;
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        setDocuments(data.documents || []);
      }
    } catch (err) {
      console.error('Error fetching documents:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, [user, searchQuery]);

  const handleDelete = async (docId: string, title: string) => {
    if (!confirm(`Are you sure you want to permanently delete "${title}" and all its intelligence data?`)) {
      return;
    }
    setIsDeleting(docId);
    try {
      const res = await fetch(`/api/documents/${docId}?userId=${user?.id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        setDocuments((prev) => prev.filter((d) => d.id !== docId));
      }
    } catch (err) {
      console.error('Failed to delete document:', err);
    } finally {
      setIsDeleting(null);
    }
  };

  const getFormatIcon = (mimeType: string, name: string) => {
    const ext = name.toLowerCase().split('.').pop() || '';
    if (['csv', 'xls', 'xlsx'].includes(ext)) {
      return <FileSpreadsheet className="h-6 w-6 text-[#014BAA]" />;
    }
    if (['png', 'jpg', 'jpeg'].includes(ext)) {
      return <FileImage className="h-6 w-6 text-[#0D6EFD]" />;
    }
    return <FileText className="h-6 w-6 text-[#014BAA]" />;
  };

  const categories = Array.from(
    new Set(documents.map((d) => d.analysis?.category || 'General').filter(Boolean))
  );

  const filteredDocs = documents.filter((doc) => {
    const matchesCat = selectedCategory === 'ALL' || (doc.analysis?.category || 'General') === selectedCategory;
    const matchesStatus = selectedStatus === 'ALL' || doc.status === selectedStatus;
    return matchesCat && matchesStatus;
  });

  return (
    <div className="min-h-screen bg-[#F8F3F0] text-[#0B192C] flex flex-col lg:flex-row selection:bg-[#014BAA]/15 selection:text-[#014BAA]">
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0">
        <Header onOpenUpload={() => setIsUploadOpen(true)} />

        <main className="flex-1 p-6 max-w-7xl mx-auto w-full space-y-6">
          {/* Top Bar with Search & Filters */}
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-[#0B192C] tracking-tight flex items-center space-x-2.5 font-heading">
                <Files className="h-6 w-6 text-[#014BAA]" />
                <span>Enterprise Document Library</span>
              </h1>
              <p className="text-xs text-[#64748B] mt-1">
                Persistent storage, multi-document intelligence, and cognitive analysis
              </p>
            </div>

            <div className="flex items-center space-x-3 w-full md:w-auto">
              {/* Category Filter */}
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="rounded-xl border border-[#DCE5EE] bg-white px-3 py-2 text-xs font-semibold text-[#0B192C] focus:outline-none focus:border-[#014BAA] shadow-sm"
              >
                <option value="ALL">All Categories ({documents.length})</option>
                {categories.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>

              {/* Status Filter */}
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="rounded-xl border border-[#DCE5EE] bg-white px-3 py-2 text-xs font-semibold text-[#0B192C] focus:outline-none focus:border-[#014BAA] shadow-sm"
              >
                <option value="ALL">All Statuses</option>
                <option value="COMPLETED">Completed</option>
                <option value="ANALYSING">Analysing</option>
                <option value="PROCESSING">Processing</option>
                <option value="FAILED">Failed</option>
              </select>

              {/* Upload CTA */}
              <button
                onClick={() => setIsUploadOpen(true)}
                className="flex items-center space-x-1.5 rounded-xl bg-[#014BAA] hover:bg-[#013C88] active:bg-[#012E69] px-4 py-2 text-xs font-bold text-white shadow-md shadow-[#014BAA]/20 transition flex-shrink-0"
              >
                <Upload className="h-3.5 w-3.5 text-white" />
                <span>Upload</span>
              </button>
            </div>
          </div>

          {/* Quick search bar inside library */}
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#64748B]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by title, extracted facts, entity names, or missing information..."
              className="w-full rounded-2xl border border-[#DCE5EE] bg-white py-2.5 pl-10 pr-4 text-xs sm:text-sm text-[#0B192C] placeholder-[#94A3B8] focus:border-[#014BAA] focus:outline-none focus:ring-1 focus:ring-[#014BAA] shadow-sm"
            />
          </div>

          {/* Documents Grid */}
          {isLoading ? (
            <div className="py-24 text-center text-[#64748B] space-y-2">
              <Sparkles className="h-6 w-6 animate-spin mx-auto text-[#014BAA]" />
              <p className="text-xs">Synchronizing document intelligence repository...</p>
            </div>
          ) : filteredDocs.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-[#DCE5EE] bg-white p-12 text-center max-w-xl mx-auto space-y-3 royal-shadow-sm">
              <div className="h-12 w-12 rounded-2xl bg-[#EBF3FC] text-[#014BAA] flex items-center justify-center mx-auto border border-[#BFD7F5]">
                <Files className="h-6 w-6" />
              </div>
              <h3 className="text-base font-bold text-[#0B192C] font-heading">No documents matched your filter</h3>
              <p className="text-xs text-[#3B4D63] leading-relaxed">
                Upload your contracts, financial sheets, invoices, or policies to initiate Doc.DOOM cognitive intelligence.
              </p>
              <button
                onClick={() => setIsUploadOpen(true)}
                className="mt-3 inline-flex items-center space-x-2 rounded-xl bg-[#014BAA] hover:bg-[#013C88] px-4 py-2 text-xs font-bold text-white transition shadow-sm"
              >
                <Upload className="h-4 w-4 text-white" />
                <span>Upload Documents</span>
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredDocs.map((doc, idx) => (
                <div
                  key={doc.id}
                  className="rounded-2xl border border-[#DCE5EE] bg-white hover:border-[#014BAA]/40 p-5 flex flex-col justify-between transition group royal-shadow-sm hover:shadow-md"
                >
                  <div>
                    {/* Header */}
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="p-2.5 rounded-xl bg-[#F8F3F0] border border-[#DCE5EE] flex-shrink-0">
                          {getFormatIcon(doc.mimeType, doc.originalName)}
                        </div>
                        <div>
                          <span className="text-[10px] font-mono text-[#014BAA] font-bold tracking-wider">
                            DOCUMENT {doc.docNumber || idx + 1}
                          </span>
                          <h3 className="text-sm font-bold text-[#0B192C] line-clamp-1 group-hover:text-[#014BAA] transition font-heading">
                            {doc.title}
                          </h3>
                        </div>
                      </div>

                      <button
                        onClick={() => handleDelete(doc.id, doc.title)}
                        disabled={isDeleting === doc.id}
                        className="text-[#64748B] hover:text-red-600 p-1.5 rounded-lg hover:bg-red-50 transition"
                        title="Delete document and analysis"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>

                    {/* Category & Status */}
                    <div className="mt-4 flex items-center space-x-2">
                      <span className="rounded-md bg-[#F8F3F0] px-2 py-0.5 text-[10px] font-semibold text-[#3B4D63] border border-[#DCE5EE]">
                        {doc.analysis?.category || 'General'}
                      </span>
                      <span
                        className={`rounded-md px-2 py-0.5 text-[10px] font-bold border ${
                          doc.status === 'COMPLETED'
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                            : doc.status === 'FAILED'
                            ? 'bg-red-50 text-red-800 border-red-300'
                            : 'bg-[#EBF3FC] text-[#014BAA] border-[#BFD7F5]'
                        }`}
                      >
                        {doc.status}
                      </span>
                    </div>

                    {/* Short Summary */}
                    <p className="mt-3 text-xs text-[#3B4D63] line-clamp-2 leading-relaxed">
                      {doc.analysis?.shortSummary || 'Document text extracted. Cognitive analysis pending.'}
                    </p>

                    {/* Intelligence Badges */}
                    <div className="mt-4 pt-3 border-t border-[#E6DFD8] flex flex-wrap gap-2 text-[11px]">
                      <span className="text-[#3B4D63]">
                        <strong className="text-[#0B192C]">{doc.entities?.length || 0}</strong> entities
                      </span>
                      <span className="text-[#94A3B8]">•</span>
                      <span className="text-[#3B4D63]">
                        <strong className="text-[#0B192C]">{doc.insights?.length || 0}</strong> insights
                      </span>
                      {doc.missingInformation && doc.missingInformation.length > 0 && (
                        <>
                          <span className="text-[#94A3B8]">•</span>
                          <span className="text-purple-700 font-bold">
                            {doc.missingInformation.length} missing gaps
                          </span>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="mt-5 pt-3 border-t border-[#E6DFD8] flex items-center justify-between">
                    <span className="text-[10px] font-mono font-semibold text-[#64748B]">
                      {(doc.fileSizeBytes / 1024).toFixed(0)} KB • {doc.pageCount || 1} pg
                    </span>

                    <Link
                      href={`/documents/${doc.id}`}
                      className="flex items-center space-x-1 text-xs font-bold text-[#014BAA] hover:text-[#013C88] group-hover:translate-x-0.5 transition"
                    >
                      <span>Open Intelligence</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>

      <UploadModal
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
        onUploadSuccess={fetchDocuments}
      />
    </div>
  );
}

export default function DocumentLibraryPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#F8F3F0] flex items-center justify-center text-[#64748B] text-xs">
          Loading Document Library...
        </div>
      }
    >
      <DocumentLibraryContent />
    </Suspense>
  );
}

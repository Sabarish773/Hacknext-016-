'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Files,
  FileCheck2,
  AlertTriangle,
  GitCompare,
  Calendar,
  Clock,
  ArrowUpRight,
  Upload,
  Sparkles,
  ChevronRight,
} from 'lucide-react';
import { Sidebar } from '@/components/layout/Sidebar';
import { Header } from '@/components/layout/Header';
import { UploadModal } from '@/components/documents/UploadModal';
import { PriorityBadge } from '@/components/common/PriorityBadge';
import { useAuth } from '@/context/AuthContext';
import { DashboardStats } from '@/types';

export default function DashboardPage() {
  const { user } = useAuth();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploadOpen, setIsUploadOpen] = useState(false);

  const fetchStats = async () => {
    if (!user) return;
    try {
      const res = await fetch(`/api/dashboard/stats?userId=${user.id}`);
      if (res.ok) {
        const data = await res.json();
        setStats(data.stats);
      }
    } catch (err) {
      console.error('Error fetching dashboard stats:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, [user]);

  return (
    <div className="min-h-screen bg-[#111111] text-[#ededed] flex flex-col lg:flex-row selection:bg-[#00E5FF]/20 selection:text-[#00E5FF]">
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0">
        <Header onOpenUpload={() => setIsUploadOpen(true)} />

        <main className="flex-1 p-6 max-w-7xl mx-auto w-full space-y-6">
          {/* Welcome Banner */}
          <div className="rounded-3xl border border-[#262626] bg-gradient-to-r from-[#161616] via-[#161616] to-[#00E5FF]/10 p-6 md:p-8 relative overflow-hidden cyan-glow">
            <div className="max-w-2xl relative z-10">
              <div className="inline-flex items-center space-x-2 rounded-full border border-[#00E5FF]/30 bg-[#00E5FF]/10 px-3 py-1 text-xs font-semibold text-[#00E5FF] mb-3">
                <Sparkles className="h-3.5 w-3.5" />
                <span>Doc.DOOM Information Intelligence Active</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                Welcome back, {user?.name || 'Enterprise Analyst'}
              </h1>
              <p className="mt-2 text-sm text-[#a3a3a3] leading-relaxed">
                Repository status is synchronized. Upload multiple files across PDF, DOCX, CSV, Excel, and images to automatically discover structured facts, detect missing information, and resolve cross-document conflicts.
              </p>
              <div className="mt-5 flex items-center space-x-3">
                <button
                  onClick={() => setIsUploadOpen(true)}
                  className="flex items-center space-x-2 rounded-xl bg-[#00E5FF] hover:bg-[#33EBFF] active:bg-[#00B4CC] px-4 py-2 text-xs font-bold text-[#111111] shadow-lg shadow-[#00E5FF]/20 transition"
                >
                  <Upload className="h-3.5 w-3.5 text-[#111111]" />
                  <span>Upload Documents</span>
                </button>
                <Link
                  href="/compare"
                  className="flex items-center space-x-1.5 rounded-xl border border-[#262626] bg-[#111111] hover:bg-[#1f1f1f] hover:border-[#00E5FF]/40 px-4 py-2 text-xs font-semibold text-[#ededed] transition"
                >
                  <GitCompare className="h-3.5 w-3.5 text-[#00E5FF]" />
                  <span>Compare Documents</span>
                </Link>
              </div>
            </div>
          </div>

          {/* KPI Metric Cards */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div className="rounded-2xl border border-[#262626] bg-[#161616] p-4 hover:border-[#00E5FF]/40 transition">
              <div className="flex items-center justify-between text-[#737373] mb-2">
                <span className="text-xs font-medium">Total Docs</span>
                <Files className="h-4 w-4 text-[#00E5FF]" />
              </div>
              <p className="text-2xl font-black text-white">{stats?.totalDocuments ?? 0}</p>
              <p className="text-[11px] text-[#737373] mt-1">Stored permanently</p>
            </div>

            <div className="rounded-2xl border border-[#262626] bg-[#161616] p-4 hover:border-[#00E5FF]/40 transition">
              <div className="flex items-center justify-between text-[#737373] mb-2">
                <span className="text-xs font-medium">Processed</span>
                <FileCheck2 className="h-4 w-4 text-[#00E5FF]" />
              </div>
              <p className="text-2xl font-black text-[#00E5FF]">{stats?.documentsProcessed ?? 0}</p>
              <p className="text-[11px] text-[#737373] mt-1">Cognitive pipeline ready</p>
            </div>

            <div className="rounded-2xl border border-[#262626] bg-[#161616] p-4 hover:border-[#00E5FF]/40 transition">
              <div className="flex items-center justify-between text-[#737373] mb-2">
                <span className="text-xs font-medium">Needs Review</span>
                <AlertTriangle className="h-4 w-4 text-amber-400" />
              </div>
              <p className="text-2xl font-black text-amber-400">{stats?.documentsNeedingReview ?? 0}</p>
              <p className="text-[11px] text-[#737373] mt-1">Gaps or warnings</p>
            </div>

            <div className="rounded-2xl border border-[#262626] bg-[#161616] p-4 hover:border-[#00E5FF]/40 transition">
              <div className="flex items-center justify-between text-[#737373] mb-2">
                <span className="text-xs font-medium">Missing Info</span>
                <AlertTriangle className="h-4 w-4 text-[#00E5FF]" />
              </div>
              <p className="text-2xl font-black text-[#00E5FF]">{stats?.missingInformationCount ?? 0}</p>
              <p className="text-[11px] text-[#737373] mt-1">Identified gaps</p>
            </div>

            <div className="col-span-2 md:col-span-1 rounded-2xl border border-[#262626] bg-[#161616] p-4 hover:border-[#00E5FF]/40 transition">
              <div className="flex items-center justify-between text-[#737373] mb-2">
                <span className="text-xs font-medium">Conflicts</span>
                <GitCompare className="h-4 w-4 text-rose-400" />
              </div>
              <p className="text-2xl font-black text-rose-400">{stats?.potentialConflicts ?? 0}</p>
              <p className="text-[11px] text-[#737373] mt-1">Needs Human Review</p>
            </div>
          </div>

          {/* Two-Column Layout: Upcoming Deadlines & Recent Activity */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Upcoming Deadlines (2 cols) */}
            <div className="lg:col-span-2 rounded-2xl border border-[#262626] bg-[#161616] p-6 space-y-4">
              <div className="flex items-center justify-between border-b border-[#262626] pb-4">
                <div className="flex items-center space-x-2.5">
                  <Calendar className="h-5 w-5 text-[#00E5FF]" />
                  <h3 className="text-base font-bold text-white">Critical Deadlines & Key Dates</h3>
                </div>
                <span className="text-xs text-[#737373]">Extracted from source docs</span>
              </div>

              {stats?.upcomingDeadlines && stats.upcomingDeadlines.length > 0 ? (
                <div className="space-y-3">
                  {stats.upcomingDeadlines.slice(0, 4).map((d, idx) => (
                    <div
                      key={idx}
                      className="flex items-start justify-between p-3.5 rounded-xl border border-[#262626] bg-[#111111] hover:border-[#00E5FF]/30 transition"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2">
                          <PriorityBadge priorityOrCategory="DEADLINE" label={d.deadline} />
                          <span className="text-xs font-semibold text-white">{d.docTitle}</span>
                        </div>
                        <p className="text-xs text-[#a3a3a3]">{d.description}</p>
                      </div>
                      <span className="text-[10px] font-mono text-[#a3a3a3] bg-[#181818] border border-[#262626] px-2 py-1 rounded">
                        {d.sourceRef}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-8 text-center text-[#737373] text-xs">
                  No upcoming deadlines detected yet. Upload agreements, invoices, or reports to extract milestone schedules.
                </div>
              )}
            </div>

            {/* Recent Activity Log (1 col) */}
            <div className="rounded-2xl border border-[#262626] bg-[#161616] p-6 space-y-4">
              <div className="flex items-center justify-between border-b border-[#262626] pb-4">
                <div className="flex items-center space-x-2.5">
                  <Clock className="h-5 w-5 text-[#00E5FF]" />
                  <h3 className="text-base font-bold text-white">Audit Activity</h3>
                </div>
              </div>

              {stats?.recentActivities && stats.recentActivities.length > 0 ? (
                <div className="space-y-3">
                  {stats.recentActivities.map((act) => (
                    <div key={act.id} className="flex items-start space-x-3 text-xs">
                      <div className="h-2 w-2 rounded-full bg-[#00E5FF] mt-1.5 flex-shrink-0 shadow-[0_0_8px_#00E5FF]" />
                      <div className="truncate">
                        <p className="font-semibold text-white truncate">{act.action}</p>
                        <p className="text-[11px] text-[#737373] truncate">{act.docTitle}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-8 text-center text-[#737373] text-xs">
                  No activity recorded yet.
                </div>
              )}
            </div>
          </div>

          {/* Recent Documents Table */}
          <div className="rounded-2xl border border-[#262626] bg-[#161616] p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-[#262626] pb-4">
              <h3 className="text-base font-bold text-white">Recent Documents</h3>
              <Link
                href="/documents"
                className="text-xs font-semibold text-[#00E5FF] hover:text-[#33EBFF] flex items-center space-x-1"
              >
                <span>View Full Library</span>
                <ChevronRight className="h-4 w-4" />
              </Link>
            </div>

            {stats?.recentDocuments && stats.recentDocuments.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-[#262626] text-[#737373]">
                      <th className="pb-3 font-semibold">#</th>
                      <th className="pb-3 font-semibold">Document Title</th>
                      <th className="pb-3 font-semibold">Category</th>
                      <th className="pb-3 font-semibold">Status</th>
                      <th className="pb-3 font-semibold">Entities</th>
                      <th className="pb-3 font-semibold">Missing Info</th>
                      <th className="pb-3 font-semibold text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#262626]/60">
                    {stats.recentDocuments.map((doc, idx) => (
                      <tr key={doc.id} className="hover:bg-[#1a1a1a] transition">
                        <td className="py-3.5 font-mono text-[#00E5FF] font-bold">Doc {doc.docNumber || idx + 1}</td>
                        <td className="py-3.5 font-semibold text-white truncate max-w-xs">{doc.title}</td>
                        <td className="py-3.5 text-[#a3a3a3]">{doc.analysis?.category || 'General'}</td>
                        <td className="py-3.5">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-semibold border ${
                              doc.status === 'COMPLETED'
                                ? 'bg-emerald-950/60 text-emerald-400 border-emerald-800/60'
                                : doc.status === 'FAILED'
                                ? 'bg-red-950/60 text-red-400 border-red-800/60'
                                : 'bg-[#00E5FF]/10 text-[#00E5FF] border-[#00E5FF]/30'
                            }`}
                          >
                            {doc.status}
                          </span>
                        </td>
                        <td className="py-3.5 text-[#a3a3a3]">{doc.entities?.length || 0} discovered</td>
                        <td className="py-3.5">
                          {doc.missingInformation && doc.missingInformation.length > 0 ? (
                            <span className="text-[#00E5FF] font-medium">
                              {doc.missingInformation.length} flagged
                            </span>
                          ) : (
                            <span className="text-[#737373]">None detected</span>
                          )}
                        </td>
                        <td className="py-3.5 text-right">
                          <Link
                            href={`/documents/${doc.id}`}
                            className="inline-flex items-center space-x-1 text-[#00E5FF] hover:text-[#33EBFF] font-semibold"
                          >
                            <span>Open Intelligence</span>
                            <ArrowUpRight className="h-3.5 w-3.5" />
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="py-12 text-center text-[#737373] text-xs">
                No documents uploaded yet. Click <strong>Upload Documents</strong> above to begin cognitive analysis.
              </div>
            )}
          </div>
        </main>
      </div>

      <UploadModal
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
        onUploadSuccess={fetchStats}
      />
    </div>
  );
}

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
    <div className="min-h-screen bg-[#F8F3F0] text-[#0B192C] flex flex-col lg:flex-row selection:bg-[#014BAA]/15 selection:text-[#014BAA]">
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0">
        <Header onOpenUpload={() => setIsUploadOpen(true)} />

        <main className="flex-1 p-6 max-w-7xl mx-auto w-full space-y-6">
          {/* Welcome Banner */}
          <div className="rounded-3xl border border-[#DCE5EE] bg-gradient-to-r from-white via-white to-[#EBF3FC] p-6 md:p-8 relative overflow-hidden royal-shadow-md">
            <div className="max-w-2xl relative z-10">
              <div className="inline-flex items-center space-x-2 rounded-full border border-[#BFD7F5] bg-[#EBF3FC] px-3 py-1 text-xs font-semibold text-[#014BAA] mb-3 royal-shadow-sm">
                <Sparkles className="h-3.5 w-3.5" />
                <span>Doc.DOOM Information Intelligence Active</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold text-[#0B192C] tracking-tight font-heading">
                Welcome back, {user?.name || 'Enterprise Analyst'}
              </h1>
              <p className="mt-2 text-sm text-[#3B4D63] leading-relaxed">
                Repository status is synchronized. Upload multiple files across PDF, DOCX, CSV, Excel, and images to automatically discover structured facts, detect missing information, and resolve cross-document conflicts.
              </p>
              <div className="mt-5 flex items-center space-x-3">
                <button
                  onClick={() => setIsUploadOpen(true)}
                  className="flex items-center space-x-2 rounded-xl bg-[#014BAA] hover:bg-[#013C88] active:bg-[#012E69] px-4 py-2 text-xs font-bold text-white shadow-md shadow-[#014BAA]/20 transition"
                >
                  <Upload className="h-3.5 w-3.5 text-white" />
                  <span>Upload Documents</span>
                </button>
                <Link
                  href="/compare"
                  className="flex items-center space-x-1.5 rounded-xl border border-[#DCE5EE] bg-white hover:bg-[#F2F7FD] hover:border-[#014BAA]/40 px-4 py-2 text-xs font-semibold text-[#0B192C] shadow-sm transition"
                >
                  <GitCompare className="h-3.5 w-3.5 text-[#014BAA]" />
                  <span>Compare Documents</span>
                </Link>
              </div>
            </div>
          </div>

          {/* KPI Metric Cards */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div className="rounded-2xl border border-[#DCE5EE] bg-white p-4 hover:border-[#014BAA]/40 transition royal-shadow-sm">
              <div className="flex items-center justify-between text-[#64748B] mb-2">
                <span className="text-xs font-semibold">Total Docs</span>
                <Files className="h-4 w-4 text-[#014BAA]" />
              </div>
              <p className="text-2xl font-bold text-[#0B192C] font-heading">{stats?.totalDocuments ?? 0}</p>
              <p className="text-[11px] text-[#64748B] mt-1">Stored permanently</p>
            </div>

            <div className="rounded-2xl border border-[#DCE5EE] bg-white p-4 hover:border-[#014BAA]/40 transition royal-shadow-sm">
              <div className="flex items-center justify-between text-[#64748B] mb-2">
                <span className="text-xs font-semibold">Processed</span>
                <FileCheck2 className="h-4 w-4 text-[#014BAA]" />
              </div>
              <p className="text-2xl font-bold text-[#014BAA] font-heading">{stats?.documentsProcessed ?? 0}</p>
              <p className="text-[11px] text-[#64748B] mt-1">Cognitive pipeline ready</p>
            </div>

            <div className="rounded-2xl border border-[#DCE5EE] bg-white p-4 hover:border-[#014BAA]/40 transition royal-shadow-sm">
              <div className="flex items-center justify-between text-[#64748B] mb-2">
                <span className="text-xs font-semibold">Needs Review</span>
                <AlertTriangle className="h-4 w-4 text-amber-600" />
              </div>
              <p className="text-2xl font-bold text-amber-600 font-heading">{stats?.documentsNeedingReview ?? 0}</p>
              <p className="text-[11px] text-[#64748B] mt-1">Gaps or warnings</p>
            </div>

            <div className="rounded-2xl border border-[#DCE5EE] bg-white p-4 hover:border-[#014BAA]/40 transition royal-shadow-sm">
              <div className="flex items-center justify-between text-[#64748B] mb-2">
                <span className="text-xs font-semibold">Missing Info</span>
                <AlertTriangle className="h-4 w-4 text-purple-600" />
              </div>
              <p className="text-2xl font-bold text-purple-700 font-heading">{stats?.missingInformationCount ?? 0}</p>
              <p className="text-[11px] text-[#64748B] mt-1">Identified gaps</p>
            </div>

            <div className="col-span-2 md:col-span-1 rounded-2xl border border-[#DCE5EE] bg-white p-4 hover:border-[#014BAA]/40 transition royal-shadow-sm">
              <div className="flex items-center justify-between text-[#64748B] mb-2">
                <span className="text-xs font-semibold">Conflicts</span>
                <GitCompare className="h-4 w-4 text-rose-600" />
              </div>
              <p className="text-2xl font-bold text-rose-600 font-heading">{stats?.potentialConflicts ?? 0}</p>
              <p className="text-[11px] text-[#64748B] mt-1">Needs Human Review</p>
            </div>
          </div>

          {/* Two-Column Layout: Upcoming Deadlines & Recent Activity */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Upcoming Deadlines (2 cols) */}
            <div className="lg:col-span-2 rounded-2xl border border-[#DCE5EE] bg-white p-6 space-y-4 royal-shadow-sm">
              <div className="flex items-center justify-between border-b border-[#E6DFD8] pb-4">
                <div className="flex items-center space-x-2.5">
                  <Calendar className="h-5 w-5 text-[#014BAA]" />
                  <h3 className="text-base font-bold text-[#0B192C] font-heading">Critical Deadlines &amp; Key Dates</h3>
                </div>
                <span className="text-xs text-[#64748B]">Extracted from source docs</span>
              </div>

              {stats?.upcomingDeadlines && stats.upcomingDeadlines.length > 0 ? (
                <div className="space-y-3">
                  {stats.upcomingDeadlines.slice(0, 4).map((d, idx) => (
                    <div
                      key={idx}
                      className="flex items-start justify-between p-3.5 rounded-xl border border-[#DCE5EE] bg-[#F8F3F0] hover:border-[#014BAA]/30 transition"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2">
                          <PriorityBadge priorityOrCategory="DEADLINE" label={d.deadline} />
                          <span className="text-xs font-bold text-[#0B192C]">{d.docTitle}</span>
                        </div>
                        <p className="text-xs text-[#3B4D63]">{d.description}</p>
                      </div>
                      <span className="text-[10px] font-mono font-semibold text-[#014BAA] bg-white border border-[#BFD7F5] px-2 py-1 rounded">
                        {d.sourceRef}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-8 text-center text-[#64748B] text-xs">
                  No upcoming deadlines detected yet. Upload agreements, invoices, or reports to extract milestone schedules.
                </div>
              )}
            </div>

            {/* Recent Activity Log (1 col) */}
            <div className="rounded-2xl border border-[#DCE5EE] bg-white p-6 space-y-4 royal-shadow-sm">
              <div className="flex items-center justify-between border-b border-[#E6DFD8] pb-4">
                <div className="flex items-center space-x-2.5">
                  <Clock className="h-5 w-5 text-[#014BAA]" />
                  <h3 className="text-base font-bold text-[#0B192C] font-heading">Audit Activity</h3>
                </div>
              </div>

              {stats?.recentActivities && stats.recentActivities.length > 0 ? (
                <div className="space-y-3">
                  {stats.recentActivities.map((act) => (
                    <div key={act.id} className="flex items-start space-x-3 text-xs">
                      <div className="h-2 w-2 rounded-full bg-[#014BAA] mt-1.5 flex-shrink-0" />
                      <div className="truncate">
                        <p className="font-bold text-[#0B192C] truncate">{act.action}</p>
                        <p className="text-[11px] text-[#64748B] truncate">{act.docTitle}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-8 text-center text-[#64748B] text-xs">
                  No activity recorded yet.
                </div>
              )}
            </div>
          </div>

          {/* Recent Documents Table */}
          <div className="rounded-2xl border border-[#DCE5EE] bg-white p-6 space-y-4 royal-shadow-sm">
            <div className="flex items-center justify-between border-b border-[#E6DFD8] pb-4">
              <h3 className="text-base font-bold text-[#0B192C] font-heading">Recent Documents</h3>
              <Link
                href="/documents"
                className="text-xs font-bold text-[#014BAA] hover:text-[#013C88] flex items-center space-x-1"
              >
                <span>View Full Library</span>
                <ChevronRight className="h-4 w-4" />
              </Link>
            </div>

            {stats?.recentDocuments && stats.recentDocuments.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-[#E6DFD8] text-[#64748B]">
                      <th className="pb-3 font-semibold">#</th>
                      <th className="pb-3 font-semibold">Document Title</th>
                      <th className="pb-3 font-semibold">Category</th>
                      <th className="pb-3 font-semibold">Status</th>
                      <th className="pb-3 font-semibold">Entities</th>
                      <th className="pb-3 font-semibold">Missing Info</th>
                      <th className="pb-3 font-semibold text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E6DFD8]">
                    {stats.recentDocuments.map((doc, idx) => (
                      <tr key={doc.id} className="hover:bg-[#F8F3F0] transition">
                        <td className="py-3.5 font-mono text-[#014BAA] font-bold">Doc {doc.docNumber || idx + 1}</td>
                        <td className="py-3.5 font-bold text-[#0B192C] truncate max-w-xs">{doc.title}</td>
                        <td className="py-3.5 text-[#3B4D63]">{doc.analysis?.category || 'General'}</td>
                        <td className="py-3.5">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                              doc.status === 'COMPLETED'
                                ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                                : doc.status === 'FAILED'
                                ? 'bg-red-50 text-red-800 border-red-300'
                                : 'bg-[#EBF3FC] text-[#014BAA] border-[#BFD7F5]'
                            }`}
                          >
                            {doc.status}
                          </span>
                        </td>
                        <td className="py-3.5 text-[#3B4D63]">{doc.entities?.length || 0} discovered</td>
                        <td className="py-3.5">
                          {doc.missingInformation && doc.missingInformation.length > 0 ? (
                            <span className="text-purple-700 font-semibold">
                              {doc.missingInformation.length} flagged
                            </span>
                          ) : (
                            <span className="text-[#64748B]">None detected</span>
                          )}
                        </td>
                        <td className="py-3.5 text-right">
                          <Link
                            href={`/documents/${doc.id}`}
                            className="inline-flex items-center space-x-1 text-[#014BAA] hover:text-[#013C88] font-bold"
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
              <div className="py-12 text-center text-[#64748B] text-xs">
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

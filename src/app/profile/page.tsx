'use client';

import React, { useState, useEffect } from 'react';
import {
  User as UserIcon,
  Mail,
  Building,
  GraduationCap,
  Briefcase,
  MapPin,
  Calendar,
  Save,
  CheckCircle2,
  Sparkles,
  ShieldCheck,
} from 'lucide-react';
import { Sidebar } from '@/components/layout/Sidebar';
import { Header } from '@/components/layout/Header';
import { useAuth } from '@/context/AuthContext';
import { UserProfile } from '@/types';

export default function ProfilePage() {
  const { user, profile, updateProfile } = useAuth();

  const [formData, setFormData] = useState<Partial<UserProfile>>({
    school: '',
    college: '',
    degree: '',
    currentStatus: 'employed',
    company: '',
    role: '',
    location: '',
    bio: '',
    dob: '',
  });

  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    if (profile) {
      setFormData({
        school: profile.school || '',
        college: profile.college || '',
        degree: profile.degree || '',
        currentStatus: profile.currentStatus || 'employed',
        company: profile.company || '',
        role: profile.role || '',
        location: profile.location || '',
        bio: profile.bio || '',
        dob: profile.dob || '',
      });
    }
  }, [profile]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSaveSuccess(false);
    try {
      await updateProfile(formData);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      console.error('Failed to save profile:', err);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col lg:flex-row">
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0">
        <Header />

        <main className="flex-1 p-6 max-w-4xl mx-auto w-full space-y-6">
          {/* Header */}
          <div>
            <h1 className="text-2xl font-black text-white tracking-tight flex items-center space-x-2.5">
              <UserIcon className="h-6 w-6 text-blue-400" />
              <span>User Profile & Credentials</span>
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Manage your personal credentials, education, and institutional affiliations.
            </p>
          </div>

          {/* Account Details Box */}
          <div className="rounded-3xl border border-slate-800 bg-slate-900/90 p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center space-x-4">
              <div className="relative h-16 w-16 rounded-2xl overflow-hidden bg-slate-800 border-2 border-slate-700 flex-shrink-0 shadow-lg">
                {user?.avatarUrl ? (
                  <img src={user.avatarUrl} alt={user.name || 'User'} className="h-full w-full object-cover" />
                ) : (
                  <div className="h-full w-full flex items-center justify-center font-bold text-lg text-blue-400 bg-blue-900/30">
                    {(user?.name || 'U')[0].toUpperCase()}
                  </div>
                )}
              </div>
              <div>
                <h2 className="text-lg font-bold text-white">{user?.name || 'Enterprise User'}</h2>
                <div className="flex items-center space-x-2 text-xs text-slate-400 mt-0.5">
                  <Mail className="h-3.5 w-3.5 text-blue-400" />
                  <span>{user?.email}</span>
                  <span className="rounded bg-blue-500/10 px-2 py-0.5 text-[10px] font-semibold text-blue-400 border border-blue-500/20">
                    Google OAuth Managed
                  </span>
                </div>
              </div>
            </div>

            <div className="rounded-xl bg-slate-950 p-3 text-right">
              <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                Account Status
              </span>
              <p className="text-xs font-bold text-emerald-400 mt-0.5 flex items-center space-x-1 sm:justify-end">
                <CheckCircle2 className="h-3.5 w-3.5" />
                <span>Verified Enterprise Seat</span>
              </p>
            </div>
          </div>

          {/* Editable Personal Profile Form */}
          <form onSubmit={handleSubmit} className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6 md:p-8 space-y-6">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div>
                <h3 className="text-base font-bold text-white">Institutional & Career Profile</h3>
                <p className="text-xs text-slate-400">Complete these details to contextualize enterprise document access.</p>
              </div>

              {saveSuccess && (
                <span className="flex items-center space-x-1 text-xs font-semibold text-emerald-400 bg-emerald-950/60 px-3 py-1 rounded-lg border border-emerald-800/60">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  <span>Saved Successfully</span>
                </span>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-xs">
              {/* Current Status */}
              <div>
                <label className="block font-semibold text-slate-300 mb-1.5">Current Status</label>
                <select
                  value={formData.currentStatus || 'employed'}
                  onChange={(e) => setFormData({ ...formData, currentStatus: e.target.value })}
                  className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3.5 py-2.5 text-slate-200 focus:outline-none focus:border-blue-500"
                >
                  <option value="employed">Employed / Working Professional</option>
                  <option value="student">Student / Academic</option>
                  <option value="self-employed">Self-Employed / Founder</option>
                  <option value="researcher">Researcher / Fellow</option>
                  <option value="other">Other</option>
                </select>
              </div>

              {/* Date of Birth */}
              <div>
                <label className="block font-semibold text-slate-300 mb-1.5">
                  Date of Birth <span className="text-slate-400 font-normal">(Optional)</span>
                </label>
                <input
                  type="date"
                  value={formData.dob || ''}
                  onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
                  className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3.5 py-2.5 text-slate-200 focus:outline-none focus:border-blue-500"
                />
              </div>

              {/* School / Higher Secondary */}
              <div>
                <label className="block font-semibold text-slate-300 mb-1.5">
                  School / Higher-Secondary Institution
                </label>
                <input
                  type="text"
                  placeholder="e.g. National Public School"
                  value={formData.school || ''}
                  onChange={(e) => setFormData({ ...formData, school: e.target.value })}
                  className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3.5 py-2.5 text-slate-200 focus:outline-none focus:border-blue-500"
                />
              </div>

              {/* College / University */}
              <div>
                <label className="block font-semibold text-slate-300 mb-1.5">
                  College / University
                </label>
                <input
                  type="text"
                  placeholder="e.g. Indian Institute of Technology / Stanford"
                  value={formData.college || ''}
                  onChange={(e) => setFormData({ ...formData, college: e.target.value })}
                  className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3.5 py-2.5 text-slate-200 focus:outline-none focus:border-blue-500"
                />
              </div>

              {/* Degree / Department */}
              <div>
                <label className="block font-semibold text-slate-300 mb-1.5">
                  Degree, Department, or Field of Study
                </label>
                <input
                  type="text"
                  placeholder="e.g. B.Tech Computer Science & AI"
                  value={formData.degree || ''}
                  onChange={(e) => setFormData({ ...formData, degree: e.target.value })}
                  className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3.5 py-2.5 text-slate-200 focus:outline-none focus:border-blue-500"
                />
              </div>

              {/* Company / Organization */}
              <div>
                <label className="block font-semibold text-slate-300 mb-1.5">
                  Company / Organization <span className="text-slate-400 font-normal">(Optional)</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. Acme Enterprise / Doc.DOOM Labs"
                  value={formData.company || ''}
                  onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                  className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3.5 py-2.5 text-slate-200 focus:outline-none focus:border-blue-500"
                />
              </div>

              {/* Job Title / Role */}
              <div>
                <label className="block font-semibold text-slate-300 mb-1.5">
                  Job Title / Role <span className="text-slate-400 font-normal">(Optional)</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. Lead Full-Stack AI Engineer"
                  value={formData.role || ''}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3.5 py-2.5 text-slate-200 focus:outline-none focus:border-blue-500"
                />
              </div>

              {/* Location */}
              <div>
                <label className="block font-semibold text-slate-300 mb-1.5">
                  Location <span className="text-slate-400 font-normal">(Optional)</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. Bengaluru / San Francisco"
                  value={formData.location || ''}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3.5 py-2.5 text-slate-200 focus:outline-none focus:border-blue-500"
                />
              </div>

              {/* Bio */}
              <div className="md:col-span-2">
                <label className="block font-semibold text-slate-300 mb-1.5">
                  Short Bio <span className="text-slate-400 font-normal">(Optional)</span>
                </label>
                <textarea
                  rows={3}
                  placeholder="Briefly describe your responsibilities or research focus..."
                  value={formData.bio || ''}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  className="w-full rounded-xl border border-slate-800 bg-slate-950 p-3.5 text-slate-200 focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            {/* Submit Action */}
            <div className="pt-4 border-t border-slate-800 flex items-center justify-end">
              <button
                type="submit"
                disabled={isSaving}
                className="flex items-center space-x-2 rounded-xl bg-blue-600 hover:bg-blue-500 px-6 py-2.5 text-xs font-bold text-white shadow-lg shadow-blue-500/20 transition disabled:opacity-50"
              >
                <Save className="h-4 w-4" />
                <span>{isSaving ? 'Saving Profile...' : 'Save Profile Changes'}</span>
              </button>
            </div>
          </form>
        </main>
      </div>
    </div>
  );
}

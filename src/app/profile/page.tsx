'use client';

import React, { useState, useEffect } from 'react';
import {
  User as UserIcon,
  Mail,
  Save,
  CheckCircle2,
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
    <div className="min-h-screen bg-[#111111] text-[#ededed] flex flex-col lg:flex-row selection:bg-[#00E5FF]/20 selection:text-[#00E5FF]">
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0">
        <Header />

        <main className="flex-1 p-6 max-w-4xl mx-auto w-full space-y-6">
          {/* Header */}
          <div>
            <h1 className="text-2xl font-black text-white tracking-tight flex items-center space-x-2.5">
              <UserIcon className="h-6 w-6 text-[#00E5FF]" />
              <span>User Profile & Credentials</span>
            </h1>
            <p className="text-xs text-[#737373] mt-1">
              Manage your personal credentials, education, and institutional affiliations.
            </p>
          </div>

          {/* Account Details Box */}
          <div className="rounded-3xl border border-[#262626] bg-[#161616] p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm">
            <div className="flex items-center space-x-4">
              <div className="relative h-16 w-16 rounded-2xl overflow-hidden bg-[#222222] border-2 border-[#333333] flex-shrink-0 shadow-lg">
                {user?.avatarUrl ? (
                  <img src={user.avatarUrl} alt={user.name || 'User'} className="h-full w-full object-cover" />
                ) : (
                  <div className="h-full w-full flex items-center justify-center font-bold text-lg text-[#00E5FF] bg-[#00E5FF]/10">
                    {(user?.name || 'U')[0].toUpperCase()}
                  </div>
                )}
              </div>
              <div>
                <h2 className="text-lg font-bold text-white">{user?.name || 'Enterprise User'}</h2>
                <div className="flex items-center space-x-2 text-xs text-[#a3a3a3] mt-0.5">
                  <Mail className="h-3.5 w-3.5 text-[#00E5FF]" />
                  <span>{user?.email}</span>
                  <span className="rounded bg-[#00E5FF]/10 px-2 py-0.5 text-[10px] font-semibold text-[#00E5FF] border border-[#00E5FF]/20">
                    Google OAuth Managed
                  </span>
                </div>
              </div>
            </div>

            <div className="rounded-xl bg-[#111111] border border-[#262626] p-3 text-right">
              <span className="text-[10px] font-semibold text-[#737373] uppercase tracking-wider">
                Account Status
              </span>
              <p className="text-xs font-bold text-emerald-400 mt-0.5 flex items-center space-x-1 sm:justify-end">
                <CheckCircle2 className="h-3.5 w-3.5" />
                <span>Verified Enterprise Seat</span>
              </p>
            </div>
          </div>

          {/* Editable Personal Profile Form */}
          <form onSubmit={handleSubmit} className="rounded-3xl border border-[#262626] bg-[#161616] p-6 md:p-8 space-y-6 shadow-sm">
            <div className="flex items-center justify-between border-b border-[#262626] pb-4">
              <div>
                <h3 className="text-base font-bold text-white">Institutional & Career Profile</h3>
                <p className="text-xs text-[#737373]">Complete these details to contextualize enterprise document access.</p>
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
                <label className="block font-semibold text-[#a3a3a3] mb-1.5">Current Status</label>
                <select
                  value={formData.currentStatus || 'employed'}
                  onChange={(e) => setFormData({ ...formData, currentStatus: e.target.value })}
                  className="w-full rounded-xl border border-[#262626] bg-[#111111] px-3.5 py-2.5 text-[#ededed] focus:outline-none focus:border-[#00E5FF]"
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
                <label className="block font-semibold text-[#a3a3a3] mb-1.5">
                  Date of Birth <span className="text-[#737373] font-normal">(Optional)</span>
                </label>
                <input
                  type="date"
                  value={formData.dob || ''}
                  onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
                  className="w-full rounded-xl border border-[#262626] bg-[#111111] px-3.5 py-2.5 text-[#ededed] focus:outline-none focus:border-[#00E5FF]"
                />
              </div>

              {/* School / Higher Secondary */}
              <div>
                <label className="block font-semibold text-[#a3a3a3] mb-1.5">
                  School / Higher-Secondary Institution
                </label>
                <input
                  type="text"
                  placeholder="e.g. National Public School"
                  value={formData.school || ''}
                  onChange={(e) => setFormData({ ...formData, school: e.target.value })}
                  className="w-full rounded-xl border border-[#262626] bg-[#111111] px-3.5 py-2.5 text-[#ededed] placeholder-[#737373] focus:outline-none focus:border-[#00E5FF]"
                />
              </div>

              {/* College / University */}
              <div>
                <label className="block font-semibold text-[#a3a3a3] mb-1.5">
                  College / University
                </label>
                <input
                  type="text"
                  placeholder="e.g. Indian Institute of Technology / Stanford"
                  value={formData.college || ''}
                  onChange={(e) => setFormData({ ...formData, college: e.target.value })}
                  className="w-full rounded-xl border border-[#262626] bg-[#111111] px-3.5 py-2.5 text-[#ededed] placeholder-[#737373] focus:outline-none focus:border-[#00E5FF]"
                />
              </div>

              {/* Degree / Department */}
              <div>
                <label className="block font-semibold text-[#a3a3a3] mb-1.5">
                  Degree, Department, or Field of Study
                </label>
                <input
                  type="text"
                  placeholder="e.g. B.Tech Computer Science & AI"
                  value={formData.degree || ''}
                  onChange={(e) => setFormData({ ...formData, degree: e.target.value })}
                  className="w-full rounded-xl border border-[#262626] bg-[#111111] px-3.5 py-2.5 text-[#ededed] placeholder-[#737373] focus:outline-none focus:border-[#00E5FF]"
                />
              </div>

              {/* Company / Organization */}
              <div>
                <label className="block font-semibold text-[#a3a3a3] mb-1.5">
                  Company / Organization <span className="text-[#737373] font-normal">(Optional)</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. Acme Enterprise / Doc.DOOM Labs"
                  value={formData.company || ''}
                  onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                  className="w-full rounded-xl border border-[#262626] bg-[#111111] px-3.5 py-2.5 text-[#ededed] placeholder-[#737373] focus:outline-none focus:border-[#00E5FF]"
                />
              </div>

              {/* Job Title / Role */}
              <div>
                <label className="block font-semibold text-[#a3a3a3] mb-1.5">
                  Job Title / Role <span className="text-[#737373] font-normal">(Optional)</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. Lead Full-Stack AI Engineer"
                  value={formData.role || ''}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  className="w-full rounded-xl border border-[#262626] bg-[#111111] px-3.5 py-2.5 text-[#ededed] placeholder-[#737373] focus:outline-none focus:border-[#00E5FF]"
                />
              </div>

              {/* Location */}
              <div>
                <label className="block font-semibold text-[#a3a3a3] mb-1.5">
                  Location <span className="text-[#737373] font-normal">(Optional)</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. Bengaluru / San Francisco"
                  value={formData.location || ''}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="w-full rounded-xl border border-[#262626] bg-[#111111] px-3.5 py-2.5 text-[#ededed] placeholder-[#737373] focus:outline-none focus:border-[#00E5FF]"
                />
              </div>

              {/* Bio */}
              <div className="md:col-span-2">
                <label className="block font-semibold text-[#a3a3a3] mb-1.5">
                  Short Bio <span className="text-[#737373] font-normal">(Optional)</span>
                </label>
                <textarea
                  rows={3}
                  placeholder="Briefly describe your responsibilities or research focus..."
                  value={formData.bio || ''}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  className="w-full rounded-xl border border-[#262626] bg-[#111111] p-3.5 text-[#ededed] placeholder-[#737373] focus:outline-none focus:border-[#00E5FF]"
                />
              </div>
            </div>

            {/* Submit Action */}
            <div className="pt-4 border-t border-[#262626] flex items-center justify-end">
              <button
                type="submit"
                disabled={isSaving}
                className="flex items-center space-x-2 rounded-xl bg-[#00E5FF] hover:bg-[#33EBFF] active:bg-[#00B4CC] px-6 py-2.5 text-xs font-bold text-[#111111] shadow-lg shadow-[#00E5FF]/20 transition disabled:opacity-50"
              >
                <Save className="h-4 w-4 text-[#111111]" />
                <span>{isSaving ? 'Saving Profile...' : 'Save Profile Changes'}</span>
              </button>
            </div>
          </form>
        </main>
      </div>
    </div>
  );
}

'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Files,
  GitCompare,
  BarChart3,
  Bot,
  User,
  Settings,
  Mail,
  LogOut,
  Layers,
  ChevronRight,
  Menu,
  X,
  ShieldCheck,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { ContactModal } from './ContactModal';

interface NavItem {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
}

const NAV_ITEMS: NavItem[] = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Document Library', href: '/documents', icon: Files },
  { name: 'Document Comparison', href: '/compare', icon: GitCompare, badge: 'Conflicts' },
  { name: 'Visualizations', href: '/visualizations', icon: BarChart3 },
  { name: 'AI Assistant', href: '/chat', icon: Bot },
  { name: 'User Profile', href: '/profile', icon: User },
  { name: 'Settings & Highlights', href: '/settings', icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const isActive = (path: string) => {
    if (path === '/dashboard' && pathname === '/dashboard') return true;
    if (path !== '/dashboard' && pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <>
      {/* Mobile Menu Trigger Bar */}
      <div className="lg:hidden flex items-center justify-between bg-slate-900 border-b border-slate-800 px-4 py-3 sticky top-0 z-40">
        <Link href="/dashboard" className="flex items-center space-x-2.5">
          <div className="h-8 w-8 rounded-lg bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center shadow-lg shadow-blue-500/20 text-white font-black text-sm">
            DD
          </div>
          <span className="text-lg font-black tracking-tight text-white">Doc.DOOM</span>
        </Link>
        <button
          onClick={() => setIsMobileOpen(!isMobileOpen)}
          className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
          aria-label="Toggle Navigation"
        >
          {isMobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Overlay for mobile drawer */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed lg:sticky top-0 left-0 z-50 flex h-screen w-64 flex-col justify-between border-r border-slate-800 bg-slate-950 p-4 transition-transform duration-200 lg:translate-x-0 ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div>
          {/* Brand Header */}
          <div className="flex items-center justify-between pb-6 pt-2 px-2 border-b border-slate-800/80">
            <Link href="/dashboard" className="flex items-center space-x-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-violet-600 shadow-xl shadow-blue-600/25 text-white font-black text-base border border-blue-400/30">
                DD
              </div>
              <div>
                <div className="flex items-center space-x-1.5">
                  <span className="text-xl font-extrabold tracking-tight text-white">Doc.DOOM</span>
                  <span className="rounded bg-blue-500/10 px-1.5 py-0.5 text-[10px] font-semibold text-blue-400 border border-blue-500/20">
                    PS01
                  </span>
                </div>
                <p className="text-[11px] font-medium text-slate-400">Information Intelligence</p>
              </div>
            </Link>
          </div>

          {/* Navigation Links */}
          <nav className="mt-6 space-y-1.5">
            {NAV_ITEMS.map((item) => {
              const active = isActive(item.href);
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsMobileOpen(false)}
                  className={`group flex items-center justify-between rounded-xl px-3 py-2.5 text-sm font-medium transition ${
                    active
                      ? 'bg-blue-600/15 text-blue-400 border border-blue-500/30 shadow-sm'
                      : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <Icon
                      className={`h-4.5 w-4.5 transition ${
                        active ? 'text-blue-400' : 'text-slate-400 group-hover:text-slate-200'
                      }`}
                    />
                    <span>{item.name}</span>
                  </div>
                  {item.badge && (
                    <span className="rounded-full bg-amber-500/15 px-2 py-0.5 text-[10px] font-semibold text-amber-300 border border-amber-500/30">
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}

            {/* Functional Contact Us Link */}
            <button
              type="button"
              onClick={() => {
                setIsContactOpen(true);
                setIsMobileOpen(false);
              }}
              className="w-full flex items-center justify-between rounded-xl px-3 py-2.5 text-sm font-medium text-slate-400 hover:bg-slate-900 hover:text-slate-200 transition text-left"
            >
              <div className="flex items-center space-x-3">
                <Mail className="h-4.5 w-4.5 text-slate-400" />
                <span>Contact Us</span>
              </div>
              <ChevronRight className="h-4 w-4 text-slate-600" />
            </button>
          </nav>
        </div>

        {/* User Footer / Profile Summary */}
        <div className="border-t border-slate-800/80 pt-4">
          <div className="flex items-center justify-between rounded-xl bg-slate-900/80 p-2.5 border border-slate-800">
            <Link href="/profile" className="flex items-center space-x-2.5 overflow-hidden flex-1 group">
              <div className="relative h-8 w-8 rounded-full overflow-hidden bg-slate-800 border border-slate-700 flex-shrink-0">
                {user?.avatarUrl ? (
                  <img src={user.avatarUrl} alt={user.name || 'User'} className="h-full w-full object-cover" />
                ) : (
                  <div className="h-full w-full flex items-center justify-center font-bold text-xs text-blue-400 bg-blue-900/30">
                    {(user?.name || 'U')[0].toUpperCase()}
                  </div>
                )}
              </div>
              <div className="truncate">
                <p className="text-xs font-semibold text-white group-hover:text-blue-400 transition truncate">
                  {user?.name || 'Enterprise User'}
                </p>
                <p className="text-[10px] text-slate-400 truncate">{user?.email || 'Authenticated'}</p>
              </div>
            </Link>

            <button
              onClick={logout}
              title="Sign Out"
              className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-red-950/30 rounded-lg transition ml-1"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Contact Us Modal */}
      <ContactModal isOpen={isContactOpen} onClose={() => setIsContactOpen(false)} />
    </>
  );
}

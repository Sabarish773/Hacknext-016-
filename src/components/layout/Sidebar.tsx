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
  ChevronRight,
  Menu,
  X,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { ContactModal } from './ContactModal';
import { Logo } from '@/components/common/Logo';

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
      <div className="lg:hidden flex items-center justify-between bg-[#111111] border-b border-[#262626] px-4 py-3 sticky top-0 z-40">
        <Link href="/dashboard" className="flex items-center space-x-2.5">
          <Logo size="sm" />
          <span className="text-lg font-black tracking-tight text-white">Doc.DOOM</span>
        </Link>
        <button
          onClick={() => setIsMobileOpen(!isMobileOpen)}
          className="p-2 text-[#a3a3a3] hover:text-[#00E5FF] rounded-lg hover:bg-[#1a1a1a] transition"
          aria-label="Toggle Navigation"
        >
          {isMobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Overlay for mobile drawer */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/75 backdrop-blur-sm lg:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed lg:sticky top-0 left-0 z-50 flex h-screen w-64 flex-col justify-between border-r border-[#262626] bg-[#111111] p-4 transition-transform duration-200 lg:translate-x-0 ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div>
          {/* Brand Header */}
          <div className="flex items-center justify-between pb-6 pt-2 px-2 border-b border-[#262626]">
            <Link href="/dashboard" className="flex items-center space-x-3 group">
              <Logo size="md" priority />
              <div>
                <div className="flex items-center space-x-1.5">
                  <span className="text-xl font-extrabold tracking-tight text-white group-hover:text-[#00E5FF] transition">
                    Doc.DOOM
                  </span>
                  <span className="rounded bg-[#00E5FF]/10 px-1.5 py-0.5 text-[10px] font-semibold text-[#00E5FF] border border-[#00E5FF]/20">
                    PS01
                  </span>
                </div>
                <p className="text-[11px] font-medium text-[#737373]">Information Intelligence</p>
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
                      ? 'bg-[#00E5FF]/12 text-[#00E5FF] border border-[#00E5FF]/30 shadow-sm shadow-[#00E5FF]/5'
                      : 'text-[#a3a3a3] hover:bg-[#181818] hover:text-white border border-transparent'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <Icon
                      className={`h-4.5 w-4.5 transition ${
                        active ? 'text-[#00E5FF]' : 'text-[#737373] group-hover:text-[#00E5FF]'
                      }`}
                    />
                    <span>{item.name}</span>
                  </div>
                  {item.badge && (
                    <span className="rounded-full bg-[#00E5FF]/10 px-2 py-0.5 text-[10px] font-semibold text-[#00E5FF] border border-[#00E5FF]/30">
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
              className="w-full flex items-center justify-between rounded-xl px-3 py-2.5 text-sm font-medium text-[#a3a3a3] hover:bg-[#181818] hover:text-white transition text-left border border-transparent"
            >
              <div className="flex items-center space-x-3">
                <Mail className="h-4.5 w-4.5 text-[#737373]" />
                <span>Contact Us</span>
              </div>
              <ChevronRight className="h-4 w-4 text-[#525252]" />
            </button>
          </nav>
        </div>

        {/* User Footer / Profile Summary */}
        <div className="border-t border-[#262626] pt-4">
          <div className="flex items-center justify-between rounded-xl bg-[#161616] p-2.5 border border-[#262626]">
            <Link href="/profile" className="flex items-center space-x-2.5 overflow-hidden flex-1 group">
              <div className="relative h-8 w-8 rounded-full overflow-hidden bg-[#222222] border border-[#333333] flex-shrink-0">
                {user?.avatarUrl ? (
                  <img src={user.avatarUrl} alt={user.name || 'User'} className="h-full w-full object-cover" />
                ) : (
                  <div className="h-full w-full flex items-center justify-center font-bold text-xs text-[#00E5FF] bg-[#00E5FF]/10">
                    {(user?.name || 'U')[0].toUpperCase()}
                  </div>
                )}
              </div>
              <div className="truncate">
                <p className="text-xs font-semibold text-white group-hover:text-[#00E5FF] transition truncate">
                  {user?.name || 'Enterprise User'}
                </p>
                <p className="text-[10px] text-[#737373] truncate">{user?.email || 'Authenticated'}</p>
              </div>
            </Link>

            <button
              onClick={logout}
              title="Sign Out"
              className="p-1.5 text-[#737373] hover:text-red-400 hover:bg-red-950/30 rounded-lg transition ml-1"
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

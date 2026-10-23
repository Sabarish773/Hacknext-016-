'use client';

import React, { useState } from 'react';
import { Mail, X, Check, Copy, ExternalLink, MessageSquare } from 'lucide-react';

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ContactModal({ isOpen, onClose }: ContactModalProps) {
  const [copied, setCopied] = useState(false);
  const contactEmail = 'sanjay9187ram@gmail.com';

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(contactEmail);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-md rounded-2xl border border-slate-700 bg-slate-900 p-6 shadow-2xl text-slate-100">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white transition"
          aria-label="Close"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="flex items-center space-x-3 mb-4">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-600/20 text-blue-400 border border-blue-500/30">
            <Mail className="h-6 w-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">Contact Doc.DOOM Team</h3>
            <p className="text-xs text-slate-400">HackNext’26 Technical Inquiries & Support</p>
          </div>
        </div>

        <p className="text-sm text-slate-300 leading-relaxed mb-5">
          Have questions regarding Doc.DOOM enterprise features, integrations, or deployment? Reach out directly to our core engineering team.
        </p>

        {/* Email Display Box */}
        <div className="rounded-xl border border-slate-700/80 bg-slate-800/80 p-3.5 flex items-center justify-between mb-5">
          <div className="flex items-center space-x-2.5 overflow-hidden">
            <Mail className="h-4 w-4 text-blue-400 flex-shrink-0" />
            <span className="text-sm font-mono text-blue-200 select-all truncate">
              {contactEmail}
            </span>
          </div>
          <button
            onClick={handleCopy}
            className="flex items-center space-x-1 px-2.5 py-1 text-xs font-medium rounded-lg bg-slate-700 hover:bg-slate-600 text-slate-200 transition ml-2 flex-shrink-0"
            title="Copy email to clipboard"
          >
            {copied ? (
              <>
                <Check className="h-3.5 w-3.5 text-emerald-400" />
                <span className="text-emerald-400">Copied</span>
              </>
            ) : (
              <>
                <Copy className="h-3.5 w-3.5" />
                <span>Copy</span>
              </>
            )}
          </button>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center space-x-3">
          <a
            href={`mailto:${contactEmail}?subject=Doc.DOOM%20Inquiry%20-%20HackNext'26`}
            className="flex-1 flex items-center justify-center space-x-2 rounded-xl bg-blue-600 hover:bg-blue-500 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-blue-500/20 transition"
          >
            <span>Open Email Client</span>
            <ExternalLink className="h-4 w-4" />
          </a>
          <button
            onClick={onClose}
            className="rounded-xl border border-slate-700 bg-slate-800 hover:bg-slate-700/80 px-4 py-2.5 text-sm font-medium text-slate-300 transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

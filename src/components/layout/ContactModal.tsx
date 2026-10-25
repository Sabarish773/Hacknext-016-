'use client';

import React, { useState } from 'react';
import { Mail, X, Check, Copy, ExternalLink } from 'lucide-react';

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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0B192C]/40 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-md rounded-3xl border border-[#DCE5EE] bg-white p-6 sm:p-7 royal-shadow-lg text-[#0B192C]">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 rounded-lg p-1.5 text-[#64748B] hover:bg-[#F2F7FD] hover:text-[#014BAA] transition"
          aria-label="Close"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="flex items-center space-x-3.5 mb-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#EBF3FC] text-[#014BAA] border border-[#BFD7F5] shadow-sm">
            <Mail className="h-6 w-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-[#0B192C] font-heading">Contact Doc.DOOM Team</h3>
            <p className="text-xs text-[#64748B]">HackNext’26 Technical Inquiries &amp; Support</p>
          </div>
        </div>

        <p className="text-sm text-[#3B4D63] leading-relaxed mb-5">
          Have questions regarding Doc.DOOM enterprise features, integrations, or deployment? Reach out directly to our core engineering team.
        </p>

        {/* Email Display Box */}
        <div className="rounded-2xl border border-[#DCE5EE] bg-[#F8F3F0] p-4 flex items-center justify-between mb-6">
          <div className="flex items-center space-x-2.5 overflow-hidden">
            <Mail className="h-4 w-4 text-[#014BAA] flex-shrink-0" />
            <span className="text-sm font-mono text-[#014BAA] font-semibold select-all truncate">
              {contactEmail}
            </span>
          </div>
          <button
            onClick={handleCopy}
            className="flex items-center space-x-1 px-3 py-1.5 text-xs font-semibold rounded-xl bg-white hover:bg-[#EBF3FC] text-[#014BAA] border border-[#BFD7F5] transition ml-2 flex-shrink-0 shadow-sm"
            title="Copy email to clipboard"
          >
            {copied ? (
              <>
                <Check className="h-3.5 w-3.5 text-emerald-600" />
                <span className="text-emerald-700 font-bold">Copied</span>
              </>
            ) : (
              <>
                <Copy className="h-3.5 w-3.5 text-[#014BAA]" />
                <span>Copy</span>
              </>
            )}
          </button>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center space-x-3">
          <a
            href={`mailto:${contactEmail}?subject=Doc.DOOM%20Inquiry%20-%20HackNext'26`}
            className="flex-1 flex items-center justify-center space-x-2 rounded-xl bg-[#014BAA] hover:bg-[#013C88] px-4 py-2.5 text-sm font-semibold text-white shadow-md shadow-[#014BAA]/20 transition"
          >
            <span>Open Email Client</span>
            <ExternalLink className="h-4 w-4" />
          </a>
          <button
            onClick={onClose}
            className="rounded-xl border border-[#DCE5EE] bg-[#F8F3F0] hover:bg-[#ECE5DF] px-4 py-2.5 text-sm font-semibold text-[#0B192C] transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

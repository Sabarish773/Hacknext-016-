'use client';

import React, { useEffect, useState, useRef, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import {
  Bot,
  Send,
  Sparkles,
  Files,
  FileText,
  HelpCircle,
  ExternalLink,
  ShieldCheck,
  User,
  Quote,
} from 'lucide-react';
import { Sidebar } from '@/components/layout/Sidebar';
import { Header } from '@/components/layout/Header';
import { useAuth } from '@/context/AuthContext';
import { DocumentItem, ChatMessage, ChatSourceCitation } from '@/types';

const QUICK_PROMPTS = [
  'What are the critical deadlines and milestone dates?',
  'What information or compliance documents are missing?',
  'Explain the main purpose and key requirements simply.',
  'What monetary amounts and payment terms are stipulated?',
];

function ChatContent() {
  const { user } = useAuth();
  const searchParams = useSearchParams();
  const targetDocIdParam = searchParams.get('docId');

  const [documents, setDocuments] = useState<DocumentItem[]>([]);
  const [selectedTargetDocId, setSelectedTargetDocId] = useState<string>(
    targetDocIdParam || 'ALL'
  );
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputQuery, setInputQuery] = useState('');
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Load documents
  useEffect(() => {
    async function loadDocs() {
      if (!user) return;
      try {
        const res = await fetch(`/api/documents?userId=${user.id}`);
        if (res.ok) {
          const data = await res.json();
          setDocuments(data.documents || []);
        }
      } catch (err) {
        console.error('Error loading docs for chat:', err);
      }
    }
    loadDocs();
  }, [user]);

  // Load initial welcome message
  useEffect(() => {
    const welcomeMsg: ChatMessage = {
      id: 'msg-welcome',
      role: 'assistant',
      content:
        'Hello! I am Doc.DOOM’s Cognitive Assistant. Ask me anything grounded in your uploaded documents. I will extract facts, deadlines, financial commitments, and missing items with verified source citations.',
      createdAt: new Date().toISOString(),
    };
    setMessages([welcomeMsg]);
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (textToSend?: string) => {
    const query = (textToSend || inputQuery).trim();
    if (!query || isSending) return;

    setInputQuery('');
    const targetDocId = selectedTargetDocId === 'ALL' ? null : selectedTargetDocId;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: query,
      createdAt: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, userMsg]);
    setIsSending(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user?.id,
          question: query,
          targetDocId,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        const assistantMsg: ChatMessage = {
          id: `asst-${Date.now()}`,
          role: 'assistant',
          content: data.answer,
          sources: data.sources || [],
          createdAt: new Date().toISOString(),
        };
        setMessages((prev) => [...prev, assistantMsg]);
      } else {
        const errorMsg: ChatMessage = {
          id: `asst-err-${Date.now()}`,
          role: 'assistant',
          content: 'Unable to process query grounded in the selected document collection.',
          createdAt: new Date().toISOString(),
        };
        setMessages((prev) => [...prev, errorMsg]);
      }
    } catch (err) {
      console.error('Chat request failed:', err);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col lg:flex-row">
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        <Header />

        <main className="flex-1 flex flex-col max-w-5xl mx-auto w-full p-4 sm:p-6 overflow-hidden">
          {/* Top Controls: Mode & Document Selector */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-800 gap-3">
            <div className="flex items-center space-x-2.5">
              <div className="h-9 w-9 rounded-xl bg-blue-600/20 text-blue-400 border border-blue-500/30 flex items-center justify-center">
                <Bot className="h-5 w-5" />
              </div>
              <div>
                <h1 className="text-base font-bold text-white">Grounded AI Assistant</h1>
                <p className="text-xs text-slate-400">Zero hallucination • Source citations linked</p>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <span className="text-xs font-semibold text-slate-400">Context Scope:</span>
              <select
                value={selectedTargetDocId}
                onChange={(e) => setSelectedTargetDocId(e.target.value)}
                className="rounded-xl border border-slate-800 bg-slate-900 px-3 py-1.5 text-xs font-medium text-slate-200 focus:outline-none focus:border-blue-500"
              >
                <option value="ALL">All Repository Documents ({documents.length})</option>
                {documents.map((d, idx) => (
                  <option key={d.id} value={d.id}>
                    Doc {d.docNumber || idx + 1}: {d.title}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Quick Prompt Chips */}
          <div className="py-3 flex items-center space-x-2 overflow-x-auto scrollbar-none text-xs">
            <span className="text-[11px] font-semibold text-slate-500 uppercase flex-shrink-0">
              Suggestions:
            </span>
            {QUICK_PROMPTS.map((p, i) => (
              <button
                key={i}
                onClick={() => handleSendMessage(p)}
                className="rounded-lg border border-slate-800 bg-slate-900/80 hover:bg-slate-800 px-3 py-1 text-slate-300 hover:text-white transition flex-shrink-0 whitespace-nowrap"
              >
                {p}
              </button>
            ))}
          </div>

          {/* Chat Messages Stream */}
          <div className="flex-1 overflow-y-auto pr-2 py-4 space-y-5">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex items-start space-x-3 ${
                  msg.role === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                {msg.role === 'assistant' && (
                  <div className="h-8 w-8 rounded-xl bg-blue-600/20 border border-blue-500/30 text-blue-400 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Bot className="h-4 w-4" />
                  </div>
                )}

                <div
                  className={`rounded-2xl p-4 text-xs sm:text-sm leading-relaxed max-w-2xl space-y-3 ${
                    msg.role === 'user'
                      ? 'bg-blue-600 text-white rounded-tr-none'
                      : 'bg-slate-900 border border-slate-800 text-slate-200 rounded-tl-none shadow-sm'
                  }`}
                >
                  <p className="whitespace-pre-line">{msg.content}</p>

                  {/* Grounded Source Citations */}
                  {msg.sources && msg.sources.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-slate-800/80 space-y-2">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center space-x-1">
                        <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
                        <span>Source Traceability References</span>
                      </p>
                      <div className="space-y-1.5">
                        {msg.sources.map((src, sIdx) => (
                          <div
                            key={sIdx}
                            className="rounded-lg border border-slate-800 bg-slate-950/70 p-2 text-xs font-mono"
                          >
                            <div className="flex items-center justify-between text-blue-400 font-semibold">
                              <span>{src.docTitle}</span>
                              <span className="text-[10px] text-slate-400">{src.sourceRef}</span>
                            </div>
                            <p className="text-[11px] text-slate-300 mt-1 italic font-sans">
                              "{src.snippet}"
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {msg.role === 'user' && (
                  <div className="h-8 w-8 rounded-xl bg-slate-800 border border-slate-700 text-slate-300 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <User className="h-4 w-4" />
                  </div>
                )}
              </div>
            ))}

            {isSending && (
              <div className="flex items-center space-x-2 text-xs text-slate-400 pl-11">
                <Sparkles className="h-4 w-4 animate-spin text-blue-400" />
                <span>Grounded reasoning over document repository...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Bar */}
          <div className="pt-3 border-t border-slate-800">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="relative flex items-center"
            >
              <input
                type="text"
                value={inputQuery}
                onChange={(e) => setInputQuery(e.target.value)}
                placeholder="Ask about deadlines, obligations, missing fields, or amounts..."
                className="w-full rounded-2xl border border-slate-800 bg-slate-900/90 py-3.5 pl-4 pr-12 text-xs sm:text-sm text-slate-100 placeholder-slate-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
              <button
                type="submit"
                disabled={!inputQuery.trim() || isSending}
                className="absolute right-2 p-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white disabled:opacity-40 transition shadow-md shadow-blue-500/20"
              >
                <Send className="h-4 w-4" />
              </button>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
}

export default function AIChatPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-slate-950 flex items-center justify-center text-slate-400 text-xs">
          Loading Grounded AI Assistant...
        </div>
      }
    >
      <ChatContent />
    </Suspense>
  );
}

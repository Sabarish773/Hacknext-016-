'use client';

import React, { useState, useRef } from 'react';
import {
  Upload,
  X,
  FileText,
  FileSpreadsheet,
  FileImage,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Trash2,
  Sparkles,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUploadSuccess?: () => void;
}

interface SelectedFileItem {
  file: File;
  id: string;
  status: 'QUEUED' | 'UPLOADING' | 'PROCESSING' | 'ANALYSING' | 'COMPLETED' | 'FAILED';
  errorMessage?: string;
}

export function UploadModal({ isOpen, onClose, onUploadSuccess }: UploadModalProps) {
  const { user } = useAuth();
  const [selectedFiles, setSelectedFiles] = useState<SelectedFileItem[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [globalError, setGlobalError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFilesChosen = (files: FileList | null) => {
    if (!files) return;
    const newItems: SelectedFileItem[] = Array.from(files).map((f) => ({
      file: f,
      id: `${f.name}-${Date.now()}-${Math.random()}`,
      status: 'QUEUED',
    }));
    setSelectedFiles((prev) => [...prev, ...newItems]);
    setGlobalError(null);
  };

  const removeFile = (id: string) => {
    setSelectedFiles((prev) => prev.filter((item) => item.id !== id));
  };

  const getFileIcon = (fileName: string) => {
    const ext = fileName.toLowerCase().split('.').pop() || '';
    if (['csv', 'xls', 'xlsx'].includes(ext)) {
      return <FileSpreadsheet className="h-5 w-5 text-[#00E5FF]" />;
    }
    if (['png', 'jpg', 'jpeg'].includes(ext)) {
      return <FileImage className="h-5 w-5 text-[#38BDF8]" />;
    }
    return <FileText className="h-5 w-5 text-[#00E5FF]" />;
  };

  const handleStartUpload = async () => {
    if (selectedFiles.length === 0) return;
    setIsProcessing(true);
    setGlobalError(null);

    setSelectedFiles((prev) => prev.map((f) => ({ ...f, status: 'UPLOADING' })));

    try {
      const formData = new FormData();
      formData.append('userId', user?.id || 'user-default-1');
      selectedFiles.forEach((item) => {
        formData.append('files', item.file);
      });

      setTimeout(() => {
        setSelectedFiles((prev) =>
          prev.map((f) => (f.status === 'UPLOADING' ? { ...f, status: 'ANALYSING' } : f))
        );
      }, 700);

      const res = await fetch('/api/documents', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Upload request failed');
      }

      setSelectedFiles((prev) => prev.map((f) => ({ ...f, status: 'COMPLETED' })));

      if (onUploadSuccess) {
        onUploadSuccess();
      }

      setTimeout(() => {
        onClose();
        setSelectedFiles([]);
      }, 1200);
    } catch (err: unknown) {
      console.error('Upload failed:', err);
      const msg = err instanceof Error ? err.message : 'Error occurred while analyzing documents';
      setGlobalError(msg);
      setSelectedFiles((prev) =>
        prev.map((f) => (f.status !== 'COMPLETED' ? { ...f, status: 'FAILED', errorMessage: msg } : f))
      );
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-xl rounded-2xl border border-[#262626] bg-[#161616] p-6 shadow-2xl text-[#ededed] max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#262626]">
          <div className="flex items-center space-x-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#00E5FF]/10 text-[#00E5FF] border border-[#00E5FF]/30">
              <Upload className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Upload Documents to Doc.DOOM</h3>
              <p className="text-xs text-[#737373]">Multi-document intelligence and cognitive processing</p>
            </div>
          </div>
          <button
            onClick={onClose}
            disabled={isProcessing}
            className="rounded-lg p-1.5 text-[#737373] hover:bg-[#222222] hover:text-[#00E5FF] transition disabled:opacity-50"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Global Error message */}
        {globalError && (
          <div className="mt-4 flex items-center space-x-2 rounded-xl bg-red-950/40 border border-red-800/60 p-3 text-xs text-red-300">
            <AlertCircle className="h-4 w-4 flex-shrink-0 text-red-400" />
            <span>{globalError}</span>
          </div>
        )}

        {/* Drag and Drop Upload Area */}
        <div
          onClick={() => fileInputRef.current?.click()}
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault();
            handleFilesChosen(e.dataTransfer.files);
          }}
          className="mt-4 border-2 border-dashed border-[#262626] hover:border-[#00E5FF]/70 rounded-2xl p-6 text-center cursor-pointer bg-[#111111] hover:bg-[#181818] transition group"
        >
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept=".pdf,.doc,.docx,.txt,.csv,.xls,.xlsx,.png,.jpg,.jpeg"
            className="hidden"
            onChange={(e) => handleFilesChosen(e.target.files)}
          />
          <div className="flex flex-col items-center justify-center space-y-2">
            <div className="h-12 w-12 rounded-full bg-[#00E5FF]/10 group-hover:bg-[#00E5FF]/20 text-[#00E5FF] flex items-center justify-center transition border border-[#00E5FF]/20">
              <Upload className="h-6 w-6" />
            </div>
            <p className="text-sm font-semibold text-white group-hover:text-[#00E5FF] transition">
              Click or drag files here to analyze simultaneously
            </p>
            <p className="text-xs text-[#737373]">
              Supported: PDF, DOC, DOCX, CSV, XLS, XLSX, TXT, PNG, JPG (up to 25MB each)
            </p>
          </div>
        </div>

        {/* Selected Files List */}
        {selectedFiles.length > 0 && (
          <div className="mt-4 overflow-y-auto max-h-52 space-y-2 pr-1">
            <p className="text-xs font-semibold text-[#737373] uppercase tracking-wider">
              Selected Documents ({selectedFiles.length})
            </p>
            {selectedFiles.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between p-2.5 rounded-xl bg-[#111111] border border-[#262626] text-xs"
              >
                <div className="flex items-center space-x-2.5 overflow-hidden">
                  {getFileIcon(item.file.name)}
                  <div className="truncate">
                    <p className="font-medium text-white truncate">{item.file.name}</p>
                    <p className="text-[10px] text-[#737373]">
                      {(item.file.size / 1024).toFixed(0)} KB
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-2 flex-shrink-0">
                  {/* Status Indicator */}
                  {item.status === 'QUEUED' && (
                    <span className="text-[10px] font-medium px-2 py-0.5 rounded bg-[#222222] text-[#a3a3a3] border border-[#333333]">
                      Queued
                    </span>
                  )}
                  {item.status === 'UPLOADING' && (
                    <span className="flex items-center space-x-1 text-[10px] font-medium px-2 py-0.5 rounded bg-[#00E5FF]/10 text-[#00E5FF] border border-[#00E5FF]/30">
                      <Loader2 className="h-3 w-3 animate-spin" />
                      <span>Uploading</span>
                    </span>
                  )}
                  {item.status === 'ANALYSING' && (
                    <span className="flex items-center space-x-1 text-[10px] font-medium px-2 py-0.5 rounded bg-[#00E5FF]/15 text-[#00E5FF] border border-[#00E5FF]/40">
                      <Sparkles className="h-3 w-3 animate-spin text-[#00E5FF]" />
                      <span>Analysing</span>
                    </span>
                  )}
                  {item.status === 'COMPLETED' && (
                    <span className="flex items-center space-x-1 text-[10px] font-medium px-2 py-0.5 rounded bg-emerald-950/40 text-emerald-300 border border-emerald-800">
                      <CheckCircle2 className="h-3 w-3 text-emerald-400" />
                      <span>Ready</span>
                    </span>
                  )}
                  {item.status === 'FAILED' && (
                    <span className="flex items-center space-x-1 text-[10px] font-medium px-2 py-0.5 rounded bg-red-900/40 text-red-300 border border-red-800">
                      <AlertCircle className="h-3 w-3 text-red-400" />
                      <span>Failed</span>
                    </span>
                  )}

                  {!isProcessing && item.status !== 'COMPLETED' && (
                    <button
                      onClick={() => removeFile(item.id)}
                      className="text-[#737373] hover:text-red-400 p-1"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Footer Actions */}
        <div className="mt-6 pt-4 border-t border-[#262626] flex items-center justify-end space-x-3">
          <button
            type="button"
            onClick={onClose}
            disabled={isProcessing}
            className="rounded-xl border border-[#262626] bg-[#1f1f1f] hover:bg-[#262626] px-4 py-2 text-xs font-semibold text-[#ededed] transition disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleStartUpload}
            disabled={isProcessing || selectedFiles.length === 0}
            className="flex items-center space-x-2 rounded-xl bg-[#00E5FF] hover:bg-[#33EBFF] active:bg-[#00B4CC] px-5 py-2 text-xs font-bold text-[#111111] shadow-lg shadow-[#00E5FF]/20 transition disabled:opacity-50"
          >
            {isProcessing ? (
              <>
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                <span>Processing AI Pipeline...</span>
              </>
            ) : (
              <>
                <Sparkles className="h-3.5 w-3.5" />
                <span>Begin Cognitive Analysis ({selectedFiles.length})</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

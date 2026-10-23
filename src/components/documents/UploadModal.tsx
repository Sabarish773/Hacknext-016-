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
      return <FileSpreadsheet className="h-5 w-5 text-emerald-400" />;
    }
    if (['png', 'jpg', 'jpeg'].includes(ext)) {
      return <FileImage className="h-5 w-5 text-purple-400" />;
    }
    return <FileText className="h-5 w-5 text-blue-400" />;
  };

  const handleStartUpload = async () => {
    if (selectedFiles.length === 0) return;
    setIsProcessing(true);
    setGlobalError(null);

    // Update status to UPLOADING
    setSelectedFiles((prev) => prev.map((f) => ({ ...f, status: 'UPLOADING' })));

    try {
      const formData = new FormData();
      formData.append('userId', user?.id || 'user-default-1');
      selectedFiles.forEach((item) => {
        formData.append('files', item.file);
      });

      // Advance status to PROCESSING
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

      // Mark completed
      setSelectedFiles((prev) => prev.map((f) => ({ ...f, status: 'COMPLETED' })));

      if (onUploadSuccess) {
        onUploadSuccess();
      }

      setTimeout(() => {
        onClose();
        setSelectedFiles([]);
      }, 1200);
    } catch (err: any) {
      console.error('Upload failed:', err);
      setGlobalError(err.message || 'Error occurred while analyzing documents');
      setSelectedFiles((prev) =>
        prev.map((f) => (f.status !== 'COMPLETED' ? { ...f, status: 'FAILED', errorMessage: err.message } : f))
      );
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-xl rounded-2xl border border-slate-700 bg-slate-900 p-6 shadow-2xl text-slate-100 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center space-x-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600/20 text-blue-400 border border-blue-500/30">
              <Upload className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Upload Documents to Doc.DOOM</h3>
              <p className="text-xs text-slate-400">Multi-document intelligence and cognitive processing</p>
            </div>
          </div>
          <button
            onClick={onClose}
            disabled={isProcessing}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white transition disabled:opacity-50"
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
          className="mt-4 border-2 border-dashed border-slate-700 hover:border-blue-500/70 rounded-2xl p-6 text-center cursor-pointer bg-slate-950/40 hover:bg-slate-800/40 transition group"
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
            <div className="h-12 w-12 rounded-full bg-blue-600/10 group-hover:bg-blue-600/20 text-blue-400 flex items-center justify-center transition border border-blue-500/20">
              <Upload className="h-6 w-6" />
            </div>
            <p className="text-sm font-semibold text-slate-200">
              Click or drag files here to analyze simultaneously
            </p>
            <p className="text-xs text-slate-400">
              Supported: PDF, DOC, DOCX, CSV, XLS, XLSX, TXT, PNG, JPG (up to 25MB each)
            </p>
          </div>
        </div>

        {/* Selected Files List */}
        {selectedFiles.length > 0 && (
          <div className="mt-4 overflow-y-auto max-h-52 space-y-2 pr-1">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Selected Documents ({selectedFiles.length})
            </p>
            {selectedFiles.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between p-2.5 rounded-xl bg-slate-800/70 border border-slate-700/60 text-xs"
              >
                <div className="flex items-center space-x-2.5 overflow-hidden">
                  {getFileIcon(item.file.name)}
                  <div className="truncate">
                    <p className="font-medium text-slate-200 truncate">{item.file.name}</p>
                    <p className="text-[10px] text-slate-400">
                      {(item.file.size / 1024).toFixed(0)} KB
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-2 flex-shrink-0">
                  {/* Status Indicator */}
                  {item.status === 'QUEUED' && (
                    <span className="text-[10px] font-medium px-2 py-0.5 rounded bg-slate-700 text-slate-300">
                      Queued
                    </span>
                  )}
                  {item.status === 'UPLOADING' && (
                    <span className="flex items-center space-x-1 text-[10px] font-medium px-2 py-0.5 rounded bg-blue-900/40 text-blue-300 border border-blue-800">
                      <Loader2 className="h-3 w-3 animate-spin" />
                      <span>Uploading</span>
                    </span>
                  )}
                  {item.status === 'ANALYSING' && (
                    <span className="flex items-center space-x-1 text-[10px] font-medium px-2 py-0.5 rounded bg-purple-900/40 text-purple-300 border border-purple-800">
                      <Sparkles className="h-3 w-3 animate-spin text-purple-400" />
                      <span>Analysing</span>
                    </span>
                  )}
                  {item.status === 'COMPLETED' && (
                    <span className="flex items-center space-x-1 text-[10px] font-medium px-2 py-0.5 rounded bg-emerald-900/40 text-emerald-300 border border-emerald-800">
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
                      className="text-slate-400 hover:text-red-400 p-1"
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
        <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-end space-x-3">
          <button
            type="button"
            onClick={onClose}
            disabled={isProcessing}
            className="rounded-xl border border-slate-700 bg-slate-800 hover:bg-slate-700 px-4 py-2 text-xs font-semibold text-slate-300 transition disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleStartUpload}
            disabled={isProcessing || selectedFiles.length === 0}
            className="flex items-center space-x-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 px-5 py-2 text-xs font-semibold text-white shadow-lg shadow-blue-500/20 transition disabled:opacity-50"
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

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
      return <FileSpreadsheet className="h-5 w-5 text-[#014BAA]" />;
    }
    if (['png', 'jpg', 'jpeg'].includes(ext)) {
      return <FileImage className="h-5 w-5 text-[#0D6EFD]" />;
    }
    return <FileText className="h-5 w-5 text-[#014BAA]" />;
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0B192C]/40 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-xl rounded-3xl border border-[#DCE5EE] bg-white p-6 sm:p-7 royal-shadow-lg text-[#0B192C] max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#E6DFD8]">
          <div className="flex items-center space-x-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#EBF3FC] text-[#014BAA] border border-[#BFD7F5]">
              <Upload className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#0B192C] font-heading">Upload Documents to Doc.DOOM</h3>
              <p className="text-xs text-[#64748B]">Multi-document intelligence and cognitive processing</p>
            </div>
          </div>
          <button
            onClick={onClose}
            disabled={isProcessing}
            className="rounded-lg p-1.5 text-[#64748B] hover:bg-[#F2F7FD] hover:text-[#014BAA] transition disabled:opacity-50"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Global Error message */}
        {globalError && (
          <div className="mt-4 flex items-center space-x-2 rounded-xl bg-red-50 border border-red-200 p-3 text-xs text-red-700">
            <AlertCircle className="h-4 w-4 flex-shrink-0 text-red-600" />
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
          className="mt-4 border-2 border-dashed border-[#DCE5EE] hover:border-[#014BAA] rounded-2xl p-6 text-center cursor-pointer bg-[#F8F3F0] hover:bg-[#F2F7FD] transition group"
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
            <div className="h-12 w-12 rounded-full bg-white group-hover:bg-[#EBF3FC] text-[#014BAA] flex items-center justify-center transition border border-[#DCE5EE] royal-shadow-sm">
              <Upload className="h-6 w-6" />
            </div>
            <p className="text-sm font-semibold text-[#0B192C] group-hover:text-[#014BAA] transition">
              Click or drag files here to analyze simultaneously
            </p>
            <p className="text-xs text-[#64748B]">
              Supported: PDF, DOC, DOCX, CSV, XLS, XLSX, TXT, PNG, JPG (up to 25MB each)
            </p>
          </div>
        </div>

        {/* Selected Files List */}
        {selectedFiles.length > 0 && (
          <div className="mt-4 overflow-y-auto max-h-52 space-y-2 pr-1">
            <p className="text-xs font-semibold text-[#64748B] uppercase tracking-wider">
              Selected Documents ({selectedFiles.length})
            </p>
            {selectedFiles.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between p-3 rounded-xl bg-[#F8F3F0] border border-[#DCE5EE] text-xs"
              >
                <div className="flex items-center space-x-2.5 overflow-hidden">
                  {getFileIcon(item.file.name)}
                  <div className="truncate">
                    <p className="font-semibold text-[#0B192C] truncate">{item.file.name}</p>
                    <p className="text-[10px] text-[#64748B]">
                      {(item.file.size / 1024).toFixed(0)} KB
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-2 flex-shrink-0">
                  {/* Status Indicator */}
                  {item.status === 'QUEUED' && (
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-white text-[#64748B] border border-[#DCE5EE]">
                      Queued
                    </span>
                  )}
                  {item.status === 'UPLOADING' && (
                    <span className="flex items-center space-x-1 text-[10px] font-semibold px-2 py-0.5 rounded bg-[#EBF3FC] text-[#014BAA] border border-[#BFD7F5]">
                      <Loader2 className="h-3 w-3 animate-spin" />
                      <span>Uploading</span>
                    </span>
                  )}
                  {item.status === 'ANALYSING' && (
                    <span className="flex items-center space-x-1 text-[10px] font-semibold px-2 py-0.5 rounded bg-[#EBF3FC] text-[#014BAA] border border-[#BFD7F5]">
                      <Sparkles className="h-3 w-3 animate-spin text-[#014BAA]" />
                      <span>Analysing</span>
                    </span>
                  )}
                  {item.status === 'COMPLETED' && (
                    <span className="flex items-center space-x-1 text-[10px] font-semibold px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-300">
                      <CheckCircle2 className="h-3 w-3 text-emerald-600" />
                      <span>Ready</span>
                    </span>
                  )}
                  {item.status === 'FAILED' && (
                    <span className="flex items-center space-x-1 text-[10px] font-semibold px-2 py-0.5 rounded bg-red-50 text-red-700 border border-red-300">
                      <AlertCircle className="h-3 w-3 text-red-600" />
                      <span>Failed</span>
                    </span>
                  )}

                  {!isProcessing && item.status !== 'COMPLETED' && (
                    <button
                      onClick={() => removeFile(item.id)}
                      className="text-[#64748B] hover:text-red-600 p-1 rounded hover:bg-white"
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
        <div className="mt-6 pt-4 border-t border-[#E6DFD8] flex items-center justify-end space-x-3">
          <button
            type="button"
            onClick={onClose}
            disabled={isProcessing}
            className="rounded-xl border border-[#DCE5EE] bg-[#F8F3F0] hover:bg-[#ECE5DF] px-4 py-2 text-xs font-semibold text-[#0B192C] transition disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleStartUpload}
            disabled={isProcessing || selectedFiles.length === 0}
            className="flex items-center space-x-2 rounded-xl bg-[#014BAA] hover:bg-[#013C88] active:bg-[#012E69] px-5 py-2 text-xs font-bold text-white shadow-md shadow-[#014BAA]/20 transition disabled:opacity-50"
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

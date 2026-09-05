'use client';

import React, { useState, useRef, useCallback } from 'react';
import Image from 'next/image';
import { toast } from 'sonner';
import {
  UploadCloud,
  FileImage,
  Video,
  Box,
  CheckCircle2,
  AlertCircle,
  X,
  Loader2,
  Copy,
  Check,
  RefreshCw,
} from 'lucide-react';

export interface CloudinaryUploadResult {
  url: string;
  secure_url: string;
  public_id: string;
  resource_type: string;
  format: string;
  bytes: number;
  width?: number;
  height?: number;
  duration?: number;
  original_filename?: string;
}

export interface MediaUploaderProps {
  onUploadSuccess?: (result: CloudinaryUploadResult) => void;
  onUploadComplete?: (urls: string[]) => void;
  accept?: string;
  multiple?: boolean;
  folder?: string;
  label?: string;
  helperText?: string;
  className?: string;
  currentValue?: string;
  resourceType?: 'auto' | 'image' | 'video' | 'raw';
  onClear?: () => void;
  compact?: boolean;
}

interface UploadingFileStatus {
  id: string;
  name: string;
  size: number;
  progress: number;
  status: 'pending' | 'uploading' | 'success' | 'error';
  url?: string;
  error?: string;
  resourceType?: string;
}

export default function MediaUploader({
  onUploadSuccess,
  onUploadComplete,
  accept = 'image/*,video/*,.glb,.gltf',
  multiple = false,
  folder = 'terkina_media',
  label,
  helperText,
  className = '',
  currentValue,
  resourceType = 'auto',
  onClear,
  compact = false,
}: MediaUploaderProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const [fileQueue, setFileQueue] = useState<UploadingFileStatus[]>([]);
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null);
  const [modelWarning, setModelWarning] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const getResourceTypeIcon = (filename: string, resType?: string) => {
    const ext = filename.split('.').pop()?.toLowerCase();
    if (ext === 'glb' || ext === 'gltf' || resType === 'raw') {
      return <Box className="w-5 h-5 text-purple-400" />;
    }
    if (['mp4', 'webm', 'mov', 'm4v', 'avi'].includes(ext || '') || resType === 'video') {
      return <Video className="w-5 h-5 text-cyan-400" />;
    }
    return <FileImage className="w-5 h-5 text-blue-400" />;
  };

  // Many web-based 3D tools (AI generators, online converters) preview textures
  // via a temporary browser blob: URL and forget to embed the actual image
  // bytes on export — the reference gets baked into the .glb as dead text that
  // can never resolve anywhere else. Catch it here so the mistake surfaces the
  // moment it's uploaded, not weeks later in a customer's browser console.
  const checkGlbForDeadBlobTextures = async (file: File): Promise<boolean> => {
    const ext = file.name.split('.').pop()?.toLowerCase();
    if (ext !== 'glb' && ext !== 'gltf') return false;
    try {
      const text = await file.text();
      return text.includes('blob:');
    } catch {
      return false;
    }
  };

  const uploadFile = async (file: File): Promise<CloudinaryUploadResult> => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('folder', folder);
    formData.append('resource_type', resourceType);

    const response = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: 'Upload failed' }));
      throw new Error(errorData.error || `HTTP error ${response.status}`);
    }

    const data: CloudinaryUploadResult = await response.json();
    return data;
  };

  const handleFiles = useCallback(
    async (files: FileList | File[]) => {
      let fileList = Array.from(files);
      if (!fileList.length) return;

      // This dropzone only ever keeps one value (e.g. a cover image) — silently
      // uploading every dropped file and letting the last one win discards the
      // rest with no feedback, so reject the extras up front instead.
      if (!multiple && fileList.length > 1) {
        toast.warning(
          `Only one file is allowed here — uploading "${fileList[0].name}" and skipping the other ${fileList.length - 1}. Use the gallery uploader below for multiple photos.`
        );
        fileList = [fileList[0]];
      }

      const initialQueueItems: UploadingFileStatus[] = fileList.map((file) => ({
        id: `${file.name}-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        name: file.name,
        size: file.size,
        progress: 0,
        status: 'uploading',
      }));

      setFileQueue((prev) => (multiple ? [...prev, ...initialQueueItems] : initialQueueItems));
      setModelWarning(null);

      const successfulUrls: string[] = [];

      for (let i = 0; i < fileList.length; i++) {
        const file = fileList[i];
        const queueItem = initialQueueItems[i];

        try {
          // Simulated progress pulse
          setFileQueue((prev) =>
            prev.map((item) =>
              item.id === queueItem.id ? { ...item, progress: 45, status: 'uploading' } : item
            )
          );

          const result = await uploadFile(file);

          setFileQueue((prev) =>
            prev.map((item) =>
              item.id === queueItem.id
                ? {
                    ...item,
                    progress: 100,
                    status: 'success',
                    url: result.secure_url,
                    resourceType: result.resource_type,
                  }
                : item
            )
          );

          successfulUrls.push(result.secure_url);
          if (onUploadSuccess) {
            onUploadSuccess(result);
          }

          if (await checkGlbForDeadBlobTextures(file)) {
            setModelWarning(
              `"${file.name}" was uploaded, but its texture references a temporary blob: URL from the tool it was exported from — the color/texture won't display live. Re-export the model with textures embedded (packed), then re-upload.`
            );
          }
        } catch (error: unknown) {
          const err = error as { message?: string };
          setFileQueue((prev) =>
            prev.map((item) =>
              item.id === queueItem.id
                ? {
                    ...item,
                    progress: 0,
                    status: 'error',
                    error: err.message || 'Upload failed',
                  }
                : item
            )
          );
        }
      }

      if (successfulUrls.length && onUploadComplete) {
        onUploadComplete(successfulUrls);
      }
    },
    [folder, resourceType, multiple, onUploadSuccess, onUploadComplete]
  );

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleCopyUrl = (url: string) => {
    navigator.clipboard.writeText(url);
    setCopiedUrl(url);
    setTimeout(() => setCopiedUrl(null), 2000);
  };

  const removeQueueItem = (id: string) => {
    setFileQueue((prev) => prev.filter((item) => item.id !== id));
  };

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
  };

  const isGlbOr3D = (url: string) => {
    const lower = url.toLowerCase();
    return lower.endsWith('.glb') || lower.endsWith('.gltf') || lower.includes('/raw/upload/');
  };

  const isVideo = (url: string) => {
    const lower = url.toLowerCase();
    return (
      lower.endsWith('.mp4') ||
      lower.endsWith('.webm') ||
      lower.endsWith('.mov') ||
      lower.includes('/video/upload/')
    );
  };

  return (
    <div className={`flex flex-col gap-3 ${className}`}>
      {label && (
        <div className="flex items-center justify-between">
          <label className="text-xs font-semibold text-zinc-300 uppercase tracking-wider">
            {label}
          </label>
          {helperText && <span className="text-[11px] text-zinc-500">{helperText}</span>}
        </div>
      )}

      {/* Existing Value Preview (when provided and not actively uploading a replacement) */}
      {currentValue && fileQueue.length === 0 && (
        <div className="relative group p-3.5 rounded-2xl bg-zinc-900/90 border border-zinc-800 hover:border-zinc-700 transition-all">
          <div className="flex items-center gap-3.5">
            {/* Visual preview box */}
            <div className="relative w-14 h-14 rounded-xl bg-black overflow-hidden shrink-0 border border-zinc-800 flex items-center justify-center">
              {isGlbOr3D(currentValue) ? (
                <div className="flex flex-col items-center gap-1">
                  <Box className="w-6 h-6 text-purple-400" />
                  <span className="text-[9px] font-mono text-purple-300">.GLB 3D</span>
                </div>
              ) : isVideo(currentValue) ? (
                <div className="flex flex-col items-center gap-1">
                  <Video className="w-6 h-6 text-cyan-400" />
                  <span className="text-[9px] font-mono text-cyan-300">4K VIDEO</span>
                </div>
              ) : (
                <Image
                  src={currentValue}
                  alt="Uploaded media"
                  fill
                  className="object-cover"
                />
              )}
            </div>

            {/* URL details */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-zinc-200">Current Cloudinary Asset</span>
                <span className="px-1.5 py-0.5 rounded text-[9px] font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  ONLINE
                </span>
              </div>
              <p className="text-[11px] text-zinc-400 font-mono truncate max-w-full mt-0.5" title={currentValue}>
                {currentValue}
              </p>
            </div>

            {/* Action buttons */}
            <div className="flex items-center gap-1.5 shrink-0">
              <button
                type="button"
                onClick={() => handleCopyUrl(currentValue)}
                className="p-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white transition-colors"
                title="Copy Cloudinary URL"
              >
                {copiedUrl === currentValue ? (
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                ) : (
                  <Copy className="w-3.5 h-3.5" />
                )}
              </button>

              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="p-2 rounded-xl bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 hover:text-blue-300 border border-blue-500/30 transition-colors"
                title="Replace Asset"
              >
                <RefreshCw className="w-3.5 h-3.5" />
              </button>

              {onClear && (
                <button
                  type="button"
                  onClick={() => {
                    setModelWarning(null);
                    onClear();
                  }}
                  className="p-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 transition-colors"
                  title="Remove Asset"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Main Drag-and-Drop Zone */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`relative flex flex-col items-center justify-center cursor-pointer transition-all duration-200 group ${
          compact ? 'p-4 rounded-2xl' : 'p-6 sm:p-8 rounded-3xl'
        } border-2 border-dashed ${
          isDragOver
            ? 'border-blue-500 bg-blue-500/10 shadow-[0_0_30px_rgba(59,130,246,0.2)] scale-[1.01]'
            : 'border-zinc-800 hover:border-zinc-600 bg-[#0e0e14] hover:bg-[#12121c]'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          onChange={(e) => {
            if (e.target.files && e.target.files.length > 0) {
              handleFiles(e.target.files);
            }
          }}
          className="hidden"
        />

        <div className="flex flex-col items-center gap-3 text-center">
          <div
            className={`rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center transition-transform group-hover:scale-110 shadow-lg ${
              compact ? 'w-10 h-10' : 'w-12 h-12'
            }`}
          >
            <UploadCloud className={`${compact ? 'w-5 h-5' : 'w-6 h-6'} text-blue-400`} />
          </div>

          <div className="flex flex-col gap-1">
            <p className="text-xs sm:text-sm font-semibold text-white">
              <span className="text-blue-400 underline decoration-blue-500/30 underline-offset-4">
                Click to upload
              </span>{' '}
              or drag & drop
            </p>
            <p className="text-[11px] text-zinc-400">
              High-res photos, 4K video background reels, or raw .glb 3D files
            </p>
          </div>
        </div>
      </div>

      {modelWarning && (
        <p className="text-xs text-red-400 leading-relaxed">{modelWarning}</p>
      )}

      {/* Active Upload Queue & Real-time Progress */}
      {fileQueue.length > 0 && (
        <div className="flex flex-col gap-2.5 mt-1">
          {fileQueue.map((item) => (
            <div
              key={item.id}
              className="p-3.5 rounded-2xl bg-[#121218] border border-zinc-800/80 flex flex-col gap-2 shadow-sm"
            >
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="p-2 rounded-xl bg-zinc-900 border border-zinc-800 shrink-0">
                    {getResourceTypeIcon(item.name, item.resourceType)}
                  </div>

                  <div className="flex flex-col min-w-0">
                    <span className="text-xs font-semibold text-zinc-200 truncate" title={item.name}>
                      {item.name}
                    </span>
                    <div className="flex items-center gap-2 text-[10px] text-zinc-500 font-mono">
                      <span>{formatBytes(item.size)}</span>
                      <span>•</span>
                      {item.status === 'uploading' && (
                        <span className="text-blue-400 flex items-center gap-1">
                          <Loader2 className="w-3 h-3 animate-spin" /> Uploading to Cloudinary...
                        </span>
                      )}
                      {item.status === 'success' && (
                        <span className="text-emerald-400 flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" /> Uploaded successfully
                        </span>
                      )}
                      {item.status === 'error' && (
                        <span className="text-red-400 flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" /> {item.error || 'Upload failed'}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {item.status === 'success' && item.url && (
                    <button
                      type="button"
                      onClick={() => handleCopyUrl(item.url!)}
                      className="p-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors"
                      title="Copy Cloudinary URL"
                    >
                      {copiedUrl === item.url ? (
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={() => removeQueueItem(item.id)}
                    className="p-1.5 rounded-lg hover:bg-zinc-800 text-zinc-500 hover:text-zinc-300 transition-colors"
                    title="Dismiss"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Progress bar */}
              {item.status === 'uploading' && (
                <div className="w-full bg-zinc-900 h-1.5 rounded-full overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-blue-600 to-cyan-500 h-full rounded-full transition-all duration-300 animate-pulse"
                    style={{ width: `${item.progress}%` }}
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

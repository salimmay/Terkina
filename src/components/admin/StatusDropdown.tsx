'use client';

import React, { useState } from 'react';
import { createClient } from '@/lib/supabase/client';

export type ProjectStatus = 'PUBLISHED' | 'DRAFT' | 'ARCHIVED';

interface StatusDropdownProps {
  projectId: string;
  initialStatus: ProjectStatus;
  tableName?: 'photo_project' | 'three_d_project';
  onUpdate?: (newStatus: ProjectStatus) => void;
}

export default function StatusDropdown({
  projectId,
  initialStatus,
  tableName = 'photo_project',
  onUpdate,
}: StatusDropdownProps) {
  const [status, setStatus] = useState<ProjectStatus>(initialStatus);
  const [loading, setLoading] = useState(false);

  const handleStatusChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newStatus = e.target.value as ProjectStatus;
    const previousStatus = status;

    // 1. Optimistic UI update (updates badge color immediately)
    setStatus(newStatus);
    setLoading(true);

    try {
      // 2. Save directly to Supabase
      const supabase = createClient();
      const { error } = await supabase
        .from(tableName)
        .update({ status: newStatus })
        .eq('id', projectId);

      if (error) throw error;

      if (onUpdate) onUpdate(newStatus);
    } catch (err) {
      const e = err as { message?: string };
      console.error('Failed to update status:', err);
      // Rollback on failure
      setStatus(previousStatus);
      alert(`Status update failed: ${e.message || 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  // Dynamic styling based on selected status
  const getStatusStyles = () => {
    switch (status) {
      case 'PUBLISHED':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30 hover:border-emerald-500/60 focus:ring-emerald-500/30';
      case 'DRAFT':
        return 'bg-amber-500/10 text-amber-400 border-amber-500/30 hover:border-amber-500/60 focus:ring-amber-500/30';
      case 'ARCHIVED':
        return 'bg-white/5 text-white/50 border-white/10 hover:border-white/20 focus:ring-white/20';
    }
  };

  const getStatusIcon = () => {
    switch (status) {
      case 'PUBLISHED':
        return '✔';
      case 'DRAFT':
        return '⏱';
      case 'ARCHIVED':
        return '🗑';
    }
  };

  return (
    <div className="relative inline-flex items-center">
      {/* Custom styled select box */}
      <select
        value={status}
        disabled={loading}
        onChange={handleStatusChange}
        className={`appearance-none cursor-pointer pl-6 pr-7 py-1.5 rounded-full text-[11px] font-mono font-bold tracking-wider uppercase border transition-all duration-200 focus:outline-none focus:ring-2 disabled:opacity-50 ${getStatusStyles()}`}
      >
        <option value="PUBLISHED" className="bg-[#0b0a10] text-emerald-400 font-mono py-1">
          ✔ PUBLISHED
        </option>
        <option value="DRAFT" className="bg-[#0b0a10] text-amber-400 font-mono py-1">
          ⏱ DRAFT
        </option>
        <option value="ARCHIVED" className="bg-[#0b0a10] text-white/50 font-mono py-1">
          🗑 ARCHIVED
        </option>
      </select>

      {/* Leading Icon */}
      <span className="absolute left-2.5 pointer-events-none text-[10px]">
        {loading ? (
          <span className="w-2 h-2 rounded-full border border-current border-t-transparent animate-spin inline-block" />
        ) : (
          getStatusIcon()
        )}
      </span>

      {/* Trailing Dropdown Arrow Chevron */}
      <span className="absolute right-2.5 pointer-events-none text-[8px] opacity-60">▼</span>
    </div>
  );
}

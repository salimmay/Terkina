'use client';

import React, { useState } from 'react';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

export type ProjectStatus = 'PUBLISHED' | 'DRAFT' | 'ARCHIVED';

interface StatusDropdownProps {
  projectId: string;
  initialStatus: ProjectStatus;
  tableName?: 'photo_project' | 'three_d_project';
  onUpdate?: (newStatus: ProjectStatus) => void;
}

const STATUS_STYLES: Record<ProjectStatus, string> = {
  PUBLISHED: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/25',
  DRAFT: 'bg-amber-500/10 text-amber-400 border-amber-500/25',
  ARCHIVED: 'bg-zinc-800 text-zinc-400 border-zinc-700',
};

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

    setStatus(newStatus);
    setLoading(true);

    try {
      const supabase = createClient();
      const { error } = await supabase
        .from(tableName)
        .update({ status: newStatus })
        .eq('id', projectId);

      if (error) throw error;

      if (onUpdate) onUpdate(newStatus);
      toast.success(`Status changed to ${newStatus}.`);
    } catch (err) {
      const e = err as { message?: string };
      console.error('Failed to update status:', err);
      setStatus(previousStatus);
      toast.error(`Status update failed: ${e.message || 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative inline-flex items-center">
      <select
        value={status}
        disabled={loading}
        onChange={handleStatusChange}
        className={`appearance-none cursor-pointer pl-3 pr-7 py-1 rounded-full text-[11px] font-medium border transition-colors focus:outline-none disabled:opacity-50 ${STATUS_STYLES[status]}`}
      >
        <option value="PUBLISHED" className="bg-zinc-900 text-emerald-400">Published</option>
        <option value="DRAFT" className="bg-zinc-900 text-amber-400">Draft</option>
        <option value="ARCHIVED" className="bg-zinc-900 text-zinc-400">Archived</option>
      </select>

      {loading && (
        <Loader2 className="absolute right-1.5 w-3 h-3 animate-spin pointer-events-none" />
      )}
    </div>
  );
}

'use client';

import React, { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';

/**
 * Requires supabase/add_crm_extras.sql to be applied:
 *  - message_status enum extended with 'CONTACTED' and 'ARCHIVED'
 *  - `file_url` TEXT column on `message`
 */
interface MessageItem {
  id: string;
  sender_name: string;
  sender_email: string;
  content: string;
  file_url?: string | null;
  status: 'UNREAD' | 'READ' | 'CONTACTED' | 'ARCHIVED';
  created_at: string;
}

type Filter = 'ALL' | 'UNREAD' | 'CONTACTED' | 'ARCHIVED';

export default function AdminInboxPage() {
  const [messages, setMessages] = useState<MessageItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<Filter>('ALL');
  const supabase = createClient();

  const fetchMessages = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('message')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error && data) {
      setMessages(data as MessageItem[]);
    } else if (error) {
      console.error('Failed to load inbox:', error.message);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchMessages();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const updateStatus = async (id: string, status: MessageItem['status']) => {
    // Optimistic UI update
    const previous = messages.find((m) => m.id === id)?.status;
    setMessages((prev) => prev.map((m) => (m.id === id ? { ...m, status } : m)));

    const { error } = await supabase.from('message').update({ status }).eq('id', id);
    if (error) {
      console.error('Status update failed:', error.message);
      // Rollback
      if (previous) {
        setMessages((prev) => prev.map((m) => (m.id === id ? { ...m, status: previous } : m)));
      }
      alert('Failed to update status — are you authenticated as an admin?');
    }
  };

  const filteredMessages =
    filter === 'ALL' ? messages : messages.filter((m) => m.status === filter);

  // Service tag is embedded by /api/messages as "[Service: X] content"
  const parseService = (content: string): { service: string; body: string } => {
    const match = content.match(/^\[Service: ([^\]]+)\]\s*/);
    return match
      ? { service: match[1], body: content.slice(match[0].length) }
      : { service: 'General Inquiry', body: content };
  };

  const getServiceBadgeStyle = (service: string) => {
    if (service.includes('Wedding') || service.includes('Med Art')) {
      return 'bg-amber-500/10 text-amber-300 border-amber-500/30';
    }
    if (service.includes('Commercial') || service.includes('Terkina')) {
      return 'bg-cyan-500/10 text-cyan-300 border-cyan-500/30';
    }
    return 'bg-purple-500/10 text-purple-300 border-purple-500/30';
  };

  return (
    <div className="p-6 md:p-10 max-w-6xl mx-auto space-y-8 text-white">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
        <div>
          <h1 className="text-2xl font-black uppercase tracking-wider text-emerald-400">
            Client Inquiries & WhatsApp Leads
          </h1>
          <p className="text-xs font-mono text-white/50 mt-1">
            Real-time inquiries captured across Med Art, Terkina Commercial, and the 3D Print Lab.
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 bg-white/5 p-1 rounded-xl border border-white/10 text-xs font-mono">
          {(['ALL', 'UNREAD', 'CONTACTED', 'ARCHIVED'] as Filter[]).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                filter === f
                  ? 'bg-emerald-500 text-black font-bold shadow-md'
                  : 'text-white/60 hover:text-white'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Messages List */}
      {loading ? (
        <div className="text-center py-20 text-xs font-mono text-white/40 animate-pulse">
          Loading client inbox records...
        </div>
      ) : filteredMessages.length === 0 ? (
        <div className="text-center py-20 rounded-2xl border border-white/5 bg-white/[0.01]">
          <span className="text-2xl block mb-2">📬</span>
          <span className="text-xs font-mono text-white/40">
            No inquiries found in this category.
          </span>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredMessages.map((msg) => {
            const { service, body } = parseService(msg.content);
            return (
              <div
                key={msg.id}
                className={`p-5 rounded-2xl border transition-all flex flex-col md:flex-row md:items-start justify-between gap-4 ${
                  msg.status === 'UNREAD'
                    ? 'bg-emerald-950/15 border-emerald-500/30 shadow-lg shadow-emerald-950/20'
                    : msg.status === 'ARCHIVED'
                      ? 'bg-white/[0.01] border-white/5 opacity-60'
                      : 'bg-white/[0.02] border-white/10'
                }`}
              >
                <div className="space-y-2.5 max-w-2xl">
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="font-bold text-white text-sm">{msg.sender_name}</span>

                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono border ${getServiceBadgeStyle(service)}`}
                    >
                      {service}
                    </span>

                    <span className="text-[10px] font-mono text-white/30">
                      {new Date(msg.created_at).toLocaleDateString(undefined, {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>

                    {msg.status === 'UNREAD' && (
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                    )}
                  </div>

                  <p className="text-xs text-white/80 font-light leading-relaxed whitespace-pre-wrap">
                    {body}
                  </p>

                  <a
                    href={`mailto:${msg.sender_email}`}
                    className="inline-flex items-center gap-1.5 text-[11px] font-mono text-purple-300 hover:text-purple-200 underline pt-1"
                  >
                    ✉ {msg.sender_email}
                  </a>

                  {msg.file_url && (
                    <a
                      href={msg.file_url}
                      target="_blank"
                      rel="noreferrer"
                      className="block w-fit items-center gap-1.5 text-[11px] font-mono text-cyan-300 hover:text-cyan-200 underline"
                    >
                      📎 Attached 3D File / Drive Link ↗
                    </a>
                  )}
                </div>

                {/* Status Actions */}
                <div className="flex items-center gap-2 self-end md:self-start shrink-0">
                  {msg.status !== 'CONTACTED' && msg.status !== 'ARCHIVED' && (
                    <button
                      type="button"
                      onClick={() => updateStatus(msg.id, 'CONTACTED')}
                      className="px-3 py-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] font-mono transition-all cursor-pointer"
                    >
                      Mark Contacted
                    </button>
                  )}
                  {msg.status !== 'ARCHIVED' && (
                    <button
                      type="button"
                      onClick={() => updateStatus(msg.id, 'ARCHIVED')}
                      className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white/40 border border-white/10 text-[10px] font-mono transition-all cursor-pointer"
                    >
                      Archive
                    </button>
                  )}
                  {msg.status === 'ARCHIVED' && (
                    <button
                      type="button"
                      onClick={() => updateStatus(msg.id, 'UNREAD')}
                      className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white/60 border border-white/10 text-[10px] font-mono transition-all cursor-pointer"
                    >
                      Restore
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

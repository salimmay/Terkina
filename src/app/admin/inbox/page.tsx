'use client';

import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { Inbox, Mail, Paperclip } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { PageHeader, Card, Badge, Button, EmptyState } from '@/components/admin/ui';

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
      if (error.code === 'PGRST205') {
        console.warn('Supabase table `message` not yet created. Run `supabase/complete_setup.sql`.');
      } else {
        console.error('Failed to load inbox:', error.message);
      }
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchMessages();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const updateStatus = async (id: string, status: MessageItem['status']) => {
    const previous = messages.find((m) => m.id === id)?.status;
    setMessages((prev) => prev.map((m) => (m.id === id ? { ...m, status } : m)));

    const { error } = await supabase.from('message').update({ status }).eq('id', id);
    if (error) {
      console.error('Status update failed:', error.message);
      if (previous) {
        setMessages((prev) => prev.map((m) => (m.id === id ? { ...m, status: previous } : m)));
      }
      toast.error('Failed to update status — are you authenticated as an admin?');
    } else {
      toast.success(`Marked as ${status}.`);
    }
  };

  const filteredMessages =
    filter === 'ALL' ? messages : messages.filter((m) => m.status === filter);

  const parseService = (content: string): { service: string; body: string } => {
    const match = content.match(/^\[Service: ([^\]]+)\]\s*/);
    return match
      ? { service: match[1], body: content.slice(match[0].length) }
      : { service: 'General Inquiry', body: content };
  };

  const getServiceTone = (service: string): 'amber' | 'cyan' | 'purple' => {
    if (service.includes('Wedding') || service.includes('Med Art')) return 'amber';
    if (service.includes('Commercial') || service.includes('Terkina')) return 'cyan';
    return 'purple';
  };

  return (
    <div>
      <PageHeader
        title="Leads & Inbox"
        description="Real-time inquiries captured across Med Art, Terkina Commercial, and the 3D Print Lab."
        action={
          <div className="flex items-center gap-1 bg-zinc-900 p-1 rounded-md border border-zinc-800 text-xs">
            {(['ALL', 'UNREAD', 'CONTACTED', 'ARCHIVED'] as Filter[]).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-2.5 py-1 rounded transition-colors cursor-pointer ${
                  filter === f ? 'bg-zinc-700 text-white font-medium' : 'text-zinc-500 hover:text-white'
                }`}
              >
                {f.charAt(0) + f.slice(1).toLowerCase()}
              </button>
            ))}
          </div>
        }
      />

      {loading ? (
        <div className="text-center py-16 text-xs text-zinc-500">Loading client inbox records...</div>
      ) : filteredMessages.length === 0 ? (
        <Card>
          <EmptyState icon={Inbox} title="No inquiries found" description="Nothing matches this filter yet." />
        </Card>
      ) : (
        <div className="space-y-3">
          {filteredMessages.map((msg) => {
            const { service, body } = parseService(msg.content);
            return (
              <Card key={msg.id} className={msg.status === 'ARCHIVED' ? 'opacity-60' : ''}>
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                  <div className="space-y-2 max-w-2xl min-w-0">
                    <div className="flex flex-wrap items-center gap-2.5">
                      <span className="font-medium text-white text-sm">{msg.sender_name}</span>
                      <Badge tone={getServiceTone(service)}>{service}</Badge>
                      <span className="text-[11px] text-zinc-600">
                        {new Date(msg.created_at).toLocaleDateString(undefined, {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                      {msg.status === 'UNREAD' && <Badge tone="success" dot>New</Badge>}
                    </div>

                    <p className="text-sm text-zinc-300 font-light leading-relaxed whitespace-pre-wrap">
                      {body}
                    </p>

                    <a
                      href={`mailto:${msg.sender_email}`}
                      className="inline-flex items-center gap-1.5 text-xs text-zinc-500 hover:text-zinc-300 transition-colors"
                    >
                      <Mail className="w-3.5 h-3.5" /> {msg.sender_email}
                    </a>

                    {msg.file_url && (
                      <a
                        href={msg.file_url}
                        target="_blank"
                        rel="noreferrer"
                        className="flex w-fit items-center gap-1.5 text-xs text-cyan-400 hover:text-cyan-300 transition-colors"
                      >
                        <Paperclip className="w-3.5 h-3.5" /> Attached file / link
                      </a>
                    )}
                  </div>

                  <div className="flex items-center gap-2 self-end md:self-start shrink-0">
                    {msg.status !== 'CONTACTED' && msg.status !== 'ARCHIVED' && (
                      <Button variant="secondary" size="sm" onClick={() => updateStatus(msg.id, 'CONTACTED')}>
                        Mark contacted
                      </Button>
                    )}
                    {msg.status !== 'ARCHIVED' && (
                      <Button variant="ghost" size="sm" onClick={() => updateStatus(msg.id, 'ARCHIVED')}>
                        Archive
                      </Button>
                    )}
                    {msg.status === 'ARCHIVED' && (
                      <Button variant="ghost" size="sm" onClick={() => updateStatus(msg.id, 'UNREAD')}>
                        Restore
                      </Button>
                    )}
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}

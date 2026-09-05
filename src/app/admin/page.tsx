'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Heart, Clapperboard, Box, Inbox, Plus } from 'lucide-react';
import { getLiveStats, getMessages, MessageData } from '@/lib/crmService';
import { PageHeader, StatCard, Card, CardHeader, Badge, Button, EmptyState } from '@/components/admin/ui';

export default function AdminOverviewPage() {
  const [stats, setStats] = useState({
    weddingsCount: 0,
    commercialCount: 0,
    productsCount: 0,
    unreadMessages: 0,
  });
  const [recentMessages, setRecentMessages] = useState<MessageData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [liveStats, messages] = await Promise.all([
          getLiveStats(),
          getMessages('ALL'),
        ]);
        setStats(liveStats);
        setRecentMessages(messages.slice(0, 5));
      } catch (err) {
        console.error('Failed to load CRM overview data:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  return (
    <div>
      <PageHeader
        title="Overview"
        description="Live records across Med Art, Terkina Commercial, and the 3D Print Lab."
        action={
          <>
            <Link href="/admin/weddings/new">
              <Button variant="secondary" size="sm" icon={<Plus className="w-3.5 h-3.5" />}>
                New album
              </Button>
            </Link>
            <Link href="/admin/products/new">
              <Button variant="primary" size="sm" icon={<Plus className="w-3.5 h-3.5" />}>
                New 3D item
              </Button>
            </Link>
          </>
        }
      />

      {/* Live Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard
          href="/admin/weddings"
          icon={Heart}
          label="Med Art Weddings"
          value={stats.weddingsCount}
          hint="Active published albums"
          loading={loading}
          accent="amber"
        />
        <StatCard
          href="/admin/commercial"
          icon={Clapperboard}
          label="Commercial Production"
          value={stats.commercialCount}
          hint="Production sets & reels"
          loading={loading}
          accent="cyan"
        />
        <StatCard
          href="/admin/products"
          icon={Box}
          label="3D Print Catalog"
          value={stats.productsCount}
          hint="Physical 3D objects"
          loading={loading}
          accent="purple"
        />
        <StatCard
          href="/admin/inbox"
          icon={Inbox}
          label="Incoming Leads"
          value={stats.unreadMessages}
          hint="Unread client inquiries"
          loading={loading}
          accent="emerald"
        />
      </div>

      {/* Recent Activity Feed */}
      <Card>
        <CardHeader
          title="Recent inquiries"
          action={
            <Link href="/admin/inbox" className="text-xs text-zinc-400 hover:text-white transition-colors">
              View all →
            </Link>
          }
        />

        {loading ? (
          <div className="py-10 text-center text-xs text-zinc-500">Loading recent records...</div>
        ) : recentMessages.length === 0 ? (
          <EmptyState
            icon={Inbox}
            title="No inquiries yet"
            description="Contact form submissions will appear here as they come in."
          />
        ) : (
          <div className="divide-y divide-zinc-800 -mx-5">
            {recentMessages.map((msg) => (
              <div key={msg.id} className="px-5 py-3 flex items-center justify-between gap-4">
                <div className="min-w-0">
                  <span className="font-medium text-white text-sm block truncate">{msg.sender_name}</span>
                  <span className="text-zinc-500 text-xs">{msg.service}</span>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <span className="text-[11px] text-zinc-600">
                    {new Date(msg.created_at).toLocaleDateString()}
                  </span>
                  <Badge tone={msg.status === 'UNREAD' ? 'success' : 'neutral'}>{msg.status}</Badge>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}

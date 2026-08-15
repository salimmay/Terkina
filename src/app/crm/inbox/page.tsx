import Link from 'next/link';
import { Inbox, ArrowLeft, Mail, Clock } from 'lucide-react';

export default function CrmInboxPage() {
  const mockMessages = [
    {
      id: 'm1',
      senderName: 'Elena Rostova',
      senderEmail: 'elena@designstudio.de',
      subject: 'Architectural Photography Inquiry',
      content: 'Hello, we love your brutalist shoot series and would like to commission a 3-day architectural shoot in Berlin.',
      status: 'UNREAD',
      date: '10 minutes ago',
    },
    {
      id: 'm2',
      senderName: 'Marcus Vance',
      senderEmail: 'm.vance@techkinetic.com',
      subject: 'Custom 3D Printing Prototype',
      content: 'We need 5 units of high-precision PETG Carbon Fiber lattice components printed for our aerospace testing module.',
      status: 'UNREAD',
      date: '2 hours ago',
    },
    {
      id: 'm3',
      senderName: 'Sarah Jenkins',
      senderEmail: 'sarah@jenkinsweddings.co',
      subject: 'Summer 2027 Destination Wedding',
      content: 'Inquiring about full weekend coverage in Amalfi Coast for July 2027.',
      status: 'READ',
      date: 'Yesterday',
    },
  ];

  return (
    <div className="flex flex-col gap-6 max-w-5xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading font-black text-3xl text-white tracking-tight">
            Client Inquiry Inbox
          </h1>
          <p className="text-zinc-400 text-sm">
            Contact form submissions and client commission requests
          </p>
        </div>
        <Link
          href="/crm"
          className="px-4 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-300 text-xs font-semibold hover:text-white flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Dashboard
        </Link>
      </div>

      <div className="flex flex-col gap-4">
        {mockMessages.map((msg) => (
          <div
            key={msg.id}
            className={`p-5 rounded-2xl border flex flex-col gap-3 transition-colors ${
              msg.status === 'UNREAD'
                ? 'bg-[#15151e] border-blue-500/40'
                : 'bg-[#101014] border-zinc-800 opacity-80'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className={`p-2 rounded-lg ${msg.status === 'UNREAD' ? 'bg-blue-500/20 text-blue-400' : 'bg-zinc-800 text-zinc-400'}`}>
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-white text-sm">{msg.senderName}</h4>
                  <span className="text-xs text-zinc-400">{msg.senderEmail}</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-xs text-zinc-500 flex items-center gap-1">
                  <Clock className="w-3 h-3" /> {msg.date}
                </span>
                {msg.status === 'UNREAD' && (
                  <span className="px-2 py-0.5 rounded-full bg-blue-500/20 border border-blue-500/40 text-blue-300 text-[10px] font-bold">
                    UNREAD
                  </span>
                )}
              </div>
            </div>

            <div className="pl-9">
              <h5 className="text-sm font-semibold text-zinc-200">{msg.subject}</h5>
              <p className="text-xs text-zinc-400 mt-1 leading-relaxed">{msg.content}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

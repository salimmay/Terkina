import Link from 'next/link';
import { FolderTree, ArrowLeft } from 'lucide-react';

export default function CrmCategoriesPage() {
  return (
    <div className="flex flex-col gap-6 max-w-5xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading font-black text-3xl text-white tracking-tight">
            Categories Management
          </h1>
          <p className="text-zinc-400 text-sm">
            Create, rename, and organize photography & 3D project tags
          </p>
        </div>
        <Link
          href="/crm"
          className="px-4 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-300 text-xs font-semibold hover:text-white flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Dashboard
        </Link>
      </div>

      <div className="p-8 rounded-2xl bg-[#121218] border border-zinc-800 flex flex-col items-center justify-center text-center gap-4 py-16">
        <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
          <FolderTree className="w-8 h-8" />
        </div>
        <h3 className="font-heading font-bold text-xl text-white">Category Taxonomy Manager</h3>
        <p className="text-zinc-400 text-sm max-w-md">
          Manage dynamic project categories (Weddings, Events, Shootings, Graduation, Parametric Design, etc.).
        </p>
      </div>
    </div>
  );
}

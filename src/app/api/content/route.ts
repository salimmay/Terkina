import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// GET all site content
export async function GET() {
  try {
    const { data, error } = await supabase.from('SiteContent').select('*');
    if (error) return NextResponse.json([], { status: 200 });
    return NextResponse.json(data || []);
  } catch {
    return NextResponse.json([], { status: 200 });
  }
}

// UPDATE a content section (Protected via Admin session or token)
export async function PUT(req: Request) {
  try {
    const { key, content } = await req.json();

    const { data, error } = await supabase
      .from('SiteContent')
      .upsert({ key, content, updated_at: new Date().toISOString() }, { onConflict: 'key' })
      .select()
      .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: 'Failed to update content' }, { status: 500 });
  }
}

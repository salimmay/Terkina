import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { sender_name, service, content } = body;

    if (!sender_name || !content) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    try {
      const supabase = await createClient();
      await supabase.from('message').insert({
        sender_name,
        sender_email: body.sender_email || `${sender_name.toLowerCase().replace(/\s+/g, '.')}@whatsapp.lead`,
        content: `[Service: ${service || 'General'}] ${content}`,
      });
    } catch (dbError) {
      console.error('Lead database insertion fallback:', dbError);
    }

    return NextResponse.json({ success: true, message: 'Lead logged successfully' });
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

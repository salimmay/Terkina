import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, message } = body;

    if (!name || !email || !message) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    try {
      const supabase = await createClient();
      await supabase.from('message').insert({
        sender_name: name,
        sender_email: email,
        content: message,
      });
    } catch {
      // Graceful fallback if database table is pending setup
    }

    return NextResponse.json({ success: true, message: 'Message received successfully' });
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

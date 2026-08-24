import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { MessageSchema } from '@/lib/validations';

// ---------------------------------------------------------------------------
// In-Memory Rate Limiter (IP tracking) — anti-spam / DoS protection
// NOTE: for multi-instance production deployments, swap for Upstash Redis
// or an edge-based limiter so counters are shared across instances.
// ---------------------------------------------------------------------------
const rateLimitMap = new Map<string, { count: number; expiresAt: number }>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const limitWindow = 10 * 60 * 1000; // 10 minutes
  const maxRequests = 5; // Max 5 inquiries per IP per window

  // Periodic cleanup to avoid unbounded memory growth
  if (rateLimitMap.size > 10_000) {
    for (const [key, record] of rateLimitMap) {
      if (now > record.expiresAt) rateLimitMap.delete(key);
    }
  }

  const record = rateLimitMap.get(ip);
  if (!record || now > record.expiresAt) {
    rateLimitMap.set(ip, { count: 1, expiresAt: now + limitWindow });
    return false;
  }

  if (record.count >= maxRequests) {
    return true;
  }

  record.count += 1;
  return false;
}

export async function POST(request: Request) {
  try {
    // 1. Rate Limiting Check
    const ip =
      request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown-ip';
    if (isRateLimited(ip)) {
      return NextResponse.json(
        { error: 'Too many requests. Please wait a few minutes before submitting again.' },
        { status: 429 }
      );
    }

    // 2. Strict Input Validation via Zod (anti-SQLi / malformed payloads)
    const body = await request.json();
    const validated = MessageSchema.parse(body);

    // 3. Parameterized PostgREST Insert (immune to SQL injection)
    try {
      const supabase = await createClient();
      await supabase.from('message').insert({
        sender_name: validated.sender_name,
        sender_email:
          validated.sender_email ||
          `${validated.sender_name.toLowerCase().replace(/\s+/g, '.')}@whatsapp.lead`,
        content: `[Service: ${validated.service}] ${validated.content}`,
        file_url: validated.file_url || null,
      });
    } catch (dbError) {
      // Never block the WhatsApp dispatch on lead-backup failure
      console.error('Lead database insertion fallback:', dbError);
    }

    return NextResponse.json({ success: true, message: 'Lead logged successfully' });
  } catch (err: unknown) {
    const zodError = err as { issues?: unknown[] };
    if (zodError?.issues) {
      // Zod Validation Error — reject malicious/invalid payloads
      return NextResponse.json(
        { error: 'Validation failed', details: zodError.issues },
        { status: 400 }
      );
    }
    console.error('Secure message ingestion error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

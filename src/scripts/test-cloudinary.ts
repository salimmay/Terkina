/**
 * Cloudinary Connection Test
 *
 * Verifies that:
 *  1. All required CLOUDINARY_* env vars are present in .env
 *  2. The credentials authenticate against the Cloudinary API (api.ping)
 *  3. A tiny real upload works end-to-end (same code path as /api/upload)
 *
 * Run with:
 *   npx tsx --env-file=.env src/scripts/test-cloudinary.ts
 */

import { v2 as cloudinary } from 'cloudinary';

// Mirror the exact config used in src/app/api/upload/route.ts
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

async function main() {
  console.log('--- Cloudinary Connection Test ---\n');

  // Step 1: Check env vars
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME || process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;

  const missing: string[] = [];
  if (!cloudName) missing.push('CLOUDINARY_CLOUD_NAME');
  if (!apiKey) missing.push('CLOUDINARY_API_KEY');
  if (!apiSecret) missing.push('CLOUDINARY_API_SECRET');

  if (missing.length > 0) {
    console.error('❌ FAIL — Missing environment variables in .env:');
    missing.forEach((v) => console.error(`   • ${v}`));
    console.error('\nAdd them to .env (Dashboard → Settings → API Keys), then re-run.');
    process.exit(1);
  }

  console.log('✅ Env vars found:');
  console.log(`   cloud_name : ${cloudName}`);
  console.log(`   api_key    : ${apiKey!.slice(0, 4)}••••${apiKey!.slice(-4)}`);
  console.log(
    `   api_secret : ${apiSecret!.slice(0, 2)}•••• (${apiSecret!.length} chars — real secrets are ~27)`
  );
  if (apiSecret!.length < 20) {
    console.warn('   ⚠️  WARNING: api_secret looks truncated. If auth fails below, re-copy it from the dashboard.');
  }

  // Step 2: Ping the API (auth check)
  console.log('\n[1/2] Pinging Cloudinary API...');
  try {
    const ping = await new Promise<{ status?: string }>((resolve, reject) => {
      cloudinary.api.ping((err, res) => (err ? reject(err) : resolve(res as { status?: string })));
    });
    console.log(`✅ Ping OK — status: ${ping.status}`);
  } catch (err) {
    const e = err as { message?: string; http_code?: number };
    console.error('❌ Ping FAILED:', e.message);
    if (e.http_code === 401) {
      console.error('   → 401 Unauthorized: api_key or api_secret is invalid.');
    } else if (e.http_code === 404) {
      console.error('   → 404 Not Found: cloud_name does not exist.');
    }
    process.exit(1);
  }

  // Step 3: Real upload round-trip (mirrors /api/upload behavior)
  console.log('\n[2/2] Uploading 1x1 test PNG (folder: terkina/_connection_test)...');
  const TINY_PNG_BASE64 =
    'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==';
  try {
    const result = await cloudinary.uploader.upload(`data:image/png;base64,${TINY_PNG_BASE64}`, {
      folder: 'terkina/_connection_test',
      public_id: `conn-test-${Date.now()}`,
      resource_type: 'image',
    });
    console.log('✅ Upload OK');
    console.log(`   public_id  : ${result.public_id}`);
    console.log(`   secure_url : ${result.secure_url}`);

    // Cleanup so your media library stays clean
    await cloudinary.uploader.destroy(result.public_id);
    console.log('   🧹 Test asset deleted from Cloudinary.');
  } catch (err) {
    const e = err as { message?: string };
    console.error('❌ Upload FAILED:', e.message);
    process.exit(1);
  }

  console.log('\n🎉 SUCCESS — Cloudinary is fully connected and ready for /api/upload.');
}

main().catch((e) => {
  console.error('Unexpected error:', e);
  process.exit(1);
});

import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

// Parse .env file manually
const envPath = path.resolve(process.cwd(), '.env');
if (fs.existsSync(envPath)) {
  const envConfig = fs.readFileSync(envPath, 'utf8');
  envConfig.split('\n').forEach((line) => {
    const [key, value] = line.split('=');
    if (key && value) {
      process.env[key.trim()] = value.trim();
    }
  });
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

console.log('====================================================');
console.log('          SUPABASE CONNECTION DIAGNOSTIC            ');
console.log('====================================================');
console.log('Target URL:', supabaseUrl);
console.log('Target Key:', supabaseKey ? `${supabaseKey.substring(0, 15)}...` : 'MISSING');

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ ERROR: Missing NEXT_PUBLIC_SUPABASE_URL or Key in environment!');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function testConnection() {
  try {
    // 1. Test pinging health / photo_project table
    console.log('\n[1/3] Querying `photo_project` table...');
    const { data: photoData, error: photoError } = await supabase
      .from('photo_project')
      .select('*')
      .limit(5);

    if (photoError) {
      console.log('⚠️ photo_project table response:', photoError.message, `(Code: ${photoError.code})`);
    } else {
      console.log('✅ photo_project table CONNECTED! Active rows:', photoData?.length ?? 0);
    }

    // 2. Test querying `three_d_project` table
    console.log('\n[2/3] Querying `three_d_project` table...');
    const { data: threeDData, error: threeDError } = await supabase
      .from('three_d_project')
      .select('*')
      .limit(5);

    if (threeDError) {
      console.log('⚠️ three_d_project table response:', threeDError.message, `(Code: ${threeDError.code})`);
    } else {
      console.log('✅ three_d_project table CONNECTED! Active rows:', threeDData?.length ?? 0);
    }

    // 3. Test storage buckets listing
    console.log('\n[3/3] Querying Storage buckets...');
    const { data: buckets, error: bucketError } = await supabase.storage.listBuckets();
    if (bucketError) {
      console.log('⚠️ Storage query response:', bucketError.message);
    } else {
      console.log('✅ Storage CONNECTED! Buckets:', buckets?.map((b) => b.name) || []);
    }

    console.log('\n====================================================');
    console.log('               DIAGNOSTIC COMPLETE                 ');
    console.log('====================================================');
  } catch (err) {
    console.error('❌ Connection test failed with exception:', err);
  }
}

testConnection();

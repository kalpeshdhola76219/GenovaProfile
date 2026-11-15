import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.log('Skipping Supabase migration: SUPABASE_URL or SUPABASE_KEY not provided.');
  process.exit(0);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function runMigration() {
  console.log('Checking Supabase tables connection...');
  try {
    const { data, error } = await supabase.from('orders').select('count', { count: 'exact', head: true });
    if (error) {
      console.warn('Orders table not queryable yet:', error.message);
    } else {
      console.log('Connected to Supabase orders table successfully. Count:', data);
    }
  } catch (err: any) {
    console.error('Migration error:', err.message);
  }
}

runMigration();

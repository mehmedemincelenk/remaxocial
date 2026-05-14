import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

dotenv.config({ path: './app/.env' })

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY)

async function checkEmin() {
  const { data, error } = await supabase.from('consultants').select('*').eq('slug', 'test-danisman').single();
  if (error) console.error(error);
  else console.log(data);
}

checkEmin();

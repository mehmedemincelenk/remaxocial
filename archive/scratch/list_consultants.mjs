import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
import path from 'path'

dotenv.config({ path: './app/.env' })

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY)

async function listConsultants() {
  console.log('--- Danışmanlar Listesi ---');
  const { data, error } = await supabase.from('consultants').select('full_name, slug, id');
  
  if (error) {
    console.error('Hata:', error.message);
  } else {
    console.table(data);
  }
}

listConsultants();

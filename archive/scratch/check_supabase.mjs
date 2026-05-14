import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

dotenv.config({ path: './app/.env' })

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY)

async function checkKnowledge() {
  console.log('--- Knowledge Tablosu Yapısı ---');
  const { data, error } = await supabase.from('knowledge').select('*').limit(1);
  
  if (error) {
    console.log('Hata:', error.message);
  } else if (data && data.length > 0) {
    console.log('Sütunlar:', Object.keys(data[0]));
    console.log('Örnek Veri:', data[0]);
  } else {
    console.log('Tablo boş veya bulunamadı.');
  }
}

checkKnowledge();

import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.VITE_SUPABASE_URL
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY
const supabase = createClient(supabaseUrl, supabaseKey)

async function deleteById() {
  const { data, error } = await supabase
    .from('objections')
    .delete()
    .eq('id', 63)

  if (error) {
    console.error('Silme Hatası:', error)
  } else {
    console.log('ID 63 için silme komutu gönderildi.')
  }
}

deleteById()

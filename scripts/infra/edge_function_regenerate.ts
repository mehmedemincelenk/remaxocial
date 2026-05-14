import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { script, id } = await req.json()
    const GROQ_API_KEY = Deno.env.get('GROQ_API_KEY')

    const prompt = `
    Sen Mehmed Emin Çelenk'sin. Gayrimenkulün usta hikaye anlatıcısısın.
    Aşağıda senin yazdığın bir sosyal medya haber metni var:
    "${script}"

    Bu metni, aynı gerçekleri koruyarak, farklı cümlelerle ve taze bir bakış açısıyla YENİDEN YAZ. 
    Karakterin (Samimi, zeki, hızlı) aynı kalsın. 
    Maksimum 350 karakter. Sadece Türkçe Latin harfleri kullan.
    Sadece yeni metni döndür.
    `;

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${GROQ_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        messages: [{ role: 'user', content: prompt }],
        model: 'llama-3.3-70b-versatile',
        temperature: 0.7
      })
    })

    const data = await response.json()
    const newScript = data.choices[0].message.content.trim()

    // Veritabanını güncelle
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    if (id) {
      await supabaseClient
        .from('news')
        .update({ ai_script: newScript })
        .eq('id', id)
    }

    return new Response(JSON.stringify({ script: newScript }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    })
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    })
  }
})

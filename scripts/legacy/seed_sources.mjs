import 'dotenv/config';
import * as cheerio from 'cheerio';
import { createClient } from '@supabase/supabase-js';

// Not: User'ın gönderdiği HTML içeriğini burada simüle ediyoruz veya okuyoruz.
// Gerçek projede bu bir kez çalıştırılacak bir "seeding" işlemidir.

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_ANON_KEY;
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const htmlContent = `
<!-- User'ın paylaştığı HTML buraya gelecek, ben en kritik kısımları parse ediyorum -->
<h3 class="text-danger">Kategoriler</h3>
<input value="https://www.emlakhaberi.com/rss/arsa-arazi"> Arsa - Arazi
<input value="https://www.emlakhaberi.com/rss/ekonomi"> Ekonomi
<input value="https://www.emlakhaberi.com/rss/konut-projeleri"> Konut Projeleri
<input value="https://www.emlakhaberi.com/rss/gundem"> Gündem
<input value="https://www.emlakhaberi.com/rss/dunya"> Dünya
<input value="https://www.emlakhaberi.com/rss/teknoloji"> Teknoloji
<input value="https://www.emlakhaberi.com/rss/kentsel-donusum"> Kentsel Dönüşüm
<input value="https://www.emlakhaberi.com/rss/tiny-house"> Tiny House
<input value="https://www.emlakhaberi.com/rss/toki"> Toki
<input value="https://www.emlakhaberi.com/rss/finans"> Finans
<input value="https://www.emlakhaberi.com/rss/ihale"> İhale
<input value="https://www.emlakhaberi.com/rss/is-firsatlari"> İş Fırsatları
<input value="https://www.emlakhaberi.com/rss/yasam"> Yaşam
<input value="https://www.emlakhaberi.com/rss/emlak-rehberi"> Emlak Rehberi
`;

async function seed() {
    console.log('🌱 Kaynaklar veritabanına ekleniyor...');
    
    // HTML'den linkleri ve isimleri ayıklıyoruz (Kısaltılmış mantık)
    const sources = [
        { name: 'Arsa - Arazi', url: 'https://www.emlakhaberi.com/rss/arsa-arazi' },
        { name: 'Ekonomi', url: 'https://www.emlakhaberi.com/rss/ekonomi' },
        { name: 'Konut Projeleri', url: 'https://www.emlakhaberi.com/rss/konut-projeleri' },
        { name: 'Gündem', url: 'https://www.emlakhaberi.com/rss/gundem' },
        { name: 'Dünya', url: 'https://www.emlakhaberi.com/rss/dunya' },
        { name: 'Teknoloji', url: 'https://www.emlakhaberi.com/rss/teknoloji' },
        { name: 'Kentsel Dönüşüm', url: 'https://www.emlakhaberi.com/rss/kentsel-donusum' },
        { name: 'Tiny House', url: 'https://www.emlakhaberi.com/rss/tiny-house' },
        { name: 'Toki', url: 'https://www.emlakhaberi.com/rss/toki' },
        { name: 'Finans', url: 'https://www.emlakhaberi.com/rss/finans' },
        { name: 'İhale', url: 'https://www.emlakhaberi.com/rss/ihale' },
        { name: 'İş Fırsatları', url: 'https://www.emlakhaberi.com/rss/is-firsatlari' },
        { name: 'Yaşam', url: 'https://www.emlakhaberi.com/rss/yasam' },
        { name: 'Emlak Rehberi', url: 'https://www.emlakhaberi.com/rss/emlak-rehberi' },
        { name: 'Yapay Zeka', url: 'https://www.emlakhaberi.com/rss/yapay-zeka' }
    ];

    for (const source of sources) {
        const { error } = await supabase.from('sources').insert({
            name: source.name,
            rss_url: source.url,
            is_active: true
        });
        
        if (error) console.log(`⚠️ ${source.name} zaten var veya hata:`, error.message);
        else console.log(`✅ Eklendi: ${source.name}`);
    }

    console.log('🏁 Tohumlama bitti.');
}

seed();

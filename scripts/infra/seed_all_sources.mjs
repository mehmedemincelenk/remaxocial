import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_ANON_KEY;
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const rawUrls = `
https://www.emlakhaberi.com/rss https://www.emlakhaberi.com/rss/son-dakika https://www.emlakhaberi.com/rss/anasayfa https://www.emlakhaberi.com/rss/beyaz-esya https://www.emlakhaberi.com/rss/dekorasyon https://www.emlakhaberi.com/rss/dunya https://www.emlakhaberi.com/rss/ekonomi https://www.emlakhaberi.com/rss/kiptas https://www.emlakhaberi.com/rss/fuar https://www.emlakhaberi.com/rss/guncel-haberler https://www.emlakhaberi.com/rss/haber https://www.emlakhaberi.com/rss/is-firsatlari https://www.emlakhaberi.com/rss/is-firsatlari https://www.emlakhaberi.com/rss/konteyner-evler https://www.emlakhaberi.com/rss/kripto-para https://www.emlakhaberi.com/rss/lansmanlar https://www.emlakhaberi.com/rss/ornek-daireler https://www.emlakhaberi.com/rss/otomotiv-dunyasi https://www.emlakhaberi.com/rss/prefabrik-ev https://www.emlakhaberi.com/rss/projeler https://www.emlakhaberi.com/rss/saglik https://www.emlakhaberi.com/rss/siyaset https://www.emlakhaberi.com/rss/teknoloji https://www.emlakhaberi.com/rss/tiny-house https://www.emlakhaberi.com/rss/toki https://www.emlakhaberi.com/rss/villa-projeleri https://www.emlakhaberi.com/rss/yasam https://www.emlakhaberi.com/rss/arsa-arazi https://www.emlakhaberi.com/rss/bilgi-merkezi https://www.emlakhaberi.com/rss/dekorasyon-ve-mimari https://www.emlakhaberi.com/rss/egitim https://www.emlakhaberi.com/rss/emlak-haberleri https://www.emlakhaberi.com/rss/emlak-rehberi https://www.emlakhaberi.com/rss/finans https://www.emlakhaberi.com/rss/genel-foto-galeri https://www.emlakhaberi.com/rss/gundem https://www.emlakhaberi.com/rss/ihale https://www.emlakhaberi.com/rss/kentsel-donusum https://www.emlakhaberi.com/rss/konut-projeleri https://www.emlakhaberi.com/rss/kultur-sanat https://www.emlakhaberi.com/rss/magazin https://www.emlakhaberi.com/rss/otomotiv https://www.emlakhaberi.com/rss/perakende https://www.emlakhaberi.com/rss/prefabrik-evler https://www.emlakhaberi.com/rss/roportaj https://www.emlakhaberi.com/rss/sektorel https://www.emlakhaberi.com/rss/spor https://www.emlakhaberi.com/rss/ticari-projeler https://www.emlakhaberi.com/rss/tiny-house-modelleri https://www.emlakhaberi.com/rss/turizm https://www.emlakhaberi.com/rss/yapay-zeka https://www.emlakhaberi.com/rss/yerel
`;

async function seed() {
    console.log('🌱 Tüm kaynaklar ayıklanıyor ve veritabanına ekleniyor...');
    
    // Linkleri ayıkla ve temizle
    const urls = rawUrls.trim().split(/\s+/);
    const uniqueUrls = [...new Set(urls)];

    const sources = uniqueUrls.map(url => {
        // Linkin son kısmından isim türet (Örn: /rss/arsa-arazi -> Arsa-Arazi)
        let name = url.split('/').pop();
        if (name === 'rss') name = 'Genel';
        
        // İsmi güzelleştir (Kebab-case to Title Case)
        name = name.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
        
        return { name, rss_url: url, is_active: true };
    });

    // Önce tabloyu temizleyelim (Opsiyonel, mükerrer önlemek için)
    // await supabase.from('sources').delete().neq('id', '00000000-0000-0000-0000-000000000000');

    for (const source of sources) {
        const { error } = await supabase.from('sources').upsert(source, { onConflict: 'rss_url' });
        if (error) console.log(`⚠️ Hata (${source.name}):`, error.message);
        else console.log(`✅ Kaydedildi: ${source.name}`);
    }

    console.log(`🏁 İşlem tamam: ${sources.length} kaynak eklendi/güncellendi.`);
}

seed();

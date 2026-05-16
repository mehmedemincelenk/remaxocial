import { createClient } from '@supabase/supabase-js';
import axios from 'axios';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config();

const { SUPABASE_URL, SUPABASE_ANON_KEY, INSTA_USER_ID, INSTA_ACCESS_TOKEN } = process.env;

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
const BUCKET_NAME = 'story-temp'; // Supabase'de bu isimle bir 'Public' bucket olmalı

async function publishToInstagram(videoPath, index) {
  try {
    const fileName = `story_${index}_${Date.now()}.mp4`;
    const fileBuffer = fs.readFileSync(videoPath);

    console.log(`📤 [${index}] Supabase'e yükleniyor...`);
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(fileName, fileBuffer, { contentType: 'video/mp4' });

    if (uploadError) throw uploadError;

    const { data: { publicUrl } } = supabase.storage
      .from(BUCKET_NAME)
      .getPublicUrl(fileName);

    console.log(`🔗 [${index}] Public Link Hazır: ${publicUrl}`);

    // 1. Instagram Media Container Oluştur
    console.log(`📸 [${index}] Instagram Container oluşturuluyor...`);
    const containerRes = await axios.post(`https://graph.facebook.com/v19.0/${INSTA_USER_ID}/media`, {
      media_type: 'STORIES',
      video_url: publicUrl,
      access_token: INSTA_ACCESS_TOKEN
    });

    const creationId = containerRes.data.id;

    // 2. Yayınlama (Instagram'ın videoyu indirmesi için bekliyoruz)
    console.log(`⏳ [${index}] Instagram'ın videoyu işlemesi bekleniyor (30 sn)...`);
    await new Promise(resolve => setTimeout(resolve, 30000));

    console.log(`🚀 [${index}] Story yayına alınıyor...`);
    await axios.post(`https://graph.facebook.com/v19.0/${INSTA_USER_ID}/media_publish`, {
      creation_id: creationId,
      access_token: INSTA_ACCESS_TOKEN
    });

    console.log(`✅ [${index}] BAŞARIYLA PAYLAŞILDI!`);

    // 3. Supabase'den temizle
    console.log(`🧹 [${index}] Bulut temizleniyor...`);
    await supabase.storage.from(BUCKET_NAME).remove([fileName]);

  } catch (error) {
    console.error(`❌ [${index}] HATA:`, error.response?.data || error.message);
  }
}

// Tüm videoları sırayla işle
async function main() {
  const outDir = './out';
  if (!fs.existsSync(outDir)) {
    console.log("❌ 'out' klasörü bulunamadı. Önce render almalısın.");
    return;
  }

  const files = fs.readdirSync(outDir).filter(f => f.endsWith('.mp4'));
  console.log(`🎬 Toplam ${files.length} video bulundu. Seri paylaşım başlıyor...`);

  for (let i = 0; i < files.length; i++) {
    const videoPath = path.join(outDir, files[i]);
    await publishToInstagram(videoPath, i + 1);
    
    // Instagram'ın spam olarak algılamaması için her story arası biraz bekleme
    if (i < files.length - 1) {
      console.log("💤 Diğer story öncesi 10 saniye mola...");
      await new Promise(resolve => setTimeout(resolve, 10000));
    }
  }
  
  console.log("🏁 TÜM PAKET TAMAMLANDI! Diamond Standard.");
}

main();

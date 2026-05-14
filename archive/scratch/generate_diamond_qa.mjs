import dotenv from 'dotenv'
import fetch from 'node-fetch'
import fs from 'fs'

dotenv.config({ path: './app/.env' })

const GROQ_API_KEY = process.env.VITE_GROQ_API_KEY;

const categories = [
  "Fiyatlandırma Stratejileri",
  "Emlak Hukuku & Mevzuat",
  "Pazarlık & İtiraz Yönetimi",
  "Yatırım İstihbaratı",
  "Müşteri Psikolojisi",
  "Dijital Pazarlama & Branding",
  "Kriz Yönetimi & Masayı Kurtarma",
  "Lüks Gayrimenkul Segmenti",
  "Arsa & Arazi Geliştirme",
  "Kredi & Finansal Çözümler"
];

async function generateBatch(category, count = 30) { // Hız için 30'lu paketler
  const prompt = `
    Sen dünyanın en başarılı, 'Diamond Standard' seviyesinde hizmet veren bir gayrimenkul stratejistisin.
    Aşağıdaki kategoride ${count} adet gerçek, can yakıcı PROBLEM sorusu ve bu problemi çözen profesyonel STRATEJİK YANIT üret.
    
    KATEGORİ: ${category}
    
    FORMAT: JSON objesi döndür. Objenin içinde "data" adında bir array olsun.
    Array elemanları: { "question": "...", "answer": "...", "category": "${category}" }
    
    DİKKAT: Sadece JSON döndür. Teknik terimler kullan. Sorular acıtsın, cevaplar kurtarsın.
  `;

  try {
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${GROQ_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.8,
        response_format: { type: "json_object" }
      })
    });

    const result = await response.json();
    if (result.error) {
      console.error("API Error:", result.error);
      return [];
    }

    const contentStr = result.choices[0].message.content;
    const content = JSON.parse(contentStr);

    return content.data || content.questions || [];
  } catch (err) {
    console.error(`Batch Error (${category}):`, err);
    return [];
  }
}

async function startGeneration() {
  console.log("💎 Diamond Soru-Cevap Fabrikası (Llama-3.3) Ateşlendi!");
  let allQA = [];

  // Paralel üretimi hızlandırmak için Promise.all kullanıyoruz
  const tasks = categories.map(cat => generateBatch(cat, 50));
  const results = await Promise.all(tasks);

  results.forEach(batch => {
    allQA = [...allQA, ...batch];
  });

  if (allQA.length > 0) {
    fs.writeFileSync('./app/src/data/diamond_qa_bank.json', JSON.stringify(allQA, null, 2));
    console.log(`🏁 Üretim Tamamlandı! ${allQA.length} Diamond Soru Hazır.`);
  } else {
    console.log("❌ Veri üretilemedi. Model ismini veya kotayı kontrol et.");
  }
}

startGeneration();

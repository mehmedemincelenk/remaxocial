import dotenv from 'dotenv'
import fetch from 'node-fetch'
import fs from 'fs'

dotenv.config({ path: './app/.env' })

const GROQ_API_KEY = process.env.VITE_GROQ_API_KEY;

const masterData = JSON.parse(fs.readFileSync('./app/src/data/diamond_qa_master.json', 'utf8'));

const categories = [
  "Emlak Hukuku & Mevzuat",
  "Pazarlık & İtiraz Yönetimi",
  "Lüks Gayrimenkul Segmenti",
  "Arsa & Arazi Geliştirme",
  "Kriz Yönetimi & Masayı Kurtarma",
  "Fiyatlandırma Stratejileri",
  "Yatırım İstihbaratı",
  "Müşteri Psikolojisi"
];

async function generateQualityBatch(category, count = 12) {
  const prompt = `
    Sen dünyanın en başarılı, 'Diamond Standard' seviyesinde hizmet veren bir gayrimenkul stratejistisin.
    Aşağıdaki kategoride ${count} adet TÜRKİYE GAYRİMENKUL PAZARINA ÖZEL, profesyonel PROBLEM sorusu ve stratejik çözüm üret.
    
    KATEGORİ: ${category}
    
    FORMAT: JSON array döndür. [{ "question": "...", "answer": "...", "category": "${category}" }]
    DİKKAT: Sadece JSON döndür. Boş veya jenerik tavsiyelerden kaçın.
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
        temperature: 0.7,
        response_format: { type: "json_object" }
      })
    });

    const result = await response.json();
    const contentStr = result.choices[0].message.content;
    const content = JSON.parse(contentStr);
    
    // Her türlü yapıyı yakalamak için zırhlı mantık
    if (Array.isArray(content)) return content;
    if (content.data && Array.isArray(content.data)) return content.data;
    if (content.questions && Array.isArray(content.questions)) return content.questions;
    if (content.items && Array.isArray(content.items)) return content.items;
    
    // Eğer hala array değilse ama objeyse ve içindekiler Soru-Cevap ise
    const values = Object.values(content);
    if (values.length > 0 && Array.isArray(values[0])) return values[0];
    
    return [];
  } catch (err) {
    console.error(`Batch Error (${category}):`, err);
    return [];
  }
}

async function run() {
  console.log("💎 Kalan 90 'Altın Soru' İçin Son Saldırı...");
  let newItems = [];
  
  // Hız için kategorileri paralel işliyoruz
  const tasks = categories.map(cat => generateQualityBatch(cat, 12));
  const results = await Promise.all(tasks);
  
  results.forEach(batch => {
    if (batch && Array.isArray(batch)) {
        newItems = [...newItems, ...batch];
    }
  });
  
  const finalData = [...masterData, ...newItems];
  fs.writeFileSync('./app/src/data/diamond_qa_master.json', JSON.stringify(finalData, null, 2));
  console.log(`🏁 BİTTİ! Toplam ${finalData.length} adet 'Diamond Standard' içerik kütüphanende.`);
}

run();

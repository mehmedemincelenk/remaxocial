import 'dotenv/config';
import Parser from 'rss-parser';
import * as cheerio from 'cheerio';
import axios from 'axios';
import { createClient } from '@supabase/supabase-js';

// Configuration
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_ANON_KEY;

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
const parser = new Parser();

async function fetchDetails(url) {
    try {
        const { data } = await axios.get(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
            },
            timeout: 15000
        });
        const $ = cheerio.load(data);

        // Gereksiz elementleri temizle
        $('.post-flash, .post-navigation, .post-tags, script, style, .ads, .advertisement, #ad_121, .article-source').remove();

        // Haber Metni (Önce en garantileri dene)
        let content = $('.article-text').text().trim() ||
            $('[property="articleBody"]').text().trim() ||
            $('.entry-content').text().trim() ||
            $('.post-content').text().trim() ||
            $('.haber_metni').text().trim();

        // Fazla boşlukları temizle
        content = content.replace(/\s+/g, ' ').substring(0, 8000);

        return { content };
    } catch (error) {
        console.error(`   ❌ Detay çekilemedi (${url}):`, error.message);
        return { content: '' };
    }
}

// --- Dev Gayrimenkul & Lokasyon Sözlüğü ---
const NICHES = {
    "Arsa": ["arsa", "arazi", "parsel", "tarla", "imar", "zemin", "ada/parsel", "müstakil", "zeytinlik", "bağ bahçe", "köy evi"],
    "Ekonomi": ["dolar", "enflasyon", "finans", "para", "maliyet", "banka", "tcmb", "borsa", "yatırım", "piyasa", "altın"],
    "Kiralık": ["kira", "kiralık", "kiracı", "tahliye", "kontrat", "fahiş", "stopaj", "aidat", "kiralama"],
    "Satılık": ["satılık", "satım", "satış", "mülk", "devren", "ekspertiz", "alım-satım"],
    "Finansman": ["taksit", "peşinat", "vade", "elden ödeme", "kredi", "finansman", "senet", "faizsiz"],
    "Konut Projeleri": ["lansman", "daire", "rezidans", "site", "konut", "proje", "teslim", "örnek daire", "temel atma"],
    "Kentsel Dönüşüm": ["yıkım", "riskli yapı", "kentsel dönüşüm", "güçlendirme", "toki", "rezerv alan", "yarısı bizden", "kura"],
    "Lüks Konut": ["villa", "yalı", "malikane", "penthouse", "boğaz manzaralı", "özel havuzlu", "ultra lüks"],
    "Ticari": ["dükkan", "ofis", "plaza", "depo", "antrepo", "fabrika", "ticari", "otel", "işyeri", "lojistik"],
    "Hukuk & Tapu": ["tapu", "kadastro", "hisseli", "veraset", "intikal", "şerh", "ipotek", "hukuk", "dava"]
};

function autoTag(title, summary, content = '') {
    const text = (title + ' ' + (summary || '') + ' ' + content).toLowerCase();

    // --- KRİTİK: FAİZ SANSÜRÜ (v2.0) ---
    // 'faiz' geçecek ama 'faizsiz' geçmeyecek. 
    if (text.includes('faiz') && !text.includes('faizsiz')) {
        return "FORBIDDEN";
    }

    const discoveredNiches = [];
    for (const [niche, keywords] of Object.entries(NICHES)) {
        if (keywords.some(keyword => text.includes(keyword.toLowerCase()))) {
            discoveredNiches.push(niche);
        }
    }
    return discoveredNiches;
}

async function processSource(source) {
    console.log(`📡 Kaynak taranıyor: ${source.name}`);

    try {
        const feed = await parser.parseURL(source.rss_url.trim());
        let count = 0;

        for (const item of feed.items) {
            const { title, link, contentSnippet, pubDate, creator } = item;

            // --- Tazelik Filtresi (15 Gün) ---
            const fifteenDaysAgo = new Date();
            fifteenDaysAgo.setDate(fifteenDaysAgo.getDate() - 15);
            if (new Date(pubDate) < fifteenDaysAgo) continue;

            // --- SANSÜR KONTROLÜ ---
            // Detayları çek (İçerik burada iniyor)
            const { content } = await fetchDetails(link);

            // --- DETAYLI SANSÜR KONTROLÜ (Haber Metni Dahil) ---
            const deepCheck = autoTag(title, contentSnippet || '', content || '');
            if (deepCheck === "FORBIDDEN") {
                console.log(`   🚫 SANSÜR (İçerik): ${title.substring(0, 40)}... (Faiz tespit edildi)`);
                continue;
            }

            // Nişleri hazırla
            let finalCategories = new Set();
            finalCategories.add(source.name);
            autoNiches.forEach(n => finalCategories.add(n));

            const newsData = {
                title,
                summary: contentSnippet || '',
                content: content || '',
                source_url: link,
                author: creator || source.name,
                image_url: item.enclosure?.url || null,
                category: Array.from(finalCategories),
                published_at: pubDate,
                is_active: true
            };

            // UPSERT: Varsa güncelle, yoksa ekle (source_url üzerinden)
            const { error } = await supabase
                .from('news')
                .upsert(newsData, { onConflict: 'source_url' });

            if (!error) {
                count++;
                if (content && content.length > 100) {
                    console.log(`   ✅ [${count}] Başarılı: ${title.substring(0, 50)}... (${content.length} karakter)`);
                } else {
                    console.log(`   ⚠️ [${count}] İÇERİK BOŞ veya KISA: ${title.substring(0, 50)}...`);
                }
            } else {
                console.error(`   ❌ Kayıt Hatası:`, error.message);
            }
        }
        console.log(`📊 ${source.name} bitti. ${count} haber güncellendi/eklendi.`);
    } catch (error) {
        console.error(`❌ ${source.name} hatası:`, error.message);
    }
}

async function start() {
    console.log('🚀 Haber Intelligence Engine Başlatıldı...');

    // 15 günden eski haberleri temizle
    const fifteenDaysAgo = new Date();
    fifteenDaysAgo.setDate(fifteenDaysAgo.getDate() - 15);
    await supabase.from('news').delete().lt('published_at', fifteenDaysAgo.toISOString());

    const { data: sources } = await supabase.from('sources').select('*').eq('is_active', true);

    if (!sources || sources.length === 0) return;

    for (const source of sources) {
        await processSource(source);
    }
    console.log('🏁 İşlem tamamlandı.');
}

start();

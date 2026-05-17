import { COM_TYPES, PROMPT_MODULES } from '../config/promptConfigs';

export { COM_TYPES };

export const promptMixer = (activeIds, viewMode) => {
  let filteredIds = [...activeIds];

  // Logic: Conflict Resolution
  if (activeIds.includes('removal')) filteredIds = filteredIds.filter(id => id !== 'lifestyle');
  if (activeIds.includes('twilight')) filteredIds = filteredIds.filter(id => id !== 'light');

  // Logic: Space Barrier
  const outdoorOnly = ['drone', 'floorplan'];
  if (viewMode === 'indoor' || viewMode === 'commercial') filteredIds = filteredIds.filter(id => !outdoorOnly.includes(id));
  if (viewMode === 'outdoor') filteredIds = filteredIds.filter(id => id !== 'removal');

  let promptParts = [];
  let negativeParts = ["plastic textures", "oversaturated colors", "unnatural neon", "CGI look", "blurry edges", "distorted windows", "floating furniture", "overlapping materials", "unnatural sun glare", "fake shadows", "over-sharpened", "vibrant noise", "messy artifacts", "glitches", "ghosting", "pixel distortions"];

  // Assembly Process
  filteredIds.forEach(id => {
    const mod = PROMPT_MODULES[id];
    if (mod) {
      const posResult = typeof mod.pos === 'function' ? mod.pos(viewMode) : mod.pos;
      if (posResult) promptParts.push(posResult);
      if (mod.neg) negativeParts.push(...mod.neg);
    }
  });

  // Structural Lock
  const isCreative = filteredIds.includes('lifestyle') || filteredIds.some(id => id.startsWith('com_'));
  if (!isCreative) {
    promptParts.push("Fixed Asset Protection: Strictly preserve the original immovable architectural layout. Do not add new windows or walls absent in the original.");
    negativeParts.push("added windows", "structural hallucinations", "distorted windows");
  }

  const dna = "High-end professional architectural photography, shot with Canon TS-E 24mm f/3.5L II tilt-shift lens, perfect vertical line alignment, two-point perspective, soft indirect global illumination, realistic ambient occlusion, warm ambient daylight, Architectural Digest editorial style, highly detailed material textures.";
  const header = (viewMode && viewMode !== 'all') ? `${viewMode.charAt(0).toUpperCase() + viewMode.slice(1)}: ` : "";
  const finalPos = [dna, ...promptParts].join(" ").replace(/\s+/g, ' ').trim();
  const finalNeg = Array.from(new Set(negativeParts)).join(", ");

  return `${header}${finalPos}${finalNeg ? ` [NEGATIVE PROMPT: ${finalNeg}]` : ''}`.trim();
};

export const writerPromptMixer = (id, data = {}) => {
  const { title = '', details = '', location = '', extra = '' } = data;
  const context = `Mülk Bilgileri:\n- Başlık: ${title}\n- Detaylar: ${details}\n- Konum: ${location}\n- Ekstra Notlar: ${extra}`;

  const cliches = ["muhteşem", "harika", "kaçırılmayacak", "benzersiz", "adeta", "büyüleyici", "rüya gibi", "hayallerinizi süsleyen", "şimdi keşfedin", "lüksün tanımı", "şaheser", "efsanevi", "mükemmel"];
  const negPrompt = `\n\n[NEGATİF PROMPT / KESİNLİKLE YASAKLANANLAR]:\n- Şu yapay zeka klişesi kelimeleri ASLA kullanma: ${cliches.join(', ')}.\n- Metinlerin veya cümlelerin sonuna sürekli ünlem işareti (!) koyma.\n- Her satırda veya arka arkaya aşırı emoji kullanma; emojiler sadece vurgu amaçlı ve son derece seyrek olsun.\n- Mülk bilgilerinde yer almayan hiçbir oda sayısı, m2, kat veya konum verisini uydurma.`;

  const TEMPLATES = {
    write_title: `Sen emlak sektöründe faaliyet gösteren dahi bir nöro-pazarlamacı ve metin yazarısın. Görevin: Yukarıdaki bilgilere dayanarak gayrimenkul ilanı için potansiyel alıcıyı ilk saniyede yakalayacak, prestijli ve tıklama oranı (CTR) zirve yapacak 5 farklı başlık üret.
    Kriterler: Bölgenin en vurucu özelliğini ve yaşam tarzını vurgula (Örn: "Bebek'te Boğaz Esintili...", "Şehrin Kalbinde Saklı Bir Vaha..."). Sektörel jargonları şık kullan (Kupon daire, prestijli lokasyon, fırsat yatırımlık). Emojileri başa ve sona stratejik yerleştir, ilan portalları için karakter sınırını aşma.
    \n\n${context}${negPrompt}`,
    
    write_summary: `Görevin: Yukarıdaki bilgilere dayanarak WhatsApp, Instagram veya LinkedIn üzerinde paylaşılacak, okuyanda anında "burayı görmeliyim" hissi uyandıracak, duygusal kancaları güçlü kısa bir sosyal medya pazarlama metni yaz.
    Kriterler: İlk 3 satırda yaşam deneyimini sat (Örn: "Sabah kahvenizi bu panoramik terasta yudumladığınızı hayal edin..."). Okuması son derece kolay, 3 maddelik vurucu bir "Öne Çıkanlar" listesi yap. Sonunda güçlü ve net bir harekete geçirici mesaj (CTA) koy. Aşırıya kaçmadan premium emojilerle zenginleştir.
    \n\n${context}${negPrompt}`,
    
    write_full: `Görevin: Yukarıdaki bilgilere dayanarak Sahibinden/Hürriyet Emlak gibi portallar için lüks segment gayrimenkul standartlarında, hem teknik olarak eksiksiz hem de edebi olarak son derece ikna edici tam bir ilan açıklaması yaz.
    Kriterler: İlana teknik veri yığını olarak değil, bir yaşam hikayesi olarak başla. Ulaşım kolaylıkları, prestijli okullar, sosyal yaşam alanları ve bölgenin prim potansiyelini öne çıkar. Oda sayısı, net m2, ısıtma sistemi, cephe avantajları gibi verileri yapılandırılmış bir liste halinde sun. Danışmanın kurumsal duruşunu, profesyonelliğini ve gayrimenkulün benzersiz değer teklifini hissettir.
    \n\n${context}${negPrompt}`
  };

  return TEMPLATES[id] || "Gayrimenkul verilerini kullanarak profesyonel bir metin hazırlar.";
};

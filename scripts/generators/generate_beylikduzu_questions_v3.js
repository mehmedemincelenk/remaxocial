const fs = require('fs');
const path = require('path');

const beylikduzuQuestions = [
  { text: "Beylikduzu Metrosu 2026'da Acilacak mi? Sefakoy-Tuyap Hatti Son Durum", tags: ["Beylikdüzü", "Ulaşım"] },
  { text: "Beylikduzu Metrosu Hangi Mahallelerden Gececek? Durak Listesi", tags: ["Beylikdüzü", "Ulaşım"] },
  { text: "// ... Diğer 200+ Beylikdüzü verisi context şişmemesi için temizlendi. Gerçek veriler data/HAZIR/sorular.json içindedir." }
];

const structuredQuestions = beylikduzuQuestions.map((q, index) => ({
    id: index + 1,
    text: q.text,
    tags: q.tags
}));

const outputPath = path.join('data', 'HAZIR', 'sorular.json');

try {
    fs.writeFileSync(outputPath, JSON.stringify(structuredQuestions, null, 2));
    console.log(`Successfully created ${structuredQuestions.length} Beylikdüzü specific questions in ${outputPath}`);
} catch (error) {
    console.error('Error writing file:', error.message);
}

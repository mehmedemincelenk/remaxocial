const fs = require('fs');
const path = require('path');

const beylikduzuQuestions = [
  { text: "Beylikduzu Metrosu 2026'da Acilacak mi?", tags: ["Beylikdüzü", "Ulaşım"] },
  "// ... Eski veri dökümü temizlendi."
];

const structuredQuestions = beylikduzuQuestions.map((q, index) => ({
    id: index + 1,
    text: q.text || q,
    tags: q.tags || []
}));

const outputPath = path.join('data', 'HAZIR', 'sorular.json');

try {
    fs.writeFileSync(outputPath, JSON.stringify(structuredQuestions, null, 2));
} catch (error) {
    console.error('Error writing file:', error.message);
}

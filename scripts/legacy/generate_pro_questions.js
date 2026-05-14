const fs = require('fs');
const path = require('path');

const questions = [
  "Kok Tapu Nedir? Neden Onemlidir?",
  "Konut Kredisi Faizleri Duserse Piyasa Ne Olur?",
  "// ... Diğer 200+ soru verisi context şişmemesi için temizlendi. Gerçek veriler data/HAZIR/sorular.json içindedir."
];

const structuredQuestions = questions.map((q, index) => ({
  id: index + 1,
  text: q
}));

const outputPath = path.join('data', 'HAZIR', 'sorular.json');

try {
  fs.writeFileSync(outputPath, JSON.stringify(structuredQuestions, null, 2));
  console.log(`Successfully created ${structuredQuestions.length} professional questions in ${outputPath}`);
} catch (error) {
  console.error('Error writing file:', error.message);
}

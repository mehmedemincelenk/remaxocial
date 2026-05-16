import { validateEnv } from './utils/validate-env.mjs';
import { execSync } from 'child_process';
import fs from 'fs';

if (!validateEnv()) {
  process.exit(1);
}

const outDir = './out';

// Cleanup
if (fs.existsSync(outDir)) {
  console.log('🧹 Cleaning old renders...');
  fs.rmSync(outDir, { recursive: true, force: true });
}
fs.mkdirSync(outDir);

const newsData = JSON.parse(fs.readFileSync('./large_news.json', 'utf-8'));
const victoriesData = JSON.parse(fs.readFileSync('./victories.json', 'utf-8'));

console.log('🚀 Starting batch render...');

newsData.forEach((_, index) => {
  const id = `Haber-${index + 1}`;
  console.log(`🎬 Rendering ${id}...`);
  execSync(`npx remotion render src/index.tsx ${id} out/${id}.mp4`, { stdio: 'inherit' });
});

victoriesData.forEach((victory) => {
  const id = victory.id;
  console.log(`🎬 Rendering ${id}...`);
  execSync(`npx remotion render src/index.tsx ${id} out/${id}.mp4`, { stdio: 'inherit' });
});

console.log('✅ All renders completed!');

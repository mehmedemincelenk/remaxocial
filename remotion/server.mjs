import express from 'express';
import cors from 'cors';
import multer from 'multer';
import { exec } from 'child_process';
import path from 'path';
import fs from 'fs';

const app = express();
const port = 5000;

app.use(cors());
app.use(express.json());

// Audio dosyalarını kaydetmek için multer konfigürasyonu
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = './public/audio';
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    // Haber ID'sine göre isim veriyoruz (örn: 1.mp3)
    const newsId = req.body.newsId || 'temp';
    cb(null, `${newsId}.mp3`);
  }
});

const upload = multer({ storage });

app.post('/api/save-audio', upload.single('audio'), (req, res) => {
  const newsId = req.body.newsId;
  const audioPath = `./public/audio/${newsId}.mp3`;

  console.log(`🎤 Ses dosyası alındı: ${audioPath}`);

    // Ses dosyası kaydedildi, işlem tamam.
    console.log(`✅ Ses dosyası kaydedildi: ${audioPath}`);
    res.json({ success: true, message: 'Ses başarıyla kaydedildi.' });
});

app.listen(port, () => {
  console.log(`🚀 Haber Fabrikası Sunucusu http://localhost:${port} adresinde aktif.`);
});

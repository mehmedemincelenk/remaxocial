import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.VITE_GEMINI_API_KEY);

async function list() {
  try {
    // google-generative-ai kütüphanesinde doğrudan model listeleme metodu olmayabilir, 
    // o yüzden fetch ile deniyoruz
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${process.env.VITE_GEMINI_API_KEY}`);
    const data = await response.json();
    const validModels = data.models.filter(m => m.supportedGenerationMethods.includes("generateContent"));
    console.log("Çalışan Modeller:", JSON.stringify(validModels.map(m => m.name), null, 2));
  } catch (err) {
    console.error("Hata:", err.message);
  }
}

list();

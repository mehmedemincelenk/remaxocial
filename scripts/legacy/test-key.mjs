import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.VITE_GEMINI_API_KEY);

async function test() {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });
    const result = await model.generateContent("Merhaba, seninle çalışmak heyecan verici olacak!");
    const response = await result.response;
    console.log("✅ API KEY ÇALIŞIYOR!");
    console.log("Gemini Flash Diyor ki:", response.text());
  } catch (err) {
    console.error("❌ HATA:", err.message);
  }
}

test();

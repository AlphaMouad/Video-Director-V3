import { GoogleGenAI } from '@google/genai';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
async function test() {
  try {
    const res = await ai.models.generateContent({
      model: 'veo-2.0-generate',
      contents: 'a test video'
    });
    console.log("Success", res);
  } catch (e) {
    console.error(e.message);
  }
}
test();

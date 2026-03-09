import { GoogleGenAI } from '@google/genai';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

async function list() {
  try {
    const res = await ai.models.list();
    let models = [];
    for await (const m of res) {
      models.push(m.name);
    }
    console.log(models.filter(m => m.includes('veo') || m.includes('video')));
  } catch (e) {
    console.error(e.message);
  }
}
list();

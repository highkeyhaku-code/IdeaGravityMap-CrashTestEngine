import { GoogleGenerativeAI } from '@google/generative-ai';
import { z } from 'zod';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

// PRD Section 5: Use models defined in .env.local.
// Fallback to gemini-3-flash if not specified.
const DEFAULT_MODEL = (process.env.NEXT_PUBLIC_FAST_MODEL || 'gemini-3-flash').replace(/^"|"$/g, '');

const model = genAI.getGenerativeModel(
  { model: DEFAULT_MODEL },
  { apiVersion: 'v1beta' }
);

export async function callGeminiJSON<T>(prompt: string, schema: z.ZodType<T>): Promise<T> {
  const result = await model.generateContent({
    contents: [{ role: 'user', parts: [{ text: prompt }] }],
    generationConfig: {
      responseMimeType: 'application/json',
    },
  });

  const text = result.response.text();
  try {
    const json = JSON.parse(text);
    return schema.parse(json);
  } catch (e) {
    console.error('Gemini JSON parse/validation error:', e, text);
    throw new Error('AI output validation failed.');
  }
}

/**
 * N並列でのLLM計算を実行するラッパー
 */
export async function parallelGeminiCall<T, R>(
  items: T[],
  promptGenerator: (item: T) => string,
  schema: z.ZodType<R>
): Promise<R[]> {
  const promises = items.map(item => callGeminiJSON(promptGenerator(item), schema));
  return Promise.all(promises);
}

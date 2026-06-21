import { NextResponse } from 'next/server';
import { callGeminiJSON } from '@/lib/gemini';
import { ANALYZE_MARKET_PROMPT } from '@/prompts';
import { MarketAnalysisSchema } from '@/lib/types';

export async function GET() {
  // 注意: 実際に動作させるには .env.local に GEMINI_API_KEY が必要です
  if (!process.env.GEMINI_API_KEY) {
    return NextResponse.json({ error: 'API Key not found' }, { status: 500 });
  }

  try {
    const data = await callGeminiJSON(
      ANALYZE_MARKET_PROMPT("Next.js向けの新しい開発ツール"),
      MarketAnalysisSchema
    );
    return NextResponse.json(data);
  } catch (e: any) {
    console.error('Test AI Error:', e);
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

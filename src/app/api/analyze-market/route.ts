import { NextResponse } from 'next/server';
import { callGeminiJSON, parallelGeminiCall } from '@/lib/gemini';
import { ANALYZE_MARKET_PROMPT, SCORE_COMPETITOR_PROMPT } from '@/prompts';
import { MarketAnalysisSchema, CompetitorScoreSchema } from '@/lib/types';
import { getCache, setCache } from '@/lib/supabase';

export async function POST(req: Request) {
  const { category } = await req.json();
  const cacheKey = `market-analysis-${category}`;

  try {
    // 1. Check Cache (Layer 2: 30 days)
    const cached = await getCache<any>(cacheKey, 'ATTRACTION');
    if (cached) return NextResponse.json(cached);

    // 2. Cache Miss: Initial Market Analysis (JTBD & Representative Competitors)
    const analysis = await callGeminiJSON(
      ANALYZE_MARKET_PROMPT(category),
      MarketAnalysisSchema
    );

    // 3. Optional: Re-score or analyze additional competitors in parallel
    // (In full production, this would search Product Hunt/Reddit first)
    const competitorNames = analysis.competitors.map(c => c.name);
    
    // N-parallel calculation as per PRD
    const scores = await parallelGeminiCall(
      competitorNames,
      (name) => SCORE_COMPETITOR_PROMPT(name, category),
      CompetitorScoreSchema
    );

    const finalData = {
      gap: analysis.gap,
      competitors: scores
    };

    // 4. Save to Cache
    await setCache(cacheKey, finalData);

    return NextResponse.json(finalData);
  } catch (e: any) {
    console.error('Analyze Market Pipeline Error:', e);
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

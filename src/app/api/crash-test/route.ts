import { NextResponse } from 'next/server';
import { callGeminiJSON } from '@/lib/gemini';
import { CRASH_TEST_PROMPT } from '@/prompts';
import { CrashTestResultSchema } from '@/lib/types';
import { supabase } from '@/lib/supabase';

export async function POST(req: Request) {
  const { id, title, target, solution, competition, business } = await req.json();

  try {
    const idea = { title, target, solution, competition, business };
    const personas: ('investor' | 'competitor' | 'customer')[] = ['investor', 'competitor', 'customer'];

    // 3-parallel persona attacks
    const results = await Promise.all(
      personas.map(p => callGeminiJSON(CRASH_TEST_PROMPT(p, idea), CrashTestResultSchema))
    );

    // Calculate average survival rate
    const avgSurvivalRate = Math.round(results.reduce((acc, r) => acc + r.survivalScore, 0) / results.length);
    const status = avgSurvivalRate > 50 ? 'survived' : 'crushed';

    // Update Supabase
    const { data: updated, error } = await supabase
      .from('ideas')
      .upsert({
        id: id || undefined, // New ID if null
        title,
        target,
        solution,
        status,
        survival_rate: avgSurvivalRate,
        updated_at: new Date().toISOString()
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({
      id: updated.id,
      survivalRate: avgSurvivalRate,
      results: {
        investor: results[0],
        competitor: results[1],
        customer: results[2]
      }
    });
  } catch (e: any) {
    console.error('Crash Test Engine Error:', e);
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

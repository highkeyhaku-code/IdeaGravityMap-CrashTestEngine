import { z } from 'zod';

export const CompetitorScoreSchema = z.object({
  name: z.string(),
  attraction: z.number().min(0).max(100),
  repulsion: z.number().min(0).max(100),
  reasoning: z.string(), // 内部的な推論用（英語）
  summary: z.string(),   // ユーザー表示用（日本語）
});

export const MarketAnalysisSchema = z.object({
  gap: z.object({
    jtbd: z.string(),
    description: z.string(),
    patterns: z.array(z.object({
      title: z.string(),
      description: z.string(),
      type: z.enum(['unbundle', 'blueocean', 'limit']),
    })),
  }),
  competitors: z.array(CompetitorScoreSchema),
});

export const WhatIfCardSchema = z.object({
  title: z.string(),
  description: z.string(),
  type: z.enum(['specialize', 'extract', 'destroy', 'democratize']),
  target: z.string(),
  solution: z.string(),
  coreValue: z.string(),
  businessHypothesis: z.string(),
});

export const WhatIfGenerationSchema = z.array(WhatIfCardSchema).length(4);

export type IdeaStatus = 'draft' | 'validation' | 'crushed' | 'survived';

export const CrashTestResultSchema = z.object({
  survivalScore: z.number().min(0).max(100),
  fatalFlaws: z.array(z.string()),
  feedback: z.string(),
  pivotHint: z.string(),
});

export type CrashTestResult = z.infer<typeof CrashTestResultSchema>;

export interface IdeaCard {
  id: string;
  title: string;
  target: string;
  survivalRate?: number;
  version: number;
  status: IdeaStatus;
  updatedAt: string;
  description?: string;
}

export interface MarketGap {
  id: string;
  jtbd: string; // 星（中心点）のラベル
  category: string;
  description: string;
  avgAttraction: number; // 全体の平均引力 (0-100)
  avgRepulsion: number;  // 全体の平均反発力 (0-100)
}

export interface CompetitorNode {
  id: string;
  name: string;
  attraction: number; // 中心への引き寄せの強さ (0-100)
  repulsion: number;  // 周囲への反発（クレーターの深さ/範囲） (0-100)
  tags: string[];
}

export interface MarketMapData {
  gap: MarketGap;
  competitors: CompetitorNode[];
}

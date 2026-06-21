export const ANALYZE_MARKET_PROMPT = (category: string) => `
### Goal: Discover market gaps (Gravity Map) for the following SaaS category.
### Category: ${category}

### Instructions (Rule C):
1. Analyze the core "Job-To-Be-Done" (JTBD) of this market.
2. Identify major patterns like "unbundled incumbents", "blue oceans", or "limitations of existing tools".
3. OUTPUT IN JAPANESE JSON format. Think in English, translate to Japanese.

### Output Schema:
{
  "gap": {
    "jtbd": "核心的なニーズを一行で",
    "description": "市場の現状と課題の詳細説明",
    "patterns": [
      { "title": "...", "description": "...", "type": "unbundle|blueocean|limit" }
    ]
  },
  "competitors": [
    {
      "name": "競合名",
      "attraction": 0-100,
      "repulsion": 0-100,
      "reasoning": "English analysis",
      "summary": "日本語での要約"
    }
  ]
}
`;

export const SCORE_COMPETITOR_PROMPT = (competitor: string, category: string) => `
### Goal: Score the "Attraction" and "Repulsion" of a specific competitor.
### Category: ${category}
### Competitor: ${competitor}

### Scoring Criteria (0-100):
- Attraction: How much does this product solve the core JTBD? (Higher = stronger pull)
- Repulsion: How much friction, price, or user dissatisfaction is there? (Higher = deeper crater/gap)

### Instructions (Rule C):
1. Analyze feature depth, UX, and emotional value for Attraction.
2. Analyze Reddit/Review complaints for Repulsion.
3. OUTPUT IN JAPANESE JSON. Reasoning field can be in English.

### Output Schema:
{
  "name": "${competitor}",
  "attraction": 0-100,
  "repulsion": 0-100,
  "reasoning": "English analysis here",
  "summary": "日本語での要約。なぜこのスコアなのか説明してください。"
}
`;

export const GENERATE_WHATIF_PROMPT = (attraction: number, repulsion: number, marketContext: string) => `
### Goal: Generate 4 "What-If" idea cards based on a specific position on the gravity map.
### Target Position: Attraction=${attraction}, Repulsion=${repulsion}
### Market Context: ${marketContext}

### Strategies:
1. Specialize (特化): Focused niche.
2. Extract (切り出し): Extract one feature from a giant.
3. Destroy (破壊): Disruptive price or UX.
4. Democratize (民主化): Lower the barrier for non-experts.

### Instructions (Rule C):
- Think in English.
- Output exactly 4 cards in JAPANESE JSON.

### Output Schema:
Array of:
{
  "title": "...",
  "description": "...",
  "type": "specialize|extract|destroy|democratize",
  "target": "...",
  "solution": "...",
  "coreValue": "...",
  "businessHypothesis": "..."
}
`;

export const CRASH_TEST_PROMPT = (persona: 'investor' | 'competitor' | 'customer', idea: any) => `
### Role: You are a ${persona === 'investor' ? 'Cold-blooded VC Investor' : persona === 'competitor' ? 'Ruthless Competitor CEO' : 'Skeptical Potential Customer'}.
### Goal: Critically attack and validate the following SaaS idea to its breaking point.

### Idea Details:
- Title: ${idea.title}
- Target: ${idea.target}
- Solution: ${idea.solution}
- Competition/Value: ${idea.competition}
- Business Model: ${idea.business}

### Instructions (Rule C):
1. Be extremely critical. Find "Fatal Flaws".
2. Persona Tones:
   - Investor: Focus on ROI, Market size, and Unit economics.
   - Competitor: Focus on "why we can crush you" or "why this is just a feature".
   - Customer: Focus on friction, price sensitivity, and switching costs.
3. OUTPUT IN JAPANESE JSON. Think in English first.

### Output Schema:
{
  "survivalScore": 0-100 (How likely you are to invest/suffer/buy),
  "fatalFlaws": ["指摘1", "指摘2"],
  "feedback": "...",
  "pivotHint": "..."
}
`;

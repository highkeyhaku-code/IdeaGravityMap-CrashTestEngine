import { MarketMapData } from './types';

export const MOCK_MARKET_DATA: MarketMapData = {
  gap: {
    id: 'gap-1',
    jtbd: 'AIによる自動コードレビューと修正提案',
    category: 'Developer Tools / AI Coding Assistant',
    description: '単なる指摘に留まらず、プロダクトの文脈を理解した上で、セキュアでメンテナブルなコードへの自動変換を求める需要。',
    avgAttraction: 65,
    avgRepulsion: 40,
  },
  competitors: [
    { id: 'c1', name: 'GitHub Copilot', attraction: 95, repulsion: 80, tags: ['Autofill', 'Autocomplete'] },
    { id: 'c2', name: 'SonarCloud', attraction: 70, repulsion: 30, tags: ['Static Analysis', 'Security'] },
    { id: 'c3', name: 'Snyk', attraction: 60, repulsion: 45, tags: ['Security', 'Vulnerability'] },
    { id: 'c4', name: 'CodeClimate', attraction: 40, repulsion: 20, tags: ['Maintainability'] },
    { id: 'c5', name: 'DeepSource', attraction: 55, repulsion: 25, tags: ['Automation'] },
    { id: 'c6', name: 'Codacy', attraction: 45, repulsion: 15, tags: ['Review'] },
    { id: 'c7', name: 'Amazon CodeWhisperer', attraction: 85, repulsion: 70, tags: ['AWS', 'Autofill'] },
    { id: 'c8', name: 'Tabnine', attraction: 75, repulsion: 50, tags: ['Local LLM'] },
  ]
};

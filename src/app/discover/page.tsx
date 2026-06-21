'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Info, Sparkles, Plus, Rocket, Target, Zap } from 'lucide-react';
import GravityMap from '@/components/map/GravityMap';
import ThreeBlockEditor from '@/components/editor/ThreeBlockEditor';
import { MOCK_MARKET_DATA } from '@/lib/mock-data';
import { WhatIfCard } from '@/lib/types';
import { motion, AnimatePresence } from 'framer-motion';

export default function DiscoverPage() {
  const [selectedSpec, setSelectedSpec] = useState<{ attraction: number; repulsion: number } | null>(null);
  const [editingCard, setEditingCard] = useState<WhatIfCard | null>(null);

  const handlePlanetDrop = (attraction: number, repulsion: number) => {
    setSelectedSpec({ attraction, repulsion });
  };

  const handleSelectWhatIf = (card: WhatIfCard) => {
    setEditingCard(card);
  };

  return (
    <main className="min-h-screen bg-white relative overflow-hidden">
      {/* Header */}
      <header className="border-b border-slate-100 px-8 py-4 flex justify-between items-center bg-white/80 backdrop-blur-md sticky top-0 z-30">
        <div className="flex items-center gap-4">
          <Link href="/" className="p-2 hover:bg-slate-100 rounded-full transition-colors">
            <ArrowLeft className="w-5 h-5 text-slate-600" />
          </Link>
          <div>
            <h1 className="text-lg font-bold text-slate-900">🔭 市場の穴を探す</h1>
            <p className="text-xs text-slate-500 font-medium">{MOCK_MARKET_DATA.gap.category}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="px-3 py-1 bg-indigo-50 rounded-full flex items-center gap-2">
            <span className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse" />
            <span className="text-xs font-bold text-indigo-700">LIVE MARKET DATA</span>
          </div>
        </div>
      </header>

      <div className="flex h-[calc(100vh-65px)]">
        {/* Main Map Area */}
        <div className="flex-1 bg-slate-50 relative p-8 overflow-hidden">
          <div className="max-w-4xl mx-auto h-full flex flex-col justify-center">
            <div className="mb-6 flex justify-between items-end">
              <div>
                <h2 className="text-2xl font-black text-slate-900 mb-1">{MOCK_MARKET_DATA.gap.jtbd}</h2>
                <p className="text-slate-500 text-sm max-w-xl">{MOCK_MARKET_DATA.gap.description}</p>
              </div>
              <div className="text-right">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Market Density</span>
                <span className="text-2xl font-mono font-bold text-slate-900">HIGH</span>
              </div>
            </div>
            
            <GravityMap data={MOCK_MARKET_DATA} onPlanetDrop={handlePlanetDrop} />
            
            <div className="mt-6 p-4 bg-indigo-600 rounded-xl text-white flex items-center justify-between shadow-lg shadow-indigo-200">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white/20 rounded-lg">
                  <Info className="w-5 h-5" />
                </div>
                <p className="text-sm font-medium">マップ上の空白をクリックして、あなたのアイディアをドロップしてください。</p>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar: Gap Analysis & Actions */}
        <aside className="w-[400px] border-l border-slate-100 bg-white overflow-y-auto p-8">
          <AnimatePresence mode="wait">
            {!selectedSpec ? (
              <motion.div 
                key="initial"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-8"
              >
                <section>
                  <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">検出された「黄金パターン」</h3>
                  <div className="space-y-4">
                    <PatternCard 
                      icon={Zap} 
                      title="代替ツールの限界" 
                      description="GitHub Copilotは便利だが、組織独自の規約遵守には手動レビューが残っている。" 
                      color="amber"
                    />
                    <PatternCard 
                      icon={Sparkles} 
                      title="ブルーオーシャン" 
                      description="セキュリティ特化型は多いが、UX/開発効率特化の空白地帯が存在。" 
                      color="emerald"
                    />
                  </div>
                </section>

                <section>
                  <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">主要な引力圏（競合）</h3>
                  <div className="space-y-2">
                    {MOCK_MARKET_DATA.competitors.slice(0, 5).map(c => (
                      <div key={c.id} className="flex justify-between items-center p-3 rounded-lg border border-slate-50 hover:bg-slate-50 transition-colors">
                        <span className="text-sm font-bold text-slate-700">{c.name}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-mono text-slate-400">ATT:{c.attraction}</span>
                          <div className="w-12 bg-slate-100 h-1 rounded-full overflow-hidden">
                            <div className="bg-indigo-500 h-full" style={{ width: `${c.attraction}%` }} />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              </motion.div>
            ) : (
              <motion.div 
                key="selected"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-8"
              >
                <div className="p-6 bg-slate-900 rounded-2xl text-white shadow-xl">
                  <div className="flex items-center gap-2 mb-4 text-indigo-400">
                    <Target className="w-5 h-5" />
                    <span className="text-xs font-bold uppercase tracking-widest">Target Position</span>
                  </div>
                  <h3 className="text-xl font-bold mb-6">アイディアの目標スペック</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-3 bg-white/10 rounded-xl border border-white/10">
                      <span className="text-[10px] text-white/50 block mb-1 uppercase font-bold">目標引力</span>
                      <span className="text-2xl font-mono font-bold text-indigo-300">{selectedSpec.attraction}</span>
                    </div>
                    <div className="p-3 bg-white/10 rounded-xl border border-white/10">
                      <span className="text-[10px] text-white/50 block mb-1 uppercase font-bold">推定反発力</span>
                      <span className="text-2xl font-mono font-bold text-rose-300">{selectedSpec.repulsion}</span>
                    </div>
                  </div>
                </div>

                <section>
                  <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">AIによるWhat-If提案</h3>
                  <div className="space-y-4">
                    <WhatIfCardUI 
                      title="規約特化型レビューエンジン" 
                      description="社内Wikiと連携し、独自のベストプラクティスを自動適用。"
                      tags={['Vertical SaaS', 'B2B']}
                      onClick={() => handleSelectWhatIf({
                        title: "規約特化型レビューエンジン",
                        description: "社内Wikiと連携し、独自のベストプラクティスを自動適用。",
                        type: "specialize",
                        target: "大企業の法務・エンジニアリング部門",
                        solution: "内部規約をLLMが学習し、コード上の違反をリアルタイム指摘・修正提案。",
                        coreValue: "レビュー工数の80%削減とコンプライアンスの自動担保",
                        businessHypothesis: "既存の汎用AIツールでは解決できない「社内独自ルール」への適応が強力な参入障壁になる。"
                      })}
                    />
                    <WhatIfCardUI 
                      title="ジュニア育成特化Reviewer" 
                      description="単なる指摘ではなく、学習リソースを添えてレビュー。"
                      tags={['EdTech', 'DevEx']}
                      onClick={() => handleSelectWhatIf({
                        title: "ジュニア育成特化Reviewer",
                        description: "単なる指摘ではなく、学習リソースを添えてレビュー。",
                        type: "democratize",
                        target: "ジュニアエンジニアの比率が高い成長企業",
                        solution: "レビュー時に、なぜその修正が必要なのかを対話形式で解説し、関連ドキュメントを提示。",
                        coreValue: "レビューを通じたエンジニアの自律的成長とシニア工数の解放",
                        businessHypothesis: "採用コストが高騰する中、未経験・ジュニア層を早期戦力化するツールへの投資意欲は高い。"
                      })}
                    />
                  </div>
                </section>

                <button className="w-full bg-indigo-600 text-white py-4 rounded-xl font-bold hover:bg-indigo-700 transition-all flex items-center justify-center gap-2 shadow-lg shadow-indigo-100">
                  <Rocket className="w-5 h-5" /> このポジションで検証に進む
                </button>
                <button onClick={() => setSelectedSpec(null)} className="w-full text-slate-400 py-2 text-sm font-medium hover:text-slate-600">
                  配置をキャンセル
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </aside>
      </div>

      {/* Full-screen Editor Overlay */}
      <AnimatePresence>
        {editingCard && (
          <motion.div 
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed inset-0 z-50 bg-white"
          >
            <ThreeBlockEditor 
              initialData={editingCard}
              onSave={(data) => {
                console.log('Saved:', data);
                setEditingCard(null);
              }}
              onCancel={() => setEditingCard(null)}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}

function PatternCard({ icon: Icon, title, description, color }: { icon: any, title: string, description: string, color: 'amber' | 'emerald' }) {
  const colors = {
    amber: 'bg-amber-50 text-amber-600 border-amber-100',
    emerald: 'bg-emerald-50 text-emerald-600 border-emerald-100',
  };
  return (
    <div className={`p-4 rounded-xl border ${colors[color]} space-y-2`}>
      <div className="flex items-center gap-2">
        <Icon className="w-4 h-4" />
        <h4 className="text-xs font-bold uppercase">{title}</h4>
      </div>
      <p className="text-xs text-slate-600 leading-relaxed font-medium">{description}</p>
    </div>
  );
}

function WhatIfCardUI({ title, description, tags, onClick }: { title: string, description: string, tags: string[], onClick: () => void }) {
  return (
    <div 
      onClick={onClick}
      className="p-5 rounded-xl border border-slate-200 hover:border-indigo-200 hover:bg-indigo-50/30 transition-all cursor-pointer group"
    >
      <div className="flex justify-between items-start mb-2">
        <h4 className="font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">{title}</h4>
        <Plus className="w-4 h-4 text-slate-300 group-hover:text-indigo-400" />
      </div>
      <p className="text-xs text-slate-500 mb-4 leading-relaxed">{description}</p>
      <div className="flex gap-2">
        {tags.map(t => <span key={t} className="text-[9px] font-bold px-2 py-0.5 bg-slate-100 text-slate-400 rounded-full uppercase">{t}</span>)}
      </div>
    </div>
  );
}

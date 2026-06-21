'use client';

import React, { useState, useEffect } from 'react';
import { Search, Hammer, Zap, ArrowRight, Activity, X, History, TrendingUp, AlertTriangle } from 'lucide-react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '@/lib/supabase';

export default function DashboardPage() {
  const [ideas, setIdeas] = useState<any[]>([]);
  const [selectedIdea, setSelectedIdea] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchIdeas() {
      const { data, error } = await supabase
        .from('ideas')
        .select('*')
        .order('updated_at', { ascending: false });
      
      if (!error && data) {
        setIdeas(data);
      } else {
        console.error('Fetch ideas error:', error);
      }
      setIsLoading(false);
    }
    fetchIdeas();
  }, []);

  if (isLoading) return <div className="p-8 bg-slate-50 min-h-screen flex items-center justify-center font-bold text-slate-400 uppercase tracking-widest animate-pulse">Loading Hub...</div>;

  return (
    <main className="min-h-screen bg-slate-50 p-8 relative overflow-hidden">
      {/* Header & Entry Points */}
      <div className="max-w-7xl mx-auto mb-12">
        <h1 className="text-3xl font-bold mb-8 text-slate-900">Idea Hub</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          <Link href="/discover" className="group p-6 bg-indigo-600 rounded-xl text-white hover:bg-indigo-700 transition-all shadow-lg hover:shadow-indigo-200">
            <div className="flex justify-between items-start mb-4">
              <Search className="w-8 h-8" />
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </div>
            <h2 className="text-xl font-bold mb-2">🔭 市場の穴を探す (Discover)</h2>
            <p className="text-indigo-100 opacity-80">市場の引力と反発力を視覚化し、未踏の領域を特定します。</p>
          </Link>
          
          <Link href="/validate" className="group p-6 bg-slate-900 rounded-xl text-white hover:bg-slate-800 transition-all shadow-lg hover:shadow-slate-200">
            <div className="flex justify-between items-start mb-4">
              <Hammer className="w-8 h-8" />
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </div>
            <h2 className="text-xl font-bold mb-2">🔨 アイディアを検証する (Validate)</h2>
            <p className="text-slate-300 opacity-80">AI審査員によるクラッシュテストを実行し、モデルを破壊・再構築します。</p>
          </Link>
        </div>

        {/* Kanban Board */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <Column title="Drafts (原石)" count={ideas.filter(i => i.status === 'draft').length}>
            {ideas.filter(i => i.status === 'draft').map(idea => (
              <IdeaCard key={idea.id} idea={idea} onClick={() => setSelectedIdea(idea)} />
            ))}
          </Column>

          <Column title="In Validation (検証中)" count={ideas.filter(i => i.status === 'validation').length}>
            {ideas.filter(i => i.status === 'validation').map(idea => (
              <IdeaCard key={idea.id} idea={idea} onClick={() => setSelectedIdea(idea)} />
            ))}
          </Column>

          <Column title="Crushed / Survived (結果)" count={ideas.filter(i => i.status === 'crushed' || i.status === 'survived').length}>
            {ideas.filter(i => i.status === 'crushed' || i.status === 'survived').map(idea => (
              <IdeaCard key={idea.id} idea={idea} onClick={() => setSelectedIdea(idea)} />
            ))}
          </Column>
        </div>
      </div>

      {/* Detail Panel (Micro-view) */}
      <AnimatePresence>
        {selectedIdea && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedIdea(null)}
              className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-40"
            />
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed right-0 top-0 h-full w-full max-w-lg bg-white shadow-2xl z-50 overflow-y-auto"
            >
              <div className="p-8">
                <div className="flex justify-between items-start mb-8">
                  <button onClick={() => setSelectedIdea(null)} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                    <X className="w-6 h-6 text-slate-400" />
                  </button>
                  <div className="flex gap-2">
                    <span className="bg-slate-100 text-slate-600 px-3 py-1 rounded-full text-xs font-mono font-bold">V{selectedIdea.version}</span>
                    <StatusBadge status={selectedIdea.status} />
                  </div>
                </div>

                <h2 className="text-2xl font-bold text-slate-900 mb-2">{selectedIdea.title}</h2>
                <p className="text-slate-500 mb-8">{selectedIdea.target}</p>

                <div className="space-y-8">
                  <section>
                    <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-4 flex items-center gap-2">
                      <TrendingUp className="w-4 h-4" /> 総合生存率
                    </h3>
                    <div className="bg-slate-50 rounded-xl p-6 border border-slate-100">
                      <div className="flex items-end gap-4 mb-2">
                        <span className={`text-5xl font-black ${selectedIdea.survival_rate > 70 ? 'text-emerald-500' : selectedIdea.survival_rate > 30 ? 'text-amber-500' : 'text-rose-500'}`}>
                          {selectedIdea.survival_rate || '??'}%
                        </span>
                        <span className="text-slate-400 text-sm mb-2">by AI Crash Engine</span>
                      </div>
                      <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: `${selectedIdea.survival_rate}%` }}
                          className={`h-full ${selectedIdea.survival_rate > 70 ? 'bg-emerald-500' : selectedIdea.survival_rate > 30 ? 'bg-amber-500' : 'bg-rose-500'}`}
                        />
                      </div>
                    </div>
                  </section>

                  <section>
                    <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-4">コンセプト</h3>
                    <p className="text-slate-700 leading-relaxed">{selectedIdea.description}</p>
                  </section>

                  <section>
                    <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-4 flex items-center gap-2">
                      <History className="w-4 h-4" /> フィードバック履歴
                    </h3>
                    <div className="space-y-4">
                      {/* In a real app, this would be fetched from a sub-table or JSONB */}
                      <FeedbackItem type="investor" text="市場規模の推計が楽観的すぎる。ユニットエコノミクスの再考が必要。" />
                      <FeedbackItem type="competitor" text="既存の製品で代替可能。独自の価値命題が弱い。" />
                    </div>
                  </section>

                  <div className="pt-8">
                    <button className="w-full bg-slate-900 text-white py-4 rounded-xl font-bold hover:bg-slate-800 transition-all flex items-center justify-center gap-2">
                      <Hammer className="w-5 h-5" /> 検証を再開する (V{selectedIdea.version + 1})
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </main>
  );
}

function Column({ title, count, children }: { title: string, count: number, children: React.ReactNode }) {
  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between mb-4 px-2">
        <h3 className="font-semibold text-slate-700">{title}</h3>
        <span className="bg-slate-200 text-slate-600 px-2 py-0.5 rounded-full text-xs font-medium">{count}</span>
      </div>
      <div className="flex flex-col gap-4 min-h-[500px] bg-slate-100/50 p-2 rounded-lg border border-dashed border-slate-300">
        {children}
      </div>
    </div>
  );
}

function IdeaCard({ idea, onClick }: { idea: any, onClick: () => void }) {
  const isSurvived = idea.status === 'survived';
  const isCrushed = idea.status === 'crushed';
  
  return (
    <motion.div 
      whileHover={{ y: -4 }}
      onClick={onClick}
      className="bg-white p-4 rounded-lg shadow-sm border border-slate-200 hover:shadow-md transition-shadow cursor-pointer group"
    >
      <div className="flex justify-between items-start mb-2">
        <h4 className="font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">{idea.title}</h4>
        <span className="text-[10px] text-slate-400 font-mono">V{idea.version}</span>
      </div>
      <p className="text-sm text-slate-500 mb-4 line-clamp-2">{idea.target}</p>
      
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {idea.survival_rate !== undefined && (
            <div className="flex items-center gap-1">
              <Activity className={`w-3 h-3 ${isSurvived ? 'text-emerald-500' : isCrushed ? 'text-rose-500' : 'text-amber-500'}`} />
              <span className={`text-xs font-bold ${isSurvived ? 'text-emerald-600' : isCrushed ? 'text-rose-600' : 'text-amber-600'}`}>
                {idea.survival_rate}%
              </span>
            </div>
          )}
        </div>
        <span className="text-[10px] text-slate-400">{new Date(idea.updated_at).toLocaleDateString()}</span>
      </div>
      
      {isSurvived && (
        <div className="mt-3 pt-3 border-t border-slate-100 flex items-center gap-1.5 text-emerald-600">
          <Zap className="w-3 h-3 fill-emerald-600" />
          <span className="text-[10px] font-bold uppercase tracking-wider">Survived</span>
        </div>
      )}
      {isCrushed && (
        <div className="mt-3 pt-3 border-t border-slate-100 flex items-center gap-1.5 text-rose-600">
          <AlertTriangle className="w-3 h-3" />
          <span className="text-[10px] font-bold uppercase tracking-wider">Crushed</span>
        </div>
      )}
    </motion.div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const styles: any = {
    draft: 'bg-slate-100 text-slate-600',
    validation: 'bg-amber-100 text-amber-600',
    survived: 'bg-emerald-100 text-emerald-600',
    crushed: 'bg-rose-100 text-rose-600',
  };
  return (
    <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-tighter ${styles[status]}`}>
      {status}
    </span>
  );
}

function FeedbackItem({ type, text }: { type: 'investor' | 'competitor' | 'customer', text: string }) {
  const labels: any = { investor: '投資家', competitor: '競合', customer: '顧客' };
  const icons: any = { investor: TrendingUp, competitor: AlertTriangle, customer: Zap };
  const Icon = icons[type];

  return (
    <div className="flex gap-4 p-4 bg-slate-50 rounded-lg border border-slate-100">
      <div className="shrink-0 w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-sm">
        <Icon className="w-4 h-4 text-slate-400" />
      </div>
      <div>
        <span className="text-[10px] font-bold text-slate-400 uppercase">{labels[type]}</span>
        <p className="text-sm text-slate-600 leading-relaxed">{text}</p>
      </div>
    </div>
  );
}

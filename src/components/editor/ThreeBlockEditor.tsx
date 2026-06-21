'use client';

import React, { useState } from 'react';
import { Target, Lightbulb, TrendingUp, ChevronRight, Save, Wand2 } from 'lucide-react';
import { WhatIfCard } from '@/lib/types';
import { useRouter } from 'next/navigation';

interface ThreeBlockEditorProps {
  initialData: WhatIfCard;
  onSave: (data: WhatIfCard) => void;
  onCancel: () => void;
}

export default function ThreeBlockEditor({ initialData, onSave, onCancel }: ThreeBlockEditorProps) {
  const [data, setData] = useState<WhatIfCard>(initialData);
  const router = useRouter();

  const handleStartValidation = () => {
    const params = new URLSearchParams();
    params.set('target', data.target);
    params.set('solution', data.solution);
    router.push(`/validate?${params.toString()}`);
  };

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Header */}
      <div className="px-8 py-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-bold px-2 py-0.5 bg-indigo-100 text-indigo-600 rounded-full uppercase tracking-wider">
              Drafting Idea
            </span>
            <span className="text-[10px] font-bold px-2 py-0.5 bg-slate-200 text-slate-500 rounded-full uppercase tracking-wider">
              {initialData.type}
            </span>
          </div>
          <h2 className="text-xl font-bold text-slate-900">{data.title}</h2>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={onCancel} className="px-4 py-2 text-sm font-medium text-slate-500 hover:text-slate-700 transition-colors">
            キャンセル
          </button>
          <button 
            onClick={() => onSave(data)}
            className="px-6 py-2 bg-indigo-600 text-white rounded-lg font-bold hover:bg-indigo-700 transition-all shadow-md shadow-indigo-100 flex items-center gap-2 text-sm"
          >
            <Save className="w-4 h-4" /> 下書きを保存
          </button>
        </div>
      </div>

      {/* Editor Content */}
      <div className="flex-1 overflow-y-auto p-8 space-y-8 max-w-4xl mx-auto w-full">
        
        {/* Block 1: Target & Pain */}
        <section className="space-y-4">
          <div className="flex items-center gap-3 text-slate-400">
            <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-500">
              <Target className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold uppercase tracking-widest">Block 1: Target & Pain</h3>
          </div>
          <div className="grid grid-cols-1 gap-4 bg-slate-50 p-6 rounded-2xl border border-slate-100">
            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase block mb-2">ターゲット属性 (Q1-A)</label>
              <textarea 
                value={data.target}
                onChange={(e) => setData({ ...data, target: e.target.value })}
                className="w-full bg-white border border-slate-200 rounded-xl p-4 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all min-h-[80px]"
                placeholder="誰の、どんな課題を解決しますか？"
              />
            </div>
          </div>
        </section>

        {/* Block 2: Solution Concept */}
        <section className="space-y-4">
          <div className="flex items-center gap-3 text-slate-400">
            <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-500">
              <Lightbulb className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold uppercase tracking-widest">Block 2: Solution Concept</h3>
          </div>
          <div className="grid grid-cols-1 gap-4 bg-slate-50 p-6 rounded-2xl border border-slate-100">
            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase block mb-2">ソリューションの核心 (Q2-A)</label>
              <textarea 
                value={data.solution}
                onChange={(e) => setData({ ...data, solution: e.target.value })}
                className="w-full bg-white border border-slate-200 rounded-xl p-4 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all min-h-[80px]"
                placeholder="具体的にどのように解決しますか？"
              />
            </div>
            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase block mb-2">主要な機能 / UX</label>
              <textarea 
                value={data.description}
                onChange={(e) => setData({ ...data, description: e.target.value })}
                className="w-full bg-white border border-slate-200 rounded-xl p-4 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all min-h-[80px]"
              />
            </div>
          </div>
        </section>

        {/* Block 3: Core Value & Business */}
        <section className="space-y-4">
          <div className="flex items-center gap-3 text-slate-400">
            <div className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center text-amber-500">
              <TrendingUp className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold uppercase tracking-widest">Block 3: Core Value & Business</h3>
          </div>
          <div className="grid grid-cols-1 gap-4 bg-slate-50 p-6 rounded-2xl border border-slate-100">
            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase block mb-2">コア・バリュー（提供価値）</label>
              <textarea 
                value={data.coreValue}
                onChange={(e) => setData({ ...data, coreValue: e.target.value })}
                className="w-full bg-white border border-slate-200 rounded-xl p-4 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all min-h-[80px]"
              />
            </div>
            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase block mb-2 flex items-center gap-2">
                <Wand2 className="w-3 h-3 text-amber-500" /> AIによるビジネス仮説
              </label>
              <div className="bg-amber-50/50 border border-amber-100 rounded-xl p-4 text-sm text-amber-900 leading-relaxed italic">
                {data.businessHypothesis}
              </div>
            </div>
          </div>
        </section>

        {/* Action Button to Phase 2 */}
        <div className="pt-8 pb-12">
          <button 
            onClick={handleStartValidation}
            className="w-full bg-slate-900 text-white py-5 rounded-2xl font-bold hover:bg-slate-800 transition-all flex items-center justify-center gap-3 shadow-xl shadow-slate-200 group"
          >
            🔨 クラッシュテストを開始する
            <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
          <p className="text-center text-slate-400 text-xs mt-4">
            保存されたデータは統合カンバンの "In Validation" 列へ移動します。
          </p>
        </div>
      </div>
    </div>
  );
}

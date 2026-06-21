'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ChevronRight, Hammer, Target, Lightbulb, TrendingUp, DollarSign, Activity, Zap, AlertTriangle, ShieldAlert } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const STEPS = [
  { id: 'target', label: 'Target', icon: Target, question: 'ターゲットとする顧客と、彼らが抱える深刻な悩みは何ですか？' },
  { id: 'solution', label: 'Solution', icon: Lightbulb, question: '具体的にどのような方法で、その悩みを解決しますか？' },
  { id: 'competition', label: 'Competition', icon: TrendingUp, question: '既存の代替手段と比較して、なぜあなたの製品が選ばれますか？' },
  { id: 'business', label: 'Business', icon: DollarSign, question: 'どのように収益を上げ、持続可能なビジネスモデルを構築しますか？' },
];

export default function ValidatePage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [isCrashtesting, setIsCrashtesting] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [answers, setAnswers] = useState({
    target: '',
    solution: '',
    competition: '',
    business: '',
  });

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setAnswers(prev => ({
      ...prev,
      target: params.get('target') || '',
      solution: params.get('solution') || '',
    }));
  }, []);

  const handleStartCrashTest = async () => {
    setIsCrashtesting(true);
    try {
      const res = await fetch('/api/crash-test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: "New Idea", // Simplified for now
          ...answers
        }),
      });
      const data = await res.json();
      setResult(data);
    } catch (e) {
      console.error(e);
      alert('Crash test failed.');
    } finally {
      setIsCrashtesting(false);
    }
  };

  const nextStep = () => {
    if (currentStep < STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleStartCrashTest();
    }
  };

  const prevStep = () => {
    if (currentStep > 0) setCurrentStep(currentStep - 1);
  };

  if (result) return <ResultView result={result} onRestart={() => router.push('/')} />;

  const currentStepInfo = STEPS[currentStep];

  return (
    <main className="min-h-screen bg-slate-50 relative overflow-hidden">
      {/* Loading Overlay */}
      <AnimatePresence>
        {isCrashtesting && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-slate-900/90 backdrop-blur-md flex flex-col items-center justify-center text-white"
          >
            <motion.div
              animate={{ scale: [1, 1.1, 1], rotate: [0, 5, -5, 0] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="mb-8 p-6 bg-white/10 rounded-full border border-white/20"
            >
              <Hammer className="w-16 h-16 text-indigo-400" />
            </motion.div>
            <h2 className="text-3xl font-black mb-4 tracking-tighter">AI CRASH ENGINE ACTIVE</h2>
            <p className="text-slate-400 font-mono animate-pulse">3人の審査員があなたのアイディアを攻撃中...</p>
          </motion.div>
        )}
      </AnimatePresence>

      <header className="border-b border-slate-200 px-8 py-4 bg-white flex justify-between items-center sticky top-0 z-30">
        <div className="flex items-center gap-4">
          <Link href="/" className="p-2 hover:bg-slate-100 rounded-full transition-colors">
            <ArrowLeft className="w-5 h-5 text-slate-600" />
          </Link>
          <h1 className="text-lg font-bold text-slate-900">🔨 検証ウィザード</h1>
        </div>
        <div className="flex gap-2">
          {STEPS.map((_, idx) => (
            <div key={idx} className={`h-1.5 w-12 rounded-full transition-all ${idx <= currentStep ? 'bg-indigo-600' : 'bg-slate-200'}`} />
          ))}
        </div>
      </header>

      <div className="max-w-3xl mx-auto py-12 px-8">
        <AnimatePresence mode="wait">
          <motion.div key={currentStep} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-8">
            <div className="flex items-center gap-4 text-indigo-600">
              <div className="p-3 bg-indigo-50 rounded-2xl shadow-sm"><currentStepInfo.icon className="w-8 h-8" /></div>
              <h2 className="text-2xl font-black text-slate-900">{currentStepInfo.label}</h2>
            </div>
            <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-xl space-y-6">
              <h3 className="text-lg font-bold text-slate-800 leading-relaxed">{currentStepInfo.question}</h3>
              <textarea 
                value={(answers as any)[currentStepInfo.id]}
                onChange={(e) => setAnswers({ ...answers, [currentStepInfo.id]: e.target.value })}
                className="w-full min-h-[200px] p-6 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
              />
              <div className="flex justify-between items-center pt-4">
                <button onClick={prevStep} disabled={currentStep === 0} className={`px-6 py-3 rounded-xl font-bold ${currentStep === 0 ? 'text-slate-200' : 'text-slate-500'}`}>戻る</button>
                <button onClick={nextStep} className="px-8 py-3 bg-slate-900 text-white rounded-xl font-bold flex items-center gap-2">
                  {currentStep === STEPS.length - 1 ? "クラッシュテストを開始" : "次へ進む"} <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </main>
  );
}

function ResultView({ result, onRestart }: { result: any, onRestart: () => void }) {
  const isSurvived = result.survivalRate > 50;
  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="bg-white p-12 rounded-[40px] border border-slate-200 shadow-2xl overflow-hidden relative">
          <div className={`absolute top-0 right-0 p-8 flex flex-col items-center ${isSurvived ? 'text-emerald-500' : 'text-rose-500'}`}>
            <span className="text-[10px] font-black uppercase tracking-widest mb-1 opacity-50">Survival Rate</span>
            <span className="text-6xl font-black">{result.survivalRate}%</span>
          </div>

          <div className="flex items-center gap-4 mb-8">
            <div className={`p-4 rounded-3xl ${isSurvived ? 'bg-emerald-100 text-emerald-600' : 'bg-rose-100 text-rose-600'}`}>
              {isSurvived ? <Zap className="w-12 h-12" /> : <ShieldAlert className="w-12 h-12" />}
            </div>
            <div>
              <h1 className="text-4xl font-black text-slate-900">{isSurvived ? "SURVIVED" : "CRUSHED"}</h1>
              <p className="text-slate-500 font-medium">AI Crash Engine による極限検証の結果</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <JudgeCard title="冷徹な投資家" data={result.results.investor} icon={TrendingUp} />
            <JudgeCard title="既存の競合" data={result.results.competitor} icon={ShieldAlert} />
            <JudgeCard title="懐疑的な顧客" data={result.results.customer} icon={Activity} />
          </div>

          <button onClick={onRestart} className="w-full bg-slate-900 text-white py-5 rounded-2xl font-bold hover:bg-slate-800 transition-all flex items-center justify-center gap-3">
            ハブ画面へ戻る
          </button>
        </div>
      </div>
    </div>
  );
}

function JudgeCard({ title, data, icon: Icon }: { title: string, data: any, icon: any }) {
  const score = data.survivalScore;
  return (
    <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100">
      <div className="flex justify-between items-start mb-4">
        <div className="p-2 bg-white rounded-xl shadow-sm"><Icon className="w-5 h-5 text-slate-400" /></div>
        <span className={`text-xl font-bold ${score > 70 ? 'text-emerald-500' : score > 30 ? 'text-amber-500' : 'text-rose-500'}`}>{score}%</span>
      </div>
      <h4 className="font-bold text-slate-800 mb-2">{title}</h4>
      <p className="text-xs text-slate-500 leading-relaxed mb-4">{data.feedback}</p>
      <div className="space-y-1">
        {data.fatalFlaws.slice(0, 2).map((f: string, i: number) => (
          <div key={i} className="flex gap-2 text-[10px] text-rose-600 font-bold">
            <AlertTriangle className="w-3 h-3 shrink-0" /> {f}
          </div>
        ))}
      </div>
    </div>
  );
}

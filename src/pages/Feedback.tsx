import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Star, TrendingUp, BookOpen, AlertCircle, CheckCircle2, ArrowRight } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { generateSessionFeedback } from '../services/geminiService';
import { SessionFeedback } from '../types';

export default function Feedback({ 
  transcript, 
  duration, 
  onClose 
}: { 
  transcript: any[], 
  duration: number, 
  onClose: () => void 
}) {
  const { profile, updateProfile } = useAuth();
  const [feedback, setFeedback] = useState<SessionFeedback | null>(null);
  const [isGenerating, setIsGenerating] = useState(true);

  useEffect(() => {
    async function getFeedback() {
      if (!profile) return;
      try {
        const result = await generateSessionFeedback(profile, transcript, duration);
        setFeedback(result);
        
        // Update user stats
        const xpGained = Math.floor(duration / 10) + 10;
        await updateProfile({
          xp: profile.xp + xpGained,
          streak: profile.streak === 0 ? 1 : profile.streak // Simple logic for demo
        });
      } catch (error) {
        console.error("Feedback generation failed", error);
      } finally {
        setIsGenerating(false);
      }
    }
    getFeedback();
  }, []);

  if (isGenerating) {
    return (
      <div className="fixed inset-0 z-[110] bg-[#0F0F12] flex flex-col items-center justify-center p-12 text-center">
        <div className="atmosphere-bg" />
        <div className="w-40 h-40 relative mb-8">
           <div className="absolute inset-0 bg-indigo-500/20 blur-[60px] rounded-full animate-pulse" />
           <div className="w-full h-full rounded-full border-4 border-white/5 border-t-indigo-500 animate-spin relative z-10" />
        </div>
        <h2 className="text-5xl font-display font-black italic mb-4 text-gradient">Lumina is thinking...</h2>
        <p className="text-slate-400 max-w-md font-serif italic text-lg decoration-indigo-500/20 underline underline-offset-8 decoration-wavy">Analysing your grammar, vocabulary, and fluency to provide actionable feedback.</p>
      </div>
    );
  }

  if (!feedback) return null;

  return (
    <div className="fixed inset-0 z-[110] bg-[#0F0F12] overflow-y-auto overflow-x-hidden">
      <div className="atmosphere-bg opacity-30" />
      
      <main className="max-w-6xl mx-auto px-6 py-20 relative z-10">
        <header className="text-center mb-24">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-24 h-24 rounded-[2rem] bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 mx-auto mb-8 flex items-center justify-center shadow-[0_0_60px_rgba(99,102,241,0.3)] relative group"
          >
            <div className="absolute inset-0 bg-white/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity rounded-[2rem]" />
            <Star className="w-12 h-12 text-white relative z-10" />
          </motion.div>
          <h1 className="text-6xl md:text-7xl font-display italic font-black mb-6 text-gradient uppercase tracking-tight">EXCELLENT WORK, {profile?.name}!</h1>
          <p className="text-slate-400 text-xl font-serif italic">You've gained <span className="text-indigo-400 font-bold underline decoration-indigo-500/30 decoration-double">+{Math.floor(duration / 10) + 10} XP</span> from this session.</p>
        </header>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          <ScoreCard label="Pronunciation" score={feedback.pronunciation} />
          <ScoreCard label="Grammar" score={feedback.grammar} />
          <ScoreCard label="Fluency" score={feedback.fluency} />
          <ScoreCard label="Vocabulary" score={feedback.vocabulary} />
        </div>

        <div className="grid lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2 space-y-12">
            <section className="p-12 rounded-[3.5rem] glass border border-white/10 space-y-6 shadow-2xl backdrop-blur-3xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 blur-[100px] rounded-full" />
              <div className="flex items-center gap-4 mb-2">
                <div className="p-3 rounded-2xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                  <TrendingUp className="w-7 h-7" />
                </div>
                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-[0.2em]">Performance Summary</h3>
              </div>
              <p className="text-slate-200 leading-relaxed text-2xl font-serif italic">"{feedback.notes}"</p>
            </section>

            <div className="grid md:grid-cols-2 gap-8">
              <section className="p-10 rounded-[3rem] glass-dark border border-white/5 space-y-6 shadow-xl">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-pink-500/10 flex items-center justify-center border border-pink-500/20">
                    <AlertCircle className="w-5 h-5 text-pink-400" />
                  </div>
                  <h4 className="font-bold text-slate-100 text-xs uppercase tracking-widest">Next Steps</h4>
                </div>
                <ul className="space-y-4">
                  {feedback.improvements.map((item, i) => (
                    <li key={i} className="flex gap-4 text-sm text-slate-400 leading-relaxed group">
                      <div className="w-2 h-2 rounded-full bg-pink-500 mt-2 shrink-0 group-hover:scale-125 transition-transform shadow-[0_0_8px_rgba(236,72,153,0.4)]" />
                      {item}
                    </li>
                  ))}
                </ul>
              </section>

              <section className="p-10 rounded-[3rem] glass-dark border border-white/5 space-y-6 shadow-xl">
                <div className="flex items-center gap-4 mb-4">
                   <div className="w-10 h-10 rounded-xl bg-green-500/10 flex items-center justify-center border border-green-500/20">
                     <BookOpen className="w-5 h-5 text-green-400" />
                   </div>
                  <h4 className="font-bold text-slate-100 text-xs uppercase tracking-widest">New Vocabulary</h4>
                </div>
                <div className="flex flex-wrap gap-3">
                  {feedback.newWords.map((word, i) => (
                    <span key={i} className="px-5 py-2.5 rounded-2xl bg-white/[0.03] text-sm font-bold border border-white/5 text-slate-300 hover:bg-white/[0.08] transition-colors cursor-default">{word}</span>
                  ))}
                </div>
              </section>
            </div>
          </div>

          <aside className="space-y-8">
            <div className="p-10 rounded-[3rem] bg-indigo-600/10 border border-indigo-500/20 space-y-8 text-center relative overflow-hidden group">
               <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-purple-500/5" />
               <div className="relative z-10">
                 <div className="w-20 h-20 rounded-[2rem] bg-indigo-500 flex items-center justify-center mx-auto mb-6 shadow-2xl transition-transform group-hover:rotate-12 group-hover:scale-110">
                    <Crown className="w-10 h-10 text-white" />
                 </div>
                 <h3 className="text-xs font-bold text-indigo-400 uppercase tracking-widest mb-2">Achievement Unlocked</h3>
                 <p className="text-slate-100 font-serif italic text-xl">"Silver Tongue"</p>
                 <p className="text-slate-500 text-sm mt-4 leading-relaxed font-medium">Your fluency is improving. Keep it up for the next badge!</p>
               </div>
            </div>
            
            <button 
              onClick={onClose}
              className="w-full py-6 rounded-[2.5rem] bg-slate-100 text-[#0A0A0C] font-black text-2xl flex items-center justify-center gap-4 group shadow-[0_20px_50px_rgba(0,0,0,0.3)] hover:scale-[1.02] active:scale-95 transition-all"
            >
              FINISH SESSION
              <ArrowRight className="w-7 h-7 transition-transform group-hover:translate-x-2" />
            </button>
          </aside>
        </div>
      </main>
    </div>
  );
}

import { Crown } from "lucide-react";

function ScoreCard({ label, score }: { label: string, score: number }) {
  return (
    <div className="p-10 rounded-[2.5rem] glass border border-white/5 text-center flex flex-col items-center shadow-xl backdrop-blur-2xl hover:bg-white/[0.04] transition-colors">
      <div className="relative w-24 h-24 mb-6">
         <svg className="w-full h-full transform -rotate-90">
           <circle
             cx="48"
             cy="48"
             r="44"
             stroke="currentColor"
             strokeWidth="6"
             fill="transparent"
             className="text-white/5"
           />
           <motion.circle
             cx="48"
             cy="48"
             r="44"
             stroke="currentColor"
             strokeWidth="6"
             fill="transparent"
             initial={{ strokeDashoffset: 276.46 }}
             animate={{ strokeDashoffset: 276.46 - (276.46 * score) / 100 }}
             transition={{ duration: 1.5, ease: "easeOut" }}
             strokeDasharray="276.46"
             className="text-indigo-500 shadow-[0_0_15px_rgba(99,102,241,0.5)]"
             strokeLinecap="round"
           />
         </svg>
         <div className="absolute inset-0 flex items-center justify-center font-display font-black text-3xl italic tracking-tighter text-slate-100">
            {score}
         </div>
      </div>
      <div className="text-[10px] uppercase font-bold tracking-[0.2em] text-slate-500">{label}</div>
    </div>
  );
}

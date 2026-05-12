import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronRight, ChevronLeft, Mic, Target, Zap, User } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { AgeGroup, EnglishLevel } from '../types';

export default function Onboarding() {
  const [step, setStep] = useState(1);
  const { updateProfile } = useAuth();
  const [formData, setFormData] = useState({
    age: 25,
    ageGroup: 'adults' as AgeGroup,
    englishLevel: 'beginner' as EnglishLevel,
    goals: [] as string[],
    personaPreference: 'Friendly Friend'
  });

  const nextStep = () => setStep(s => s + 1);
  const prevStep = () => setStep(s => s - 1);

  const completeOnboarding = async () => {
    await updateProfile({
      ...formData,
      onboardingCompleted: true
    });
  };

  const toggleGoal = (goal: string) => {
    setFormData(prev => ({
      ...prev,
      goals: prev.goals.includes(goal) 
        ? prev.goals.filter(g => g !== goal)
        : [...prev.goals, goal]
    }));
  };

  return (
    <div className="min-h-screen relative overflow-hidden flex items-center justify-center p-6 bg-[#0F0F12]">
      <div className="atmosphere-bg opacity-40" />
      
      <div className="relative z-10 w-full max-w-2xl bg-white/[0.03] backdrop-blur-3xl border border-white/10 rounded-[3rem] p-12 shadow-2xl">
        <div className="mb-12 flex justify-between items-center text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">
          <span>Step {step} of 4</span>
          <div className="flex gap-1.5">
             {[1,2,3,4].map(s => (
               <div key={s} className={`h-1 w-10 rounded-full transition-all duration-500 ${s <= step ? 'bg-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.4)]' : 'bg-white/5'}`} />
             ))}
          </div>
        </div>

        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              className="space-y-8"
            >
              <div>
                <h2 className="text-5xl font-display italic font-black mb-4 text-gradient">HELLO! WHO ARE YOU?</h2>
                <p className="text-slate-400 mb-8 font-serif italic text-lg leading-relaxed">Tell Lumina a bit about yourself so she can adapt her personality to you.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <OptionCard 
                  active={formData.ageGroup === 'kids'} 
                  onClick={() => setFormData({ ...formData, ageGroup: 'kids', age: 8 })}
                  icon={Mic}
                  title="Kids"
                  subtitle="5-12 Years"
                />
                <OptionCard 
                  active={formData.ageGroup === 'teenagers'} 
                  onClick={() => setFormData({ ...formData, ageGroup: 'teenagers', age: 16 })}
                  icon={Zap}
                  title="Teens"
                  subtitle="13-19 Years"
                />
                <OptionCard 
                  active={formData.ageGroup === 'adults'} 
                  onClick={() => setFormData({ ...formData, ageGroup: 'adults', age: 25 })}
                  icon={User}
                  title="Adults"
                  subtitle="20+ Years"
                />
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              className="space-y-8"
            >
              <div>
                <h2 className="text-5xl font-display italic font-black mb-4 text-gradient">WHAT'S YOUR LEVEL?</h2>
                <p className="text-slate-400 mb-8 font-serif italic text-lg leading-relaxed">Lumina will adjust her vocabulary and speed to match your pace.</p>
              </div>

              <div className="space-y-4">
                <LevelItem 
                  active={formData.englishLevel === 'beginner'} 
                  onClick={() => setFormData({ ...formData, englishLevel: 'beginner' })}
                  title="Beginner"
                  desc="I can say basic greetings and simple sentences."
                />
                <LevelItem 
                  active={formData.englishLevel === 'intermediate'} 
                  onClick={() => setFormData({ ...formData, englishLevel: 'intermediate' })}
                  title="Intermediate"
                  desc="I can have daily conversations but struggle with complex topics."
                />
                <LevelItem 
                  active={formData.englishLevel === 'advanced'} 
                  onClick={() => setFormData({ ...formData, englishLevel: 'advanced' })}
                  title="Advanced"
                  desc="I speak fluently but want to master nuance and idioms."
                />
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              className="space-y-8"
            >
              <div>
                <h2 className="text-5xl font-display italic font-black mb-4 text-gradient">YOUR GOALS?</h2>
                <p className="text-slate-400 mb-8 font-serif italic text-lg leading-relaxed">Pick what matters most. Lumina will build sessions around these.</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {['Speak Fluently', 'Job Interview', 'Travel English', 'Pronunciation', 'Business', 'Daily Chat'].map(goal => (
                  <button
                    key={goal}
                    onClick={() => toggleGoal(goal)}
                    className={`p-6 rounded-[2rem] border text-sm font-bold transition-all ${
                      formData.goals.includes(goal) 
                      ? 'bg-indigo-600 border-indigo-400 text-white shadow-[0_0_25px_rgba(99,102,241,0.4)]' 
                      : 'bg-white/5 border-white/10 text-slate-400 hover:bg-white/10 hover:text-slate-200'
                    }`}
                  >
                    {goal}
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {step === 4 && (
            <motion.div
              key="step4"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              className="space-y-8 text-center"
            >
              <div className="w-32 h-32 rounded-full bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 mx-auto mb-10 flex items-center justify-center p-6 shadow-2xl relative">
                  <div className="absolute inset-0 blur-2xl bg-indigo-500/30 animate-pulse rounded-full" />
                  <Target className="w-full h-full text-white relative z-10" />
              </div>
              <div>
                <h2 className="text-5xl font-display italic font-black mb-4 text-gradient">YOU'RE READY!</h2>
                <p className="text-slate-400 mb-10 font-serif italic text-lg leading-relaxed max-w-md mx-auto">Lumina has created your personalized learning path. Let's start the first conversation.</p>
              </div>
              <button 
                onClick={completeOnboarding}
                className="w-full py-6 rounded-[2rem] bg-slate-100 text-[#0A0A0C] font-black text-xl hover:scale-[1.02] active:scale-95 transition-all shadow-xl shadow-white/5"
              >
                GO TO DASHBOARD
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {step < 4 && (
          <div className="mt-12 flex justify-between pt-10 border-t border-white/5">
            <button 
              onClick={prevStep}
              disabled={step === 1}
              className="flex items-center gap-2 text-slate-500 hover:text-slate-100 disabled:opacity-0 transition-all font-bold tracking-widest text-xs"
            >
              <ChevronLeft className="w-5 h-5" />
              BACK
            </button>
            <button 
              onClick={nextStep}
              className="flex items-center gap-2 bg-indigo-600 text-white px-10 py-4 rounded-2xl font-bold hover:bg-indigo-500 transition-all shadow-[0_0_30px_rgba(99,102,241,0.3)] hover:scale-105 active:scale-95"
            >
              NEXT
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function OptionCard({ active, onClick, icon: Icon, title, subtitle }: any) {
  return (
    <button
      onClick={onClick}
      className={`p-8 rounded-[2.5rem] border flex flex-col items-center gap-3 transition-all ${
        active 
        ? 'bg-indigo-600 border-indigo-400 text-white shadow-[0_0_20px_rgba(99,102,241,0.4)]' 
        : 'bg-white/5 border-white/10 text-slate-500 hover:bg-white/10'
      }`}
    >
      <Icon className={`w-10 h-10 mb-2 ${active ? 'text-white' : 'text-slate-400'}`} />
      <div className="font-bold text-lg">{title}</div>
      <div className="text-[10px] uppercase font-bold tracking-widest opacity-60">{subtitle}</div>
    </button>
  );
}

function LevelItem({ active, onClick, title, desc }: any) {
  return (
    <button
      onClick={onClick}
      className={`w-full p-8 rounded-[2.5rem] border flex flex-col justify-center text-left transition-all ${
        active 
        ? 'bg-indigo-600 border-indigo-400 text-white shadow-[0_0_25px_rgba(99,102,241,0.4)]' 
        : 'bg-white/5 border-white/10 text-slate-500 hover:bg-white/10'
      }`}
    >
      <div className={`font-black text-2xl italic mb-1 ${active ? 'text-white' : 'text-slate-200'}`}>{title}</div>
      <div className={`text-sm font-medium ${active ? 'text-indigo-100' : 'text-slate-500'}`}>{desc}</div>
    </button>
  );
}

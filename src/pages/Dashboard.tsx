import { motion } from "motion/react";
import { Mic, Zap, Flame, Crown, Clock, Calendar, ArrowRight } from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import Navigation from "../components/Navigation";

export default function Dashboard({ onStartCall }: { onStartCall: () => void }) {
  const { profile } = useAuth();

  if (!profile) return null;

  return (
    <div className="flex min-h-screen bg-[#0F0F12]">
      <Navigation />
      
      <main className="flex-1 pl-20 pr-8 py-8 md:px-12 md:pl-32 max-w-7xl mx-auto w-full">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
          <div>
            <h1 className="text-4xl font-display italic font-black mb-2 text-gradient">Welcome back, {profile.name}</h1>
            <p className="text-slate-400">Ready to sharpen your skills today?</p>
          </div>
          <div className="flex gap-4">
            <StatCard icon={Flame} value={profile.streak} label="Day Streak" color="text-orange-400" />
            <StatCard icon={Zap} value={profile.xp} label="Total XP" color="text-indigo-400" />
            <StatCard icon={Crown} value={profile.level} label="Level" color="text-purple-400" />
          </div>
        </header>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Action */}
          <section className="lg:col-span-2 space-y-8">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onStartCall}
              className="w-full h-64 rounded-[2.5rem] bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 relative overflow-hidden group p-10 flex flex-col justify-end text-left shadow-2xl"
            >
              <div className="absolute top-10 right-10 w-32 h-32 rounded-3xl bg-white/10 flex items-center justify-center transition-transform group-hover:scale-110 group-hover:rotate-12 backdrop-blur-md border border-white/10">
                 <Mic className="w-16 h-16 text-white" />
              </div>
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.1),transparent)]" />
              <div className="relative z-10">
                <span className="px-4 py-1.5 rounded-full bg-black/20 text-xs font-bold uppercase tracking-widest mb-4 inline-block backdrop-blur-md border border-white/5">Daily Training</span>
                <h2 className="text-4xl font-display font-black leading-tight italic text-white">PRACTICE WITH <br /> LUMINA</h2>
              </div>
            </motion.button>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="p-8 rounded-3xl glass space-y-4">
                <div className="flex justify-between items-center text-slate-100">
                  <h3 className="text-xs font-bold text-indigo-400 uppercase tracking-widest">Suggested Topics</h3>
                  <Calendar className="w-5 h-5 text-slate-500" />
                </div>
                <div className="space-y-3">
                  <TopicItem title="Job Interview Prep" difficulty="Intermediate" />
                  <TopicItem title="Travel Survival" difficulty="Beginner" />
                  <TopicItem title="Crypto & Tech News" difficulty="Advanced" />
                </div>
              </div>
              <div className="p-8 rounded-3xl glass space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-xs font-bold text-pink-400 uppercase tracking-widest">Daily Goal</h3>
                  <Clock className="w-5 h-5 text-slate-500" />
                </div>
                <div className="pt-4">
                   <div className="flex justify-between text-sm mb-2 text-slate-400">
                     <span className="font-medium">Time trained today</span>
                     <span className="font-bold text-slate-100">12 / 30 mins</span>
                   </div>
                   <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                     <div className="h-full bg-indigo-500 w-[40%] rounded-full shadow-[0_0_15px_rgba(99,102,241,0.5)]" />
                   </div>
                </div>
              </div>
            </div>
          </section>

          {/* Sidebar */}
          <section className="space-y-8">
            <div className="p-8 rounded-[2rem] glass-dark space-y-6">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Recent Progress</h3>
              <div className="space-y-6">
                <ProgressItem label="Vocabulary" value={82} color="bg-purple-500" />
                <ProgressItem label="Grammar Accuracy" value={65} color="bg-pink-500" />
                <ProgressItem label="Speaking Fluency" value={78} color="bg-indigo-500" />
                <ProgressItem label="Pronunciation" value={91} color="bg-green-400" />
              </div>
              <button className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/5 transition-all font-medium group text-slate-300">
                View Full Analytics
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </button>
            </div>

            <div className="p-8 rounded-[2rem] bg-indigo-900/10 border border-indigo-500/20 shadow-xl overflow-hidden relative group">
               <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/10 blur-3xl rounded-full" />
               <h4 className="font-bold mb-2 text-indigo-300">Next Milestone</h4>
               <p className="text-xs text-slate-500 mb-6 font-medium">Complete 3 more sessions to reach Level 2</p>
               <div className="flex -space-x-2">
                 {[1,2,3,4].map(i => (
                   <div key={i} className="w-8 h-8 rounded-full border-2 border-[#0A0A0C] bg-indigo-500/30 flex items-center justify-center text-[10px] font-bold text-indigo-200">
                     {i}
                   </div>
                 ))}
               </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}

function StatCard({ icon: Icon, value, label, color }: { icon: any; value: number; label: string; color: string }) {
  return (
    <div className="px-6 py-4 rounded-2xl glass flex items-center gap-4">
      <div className={`p-3 rounded-xl bg-white/5 ${color}`}>
        <Icon className="w-6 h-6" />
      </div>
      <div>
        <div className="text-2xl font-black font-display tracking-tight">{value}</div>
        <div className="text-[10px] uppercase tracking-widest text-white/40 font-bold">{label}</div>
      </div>
    </div>
  );
}

function TopicItem({ title, difficulty }: { title: string; difficulty: string }) {
  return (
    <div className="flex items-center justify-between p-4 rounded-2xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.05] transition-all cursor-pointer group">
      <span className="font-medium group-hover:translate-x-1 transition-transform text-slate-200">{title}</span>
      <span className="text-[10px] uppercase font-bold text-slate-500">{difficulty}</span>
    </div>
  );
}

function ProgressItem({ label, value, color = "bg-indigo-500" }: { label: string; value: number; color?: string }) {
  return (
    <div className="space-y-2">
      <div className="flex justify-between text-xs font-medium">
        <span className="text-slate-500">{label}</span>
        <span className="text-slate-100">{value}%</span>
      </div>
      <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
        <div className={`h-full ${color} rounded-full`} style={{ width: `${value}%` }} />
      </div>
    </div>
  );
}

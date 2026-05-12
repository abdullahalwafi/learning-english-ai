import { motion } from "motion/react";
import { Mic, Globe, Zap, Heart, Shield } from "lucide-react";
import { useAuth } from "../hooks/useAuth";

export default function Landing() {
  const { login } = useAuth();

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#0F0F12]">
      <div className="atmosphere-bg opacity-40" />
      
      {/* Navigation */}
      <nav className="relative z-10 flex items-center justify-between px-6 py-8 md:px-12 max-w-7xl mx-auto">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center shadow-lg">
            <Mic className="text-white w-6 h-6" />
          </div>
          <span className="font-display text-2xl font-black italic tracking-tighter text-slate-100">LUMINA</span>
        </div>
        <button 
          onClick={login}
          className="px-6 py-2 rounded-full glass hover:bg-white/10 transition-all font-medium text-sm text-slate-200"
        >
          Sign In
        </button>
      </nav>

      {/* Hero Section */}
      <main className="relative z-10 max-w-7xl mx-auto px-6 pt-20 pb-32">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-6xl md:text-8xl font-display font-black leading-[0.9] text-gradient mb-8">
              SPEAK <br />
              <span className="italic">FLAWLESSLY.</span>
            </h1>
            <p className="text-lg md:text-xl text-slate-400 max-w-md mb-10 leading-relaxed font-serif italic">
              Your emotionally-intelligent AI speaking partner. Level up your English through natural, real-time conversations that feel like calling a friend.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <button 
                onClick={login}
                className="px-8 py-4 rounded-full bg-slate-100 text-[#0A0A0C] font-bold text-lg hover:scale-105 transition-transform shadow-[0_0_30px_rgba(255,255,255,0.1)]"
              >
                Start Training Now
              </button>
              <button className="px-8 py-4 rounded-full glass hover:bg-white/10 transition-all font-medium text-slate-200">
                Watch Demo
              </button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="relative h-[600px] hidden lg:block"
          >
            <div className="absolute inset-0 bg-indigo-500/10 blur-[100px] rounded-full animate-pulse" />
            <div className="relative h-full flex items-center justify-center">
              <div className="w-[400px] h-[400px] rounded-[48px] glass border border-white/10 p-8 flex flex-col items-center justify-center text-center backdrop-blur-3xl shadow-2xl">
                <div className="relative w-32 h-32 mb-8">
                  <div className="ai-avatar-aura" />
                  <div className="ai-avatar-core w-full h-full flex items-center justify-center">
                    <Mic className="w-12 h-12 text-indigo-900" />
                  </div>
                </div>
                <h3 className="text-3xl font-display italic mb-2 text-slate-100">Lumina AI</h3>
                <p className="text-xs text-indigo-400 mb-6 uppercase tracking-widest font-mono font-bold">Real-time Analysis Active</p>
                <div className="flex gap-2 h-10 items-center">
                   {[...Array(12)].map((_, i) => (
                     <motion.div 
                       key={i}
                       animate={{ height: [4, 32, 4] }}
                       transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.08 }}
                       className="w-1 bg-gradient-to-t from-indigo-500 to-pink-500 rounded-full"
                     />
                   ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Features */}
        <div className="mt-40 grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { icon: Globe, title: "Any Level", desc: "From basic phrases to business negotiation.", color: "text-indigo-400" },
            { icon: Zap, title: "Real-time", desc: "Instant corrections and natural flow.", color: "text-purple-400" },
            { icon: Heart, title: "Safe Space", desc: "No judgment, just pure encouragement.", color: "text-pink-400" },
            { icon: Shield, title: "Parent Safe", desc: "Filtered, safe content for all ages.", color: "text-green-400" },
          ].map((f, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              viewport={{ once: true }}
              className="p-8 rounded-3xl glass hover:bg-white/[0.05] transition-all border-white/5 group"
            >
              <f.icon className={`w-8 h-8 ${f.color} mb-4 transition-transform group-hover:scale-110`} />
              <h4 className="text-xl font-bold mb-2 text-slate-100">{f.title}</h4>
              <p className="text-slate-500 text-sm leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </main>
    </div>
  );
}

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Mic, MicOff, PhoneOff, Settings, Volume2, User, MessageCircle } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { VoiceWave } from '../components/VoiceWave';
import { GoogleGenAI, Chat } from '@google/genai';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY as string });

export default function Call({ onEnd }: { onEnd: (transcript: any[], duration: number) => void }) {
  const { profile } = useAuth();
  const [isMuted, setIsMuted] = useState(false);
  const [isAIspeaking, setIsAIspeaking] = useState(false);
  const [isUserSpeaking, setIsUserSpeaking] = useState(false);
  const [transcript, setTranscript] = useState<{ role: string; text: string }[]>([]);
  const [currentText, setCurrentText] = useState("");
  const [duration, setDuration] = useState(0);
  const recognitionRef = useRef<any>(null);
  const chatRef = useRef<Chat | null>(null);

  useEffect(() => {
    const timer = setInterval(() => setDuration(d => d + 1), 1000);
    startSession();
    return () => {
      clearInterval(timer);
      stopRecognition();
    };
  }, []);

  const startSession = async () => {
    if (!profile) return;
    
    chatRef.current = ai.chats.create({
      model: "gemini-3-flash-preview",
      config: {
        systemInstruction: `You are Lumina, a friendly English speaking partner for ${profile.name}.
          User age group: ${profile.ageGroup}. Level: ${profile.englishLevel}. Goals: ${profile.goals.join(', ')}.
          Speak naturally, keep your responses concise (2-3 sentences), and encourage the user to speak more.
          Vary your tone based on user emotions. Current persona: Friendly Teacher.`
      }
    });

    // Initial greeting
    const greeting = `Hello ${profile.name}! It's great to see you today. What would you like to talk about to practice your English?`;
    speak(greeting);
    setTranscript([{ role: "ai", text: greeting }]);
  };

  const startRecognition = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) return;

    recognitionRef.current = new SpeechRecognition();
    recognitionRef.current.continuous = true;
    recognitionRef.current.interimResults = true;
    recognitionRef.current.lang = 'en-US';

    recognitionRef.current.onstart = () => setIsUserSpeaking(true);
    recognitionRef.current.onend = () => setIsUserSpeaking(false);
    
    recognitionRef.current.onresult = (event: any) => {
      const result = event.results[event.results.length - 1];
      const text = result[0].transcript;
      setCurrentText(text);

      if (result.isFinal) {
        handleUserMessage(text);
      }
    };

    recognitionRef.current.start();
  };

  const stopRecognition = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
  };

  const handleUserMessage = async (text: string) => {
    if (!chatRef.current) return;
    setTranscript(prev => [...prev, { role: "user", text }]);
    setIsUserSpeaking(false);
    
    try {
      const response = await chatRef.current.sendMessage({ message: text });
      const aiText = response.text;
      setTranscript(prev => [...prev, { role: "ai", text: aiText }]);
      speak(aiText);
    } catch (error) {
      console.error("AI Error:", error);
    }
  };

  const speak = (text: string) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.onstart = () => setIsAIspeaking(true);
    utterance.onend = () => {
      setIsAIspeaking(false);
      if (!isMuted) startRecognition();
    };
    window.speechSynthesis.speak(utterance);
  };

  const handleMute = () => {
    setIsMuted(!isMuted);
    if (!isMuted) {
      stopRecognition();
    } else {
      startRecognition();
    }
  };

  const formatTime = (s: number) => {
    const mins = Math.floor(s / 60);
    const secs = s % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="fixed inset-0 z-[100] flex flex-col bg-[#0F0F12] text-slate-100">
      <div className="atmosphere-bg opacity-30" />
      
      {/* Header */}
      <header className="p-8 flex justify-between items-center relative z-10 border-b border-white/5 backdrop-blur-md">
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="w-4 h-4 rounded-full bg-pink-500 animate-pulse" />
            <div className="absolute inset-0 bg-pink-500/40 blur-md rounded-full animate-pulse" />
          </div>
          <span className="font-mono text-[10px] font-bold tracking-[0.2em] uppercase text-slate-500">Live Session • {formatTime(duration)}</span>
        </div>
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex px-4 py-1.5 rounded-full glass border border-white/5 text-[10px] font-black uppercase italic tracking-widest text-indigo-400">
            {profile?.englishLevel}
          </div>
          <button onClick={() => onEnd(transcript, duration)} className="w-10 h-10 rounded-full glass hover:bg-white/10 transition-all flex items-center justify-center border border-white/5">
            <Settings className="w-5 h-5 text-slate-400" />
          </button>
        </div>
      </header>

      {/* Main Call Area */}
      <main className="flex-1 flex flex-col items-center justify-center p-6 relative z-10">
        <div className="w-full max-w-5xl grid md:grid-cols-2 gap-20 items-center">
          {/* AI Avatar Area */}
          <div className="flex flex-col items-center text-center">
            <div className="relative mb-16">
              <div className="absolute inset-0 bg-indigo-500/10 blur-[100px] rounded-full" />
              <motion.div 
                animate={{ 
                  scale: isAIspeaking ? [1, 1.05, 1] : 1,
                }}
                transition={{ duration: 0.5, repeat: isAIspeaking ? Infinity : 0 }}
                className="w-72 h-72 rounded-[4rem] glass border border-white/10 p-2 flex items-center justify-center relative shadow-2xl backdrop-blur-3xl"
              >
                <div className="w-full h-full rounded-[3.5rem] bg-gradient-to-br from-indigo-900/40 via-purple-900/40 to-pink-900/40 flex items-center justify-center overflow-hidden">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.1),transparent)]" />
                  <div className="relative z-10">
                     <VoiceWave isSpeaking={isAIspeaking} color="bg-indigo-400" />
                  </div>
                </div>
              </motion.div>
              <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 px-8 py-3 rounded-2xl glass font-black italic text-sm text-gradient border border-white/10 shadow-2xl">
                 Lumina AI
              </div>
            </div>
            
            <div className="h-24">
              <AnimatePresence>
                {isAIspeaking && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="p-6 rounded-[2.5rem] glass-dark border border-white/5 text-lg font-serif italic text-slate-200 max-w-sm mx-auto shadow-2xl"
                  >
                    "{transcript[transcript.length - 1]?.text}"
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* User Side */}
          <div className="flex flex-col items-center text-center">
            <div className="relative mb-16">
              <div className="absolute inset-0 bg-pink-500/5 blur-[80px] rounded-full" />
              <div className="w-56 h-56 rounded-full glass border border-white/10 p-2 flex items-center justify-center relative shadow-xl">
                <div className="w-full h-full rounded-full bg-white/[0.03] flex items-center justify-center overflow-hidden border border-white/5">
                   {profile?.name ? (
                     <span className="text-7xl font-display font-black text-slate-800">{profile.name[0]}</span>
                   ) : (
                     <User className="w-24 h-24 text-slate-800" />
                   )}
                </div>
                {isUserSpeaking && (
                   <div className="absolute inset-0 flex items-center justify-center rotate-90 scale-75">
                      <VoiceWave isSpeaking={true} color="bg-pink-500 shadow-[0_0_15px_rgba(236,72,153,0.5)]" />
                   </div>
                )}
              </div>
            </div>
            
            <div className="space-y-6">
              <h3 className="text-3xl font-display font-black italic tracking-tight text-slate-100">{profile?.name}</h3>
              <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 min-h-[4rem] flex items-center justify-center">
                <p className={`text-sm font-medium transition-colors ${currentText ? 'text-slate-200' : 'text-slate-500 italic'}`}>
                  {currentText || (isUserSpeaking ? "Listening to you..." : "Waiting for your turn...")}
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Controls */}
      <footer className="p-12 pb-20 flex justify-center items-center gap-10 relative z-10">
        <button 
          onClick={handleMute}
          className={`w-16 h-16 rounded-3xl flex items-center justify-center transition-all border ${isMuted ? 'bg-pink-500/10 border-pink-500/20 text-pink-500 shadow-xl shadow-pink-500/10' : 'glass border-white/5 text-slate-400 hover:text-slate-100'}`}
        >
          {isMuted ? <MicOff className="w-7 h-7" /> : <Mic className="w-7 h-7" />}
        </button>
        
        <button 
          onClick={() => onEnd(transcript, duration)}
          className="w-24 h-24 rounded-[2.5rem] bg-pink-600 flex items-center justify-center hover:bg-pink-500 transition-all hover:scale-110 shadow-[0_0_50px_rgba(219,39,119,0.3)] shadow-pink-600/40 active:scale-95 group"
        >
          <PhoneOff className="w-10 h-10 text-white transition-transform group-hover:rotate-[135deg]" />
        </button>
        
        <button className="w-16 h-16 rounded-3xl glass border border-white/5 flex items-center justify-center text-slate-400 hover:text-slate-100 transition-all">
          <Volume2 className="w-7 h-7" />
        </button>
      </footer>
    </div>
  );
}

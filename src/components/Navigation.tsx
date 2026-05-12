import { LogOut, Home, MessageSquare, Trophy, Settings, Mic } from "lucide-react";
import { useAuth } from "../hooks/useAuth";

export default function Navigation() {
  const { logout, profile } = useAuth();

  return (
    <nav className="fixed left-0 top-0 h-full w-20 flex flex-col items-center py-8 glass-dark z-50 border-r border-white/5">
      <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center mb-12 shadow-lg">
        <Mic className="text-white w-6 h-6" />
      </div>
      
      <div className="flex-1 flex flex-col gap-8">
        <NavIcon icon={Home} active />
        <NavIcon icon={MessageSquare} />
        <NavIcon icon={Trophy} />
        <NavIcon icon={Settings} />
      </div>

      <button 
        onClick={logout}
        className="w-10 h-10 flex items-center justify-center rounded-xl text-slate-500 hover:text-slate-100 hover:bg-white/5 transition-all"
      >
        <LogOut className="w-6 h-6" />
      </button>
    </nav>
  );
}

function NavIcon({ icon: Icon, active = false }: { icon: any; active?: boolean }) {
  return (
    <div className={`w-12 h-12 flex items-center justify-center rounded-2xl transition-all cursor-pointer ${
      active ? 'bg-indigo-500 text-white shadow-[0_0_20px_rgba(99,102,241,0.4)]' : 'text-slate-500 hover:text-slate-100 hover:bg-white/5'
    }`}>
      <Icon className="w-6 h-6" />
    </div>
  );
}

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { AuthProvider, useAuth } from './hooks/useAuth';
import Landing from './pages/Landing';
import Onboarding from './pages/Onboarding';
import Dashboard from './pages/Dashboard';
import Call from './pages/Call';
import Feedback from './pages/Feedback';

function AppContent() {
  const { user, profile, loading } = useAuth();
  const [view, setView] = useState<'home' | 'call' | 'feedback'>('home');
  const [sessionData, setSessionData] = useState<{ transcript: any[]; duration: number } | null>(null);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0F0F12] flex flex-col items-center justify-center">
        <div className="relative">
          <div className="absolute inset-0 bg-indigo-500/20 blur-2xl rounded-full animate-pulse" />
          <div className="w-16 h-16 rounded-full border-4 border-white/5 border-t-indigo-500 animate-spin relative z-10" />
        </div>
        <p className="mt-6 text-slate-500 font-mono text-[10px] uppercase tracking-[0.3em] animate-pulse">Initializing Lumina</p>
      </div>
    );
  }

  if (!user) {
    return <Landing />;
  }

  // If user exists but profile check isn't finished or onboarding is needed
  if (!profile || !profile.onboardingCompleted) {
    return <Onboarding />;
  }

  const handleStartCall = () => setView('call');
  
  const handleEndCall = (transcript: any[], duration: number) => {
    setSessionData({ transcript, duration });
    setView('feedback');
  };

  const handleCloseFeedback = () => {
    setSessionData(null);
    setView('home');
  };

  return (
    <>
      {view === 'home' && <Dashboard onStartCall={handleStartCall} />}
      {view === 'call' && <Call onEnd={handleEndCall} />}
      {view === 'feedback' && sessionData && (
        <Feedback 
          transcript={sessionData.transcript} 
          duration={sessionData.duration} 
          onClose={handleCloseFeedback} 
        />
      )}
    </>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

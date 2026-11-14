import React from 'react';
import { Sparkles, Flame, Smartphone, Monitor, Shield, Award, Volume2, VolumeX, Code2 } from 'lucide-react';
import { UserProfile } from '../types';
import { calculateLevelProgress } from '../utils/engine';

interface HeaderProps {
  profile: UserProfile;
  isMobileFrame: boolean;
  setIsMobileFrame: (val: boolean) => void;
  soundEnabled: boolean;
  setSoundEnabled: (val: boolean) => void;
  onOpenAndroidCode: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  profile,
  isMobileFrame,
  setIsMobileFrame,
  soundEnabled,
  setSoundEnabled,
  onOpenAndroidCode,
}) => {
  const { currentLevel, title, progressPercent, xpToNext } = calculateLevelProgress(profile.xp);

  return (
    <header className="w-full bg-[#070b14]/90 backdrop-blur-md border-b border-slate-800/80 sticky top-0 z-40 px-3 sm:px-6 py-2.5">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
        {/* Brand */}
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-purple-600 via-indigo-600 to-cyan-400 p-[1.5px] shadow-lg shadow-purple-900/30">
            <div className="w-full h-full bg-[#090e1a] rounded-[10px] flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-cyan-300" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold tracking-tight text-base sm:text-lg text-white font-sans">
                AURA <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400">MIND</span>
              </span>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-purple-500/10 border border-purple-500/20 text-purple-300 font-medium">
                ANDROID M3
              </span>
            </div>
            <p className="text-[11px] text-slate-400 hidden md:block">
              Train Your Mind · Master Your Voice · Level Up Your Presence
            </p>
          </div>
        </div>

        {/* Level, XP & Streak */}
        <div className="flex items-center gap-2 sm:gap-4">
          {/* Streak */}
          <div
            className="flex items-center gap-1 sm:gap-1.5 bg-amber-500/10 border border-amber-500/25 px-2 sm:px-2.5 py-1 rounded-lg text-amber-300 text-xs font-semibold"
            title={`${profile.streak} day streak`}
          >
            <Flame className="w-3.5 h-3.5 text-amber-400 fill-amber-400 animate-pulse" />
            <span>{profile.streak}d</span>
          </div>

          {/* Level Badge */}
          <div className="flex items-center gap-2 bg-slate-900/80 border border-slate-700/80 px-2.5 py-1 rounded-lg">
            <div className="w-6 h-6 rounded-md bg-purple-600/20 border border-purple-500/40 flex items-center justify-center text-[11px] font-bold text-purple-300 font-mono">
              {currentLevel}
            </div>
            <div className="hidden sm:block text-left">
              <div className="text-[11px] font-medium text-slate-200 leading-none">{title}</div>
              <div className="text-[10px] font-mono text-cyan-400 leading-tight">
                {profile.xp} XP <span className="text-slate-500">({xpToNext} to next)</span>
              </div>
            </div>
          </div>

          {/* Android Studio Inspector Button */}
          <button
            onClick={onOpenAndroidCode}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-xs font-medium transition-colors"
            title="Inspect Native Android Kotlin / Jetpack Compose Source"
          >
            <Code2 className="w-3.5 h-3.5" />
            <span className="hidden lg:inline">Android Code</span>
          </button>

          {/* Viewport Frame Toggle */}
          <button
            onClick={() => setIsMobileFrame(!isMobileFrame)}
            className={`p-1.5 rounded-lg border transition-colors ${
              isMobileFrame
                ? 'bg-purple-600/20 border-purple-500/40 text-purple-300'
                : 'bg-slate-800/60 border-slate-700 text-slate-400 hover:text-white'
            }`}
            title={isMobileFrame ? 'Switch to Fullscreen View' : 'Switch to Android Pixel 8 Frame'}
          >
            {isMobileFrame ? <Monitor className="w-4 h-4" /> : <Smartphone className="w-4 h-4" />}
          </button>

          {/* Sound Toggle */}
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className="p-1.5 rounded-lg bg-slate-800/60 border border-slate-700 text-slate-400 hover:text-white transition-colors"
            title={soundEnabled ? 'Mute Audio Cues' : 'Enable Audio Cues'}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4 text-cyan-400" /> : <VolumeX className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </header>
  );
};

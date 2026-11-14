import React, { useState } from 'react';
import { DailyMission, UserProfile, SocialScenarioChoice } from '../types';
import { CURRICULUM_DAYS } from '../data/curriculumData';
import { SOCIAL_SCENARIOS } from '../data/socialScenariosData';
import { GAMES_CATALOG } from '../data/gamesData';
import { awardUserXP } from '../utils/engine';
import {
  CheckCircle2,
  Circle,
  Brain,
  Mic,
  Users,
  Compass,
  Sparkles,
  ChevronRight,
  Flame,
  Award,
  BookOpen,
  ArrowRight,
  Calendar,
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface HomeTabProps {
  profile: UserProfile;
  onUpdateProfile: (updated: UserProfile) => void;
  onLaunchGame: (gameId: string) => void;
  onOpenSpeak: () => void;
  onOpenMentor: () => void;
}

export const HomeTab: React.FC<HomeTabProps> = ({
  profile,
  onUpdateProfile,
  onLaunchGame,
  onOpenSpeak,
  onOpenMentor,
}) => {
  const [selectedDay, setSelectedDay] = useState<number>(profile.currentDay || 1);
  const mission: DailyMission = CURRICULUM_DAYS[selectedDay] || CURRICULUM_DAYS[1];

  // Warmup state
  const [warmupSelected, setWarmupSelected] = useState<number | null>(null);
  const [warmupSubmitted, setWarmupSubmitted] = useState<boolean>(false);

  // Deep challenge state
  const [showDeepInsight, setShowDeepInsight] = useState<boolean>(false);

  // Social scenario state
  const scenario = SOCIAL_SCENARIOS[mission.socialScenarioId] || SOCIAL_SCENARIOS['scenario_credit_theft'];
  const [socialSelectedChoice, setSocialSelectedChoice] = useState<SocialScenarioChoice | null>(null);

  // Real world mission state
  const [missionDone, setMissionDone] = useState<boolean>(false);

  // Daily reflection text
  const [reflectionText, setReflectionText] = useState<string>('');
  const [reflectionSaved, setReflectionSaved] = useState<boolean>(false);

  const isDayCompleted = !!profile.completedMissions[selectedDay];

  const handleWarmupSubmit = (idx: number) => {
    if (warmupSubmitted) return;
    setWarmupSelected(idx);
    setWarmupSubmitted(true);

    if (idx === mission.warmup.correctIndex) {
      confetti({ particleCount: 30, spread: 50, origin: { y: 0.6 } });
      const updated = awardUserXP(profile, 40, mission.primaryAttribute, 5);
      onUpdateProfile(updated);
    }
  };

  const handleSelectSocialChoice = (choice: SocialScenarioChoice) => {
    setSocialSelectedChoice(choice);
    const updated = awardUserXP(profile, choice.xpAward, 'COMPOSURE', 8);
    onUpdateProfile(updated);
  };

  const handleSaveReflection = () => {
    if (!reflectionText.trim()) return;
    setReflectionSaved(true);
    const updated = awardUserXP(profile, 30, 'WISDOM', 5);
    onUpdateProfile(updated);
  };

  const handleCompleteDay = () => {
    confetti({ particleCount: 100, spread: 80, origin: { y: 0.5 } });
    const updated = awardUserXP(profile, mission.xpReward, mission.primaryAttribute, 10);
    updated.completedMissions[selectedDay] = true;
    if (selectedDay < 30) {
      updated.currentDay = Math.max(updated.currentDay, selectedDay + 1);
    }
    onUpdateProfile(updated);
  };

  const gameInfo = GAMES_CATALOG.find((g) => g.id === mission.gameType);

  return (
    <div className="space-y-6 pb-24">
      {/* Hero Mission Card */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#10172a] via-[#0d1322] to-[#070b14] border border-slate-800 p-5 sm:p-6 shadow-xl">
        <div className="absolute top-0 right-0 w-80 h-80 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10">
          {/* Day selection pill strip */}
          <div className="flex items-center justify-between gap-2 mb-3">
            <div className="flex items-center gap-1.5 overflow-x-auto py-1 scrollbar-none">
              {[1, 2, 3, 4, 5, 6, 7].map((d) => (
                <button
                  key={d}
                  onClick={() => {
                    setSelectedDay(d);
                    setWarmupSelected(null);
                    setWarmupSubmitted(false);
                    setShowDeepInsight(false);
                    setSocialSelectedChoice(null);
                    setMissionDone(false);
                  }}
                  className={`px-3 py-1 rounded-lg text-xs font-mono font-medium transition-all ${
                    selectedDay === d
                      ? 'bg-cyan-500/20 border border-cyan-400 text-cyan-300 font-bold shadow-sm'
                      : profile.completedMissions[d]
                      ? 'bg-emerald-500/15 border border-emerald-500/30 text-emerald-400'
                      : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  Day {d}
                </button>
              ))}
            </div>
            <span className="text-[11px] font-mono text-purple-400 shrink-0 font-semibold">
              {profile.selectedProgram === 'foundation_30' ? '30-Day Foundation' : 'Advanced Program'}
            </span>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs uppercase font-mono tracking-wider text-cyan-400 font-semibold">
                  Day {mission.day} Focus · {mission.primaryAttribute}
                </span>
                {isDayCompleted && (
                  <span className="flex items-center gap-1 text-[10px] text-emerald-400 bg-emerald-500/10 border border-emerald-500/25 px-1.5 py-0.5 rounded font-medium">
                    <CheckCircle2 className="w-3 h-3" /> Completed
                  </span>
                )}
              </div>
              <h1 className="text-lg sm:text-2xl font-extrabold text-white tracking-tight mt-1">
                {mission.title}
              </h1>
              <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
                {mission.theme}
              </p>
            </div>

            <div className="flex sm:flex-col items-center sm:items-end justify-between gap-1 bg-slate-900/60 border border-slate-800 p-2.5 rounded-xl">
              <span className="text-xs text-slate-400">Mission Reward</span>
              <span className="text-sm font-mono font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400">
                +{mission.xpReward} XP
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Daily Training System: 7 Core Modules */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-slate-200 uppercase tracking-wider font-mono">
            Today's Training System
          </h2>
          <span className="text-xs text-slate-400">~{mission.estimatedMinutes} minutes total</span>
        </div>

        {/* 1. MENTAL WARM-UP */}
        <div className="bg-[#0b101d] border border-slate-800/90 rounded-xl p-4 transition-all">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-md bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 text-xs font-bold font-mono">
                1
              </div>
              <h3 className="text-xs sm:text-sm font-bold text-white">Mental Warm-Up</h3>
            </div>
            <span className="text-[10px] text-amber-400 font-mono">+40 XP</span>
          </div>

          <p className="text-xs text-slate-300 mb-3">{mission.warmup.question}</p>

          <div className="space-y-1.5">
            {mission.warmup.options.map((opt, idx) => {
              const isSelected = warmupSelected === idx;
              const isCorrect = idx === mission.warmup.correctIndex;

              let btnStyle = 'bg-slate-900/60 border-slate-800 text-slate-300 hover:border-slate-700';
              if (warmupSubmitted) {
                if (isCorrect) btnStyle = 'bg-emerald-500/20 border-emerald-500 text-emerald-200 font-medium';
                else if (isSelected) btnStyle = 'bg-rose-500/20 border-rose-500 text-rose-200';
                else btnStyle = 'opacity-40 border-slate-800 text-slate-500';
              }

              return (
                <button
                  key={idx}
                  disabled={warmupSubmitted}
                  onClick={() => handleWarmupSubmit(idx)}
                  className={`w-full text-left p-2.5 rounded-lg border text-xs transition-colors flex items-center justify-between ${btnStyle}`}
                >
                  <span>{opt}</span>
                  {warmupSubmitted && isCorrect && <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />}
                </button>
              );
            })}
          </div>

          {warmupSubmitted && (
            <div className="mt-3 p-3 bg-slate-900/90 border border-slate-800 rounded-lg text-xs text-slate-300">
              <span className="font-semibold text-cyan-300">Cognitive Principle: </span>
              {mission.warmup.explanation}
            </div>
          )}
        </div>

        {/* 2. DEEP THINKING CHALLENGE */}
        <div className="bg-[#0b101d] border border-slate-800/90 rounded-xl p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-md bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 text-xs font-bold font-mono">
                2
              </div>
              <h3 className="text-xs sm:text-sm font-bold text-white">
                Deep Thinking Challenge: {mission.deepChallenge.title}
              </h3>
            </div>
            <span className="text-[10px] text-purple-400 font-mono">Rigor</span>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed mb-2">
            {mission.deepChallenge.scenario}
          </p>

          <div className="p-2.5 bg-slate-900/70 border border-slate-800 rounded-lg text-xs text-purple-200 font-medium">
            <span className="text-slate-400">Thought Prompt: </span>
            {mission.deepChallenge.thoughtPrompt}
          </div>

          <button
            onClick={() => setShowDeepInsight(!showDeepInsight)}
            className="mt-3 text-xs text-cyan-400 hover:text-cyan-300 font-medium flex items-center gap-1 cursor-pointer"
          >
            <span>{showDeepInsight ? 'Hide Analytical Insight' : 'Reveal Analytical Insight'}</span>
            <ChevronRight className={`w-3.5 h-3.5 transition-transform ${showDeepInsight ? 'rotate-90' : ''}`} />
          </button>

          {showDeepInsight && (
            <div className="mt-2 p-3 bg-cyan-950/20 border border-cyan-500/30 rounded-lg text-xs text-cyan-200 leading-relaxed">
              <span className="font-bold text-white">Mental Model: </span>
              {mission.deepChallenge.keyInsight}
            </div>
          )}
        </div>

        {/* 3. BRAIN GAME CHALLENGE */}
        <div className="bg-[#0b101d] border border-slate-800/90 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 rounded-md bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 text-xs font-bold font-mono shrink-0 mt-0.5">
              3
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xs sm:text-sm font-bold text-white">
                  Logic & Cognitive Game: {gameInfo?.title || 'Deductive Syllogism'}
                </h3>
                <span className="text-[10px] font-mono text-cyan-400 bg-cyan-500/10 px-1.5 py-0.2 rounded border border-cyan-500/20">
                  {gameInfo?.difficulty || 'Foundation'}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                {gameInfo?.description || 'Interactive deterministic problem solving with step-by-step validation.'}
              </p>
            </div>
          </div>

          <button
            onClick={() => onLaunchGame(mission.gameType)}
            className="px-4 py-2 bg-gradient-to-r from-purple-600 to-cyan-500 hover:from-purple-500 hover:to-cyan-400 text-white font-bold text-xs rounded-xl shadow-md flex items-center justify-center gap-1.5 shrink-0 transition-all cursor-pointer"
          >
            <Brain className="w-3.5 h-3.5" />
            <span>Launch Game</span>
          </button>
        </div>

        {/* 4. COMMUNICATION STUDIO PRACTICE */}
        <div className="bg-[#0b101d] border border-slate-800/90 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 rounded-md bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 text-xs font-bold font-mono shrink-0 mt-0.5">
              4
            </div>
            <div>
              <h3 className="text-xs sm:text-sm font-bold text-white">
                Spoken Articulation Practice: Complex Concept Simplification
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Record live audio in the Communication Studio. Analyze WPM, verbal filler words, and vocal clarity.
              </p>
            </div>
          </div>

          <button
            onClick={onOpenSpeak}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-md flex items-center justify-center gap-1.5 shrink-0 transition-all cursor-pointer"
          >
            <Mic className="w-3.5 h-3.5" />
            <span>Open Speak Studio</span>
          </button>
        </div>

        {/* 5. SOCIAL INTELLIGENCE SCENARIO */}
        <div className="bg-[#0b101d] border border-slate-800/90 rounded-xl p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-md bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 text-xs font-bold font-mono">
                5
              </div>
              <h3 className="text-xs sm:text-sm font-bold text-white">
                Social Intelligence: {scenario.title}
              </h3>
            </div>
            <span className="text-[10px] text-indigo-400 font-mono">Composure</span>
          </div>

          <p className="text-xs text-slate-300 mb-2">{scenario.context}</p>
          <div className="p-2.5 bg-slate-900 border border-slate-800 rounded-lg text-xs text-amber-200 mb-3">
            <span className="text-slate-400">Dilemma: </span>
            {scenario.dilemma}
          </div>

          <div className="space-y-2">
            {scenario.choices.map((c, idx) => (
              <button
                key={idx}
                onClick={() => handleSelectSocialChoice(c)}
                className={`w-full text-left p-3 rounded-lg border text-xs transition-all ${
                  socialSelectedChoice?.text === c.text
                    ? 'bg-indigo-600/25 border-indigo-500 text-white font-medium'
                    : 'bg-slate-900/60 border-slate-800 text-slate-300 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-semibold text-indigo-300">Option {idx + 1} ({c.style})</span>
                  <span className="text-[10px] text-slate-400 font-mono">+{c.xpAward} XP</span>
                </div>
                <p className="text-slate-200">{c.text}</p>
              </button>
            ))}
          </div>

          {socialSelectedChoice && (
            <div className="mt-3 p-3 bg-slate-900 border border-indigo-500/30 rounded-lg text-xs text-slate-300 space-y-1.5">
              <div className="font-bold text-indigo-300">Consequence & Analysis:</div>
              <p>{socialSelectedChoice.consequence}</p>
              <div className="text-[11px] text-slate-400 italic">
                Socratic Lesson: {scenario.socraticLesson}
              </div>
            </div>
          )}
        </div>

        {/* 6. REAL-WORLD MISSION */}
        <div className="bg-[#0b101d] border border-slate-800/90 rounded-xl p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-md bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400 text-xs font-bold font-mono">
                6
              </div>
              <h3 className="text-xs sm:text-sm font-bold text-white">
                Real-World Mission: {mission.realWorldMission.title}
              </h3>
            </div>
            <span className="text-[10px] text-rose-400 font-mono">Action</span>
          </div>

          <p className="text-xs text-slate-300 mb-2 leading-relaxed">
            {mission.realWorldMission.task}
          </p>
          <div className="p-2.5 bg-slate-900 border border-slate-800 rounded-lg text-xs text-slate-400 mb-3">
            <span className="font-semibold text-slate-200">Execution Tip: </span>
            {mission.realWorldMission.actionableTip}
          </div>

          <label className="flex items-center gap-2.5 cursor-pointer text-xs text-slate-300">
            <input
              type="checkbox"
              checked={missionDone}
              onChange={(e) => setMissionDone(e.target.checked)}
              className="w-4 h-4 rounded text-cyan-500 focus:ring-0 bg-slate-900 border-slate-700"
            />
            <span>I have completed or committed to this real-world mission today.</span>
          </label>
        </div>

        {/* 7. DAILY REFLECTION JOURNAL */}
        <div className="bg-[#0b101d] border border-slate-800/90 rounded-xl p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-md bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-400 text-xs font-bold font-mono">
                7
              </div>
              <h3 className="text-xs sm:text-sm font-bold text-white">Daily Reflection</h3>
            </div>
            <span className="text-[10px] text-teal-400 font-mono">+30 XP</span>
          </div>

          <p className="text-xs text-slate-300 mb-2 font-medium">
            {mission.reflectionQuestion}
          </p>

          <textarea
            value={reflectionText}
            onChange={(e) => setReflectionText(e.target.value)}
            placeholder="Record your honest reflection here..."
            className="w-full h-20 bg-slate-900 border border-slate-800 rounded-lg p-2.5 text-xs text-slate-200 focus:outline-none focus:border-teal-400 resize-none"
          />

          <div className="flex justify-end mt-2">
            <button
              onClick={handleSaveReflection}
              disabled={reflectionSaved || !reflectionText.trim()}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                reflectionSaved
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                  : 'bg-teal-600 hover:bg-teal-500 text-white'
              }`}
            >
              {reflectionSaved ? 'Reflection Logged' : 'Save Reflection'}
            </button>
          </div>
        </div>

        {/* DAY COMPLETION ACTION */}
        <div className="pt-2">
          <button
            onClick={handleCompleteDay}
            className="w-full py-3 bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-500 hover:from-purple-500 hover:to-cyan-400 text-white font-bold text-xs sm:text-sm rounded-xl shadow-xl flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            <CheckCircle2 className="w-4 h-4 text-cyan-300" />
            <span>Complete Day {mission.day} & Claim {mission.xpReward} XP</span>
          </button>
        </div>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { UserProfile, AuraAttribute, ProgramType, BossBattle } from '../types';
import { calculateLevelProgress, awardUserXP } from '../utils/engine';
import { BOSS_BATTLES } from '../data/bossBattlesData';
import {
  User,
  Shield,
  Award,
  Zap,
  Target,
  Swords,
  CheckCircle2,
  Lock,
  ChevronRight,
  Sparkles,
  Flame,
  RotateCcw,
} from 'lucide-react';
import confetti from 'canvas-confetti';

import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';

interface ProfileTabProps {
  profile: UserProfile;
  onUpdateProfile: (updated: UserProfile) => void;
  isMobileFrame?: boolean;
}

export const ProfileTab: React.FC<ProfileTabProps> = ({ profile, onUpdateProfile, isMobileFrame }) => {
  const { currentLevel, title, progressPercent, xpToNext, nextLevelXP, currentLevelBaseXP } =
    calculateLevelProgress(profile.xp);

  const [activeBossModal, setActiveBossModal] = useState<BossBattle | null>(null);
  const [bossStageIdx, setBossStageIdx] = useState<number>(0);
  const [bossSelectedAnswer, setBossSelectedAnswer] = useState<number | null>(null);
  const [bossStageDone, setBossStageDone] = useState<boolean>(false);

  const attributesList: AuraAttribute[] = [
    'LOGIC',
    'WISDOM',
    'FOCUS',
    'EXPRESSION',
    'EMPATHY',
    'COMPOSURE',
    'STRATEGY',
    'CREATIVITY',
  ];

  const radarData = attributesList.map((attr) => ({
    attribute: attr,
    score: profile.attributes[attr] || 30,
    fullMark: 100,
  }));

  // Skill Tree nodes
  const skillNodes = [
    { id: 'skill_syllogism', name: 'Syllogistic Shield', reqLevel: 1, attr: 'LOGIC', desc: 'Identify invalid premises instantly.' },
    { id: 'skill_pyramid', name: 'Pyramid Thesis', reqLevel: 3, attr: 'EXPRESSION', desc: 'Structure speech with top-down clarity.' },
    { id: 'skill_stoic', name: 'Stoic Citadel', reqLevel: 5, attr: 'COMPOSURE', desc: 'Anchor on what is strictly controllable.' },
    { id: 'skill_bayesian', name: 'Bayesian Updating', reqLevel: 8, attr: 'STRATEGY', desc: 'Adjust beliefs proportionately to evidence.' },
    { id: 'skill_empathy', name: 'Socratic Mirror', reqLevel: 12, attr: 'EMPATHY', desc: 'Steelman counterparty arguments before answering.' },
    { id: 'skill_lateral', name: 'Divergent Shift', reqLevel: 15, attr: 'CREATIVITY', desc: 'Overcome functional fixedness in problem solving.' },
  ];

  const handleUnlockSkill = (skillId: string) => {
    if (profile.unlockedSkills.includes(skillId)) return;
    confetti({ particleCount: 40, spread: 60 });
    const updated = {
      ...profile,
      unlockedSkills: [...profile.unlockedSkills, skillId],
    };
    onUpdateProfile(updated);
  };

  const handleBossAnswer = (choiceIdx: number) => {
    if (bossStageDone || !activeBossModal) return;
    setBossSelectedAnswer(choiceIdx);
    setBossStageDone(true);
  };

  const handleBossNext = () => {
    if (!activeBossModal) return;
    if (bossStageIdx + 1 < activeBossModal.stages.length) {
      setBossStageIdx((prev) => prev + 1);
      setBossSelectedAnswer(null);
      setBossStageDone(false);
    } else {
      // Completed boss battle
      confetti({ particleCount: 120, spread: 90, origin: { y: 0.5 } });
      const updated = awardUserXP(profile, activeBossModal.rewardXP, 'STRATEGY', 15);
      if (!updated.achievements.includes(activeBossModal.badgeUnlock)) {
        updated.achievements.push(activeBossModal.badgeUnlock);
      }
      onUpdateProfile(updated);
      setActiveBossModal(null);
      setBossStageIdx(0);
      setBossSelectedAnswer(null);
      setBossStageDone(false);
    }
  };

  return (
    <div className="space-y-6 pb-24">
      {/* Header Profile Summary */}
      <div className="bg-gradient-to-br from-[#10172a] via-[#0d1322] to-[#070b14] border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-5">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-purple-600 via-indigo-600 to-cyan-400 p-[2px] shadow-lg shadow-purple-900/30">
            <div className="w-full h-full bg-[#090e1a] rounded-[14px] flex items-center justify-center text-2xl font-bold font-mono text-cyan-300">
              {currentLevel}
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base sm:text-lg font-bold text-white">{profile.name}</h2>
              <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded bg-purple-500/10 border border-purple-500/20 text-purple-300">
                Level {currentLevel}
              </span>
            </div>
            <p className="text-xs text-cyan-400 font-medium mt-0.5">{title}</p>
            <div className="flex items-center gap-3 text-[11px] text-slate-400 mt-1 font-mono">
              <span className="flex items-center gap-1 text-amber-300">
                <Flame className="w-3.5 h-3.5 fill-amber-400" />
                {profile.streak} Days Active
              </span>
              <span>·</span>
              <span>Context: {profile.primaryContext}</span>
            </div>
          </div>
        </div>

        {/* Level XP Bar */}
        <div className="w-full md:w-64 space-y-1.5">
          <div className="flex justify-between text-[11px] font-mono">
            <span className="text-slate-400">Level Progression</span>
            <span className="text-cyan-400 font-semibold">{progressPercent}%</span>
          </div>
          <div className="w-full h-2.5 bg-slate-900 rounded-full overflow-hidden border border-slate-800">
            <div
              className="h-full bg-gradient-to-r from-purple-500 to-cyan-400 rounded-full transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <div className="flex justify-between text-[10px] text-slate-500 font-mono">
            <span>{profile.xp} Total XP</span>
            <span>{xpToNext} XP to Level {currentLevel + 1}</span>
          </div>
        </div>
      </div>

      {/* 8-ATTRIBUTE RADAR CHART & METRICS */}
      <div className={`flex flex-col ${isMobileFrame ? '' : 'xl:grid xl:grid-cols-2'} gap-4`}>
        {/* Recharts Radar Chart */}
        <div className="bg-[#0b101d] border border-slate-800 rounded-xl p-4 sm:p-5 flex flex-col items-center justify-center">
          <div className="w-full flex items-center justify-between mb-1">
            <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider font-mono">
              Aura Octagon Radar
            </h3>
            <span className="text-[10px] text-slate-500 font-mono">Normalized (0-100)</span>
          </div>

          <div className="w-full h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="68%" data={radarData}>
                <PolarGrid stroke="#1e293b" />
                <PolarAngleAxis
                  dataKey="attribute"
                  tick={{ fill: '#94a3b8', fontSize: 10, fontFamily: 'monospace', fontWeight: 600 }}
                />
                <PolarRadiusAxis
                  angle={30}
                  domain={[0, 100]}
                  stroke="#334155"
                  tick={{ fill: '#64748b', fontSize: 9 }}
                />
                <Radar
                  name="Aura Rating"
                  dataKey="score"
                  stroke="#06b6d4"
                  fill="#8b5cf6"
                  fillOpacity={0.4}
                  strokeWidth={2}
                  dot={{ r: 3.5, fill: '#38bdf8' }}
                />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div className="bg-[#090e1a] border border-cyan-500/40 px-3 py-1.5 rounded-lg shadow-xl text-xs font-mono">
                          <span className="text-cyan-400 font-bold">{data.attribute}: </span>
                          <span className="text-white font-extrabold">{data.score}</span>
                          <span className="text-slate-500"> / 100</span>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Attribute Progress Bars */}
        <div className="bg-[#0b101d] border border-slate-800 rounded-xl p-5 space-y-2.5">
          <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider font-mono mb-2">
            Attribute Mastery Ratings
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {attributesList.map((attr) => {
              const val = profile.attributes[attr] || 30;
              return (
                <div key={attr} className="bg-slate-900/70 border border-slate-800/80 p-2 rounded-lg">
                  <div className="flex justify-between text-[11px] font-mono mb-1">
                    <span className="text-slate-300 font-semibold">{attr}</span>
                    <span className="text-cyan-400 font-bold">{val}</span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-950 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-purple-500 to-cyan-400 rounded-full"
                      style={{ width: `${val}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* WEEKLY BOSS BATTLES */}
      <div className="bg-[#0b101d] border border-slate-800 rounded-xl p-5 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Swords className="w-4 h-4 text-rose-400" />
            <h3 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
              Weekly Boss Trials (7-Day Multi-Stage Crucible)
            </h3>
          </div>
          <span className="text-[10px] text-slate-500 font-mono">Comprehensive Synthesis</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {BOSS_BATTLES.map((boss) => {
            const isCompleted = profile.achievements.includes(boss.badgeUnlock);
            return (
              <div
                key={boss.id}
                className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between text-[10px] font-mono mb-1.5">
                    <span className="text-rose-400 uppercase">Week {boss.week} Boss</span>
                    <span className="text-emerald-400 font-bold">+{boss.rewardXP} XP</span>
                  </div>
                  <h4 className="text-xs sm:text-sm font-bold text-white">{boss.title}</h4>
                  <p className="text-[11px] text-slate-400 mt-1">{boss.scenarioDescription}</p>
                </div>

                <div className="mt-3 pt-3 border-t border-slate-800 flex items-center justify-between">
                  <span className="text-[10px] font-mono text-purple-300">
                    Reward: {boss.badgeUnlock}
                  </span>
                  <button
                    onClick={() => {
                      setActiveBossModal(boss);
                      setBossStageIdx(0);
                      setBossSelectedAnswer(null);
                      setBossStageDone(false);
                    }}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors ${
                      isCompleted
                        ? 'bg-emerald-500/15 border border-emerald-500/30 text-emerald-300'
                        : 'bg-rose-600 hover:bg-rose-500 text-white'
                    }`}
                  >
                    {isCompleted ? (
                      <>
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Replay Trial</span>
                      </>
                    ) : (
                      <>
                        <Swords className="w-3.5 h-3.5" />
                        <span>Enter Boss Battle</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* SKILL TREE */}
      <div className="bg-[#0b101d] border border-slate-800 rounded-xl p-5 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-amber-400" />
            <h3 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
              Aura RPG Skill Tree & Mastery Perks
            </h3>
          </div>
          <span className="text-[10px] text-slate-500 font-mono">Permanent Buffs</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
          {skillNodes.map((skill) => {
            const isUnlocked = profile.unlockedSkills.includes(skill.id);
            const canUnlock = currentLevel >= skill.reqLevel;

            return (
              <div
                key={skill.id}
                className={`p-3 rounded-xl border transition-all ${
                  isUnlocked
                    ? 'bg-amber-500/10 border-amber-500/30 text-amber-200'
                    : canUnlock
                    ? 'bg-slate-900/90 border-slate-700 text-slate-300'
                    : 'bg-slate-950 border-slate-900 opacity-60 text-slate-500'
                }`}
              >
                <div className="flex items-center justify-between text-[10px] font-mono mb-1">
                  <span className="text-amber-400">{skill.attr}</span>
                  <span>Req: Lvl {skill.reqLevel}</span>
                </div>
                <div className="text-xs font-bold text-white">{skill.name}</div>
                <p className="text-[11px] text-slate-400 mt-0.5 leading-snug">{skill.desc}</p>

                <div className="mt-2 pt-2 border-t border-slate-800/80 flex justify-end">
                  {isUnlocked ? (
                    <span className="text-[10px] font-mono text-emerald-400 flex items-center gap-1 font-semibold">
                      <CheckCircle2 className="w-3 h-3" /> Unlocked
                    </span>
                  ) : (
                    <button
                      disabled={!canUnlock}
                      onClick={() => handleUnlockSkill(skill.id)}
                      className={`px-2.5 py-1 rounded text-[10px] font-bold transition-colors ${
                        canUnlock
                          ? 'bg-amber-500 hover:bg-amber-400 text-black cursor-pointer'
                          : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                      }`}
                    >
                      {canUnlock ? 'Unlock Node' : `Locked (Lvl ${skill.reqLevel})`}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ACTIVE BOSS BATTLE MODAL */}
      {activeBossModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div className="w-full max-w-xl bg-[#090e1a] border border-rose-500/40 rounded-2xl p-5 sm:p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <span className="text-[10px] font-mono text-rose-400 uppercase font-bold">
                  Week {activeBossModal.week} Crucible · Stage {bossStageIdx + 1} of {activeBossModal.stages.length}
                </span>
                <h3 className="text-sm sm:text-base font-bold text-white">
                  {activeBossModal.stages[bossStageIdx].title}
                </h3>
              </div>
              <button
                onClick={() => setActiveBossModal(null)}
                className="text-slate-400 hover:text-white text-xs px-2 py-1 rounded bg-slate-800"
              >
                Exit
              </button>
            </div>

            <p className="text-xs sm:text-sm text-slate-200 whitespace-pre-line font-medium leading-relaxed">
              {activeBossModal.stages[bossStageIdx].prompt}
            </p>

            <div className="space-y-2">
              {activeBossModal.stages[bossStageIdx].options?.map((opt, optIdx) => {
                const isSelected = bossSelectedAnswer === optIdx;
                const isCorrect = optIdx === activeBossModal.stages[bossStageIdx].correctIndex;

                let style = 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700';
                if (bossStageDone) {
                  if (isCorrect) style = 'bg-emerald-500/20 border-emerald-500 text-emerald-200 font-semibold';
                  else if (isSelected) style = 'bg-rose-500/20 border-rose-500 text-rose-200';
                  else style = 'opacity-40 border-slate-800 text-slate-500';
                }

                return (
                  <button
                    key={optIdx}
                    disabled={bossStageDone}
                    onClick={() => handleBossAnswer(optIdx)}
                    className={`w-full text-left p-3 rounded-xl border text-xs transition-colors flex items-center justify-between ${style}`}
                  >
                    <span>{opt}</span>
                    {bossStageDone && isCorrect && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
                  </button>
                );
              })}
            </div>

            {bossStageDone && (
              <div className="p-3 bg-slate-900 border border-slate-800 rounded-lg text-xs text-slate-300">
                <span className="font-semibold text-cyan-300">Analysis: </span>
                {activeBossModal.stages[bossStageIdx].explanation}
              </div>
            )}

            {bossStageDone && (
              <div className="flex justify-end pt-2">
                <button
                  onClick={handleBossNext}
                  className="px-5 py-2 bg-gradient-to-r from-rose-600 to-purple-600 hover:from-rose-500 hover:to-purple-500 text-white text-xs font-bold rounded-xl"
                >
                  {bossStageIdx + 1 < activeBossModal.stages.length ? 'Next Stage' : 'Complete Boss Trial'}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

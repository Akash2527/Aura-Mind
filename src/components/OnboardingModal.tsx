import React, { useState } from 'react';
import { UserProfile, ProgramType } from '../types';
import { Sparkles, ArrowRight, CheckCircle2, Target, Clock, Compass, ShieldCheck } from 'lucide-react';
import confetti from 'canvas-confetti';

interface OnboardingModalProps {
  isOpen: boolean;
  onComplete: (profileUpdates: Partial<UserProfile>) => void;
}

export const OnboardingModal: React.FC<OnboardingModalProps> = ({ isOpen, onComplete }) => {
  const [step, setStep] = useState<number>(1);
  const [goal, setGoal] = useState<string>('Critical Thinking & Logical Reasoning');
  const [dailyMinutes, setDailyMinutes] = useState<number>(30);
  const [difficulty, setDifficulty] = useState<'Beginner' | 'Intermediate' | 'Mastery'>('Intermediate');
  const [primaryContext, setPrimaryContext] = useState<'Interviews' | 'Leadership' | 'Business' | 'Education' | 'Everyday Life'>('Leadership');
  const [program, setProgram] = useState<ProgramType>('foundation_30');

  // Baseline diagnostic responses
  const [answers, setAnswers] = useState<Record<number, number>>({});

  if (!isOpen) return null;

  const baselineQuestions = [
    {
      domain: 'Reasoning (Logic)',
      question: 'Premise 1: No mammals are reptiles.\nPremise 2: All alligators are reptiles.\nConclusion: Therefore, no alligators are mammals.',
      options: ['Logically Valid (Conclusion must be true)', 'Logically Invalid (Conclusion could be false)'],
      correct: 0,
    },
    {
      domain: 'Communication (Structure)',
      question: 'When briefing executive decision-makers on an urgent project delay, what should you lead with?',
      options: [
        'The core conclusion and immediate recommendation in the first sentence',
        'A comprehensive chronological breakdown of the past 3 weeks of vendor emails',
        'A disclaimer asking not to be held responsible',
      ],
      correct: 0,
    },
    {
      domain: 'Attention (Inhibition)',
      question: 'A word says "GREEN" but is painted in PURPLE ink. To suppress cognitive interference, what should your focus anchor on?',
      options: [
        'The physical color of the ink (Purple)',
        'The semantic meaning of the letters (Green)',
        'Alternate between both rapidly',
      ],
      correct: 0,
    },
    {
      domain: 'Social Intelligence (Assertiveness)',
      question: 'A colleague interrupts you repeatedly in a cross-functional strategy sync. What is the most composed, high-presence response?',
      options: [
        'Hold up a calm hand with steady eye contact: "Hold on, please let me finish the thought, then I want to hear your input."',
        'Interrupt them louder to assert dominance and raise your voice',
        'Look away and stop speaking for the rest of the meeting',
      ],
      correct: 0,
    },
  ];

  const handleFinish = () => {
    let logicScore = 30;
    let expressionScore = 30;
    let focusScore = 30;
    let composureScore = 30;

    if (answers[0] === baselineQuestions[0].correct) logicScore += 20;
    if (answers[1] === baselineQuestions[1].correct) expressionScore += 20;
    if (answers[2] === baselineQuestions[2].correct) focusScore += 20;
    if (answers[3] === baselineQuestions[3].correct) composureScore += 20;

    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
    });

    onComplete({
      goal,
      dailyMinutes,
      difficulty,
      primaryContext,
      selectedProgram: program,
      onboardingCompleted: true,
      xp: 150,
      attributes: {
        LOGIC: logicScore,
        WISDOM: 35,
        FOCUS: focusScore,
        EXPRESSION: expressionScore,
        EMPATHY: 35,
        COMPOSURE: composureScore,
        STRATEGY: 30,
        CREATIVITY: 30,
      },
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
      <div className="w-full max-w-xl bg-[#090e1a] border border-slate-700/80 rounded-2xl p-5 sm:p-7 shadow-2xl overflow-y-auto max-h-[92vh]">
        {/* Step Indicator */}
        <div className="flex items-center justify-between mb-5 border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-cyan-400" />
            <h2 className="text-base sm:text-lg font-bold text-white tracking-tight">
              Aura Mind Calibration
            </h2>
          </div>
          <span className="text-xs font-mono text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded border border-purple-500/20">
            Step {step} of 3
          </span>
        </div>

        {/* STEP 1: GOALS & CONTEXT */}
        {step === 1 && (
          <div className="space-y-4">
            <div>
              <label className="text-xs uppercase tracking-wider font-semibold text-slate-400 block mb-1.5">
                What is your primary training goal?
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {[
                  'Critical Thinking & Logical Reasoning',
                  'High-Impact Speaking & Presence',
                  'Strategic Decision-Making',
                  'Emotional Composure Under Fire',
                ].map((g) => (
                  <button
                    key={g}
                    onClick={() => setGoal(g)}
                    className={`text-left p-2.5 rounded-xl text-xs font-medium border transition-all ${
                      goal === g
                        ? 'bg-purple-600/20 border-purple-500 text-white shadow-sm'
                        : 'bg-slate-900/60 border-slate-800 text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    {g}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs uppercase tracking-wider font-semibold text-slate-400 block mb-1.5">
                  Daily Training Time
                </label>
                <div className="flex gap-1.5">
                  {[15, 30, 45, 60].map((mins) => (
                    <button
                      key={mins}
                      onClick={() => setDailyMinutes(mins)}
                      className={`flex-1 py-2 text-center text-xs font-semibold rounded-lg border transition-all ${
                        dailyMinutes === mins
                          ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300'
                          : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
                      }`}
                    >
                      {mins}m
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs uppercase tracking-wider font-semibold text-slate-400 block mb-1.5">
                  Primary Context
                </label>
                <select
                  value={primaryContext}
                  onChange={(e) => setPrimaryContext(e.target.value as any)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-xs text-white focus:outline-none focus:border-cyan-400"
                >
                  <option value="Leadership">Executive & Leadership</option>
                  <option value="Interviews">High-Stakes Interviews</option>
                  <option value="Business">Entrepreneurship & Business</option>
                  <option value="Education">Academic & Intellectual</option>
                  <option value="Everyday Life">Everyday Composure & Presence</option>
                </select>
              </div>
            </div>

            <div>
              <label className="text-xs uppercase tracking-wider font-semibold text-slate-400 block mb-1.5">
                Transformation Program
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {[
                  { id: 'foundation_30' as ProgramType, title: '30-Day Foundation', desc: 'Core logic, biases & structured voice' },
                  { id: 'advanced_60' as ProgramType, title: '60-Day Advanced', desc: 'Systems thinking, negotiation & public debate' },
                  { id: 'mastery_90' as ProgramType, title: '90-Day Mastery', desc: 'Complex diplomacy, uncertainty & capstone' },
                ].map((p) => (
                  <button
                    key={p.id}
                    onClick={() => setProgram(p.id)}
                    className={`text-left p-3 rounded-xl border transition-all ${
                      program === p.id
                        ? 'bg-indigo-600/20 border-indigo-500 text-white shadow-md'
                        : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <div className="text-xs font-bold text-slate-200">{p.title}</div>
                    <div className="text-[10px] text-slate-400 mt-0.5">{p.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={() => setStep(2)}
              className="w-full py-2.5 mt-2 bg-gradient-to-r from-purple-600 to-cyan-500 hover:from-purple-500 hover:to-cyan-400 text-white font-semibold text-xs rounded-xl shadow-lg flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <span>Proceed to Baseline Diagnostic</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* STEP 2: BASELINE DIAGNOSTIC */}
        {step === 2 && (
          <div className="space-y-4">
            <p className="text-xs text-slate-400">
              Answer these 4 quick baseline challenges to calibrate your starting Aura Mind attribute ratings.
            </p>

            <div className="space-y-3.5 max-h-[50vh] overflow-y-auto pr-1">
              {baselineQuestions.map((q, idx) => (
                <div key={idx} className="bg-slate-900/80 border border-slate-800 rounded-xl p-3">
                  <span className="text-[10px] font-mono font-semibold uppercase text-cyan-400">
                    {q.domain}
                  </span>
                  <p className="text-xs text-slate-200 font-medium mt-1 whitespace-pre-line">
                    {q.question}
                  </p>
                  <div className="mt-2 space-y-1.5">
                    {q.options.map((opt, optIdx) => (
                      <button
                        key={optIdx}
                        onClick={() => setAnswers({ ...answers, [idx]: optIdx })}
                        className={`w-full text-left p-2 rounded-lg text-xs transition-colors border ${
                          answers[idx] === optIdx
                            ? 'bg-cyan-500/20 border-cyan-400 text-cyan-200 font-semibold'
                            : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-700'
                        }`}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="flex gap-2 pt-2">
              <button
                onClick={() => setStep(1)}
                className="px-4 py-2 bg-slate-800 text-slate-300 text-xs rounded-xl font-medium hover:bg-slate-700"
              >
                Back
              </button>
              <button
                onClick={() => setStep(3)}
                className="flex-1 py-2 bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold rounded-xl flex items-center justify-center gap-2"
              >
                <span>Calculate Starting Profile</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: CONFIRMATION & ROADMAP */}
        {step === 3 && (
          <div className="space-y-4 text-center py-2">
            <div className="w-14 h-14 bg-emerald-500/20 border border-emerald-500/40 rounded-full flex items-center justify-center mx-auto text-emerald-300">
              <ShieldCheck className="w-7 h-7" />
            </div>

            <div>
              <h3 className="text-base font-bold text-white">Baseline Calibrated</h3>
              <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
                Starting Level: <span className="text-cyan-400 font-semibold">Level 1 — The Beginner</span>.
                Your customized {program === 'foundation_30' ? '30-Day Foundation' : program === 'advanced_60' ? '60-Day Advanced' : '90-Day Mastery'} curriculum is ready.
              </p>
            </div>

            <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-3 text-left space-y-2">
              <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                Personalized Learning Path
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-300">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Primary Skill Focus: {goal}</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-300">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Paced for {dailyMinutes} mins/day ({difficulty} intensity)</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-300">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>12 Interactive Logic & Strategy Game types unlocked</span>
              </div>
            </div>

            <p className="text-[10px] text-slate-500 italic max-w-md mx-auto">
              Scientific Notice: In-app performance metrics represent task-specific practice rather than general clinical IQ measurements. Aura Mind fosters disciplined thinking and composed presence.
            </p>

            <button
              onClick={handleFinish}
              className="w-full py-2.5 bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-500 hover:from-purple-500 hover:to-cyan-400 text-white font-bold text-xs rounded-xl shadow-lg transition-all cursor-pointer"
            >
              Enter Aura Mind & Begin Day 1
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

import React, { useState, useEffect } from 'react';
import { GameDefinition, GameProblemInstance, UserProfile } from '../types';
import { GAME_PROBLEMS } from '../data/gamesData';
import { awardUserXP } from '../utils/engine';
import { CheckCircle2, XCircle, Lightbulb, Clock, ArrowRight, RotateCcw, Award, Sparkles, X } from 'lucide-react';
import confetti from 'canvas-confetti';

interface GameRunnerProps {
  game: GameDefinition;
  profile: UserProfile;
  onUpdateProfile: (updated: UserProfile) => void;
  onClose: () => void;
  soundEnabled: boolean;
}

export const GameRunner: React.FC<GameRunnerProps> = ({
  game,
  profile,
  onUpdateProfile,
  onClose,
  soundEnabled,
}) => {
  const problems = GAME_PROBLEMS[game.id] || [];
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState<boolean>(false);
  const [isCorrect, setIsCorrect] = useState<boolean>(false);
  const [showHint, setShowHint] = useState<boolean>(false);
  const [timeLeft, setTimeLeft] = useState<number>(game.estimatedSeconds);
  const [isFinished, setIsFinished] = useState<boolean>(false);
  const [scoreCount, setScoreCount] = useState<number>(0);

  const currentProblem: GameProblemInstance | undefined = problems[currentIndex];

  useEffect(() => {
    if (isAnswered || isFinished || timeLeft <= 0) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [isAnswered, isFinished, timeLeft]);

  const handleSelectOption = (idx: number) => {
    if (isAnswered || !currentProblem) return;
    setSelectedOption(idx);
    setIsAnswered(true);

    const correct = idx === Number(currentProblem.correctAnswer);
    setIsCorrect(correct);

    if (correct) {
      setScoreCount((s) => s + 1);
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.7 },
      });
      // Award XP
      const updated = awardUserXP(profile, game.xpReward, game.attribute, 6);
      onUpdateProfile(updated);
    }
  };

  const handleNextProblem = () => {
    if (currentIndex + 1 < problems.length) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedOption(null);
      setIsAnswered(false);
      setIsCorrect(false);
      setShowHint(false);
      setTimeLeft(game.estimatedSeconds);
    } else {
      setIsFinished(true);
    }
  };

  const handleRestart = () => {
    setCurrentIndex(0);
    setSelectedOption(null);
    setIsAnswered(false);
    setIsCorrect(false);
    setShowHint(false);
    setTimeLeft(game.estimatedSeconds);
    setIsFinished(false);
    setScoreCount(0);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-md">
      <div className="w-full max-w-2xl bg-[#090e1a] border border-slate-700/80 rounded-2xl p-5 sm:p-7 shadow-2xl overflow-y-auto max-h-[92vh]">
        {/* Header Bar */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-500/10 text-purple-300 border border-purple-500/20 font-bold uppercase">
              {game.category}
            </span>
            <h2 className="text-sm sm:text-base font-bold text-white tracking-tight">
              {game.title}
            </h2>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1 text-xs font-mono text-cyan-400 bg-slate-900 px-2 py-1 rounded-lg border border-slate-800">
              <Clock className="w-3.5 h-3.5" />
              <span>{timeLeft}s</span>
            </div>
            <button
              onClick={onClose}
              aria-label="Close Game"
              className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Instructions banner */}
        <div className="mt-3 p-2.5 bg-slate-900/60 border border-slate-800/80 rounded-xl text-xs text-slate-300">
          <span className="font-semibold text-slate-200">Objective: </span>
          {game.instructions}
        </div>

        {/* FINISHED SUMMARY */}
        {isFinished ? (
          <div className="py-8 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-purple-500 to-cyan-400 p-[2px] mx-auto">
              <div className="w-full h-full bg-[#090e1a] rounded-full flex items-center justify-center">
                <Award className="w-8 h-8 text-cyan-300" />
              </div>
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Challenge Completed!</h3>
              <p className="text-xs text-slate-400 mt-1">
                You solved {scoreCount} of {problems.length} puzzles accurately.
              </p>
            </div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-purple-500/15 border border-purple-500/30 text-purple-300 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              <span>+{scoreCount * game.xpReward} XP awarded to {game.attribute}</span>
            </div>
            <div className="flex gap-2 justify-center pt-3">
              <button
                onClick={handleRestart}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl flex items-center gap-1.5"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Replay Puzzles</span>
              </button>
              <button
                onClick={onClose}
                className="px-5 py-2 bg-gradient-to-r from-purple-600 to-cyan-500 hover:from-purple-500 hover:to-cyan-400 text-white text-xs font-bold rounded-xl"
              >
                Return to Training Hub
              </button>
            </div>
          </div>
        ) : currentProblem ? (
          /* ACTIVE PROBLEM */
          <div className="mt-4 space-y-4">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>Problem {currentIndex + 1} of {problems.length}</span>
              <button
                onClick={() => setShowHint(!showHint)}
                className="flex items-center gap-1 text-amber-400 hover:text-amber-300 font-medium cursor-pointer"
              >
                <Lightbulb className="w-3.5 h-3.5" />
                <span>{showHint ? 'Hide Hint' : 'Need a Hint?'}</span>
              </button>
            </div>

            {/* Hint Box */}
            {showHint && (
              <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl text-xs text-amber-200">
                <span className="font-semibold">Hint: </span>
                {currentProblem.hint}
              </div>
            )}

            {/* Prompt Card */}
            <div className="p-4 bg-slate-900/90 border border-slate-800 rounded-xl">
              <p className="text-sm text-slate-100 font-medium leading-relaxed whitespace-pre-line font-mono">
                {currentProblem.prompt}
              </p>
            </div>

            {/* Options */}
            <div className="space-y-2">
              {currentProblem.options?.map((option, idx) => {
                const isSelected = selectedOption === idx;
                const isCorrectOption = idx === Number(currentProblem.correctAnswer);

                let btnStyle = 'bg-slate-900/70 border-slate-800 text-slate-200 hover:border-slate-700';

                if (isAnswered) {
                  if (isCorrectOption) {
                    btnStyle = 'bg-emerald-500/20 border-emerald-500 text-emerald-200 font-semibold';
                  } else if (isSelected) {
                    btnStyle = 'bg-rose-500/20 border-rose-500 text-rose-200';
                  } else {
                    btnStyle = 'opacity-50 border-slate-800 text-slate-500';
                  }
                }

                return (
                  <button
                    key={idx}
                    disabled={isAnswered}
                    onClick={() => handleSelectOption(idx)}
                    className={`w-full text-left p-3 rounded-xl border text-xs sm:text-sm transition-all flex items-center justify-between ${btnStyle}`}
                  >
                    <span>{option}</span>
                    {isAnswered && isCorrectOption && (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    )}
                    {isAnswered && isSelected && !isCorrectOption && (
                      <XCircle className="w-4 h-4 text-rose-400 shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Solution & Explanation Box */}
            {isAnswered && (
              <div
                className={`p-4 rounded-xl border space-y-2 ${
                  isCorrect
                    ? 'bg-emerald-950/30 border-emerald-500/40'
                    : 'bg-rose-950/30 border-rose-500/40'
                }`}
              >
                <div className="flex items-center gap-1.5 text-xs font-bold">
                  {isCorrect ? (
                    <>
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      <span className="text-emerald-300">Correct Deduction! (+{game.xpReward} XP)</span>
                    </>
                  ) : (
                    <>
                      <XCircle className="w-4 h-4 text-rose-400" />
                      <span className="text-rose-300">Incorrect Choice</span>
                    </>
                  )}
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  <span className="font-semibold text-white">Solution Breakdown: </span>
                  {currentProblem.solutionExplanation}
                </p>

                <div className="pt-2 flex justify-end">
                  <button
                    onClick={handleNextProblem}
                    className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold rounded-xl flex items-center gap-1.5"
                  >
                    <span>Next Problem</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="py-8 text-center text-xs text-slate-400">
            No problems available for this game.
          </div>
        )}
      </div>
    </div>
  );
};

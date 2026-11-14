import React, { useState } from 'react';
import { LibraryTopic, UserProfile } from '../types';
import { LIBRARY_TOPICS } from '../data/libraryData';
import { awardUserXP } from '../utils/engine';
import { BookOpen, Search, CheckCircle2, XCircle, Award, Sparkles, ChevronRight, Bookmark } from 'lucide-react';
import confetti from 'canvas-confetti';

interface LibraryTabProps {
  profile: UserProfile;
  onUpdateProfile: (updated: UserProfile) => void;
}

export const LibraryTab: React.FC<LibraryTabProps> = ({ profile, onUpdateProfile }) => {
  const [selectedTopic, setSelectedTopic] = useState<LibraryTopic>(LIBRARY_TOPICS[0]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [quizAnswer, setQuizAnswer] = useState<number | null>(null);
  const [quizSubmitted, setQuizSubmitted] = useState<boolean>(false);

  const filteredTopics = LIBRARY_TOPICS.filter((t) => {
    return (
      t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.summary.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  const handleQuizSubmit = (idx: number) => {
    if (quizSubmitted) return;
    setQuizAnswer(idx);
    setQuizSubmitted(true);

    if (idx === selectedTopic.quiz.correctIndex) {
      confetti({ particleCount: 40, spread: 50, origin: { y: 0.6 } });
      const updated = awardUserXP(profile, 50, 'WISDOM', 5);
      onUpdateProfile(updated);
    }
  };

  return (
    <div className="space-y-5 pb-24">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-indigo-400" />
          <h1 className="text-lg sm:text-xl font-bold text-white tracking-tight">
            Knowledge & Mental Models Library
          </h1>
        </div>
        <p className="text-xs text-slate-400 mt-0.5">
          Curated masteries in formal logic, cognitive psychology, systems thinking, and rhetoric with academic citations.
        </p>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search mental models, Kahneman, first principles, Stoicism..."
          className="w-full bg-[#0b101d] border border-slate-800 rounded-xl py-2 pl-9 pr-3 text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-indigo-500"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Topic List */}
        <div className="lg:col-span-1 space-y-2 max-h-[550px] overflow-y-auto pr-1">
          {filteredTopics.map((topic) => {
            const isSelected = selectedTopic.id === topic.id;
            return (
              <button
                key={topic.id}
                onClick={() => {
                  setSelectedTopic(topic);
                  setQuizAnswer(null);
                  setQuizSubmitted(false);
                }}
                className={`w-full text-left p-3 rounded-xl border transition-all ${
                  isSelected
                    ? 'bg-indigo-600/20 border-indigo-500 text-white shadow-sm'
                    : 'bg-[#0b101d] border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between text-[10px] font-mono mb-1">
                  <span className="text-indigo-400 uppercase">{topic.category}</span>
                  <span className="text-slate-500">{topic.readTime}</span>
                </div>
                <h4 className="text-xs font-bold text-slate-200 leading-snug">{topic.title}</h4>
                <p className="text-[11px] text-slate-400 mt-0.5 line-clamp-2">{topic.summary}</p>
              </button>
            );
          })}
        </div>

        {/* Selected Topic Detailed Reader */}
        <div className="lg:col-span-2 bg-[#0b101d] border border-slate-800 rounded-xl p-5 sm:p-6 space-y-4">
          <div className="border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2 text-xs font-mono text-indigo-400 mb-1">
              <span>{selectedTopic.category}</span>
              <span>·</span>
              <span>Level: {selectedTopic.level}</span>
              <span>·</span>
              <span>{selectedTopic.readTime}</span>
            </div>
            <h2 className="text-lg font-bold text-white">{selectedTopic.title}</h2>
            <p className="text-xs text-slate-300 mt-1">{selectedTopic.summary}</p>
          </div>

          {/* Deep Content */}
          <div className="text-xs sm:text-sm text-slate-300 leading-relaxed space-y-3 whitespace-pre-line font-sans">
            {selectedTopic.content}
          </div>

          {/* Key Takeaway Callout */}
          <div className="p-3.5 bg-indigo-950/30 border border-indigo-500/30 rounded-xl text-xs text-indigo-200">
            <span className="font-bold text-white">Core Principle: </span>
            {selectedTopic.keyTakeaway}
          </div>

          {/* Worked Example */}
          <div className="p-3.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-300">
            <span className="font-bold text-cyan-300">Worked Practical Application: </span>
            {selectedTopic.workedExample}
          </div>

          {/* Citations */}
          <div className="text-[11px] text-slate-500 space-y-0.5 pt-1">
            <span className="font-semibold text-slate-400">Scientific & Philosophical Citations:</span>
            {selectedTopic.citations.map((cite, i) => (
              <div key={i} className="italic">
                [{i + 1}] {cite}
              </div>
            ))}
          </div>

          {/* Interactive Comprehension Quiz */}
          <div className="mt-4 pt-4 border-t border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                <span>Knowledge Check (+50 XP)</span>
              </h4>
            </div>

            <p className="text-xs text-slate-200 font-medium">
              {selectedTopic.quiz.question}
            </p>

            <div className="space-y-1.5">
              {selectedTopic.quiz.options.map((opt, idx) => {
                const isSelected = quizAnswer === idx;
                const isCorrect = idx === selectedTopic.quiz.correctIndex;

                let btnStyle = 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700';
                if (quizSubmitted) {
                  if (isCorrect) btnStyle = 'bg-emerald-500/20 border-emerald-500 text-emerald-200 font-semibold';
                  else if (isSelected) btnStyle = 'bg-rose-500/20 border-rose-500 text-rose-200';
                  else btnStyle = 'opacity-40 border-slate-800 text-slate-500';
                }

                return (
                  <button
                    key={idx}
                    disabled={quizSubmitted}
                    onClick={() => handleQuizSubmit(idx)}
                    className={`w-full text-left p-2.5 rounded-lg border text-xs transition-colors flex items-center justify-between ${btnStyle}`}
                  >
                    <span>{opt}</span>
                    {quizSubmitted && isCorrect && <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />}
                    {quizSubmitted && isSelected && !isCorrect && <XCircle className="w-4 h-4 text-rose-400 shrink-0" />}
                  </button>
                );
              })}
            </div>

            {quizSubmitted && (
              <div className="p-3 bg-slate-900 border border-slate-800 rounded-lg text-xs text-slate-300">
                <span className="font-semibold text-white">Explanation: </span>
                {selectedTopic.quiz.explanation}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

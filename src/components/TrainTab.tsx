import React, { useState } from 'react';
import { GameCategory, GameDefinition, UserProfile } from '../types';
import { GAMES_CATALOG } from '../data/gamesData';
import { Brain, Search, Filter, Play, Clock, Sparkles, Shield, ChevronRight } from 'lucide-react';

interface TrainTabProps {
  profile: UserProfile;
  onLaunchGame: (gameId: string) => void;
}

export const TrainTab: React.FC<TrainTabProps> = ({ profile, onLaunchGame }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const categories: (string | GameCategory)[] = [
    'All',
    'Logic',
    'Analytical',
    'Memory & Attention',
    'Creativity',
    'Strategy',
  ];

  const filteredGames = GAMES_CATALOG.filter((game) => {
    const matchesCat = selectedCategory === 'All' || game.category === selectedCategory;
    const matchesSearch =
      game.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      game.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div className="space-y-5 pb-24">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <Brain className="w-5 h-5 text-cyan-400" />
          <h1 className="text-lg sm:text-xl font-bold text-white tracking-tight">
            Cognitive & Logic Studio
          </h1>
        </div>
        <p className="text-xs text-slate-400 mt-0.5">
          12 deterministic interactive challenges engineered to train formal deduction, focus, and strategic optimization.
        </p>
      </div>

      {/* Search & Category Filter */}
      <div className="space-y-2.5">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search logic puzzles, syllogisms, memory matrices..."
            className="w-full bg-[#0b101d] border border-slate-800 rounded-xl py-2 pl-9 pr-3 text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-cyan-500"
          />
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-colors ${
                selectedCategory === cat
                  ? 'bg-cyan-500/20 border border-cyan-400 text-cyan-300 font-semibold'
                  : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Games Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
        {filteredGames.map((game) => (
          <div
            key={game.id}
            className="bg-[#0b101d] border border-slate-800 hover:border-slate-700/80 rounded-xl p-4 flex flex-col justify-between transition-all group shadow-sm hover:shadow-cyan-950/20"
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="text-[10px] font-mono uppercase font-semibold text-purple-300 bg-purple-500/10 px-2 py-0.5 rounded border border-purple-500/20">
                  {game.category} · {game.attribute}
                </span>
                <div className="flex items-center gap-1 text-[11px] font-mono text-cyan-400">
                  <Clock className="w-3 h-3 text-cyan-500" />
                  <span>{game.estimatedSeconds}s</span>
                </div>
              </div>

              <h3 className="text-sm font-bold text-white group-hover:text-cyan-300 transition-colors">
                {game.title}
              </h3>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                {game.description}
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between">
              <span className="text-xs font-mono font-medium text-emerald-400">
                +{game.xpReward} XP
              </span>

              <button
                onClick={() => onLaunchGame(game.id)}
                className="px-3.5 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Play className="w-3 h-3 fill-white" />
                <span>Play Game</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

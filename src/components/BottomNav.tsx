import React from 'react';
import { Home, Brain, Mic, MessageSquare, BookOpen, User } from 'lucide-react';

export type TabType = 'home' | 'train' | 'speak' | 'mentor' | 'library' | 'profile';

interface BottomNavProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  isFrame?: boolean;
}

export const BottomNav: React.FC<BottomNavProps> = ({ activeTab, setActiveTab, isFrame }) => {
  const tabs = [
    { id: 'home' as TabType, label: 'Home', icon: Home },
    { id: 'train' as TabType, label: 'Train', icon: Brain },
    { id: 'speak' as TabType, label: 'Speak', icon: Mic },
    { id: 'mentor' as TabType, label: 'Mentor', icon: MessageSquare },
    { id: 'library' as TabType, label: 'Library', icon: BookOpen },
    { id: 'profile' as TabType, label: 'Profile', icon: User },
  ];

  return (
    <nav className={`${isFrame ? 'w-full bg-[#070b14] border-t border-slate-800/80 px-1 py-1 shrink-0' : 'fixed bottom-0 left-0 right-0 z-40 bg-[#070b14]/95 backdrop-blur-lg border-t border-slate-800/80 px-2 py-1.5 shadow-2xl'}`}>
      <div className="max-w-md mx-auto flex items-center justify-around">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex flex-col items-center justify-center py-1 px-3 rounded-2xl transition-all duration-200 relative ${
                isActive
                  ? 'text-cyan-400 font-semibold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {/* Material 3 active pill indicator */}
              <div
                className={`flex items-center justify-center px-4 py-1 rounded-full transition-all duration-200 ${
                  isActive ? 'bg-cyan-500/15' : 'bg-transparent'
                }`}
              >
                <Icon
                  className={`w-5 h-5 transition-transform duration-200 ${
                    isActive ? 'scale-110 text-cyan-400 stroke-[2.5]' : 'stroke-[1.75]'
                  }`}
                />
              </div>
              <span className="text-[10px] mt-0.5 tracking-tight font-medium">
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { UserProfile, GameDefinition } from './types';
import { Header } from './components/Header';
import { BottomNav, TabType } from './components/BottomNav';
import { HomeTab } from './components/HomeTab';
import { TrainTab } from './components/TrainTab';
import { SpeakTab } from './components/SpeakTab';
import { MentorTab } from './components/MentorTab';
import { LibraryTab } from './components/LibraryTab';
import { ProfileTab } from './components/ProfileTab';
import { GameRunner } from './components/GameRunner';
import { OnboardingModal } from './components/OnboardingModal';
import { AndroidCodeViewer } from './components/AndroidCodeViewer';
import { GAMES_CATALOG } from './data/gamesData';
import { Wifi, Battery, Signal } from 'lucide-react';

const INITIAL_PROFILE: UserProfile = {
  id: 'aura_user_1',
  name: 'Marcus Vance',
  goal: 'Critical Thinking & Logical Reasoning',
  dailyMinutes: 30,
  difficulty: 'Intermediate',
  primaryContext: 'Leadership',
  selectedProgram: 'foundation_30',
  currentDay: 1,
  level: 1,
  xp: 150,
  streak: 3,
  lastActiveDate: '2026-11-12',
  attributes: {
    LOGIC: 45,
    WISDOM: 35,
    FOCUS: 40,
    EXPRESSION: 50,
    EMPATHY: 35,
    COMPOSURE: 45,
    STRATEGY: 40,
    CREATIVITY: 30,
  },
  unlockedSkills: ['skill_syllogism'],
  achievements: ['First Deductive Step'],
  completedMissions: {},
  onboardingCompleted: true, // Default to true so app is immediately playable; autostart compliant
};

export default function App() {
  const [profile, setProfile] = useState<UserProfile>(() => {
    try {
      const saved = localStorage.getItem('aura_mind_profile');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Failed to load profile', e);
    }
    return INITIAL_PROFILE;
  });

  const [activeTab, setActiveTab] = useState<TabType>('home');
  const [isMobileFrame, setIsMobileFrame] = useState<boolean>(false);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [activeGame, setActiveGame] = useState<GameDefinition | null>(null);
  const [isAndroidCodeOpen, setIsAndroidCodeOpen] = useState<boolean>(false);
  const [isOnboardingOpen, setIsOnboardingOpen] = useState<boolean>(false);

  // Check query params for autostart
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('autostart') === '1') {
      setIsOnboardingOpen(false);
    }
  }, []);

  // Save profile to localStorage on change
  useEffect(() => {
    try {
      localStorage.setItem('aura_mind_profile', JSON.stringify(profile));
    } catch (e) {
      console.warn('Failed to persist profile', e);
    }
  }, [profile]);

  const handleUpdateProfile = (updated: UserProfile) => {
    setProfile(updated);
  };

  const handleLaunchGame = (gameId: string) => {
    const game = GAMES_CATALOG.find((g) => g.id === gameId);
    if (game) {
      setActiveGame(game);
    }
  };

  const handleCompleteOnboarding = (updates: Partial<UserProfile>) => {
    setProfile((prev) => ({
      ...prev,
      ...updates,
      onboardingCompleted: true,
    }));
    setIsOnboardingOpen(false);
  };

  const renderActiveTab = (inFrame = false) => {
    switch (activeTab) {
      case 'home':
        return (
          <HomeTab
            profile={profile}
            onUpdateProfile={handleUpdateProfile}
            onLaunchGame={handleLaunchGame}
            onOpenSpeak={() => setActiveTab('speak')}
            onOpenMentor={() => setActiveTab('mentor')}
          />
        );
      case 'train':
        return <TrainTab profile={profile} onLaunchGame={handleLaunchGame} />;
      case 'speak':
        return <SpeakTab profile={profile} onUpdateProfile={handleUpdateProfile} />;
      case 'mentor':
        return (
          <MentorTab
            profile={profile}
            onUpdateProfile={handleUpdateProfile}
            soundEnabled={soundEnabled}
          />
        );
      case 'library':
        return <LibraryTab profile={profile} onUpdateProfile={handleUpdateProfile} />;
      case 'profile':
        return (
          <ProfileTab
            profile={profile}
            onUpdateProfile={handleUpdateProfile}
            isMobileFrame={inFrame}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-[#05070c] text-slate-100 flex flex-col font-sans selection:bg-purple-500/30">
      {/* Top Header */}
      <Header
        profile={profile}
        isMobileFrame={isMobileFrame}
        setIsMobileFrame={setIsMobileFrame}
        soundEnabled={soundEnabled}
        setSoundEnabled={setSoundEnabled}
        onOpenAndroidCode={() => setIsAndroidCodeOpen(true)}
      />

      {/* Main Container */}
      <main className="flex-1 w-full flex justify-center py-4 px-2 sm:px-4">
        {isMobileFrame ? (
          /* ANDROID DEVICE SIMULATOR FRAME (Pixel 8 style) */
          <div className="w-[390px] h-[820px] bg-[#070b14] border-[8px] border-slate-800 rounded-[44px] shadow-2xl relative flex flex-col overflow-hidden ring-1 ring-slate-700/50">
            {/* Camera Punchhole & Android Status Bar */}
            <div className="w-full bg-[#070b14] pt-2 px-6 pb-1 flex items-center justify-between z-30 select-none text-[11px] text-slate-400 font-mono">
              <span>09:41</span>
              {/* Punchhole */}
              <div className="w-3.5 h-3.5 bg-black rounded-full ring-2 ring-slate-900 mx-auto" />
              <div className="flex items-center gap-1.5 text-slate-400">
                <Signal className="w-3 h-3" />
                <Wifi className="w-3 h-3" />
                <Battery className="w-3.5 h-3.5" />
              </div>
            </div>

            {/* Inner Mobile Scroll Area */}
            <div className="flex-1 overflow-y-auto p-3.5 pb-20">
              {renderActiveTab(true)}
            </div>

            {/* Mobile Bottom Navigation */}
            <BottomNav activeTab={activeTab} setActiveTab={setActiveTab} isFrame={true} />

            {/* Android Navigation Gesture Bar */}
            <div className="w-full py-1.5 bg-[#070b14] flex justify-center z-50">
              <div className="w-28 h-1 bg-slate-600 rounded-full" />
            </div>
          </div>
        ) : (
          /* RESPONSIVE FULLSCREEN VIEW */
          <div className="w-full max-w-4xl mx-auto px-2 sm:px-4">
            {renderActiveTab(false)}
            <BottomNav activeTab={activeTab} setActiveTab={setActiveTab} />
          </div>
        )}
      </main>

      {/* Interactive Game Runner Modal */}
      {activeGame && (
        <GameRunner
          game={activeGame}
          profile={profile}
          onUpdateProfile={handleUpdateProfile}
          onClose={() => setActiveGame(null)}
          soundEnabled={soundEnabled}
        />
      )}

      {/* Onboarding Wizard Modal */}
      <OnboardingModal
        isOpen={isOnboardingOpen}
        onComplete={handleCompleteOnboarding}
      />

      {/* Native Android Kotlin Architecture Viewer */}
      <AndroidCodeViewer
        isOpen={isAndroidCodeOpen}
        onClose={() => setIsAndroidCodeOpen(false)}
      />
    </div>
  );
}

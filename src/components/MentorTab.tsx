import React, { useState } from 'react';
import { UserProfile, ChatMessage, SocraticPersona } from '../types';
import { SOCRATIC_PERSONAS } from '../data/personasData';
import { awardUserXP } from '../utils/engine';
import {
  MessageSquare,
  Sparkles,
  Send,
  Volume2,
  VolumeX,
  AlertCircle,
  Lightbulb,
  Shield,
  RotateCcw,
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface MentorTabProps {
  profile: UserProfile;
  onUpdateProfile: (updated: UserProfile) => void;
  soundEnabled: boolean;
}

export const MentorTab: React.FC<MentorTabProps> = ({
  profile,
  onUpdateProfile,
  soundEnabled,
}) => {
  const [selectedPersona, setSelectedPersona] = useState<SocraticPersona>(SOCRATIC_PERSONAS[0]);
  const [messages, setMessages] = useState<Record<string, ChatMessage[]>>({
    philosopher: [
      {
        id: 'init_1',
        sender: 'mentor',
        text: 'Greetings. I am here not to flatter your convictions, but to help you test their structural integrity. Share a claim or belief you consider certain.',
        timestamp: Date.now(),
      },
    ],
    strategist: [
      {
        id: 'init_2',
        sender: 'mentor',
        text: 'Tactics without strategy is the noise before defeat. Where are your resources currently overextended, and what payoff are you chasing?',
        timestamp: Date.now(),
      },
    ],
    scientist: [
      {
        id: 'init_3',
        sender: 'mentor',
        text: 'State your current working hypothesis. How do we test it against the Null Hypothesis and account for base-rate probability?',
        timestamp: Date.now(),
      },
    ],
    coach: [
      {
        id: 'init_4',
        sender: 'mentor',
        text: 'Clarity is executive power. Give me your thesis in one sentence. Lead with the core conclusion.',
        timestamp: Date.now(),
      },
    ],
    leader: [
      {
        id: 'init_5',
        sender: 'mentor',
        text: 'External events have no power to disturb you without your consent. What friction is challenging your tranquility today?',
        timestamp: Date.now(),
      },
    ],
  });

  const [inputMessage, setInputMessage] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);

  const currentChat = messages[selectedPersona.id] || [];

  const handleSpeak = (text: string) => {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    if (isSpeaking) {
      setIsSpeaking(false);
      return;
    }

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1.0;
    utterance.pitch = 0.95;
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    setIsSpeaking(true);
    window.speechSynthesis.speak(utterance);
  };

  const handleSend = async (customPrompt?: string) => {
    const textToSend = (customPrompt || inputMessage).trim();
    if (!textToSend || isLoading) return;

    const userMsg: ChatMessage = {
      id: `usr_${Date.now()}`,
      sender: 'user',
      text: textToSend,
      timestamp: Date.now(),
    };

    const updatedList = [...currentChat, userMsg];
    setMessages((prev) => ({
      ...prev,
      [selectedPersona.id]: updatedList,
    }));
    setInputMessage('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/mentor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          personaId: selectedPersona.id,
          personaName: selectedPersona.name,
          personaStyle: selectedPersona.dialogueStyle,
          messages: updatedList.slice(-6),
          userMessage: textToSend,
        }),
      });

      const data = await response.json();
      const replyText = data.reply || 'What evidence led you to that conclusion? Consider what would follow if your premise were false.';

      const mentorMsg: ChatMessage = {
        id: `men_${Date.now()}`,
        sender: 'mentor',
        text: replyText,
        timestamp: Date.now(),
      };

      setMessages((prev) => ({
        ...prev,
        [selectedPersona.id]: [...updatedList, mentorMsg],
      }));

      // Speak aloud if sound enabled
      if (soundEnabled) {
        handleSpeak(replyText);
      }

      // Award XP
      const updatedProfile = awardUserXP(profile, 25, 'WISDOM', 3);
      onUpdateProfile(updatedProfile);
    } catch (e) {
      console.warn('Mentor response error', e);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4 pb-24">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <MessageSquare className="w-5 h-5 text-purple-400" />
          <h1 className="text-lg sm:text-xl font-bold text-white tracking-tight">
            AI Socratic Mentor Studio
          </h1>
        </div>
        <p className="text-xs text-slate-400 mt-0.5">
          Challenge unsupported assumptions, expose cognitive biases, and refine mental models with specialized Socratic coaches.
        </p>
      </div>

      {/* Personas Carousel */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
        {SOCRATIC_PERSONAS.map((p) => {
          const isSelected = selectedPersona.id === p.id;
          return (
            <button
              key={p.id}
              onClick={() => {
                setSelectedPersona(p);
                if ('speechSynthesis' in window) window.speechSynthesis.cancel();
              }}
              className={`p-2.5 rounded-xl border text-left transition-all ${
                isSelected
                  ? 'bg-purple-600/25 border-purple-500 shadow-md text-white'
                  : 'bg-[#0b101d] border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              <div className="text-lg">{p.avatarEmoji}</div>
              <div className="text-xs font-bold text-slate-200 mt-1 leading-tight">{p.name}</div>
              <div className="text-[10px] text-purple-400 font-mono mt-0.5 truncate">{p.title}</div>
            </button>
          );
        })}
      </div>

      {/* Active Persona Banner */}
      <div className="p-3 bg-[#0b101d] border border-slate-800 rounded-xl flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <span className="text-2xl">{selectedPersona.avatarEmoji}</span>
          <div>
            <div className="text-xs font-bold text-white">
              {selectedPersona.name} · {selectedPersona.title}
            </div>
            <p className="text-[11px] text-slate-400">{selectedPersona.description}</p>
          </div>
        </div>

        <div className="text-[10px] font-mono text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/20 shrink-0">
          Socratic Protocol
        </div>
      </div>

      {/* Chat Messages Log */}
      <div className="bg-[#0b101d] border border-slate-800 rounded-xl p-4 min-h-[340px] max-h-[460px] overflow-y-auto space-y-3">
        {currentChat.map((m) => {
          const isMentor = m.sender === 'mentor';
          return (
            <div
              key={m.id}
              className={`flex flex-col ${isMentor ? 'items-start' : 'items-end'}`}
            >
              <div
                className={`max-w-[85%] sm:max-w-[75%] p-3.5 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                  isMentor
                    ? 'bg-slate-900 border border-slate-800 text-slate-200 rounded-tl-sm'
                    : 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-tr-sm shadow-md'
                }`}
              >
                {m.text}
              </div>

              {isMentor && (
                <div className="flex items-center gap-2 mt-1 px-1">
                  <button
                    onClick={() => handleSpeak(m.text)}
                    className="text-[10px] text-slate-500 hover:text-cyan-400 flex items-center gap-1 transition-colors"
                  >
                    <Volume2 className="w-3 h-3" />
                    <span>Listen</span>
                  </button>
                </div>
              )}
            </div>
          );
        })}

        {isLoading && (
          <div className="flex items-center gap-2 text-xs text-purple-400 font-mono italic animate-pulse p-2">
            <Sparkles className="w-4 h-4 text-cyan-400 animate-spin" />
            <span>{selectedPersona.name} is formulating a Socratic inquiry...</span>
          </div>
        )}
      </div>

      {/* Suggested Starter Questions */}
      <div className="space-y-1.5">
        <span className="text-[11px] font-mono uppercase text-slate-500 font-semibold">
          Starter Prompts
        </span>
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {[
            'Successful people always wake up early.',
            'Hard work guarantees career success.',
            'Avoiding conflict is the best way to maintain peace.',
            'Speed is always better than consensus in business.',
          ].map((prompt, i) => (
            <button
              key={i}
              onClick={() => handleSend(prompt)}
              className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-[11px] text-slate-300 whitespace-nowrap transition-colors"
            >
              "{prompt}"
            </button>
          ))}
        </div>
      </div>

      {/* Input Box */}
      <div className="flex gap-2">
        <input
          type="text"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder={`Test a conviction with ${selectedPersona.name}...`}
          className="flex-1 bg-[#0b101d] border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-purple-500"
        />
        <button
          onClick={() => handleSend()}
          disabled={isLoading || !inputMessage.trim()}
          className="px-4 py-2.5 bg-gradient-to-r from-purple-600 to-cyan-500 hover:from-purple-500 hover:to-cyan-400 disabled:opacity-40 text-white rounded-xl shadow-lg flex items-center justify-center transition-all cursor-pointer"
        >
          <Send className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

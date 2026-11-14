import React, { useState, useEffect, useRef } from 'react';
import { UserProfile, SpeechAnalysisResult } from '../types';
import { SPEECH_PROMPTS, SpeechPrompt } from '../data/speechPromptsData';
import { analyzeSpeech, awardUserXP } from '../utils/engine';
import {
  Mic,
  MicOff,
  Play,
  RotateCcw,
  Sparkles,
  ChevronDown,
  ChevronUp,
  Volume2,
  CheckCircle2,
  AlertTriangle,
  Award,
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface SpeakTabProps {
  profile: UserProfile;
  onUpdateProfile: (updated: UserProfile) => void;
}

export const SpeakTab: React.FC<SpeakTabProps> = ({ profile, onUpdateProfile }) => {
  const promptList = Object.values(SPEECH_PROMPTS);
  const [selectedPrompt, setSelectedPrompt] = useState<SpeechPrompt>(promptList[0]);

  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [recordingSeconds, setRecordingSeconds] = useState<number>(0);
  const [transcript, setTranscript] = useState<string>('');
  const [analysis, setAnalysis] = useState<SpeechAnalysisResult | null>(null);
  const [aiFeedback, setAiFeedback] = useState<{
    strengths?: string[];
    weaknesses?: string[];
    aiCoachInsight?: string;
  } | null>(null);
  const [isLoadingAi, setIsLoadingAi] = useState<boolean>(false);
  const [showModelComparison, setShowModelComparison] = useState<boolean>(false);

  const recognitionRef = useRef<any>(null);
  const timerRef = useRef<any>(null);

  // Setup Web Speech API if supported
  useEffect(() => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onresult = (event: any) => {
        let currentTranscript = '';
        for (let i = 0; i < event.results.length; i++) {
          currentTranscript += event.results[i][0].transcript + ' ';
        }
        setTranscript(currentTranscript.trim());
      };

      recognition.onerror = (e: any) => {
        console.warn('Speech recognition status:', e.error);
      };

      recognitionRef.current = recognition;
    }
  }, []);

  const startRecording = () => {
    setTranscript('');
    setAnalysis(null);
    setAiFeedback(null);
    setRecordingSeconds(0);
    setIsRecording(true);

    if (recognitionRef.current) {
      try {
        recognitionRef.current.start();
      } catch (err) {
        console.warn('Recognition already started or permission issue', err);
      }
    }

    timerRef.current = setInterval(() => {
      setRecordingSeconds((prev) => prev + 1);
    }, 1000);
  };

  const stopRecording = async () => {
    setIsRecording(false);
    if (timerRef.current) clearInterval(timerRef.current);
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (err) {
        console.warn('Error stopping speech recognition', err);
      }
    }

    // If transcript is empty (e.g. simulated desktop or microphone blocked), provide a sample text or prompt them
    const effectiveText =
      transcript.trim() ||
      'Correlation does not imply causation because two variables can rise together due to a hidden third factor, such as summer heat driving both ice cream sales and sunburns. Therefore, we must always search for the confounding variable.';

    if (!transcript.trim()) {
      setTranscript(effectiveText);
    }

    const duration = Math.max(15, recordingSeconds);
    const result = analyzeSpeech(effectiveText, duration);
    setAnalysis(result);

    // Call server AI endpoint
    setIsLoadingAi(true);
    try {
      const res = await fetch('/api/speech-feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          transcript: effectiveText,
          promptTitle: selectedPrompt.title,
          durationSeconds: duration,
        }),
      });
      const data = await res.json();
      setAiFeedback(data);
    } catch (e) {
      console.warn('Could not retrieve speech feedback', e);
    } finally {
      setIsLoadingAi(false);
    }

    // Award XP
    confetti({ particleCount: 60, spread: 70, origin: { y: 0.6 } });
    const updated = awardUserXP(profile, 75, 'EXPRESSION', 8);
    onUpdateProfile(updated);
  };

  return (
    <div className="space-y-5 pb-24">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <Mic className="w-5 h-5 text-emerald-400" />
          <h1 className="text-lg sm:text-xl font-bold text-white tracking-tight">
            Communication Training Studio
          </h1>
        </div>
        <p className="text-xs text-slate-400 mt-0.5">
          Record spoken articulation. Measure real-time WPM, pause intervals, verbal fillers, and structural clarity.
        </p>
      </div>

      {/* Prompt Selector */}
      <div className="bg-[#0b101d] border border-slate-800 rounded-xl p-4 space-y-3">
        <label className="text-xs uppercase font-mono font-semibold text-slate-400 block">
          Select Spoken Challenge
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {promptList.map((p) => (
            <button
              key={p.id}
              onClick={() => {
                setSelectedPrompt(p);
                setAnalysis(null);
                setAiFeedback(null);
                setTranscript('');
              }}
              className={`text-left p-2.5 rounded-lg border text-xs transition-all ${
                selectedPrompt.id === p.id
                  ? 'bg-emerald-500/20 border-emerald-500 text-white font-medium'
                  : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              <div className="text-[10px] text-emerald-400 font-mono">{p.category}</div>
              <div className="font-semibold text-slate-200 mt-0.5 truncate">{p.title}</div>
            </button>
          ))}
        </div>

        {/* Selected Prompt Detail */}
        <div className="p-3 bg-slate-900/90 border border-slate-800 rounded-lg space-y-2 mt-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-white">{selectedPrompt.title}</span>
            <span className="font-mono text-emerald-400 text-[11px]">
              Target: {selectedPrompt.targetDurationSeconds}s
            </span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">{selectedPrompt.prompt}</p>

          <div className="text-[11px] text-slate-400 pt-1">
            <span className="font-semibold text-slate-300">Key Pillars: </span>
            {selectedPrompt.keyPointsToCover.join(' · ')}
          </div>
        </div>
      </div>

      {/* Recording Crucible */}
      <div className="bg-[#0b101d] border border-slate-800 rounded-xl p-6 text-center space-y-4">
        {/* Animated Waveform / Mic Button */}
        <div className="relative inline-flex items-center justify-center">
          {isRecording && (
            <div className="absolute inset-0 rounded-full bg-emerald-500/20 animate-ping" />
          )}
          <button
            onClick={isRecording ? stopRecording : startRecording}
            className={`w-20 h-20 rounded-full flex items-center justify-center transition-all cursor-pointer shadow-xl ${
              isRecording
                ? 'bg-rose-600 hover:bg-rose-500 text-white animate-pulse'
                : 'bg-gradient-to-tr from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white'
            }`}
          >
            {isRecording ? <MicOff className="w-8 h-8" /> : <Mic className="w-8 h-8" />}
          </button>
        </div>

        <div>
          <div className="text-sm font-bold text-white font-mono">
            {isRecording ? `Recording: ${recordingSeconds}s` : 'Tap to Start Speaking'}
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            {isRecording
              ? 'Deliver your argument with deliberate pauses. Tap to finish.'
              : 'Microphone permission requested. You can also paste or edit your transcript below.'}
          </p>
        </div>

        {/* Live Audio Waves Simulation */}
        {isRecording && (
          <div className="flex items-center justify-center gap-1.5 h-8">
            {[40, 70, 90, 50, 80, 100, 60, 85, 45, 95, 65].map((h, i) => (
              <div
                key={i}
                className="w-1 bg-emerald-400 rounded-full animate-bounce"
                style={{
                  height: `${h}%`,
                  animationDelay: `${i * 0.08}s`,
                }}
              />
            ))}
          </div>
        )}

        {/* Live Transcript Box */}
        <div className="text-left space-y-1.5">
          <label className="text-[11px] font-mono text-slate-400 uppercase font-semibold">
            Spoken Transcript
          </label>
          <textarea
            value={transcript}
            onChange={(e) => setTranscript(e.target.value)}
            placeholder="Your spoken words will transcribe here in real time (or type your practice speech here)..."
            className="w-full h-24 bg-slate-900 border border-slate-800 rounded-lg p-3 text-xs text-slate-200 focus:outline-none focus:border-emerald-500 resize-none font-mono"
          />
        </div>

        {!isRecording && transcript && !analysis && (
          <button
            onClick={stopRecording}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded-lg"
          >
            Analyze Speech
          </button>
        )}
      </div>

      {/* ANALYSIS METRICS DASHBOARD */}
      {analysis && (
        <div className="bg-[#0b101d] border border-slate-800 rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Award className="w-4 h-4 text-cyan-400" />
              <span>Acoustic & Structural Speech Metrics</span>
            </h3>
            <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20 font-bold">
              +75 XP Awarded
            </span>
          </div>

          {/* 4 Stat Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            <div className="bg-slate-900/80 border border-slate-800 p-3 rounded-lg text-center">
              <div className="text-[10px] text-slate-400 font-mono uppercase">Pace</div>
              <div className="text-base font-bold text-cyan-300 font-mono mt-0.5">
                {analysis.wordsPerMinute} <span className="text-xs font-normal">WPM</span>
              </div>
              <div className="text-[10px] text-slate-500 mt-0.5">Optimal: 130-165</div>
            </div>

            <div className="bg-slate-900/80 border border-slate-800 p-3 rounded-lg text-center">
              <div className="text-[10px] text-slate-400 font-mono uppercase">Filler Words</div>
              <div className={`text-base font-bold font-mono mt-0.5 ${analysis.fillerWordsCount > 2 ? 'text-rose-400' : 'text-emerald-400'}`}>
                {analysis.fillerWordsCount}
              </div>
              <div className="text-[10px] text-slate-500 mt-0.5">Target: 0-1</div>
            </div>

            <div className="bg-slate-900/80 border border-slate-800 p-3 rounded-lg text-center">
              <div className="text-[10px] text-slate-400 font-mono uppercase">Pauses</div>
              <div className="text-base font-bold text-purple-300 font-mono mt-0.5">
                ~{analysis.estimatedPauses}
              </div>
              <div className="text-[10px] text-slate-500 mt-0.5">Cadence breaks</div>
            </div>

            <div className="bg-slate-900/80 border border-slate-800 p-3 rounded-lg text-center">
              <div className="text-[10px] text-slate-400 font-mono uppercase">Clarity Score</div>
              <div className="text-base font-bold text-amber-300 font-mono mt-0.5">
                {analysis.structuralClarityScore}/100
              </div>
              <div className="text-[10px] text-slate-500 mt-0.5">Task-specific</div>
            </div>
          </div>

          {/* Pacing feedback */}
          <div className="p-3 bg-slate-900/60 border border-slate-800 rounded-lg text-xs text-slate-300">
            <span className="font-semibold text-white">Cadence Assessment: </span>
            {analysis.pacingFeedback}
          </div>

          {/* Actionable suggestions */}
          <div className="space-y-1.5">
            <span className="text-xs font-bold text-slate-300">Targeted Improvements:</span>
            {analysis.suggestions.map((sug, idx) => (
              <div key={idx} className="flex items-start gap-2 text-xs text-slate-300">
                <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
                <span>{sug}</span>
              </div>
            ))}
          </div>

          {/* AI Coach Socratic Insight */}
          {isLoadingAi ? (
            <div className="p-3 bg-purple-950/20 border border-purple-500/20 rounded-lg text-xs text-purple-300 animate-pulse">
              Generating Socratic vocal presence feedback via Gemini...
            </div>
          ) : aiFeedback ? (
            <div className="p-3.5 bg-gradient-to-r from-purple-950/30 to-indigo-950/20 border border-purple-500/30 rounded-lg space-y-1.5">
              <div className="flex items-center gap-1.5 text-xs font-bold text-purple-300">
                <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                <span>AI Socratic Coach Feedback</span>
              </div>
              <p className="text-xs text-slate-200 leading-relaxed">
                {aiFeedback.aiCoachInsight}
              </p>
            </div>
          ) : null}

          {/* Compare with Exemplary Model Accordion */}
          <div className="border-t border-slate-800 pt-3">
            <button
              onClick={() => setShowModelComparison(!showModelComparison)}
              className="text-xs text-cyan-400 hover:text-cyan-300 font-medium flex items-center gap-1 cursor-pointer"
            >
              <span>{showModelComparison ? 'Hide Model Outline' : 'Compare with Exemplary Model Delivery'}</span>
              {showModelComparison ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>

            {showModelComparison && (
              <div className="mt-2 p-3 bg-slate-900 border border-slate-800 rounded-lg text-xs text-slate-300 font-mono leading-relaxed">
                {selectedPrompt.exemplaryModelOutline}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

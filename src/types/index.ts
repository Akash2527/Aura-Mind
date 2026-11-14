export type AuraAttribute =
  | 'LOGIC'
  | 'WISDOM'
  | 'FOCUS'
  | 'EXPRESSION'
  | 'EMPATHY'
  | 'COMPOSURE'
  | 'STRATEGY'
  | 'CREATIVITY';

export interface UserAttributes {
  LOGIC: number;
  WISDOM: number;
  FOCUS: number;
  EXPRESSION: number;
  EMPATHY: number;
  COMPOSURE: number;
  STRATEGY: number;
  CREATIVITY: number;
}

export type ProgramType = 'foundation_30' | 'advanced_60' | 'mastery_90';

export interface UserProfile {
  id: string;
  name: string;
  goal: string;
  dailyMinutes: number;
  difficulty: 'Beginner' | 'Intermediate' | 'Mastery';
  primaryContext: 'Interviews' | 'Leadership' | 'Business' | 'Education' | 'Everyday Life';
  selectedProgram: ProgramType;
  currentDay: number;
  level: number;
  xp: number;
  streak: number;
  lastActiveDate: string;
  attributes: UserAttributes;
  unlockedSkills: string[];
  achievements: string[];
  completedMissions: Record<number, boolean>;
  onboardingCompleted: boolean;
}

export interface DailyMission {
  day: number;
  program: ProgramType;
  title: string;
  theme: string;
  primaryAttribute: AuraAttribute;
  estimatedMinutes: number;
  xpReward: number;
  warmup: {
    question: string;
    options: string[];
    correctIndex: number;
    explanation: string;
  };
  deepChallenge: {
    title: string;
    scenario: string;
    thoughtPrompt: string;
    keyInsight: string;
  };
  gameType: string;
  speechPromptId: string;
  socialScenarioId: string;
  realWorldMission: {
    title: string;
    task: string;
    actionableTip: string;
  };
  reflectionQuestion: string;
}

export type GameCategory = 'Logic' | 'Analytical' | 'Memory & Attention' | 'Creativity' | 'Strategy';

export interface GameDefinition {
  id: string;
  title: string;
  category: GameCategory;
  attribute: AuraAttribute;
  description: string;
  instructions: string;
  difficulty: 'Foundation' | 'Advanced' | 'Mastery';
  estimatedSeconds: number;
  xpReward: number;
}

export interface GameProblemInstance {
  id: string;
  gameId: string;
  prompt: string;
  context?: string;
  options?: string[];
  correctAnswer: string | number | boolean | number[];
  solutionExplanation: string;
  hint: string;
  metadata?: Record<string, unknown>;
}

export interface SocraticPersona {
  id: string;
  name: string;
  title: string;
  avatarEmoji: string;
  description: string;
  dialogueStyle: string;
  starterPrompt: string;
  coreQuestion: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'mentor';
  text: string;
  timestamp: number;
  biasAlert?: string;
  insight?: string;
}

export interface SpeechAnalysisResult {
  durationSeconds: number;
  wordCount: number;
  wordsPerMinute: number;
  fillerWordsCount: number;
  fillerWordsFound: string[];
  estimatedPauses: number;
  pacingFeedback: string;
  structuralClarityScore: number;
  suggestions: string[];
  transcript: string;
}

export interface SocialScenarioChoice {
  text: string;
  style: 'Passive' | 'Aggressive' | 'Passive-Aggressive' | 'Assertive & Composed';
  consequence: string;
  attributeChanges: Partial<UserAttributes>;
  xpAward: number;
  explanation: string;
}

export interface SocialScenario {
  id: string;
  title: string;
  category: string;
  context: string;
  dilemma: string;
  choices: SocialScenarioChoice[];
  socraticLesson: string;
}

export interface LibraryTopic {
  id: string;
  title: string;
  category: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  readTime: string;
  summary: string;
  content: string;
  keyTakeaway: string;
  workedExample: string;
  citations: string[];
  quiz: {
    question: string;
    options: string[];
    correctIndex: number;
    explanation: string;
  };
}

export interface BossBattle {
  id: string;
  week: number;
  title: string;
  subtitle: string;
  scenarioDescription: string;
  stages: {
    title: string;
    type: 'logic' | 'fallacy' | 'speech' | 'social';
    prompt: string;
    options?: string[];
    correctIndex?: number;
    explanation: string;
  }[];
  rewardXP: number;
  badgeUnlock: string;
}

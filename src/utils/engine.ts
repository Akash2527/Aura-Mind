import { AuraAttribute, SpeechAnalysisResult, UserAttributes, UserProfile } from '../types';

export const LEVEL_THRESHOLDS = [
  { level: 1, xp: 0, title: 'The Beginner' },
  { level: 5, xp: 500, title: 'The Observer' },
  { level: 10, xp: 1500, title: 'The Thinker' },
  { level: 20, xp: 4000, title: 'The Analyst' },
  { level: 30, xp: 8000, title: 'The Strategist' },
  { level: 40, xp: 13000, title: 'The Communicator' },
  { level: 50, xp: 20000, title: 'The Sage' },
  { level: 75, xp: 35000, title: 'The Mastermind' },
  { level: 100, xp: 60000, title: 'The Aura Master' },
];

/**
 * Calculates user level based on total XP
 */
export function calculateLevel(xp: number): number {
  if (xp <= 0) return 1;
  // Dynamic formula: level = 1 + floor(sqrt(xp / 6)) capped at 100
  const lvl = Math.floor(1 + Math.sqrt(xp / 6));
  return Math.min(100, Math.max(1, lvl));
}

/**
 * Returns the earned in-app title corresponding to current level
 */
export function getTitleForLevel(level: number): string {
  let title = 'The Beginner';
  for (const t of LEVEL_THRESHOLDS) {
    if (level >= t.level) {
      title = t.title;
    }
  }
  return title;
}

/**
 * Calculates current level progress percentage and XP required for next level
 */
export function calculateLevelProgress(xp: number): {
  currentLevel: number;
  nextLevel: number;
  title: string;
  progressPercent: number;
  currentLevelBaseXP: number;
  nextLevelXP: number;
  xpToNext: number;
} {
  const currentLevel = calculateLevel(xp);
  const nextLevel = Math.min(100, currentLevel + 1);
  const title = getTitleForLevel(currentLevel);

  // Inverse formula: xp = (level - 1)^2 * 6
  const currentLevelBaseXP = Math.round(Math.pow(currentLevel - 1, 2) * 6);
  const nextLevelXP = currentLevel === 100 ? currentLevelBaseXP : Math.round(Math.pow(currentLevel, 2) * 6);

  const span = Math.max(1, nextLevelXP - currentLevelBaseXP);
  const earnedInLevel = Math.max(0, xp - currentLevelBaseXP);
  const progressPercent = currentLevel === 100 ? 100 : Math.min(100, Math.round((earnedInLevel / span) * 100));
  const xpToNext = Math.max(0, nextLevelXP - xp);

  return {
    currentLevel,
    nextLevel,
    title,
    progressPercent,
    currentLevelBaseXP,
    nextLevelXP,
    xpToNext,
  };
}

/**
 * Pure function to analyze spoken or transcribed text
 */
export function analyzeSpeech(text: string, durationSeconds: number): SpeechAnalysisResult {
  const clean = text.trim();
  if (!clean || durationSeconds <= 0) {
    return {
      durationSeconds: Math.max(1, durationSeconds),
      wordCount: 0,
      wordsPerMinute: 0,
      fillerWordsCount: 0,
      fillerWordsFound: [],
      estimatedPauses: 0,
      pacingFeedback: 'Too short to measure. Speak for at least 15 seconds.',
      structuralClarityScore: 50,
      suggestions: ['Aim for continuous articulation for at least 20-30 seconds.'],
      transcript: text,
    };
  }

  // Tokenize words
  const words = clean.split(/\s+/).filter(Boolean);
  const wordCount = words.length;
  const minutes = durationSeconds / 60;
  const wpm = Math.round(wordCount / minutes);

  // Common filler patterns
  const fillerPatterns = [
    /\bum\b/gi,
    /\buh\b/gi,
    /\ber\b/gi,
    /\bah\b/gi,
    /\blike\b/gi,
    /\bbasically\b/gi,
    /\bactually\b/gi,
    /\bliterally\b/gi,
    /\byou know\b/gi,
    /\bsort of\b/gi,
    /\bkind of\b/gi,
  ];

  const fillerFound: string[] = [];
  let fillerCount = 0;

  for (const regex of fillerPatterns) {
    const matches = clean.match(regex);
    if (matches && matches.length > 0) {
      fillerCount += matches.length;
      fillerFound.push(`${matches[0].toLowerCase()} (${matches.length})`);
    }
  }

  // Pacing evaluation (ideal professional conversational pace: 130 - 160 WPM)
  let pacingFeedback = 'Optimal conversational pace.';
  let pacingScore = 90;
  if (wpm < 100) {
    pacingFeedback = 'Slightly slow delivery. Consider increasing momentum and reducing hesitant pauses.';
    pacingScore = 72;
  } else if (wpm > 175) {
    pacingFeedback = 'Rapid delivery. Practice inserting intentional 1-second pauses after key insights.';
    pacingScore = 75;
  } else if (wpm >= 125 && wpm <= 165) {
    pacingFeedback = 'Commanding and composed pace (125-165 WPM). Excellent audience engagement cadence.';
    pacingScore = 95;
  }

  // Estimate pauses from punctuation (. , ? !)
  const pauseMarks = (clean.match(/[,.;:—?!]/g) || []).length;
  const estimatedPauses = Math.max(1, pauseMarks);

  // Structural clarity estimation
  const hasPremise = /because|since|given that|reason is|firstly|first|initially/i.test(clean);
  const hasExample = /for example|for instance|specifically|such as|consider/i.test(clean);
  const hasConclusion = /therefore|in summary|ultimately|thus|as a result|consequently/i.test(clean);

  let structureBonus = 0;
  if (hasPremise) structureBonus += 10;
  if (hasExample) structureBonus += 10;
  if (hasConclusion) structureBonus += 10;

  const fillerPenalty = Math.min(25, fillerCount * 4);
  const structuralClarityScore = Math.max(30, Math.min(98, pacingScore + structureBonus - fillerPenalty));

  const suggestions: string[] = [];
  if (fillerCount > 2) {
    suggestions.push(`Replace verbal fillers (${fillerFound.slice(0, 2).join(', ')}) with silent breathing pauses.`);
  }
  if (!hasPremise) {
    suggestions.push('Anchor your argument early with a clear thesis statement (e.g. "The primary principle here is...").');
  }
  if (!hasExample) {
    suggestions.push('Support abstract reasoning with a concrete, real-world example or case.');
  }
  if (!hasConclusion) {
    suggestions.push('Finish with an assertive conclusion (e.g., "Ultimately, this leads us to conclude...").');
  }
  if (wpm < 110) {
    suggestions.push('Increase delivery speed slightly to sustain higher audience attention.');
  }

  if (suggestions.length === 0) {
    suggestions.push('Superb articulation! Focus now on vocal dynamics and deliberate modulation.');
  }

  return {
    durationSeconds,
    wordCount,
    wordsPerMinute: wpm,
    fillerWordsCount: fillerCount,
    fillerWordsFound: fillerFound,
    estimatedPauses,
    pacingFeedback,
    structuralClarityScore,
    suggestions,
    transcript: text,
  };
}

/**
 * Validates deduction syllogism
 */
export function validateSyllogism(userChoiceValid: boolean, actualValid: boolean): boolean {
  return userChoiceValid === actualValid;
}

/**
 * Validates number pattern sequence
 */
export function validateNumberSequence(userAnswer: number | string, correctAnswer: number | string): boolean {
  return String(userAnswer).trim().toLowerCase() === String(correctAnswer).trim().toLowerCase();
}

/**
 * Validates Knapsack resource allocation puzzle
 */
export function validateKnapsack(
  selectedIndices: number[],
  maxCapacity: number,
  weights: number[],
  values: number[],
  targetOptimalValue: number
): { isValid: boolean; totalWeight: number; totalValue: number; message: string } {
  let totalWeight = 0;
  let totalValue = 0;

  for (const idx of selectedIndices) {
    if (idx >= 0 && idx < weights.length) {
      totalWeight += weights[idx];
      totalValue += values[idx];
    }
  }

  if (totalWeight > maxCapacity) {
    return {
      isValid: false,
      totalWeight,
      totalValue,
      message: `Capacity exceeded: Total weight is ${totalWeight}kg (Max limit: ${maxCapacity}kg).`,
    };
  }

  const reachedOptimal = totalValue >= targetOptimalValue;
  return {
    isValid: reachedOptimal,
    totalWeight,
    totalValue,
    message: reachedOptimal
      ? `Optimal allocation achieved! Collected value: ${totalValue}.`
      : `Valid allocation within capacity, but optimal value is ${targetOptimalValue} (you achieved ${totalValue}).`,
  };
}

/**
 * Updates streak based on last active date
 */
export function calculateUpdatedStreak(
  currentStreak: number,
  lastActiveDate: string,
  todayDate: string
): { streak: number; streakMaintained: boolean } {
  if (!lastActiveDate) {
    return { streak: 1, streakMaintained: true };
  }
  if (lastActiveDate === todayDate) {
    return { streak: currentStreak, streakMaintained: true };
  }

  const last = new Date(lastActiveDate);
  const today = new Date(todayDate);
  const diffTime = Math.abs(today.getTime() - last.getTime());
  const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 1) {
    return { streak: currentStreak + 1, streakMaintained: true };
  } else if (diffDays > 1) {
    return { streak: 1, streakMaintained: false };
  }
  return { streak: currentStreak, streakMaintained: true };
}

/**
 * Awards XP and attribute points to user profile
 */
export function awardUserXP(
  profile: UserProfile,
  xpGain: number,
  attribute?: AuraAttribute,
  attributePoints = 5
): UserProfile {
  const newXP = profile.xp + xpGain;
  const newLevel = calculateLevel(newXP);

  const updatedAttributes: UserAttributes = { ...profile.attributes };
  if (attribute && updatedAttributes[attribute] !== undefined) {
    updatedAttributes[attribute] = Math.min(100, updatedAttributes[attribute] + attributePoints);
  }

  return {
    ...profile,
    xp: newXP,
    level: newLevel,
    attributes: updatedAttributes,
  };
}

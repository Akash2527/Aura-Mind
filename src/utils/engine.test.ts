import test from 'node:test';
import assert from 'node:assert/strict';
import {
  calculateLevel,
  getTitleForLevel,
  calculateLevelProgress,
  analyzeSpeech,
  validateSyllogism,
  validateKnapsack,
  calculateUpdatedStreak,
  awardUserXP,
} from './engine';
import { UserProfile } from '../types';

test('calculateLevel maps XP to levels correctly', () => {
  assert.equal(calculateLevel(0), 1);
  assert.equal(calculateLevel(500), 10);
  assert.equal(calculateLevel(60000), 100);
  assert.equal(calculateLevel(100000), 100); // capped at 100
});

test('getTitleForLevel returns appropriate in-app prestige titles', () => {
  assert.equal(getTitleForLevel(1), 'The Beginner');
  assert.equal(getTitleForLevel(5), 'The Observer');
  assert.equal(getTitleForLevel(10), 'The Thinker');
  assert.equal(getTitleForLevel(20), 'The Analyst');
  assert.equal(getTitleForLevel(30), 'The Strategist');
  assert.equal(getTitleForLevel(100), 'The Aura Master');
});

test('calculateLevelProgress calculates progress percentage and delta XP', () => {
  const result = calculateLevelProgress(600);
  assert.equal(result.currentLevel, 11);
  assert.ok(result.progressPercent >= 0 && result.progressPercent <= 100);
  assert.ok(result.xpToNext > 0);
});

test('analyzeSpeech detects words per minute, filler words, and structural indicators', () => {
  const sampleTranscript =
    'Basically the reason is that climate dynamics are complex. For example, ocean currents shift temperatures. Therefore we must act with urgency.';
  const analysis = analyzeSpeech(sampleTranscript, 20);

  assert.equal(analysis.wordCount, 21);
  assert.equal(analysis.wordsPerMinute, 63);
  assert.equal(analysis.fillerWordsCount, 1); // 'Basically'
  assert.ok(analysis.structuralClarityScore > 50);
  assert.ok(analysis.suggestions.length > 0);
});

test('validateSyllogism correctly evaluates logical validity choices', () => {
  assert.equal(validateSyllogism(true, true), true);
  assert.equal(validateSyllogism(false, true), false);
  assert.equal(validateSyllogism(false, false), true);
});

test('validateKnapsack validates resource constraints and optimal yields', () => {
  const weights = [2, 3, 4, 5];
  const values = [3, 4, 5, 8];
  const maxCapacity = 7;

  // Indices 1 and 2: weight 3+4=7 <= 7, value 4+5=9
  // Indices 0 and 3: weight 2+5=7 <= 7, value 3+8=11 (Optimal)
  const subOptimal = validateKnapsack([1, 2], maxCapacity, weights, values, 11);
  assert.equal(subOptimal.isValid, false);
  assert.equal(subOptimal.totalWeight, 7);
  assert.equal(subOptimal.totalValue, 9);

  const optimal = validateKnapsack([0, 3], maxCapacity, weights, values, 11);
  assert.equal(optimal.isValid, true);
  assert.equal(optimal.totalWeight, 7);
  assert.equal(optimal.totalValue, 11);

  const overweight = validateKnapsack([2, 3], maxCapacity, weights, values, 11);
  assert.equal(overweight.isValid, false);
  assert.equal(overweight.totalWeight, 9);
});

test('calculateUpdatedStreak manages daily streaks correctly', () => {
  const streak1 = calculateUpdatedStreak(3, '2026-11-11', '2026-11-12');
  assert.equal(streak1.streak, 4);
  assert.equal(streak1.streakMaintained, true);

  const brokenStreak = calculateUpdatedStreak(5, '2026-11-08', '2026-11-12');
  assert.equal(brokenStreak.streak, 1);
  assert.equal(brokenStreak.streakMaintained, false);

  const sameDay = calculateUpdatedStreak(4, '2026-11-12', '2026-11-12');
  assert.equal(sameDay.streak, 4);
});

test('awardUserXP increments XP and boosts specified attribute', () => {
  const mockProfile: UserProfile = {
    id: 'user_1',
    name: 'Alex',
    goal: 'Critical Thinking',
    dailyMinutes: 30,
    difficulty: 'Intermediate',
    primaryContext: 'Leadership',
    selectedProgram: 'foundation_30',
    currentDay: 1,
    level: 1,
    xp: 100,
    streak: 2,
    lastActiveDate: '2026-11-11',
    attributes: {
      LOGIC: 30,
      WISDOM: 25,
      FOCUS: 20,
      EXPRESSION: 35,
      EMPATHY: 40,
      COMPOSURE: 30,
      STRATEGY: 25,
      CREATIVITY: 20,
    },
    unlockedSkills: [],
    achievements: [],
    completedMissions: {},
    onboardingCompleted: true,
  };

  const updated = awardUserXP(mockProfile, 150, 'LOGIC', 10);
  assert.equal(updated.xp, 250);
  assert.equal(updated.attributes.LOGIC, 40);
});

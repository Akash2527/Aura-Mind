import { BossBattle } from '../types';

export const BOSS_BATTLES: BossBattle[] = [
  {
    id: 'boss_week_1',
    week: 1,
    title: 'The Inquisitor of Logic & Composure',
    subtitle: 'Foundation Crucible Assessment',
    scenarioDescription: 'A multi-part simulated gauntlet testing your ability to separate valid deduction from fallacious rhetoric under time pressure.',
    stages: [
      {
        title: 'Stage 1: Deconstruct the Undistributed Middle',
        type: 'logic',
        prompt: 'Premise 1: All innovative tech founders work 70 hours a week.\nPremise 2: Dave works 70 hours a week.\nConclusion: Therefore, Dave is an innovative tech founder.\nIs this argument logically VALID or INVALID?',
        options: ['Valid', 'Invalid'],
        correctIndex: 1,
        explanation: 'Invalid! Undistributed Middle Fallacy. Working 70 hours is a shared trait, not a sufficient condition to make Dave a tech founder.',
      },
      {
        title: 'Stage 2: Spot the Stealth Fallacy',
        type: 'fallacy',
        prompt: '"You claim our server architecture needs load balancing. But didn’t your previous startup go out of business?" Which fallacy is this?',
        options: ['Ad Hominem (Personal Attack)', 'False Equivalence', 'Strawman', 'Appeal to Authority'],
        correctIndex: 0,
        explanation: 'Ad Hominem: Attempting to invalidate a technical architecture claim by attacking past business history.',
      },
      {
        title: 'Stage 3: Executive Composure Under Fire',
        type: 'social',
        prompt: 'In front of the CEO, a senior manager calls your data "flimsy amateur guesswork". What is your immediate response?',
        options: [
          'Say: "I spent three weeks on this, you have no right to insult my work!"',
          'Say calmly: "Let’s calibrate: which specific sample variance in Table 2 contradicts your benchmark?"',
          'Remain silent and look at the floor until the CEO speaks.',
        ],
        correctIndex: 1,
        explanation: 'Calm Socratic inquiry reframes emotional hostility into concrete empirical variables, protecting your composure while exposing whether the critique has substance.',
      },
    ],
    rewardXP: 500,
    badgeUnlock: 'Foundational Sentinel',
  },
  {
    id: 'boss_week_2',
    week: 2,
    title: 'The Architect of Systems & Strategy',
    subtitle: 'Advanced Strategic Synthesis',
    scenarioDescription: 'Navigate a corporate crisis involving contradictory stakeholder incentives, base-rate neglect, and high-stakes negotiation.',
    stages: [
      {
        title: 'Stage 1: Base Rate Neglect in Production Bugs',
        type: 'logic',
        prompt: 'A rare security exploit affects 1 in 10,000 systems. A scanner has a 99% accuracy rate (1% false positive). If a system triggers an alert, is the probability of a real breach >50% or <50%?',
        options: ['< 50% (Base rate is so low that false positives dwarf true positives)', '> 50% (Scanner is 99% accurate)'],
        correctIndex: 0,
        explanation: 'Base rate neglect! In 10,000 systems, 1 is infected (true positive = ~1). 9,999 are clean, producing ~100 false positives (1% of 9999). A positive alert only has ~1 in 101 (~1%) chance of being real!',
      },
      {
        title: 'Stage 2: Nash Equilibrium Negotiation',
        type: 'social',
        prompt: 'A partner threatens to walk away from a joint contract unless granted exclusive IP rights. How do you respond?',
        options: [
          'Cede all IP rights immediately to save the partnership',
          'Explore their underlying fear (e.g. non-compete protection) and offer co-exclusive licensing in disjoint verticals',
          'Retaliate by threatening legal action immediately',
        ],
        correctIndex: 1,
        explanation: 'Principled negotiation separates positions from underlying interests, expanding the pie rather than defaulting to zero-sum surrender or litigation.',
      },
    ],
    rewardXP: 750,
    badgeUnlock: 'Strategic Architect',
  },
];

export interface SpeechPrompt {
  id: string;
  category: 'Impromptu' | 'Persuasive' | 'Explaining Complexity' | 'Debate & Counter-Argument' | 'Leadership & Crisis';
  title: string;
  prompt: string;
  targetDurationSeconds: number;
  keyPointsToCover: string[];
  exemplaryModelOutline: string;
}

export const SPEECH_PROMPTS: Record<string, SpeechPrompt> = {
  prompt_correlation_causation: {
    id: 'prompt_correlation_causation',
    category: 'Explaining Complexity',
    title: 'Explain "Correlation vs. Causation" to a 10-Year-Old',
    prompt: 'Deliver a 60-second explanation illustrating why two things happening together does not mean one caused the other, using a memorable, vivid everyday example.',
    targetDurationSeconds: 60,
    keyPointsToCover: [
      'Define correlation (things happening at the same time)',
      'Use a vivid analogy (e.g. Ice cream sales and sunburns both rising because of summer sun)',
      'Explain the "hidden third factor" (confounding variable)',
      'Conclude with the lesson (always ask: is there a hidden sun?)',
    ],
    exemplaryModelOutline: 'Start with: "Imagine every time you see people eating ice cream, you also see people with sunburns..." Show how summer heat is the real cause, not the ice cream. Conclude cleanly.',
  },

  prompt_complex_simple: {
    id: 'prompt_complex_simple',
    category: 'Explaining Complexity',
    title: 'Explain "Compound Interest" in 45 Seconds',
    prompt: 'Explain the mathematical superpower of compound interest to someone who has never saved money, emphasizing the exponential time factor.',
    targetDurationSeconds: 45,
    keyPointsToCover: [
      'Simple vs Compound interest',
      'The snowball analogy (earning interest on your interest)',
      'The critical ingredient: patience and uninterrupted time',
    ],
    exemplaryModelOutline: 'Think of interest as baby dollars. In year one, your dollars have babies. In year two, the babies have their own babies. Given 20 years, an army of money is working for you.',
  },

  prompt_impromptu_uncertainty: {
    id: 'prompt_impromptu_uncertainty',
    category: 'Impromptu',
    title: 'Impromptu: "Speed vs. Accuracy" in Crisis',
    prompt: 'You are asked without warning in an all-hands meeting: "In an unexpected crisis, should our team prioritize speed or accuracy?" Take a definitive stance and defend it in 60 seconds.',
    targetDurationSeconds: 60,
    keyPointsToCover: [
      'State immediate thesis: Reversible vs Irreversible decisions (Jeff Bezos Type 1 vs Type 2)',
      'Speed for reversible exploratory actions',
      'Extreme accuracy for high-stakes, irreversible commitments',
      'Crisp summary principle',
    ],
    exemplaryModelOutline: 'Lead with: "The answer depends on reversibility. If a door swings both ways, move with aggressive speed. If it is a one-way trapdoor, invest in surgical precision."',
  },

  prompt_persuasive_recommendation: {
    id: 'prompt_persuasive_recommendation',
    category: 'Persuasive',
    title: 'Advocate for a "No Meetings Wednesday" Policy',
    prompt: 'Deliver a 75-second persuasive executive pitch to leadership requesting a company-wide silent focus day every Wednesday.',
    targetDurationSeconds: 75,
    keyPointsToCover: [
      'The business cost of fragmented calendar schedules (context switching)',
      'The quantitative leverage of 4 uninterrupted hours of deep technical work',
      'Proposed risk mitigation: urgent escalation channels remain open',
      'Call to action: a 30-day pilot trial',
    ],
    exemplaryModelOutline: 'Minto Pyramid: "I recommend we institute Focus Wednesdays for a 30-day trial. Fragmented schedules cost us ~30% in lost engineering velocity. Here is how we safeguard urgent client needs while doubling deep output."',
  },

  prompt_defending_boundary: {
    id: 'prompt_defending_boundary',
    category: 'Leadership & Crisis',
    title: 'Decline an Unfunded Last-Minute Request',
    prompt: 'A high-status executive asks you to take on an urgent secondary initiative that would compromise your team\'s primary deliverable. Decline with unwavering composure and strategic partnership.',
    targetDurationSeconds: 60,
    keyPointsToCover: [
      'Acknowledge the strategic value of their goal without false promises',
      'Highlight the direct risk to the company\'s primary committed objective',
      'Offer a concrete alternative or timeline renegotiation',
    ],
    exemplaryModelOutline: '"I completely agree that initiative X is high leverage. However, committing to it this week would compromise our Q3 release scheduled for Friday. Let\'s review next Tuesday so we can resource it properly without risking launch."',
  },

  prompt_strategic_tradeoff: {
    id: 'prompt_strategic_tradeoff',
    category: 'Debate & Counter-Argument',
    title: 'Steelman the Opposite Political/Economic View',
    prompt: 'Pick a controversial policy you personally disagree with. Articulate the strongest, most compassionate and intellectually rigorous version of the opposing argument in 60 seconds.',
    targetDurationSeconds: 60,
    keyPointsToCover: [
      'Zero strawmanning or mockery',
      'Highlight the fundamental moral or economic premise underlying the position',
      'Explain the rationale reasonable, intelligent people use to adopt it',
    ],
    exemplaryModelOutline: 'Demonstrate intellectual humility by starting: "Proponents of this policy operate on a valid core premise: protecting vulnerable stakeholders from systemic shocks..."',
  },

  prompt_crisis_briefing: {
    id: 'prompt_crisis_briefing',
    category: 'Leadership & Crisis',
    title: 'Post-Outage Stakeholder Briefing',
    prompt: 'Your service suffered a 45-minute production outage during peak business hours. Deliver a 90-second briefing to clients taking radical ownership and outlining prevention.',
    targetDurationSeconds: 90,
    keyPointsToCover: [
      'Radical ownership without excuses or blaming vendors',
      'Clear timeline of what occurred and how it was contained',
      'Concrete structural changes implemented to ensure zero recurrence',
    ],
    exemplaryModelOutline: '"At 14:02 UTC, our service went offline for 45 minutes. We take total ownership of this failure. The root cause was a database failover deadlock. Here is our 3-step architectural upgrade already deployed."',
  },
};

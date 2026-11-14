import { LibraryTopic } from '../types';

export const LIBRARY_TOPICS: LibraryTopic[] = [
  {
    id: 'first_principles',
    title: 'First Principles Reasoning',
    category: 'Critical Thinking',
    level: 'Beginner',
    readTime: '4 min',
    summary: 'Boil a problem down to its fundamental, indisputable truths and reason up from there, rather than reasoning by analogy.',
    content: `First-principles thinking (reasoning from fundamental truths rather than convention) originated with Aristotle, who defined a first principle as "the first basis from which a thing is known."

Most human beings reason by analogy: copying what others have done with slight iterations. While energy-efficient, reasoning by analogy fails whenever you confront novel complexity or breakthrough opportunities.

The 3-Step First Principles Protocol:
1. Identify and question your current assumptions ("Batteries cost $600/kWh because that's the market price").
2. Deconstruct the problem into fundamental physical or logical truths ("What are the material components? Nickel, cobalt, lithium, carbon. On the London Metal Exchange, their raw material value is $80/kWh").
3. Synthesize a novel solution from the ground up ("Can we assemble these materials directly into a novel form factor at scale?").`,
    keyTakeaway: 'Reasoning by analogy creates incremental clones; reasoning from first principles creates quantum leaps.',
    workedExample: 'Convention says: "Starting a high-quality podcast requires a $10,000 recording studio." First principles says: "High quality audio requires a cardioid dynamic mic ($80), an acoustic reflection filter ($40), and quiet room boundaries (a closet full of clothes). Total: $120."',
    citations: [
      'Aristotle. Metaphysics, Book IV.',
      'Musk, Elon. "First Principles Method" (Kevin Rose Interview, 2012).',
      'Descartes, René. Meditations on First Philosophy (1641).',
    ],
    quiz: {
      question: 'Which of the following is an example of reasoning from FIRST PRINCIPLES rather than analogy?',
      options: [
        'Calculating the raw atomic materials and manufacturing cost of solar panels from physics',
        'Pricing our software 10% lower than the incumbent market leader',
        'Launching an app because two competitors just launched similar features',
      ],
      correctIndex: 0,
      explanation: 'Deconstructing an item into its raw constituent physics and thermodynamic costs is the definition of first-principles deduction.',
    },
  },

  {
    id: 'second_order_thinking',
    title: 'Second-Order Thinking & Unintended Consequences',
    category: 'Systems Thinking',
    level: 'Intermediate',
    readTime: '5 min',
    summary: 'Evaluate not merely the immediate, obvious result of an action, but the subsequent effects that ripple through the entire ecosystem.',
    content: `First-order thinking is simple, immediate, and practiced by nearly everyone: "I am hungry, so I will eat this box of donuts."

Second-order thinking asks: "And then what?"
Third-order thinking asks: "And then what happens after that?"

First-order effects often have the opposite sign of higher-order effects:
- Eating sugar feels great in minute 5 (Positive first-order), but causes an energy crash at hour 2 and chronic inflammation across decade 1 (Negative second/third-order).
- Strenuous weightlifting is painful in minute 10 (Negative first-order), but builds cellular density and metabolic resilience across years (Positive higher-order).

In systems dynamics, the "Cobra Effect" illustrates failure of second-order thinking: British colonial authorities in Delhi offered a bounty for dead cobras to reduce venomous snakes. Citizens began breeding cobras in secret to collect bounties. When the bounty was cancelled, breeders released the worthless snakes, multiplying the cobra population.`,
    keyTakeaway: 'Always ask: "And then what?" and "What will people do to game this rule?" before instituting any policy.',
    workedExample: 'Policy: Zero tolerance for production bugs by punishing the engineer who commits them. First-order: Developers become careful. Second-order: Developers stop shipping updates, conceal minor anomalies, and code velocity drops to zero.',
    citations: [
      'Howard Marks. The Most Important Thing: Uncommon Sense for the Thoughtful Investor (Columbia Business Press, 2011).',
      'Meadows, Donella. Thinking in Systems: A Primer (Chelsea Green, 2008).',
      'Hardin, Garrett. The Tragedy of the Commons (Science, 1968).',
    ],
    quiz: {
      question: 'What is the "Cobra Effect" a classic historical demonstration of?',
      options: [
        'Perverse incentives arising from failure of second-order thinking',
        'A formal syllogistic fallacy in propositional calculus',
        'The benefit of financial bounties in regulatory governance',
      ],
      correctIndex: 0,
      explanation: 'The Cobra Effect shows how simplistic first-order policies incentivize counter-productive behavior that worsens the original problem.',
    },
  },

  {
    id: 'kahneman_heuristics',
    title: 'System 1 vs. System 2 Cognitive Architecture',
    category: 'Cognitive Psychology',
    level: 'Intermediate',
    readTime: '6 min',
    summary: 'Understand the dual-process model of mind: the fast, automatic, emotional System 1 versus the slow, deliberate, logical System 2.',
    content: `Nobel laureate Daniel Kahneman and Amos Tversky revolutionized psychology by establishing the Dual-Process Theory of cognition:

System 1 (Fast Thinking):
- Operates automatically and quickly, with little or no effort and no sense of voluntary control.
- Examples: Detecting that one object is farther than another; orienting to a loud noise; reading words on large billboards; detecting hostility in a tone of voice.
- Strength: Rapid pattern recognition vital for evolutionary survival.
- Weakness: Vulnerable to systemic cognitive illusions (anchoring, availability bias, base-rate neglect).

System 2 (Slow Thinking):
- Allocates attention to effortful mental operations, including complex computations, logical validity checks, and sustained concentration.
- Examples: Bracing for the starter gun in a race; parking in a tight space; comparing two washing machines for overall value; checking the validity of a complex syllogism.
- Strength: Rigorous, algorithmic, and capable of overriding intuition.
- Weakness: Lazy, metabolically expensive, and easily exhausted (ego depletion).`,
    keyTakeaway: 'Mastery is not eliminating System 1; it is training yourself to recognize situations where System 1 is prone to catastrophic error and deliberately activating System 2.',
    workedExample: 'A bat and ball cost $1.10 in total. The bat costs $1.00 more than the ball. How much does the ball cost? System 1 shouts: "10 cents!" (Wrong: 1.00 + 0.10 = 1.10, difference is 0.90). System 2 computes: Ball = x, Bat = x + 1.00. 2x + 1.00 = 1.10 -> 2x = 0.10 -> x = 5 cents.',
    citations: [
      'Kahneman, Daniel. Thinking, Fast and Slow (Farrar, Straus and Giroux, 2011).',
      'Tversky, Amos, & Kahneman, Daniel. Judgment under Uncertainty: Heuristics and Biases (Science, 1974).',
      'Stanovich, Keith E., & West, Richard F. Individual Differences in Reasoning (Behavioral and Brain Sciences, 2000).',
    ],
    quiz: {
      question: 'Which cognitive system is responsible for calculating 17 × 24 in your head?',
      options: [
        'System 2: Slow, deliberate, conscious, and resource-intensive',
        'System 1: Fast, automatic, and intuitive',
        'The Default Mode Network without conscious engagement',
      ],
      correctIndex: 0,
      explanation: 'Complex multi-step mental arithmetic requires deliberate attention and working memory allocation handled by System 2.',
    },
  },

  {
    id: 'aristotle_rhetoric',
    title: 'The Rhetorical Triangle: Ethos, Pathos, Logos',
    category: 'Rhetoric & Communication',
    level: 'Beginner',
    readTime: '5 min',
    summary: 'Master Aristotle’s timeless triad for compelling human communication and persuasive presence.',
    content: `In 350 BCE, Aristotle wrote "Rhetoric", identifying the three foundational modes of persuasion:

1. Ethos (Character & Credibility):
- Why should the audience trust you? Established through integrity, competence, composure, transparent motives, and authentic track record.
- If ethos is missing, listeners discount even flawless logic as self-serving propaganda.

2. Logos (Reason & Evidence):
- The internal consistency and empirical validity of your argument.
- Syllogisms, data, causal chains, trade-off analysis, and clear definitions.
- If logos is missing, the speech feels like empty, manipulative hype.

3. Pathos (Emotional Resonance & Shared Values):
- Connecting your logical conclusion to what the audience cares about deeply: their security, aspirational identity, fear of regret, or collective mission.
- If pathos is missing, the audience agrees intellectually but remains paralyzed without motivation to act.`,
    keyTakeaway: 'Without Ethos you are dismissed; without Logos you are unsubstantiated; without Pathos you are ignored.',
    workedExample: 'A doctor recommending a lifestyle shift: Ethos (board-certified physician with 15 years clinical practice), Logos (showing cardiovascular biomarkers and clinical trial survival statistics), Pathos (describing being able to run and play with their grandchildren at age 70).',
    citations: [
      'Aristotle. Rhetoric (translated by W. Rhys Roberts).',
      'Cicero, Marcus Tullius. De Oratore (55 BCE).',
      'Heinrichs, Jay. Thank You for Arguing (Crown, 2017).',
    ],
    quiz: {
      question: 'If a speaker presents flawless statistical data but the audience distrusts their personal motives, which rhetorical pillar is compromised?',
      options: [
        'Ethos (Credibility and moral character)',
        'Logos (Logical structure)',
        'Pathos (Emotional storytelling)',
      ],
      correctIndex: 0,
      explanation: 'Ethos represents the audience\'s appraisal of the speaker\'s character, honesty, and competence.',
    },
  },

  {
    id: 'stoic_composure',
    title: 'The Dichotomy of Control & Composure Under Fire',
    category: 'Emotional Intelligence',
    level: 'Beginner',
    readTime: '5 min',
    summary: 'Divide reality cleanly into what is within your voluntary control and what is not, directing 100% of energy strictly to the former.',
    content: `Epictetus begins the Enchiridion with a sentence that forms the bedrock of emotional composure:
"Some things are within our power, while others are not."

Within our power:
- Our opinions, our impulses, our desires, our aversions, our speech, and our deliberate choices.

Not within our power:
- The weather, the stock market, the opinions of other people, traffic, macroeconomic downturns, and the past.

Whenever you experience anxiety, anger, or despair, examine the trigger:
Are you attempting to control something fundamentally external to your will?
When someone insults you:
- Their utterance is external (uncontrollable).
- Your decision to take offense or treat it with clinical detachment is internal (controllable).

Marcus Aurelius: "You have power over your mind—not outside events. Realize this, and you will find strength."`,
    keyTakeaway: 'Never invest your self-worth in variables you cannot unilaterally control.',
    workedExample: 'Interview rejection: Uncontrollable: The interviewer\'s personal mood, internal company politics, rival candidates. Controllable: Your preparation, the precision of your answers, your composure, and the lessons you extract for the next attempt.',
    citations: [
      'Epictetus. Discourses and Enchiridion (108 CE).',
      'Marcus Aurelius. Meditations (180 CE).',
      'Hadot, Pierre. The Inner Citadel: The Meditations of Marcus Aurelius (Harvard University Press, 1998).',
    ],
    quiz: {
      question: 'According to the Stoic dichotomy of control, which of the following is strictly WITHIN your power?',
      options: [
        'Your internal interpretation of another person’s feedback and your chosen response',
        'Whether your teammate agrees with your proposed project architecture',
        'The macroeconomic market interest rate',
      ],
      correctIndex: 0,
      explanation: 'Your own cognitive appraisal, emotional regulation, and voluntary actions are within your control; external outcomes and other people\'s reactions are not.',
    },
  },
];

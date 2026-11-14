import express from 'express';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config();

const app = express();
const args = process.argv.slice(2);
const portIndex = args.indexOf('--port');
const cliPort = portIndex !== -1 && args[portIndex + 1] ? Number(args[portIndex + 1]) : null;
const PORT = cliPort || (process.env.NODE_ENV === 'production' ? (Number(process.env.PORT) || 3000) : 3000);

app.use(express.json());

// Check if Gemini API key is valid (not empty and not placeholder)
const rawKey = process.env.GEMINI_API_KEY?.trim();
const hasRealKey = Boolean(rawKey && rawKey !== 'MY_GEMINI_API_KEY' && !rawKey.startsWith('MY_'));

let ai: GoogleGenAI | null = null;
if (hasRealKey && rawKey) {
  try {
    ai = new GoogleGenAI({
      apiKey: rawKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  } catch (err) {
    console.warn('Warning: Failed to initialize GoogleGenAI with key', err);
  }
}

// Helper with timeout
function withTimeout<T>(promise: Promise<T>, ms = 3500): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) =>
      setTimeout(() => reject(new Error('AI request timeout')), ms)
    ),
  ]);
}

// Socratic AI Mentor endpoint
app.post('/api/mentor', async (req, res) => {
  const { personaId, personaName, personaStyle, messages, userMessage } = req.body;

  if (!userMessage) {
    return res.status(400).json({ error: 'userMessage is required' });
  }

  // If Gemini API is available, generate real AI response with timeout
  if (ai) {
    try {
      const systemInstruction = `You are ${personaName}, a dedicated Socratic cognitive mentor in the Aura Mind personal development app.
Your style: ${personaStyle}.
Rules:
1. Embody the Socratic method: Never give flat answers or unsolicited praise.
2. Probe unexamined assumptions, ask piercing questions, offer a strong counterargument or alternative lens.
3. Keep responses punchy and thought-provoking (under 120 words).
4. Point out potential cognitive biases (e.g. confirmation bias, black-and-white thinking, sunk cost fallacy) if relevant.
5. Foster intellectual humility, composure, and analytical precision.`;

      const contents = messages && messages.length > 0
        ? messages.map((m: { sender: string; text: string }) => ({
            role: m.sender === 'user' ? 'user' : 'model',
            parts: [{ text: m.text }],
          })).concat([{ role: 'user', parts: [{ text: userMessage }] }])
        : [{ role: 'user', parts: [{ text: userMessage }] }];

      const response = await withTimeout(
        ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents,
          config: {
            systemInstruction,
          },
        }),
        3500
      );

      const replyText = response.text || 'What evidence led you to that conclusion? Consider what would follow if your premise were false.';
      return res.json({ reply: replyText });
    } catch (apiError: unknown) {
      console.warn('Gemini API call timed out or failed, using heuristic Socratic engine:', apiError);
    }
  }

  // Socratic heuristic engine (deterministic, instant response)
  const lower = userMessage.toLowerCase();
  let fallbackReply = `What specific evidence or observations form the foundation of that view? If an opponent argued the exact reverse, what would be their strongest point?`;

  if (personaId === 'philosopher') {
    if (lower.includes('early') || lower.includes('wake') || lower.includes('morning')) {
      fallbackReply = `What evidence demonstrates that waking early causes success, rather than merely correlating with work hours? Could a night-owl novelist or programmer achieve equal or greater creative output?`;
    } else if (lower.includes('success') || lower.includes('goal')) {
      fallbackReply = `How do you define "success" here? Is your definition based on internal tranquility and mastery, or on external approval that lies beyond your sphere of control?`;
    } else if (lower.includes('true') || lower.includes('believe')) {
      fallbackReply = `You assert this with certainty. What empirical test could we construct that would definitively prove your assertion false?`;
    } else {
      fallbackReply = `Let us dissect the primary premise in what you just said. Which term are we taking for granted without rigorous definition?`;
    }
  } else if (personaId === 'strategist') {
    if (lower.includes('compete') || lower.includes('win') || lower.includes('work')) {
      fallbackReply = `What is the counterparty's dominant incentive in this setup? To know the terrain, you must know what your opponent cannot afford to lose. Where is your asymmetric leverage?`;
    } else {
      fallbackReply = `And then what happens? What are the second-order consequences of that move after the initial reaction plays out?`;
    }
  } else if (personaId === 'scientist') {
    fallbackReply = `What is the base rate of that phenomenon in the wider population? Could this observation be explained by confirmation bias or a confounding variable?`;
  } else if (personaId === 'coach') {
    fallbackReply = `Can you restate that core point in a single sentence using the Pyramid Principle? Lead with the decisive conclusion first, followed by your two strongest pillars of evidence.`;
  } else if (personaId === 'leader') {
    fallbackReply = `Notice the emotional charge in that statement. Ask yourself: does this circumstance reside within your voluntary sphere of influence, or is your peace of mind hostage to an external event?`;
  }

  return res.json({ reply: fallbackReply });
});

// Communication Speech AI Feedback endpoint
app.post('/api/speech-feedback', async (req, res) => {
  const { transcript, promptTitle, durationSeconds } = req.body;

  if (!transcript) {
    return res.status(400).json({ error: 'transcript is required' });
  }

  if (ai) {
    try {
      const response = await withTimeout(
        ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: `Analyze this spoken practice transcript for prompt "${promptTitle}". Spoken duration: ${durationSeconds}s.
Transcript: "${transcript}"
Provide a JSON object with:
- "strengths": array of 2 short strengths
- "weaknesses": array of 2 concise areas of improvement
- "aiCoachInsight": a 2-sentence actionable coaching recommendation on vocal presence, structure, or clarity.`,
          config: {
            responseMimeType: 'application/json',
          },
        }),
        3500
      );

      const parsed = JSON.parse(response.text || '{}');
      return res.json(parsed);
    } catch (e) {
      console.warn('Speech feedback Gemini call timed out or failed, using heuristic feedback:', e);
    }
  }

  // Fallback high-quality coaching feedback
  return res.json({
    strengths: [
      'Clear topical engagement with the core prompt thesis.',
      'Maintained consistent progression of thought throughout the delivery.',
    ],
    weaknesses: [
      'Incorporate more deliberate 1-second silence pauses before transitional points.',
      'Ground abstract logic with one concrete, visceral example.',
    ],
    aiCoachInsight:
      'Structure your response using the Minto Pyramid: state your headline conclusion within the first 10 seconds, then anchor two supporting pillars with zero verbal filler words.',
  });
});

async function startServer() {
  const isProduction = process.env.NODE_ENV === 'production';

  if (!isProduction) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Aura Mind server running at http://0.0.0.0:${PORT}`);
  });
}

startServer();

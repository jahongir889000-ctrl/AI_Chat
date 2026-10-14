import 'dotenv/config';
import cors from 'cors';
import express from 'express';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { buildSystemInstruction, getMedCenterPhone } from './agentPrompt.js';
import { getModelFallbackChain, resolveGeminiModelId } from './geminiModels.js';
import { getLocalAgentReply } from './localAgent.js';

const PORT = Number(process.env.PORT) || 3001;
const GEMINI_MODEL = resolveGeminiModelId(process.env.GEMINI_MODEL);
const MAX_RETRIES = 2;

const SYSTEM_INSTRUCTION = buildSystemInstruction(getMedCenterPhone());

function getGenAI() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY is not configured');
  }
  return new GoogleGenerativeAI(apiKey);
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * @param {{ role: 'user' | 'model'; text: string }[]} messages
 */
function toGeminiHistory(messages) {
  return messages.map((m) => ({
    role: m.role,
    parts: [{ text: m.text }],
  }));
}

/** Gemini: история должна начинаться с role user (приветствие UI не передаём). */
function prepareGeminiHistory(messages) {
  const trimmed = [...messages];
  while (trimmed.length > 0 && trimmed[0].role === 'model') {
    trimmed.shift();
  }
  return trimmed;
}

function isQuotaExhausted(err) {
  const msg = err?.message ?? '';
  return (
    err?.status === 429 ||
    msg.includes('quota') ||
    msg.includes('Quota exceeded') ||
    msg.includes('Too Many Requests')
  );
}

async function requestGeminiReply(history, userText) {
  const genAI = getGenAI();
  const modelChain = getModelFallbackChain(process.env.GEMINI_MODEL);
  let lastError;

  for (const modelId of modelChain) {
    for (let attempt = 0; attempt < MAX_RETRIES; attempt += 1) {
      try {
        const model = genAI.getGenerativeModel({
          model: modelId,
          systemInstruction: SYSTEM_INSTRUCTION,
        });
        const chat = model.startChat({ history });
        const result = await chat.sendMessage(userText);
        const text = result.response.text();
        if (text?.trim()) {
          if (modelId !== GEMINI_MODEL) {
            console.log(`[api/chat] used fallback model: ${modelId}`);
          }
          return text;
        }
        throw Object.assign(new Error('empty model response'), { status: 502 });
      } catch (err) {
        lastError = err;
        const status = err?.status;

        if (isQuotaExhausted(err)) {
          console.warn(`[api/chat] quota exhausted on ${modelId}, local agent`);
          return getLocalAgentReply(userText);
        }

        if (status === 503 && attempt < MAX_RETRIES - 1) {
          await sleep(600 * (attempt + 1));
          continue;
        }

        if (status === 404 || status === 400) {
          console.warn(`[api/chat] model ${modelId} unavailable (${status}), trying next`);
          break;
        }

        if (status === 503) {
          console.warn(`[api/chat] model ${modelId} overloaded, trying next`);
          break;
        }

        throw err;
      }
    }
  }

  console.warn('[api/chat] Gemini unavailable, using local medical catalog');
  if (lastError) {
    console.warn('[api/chat]', lastError.message?.slice?.(0, 180) ?? lastError);
  }
  return getLocalAgentReply(userText);
}

function mapErrorToMessage(err) {
  if (!(err instanceof Error)) {
    return 'Не удалось получить ответ от модели. Попробуйте позже.';
  }
  if (err.message === 'GEMINI_API_KEY is not configured') {
    return 'Сервер не настроен: укажите GEMINI_API_KEY в .env';
  }
  if (err.status === 503 || err.status === 429 || err.message.includes('503')) {
    return 'Сервис Gemini перегружен. Подождите 10–20 секунд и отправьте сообщение снова.';
  }
  if (err.status === 400 || err.message.includes('400 Bad Request')) {
    return `Некорректная модель в GEMINI_MODEL. Используйте id вида gemini-3.1-flash-lite (сейчас в .env: «${process.env.GEMINI_MODEL ?? ''}»).`;
  }
  if (err.message.includes('404 Not Found') && err.message.includes('models/')) {
    return `Модель недоступна. Укажите в .env GEMINI_MODEL=gemini-3.1-flash-lite`;
  }
  if (err.message.includes('API key not valid') || err.message.includes('API_KEY_INVALID')) {
    return 'Неверный GEMINI_API_KEY. Создайте ключ в Google AI Studio (обычно начинается с AIza).';
  }
  return 'Не удалось получить ответ от модели. Попробуйте позже.';
}

const app = express();
app.use(cors({ origin: true }));
app.use(express.json({ limit: '256kb' }));

app.get('/api/health', (_req, res) => {
  const key = process.env.GEMINI_API_KEY ?? '';
  res.json({
    ok: true,
    gemini: Boolean(key),
    model: GEMINI_MODEL,
    modelRaw: process.env.GEMINI_MODEL ?? null,
    keyFormatHint: key.startsWith('AIza')
      ? 'ok'
      : 'Ожидается ключ Google AI Studio (AIza...). Проверьте GEMINI_API_KEY.',
  });
});

app.post('/api/chat', async (req, res) => {
  try {
    const { messages } = req.body ?? {};

    if (!Array.isArray(messages) || messages.length === 0) {
      res.status(400).json({ error: 'messages must be a non-empty array' });
      return;
    }

    const normalized = messages
      .filter((m) => m && typeof m.text === 'string' && m.text.trim())
      .map((m) => ({
        role: m.role === 'user' ? 'user' : 'model',
        text: m.text.trim(),
      }));

    if (normalized.length === 0) {
      res.status(400).json({ error: 'no valid messages' });
      return;
    }

    const last = normalized[normalized.length - 1];
    if (last.role !== 'user') {
      res.status(400).json({ error: 'last message must be from user' });
      return;
    }

    const history = toGeminiHistory(
      prepareGeminiHistory(normalized.slice(0, -1)),
    );
    const reply = await requestGeminiReply(history, last.text);

    if (!reply?.trim()) {
      res.status(502).json({ error: 'empty model response' });
      return;
    }

    res.json({ reply: reply.trim() });
  } catch (err) {
    console.error('[api/chat]', err);
    res.status(500).json({ error: mapErrorToMessage(err) });
  }
});

app.listen(PORT, () => {
  console.log(`API http://localhost:${PORT} (Gemini: ${GEMINI_MODEL})`);
});

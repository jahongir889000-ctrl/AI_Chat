const DEFAULT_MODEL = 'gemini-3.1-flash-lite';

const ALIASES = {
  'gemini 3.1 flash lite': 'gemini-3.1-flash-lite',
  'gemini 3.8 flash': 'gemini-3.8-flash',
  'gemini 2.5 flash': 'gemini-2.5-flash',
  'gemini 2.5 flash lite': 'gemini-2.5-flash-lite',
  'gemini 2.0 flash': 'gemini-2.0-flash',
  'gemini flash latest': 'gemini-flash-latest',
};

/** @param {string | undefined} raw */
export function resolveGeminiModelId(raw) {
  const trimmed = (raw ?? '').trim();
  if (!trimmed) return DEFAULT_MODEL;
  if (/^gemini-[\w.-]+$/i.test(trimmed)) return trimmed.toLowerCase();
  const alias = ALIASES[trimmed.toLowerCase()];
  if (alias) return alias;
  const slug = trimmed
    .toLowerCase()
    .replace(/^gemini\s+/i, 'gemini-')
    .replace(/\s+/g, '-');
  if (/^gemini-[\w.-]+$/.test(slug)) return slug;
  return DEFAULT_MODEL;
}

/** @param {string} primary */
export function getModelFallbackChain(primary) {
  const chain = [
    resolveGeminiModelId(primary),
    'gemini-3.1-flash-lite',
    'gemini-flash-latest',
  ];
  return [...new Set(chain)];
}

/**
 * @param {{ role: 'user' | 'agent'; text: string }[]} messages
 * @returns {Promise<string>}
 */
export async function fetchAgentReply(messages) {
  const payload = messages.map((m) => ({
    role: m.role === 'user' ? 'user' : 'model',
    text: m.text,
  }));

  const res = await fetch('/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ messages: payload }),
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    const msg =
      typeof data.error === 'string'
        ? data.error
        : 'Ошибка при обращении к серверу. Проверьте, что backend запущен.';
    throw new Error(msg);
  }

  if (!data.reply || typeof data.reply !== 'string') {
    throw new Error('Некорректный ответ сервера');
  }

  return data.reply;
}

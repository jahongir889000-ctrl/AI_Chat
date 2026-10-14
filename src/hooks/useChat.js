import { useCallback, useRef, useState } from 'react';
import { fetchAgentReply } from '../api/chatAgent.js';
import { USE_MOCKS } from '../config.js';
import { mockAgent } from '../mocks/agent.js';
import { getMockAgentReply } from '../mocks/chatResponses.js';

function createId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

/**
 * @param {{ role: 'user' | 'agent'; text: string }} partial
 */
function makeMessage(partial) {
  return {
    id: createId(),
    role: partial.role,
    text: partial.text,
    createdAt: new Date().toISOString(),
  };
}

export function useChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const welcomeShownRef = useRef(false);

  const openChat = useCallback(() => {
    setIsOpen(true);
    if (!welcomeShownRef.current) {
      welcomeShownRef.current = true;
      setMessages((prev) => [
        ...prev,
        makeMessage({ role: 'agent', text: mockAgent.welcomeMessage }),
      ]);
    }
  }, []);

  const closeChat = useCallback(() => {
    setIsOpen(false);
  }, []);

  const sendMessage = useCallback(
    async (text) => {
      const trimmed = text.trim();
      if (!trimmed || isTyping) return;

      const userMsg = makeMessage({ role: 'user', text: trimmed });
      const historyForApi = [...messages, userMsg];

      setMessages((prev) => [...prev, userMsg]);
      setIsTyping(true);

      try {
        let replyText;
        if (USE_MOCKS) {
          replyText = await getMockAgentReply(trimmed);
        } else {
          replyText = await fetchAgentReply(historyForApi);
        }
        setMessages((prev) => [...prev, makeMessage({ role: 'agent', text: replyText })]);
      } catch (err) {
        const fallback =
          err instanceof Error
            ? err.message
            : 'Не удалось отправить сообщение. Попробуйте ещё раз.';
        setMessages((prev) => [
          ...prev,
          makeMessage({
            role: 'agent',
            text: fallback,
          }),
        ]);
      } finally {
        setIsTyping(false);
      }
    },
    [isTyping, messages],
  );

  return {
    isOpen,
    openChat,
    closeChat,
    messages,
    isTyping,
    sendMessage,
    agent: mockAgent,
  };
}

import { useCallback, useRef, useState } from 'react';
import { mockAgent } from '../mocks/agent.js';
import { USE_MOCKS, getMockAgentReply } from '../mocks/chatResponses.js';

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

  const sendMessage = useCallback(async (text) => {
    const trimmed = text.trim();
    if (!trimmed || isTyping) return;

    setMessages((prev) => [...prev, makeMessage({ role: 'user', text: trimmed })]);
    setIsTyping(true);

    try {
      let replyText;
      if (USE_MOCKS) {
        replyText = await getMockAgentReply(trimmed);
      } else {
        replyText = await getMockAgentReply(trimmed);
      }
      setMessages((prev) => [...prev, makeMessage({ role: 'agent', text: replyText })]);
    } finally {
      setIsTyping(false);
    }
  }, [isTyping]);

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

import { useEffect, useRef } from 'react';
import { ChatBackground3D } from './ChatBackground3D.jsx';
import { MessageBubble } from './MessageBubble.jsx';
import { TypingIndicator } from './TypingIndicator.jsx';
import styles from './MessageList.module.css';

export function MessageList({ messages, isTyping, agentName }) {
  const endRef = useRef(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  return (
    <div className={styles.wrap}>
      <ChatBackground3D />
      <div className={styles.list} role="log" aria-relevant="additions">
        {messages.map((msg) => (
          <MessageBubble key={msg.id} message={msg} />
        ))}
        {isTyping && <TypingIndicator agentName={agentName} />}
        <div ref={endRef} className={styles.anchor} />
      </div>
    </div>
  );
}

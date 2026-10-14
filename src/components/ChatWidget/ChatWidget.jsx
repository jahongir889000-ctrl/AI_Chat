import { ChatHeader } from '../ChatHeader.jsx';
import { ChatInput } from '../ChatInput.jsx';
import { ChatLauncher } from '../ChatLauncher.jsx';
import { MessageList } from '../MessageList.jsx';
import { useChat } from '../../hooks/useChat.js';
import { useTheme } from '../../hooks/useTheme.js';
import styles from './ChatWidget.module.css';

export function ChatWidget() {
  const { theme, toggleTheme } = useTheme();
  const {
    isOpen,
    openChat,
    closeChat,
    messages,
    isTyping,
    sendMessage,
    agent,
  } = useChat();

  return (
    <div className={styles.root}>
      {isOpen && (
        <>
          <button
            type="button"
            className={styles.backdrop}
            aria-label="Закрыть чат"
            onClick={closeChat}
          />
          <div className={styles.panel} role="dialog" aria-label="Чат с ассистентом">
            <ChatHeader
              agent={agent}
              theme={theme}
              onToggleTheme={toggleTheme}
              onClose={closeChat}
            />
            <MessageList
              messages={messages}
              isTyping={isTyping}
              agentName={agent.name}
            />
            <ChatInput onSend={sendMessage} disabled={isTyping} />
          </div>
        </>
      )}
      <ChatLauncher onClick={openChat} isOpen={isOpen} />
    </div>
  );
}

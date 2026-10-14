import styles from './MessageBubble.module.css';

function formatTime(iso) {
  try {
    return new Date(iso).toLocaleTimeString('ru-RU', {
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return '';
  }
}

export function MessageBubble({ message }) {
  const isUser = message.role === 'user';

  return (
    <div className={styles.row} data-role={message.role}>
      <div className={styles.bubble}>
        <p className={styles.text}>{message.text}</p>
        <time className={styles.time} dateTime={message.createdAt}>
          {formatTime(message.createdAt)}
        </time>
      </div>
    </div>
  );
}

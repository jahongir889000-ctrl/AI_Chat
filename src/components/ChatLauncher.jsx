import { IconAgentAvatar } from './icons.jsx';
import styles from './ChatLauncher.module.css';

export function ChatLauncher({ onClick, isOpen }) {
  if (isOpen) return null;

  return (
    <button
      type="button"
      className={styles.launcher}
      onClick={onClick}
      aria-label="Открыть чат"
    >
      <span className={styles.avatar} aria-hidden="true">
        <IconAgentAvatar />
      </span>
    </button>
  );
}

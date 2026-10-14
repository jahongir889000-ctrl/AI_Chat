import { IconClose, IconMoon, IconSun } from './icons.jsx';
import styles from './ChatHeader.module.css';

export function ChatHeader({ agent, theme, onToggleTheme, onClose }) {
  const isOnline = agent.status === 'online';

  return (
    <header className={styles.header}>
      <div className={styles.info}>
        <div className={styles.avatar} aria-hidden="true">{agent.initials}</div>
        <div className={styles.meta}>
          <span className={styles.name}>{agent.name}</span>
          <span className={styles.status}>
            <span className={styles.dot} data-online={isOnline} />
            {isOnline ? 'Онлайн' : 'Офлайн'}
          </span>
        </div>
      </div>
      <div className={styles.actions}>
        <button
          type="button"
          className={styles.iconBtn}
          onClick={onToggleTheme}
          aria-label={theme === 'light' ? 'Тёмная тема' : 'Светлая тема'}
        >
          {theme === 'light' ? <IconMoon /> : <IconSun />}
        </button>
        <button
          type="button"
          className={styles.iconBtn}
          onClick={onClose}
          aria-label="Закрыть чат"
        >
          <IconClose />
        </button>
      </div>
    </header>
  );
}

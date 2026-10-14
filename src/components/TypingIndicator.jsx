import styles from './TypingIndicator.module.css';

export function TypingIndicator({ agentName }) {
  return (
    <div className={styles.wrap} aria-live="polite" aria-label={`${agentName} печатает`}>
      <div className={styles.bubble}>
        <span className={styles.dots}>
          <span />
          <span />
          <span />
        </span>
        <span className={styles.label}>печатает…</span>
      </div>
    </div>
  );
}

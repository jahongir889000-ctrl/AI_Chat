import { useState } from 'react';
import { IconSend } from './icons.jsx';
import styles from './ChatInput.module.css';

export function ChatInput({ onSend, disabled }) {
  const [value, setValue] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!value.trim() || disabled) return;
    onSend(value);
    setValue('');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <textarea
        className={styles.input}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Напишите сообщение…"
        rows={1}
        disabled={disabled}
        aria-label="Сообщение"
      />
      <button
        type="submit"
        className={styles.send}
        disabled={disabled || !value.trim()}
        aria-label="Отправить"
      >
        <IconSend />
      </button>
    </form>
  );
}

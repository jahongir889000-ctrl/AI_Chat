import { useCallback, useState } from 'react';
import { useSpeechInput } from '../hooks/useSpeechInput.js';
import { IconMic, IconSend } from './icons.jsx';
import styles from './ChatInput.module.css';

export function ChatInput({ onSend, disabled }) {
  const [value, setValue] = useState('');
  const [voiceDraft, setVoiceDraft] = useState('');

  const handleTranscript = useCallback((text, isFinal) => {
    if (isFinal) {
      setVoiceDraft('');
      setValue((prev) => {
        const base = prev.trim();
        return base ? `${base} ${text}` : text;
      });
      return;
    }
    setVoiceDraft(text);
  }, []);

  const { supported, listening, error, toggle } = useSpeechInput({
    onTranscript: handleTranscript,
    disabled,
  });

  const displayValue = listening && voiceDraft
    ? [value.trim(), voiceDraft].filter(Boolean).join(' ')
    : value;

  const handleSubmit = (e) => {
    e.preventDefault();
    const text = displayValue.trim();
    if (!text || disabled) return;
    onSend(text);
    setValue('');
    setVoiceDraft('');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <div className={styles.composer} data-listening={listening ? 'true' : 'false'}>
        <textarea
          className={styles.input}
          value={displayValue}
          onChange={(e) => {
            setVoiceDraft('');
            setValue(e.target.value);
          }}
          onKeyDown={handleKeyDown}
          placeholder={listening ? 'Говорите…' : 'Напишите сообщение…'}
          rows={1}
          disabled={disabled}
          aria-label="Сообщение"
        />
        <div className={styles.actions}>
          {supported && (
            <button
              type="button"
              className={styles.mic}
              data-listening={listening ? 'true' : 'false'}
              onClick={toggle}
              disabled={disabled}
              aria-pressed={listening}
              aria-label={listening ? 'Остановить запись' : 'Голосовой ввод'}
              title={listening ? 'Остановить запись' : 'Голосовой ввод'}
            >
              <IconMic />
            </button>
          )}
          <button
            type="submit"
            className={styles.send}
            disabled={disabled || !displayValue.trim()}
            aria-label="Отправить"
          >
            <IconSend />
          </button>
        </div>
      </div>
      {listening && (
        <p className={styles.status} role="status">
          Слушаю голос…
        </p>
      )}
      {error && !listening && (
        <p className={styles.hint} role="status">
          {error}
        </p>
      )}
    </form>
  );
}

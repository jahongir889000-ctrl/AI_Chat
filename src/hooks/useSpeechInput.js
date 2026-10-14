import { useCallback, useEffect, useRef, useState } from 'react';

function getSpeechRecognitionCtor() {
  if (typeof window === 'undefined') return null;
  return window.SpeechRecognition || window.webkitSpeechRecognition || null;
}

export function useSpeechInput({ onTranscript, disabled }) {
  const [supported, setSupported] = useState(false);
  const [listening, setListening] = useState(false);
  const [error, setError] = useState(null);
  const recognitionRef = useRef(null);
  const onTranscriptRef = useRef(onTranscript);
  const stopRequestedRef = useRef(false);

  useEffect(() => {
    onTranscriptRef.current = onTranscript;
  }, [onTranscript]);

  useEffect(() => {
    setSupported(Boolean(getSpeechRecognitionCtor()));
  }, []);

  const stop = useCallback(() => {
    stopRequestedRef.current = true;
    const rec = recognitionRef.current;
    if (rec) {
      try {
        rec.stop();
      } catch {
        /* already stopped */
      }
    }
    setListening(false);
  }, []);

  const start = useCallback(() => {
    const Ctor = getSpeechRecognitionCtor();
    if (!Ctor || disabled) return;

    setError(null);
    stopRequestedRef.current = false;

    try {
      recognitionRef.current?.abort();
    } catch {
      /* ignore */
    }

    const rec = new Ctor();
    rec.lang = 'ru-RU';
    rec.interimResults = true;
    rec.continuous = false;
    rec.maxAlternatives = 1;

    rec.onstart = () => setListening(true);

    rec.onresult = (event) => {
      let finalText = '';
      let interim = '';
      for (let i = event.resultIndex; i < event.results.length; i += 1) {
        const result = event.results[i];
        const text = result[0]?.transcript ?? '';
        if (result.isFinal) finalText += text;
        else interim += text;
      }
      const combined = `${finalText}${interim}`.trim();
      if (combined) {
        onTranscriptRef.current?.(combined, Boolean(finalText.trim()));
      }
    };

    rec.onerror = (event) => {
      const code = event.error;
      if (code === 'aborted' || code === 'no-speech') {
        setListening(false);
        return;
      }
      if (code === 'not-allowed' || code === 'service-not-allowed') {
        setError('Нет доступа к микрофону. Разрешите его в браузере.');
      } else if (code === 'audio-capture') {
        setError('Микрофон не найден.');
      } else {
        setError('Не удалось распознать речь. Попробуйте ещё раз.');
      }
      setListening(false);
    };

    rec.onend = () => {
      recognitionRef.current = null;
      setListening(false);
    };

    recognitionRef.current = rec;
    try {
      rec.start();
    } catch {
      setError('Голосовой ввод уже запущен.');
    }
  }, [disabled]);

  const toggle = useCallback(() => {
    if (listening) stop();
    else start();
  }, [listening, start, stop]);

  useEffect(() => {
    if (disabled && listening) stop();
  }, [disabled, listening, stop]);

  useEffect(() => () => {
    stopRequestedRef.current = true;
    try {
      recognitionRef.current?.abort();
    } catch {
      /* ignore */
    }
  }, []);

  return { supported, listening, error, toggle, stop };
}

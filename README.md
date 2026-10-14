# ИИ-чат (виджет в стиле Jivo)

Frontend виджета чата с ИИ-ассистентом: плавающая кнопка, панель диалога, мок-ответы, светлая и тёмная тема.

## Запуск

```bash
npm install
npm run dev
```

Откройте URL из терминала (обычно `http://localhost:5173`).

## Сборка

```bash
npm run build
npm run preview
```

## Структура

- `src/components/ChatWidget` — виджет целиком
- `src/mocks/` — профиль агента и `getMockAgentReply` (`USE_MOCKS = true`)
- `src/hooks/useChat.js` — сообщения, приветствие, индикатор «печатает»
- `src/hooks/useTheme.js` — тема в `localStorage`

Для подключения API замените вызов в `useChat.js`, оставив моки за флагом `USE_MOCKS`.

# ИИ-чат (виджет в стиле Jivo)

Frontend виджета чата с консультантом по **медицинским товарам** и backend на **Google Gemini**. Вопросы вне темы товаров агент перенаправляет на телефон медцентра.

## Требования

- Node.js 18+
- API-ключ Gemini: [Google AI Studio](https://aistudio.google.com/apikey)

## Настройка

```bash
cp .env.example .env
```

В `.env` укажите:

```env
GEMINI_API_KEY=ваш_ключ
MED_CENTER_PHONE=+7 (800) 555-01-23
VITE_MED_CENTER_PHONE=+7 (800) 555-01-23
```

Опционально: `GEMINI_MODEL` (по умолчанию `gemini-3.8-flash`), `PORT` (по умолчанию `3001`). `VITE_MED_CENTER_PHONE` — тот же номер для приветствия в виджете.

## Запуск

```bash
npm install
npm run dev
```

Поднимаются **API** (`http://localhost:3001`) и **Vite** (обычно `http://localhost:5173`). Запросы с фронта на `/api/*` проксируются на backend.

Только frontend (если API уже запущен отдельно):

```bash
npm run dev:client
```

Только backend:

```bash
npm run start:server
```

## Режим моков

Без Gemini — в `.env` или при сборке:

```env
VITE_USE_MOCKS=true
```

Перезапустите `npm run dev:client` (или полный `npm run dev`).

## Сборка frontend

```bash
npm run build
npm run preview
```

Для production разверните `server/` и настройте прокси `/api` на тот же хост или укажите `VITE_API_URL` (при необходимости доработайте `src/api/chatAgent.js`).

## Структура

- `server/index.js` — Express, `POST /api/chat`, вызов Gemini
- `src/api/chatAgent.js` — клиент API
- `src/hooks/useChat.js` — история диалога и отправка
- `src/mocks/` — заглушки при `VITE_USE_MOCKS=true`

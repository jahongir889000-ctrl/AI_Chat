export const USE_MOCKS = true;

const defaultReplies = [
  'Спасибо за сообщение! Я передам информацию команде. Можете уточнить детали?',
  'Понял вас. Если нужно, могу рассказать о тарифах или помочь с настройкой.',
  'Хороший вопрос. Кратко: мы работаем 24/7, ответ обычно в течение минуты.',
];

const keywordReplies = [
  {
    test: (t) => /привет|здравств|добр(ый|ое|ая)/i.test(t),
    reply:
      'Привет! Рад помочь. Спросите о ценах, демо или напишите «помощь» для списка тем.',
  },
  {
    test: (t) => /цен|тариф|стоим|сколько/i.test(t),
    reply:
      'Базовый тариф — бесплатно до 100 диалогов в месяц. Pro — от 990 ₽/мес с расширенной аналитикой. Нужна ссылка на сравнение?',
  },
  {
    test: (t) => /помощ|help|что умееш|что ты/i.test(t),
    reply:
      'Я могу: ответить на частые вопросы, подсказать тарифы, записать заявку на демо. Просто опишите задачу своими словами.',
  },
  {
    test: (t) => /демо|заявк|менедж/i.test(t),
    reply:
      'Заявку на демо можно оставить на сайте в разделе «Контакты». Укажите email — менеджер свяжется в течение рабочего дня.',
  },
];

function pickReply(userText) {
  const trimmed = userText.trim();
  for (const { test, reply } of keywordReplies) {
    if (test(trimmed)) return reply;
  }
  return defaultReplies[Math.floor(Math.random() * defaultReplies.length)];
}

function randomDelay() {
  return 800 + Math.floor(Math.random() * 1000);
}

/**
 * @param {string} userText
 * @returns {Promise<string>}
 */
export function getMockAgentReply(userText) {
  const text = pickReply(userText);
  return new Promise((resolve) => {
    setTimeout(() => resolve(text), randomDelay());
  });
}

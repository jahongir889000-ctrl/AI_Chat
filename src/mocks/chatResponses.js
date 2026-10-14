import { MED_CENTER_PHONE } from '../constants/medCenter.js';
import { mockMedicalProducts } from './medicalProducts.js';

/** @deprecated используйте src/config.js */
export const USE_MOCKS = false;

const redirectReply = `Этот вопрос лучше обсудить с администратором медцентра. Позвоните: ${MED_CENTER_PHONE}. Я могу подсказать только по медицинским товарам в каталоге.`;

const medicalKeywords =
  /тонометр|глюкометр|ингалятор|небулайзер|бинт|медтех|медицин|товар|каталог|доставк|заказ|полоск|расходник|термометр|стетоскоп|ортез|корсет|кислород|глюкоз/i;

const offTopicKeywords =
  /врач|приём|запис|анализ|диагноз|лечен|таблетк|дозиров|страхов|полис|операци|беремен|температур.*реб|болит/i;

const keywordReplies = [
  {
    test: (t) => /привет|здравств|добр(ый|ое|ая)/i.test(t),
    reply:
      'Здравствуйте! Спросите о медтоварах: подбор, характеристики, совместимость расходников. По услугам клиники — звоните в медцентр.',
  },
  {
    test: (t) => /тонометр/i.test(t),
    reply: `В каталоге есть ${mockMedicalProducts[0].name}: ${mockMedicalProducts[0].hint} Нужна помощь с выбором манжеты или питанием?`,
  },
  {
    test: (t) => /глюкометр|полоск/i.test(t),
    reply: `${mockMedicalProducts[1].name} — ${mockMedicalProducts[1].hint} Уточните, какие полоски уже используете — подскажу совместимость.`,
  },
  {
    test: (t) => /ингалятор|небулайз/i.test(t),
    reply: `${mockMedicalProducts[2].name}: ${mockMedicalProducts[2].hint}`,
  },
  {
    test: (t) => /помощ|help|что умееш|что ты/i.test(t),
    reply:
      'Отвечаю по медицинским товарам: назначение, уход, заказ и доставка. Вопросы о приёме врачей и анализах — по телефону медцентра.',
  },
];

function pickReply(userText) {
  const trimmed = userText.trim();
  if (offTopicKeywords.test(trimmed) && !medicalKeywords.test(trimmed)) {
    return redirectReply;
  }
  for (const { test, reply } of keywordReplies) {
    if (test(trimmed)) return reply;
  }
  if (medicalKeywords.test(trimmed)) {
    return `По этому товару уточню детали в каталоге. Кратко: смотрите раздел «${mockMedicalProducts[3].category}» или напишите модель — подскажу характеристики.`;
  }
  return redirectReply;
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

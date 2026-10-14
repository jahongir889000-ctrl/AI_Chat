import { MED_CENTER_PHONE } from '../constants/medCenter.js';

/** @type {{ id: string; name: string; initials: string; status: 'online' | 'offline'; welcomeMessage: string }} */
export const mockAgent = {
  id: 'agent-1',
  name: 'Консультант по медтоварам',
  initials: 'МТ',
  status: 'online',
  welcomeMessage: `Здравствуйте! Я помогу с вопросами о медицинских товарах: тонометры, глюкометры, расходники, уход за больными и другое оборудование для дома.
По записи к врачу, анализам и услугам клиники звоните в медцентр: ${MED_CENTER_PHONE}.`,
};

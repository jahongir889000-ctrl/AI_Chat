export const MED_CENTER_PHONE =
  import.meta.env.VITE_MED_CENTER_PHONE || '+7 (800) 555-01-23';

export const MED_CENTER_PHONE_TEL = MED_CENTER_PHONE.replace(/[^\d+]/g, '');

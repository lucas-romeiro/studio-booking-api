export const addHours = (date: Date, hours: number): Date => {
  const result = new Date(date);
  result.setHours(result.getHours() + hours);
  return result;
};

export const addDays = (date: Date, days: number): Date => {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
};

export const startOfDay = (date: Date): Date => {
  const result = new Date(date);
  result.setHours(0, 0, 0, 0);
  return result;
};

export const futureDate = (hoursFromNow: number): Date => {
  return addHours(new Date(), hoursFromNow);
};

export const futureDateInDays = (daysFromNow: number): Date => {
  return startOfDay(addDays(new Date(), daysFromNow));
};

export const pastDate = (hoursAgo: number): Date => {
  return addHours(new Date(), -hoursAgo);
};

export const yesterday = (): Date => {
  return startOfDay(addDays(new Date(), -1));
};

export const tomorrow = (): Date => {
  return startOfDay(addDays(new Date(), 1));
};

export const dayAfterTomorrow = (): Date => {
  return startOfDay(addDays(new Date(), 2));
};

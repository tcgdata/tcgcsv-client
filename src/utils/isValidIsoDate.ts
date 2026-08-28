export const isValidIsoDate = (date: unknown): date is string => {
  // does not validate if month/day is out of bounds
  return typeof date === 'string' && /^[0-9]{4}-[0-9]{2}-[0-9]{2}$/.test(date);
};

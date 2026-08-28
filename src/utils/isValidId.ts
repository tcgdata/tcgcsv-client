export const isValidId = (id: unknown): id is number => {
  return typeof id === 'number' && !isNaN(id) && Number.isInteger(id) && id > 0;
};

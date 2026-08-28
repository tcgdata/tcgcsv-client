import { faker } from '@faker-js/faker';
import { isValidIsoDate } from './isValidIsoDate';

describe('isValidIsoDate', () => {
  test('A date string is valid', () => {
    const date = faker.date.recent().toISOString().split('T')[0];

    expect(isValidIsoDate(date)).toBe(true);
  });

  test.each([
    {
      description: 'Empty string',
      input: '',
    },
    {
      description: 'Non-date string',
      input: faker.lorem.words(),
    },
    {
      description: 'Full date string',
      input: faker.date.recent().toISOString(),
    },
    {
      description: 'Date object',
      input: faker.date.recent(),
    },
  ])(`$description is invalid ($input)`, ({ input }) => {
    expect(isValidIsoDate(input)).toBe(false);
  });
});

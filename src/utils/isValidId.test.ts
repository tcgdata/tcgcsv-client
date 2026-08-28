import { faker } from '@faker-js/faker';
import { isValidId } from './isValidId';

describe('isValidId', () => {
  test('A positive integer is valid', () => {
    expect(isValidId(faker.number.int())).toBe(true);
  });

  test.each([
    {
      description: 'Zero',
      input: 0,
    },
    {
      description: 'Decimal number',
      input: faker.number.float(),
    },
    {
      description: 'Non-number',
      input: faker.lorem.word(),
    },
    {
      description: 'Negative integer',
      input: -faker.number.int(),
    },
  ])(`$description is invalid ($input)`, ({ input }) => {
    expect(isValidId(input)).toBe(false);
  });
});

import { LooseIsoDateTime } from './LooseIsoDateTime';
import { ZodError } from 'zod';

describe('LooseIsoDateTime', () => {
  test.each([
    {
      description: 'Time with milliseconds',
      input: '2026-07-17T18:26:34.693',
      expected: '2026-07-17T18:26:34.693Z',
    },
    {
      description: 'Time without milliseconds',
      input: '2026-07-17T18:26:34',
      expected: '2026-07-17T18:26:34.000Z',
    },
    {
      description: 'Time with UTC zone',
      input: '2026-07-17T18:26:34Z',
      expected: '2026-07-17T18:26:34.000Z',
    },
    {
      description: 'Time with hour offset zone',
      input: '2026-07-17T18:26:34+10:00',
      expected: '2026-07-17T08:26:34.000Z',
    },
  ])('Accepts and normalizes $description', ({ input, expected }): void => {
    expect(LooseIsoDateTime.parse(input)).toBe(expected);
  });

  test.each([
    {
      description: 'Non date string',
      input: 'not a date',
    },
    {
      description: 'Empty string',
      input: '',
    },
    {
      description: 'Date string without time',
      input: '2026-07-17',
    },
    {
      description: 'Date string with invalid date',
      input: '2026-13-17T18:26:34Z',
    },
    {
      description: 'Date string with invalid time',
      input: '2026-07-17T18:70:34Z',
    },
  ])('Rejects $description', ({ input }): void => {
    const { success, error } = LooseIsoDateTime.safeParse(input);

    expect(success).toBe(false);
    expect(error).toBeInstanceOf(ZodError);
    expect(error!.issues).toStrictEqual([
      {
        code: 'custom',
        message: 'Invalid ISO datetime string',
        path: [],
      },
    ]);
  });
});

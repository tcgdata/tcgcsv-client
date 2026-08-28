import { z } from 'zod';

export const LooseIsoDateTime = z.string().transform((value, context): string => {
  const pattern =
    /^(?<date>\d{4}-[01]\d-[0-3]\d)T(?<time>[0-2]\d:[0-5]\d:[0-5]\d(\.\d+)?)(?<zone>[+-][0-2]\d:[0-5]\d|Z)?$/;
  const matches = value.match(pattern);

  if (!matches?.groups) {
    context.addIssue({
      code: 'custom',
      message: 'Invalid ISO datetime string',
      input: value,
    });

    return z.NEVER;
  }

  try {
    if (matches.groups.zone) {
      return new Date(value).toISOString();
    }

    return new Date(`${matches.groups.date}T${matches.groups.time}Z`).toISOString();
  } catch {
    context.addIssue({
      code: 'custom',
      message: 'Invalid ISO datetime string',
      input: value,
    });

    return z.NEVER;
  }
});

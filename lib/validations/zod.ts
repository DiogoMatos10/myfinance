import { ZodError } from 'zod';

export type ZodFieldErrors = Record<string, string[]>;

export const formatZodError = (error: ZodError) => {
  const fieldErrors: ZodFieldErrors = {};

  error.issues.forEach(issue => {
    const path = issue.path.join('.') || 'form';
    if (!fieldErrors[path]) {
      fieldErrors[path] = [];
    }
    fieldErrors[path].push(issue.message);
  });

  return {
    message: 'Validation failed',
    fieldErrors,
  };
};

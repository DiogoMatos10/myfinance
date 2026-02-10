import { z } from 'zod';
import type { Translator } from '@/components/providers/i18n-provider';

// Login schema
export const createLoginSchema = (t: Translator) =>
  z.object({
    email: z
      .string()
      .min(1, t('validation.emailRequired'))
      .email(t('validation.emailInvalid')),
    password: z.string().min(6, t('validation.passwordMin')),
  });

export const createRegisterSchema = (t: Translator) =>
  z
    .object({
      displayName: z
        .string()
        .min(2, t('validation.nameMin'))
        .max(50, t('validation.nameMax')),
      email: z
        .string()
        .min(1, t('validation.emailRequired'))
        .email(t('validation.emailInvalid')),
      password: z
        .string()
        .min(6, t('validation.passwordMin'))
        .regex(
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
          t('validation.passwordComplex')
        ),
      confirmPassword: z.string().min(1, t('validation.confirmPassword')),
    })
    .refine(data => data.password === data.confirmPassword, {
      message: t('validation.passwordsMatch'),
      path: ['confirmPassword'],
    });

export const createResetPasswordSchema = (t: Translator) =>
  z.object({
    email: z
      .string()
      .min(1, t('validation.emailRequired'))
      .email(t('validation.emailInvalid')),
  });

export type LoginInput = z.infer<ReturnType<typeof createLoginSchema>>;
export type RegisterInput = z.infer<ReturnType<typeof createRegisterSchema>>;
export type ResetPasswordInput = z.infer<
  ReturnType<typeof createResetPasswordSchema>
>;

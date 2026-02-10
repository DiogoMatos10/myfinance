import { z } from 'zod';

// Schema de Login
export const loginSchema = z.object({
  email: z.string().min(1, 'Email é obrigatório').email('Email inválido'),
  password: z.string().min(6, 'Senha deve ter pelo menos 6 caracteres'),
});

export const registerSchema = z
  .object({
    displayName: z
      .string()
      .min(2, 'Nome deve ter pelo menos 2 caracteres')
      .max(50, 'Nome deve ter no máximo 50 caracteres'),
    email: z.string().min(1, 'Email é obrigatório').email('Email inválido'),
    password: z
      .string()
      .min(6, 'Senha deve ter pelo menos 6 caracteres')
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        'Senha deve conter letras maiúsculas, minúsculas e números'
      ),
    confirmPassword: z.string().min(1, 'Confirme sua senha'),
  })
  .refine(data => data.password === data.confirmPassword, {
    message: 'As senhas não coincidem',
    path: ['confirmPassword'],
  });

// Schema de Reset de Senha
export const resetPasswordSchema = z.object({
  email: z.string().min(1, 'Email é obrigatório').email('Email inválido'),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;

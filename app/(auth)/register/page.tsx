'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { registerUser, loginWithGoogle } from '@/lib/firebase/auth';
import { createRegisterSchema, RegisterInput } from '@/lib/validations/auth';
import { useI18n } from '@/components/providers/i18n-provider';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Image from 'next/image';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

export default function RegisterPage() {
  const router = useRouter();
  const { t } = useI18n();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const schema = useMemo(() => createRegisterSchema(t), [t]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterInput>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: RegisterInput) => {
    setIsLoading(true);
    setError('');

    try {
      await registerUser(data.email, data.password, data.displayName);
      router.push('/');
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : t('errors.register');
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    setError('');

    try {
      await loginWithGoogle();
      router.push('/');
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : t('errors.loginGoogle');
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">
            {t('auth.registerTitle')}
          </CardTitle>
          <CardDescription className="text-center">
            {t('auth.registerSubtitle')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {error && (
              <div className="rounded-md bg-red-50 p-3 text-sm text-red-800">
                {error}
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="displayName">{t('auth.fullNameLabel')}</Label>
              <Input
                id="displayName"
                type="text"
                placeholder={t('auth.fullNamePlaceholder')}
                {...register('displayName')}
                disabled={isLoading}
              />
              {errors.displayName && (
                <p className="text-sm text-red-600">
                  {errors.displayName.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">{t('auth.emailLabel')}</Label>
              <Input
                id="email"
                type="email"
                placeholder={t('auth.emailPlaceholder')}
                {...register('email')}
                disabled={isLoading}
              />
              {errors.email && (
                <p className="text-sm text-red-600">{errors.email.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">{t('auth.passwordLabel')}</Label>
              <Input
                id="password"
                type="password"
                placeholder={t('auth.passwordPlaceholder')}
                {...register('password')}
                disabled={isLoading}
              />
              {errors.password && (
                <p className="text-sm text-red-600">
                  {errors.password.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">
                {t('auth.confirmPasswordLabel')}
              </Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder={t('auth.passwordPlaceholder')}
                {...register('confirmPassword')}
                disabled={isLoading}
              />
              {errors.confirmPassword && (
                <p className="text-sm text-red-600">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading
                ? t('auth.creatingAccount')
                : t('auth.createAccountButton')}
            </Button>
          </form>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-2 text-gray-500">
                {t('common.or')}
              </span>
            </div>
          </div>

          <Button
            type="button"
            variant="outline"
            className="w-full"
            onClick={handleGoogleLogin}
            disabled={isLoading}
          >
            <Image
              src="/icons/google.svg"
              alt="Google"
              width={16}
              height={16}
              className="mr-2"
            />
            {t('auth.continueWithGoogle')}
          </Button>
        </CardContent>
        <CardFooter className="flex justify-center">
          <p className="text-sm text-gray-600">
            {t('auth.alreadyHaveAccount')}{' '}
            <Link
              href="/login"
              className="font-medium text-primary hover:underline"
            >
              {t('auth.signInLink')}
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}

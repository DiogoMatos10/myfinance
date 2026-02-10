'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginUser, loginWithGoogle } from '@/lib/firebase/auth';
import { createLoginSchema, LoginInput } from '@/lib/validations/auth';
import { useI18n } from '@/components/providers/i18n-provider';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import Image from 'next/image';

export default function LoginPage() {
  const router = useRouter();
  const { t } = useI18n();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const schema = useMemo(() => createLoginSchema(t), [t]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInput>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: LoginInput) => {
    setIsLoading(true);
    setError('');

    try {
      await loginUser(data.email, data.password);
      router.push('/');
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : t('errors.login');
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
            {t('auth.loginTitle')}
          </CardTitle>
          <CardDescription className="text-center">
            {t('auth.loginSubtitle')}
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
              <div className="flex items-center justify-between">
                <Label htmlFor="password">{t('auth.passwordLabel')}</Label>
                <Link
                  href="/reset-password"
                  className="text-sm text-primary hover:underline"
                >
                  {t('auth.forgotPassword')}
                </Link>
              </div>
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

            <Button type="submit" className="w-full" disabled={isLoading}>
              {t('auth.signIn')}
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
            {t('auth.newInApp')}{' '}
            <Link
              href="/register"
              className="font-medium text-primary hover:underline"
            >
              {t('auth.createAccount')}
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}

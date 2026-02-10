'use client';

import { useRequireAuth } from '@/lib/hooks/use-require-auth';
import { logoutUser } from '@/lib/firebase/auth';
import { useRouter } from 'next/navigation';
import { useI18n } from '@/components/providers/i18n-provider';
import { Header } from '@/components/layout/header';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading } = useRequireAuth();
  const router = useRouter();
  const { t } = useI18n();

  const handleLogout = async () => {
    try {
      await logoutUser();
      router.push('/login');
    } catch (error) {
      console.error(t('errors.logout'), error);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-600">{t('common.loading')}</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header user={user} onLogout={handleLogout} />

      {/* Main Content */}
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {children}
      </main>
    </div>
  );
}

'use client';

import type { User } from 'firebase/auth';
import { Button } from '@/components/ui/button';
import { useI18n } from '@/components/providers/i18n-provider';

interface HeaderProps {
  user: User | null;
  onLogout: () => void;
}

export function Header({ user, onLogout }: HeaderProps) {
  const { locale, setLocale, t } = useI18n();
  const toggleLocale = () => {
    setLocale(locale === 'pt-PT' ? 'en' : 'pt-PT');
  };

  return (
    <header className="bg-white shadow-sm">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold text-gray-900">
            {t('common.appName')}
          </h1>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={toggleLocale}
            aria-label={t('header.languageSwitch')}
          >
            {locale === 'pt-PT' ? 'PT' : 'EN'}
          </Button>
          <Button variant="outline" size="sm" onClick={onLogout}>
            {t('header.signOut')}
          </Button>
        </div>
      </div>
    </header>
  );
}

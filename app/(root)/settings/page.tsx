'use client';

import { useI18n } from '@/components/providers/i18n-provider';

export default function SettingsPage() {
  const { t } = useI18n();

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">{t('settings.title')}</h1>
      <p className="text-gray-600">{t('settings.subtitle')}</p>
    </div>
  );
}

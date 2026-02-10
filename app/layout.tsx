import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '@/components/providers/auth-provider';
import { I18nProvider } from '@/components/providers/i18n-provider';
import { ThemeProvider } from '@/components/providers/theme-provider';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'myFinance',
  description: 'Open-source platform for personal finance management',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="theme-default" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider>
          <I18nProvider>
            <AuthProvider>{children}</AuthProvider>
          </I18nProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}

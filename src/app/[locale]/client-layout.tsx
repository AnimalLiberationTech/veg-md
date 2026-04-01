"use client";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ScrollToTop from "@/components/ScrollToTop";
import {NextIntlClientProvider} from 'next-intl';
import {ThemeProvider} from "@/components/theme-provider";

export function ClientLayout({
  children,
  locale,
  messages,
}: {
  children: React.ReactNode;
  locale: string;
  messages: Record<string, any>;
}) {
  return (
    <ThemeProvider>
      <NextIntlClientProvider locale={locale} messages={messages} timeZone="Europe/Bucharest">
        <Header />
        {children}
        <Footer />
      </NextIntlClientProvider>
      <ScrollToTop />
    </ThemeProvider>
  );
}

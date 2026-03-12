"use client";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ScrollToTop from "@/components/ScrollToTop";
import {NextIntlClientProvider} from 'next-intl';
import {ThemeProvider} from "next-themes";

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
    <ThemeProvider attribute="class" enableSystem storageKey="vegan-theme">
      <NextIntlClientProvider locale={locale} messages={messages} timeZone="Europe/Bucharest">
        <Header />
        {children}
        <Footer />
      </NextIntlClientProvider>
      <ScrollToTop />
    </ThemeProvider>
  );
}

"use client";

import React from 'react';
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import ScrollToTop from "@/components/ScrollToTop";
import {NextIntlClientProvider, hasLocale} from 'next-intl';
import {Inter} from "next/font/google";
import {notFound} from 'next/navigation';
import "../../styles/index.css";
import {Providers} from "./providers";
import {routing} from '@/i18n/routing';

const inter = Inter({ subsets: ["latin"] });

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export default function RootLayout({
  children,
  params
}: Props) {
  const resolvedParams = React.use(params);
  const { locale } = resolvedParams;

  // Ensure that the incoming `locale` is valid
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  return (
    <html suppressHydrationWarning lang={locale}>
      {/*
        <head /> will contain the components returned by the nearest parent
        head.js. Find out more at https://beta.nextjs.org/docs/api-reference/file-conventions/head
      */}
      <head />

      <body className={`bg-[#FCFCFC] dark:bg-black ${inter.className}`}>
        <Providers>
          <Header />
          <NextIntlClientProvider locale={locale}>{children}</NextIntlClientProvider>
          <Footer />
          <ScrollToTop />
        </Providers>
      </body>
    </html>
  );
}

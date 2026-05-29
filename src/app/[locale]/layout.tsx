import React from 'react';
import {Metadata} from 'next';
import {hasLocale} from 'next-intl';
import {setRequestLocale} from 'next-intl/server';
import {notFound} from 'next/navigation';
import {routing} from '@/i18n/routing';
import {defaultMetadata, supportedLocales} from "@/constants";
import {ClientLayout} from "./client-layout";

type Messages = Record<string, any>;

async function getMessages(locale: string): Promise<Messages> {
  switch (locale) {
    case "ro":
      return (await import("@/translations/ro.json")).default;
    case "ru":
      return (await import("@/translations/ru.json")).default;
    case "en":
    default:
      return (await import("@/translations/en.json")).default;
  }
}

export function generateStaticParams() {
  return supportedLocales.map(locale => ({locale}));
}

type Props = {
  children: React.ReactNode;
  params: Promise<{locale: string}>;
};

export async function generateMetadata({params}: Props): Promise<Metadata> {
  const {locale} = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  const {homePage} = await getMessages(locale);

  return {
    ...defaultMetadata,
    title: homePage.title,
    description: homePage.description,
  };
}

export default async function RootLayout({children, params}: Props) {
  const {locale} = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  setRequestLocale(locale);

  const messages = await getMessages(locale);

  return (
    <ClientLayout locale={locale} messages={messages}>
      {children}
    </ClientLayout>
  );
}

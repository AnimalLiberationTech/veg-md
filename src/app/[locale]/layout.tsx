import React from 'react';
import {Metadata} from 'next';
import {hasLocale} from 'next-intl';
import {setRequestLocale} from 'next-intl/server';
import {notFound} from 'next/navigation';
import {routing} from '@/i18n/routing';
import {defaultMetadata, supportedLocales} from "@/constants";
import {ClientLayout} from "./client-layout";
import enMessages from "@/translations/en.json";
import roMessages from "@/translations/ro.json";
import ruMessages from "@/translations/ru.json";

type Messages = typeof enMessages;

const MESSAGES: Record<string, Messages> = {
  en: enMessages,
  ro: roMessages,
  ru: ruMessages,
};

function getMessages(locale: string): Messages {
  return MESSAGES[locale] ?? enMessages;
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

  const {homePage} = getMessages(locale);

  return {
    ...defaultMetadata,
    title: homePage.title,
    description: homePage.description,
  };
}

export default function RootLayout({children, params}: Props) {
  const {locale} = React.use(params);

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  // g.
  setRequestLocale(locale);

  const messages = getMessages(locale);

  return (
    <ClientLayout locale={locale} messages={messages}>
      {children}
    </ClientLayout>
  );
}

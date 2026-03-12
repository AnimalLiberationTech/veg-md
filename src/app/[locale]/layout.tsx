import React from 'react';
import {Metadata} from 'next';
import {hasLocale} from 'next-intl';
import {notFound} from 'next/navigation';
import {routing} from '@/i18n/routing';
import {supportedLocales} from "@/constants";
import {ClientLayout} from "./client-layout";
import enMessages from "../../../messages/en.json";
import roMessages from "../../../messages/ro.json";
import ruMessages from "../../../messages/ru.json";

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
  const {general} = getMessages(locale);

  return {
    title: general.title,
    description: general.description,
    icons: {
      icon: [
        {url: "/favicon.ico"},
        {url: "/favicon-16x16.png", sizes: "16x16", type: "image/png"},
        {url: "/favicon-32x32.png", sizes: "32x32", type: "image/png"},
      ],
      apple: "/apple-touch-icon.png",
    },
    manifest: "/site.webmanifest",
  };
}

export default function RootLayout({children, params}: Props) {
  const {locale} = React.use(params);

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  const messages = getMessages(locale);

  return (
    <ClientLayout locale={locale} messages={messages}>
      {children}
    </ClientLayout>
  );
}

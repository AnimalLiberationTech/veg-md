import ScrollUp from "@/components/Common/ScrollUp";
import Contact from "@/components/Contact";
import Resources from "@/components/Resources";
import Hero from "@/components/Hero";
import Video from "@/components/Video";
import {Metadata} from "next";
import {getTranslations} from 'next-intl/server';
import {defaultMetadata, supportedLocales} from "@/constants";

type PageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({params}: PageProps): Promise<Metadata> {
  const {locale} = await params;
  const t = await getTranslations({locale, namespace: 'homePage'});

  return {
    ...defaultMetadata,
    title: `${t('title')} | Vegan Moldova`,
    description: t('description'),
  };
}

export function generateStaticParams() {
  return supportedLocales.map(locale => ({locale}));
}

export default async function Home({params}: PageProps) {
  const {locale} = await params;
  return (
    <>
      <ScrollUp />
      <Hero />
      <Resources locale={locale} />
      {/*<Video />*/}
      {/*<Contact />*/}
    </>
  );
}

import ScrollUp from "@/components/Common/ScrollUp";
import Contact from "@/components/Contact";
import Features from "@/components/Features";
import Video from "@/components/Video";
import {Metadata} from "next";
import {getTranslations} from 'next-intl/server';
import {defaultMetadata, supportedLocales} from "@/constants";

type PageProps = {
  params: Promise<{
    locale: string;
  }>;
};

export async function generateMetadata({
  params
}: PageProps): Promise<Metadata> {
  const locale = (await params).locale;
  const t = await getTranslations({ locale, namespace: 'homePage' });

  return {
    ...defaultMetadata,
    title: `${t('title')} | Vegan Moldova`,
    description: t('description')
  }
}

export function generateStaticParams() { return supportedLocales.map(locale => ({ locale })); }

export default async function Home({ params }: PageProps) {
  const locale = (await params).locale;
  const t = await getTranslations({ locale: locale, namespace: 'homePage' });

  return (
    <>
      <ScrollUp />
      <Features />
      <Video />
      <Contact />
    </>
  );
}

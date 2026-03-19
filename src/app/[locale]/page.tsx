import ScrollUp from "@/components/Common/ScrollUp";
import Resources from "@/components/Resources";
import Hero from "@/components/Hero";
import {getPageMetadata} from "@/utils/metadata";
import {supportedLocales} from "@/constants";
import {Metadata} from "next";

type PageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({params}: PageProps): Promise<Metadata> {
  const {locale} = await params;
  return getPageMetadata(locale, 'homePage');
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
    </>
  );
}

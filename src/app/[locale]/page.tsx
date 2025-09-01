import AboutSectionOne from "@/components/About/AboutSectionOne";
import AboutSectionTwo from "@/components/About/AboutSectionTwo";
import Blog from "@/components/Blog";
import Brands from "@/components/Brands";
import ScrollUp from "@/components/Common/ScrollUp";
import Contact from "@/components/Contact";
import Features from "@/components/Features";
import Hero from "@/components/Hero";
import Pricing from "@/components/Pricing";
import Testimonials from "@/components/Testimonials";
import Video from "@/components/Video";
import {Metadata} from "next";
import {getTranslations} from 'next-intl/server';
import {defaultMetadata} from "@/constants";

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

export default async function Home({ params }: PageProps) {
  const locale = (await params).locale;
  const t = await getTranslations({ locale: locale, namespace: 'homePage' });

  return (
    <>
      <ScrollUp />
      <Hero />
      <Features />
      <Video />
      <Brands />
      <AboutSectionOne />
      <AboutSectionTwo />
      <Testimonials />
      <Pricing />
      <Blog />
      <Contact />
    </>
  );
}

import Breadcrumb from "@/components/Common/Breadcrumb";
import ContactCard from "@/components/Contact/ContactCard";

import { Metadata } from "next";
import {supportedLocales} from "@/constants";
import { getTranslations } from "next-intl/server";

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "about" });

  return {
    title: t("pageTitle"),
    description: t("pageDescription"),
  };
}

export function generateStaticParams() { return supportedLocales.map(locale => ({ locale })); }

const AboutPage = async ({ params }: Props) => {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "about" });

  return (
    <>
      <Breadcrumb
        pageName={t("breadcrumbTitle")}
        description={t("breadcrumbDescription")}
        homeHref={`/${locale}`}
      />
      <section className="py-16 md:py-20 lg:py-28">
        <div className="container">
          <ContactCard />
        </div>
      </section>
    </>
  );
};

export default AboutPage;

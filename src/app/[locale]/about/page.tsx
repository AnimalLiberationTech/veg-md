import Breadcrumb from "@/components/Common/Breadcrumb";
import ContactCard from "@/components/Contact/ContactCard";

import { Metadata } from "next";
import {supportedLocales} from "@/constants";
import { getTranslations } from "next-intl/server";

export async function generateMetadata({
  params: { locale },
}: {
  params: { locale: string };
}): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: "about" });

  return {
    title: t("pageTitle"),
    description: t("pageDescription"),
  };
}

export function generateStaticParams() { return supportedLocales.map(locale => ({ locale })); }

const AboutPage = async ({ params }: { params: { locale: string } }) => {
  const t = await getTranslations({ locale: params.locale, namespace: "about" });

  return (
    <>
      <Breadcrumb
        pageName={t("breadcrumbTitle")}
        description={t("breadcrumbDescription")}
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

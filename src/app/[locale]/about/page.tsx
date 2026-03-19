import Breadcrumb from "@/components/Common/Breadcrumb";
import ContactCard from "@/components/Contact/ContactCard";

import {supportedLocales} from "@/constants";
import { getTranslations } from "next-intl/server";
import {getPageMetadata} from "@/utils/metadata";
import {Metadata} from "next";

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return getPageMetadata(locale, 'aboutPage');
}

export function generateStaticParams() { return supportedLocales.map(locale => ({ locale })); }

const AboutPage = async ({ params }: Props) => {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "aboutPage" });
  const homeT = await getTranslations({ locale, namespace: "homePage" });

  return (
    <>
      <Breadcrumb
        homePageName={homeT("title")}
        pageName={t("title")}
        description={t("description")}
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

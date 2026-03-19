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
      <section className="pb-16 md:pb-20 lg:pb-28">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            <div>
              <ContactCard />
            </div>
            <div className="w-full h-125 md:h-150 rounded-sm border border-dark overflow-hidden shadow-three dark:shadow-none">
              <iframe
                src="https://calendar.google.com/calendar/embed?height=600&wkst=2&ctz=Europe%2FChisinau&showPrint=0&title=Moldova%20Vegan%C4%83&src=bW9sZG92YXZlZ2FuYUBnbWFpbC5jb20&color=%23039be5"
                style={{ border: 0 }}
                width="100%"
                height="100%"
                frameBorder="0"
                scrolling="no"
              ></iframe>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default AboutPage;

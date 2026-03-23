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

  const calendarParams = {
    height: 600,
    wkst: 2,
    ctz: "Europe/Chisinau",
    showPrint: 0,
    mode: "AGENDA",
    showCalendars: 0,
    showTz: 0,
    title: "Moldova Vegană",
    src: "moldovavegana@gmail.com",
    color: "#039be5",
  };

  const calendarUrl = new URL("https://calendar.google.com/calendar/embed");
  Object.entries(calendarParams).forEach(([key, value]) => {
    calendarUrl.searchParams.append(key, value.toString());
  });

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
                src={calendarUrl.toString()}
                style={{ border: 0 }}
                width="100%"
                height="100%"
              ></iframe>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default AboutPage;

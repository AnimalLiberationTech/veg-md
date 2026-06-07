import Breadcrumb from "@/components/Common/Breadcrumb";
import {gCalUrl, supportedLocales} from "@/constants";
import {Metadata} from "next";
import {getTranslations} from "next-intl/server";
import {getPageMetadata} from "@/utils/metadata";
import Calendar from "@/components/Calendar";
import {fetchCalEvents} from "@/utils/fetchers/cal-events";
import { CalEvent } from "@/components/Calendar/events";

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({params}: Props): Promise<Metadata> {
  const {locale} = await params;
  return getPageMetadata(locale, "activitiesPage");
}

export function generateStaticParams() {
  return supportedLocales.map((locale) => ({locale}));
}

const ActivitiesPage = async ({params}: Props) => {
  const {locale} = await params;
  const t = await getTranslations({locale, namespace: "activitiesPage"});

  let initialEvents: CalEvent[];
  try {
    initialEvents = await fetchCalEvents(`${gCalUrl}?cal=community&days=30`);
  } catch {
    initialEvents = [];
  }

  return (
    <>
      <Breadcrumb
        pageName={t("title")}
        description={t("description")}
        homeHref={`/${locale}`}
      />
      <section className="pt-12 pb-16">
        <div className="container">
          <Calendar
            openLabel={t("calendarOpen")}
            closeLabel={t("calendarClose")}
            mobileAlwaysVisible
            initialEvents={initialEvents}
          />
        </div>
      </section>
    </>
  );
};

export default ActivitiesPage;




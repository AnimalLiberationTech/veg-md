import Image from "next/image";
import Breadcrumb from "@/components/Common/Breadcrumb";
import ActivitiesCalendar from "@/components/Community/ActivitiesCalendar";
import {supportedLocales} from "@/constants";
import {Metadata} from "next";
import {getTranslations} from "next-intl/server";
import {getPageMetadata} from "@/utils/metadata";

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return getPageMetadata(locale, "activitiesPage");
}

export function generateStaticParams() {
  return supportedLocales.map((locale) => ({ locale }));
}

const ActivitiesPage = async ({ params }: Props) => {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "activitiesPage" });
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

  const activities = [
    {
      title: t("streetOutreachTitle"),
      description: t("streetOutreachDescription"),
      image: "/images/activities/3MMC-Chisinau-2025.jpg",
      alt: t("streetOutreachImageAlt"),
      linkHref: "https://3minutes.wtf/viata",
      linkLabel: t("readMore"),
    },
    {
      title: t("picnicsTitle"),
      description: t("picnicsDescription"),
      image: "/images/activities/picnic-Chisinau-2025.jpg",
      alt: t("picnicsImageAlt"),
    },
    {
      title: t("foodTastingsTitle"),
      description: t("foodTastingsDescription"),
      image: "/images/activities/pexels-arthousestudio-4589510.jpg",
      alt: t("foodTastingsImageAlt"),
      creditLabel: "Photo by ArtHouse Studio",
      creditHref: "https://www.pexels.com/@arthousestudio/",
      linkHref: "https://t.me/veganmoldova/1751",
      linkLabel: t("telegramLink"),
    },
  ];

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
          <ActivitiesCalendar
            calendarUrl={calendarUrl.toString()}
            calendarTitle="Moldova Vegană calendar"
            openLabel={t("calendarOpen")}
            closeLabel={t("calendarClose")}
          >
            <div className="space-y-8">
              {activities.map((activity) => (
                <article
                  key={activity.title}
                  className="overflow-hidden rounded-sm border border-dark bg-white shadow-three dark:border-white/10 dark:bg-black dark:shadow-none"
                >
                  <div className="grid gap-0 lg:grid-cols-[minmax(0,480px)_minmax(0,1fr)]">
                    <div className="relative min-h-72 w-full">
                      <Image
                        src={activity.image}
                        alt={activity.alt}
                        fill
                        className="object-cover object-center"
                      />
                      {activity.creditLabel && activity.creditHref ? (
                        <a
                          href={activity.creditHref}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="absolute bottom-2 left-2 rounded bg-black/60 px-2 py-1 text-[11px] italic text-white/90 hover:underline"
                        >
                          {activity.creditLabel}
                        </a>
                      ) : null}
                    </div>
                    <div className="space-y-4 p-6 md:p-8">
                      <h2 className="text-2xl font-bold text-black dark:text-white">
                        {activity.title}
                      </h2>
                      <p className="text-body-color text-base leading-relaxed font-medium">
                        {activity.description}{" "}
                        {activity.linkHref ? (
                          <a
                            href={activity.linkHref}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="font-semibold text-primary underline decoration-primary/40 underline-offset-4 hover:decoration-primary"
                          >
                            {activity.linkLabel}
                          </a>
                        ) : null}
                      </p>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </ActivitiesCalendar>
        </div>
      </section>
    </>
  );
};

export default ActivitiesPage;


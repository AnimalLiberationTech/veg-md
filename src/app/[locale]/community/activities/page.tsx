import Image from "next/image";
import Breadcrumb from "@/components/Common/Breadcrumb";
import ActivitiesCalendar from "@/components/Community/ActivitiesCalendar";
import {supportedLocales, uvmEmail} from "@/constants";
import {Metadata} from "next";
import {getTranslations} from "next-intl/server";
import {getPageMetadata} from "@/utils/metadata";
import {JSX} from "react";
import PhotoCredit from "@/components/Common/PhotoCredit";

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

type ActivityLink = {
  type: "website" | "cal" | "telegram" | "email";
  href: string;
  label: string;
};

const linkIconByType: Record<ActivityLink["type"], JSX.Element> = {
  website: (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18M12 3a15 15 0 0 1 0 18M12 3a15 15 0 0 0 0 18" />
    </svg>
  ),
  cal: (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <rect x="3" y="5" width="18" height="16" rx="2" />
      <path d="M8 3v4M16 3v4M3 10h18" />
    </svg>
  ),
  telegram: (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <path d="M22 3 11 13" />
      <path d="M22 3 15 21l-4-8-8-4Z" />
    </svg>
  ),
  email: (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
      />
    </svg>
  ),
};

const ActivitiesPage = async ({params}: Props) => {
  const {locale} = await params;
  const t = await getTranslations({locale, namespace: "activitiesPage"});

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
      links: [
        {type: "website", href: "https://3minutes.wtf/viata", label: t("learnMore")},
        {type: "cal", href: "https://calendar.google.com/calendar/event?action=TEMPLATE&tmeid=cWdyMmdqNTQzY2wwazhhYWtycG90ZmJyNWtfMjAyNjA0MTFUMTEwMDAwWiBtb2xkb3ZhdmVnYW5hQG0&tmsrc=moldovavegana%40gmail.com&scp=ALL", label: "Google Calendar"},
      ],
    },
    {
      title: t("picnicsTitle"),
      description: t("picnicsDescription"),
      image: "/images/activities/picnic-Chisinau-2025.jpg",
      alt: t("picnicsImageAlt"),
      links: [
        {type: "telegram", href: "https://t.me/veganmoldova/1751", label: t("telegramLink")},
      ]
    },
    {
      title: t("digitalProjectsTitle"),
      description: t("digitalProjectsDescription"),
      image: "/images/activities/pexels-lorencastillo-9213879.jpg",
      creditLabel: "Photo by Loren Castillo",
      creditHref: "http://www.lorencastillophotography.com/",
      alt: t("digitalProjectsImageAlt"),
      links: [
        {type: "telegram", href: "https://t.me/veganmoldova/3690", label: t("telegramLink")},
      ]
    },
    {
      title: t("otherActivitiesTitle"),
      description: t("otherActivitiesDescription"),
      image: "/images/activities/pexels-arthousestudio-4589510.jpg",
      alt: t("otherActivitiesImageAlt"),
      creditLabel: "Photo by ArtHouse Studio",
      creditHref: "https://www.pexels.com/@arthousestudio/",
      links: [
        {type: "telegram", href: "https://t.me/veganmoldova/1751", label: t("telegramLink")},
        {type: "email", href: uvmEmail, label: "e-mail"},
      ]
    },
  ];

  return (
    <>
      <Breadcrumb
        pageName={t("title")}
        description={t("description")}
        homeHref={`/${locale}`}
      />
      <section className="pt-12 pb-16">
        <div className="container">
          <ActivitiesCalendar
            calendarUrl={calendarUrl.toString()}
            calendarTitle="Moldova Vegană calendar"
            openLabel={t("calendarOpen")}
            closeLabel={t("calendarClose")}
            mobileAlwaysVisible
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
                        <PhotoCredit
                          creditLabel={activity.creditLabel}
                          creditHref={activity.creditHref}
                        />
                      ) : null}
                    </div>
                    <div className="space-y-4 p-6 md:p-8">
                      <h2 className="text-2xl font-bold text-black dark:text-white">
                        {activity.title}
                      </h2>
                      <p className="text-body-color text-base leading-relaxed font-medium">
                        {activity.description}
                      </p>
                      {activity.links.length > 0 ? (
                        <div className="flex flex-wrap gap-3 pt-1">
                          {activity.links.map((link: ActivityLink) => {
                            const isEmail = link.type === "email";
                            const href = isEmail ? `mailto:${link.href}` : link.href;

                            return (
                              <a
                                key={link.href}
                                href={href}
                                target={isEmail ? undefined : "_blank"}
                                rel={isEmail ? undefined : "noopener noreferrer"}
                                className="inline-flex items-center gap-2 rounded-sm border border-primary/20 px-3 py-1.5 text-sm font-semibold text-primary transition hover:border-primary/40 hover:bg-primary/5"
                              >
                                {linkIconByType[link.type]}
                                <span>{link.label}</span>
                              </a>
                            );
                          })}
                        </div>
                      ) : null}
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


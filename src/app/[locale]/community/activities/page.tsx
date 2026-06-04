import Image from "next/image";
import Breadcrumb from "@/components/Common/Breadcrumb";
import {supportedLocales, uvmEmail} from "@/constants";
import {Metadata} from "next";
import {getTranslations} from "next-intl/server";
import {getPageMetadata} from "@/utils/metadata";
import PhotoCredit from "@/components/Common/PhotoCredit";
import {sanitizeWpArticleHtml} from "@/utils/wp-article-sanitize";
import Calendar from "@/components/Calendar";
import {formatCalendarDateRange} from "@/components/Calendar/datetime";
import {nl2br, unescapeCommas} from "@/utils/text";
import {localizeCalDescription, renderUrls} from "@/components/Calendar/events";
import {ActivityLink, linkIconByType} from "@/components/Calendar/linkIcons";
import {EventDescriptionProvider} from "@/components/Calendar/event-description-context";
import CalendarEventDescription from "@/components/Calendar/eventDescription";

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
        {type: "github", href: "https://github.com/AnimalLiberationTech", label: "GitHub"},
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
          <Calendar
            calendarContent={
              <div className="space-y-4">
                <div className="mb-6">
                  <h2 className="text-2xl font-bold text-black dark:text-white">
                    {t("calendar")}
                  </h2>
                </div>

                <div className="space-y-4">
                  {calendarEvents.length > 0 ? (
                    <EventDescriptionProvider>
                      {calendarEvents.map((event) => {
                        const eventId = `${event.start_iso}-${event.summary}`;

                        return (
                          <article
                            key={eventId}
                            className="rounded-sm border border-dark/10 p-4 dark:border-white/10"
                          >
                            <p className="text-sm font-semibold text-primary">
                              {formatCalendarDateRange(locale, event.start_iso, event.end_iso)}
                            </p>
                            <h3 className="mt-2 text-lg font-bold text-black dark:text-white">
                              {unescapeCommas(event.summary)}
                            </h3>
                            {event.location ? (
                              <p className="mt-2 inline-flex items-start gap-2 text-sm text-body-color">
                                <svg
                                  viewBox="0 0 24 24"
                                  className="mt-0.5 h-4 w-4 shrink-0 text-primary"
                                  fill="none"
                                  stroke="currentColor"
                                  strokeWidth="2"
                                  aria-hidden="true"
                                >
                                  <path d="M12 21s6-5.686 6-11a6 6 0 0 0-12 0c0 5.314 6 11 6 11Z" />
                                  <circle cx="12" cy="10" r="2.5" />
                                </svg>
                                <span>{unescapeCommas(event.location)}</span>
                              </p>
                            ) : null}
                            {event.description ? (
                              <CalendarEventDescription
                                eventId={eventId}
                                html={sanitizeWpArticleHtml(
                                  renderUrls(
                                    localizeCalDescription(nl2br(unescapeCommas(event.description)), locale),
                                  ),
                                )}
                              />
                            ) : null}
                          </article>
                        );
                      })}
                    </EventDescriptionProvider>
                  ) : (
                    <div className="rounded-sm border border-dashed border-dark/20 p-4 text-sm text-body-color dark:border-white/10">
                      {t("noUpcomingEvents")}
                    </div>
                  )}
                </div>
              </div>
            }
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
          </Calendar>
        </div>
      </section>
    </>
  );
};

export default ActivitiesPage;




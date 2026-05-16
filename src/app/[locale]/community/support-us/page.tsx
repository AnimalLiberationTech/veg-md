import Image from "next/image";
import Breadcrumb from "@/components/Common/Breadcrumb";
import Transparency from "@/components/Community/Transparency";
import {supportedLocales, veganMoldovaTgGroupUrl} from "@/constants";
import {Metadata} from "next";
import {getTranslations} from "next-intl/server";
import {getPageMetadata} from "@/utils/metadata";
import PhotoCredit from "@/components/Common/PhotoCredit";

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({params}: Props): Promise<Metadata> {
  const {locale} = await params;
  return getPageMetadata(locale, "supportUsPage");
}

export function generateStaticParams() {
  return supportedLocales.map((locale) => ({locale}));
}

const SupportUsPage = async ({params}: Props) => {
  const {locale} = await params;
  const t = await getTranslations({locale, namespace: "supportUsPage"});
  const tGlobal = await getTranslations({locale, namespace: "global"});


  return (
    <>
      <Breadcrumb
        pageName={t("title")}
        homeHref={`/${locale}`}
        description={t("description")}
      />
      <section className="pt-12 pb-16">
        <div className="container">
          {/* Call to Action Section */}
          <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_380px]">
            <div className="min-w-0 space-y-12">
              <div>
                <p className="mb-10 max-w-4xl text-base leading-relaxed text-body-color md:text-lg">
                  {t("callToActionDescription")}
                </p>
                <p className="mb-10 max-w-4xl text-base leading-relaxed text-body-color md:text-lg">
                  {t("callToActionContact")}
                  <a
                    href={veganMoldovaTgGroupUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                  >
                    {t("callToActionContactLink")}
                  </a>
                  .
                </p>
              </div>

              {/* Transparency Section */}
              <div className="space-y-6">
                <div>
                  <h2 className="mb-4 text-3xl font-bold text-black dark:text-white">
                    {t("transparencyTitle")}
                  </h2>
                  <p className="mb-10 max-w-4xl text-base leading-relaxed text-body-color md:text-lg">
                    {t("transparencyDescription")}
                  </p>
                </div>
                <Transparency
                  donationsUrl="/api/google/get-sheet?sheet=community-donations"
                  expensesUrl="/api/google/get-sheet?sheet=community-expenses"
                  donationTableHeader={t("donationTableHeader")}
                  expensesTableHeader={t("expensesTableHeader")}
                  loading={t("loading")}
                  noDataLabel={tGlobal("noContentAvailable")}
                />
              </div>
            </div>
            <aside className="relative overflow-hidden rounded-sm border border-dark/10 bg-white shadow-three dark:border-white/10 dark:bg-black dark:shadow-none">
              <div className="relative aspect-3/4 w-full">
                <Image
                  src="/images/support-us/artawkrn-tXnsbe-Y0To-unsplash.jpg"
                  alt={t("title")}
                  fill
                  className="object-cover object-center"
                />
                <PhotoCredit
                  creditLabel="Photo by Krn Kwatra"
                  creditHref="https://unsplash.com/@artawkrn"
                  className="absolute bottom-2 right-2 rounded bg-black/60 px-2 py-1 text-[11px] italic text-white/90 hover:underline"
                />
              </div>
            </aside>
          </div>
        </div>
      </section>
    </>
  );
};

export default SupportUsPage;


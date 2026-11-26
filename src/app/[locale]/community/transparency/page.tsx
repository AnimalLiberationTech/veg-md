import Breadcrumb from "@/components/Common/Breadcrumb";
import CertificatePreview from "@/components/Community/CertificatePreview";
import { legalInfo, supportedLocales } from "@/constants";
import { Link } from "@/i18n/navigation";
import { getPageMetadata } from "@/utils/metadata";
import { Metadata } from "next";
import { getTranslations } from "next-intl/server";

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return getPageMetadata(locale, "transparencyPage");
}

export function generateStaticParams() {
  return supportedLocales.map((locale) => ({ locale }));
}

const TransparencyPage = async ({ params }: Props) => {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "transparencyPage" });

  const indicators = [
    {
      title: t("indicatorNonProfitTitle"),
      description: t("indicatorNonProfitText"),
    },
    {
      title: t("indicatorMissionTitle"),
      description: t("indicatorMissionText"),
    },
    {
      title: t("indicatorGovernanceTitle"),
      description: t("indicatorGovernanceText"),
    },
    {
      title: t("indicatorFinancialTitle"),
      description: t("indicatorFinancialText"),
    },
  ];

  return (
    <main id="main-content">
      <Breadcrumb
        pageName={t("title")}
        description={t("description")}
        homeHref={`/${locale}`}
      />

      <section className="pt-6 pb-16 md:pt-12">
        <div className="container space-y-14">
          {/* Overview & Non-Profit Operational Indicators */}
          <div className="rounded-sm border border-dark/15 bg-white p-6 shadow-one dark:border-white/15 dark:bg-gray-dark dark:shadow-none md:p-8">
            <h2 className="mb-4 text-2xl font-bold text-black dark:text-white sm:text-3xl">
              {t("overviewTitle")}
            </h2>
            <p className="mb-6 max-w-4xl text-base leading-relaxed text-gray-700 dark:text-gray-300 md:text-lg">
              {t("overviewText")}
            </p>

            <div className="mb-8 flex flex-wrap gap-4">
              <Link
                href="/community/support-us"
                className="inline-flex items-center gap-2 rounded-md bg-primary px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-primary/90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
              >
                {t("viewFinancialLedger")}
              </Link>
              <Link
                href="/community/values"
                className="inline-flex items-center gap-2 rounded-md border border-primary px-5 py-2.5 text-sm font-semibold text-primary transition hover:bg-primary/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary dark:border-secondary-green dark:text-secondary-green dark:hover:bg-secondary-green/10 dark:focus-visible:outline-secondary-green"
              >
                {t("viewValues")}
              </Link>
            </div>

            <h3 className="mb-5 text-xl font-bold text-black dark:text-white">
              {t("indicatorsTitle")}
            </h3>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {indicators.map((item) => (
                <article
                  key={item.title}
                  className="rounded-sm border border-dark/10 bg-gray-50 p-5 dark:border-white/10 dark:bg-black/30"
                >
                  <h4 className="mb-2 text-lg font-semibold text-black dark:text-white">
                    {item.title}
                  </h4>
                  <p className="text-sm leading-relaxed text-gray-700 dark:text-gray-300 sm:text-base">
                    {item.description}
                  </p>
                </article>
              ))}
            </div>
          </div>

          {/* Official Legal & Contact Information */}
          <div
            id="contact"
            className="rounded-sm border border-dark/15 bg-white p-6 shadow-one dark:border-white/15 dark:bg-gray-dark dark:shadow-none md:p-8"
          >
            <h2 className="mb-2 text-2xl font-bold text-black dark:text-white sm:text-3xl">
              {t("contactLegalTitle")}
            </h2>
            <p className="mb-8 text-base text-gray-600 dark:text-gray-300">
              {t("contactLegalSubtitle")}
            </p>

            <address className="not-italic">
              <dl className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                <div className="rounded-sm border border-dark/10 bg-gray-50 p-4 dark:border-white/10 dark:bg-black/30">
                  <dt className="mb-1 text-xs font-semibold uppercase tracking-wide text-gray-600 dark:text-gray-400">
                    {t("legalNameLabel")}
                  </dt>
                  <dd className="text-base font-semibold text-black dark:text-white">
                    {legalInfo.legalName}
                  </dd>
                </div>

                <div className="rounded-sm border border-dark/10 bg-gray-50 p-4 dark:border-white/10 dark:bg-black/30">
                  <dt className="mb-1 text-xs font-semibold uppercase tracking-wide text-gray-600 dark:text-gray-400">
                    {t("fullLegalNameLabel")}
                  </dt>
                  <dd className="text-base font-medium text-black dark:text-white">
                    {legalInfo.fullLegalName}
                  </dd>
                </div>

                <div className="rounded-sm border border-dark/10 bg-gray-50 p-4 dark:border-white/10 dark:bg-black/30">
                  <dt className="mb-1 text-xs font-semibold uppercase tracking-wide text-gray-600 dark:text-gray-400">
                    {t("idnoLabel")}
                  </dt>
                  <dd className="font-mono text-base font-semibold text-black dark:text-white">
                    {legalInfo.idno}
                  </dd>
                </div>

                <div className="rounded-sm border border-dark/10 bg-gray-50 p-4 dark:border-white/10 dark:bg-black/30">
                  <dt className="mb-1 text-xs font-semibold uppercase tracking-wide text-gray-600 dark:text-gray-400">
                    {t("legalFormLabel")}
                  </dt>
                  <dd className="text-base font-medium text-black dark:text-white">
                    {t("legalFormValue")}
                  </dd>
                </div>

                <div className="rounded-sm border border-dark/10 bg-gray-50 p-4 dark:border-white/10 dark:bg-black/30">
                  <dt className="mb-1 text-xs font-semibold uppercase tracking-wide text-gray-600 dark:text-gray-400">
                    {t("registrationDateLabel")}
                  </dt>
                  <dd className="text-base font-medium text-black dark:text-white">
                    {legalInfo.registrationDate}
                  </dd>
                </div>

                <div className="rounded-sm border border-dark/10 bg-gray-50 p-4 dark:border-white/10 dark:bg-black/30">
                  <dt className="mb-1 text-xs font-semibold uppercase tracking-wide text-gray-600 dark:text-gray-400">
                    {t("administratorLabel")}
                  </dt>
                  <dd className="text-base font-medium text-black dark:text-white">
                    {legalInfo.administrator}
                  </dd>
                </div>

                <div className="rounded-sm border border-dark/10 bg-gray-50 p-4 dark:border-white/10 dark:bg-black/30 sm:col-span-2 lg:col-span-1">
                  <dt className="mb-1 text-xs font-semibold uppercase tracking-wide text-gray-600 dark:text-gray-400">
                    {t("addressLabel")}
                  </dt>
                  <dd className="text-base font-medium text-black dark:text-white">
                    {legalInfo.address}
                  </dd>
                </div>

                <div className="rounded-sm border border-dark/10 bg-gray-50 p-4 dark:border-white/10 dark:bg-black/30">
                  <dt className="mb-1 text-xs font-semibold uppercase tracking-wide text-gray-600 dark:text-gray-400">
                    {t("phoneLabel")}
                  </dt>
                  <dd className="text-base font-semibold">
                    <a
                      href={`tel:${legalInfo.phone}`}
                      className="text-primary hover:underline dark:text-secondary-green"
                    >
                      {legalInfo.phone}
                    </a>
                  </dd>
                </div>

                <div className="rounded-sm border border-dark/10 bg-gray-50 p-4 dark:border-white/10 dark:bg-black/30">
                  <dt className="mb-1 text-xs font-semibold uppercase tracking-wide text-gray-600 dark:text-gray-400">
                    {t("emailLabel")}
                  </dt>
                  <dd className="text-base font-semibold">
                    <a
                      href={`mailto:${legalInfo.email}`}
                      className="text-primary hover:underline dark:text-secondary-green"
                    >
                      {legalInfo.email}
                    </a>
                  </dd>
                </div>
              </dl>
            </address>
          </div>

          {/* Official Founding & Registration Documents */}
          <div id="documents">
            <h2 className="mb-2 text-2xl font-bold text-black dark:text-white sm:text-3xl">
              {t("documentsTitle")}
            </h2>
            <p className="mb-8 text-base text-gray-600 dark:text-gray-300">
              {t("documentsSubtitle")}
            </p>

            <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-2">
              {/* Official Statute PDF */}
              <article className="rounded-sm border border-dark/15 bg-white p-6 shadow-one dark:border-white/15 dark:bg-gray-dark dark:shadow-none">
                <div className="mb-4 flex items-start gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary dark:bg-secondary-green/15 dark:text-secondary-green">
                    <svg
                      aria-hidden="true"
                      className="h-6 w-6"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-black dark:text-white">
                      {t("statuteTitle")}
                    </h3>
                    <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">
                      {t("statuteMeta")}
                    </p>
                  </div>
                </div>

                <p className="mb-6 text-base leading-relaxed text-gray-700 dark:text-gray-300">
                  {t("statuteSummary")}
                </p>

                <div className="flex flex-wrap gap-3">
                  <a
                    href={legalInfo.statuteUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex min-h-11 items-center gap-2 rounded-md bg-primary px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-primary/90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                  >
                    {t("openStatute")}
                  </a>
                  <a
                    href={legalInfo.statuteUrl}
                    download="Statut_UVM_aprobat.pdf"
                    className="inline-flex min-h-11 items-center gap-2 rounded-md border border-primary px-5 py-2.5 text-sm font-semibold text-primary transition hover:bg-primary/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary dark:border-secondary-green dark:text-secondary-green dark:hover:bg-secondary-green/10 dark:focus-visible:outline-secondary-green"
                  >
                    {t("downloadStatute")}
                  </a>
                </div>
              </article>

              {/* State Registration Certificate JPG */}
              <article className="rounded-sm border border-dark/15 bg-white p-6 shadow-one dark:border-white/15 dark:bg-gray-dark dark:shadow-none">
                <div className="mb-4">
                  <h3 className="text-xl font-bold text-black dark:text-white">
                    {t("certificateTitle")}
                  </h3>
                  <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">
                    {t("certificateMeta")}
                  </p>
                </div>

                <CertificatePreview
                  src={legalInfo.certificateUrl}
                  alt={t("certificateAlt")}
                  width={legalInfo.certificateWidth}
                  height={legalInfo.certificateHeight}
                  caption={t("certificateCaption")}
                  title={t("certificateTitle")}
                  previewLabel={t("previewCertificate")}
                  closeLabel={t("closePreview")}
                />

                <div className="flex flex-wrap gap-3">
                  <a
                    href={legalInfo.certificateUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex min-h-11 items-center gap-2 rounded-md bg-primary px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-primary/90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                  >
                    {t("openCertificate")}
                  </a>
                  <a
                    href={legalInfo.certificateUrl}
                    download="Extras_RSUD_UVM.jpg"
                    className="inline-flex min-h-11 items-center gap-2 rounded-md border border-primary px-5 py-2.5 text-sm font-semibold text-primary transition hover:bg-primary/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary dark:border-secondary-green dark:text-secondary-green dark:hover:bg-secondary-green/10 dark:focus-visible:outline-secondary-green"
                  >
                    {t("downloadCertificate")}
                  </a>
                </div>
              </article>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default TransparencyPage;

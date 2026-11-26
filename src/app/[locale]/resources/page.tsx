import Breadcrumb from "@/components/Common/Breadcrumb";
import { supportedLocales } from "@/constants";
import { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { getPageMetadata } from "@/utils/metadata";
import Resources from "@/components/Resources";

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return getPageMetadata(locale, "resourcesPage");
}

export function generateStaticParams() {
  return supportedLocales.map((locale) => ({ locale }));
}

export default async function ResourcesPage({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "resourcesPage" });

  return (
    <>
      <Breadcrumb
        pageName={t("title")}
        description={t("description")}
        homeHref={`/${locale}`}
      />
      <Resources locale={locale} limit={0} showTitle={false} showExploreMore={false} />
    </>
  );
}

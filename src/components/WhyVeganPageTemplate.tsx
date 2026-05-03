import {supportedLocales} from "@/constants";
import {Metadata} from "next";
import {getPageMetadata} from "@/utils/metadata";
import WpArticleContent from "@/components/WpArticleContent";

type WhyVeganPageProps = {
  params: Promise<{ locale: string }>;
};

interface WhyVeganPageConfig {
  pageKey: string;
  metadataNamespace: string;
  bugReportPath: string;
}

export function createWhyVeganPage({ pageKey, metadataNamespace, bugReportPath }: WhyVeganPageConfig) {
  const Page = async ({ params }: WhyVeganPageProps) => {
    const { locale } = await params;

    return (
      <WpArticleContent
        pageKey={pageKey}
        locale={locale}
        bugReportPath={bugReportPath}
      />
    );
  };

  const generateMetadata = async ({ params }: WhyVeganPageProps): Promise<Metadata> => {
    const { locale } = await params;
    return getPageMetadata(locale, metadataNamespace);
  };

  const generateStaticParams = () => {
    return supportedLocales.map(locale => ({ locale }));
  };

  return { Page, generateMetadata, generateStaticParams };
}

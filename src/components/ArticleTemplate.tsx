import {supportedLocales} from "@/constants";
import {Metadata} from "next";
import {getPageMetadata} from "@/utils/metadata";
import WpArticleContent from "@/components/WpArticleContent";

type ArticleProps = {
  params: Promise<{ locale: string }>;
};

interface ArticleConfig {
  pageKey: string;
  metadataNamespace: string;
  articleUri: string;
}

export function createArticle({ pageKey, metadataNamespace, articleUri }: ArticleConfig) {
  const Page = async ({ params }: ArticleProps) => {
    const { locale } = await params;

    return (
      <WpArticleContent
        pageKey={pageKey}
        locale={locale}
        articleUri={articleUri}
      />
    );
  };

  const generateMetadata = async ({ params }: ArticleProps): Promise<Metadata> => {
    const { locale } = await params;
    return getPageMetadata(locale, metadataNamespace);
  };

  const generateStaticParams = () => {
    return supportedLocales.map(locale => ({ locale }));
  };

  return { Page, generateMetadata, generateStaticParams };
}

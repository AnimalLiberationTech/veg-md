import {createArticle} from "@/components/ArticleTemplate";

const { Page, generateMetadata: generateMetadataImpl, generateStaticParams } = createArticle({
  pageKey: 'veganForHealth',
  metadataNamespace: 'veganForHealthPage',
  articleUri: '/why-vegan/health'
});

export const generateMetadata: typeof generateMetadataImpl = generateMetadataImpl;
export { generateStaticParams };
export default Page;

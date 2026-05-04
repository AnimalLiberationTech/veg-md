import {createArticle} from "@/components/ArticleTemplate";

const { Page, generateMetadata: generateMetadataImpl, generateStaticParams } = createArticle({
  pageKey: 'veganForEnvironment',
  metadataNamespace: 'veganForEnvironmentPage',
  articleUri: '/why-vegan/planet'
});

export const generateMetadata: typeof generateMetadataImpl = generateMetadataImpl;
export { generateStaticParams };
export default Page;
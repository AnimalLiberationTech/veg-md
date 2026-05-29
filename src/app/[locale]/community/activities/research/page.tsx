import {createArticle} from "@/components/ArticleTemplate";

const { Page, generateMetadata: generateMetadataImpl, generateStaticParams } = createArticle({
  pageKey: 'researchLab',
  metadataNamespace: 'researchLabPage',
  articleUri: '/community/activities/research'
});

export const generateMetadata: typeof generateMetadataImpl = generateMetadataImpl;
export { generateStaticParams };
export default Page;


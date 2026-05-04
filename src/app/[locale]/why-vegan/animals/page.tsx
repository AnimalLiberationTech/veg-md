import {createArticle} from "@/components/ArticleTemplate";

const { Page, generateMetadata: generateMetadataImpl, generateStaticParams } = createArticle({
  pageKey: 'veganForAnimals',
  metadataNamespace: 'veganForAnimalsPage',
  articleUri: '/why-vegan/animals'
});

export const generateMetadata: typeof generateMetadataImpl = generateMetadataImpl;
export { generateStaticParams };
export default Page;

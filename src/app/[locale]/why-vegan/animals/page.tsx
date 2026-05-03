import {createWhyVeganPage} from "@/components/WhyVeganPageTemplate";

const { Page, generateMetadata: generateMetadataImpl, generateStaticParams } = createWhyVeganPage({
  pageKey: 'veganForAnimals',
  metadataNamespace: 'veganForAnimalsPage',
  articleUri: '/why-vegan/animals'
});

export const generateMetadata: typeof generateMetadataImpl = generateMetadataImpl;
export { generateStaticParams };
export default Page;

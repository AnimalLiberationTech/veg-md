import {createWhyVeganPage} from "@/components/WhyVeganPageTemplate";

const { Page, generateMetadata: generateMetadataImpl, generateStaticParams } = createWhyVeganPage({
  pageKey: 'veganForHealth',
  metadataNamespace: 'veganForHealthPage',
  articleUri: '/why-vegan/health'
});

export const generateMetadata: typeof generateMetadataImpl = generateMetadataImpl;
export { generateStaticParams };
export default Page;

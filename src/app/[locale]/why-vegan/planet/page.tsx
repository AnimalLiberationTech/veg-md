import {createWhyVeganPage} from "@/components/WhyVeganPageTemplate";

const { Page, generateMetadata: generateMetadataImpl, generateStaticParams } = createWhyVeganPage({
  pageKey: 'veganForEnvironment',
  metadataNamespace: 'veganForEnvironmentPage',
  articleUri: '/why-vegan/planet'
});

export const generateMetadata: typeof generateMetadataImpl = generateMetadataImpl;
export { generateStaticParams };
export default Page;
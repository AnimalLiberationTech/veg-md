import Breadcrumb from "@/components/Common/Breadcrumb";
import Contact from "@/components/Contact";

import { Metadata } from "next";
import {supportedLocales} from "@/constants";

type Props = {
  params: Promise<{ locale: string }>;
};

export const metadata: Metadata = {
  title: "Contact Page | Free Next.js Template for Startup and SaaS",
  description: "This is Contact Page for Startup Nextjs Template",
  // other metadata
};

export function generateStaticParams() { return supportedLocales.map(locale => ({ locale })); }

const ContactPage = async ({params}: Props) => {
  const {locale} = await params;

  return (
    <>
      <Breadcrumb
        pageName="Contact Page"
        description="Lorem ipsum dolor sit amet, consectetur adipiscing elit. In varius eros eget sapien consectetur ultrices. Ut quis dapibus libero."
        homeHref={`/${locale}`}
      />

      <Contact />
    </>
  );
};

export default ContactPage;

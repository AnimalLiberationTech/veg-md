import Breadcrumb from "@/components/Common/Breadcrumb";
import Friends from "@/components/Friends";
import { supportedLocales } from "@/constants";
import { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { getPageMetadata } from "@/utils/metadata";

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return getPageMetadata(locale, "partnersAndFriendsPage");
}

export function generateStaticParams() {
  return supportedLocales.map((locale) => ({ locale }));
}

const FriendsPage = async ({ params }: Props) => {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "partnersAndFriendsPage" });
  const globalT = await getTranslations({ locale, namespace: "global" });

   const friends = [
     {
       id: 1,
       name: globalT("uvm"),
       image: "/images/friends/UVM_logo.png",
       url: "https://uvem.org",
     },
     {
       id: 2,
       name: "We The Free",
       image: "/images/friends/WTF_logo.png",
       url: "https://www.activism.wtf/",
       logoBackgroundColor: "#071431",
     },
   ];

  return (
    <>
      <Breadcrumb
        pageName={t("title")}
        description={t("description")}
        homeHref={`/${locale}`}
      />
      <Friends friends={friends} />
    </>
  );
};

export default FriendsPage;


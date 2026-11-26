import { notFound } from "next/navigation";
import { supportedLocales } from "@/constants";

export function generateStaticParams() {
  return supportedLocales.map((locale) => ({ locale }));
}

const FriendsPage = () => {
  notFound();
};

export default FriendsPage;


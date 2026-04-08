import Image from "next/image";
import Breadcrumb from "@/components/Common/Breadcrumb";
import Markdown from "@/components/Common/Markdown";
import PhotoCredit from "@/components/Common/PhotoCredit";
import {supportedLocales} from "@/constants";
import {Metadata} from "next";
import {getTranslations} from "next-intl/server";
import {getPageMetadata} from "@/utils/metadata";
import {readFile} from "node:fs/promises";
import path from "node:path";

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({params}: Props): Promise<Metadata> {
  const {locale} = await params;
  return getPageMetadata(locale, "valuesPage");
}

export function generateStaticParams() {
  return supportedLocales.map((locale) => ({locale}));
}

const markdownByLocale: Record<string, string> = {
  ro: "values.ro.md",
  ru: "values.ru.md",
  en: "values.en.md",
};

const contentRoot = path.join(process.cwd(), "src", "markdown", "community");

async function readValuesMarkdown(locale: string): Promise<string> {
  const fileName = markdownByLocale[locale] ?? markdownByLocale.en;
  const filePath = path.join(contentRoot, fileName);
  return readFile(filePath, "utf8");
}

const ValuesPage = async ({params}: Props) => {
  const {locale} = await params;
  const t = await getTranslations({locale, namespace: "valuesPage"});
  const markdown = await readValuesMarkdown(locale);

  return (
    <>
      <Breadcrumb
        pageName={t("title")}
        homeHref={`/${locale}`}
      />
      <section className="pb-16 md:pb-20 lg:pb-28">
        <div className="container">
          <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_380px]">
            <div className="min-w-0">
              <Markdown content={markdown} />
            </div>
            <aside className="relative overflow-hidden rounded-sm border border-dark/10 bg-white shadow-three dark:border-white/10 dark:bg-black dark:shadow-none">
              <div className="relative aspect-square w-full">
                <Image
                  src="/images/values/pexels-idilcelikler-33606841.jpg"
                  alt={t("imageAlt")}
                  fill
                  className="object-cover object-center"
                />
                <PhotoCredit
                  creditLabel="Photo by İdil Çelikler"
                  creditHref="https://www.pexels.com/@idilcelikler/"
                  className="absolute bottom-2 right-2 rounded bg-black/60 px-2 py-1 text-[11px] italic text-white/90 hover:underline"
                />
              </div>
            </aside>
          </div>
        </div>
      </section>
    </>
  );
};

export default ValuesPage;


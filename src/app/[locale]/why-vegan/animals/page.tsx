import {supportedLocales} from "@/constants";
import {Metadata} from "next";
import Markdown from "@/components/Common/Markdown";
import {getPageMetadata} from "@/utils/metadata";
import {readFile} from "node:fs/promises";
import path from "node:path";

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return getPageMetadata(locale, 'veganForAnimalsPage');
}

export function generateStaticParams() { return supportedLocales.map(locale => ({ locale })); }

const markdownByLocale: Record<string, string> = {
  ro: "animals.ro.md",
  ru: "animals.ru.md",
  en: "animals.en.md",
};

const contentRoot = path.join(process.cwd(), "src", "markdown", "why-vegan");

async function readAnimalsMarkdown(locale: string): Promise<string> {
  const fileName = markdownByLocale[locale] ?? markdownByLocale.en;
  const filePath = path.join(contentRoot, fileName);
  return readFile(filePath, "utf8");
}

const VeganForAnimalsPage = async ({ params }: Props) => {
  const { locale } = await params;
  const markdown = await readAnimalsMarkdown(locale);

  return (
    <>
      <section className="pt-37.5 pb-30">
        <div className="container">
          <div className="-mx-4 flex flex-wrap justify-center">
            <div className="w-full px-4 lg:w-8/12">
              <div>
                <Markdown content={markdown} />
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default VeganForAnimalsPage;

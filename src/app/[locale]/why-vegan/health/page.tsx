import Image from "next/image";
import {supportedLocales} from "@/constants";
import {Metadata} from "next";
import {getTranslations} from "next-intl/server";
import {getPageMetadata} from "@/utils/metadata";

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return getPageMetadata(locale, 'veganForHealthPage');
}

export function generateStaticParams() { return supportedLocales.map(locale => ({ locale })); }

const VeganForHealthPage = async ({ params }: Props) => {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "veganForHealthPage" });

  return (
    <>
      <section className="pt-37.5 pb-30">
        <div className="container">
          <div className="-mx-4 flex flex-wrap justify-center">
            <div className="w-full px-4 lg:w-8/12">
              <div>
                <h2 className="mb-8 text-3xl leading-tight font-bold text-black sm:text-4xl sm:leading-tight dark:text-white">
                  {t("title")}
                </h2>

                <div>
                  <p className="text-body-color mb-10 text-base leading-relaxed font-medium sm:text-lg sm:leading-relaxed lg:text-base lg:leading-relaxed xl:text-lg xl:leading-relaxed">
                    {t("description")}
                  </p>

                  <p className="text-body-color mb-10 text-base leading-relaxed font-medium sm:text-lg sm:leading-relaxed lg:text-base lg:leading-relaxed xl:text-lg xl:leading-relaxed">
                    {t("healthOpinion")}
                  </p>

                  <p className="text-body-color mb-10 text-base leading-relaxed font-medium sm:text-lg sm:leading-relaxed lg:text-base lg:leading-relaxed xl:text-lg xl:leading-relaxed">
                    {t("diseasePrevention")}
                  </p>

                  <div className="bg-primary/10 relative z-10 mb-10 overflow-hidden rounded-md p-8 md:p-9 lg:p-8 xl:p-9">
                    <p className="text-body-color text-center text-base font-medium italic">
                      {t("mortalityCause")}
                    </p>
                  </div>

                  <p className="text-body-color mb-10 text-base leading-relaxed font-medium sm:text-lg sm:leading-relaxed lg:text-base lg:leading-relaxed xl:text-lg xl:leading-relaxed">
                    {t("digestiveSystem")}
                  </p>

                  <p className="text-body-color mb-10 text-base leading-relaxed font-medium sm:text-lg sm:leading-relaxed lg:text-base lg:leading-relaxed xl:text-lg xl:leading-relaxed">
                    {t("chemicalProcessing")}
                  </p>

                  <p className="text-body-color mb-10 text-base leading-relaxed font-medium sm:text-lg sm:leading-relaxed lg:text-base lg:leading-relaxed xl:text-lg xl:leading-relaxed">
                    {t("anatomicalStructure")}
                  </p>

                  <h3 className="font-xl mb-10 leading-tight font-bold text-black sm:text-2xl sm:leading-tight lg:text-xl lg:leading-tight xl:text-2xl xl:leading-tight dark:text-white">
                    {t("proteinNorm")}
                  </h3>

                  <p className="text-body-color mb-10 text-base leading-relaxed font-medium sm:text-lg sm:leading-relaxed lg:text-base lg:leading-relaxed xl:text-lg xl:leading-relaxed">
                    {t("plantProteins")}
                  </p>

                  <p className="text-body-color mb-10 text-base leading-relaxed font-medium sm:text-lg sm:leading-relaxed lg:text-base lg:leading-relaxed xl:text-lg xl:leading-relaxed">
                    {t("workCapacity")}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default VeganForHealthPage;

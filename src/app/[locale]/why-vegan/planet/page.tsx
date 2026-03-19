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
  return getPageMetadata(locale, 'veganForEnvironmentPage');
}

export function generateStaticParams() { return supportedLocales.map(locale => ({ locale })); }

const VeganForEnvironmentPage = async ({ params }: Props) => {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "veganForEnvironmentPage" });

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
                  
                  <div className="mb-10 w-full overflow-hidden rounded-sm">
                    <div className="relative aspect-97/60 w-full sm:aspect-97/44">
                      <Image
                        src="/images/why-vegan/manurelagoon.jpeg"
                        alt={t("manureLagoonImgDesc")}
                        fill
                        className="object-cover object-center"
                      />
                    </div>
                    <p className="mt-2 text-sm text-body-color italic">
                      {t("manureLagoonImgDesc")}
                    </p>
                  </div>

                  <p className="text-body-color mb-8 text-base leading-relaxed font-medium sm:text-lg sm:leading-relaxed lg:text-base lg:leading-relaxed xl:text-lg xl:leading-relaxed">
                    {t("destruction")}
                  </p>

                  <p className="text-body-color mb-10 text-base leading-relaxed font-medium sm:text-lg sm:leading-relaxed lg:text-base lg:leading-relaxed xl:text-lg xl:leading-relaxed">
                    {t("greenhouseGas")}
                  </p>

                  <div className="mb-10 w-full overflow-hidden rounded-sm">
                    <div className="relative aspect-97/60 w-full sm:aspect-97/44">
                      <Image
                        src="/images/why-vegan/rioovergrazed.jpeg"
                        alt={t("soilErosionImgDesc")}
                        fill
                        className="object-cover object-center"
                      />
                    </div>
                    <p className="mt-2 text-sm text-body-color italic">
                      {t("soilErosionImgDesc")}
                    </p>
                  </div>

                  <p className="text-body-color mb-10 text-base leading-relaxed font-medium sm:text-lg sm:leading-relaxed lg:text-base lg:leading-relaxed xl:text-lg xl:leading-relaxed">
                    {t("waterPollution")}
                  </p>

                  <div className="flex flex-wrap -mx-2 mb-10">
                    <div className="w-full sm:w-1/2 px-2 mb-4">
                       <div className="relative aspect-square w-full overflow-hidden rounded-sm">
                         <Image
                           src="/images/why-vegan/CrowdedPigs.jpeg"
                           alt="Crowded Pigs"
                           fill
                           className="object-cover object-center"
                         />
                       </div>
                    </div>
                    <div className="w-full sm:w-1/2 px-2 mb-4">
                       <div className="relative aspect-square w-full overflow-hidden rounded-sm">
                         <Image
                           src="/images/why-vegan/TurkeyHouse.jpeg"
                           alt="Turkey House"
                           fill
                           className="object-cover object-center"
                         />
                       </div>
                    </div>
                  </div>

                  <p className="text-body-color mb-10 text-base leading-relaxed font-medium sm:text-lg sm:leading-relaxed lg:text-base lg:leading-relaxed xl:text-lg xl:leading-relaxed">
                    {t("efficiencyComparison")}
                  </p>

                  <h3 className="font-xl mb-10 leading-tight font-bold text-black sm:text-2xl sm:leading-tight lg:text-xl lg:leading-tight xl:text-2xl xl:leading-tight dark:text-white">
                    {t("environmentalImpacts")}
                  </h3>

                  <p className="text-body-color mb-10 text-base leading-relaxed font-medium sm:text-lg sm:leading-relaxed lg:text-base lg:leading-relaxed xl:text-lg xl:leading-relaxed">
                    {t("faoReport")}
                  </p>

                  <div className="bg-primary/10 relative z-10 mb-10 overflow-hidden rounded-md p-8 md:p-9 lg:p-8 xl:p-9">
                    <p className="text-body-color text-center text-base font-medium italic">
                      {t("fossilFuelEnergy")}
                    </p>
                  </div>

                  <p className="text-body-color mb-10 text-base leading-relaxed font-medium sm:text-lg sm:leading-relaxed lg:text-base lg:leading-relaxed xl:text-lg xl:leading-relaxed">
                    {t("wasteProduction")}
                  </p>

                  <p className="text-body-color mb-10 text-base leading-relaxed font-medium sm:text-lg sm:leading-relaxed lg:text-base lg:leading-relaxed xl:text-lg xl:leading-relaxed">
                    {t("airAndWaterPollution")}
                  </p>

                  <p className="text-body-color mb-10 text-base leading-relaxed font-medium sm:text-lg sm:leading-relaxed lg:text-base lg:leading-relaxed xl:text-lg xl:leading-relaxed">
                    {t("unauthorizedGrazing")}
                  </p>

                  <div className="mb-10 w-full overflow-hidden rounded-sm">
                    <div className="relative aspect-97/60 w-full sm:aspect-97/44">
                      <Image
                        src="/images/why-vegan/TwoTurkeyTrucks.jpeg"
                        alt="Turkey Trucks"
                        fill
                        className="object-cover object-center"
                      />
                    </div>
                  </div>

                  <h4 className="font-xl mb-6 leading-tight font-bold text-black sm:text-2xl sm:leading-tight lg:text-xl lg:leading-tight xl:text-2xl xl:leading-tight dark:text-white">
                    {t("proteinConversionTitle")}
                  </h4>

                  <p className="text-body-color mb-10 text-base leading-relaxed font-medium sm:text-lg sm:leading-relaxed lg:text-base lg:leading-relaxed xl:text-lg xl:leading-relaxed">
                    {t("proteinConversionDesc")}
                  </p>

                  <p className="text-body-color mb-10 text-base leading-relaxed font-medium sm:text-lg sm:leading-relaxed lg:text-base lg:leading-relaxed xl:text-lg xl:leading-relaxed">
                    {t("hormonesAndPoisons")}
                  </p>

                  <p className="text-body-color mb-10 text-base leading-relaxed font-medium sm:text-lg sm:leading-relaxed lg:text-base lg:leading-relaxed xl:text-lg xl:leading-relaxed">
                    {t("toxicBombs")}
                  </p>

                  <p className="text-body-color mb-10 text-base leading-relaxed font-medium sm:text-lg sm:leading-relaxed lg:text-base lg:leading-relaxed xl:text-lg xl:leading-relaxed">
                    {t("documentaryHome")}
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

export default VeganForEnvironmentPage;

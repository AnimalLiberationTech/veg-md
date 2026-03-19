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
  return getPageMetadata(locale, 'veganForAnimalsPage');
}

export function generateStaticParams() { return supportedLocales.map(locale => ({ locale })); }

const VeganForAnimalsPage = async ({ params }: Props) => {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "veganForAnimalsPage" });

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
                    {t("financialSupport")}
                  </p>

                  <div className="flex flex-wrap -mx-2 mb-10">
                    <div className="w-full sm:w-1/2 px-2 mb-4">
                       <div className="relative aspect-square w-full overflow-hidden rounded-sm">
                         <Image
                           src="/images/why-vegan/cow_and_calf.jpeg"
                           alt={t("cowAndCalfImg")}
                           fill
                           className="object-cover object-center"
                         />
                       </div>
                    </div>
                    <div className="w-full sm:w-1/2 px-2 mb-4">
                       <div className="relative aspect-square w-full overflow-hidden rounded-sm">
                         <Image
                           src="/images/why-vegan/birds.jpeg"
                           alt={t("birdsImg")}
                           fill
                           className="object-cover object-center"
                         />
                       </div>
                    </div>
                  </div>

                  <p className="text-body-color mb-10 text-base leading-relaxed font-medium sm:text-lg sm:leading-relaxed lg:text-base lg:leading-relaxed xl:text-lg xl:leading-relaxed">
                    {t("animalSuffering")}
                  </p>

                  <div className="mb-10 w-full overflow-hidden rounded-sm">
                    <div className="relative aspect-97/60 w-full sm:aspect-97/44">
                      <Image
                        src="/images/why-vegan/pig_in_mud.jpeg"
                        alt={t("pigInMudImg")}
                        fill
                        className="object-cover object-center"
                      />
                    </div>
                  </div>

                  <p className="text-body-color mb-10 text-base leading-relaxed font-medium sm:text-lg sm:leading-relaxed lg:text-base lg:leading-relaxed xl:text-lg xl:leading-relaxed">
                    {t("intelligenceArgument")}
                  </p>

                  <p className="text-body-color mb-10 text-base leading-relaxed font-medium sm:text-lg sm:leading-relaxed lg:text-base lg:leading-relaxed xl:text-lg xl:leading-relaxed">
                    {t("futureGenerations")}
                  </p>

                  <p className="text-body-color mb-10 text-base leading-relaxed font-medium sm:text-lg sm:leading-relaxed lg:text-base lg:leading-relaxed xl:text-lg xl:leading-relaxed">
                    {t("humaneWorld")}
                  </p>

                  <p className="text-body-color mb-10 text-base leading-relaxed font-medium sm:text-lg sm:leading-relaxed lg:text-base lg:leading-relaxed xl:text-lg xl:leading-relaxed">
                    {t("hypocrisy")}
                  </p>

                  <h3 className="font-xl mb-10 leading-tight font-bold text-black sm:text-2xl sm:leading-tight lg:text-xl lg:leading-tight xl:text-2xl xl:leading-tight dark:text-white">
                    {t("transformingAnimals")}
                  </h3>

                  <p className="text-body-color mb-10 text-base leading-relaxed font-medium sm:text-lg sm:leading-relaxed lg:text-base lg:leading-relaxed xl:text-lg xl:leading-relaxed">
                    {t("factoryFarms")}
                  </p>

                  <p className="text-body-color mb-10 text-base leading-relaxed font-medium sm:text-lg sm:leading-relaxed lg:text-base lg:leading-relaxed xl:text-lg xl:leading-relaxed">
                    {t("industrialCruelty")}
                  </p>

                  <div className="flex flex-wrap -mx-2 mb-10">
                    <div className="w-full sm:w-1/3 px-2 mb-4">
                       <div className="relative aspect-3/4 w-full overflow-hidden rounded-sm">
                         <Image
                           src="/images/why-vegan/skinningpigs.jpeg"
                           alt={t("skinningPigsImg")}
                           fill
                           className="object-cover object-center"
                         />
                       </div>
                    </div>
                    <div className="w-full sm:w-1/3 px-2 mb-4">
                       <div className="relative aspect-3/4 w-full overflow-hidden rounded-sm">
                         <Image
                           src="/images/why-vegan/chickens_shackled.jpeg"
                           alt={t("chickensShackledImg")}
                           fill
                           className="object-cover object-center"
                         />
                       </div>
                    </div>
                    <div className="w-full sm:w-1/3 px-2 mb-4">
                       <div className="relative aspect-3/4 w-full overflow-hidden rounded-sm">
                         <Image
                           src="/images/why-vegan/sheep_slaughter.jpeg"
                           alt={t("sheepSlaughterImg")}
                           fill
                           className="object-cover object-center"
                         />
                       </div>
                    </div>
                  </div>

                  <p className="text-body-color mb-10 text-base leading-relaxed font-medium sm:text-lg sm:leading-relaxed lg:text-base lg:leading-relaxed xl:text-lg xl:leading-relaxed">
                    {t("slaughterhouseHorrors")}
                  </p>

                  <p className="text-body-color mb-10 text-base leading-relaxed font-medium sm:text-lg sm:leading-relaxed lg:text-base lg:leading-relaxed xl:text-lg xl:leading-relaxed">
                    {t("economicEfficiency")}
                  </p>

                  <p className="text-body-color mb-10 text-base leading-relaxed font-medium sm:text-lg sm:leading-relaxed lg:text-base lg:leading-relaxed xl:text-lg xl:leading-relaxed">
                    {t("pigsInCages")}
                  </p>

                  <div className="flex flex-wrap -mx-2 mb-10">
                    <div className="w-full sm:w-1/2 px-2 mb-4">
                       <div className="relative aspect-square w-full overflow-hidden rounded-sm">
                         <Image
                           src="/images/why-vegan/hanging_turkey.jpeg"
                           alt={t("hangingTurkeyImg")}
                           fill
                           className="object-cover object-center"
                         />
                       </div>
                    </div>
                    <div className="w-full sm:w-1/2 px-2 mb-4">
                       <div className="relative aspect-square w-full overflow-hidden rounded-sm">
                         <Image
                           src="/images/why-vegan/chick_debeaked.jpeg"
                           alt={t("chickDebeakedImg")}
                           fill
                           className="object-cover object-center"
                         />
                       </div>
                    </div>
                  </div>

                  <p className="text-body-color mb-10 text-base leading-relaxed font-medium sm:text-lg sm:leading-relaxed lg:text-base lg:leading-relaxed xl:text-lg xl:leading-relaxed">
                    {t("birdsDebeaking")}
                  </p>

                  <p className="text-body-color mb-10 text-base leading-relaxed font-medium sm:text-lg sm:leading-relaxed lg:text-base lg:leading-relaxed xl:text-lg xl:leading-relaxed">
                    {t("poultrySlaughter")}
                  </p>

                  <div className="flex flex-wrap -mx-2 mb-10">
                    <div className="w-full sm:w-1/3 px-2 mb-4">
                       <div className="relative aspect-square w-full overflow-hidden rounded-sm">
                         <Image
                           src="/images/why-vegan/chicken_factory.jpeg"
                           alt={t("chickenFactoryImg")}
                           fill
                           className="object-cover object-center"
                         />
                       </div>
                    </div>
                    <div className="w-full sm:w-1/3 px-2 mb-4">
                       <div className="relative aspect-square w-full overflow-hidden rounded-sm">
                         <Image
                           src="/images/why-vegan/battery_cages.jpeg"
                           alt={t("batteryCagesImg")}
                           fill
                           className="object-cover object-center"
                         />
                       </div>
                    </div>
                    <div className="w-full sm:w-1/3 px-2 mb-4">
                       <div className="relative aspect-square w-full overflow-hidden rounded-sm">
                         <Image
                           src="/images/why-vegan/piglets_in_cages.jpeg"
                           alt={t("pigletsInCagesImg")}
                           fill
                           className="object-cover object-center"
                         />
                       </div>
                    </div>
                  </div>

                  <p className="text-body-color mb-10 text-base leading-relaxed font-medium sm:text-lg sm:leading-relaxed lg:text-base lg:leading-relaxed xl:text-lg xl:leading-relaxed">
                    {t("broilerGrowth")}
                  </p>

                  <p className="text-body-color mb-10 text-base leading-relaxed font-medium sm:text-lg sm:leading-relaxed lg:text-base lg:leading-relaxed xl:text-lg xl:leading-relaxed">
                    {t("transportation")}
                  </p>

                  <div className="flex flex-wrap -mx-2 mb-10">
                    <div className="w-full sm:w-1/2 px-2 mb-4">
                       <div className="relative aspect-video w-full overflow-hidden rounded-sm">
                         <Image
                           src="/images/why-vegan/broken_neck.jpeg"
                           alt={t("brokenNeckImg")}
                           fill
                           className="object-cover object-center"
                         />
                       </div>
                    </div>
                    <div className="w-full sm:w-1/2 px-2 mb-4">
                       <div className="relative aspect-video w-full overflow-hidden rounded-sm">
                         <Image
                           src="/images/why-vegan/bison_slaughter.jpeg"
                           alt={t("bisonSlaughterImg")}
                           fill
                           className="object-cover object-center"
                         />
                       </div>
                    </div>
                  </div>

                  <p className="text-body-color mb-10 text-base leading-relaxed font-medium sm:text-lg sm:leading-relaxed lg:text-base lg:leading-relaxed xl:text-lg xl:leading-relaxed">
                    {t("wildlifeProtection")}
                  </p>

                  <div className="bg-primary/10 relative z-10 mb-10 overflow-hidden rounded-md p-8 md:p-9 lg:p-8 xl:p-9">
                    <p className="text-body-color text-center text-base font-medium italic">
                      {t("dontSupportCruelty")}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default VeganForAnimalsPage;

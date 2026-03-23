import SectionTitle from "../Common/SectionTitle";
import SingleResource from "./SingleResource";
import {getResourcesData} from "./resourcesData";
import {getTranslations} from "next-intl/server";
import { ExpandedResourceProvider } from "./expanded-resource-context";

const Resources = async ({locale}: {locale: string}) => {
  const t = await getTranslations({locale, namespace: "resources"});
  const resourcesData = await getResourcesData(locale);

  const getTranslatedType = (type: string | undefined): string | undefined => {
    if (!type) return undefined;
    try {
      return t(`types.${type}`);
    } catch {
      return type;
    }
  };

  return (
    <>
      <section id="resources" className="py-8 md:py-10 lg:py-14">
        <div className="container">
          <SectionTitle
            title={t("learnMore")}
            paragraph=""
            center
            className="hidden md:block"
          />

          <ExpandedResourceProvider>
            <div className="grid grid-cols-1 gap-x-8 gap-y-14 md:grid-cols-2 lg:grid-cols-3">
              {resourcesData.map((feature) => (
                <SingleResource 
                  key={feature.id} 
                  feature={feature}
                  translatedType={getTranslatedType(feature.type)}
                />
              ))}
            </div>
          </ExpandedResourceProvider>

          <div className="mt-12 flex justify-center">
            <a
              href="https://3movies.wtf/viata"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center rounded-lg bg-dark px-8 py-4 text-base font-semibold text-white duration-300 ease-in-out hover:bg-dark/90 hover:shadow-lg dark:bg-white dark:text-dark dark:hover:bg-white/90"
            >
              {t("exploreMore")}
              <svg className="ml-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>
          </div>
        </div>
      </section>
    </>
  );
};

export default Resources;

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
        </div>
      </section>
    </>
  );
};

export default Resources;

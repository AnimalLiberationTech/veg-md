import Breadcrumb from "@/components/Common/Breadcrumb";
import { getResourceBySlug, getAllResourceSlugs } from "@/components/Resources/resourcesData";
import { supportedLocales } from "@/constants";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { getEmbeddedSrc, getExternalUrl } from "@/utils/resource-utils";

type Props = {
  params: Promise<{ locale: string; slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  const resource = await getResourceBySlug(slug, locale);

  if (!resource) {
    return {};
  }

  return {
    title: resource.title,
    description: resource.description,
    openGraph: {
      title: resource.title,
      description: resource.description,
      images: [resource.image_url],
    },
  };
}

export async function generateStaticParams() {
  const slugs = await getAllResourceSlugs();
  const params = [];
  for (const locale of supportedLocales) {
    for (const slug of slugs) {
      params.push({ locale, slug });
    }
  }
  return params;
}

export default async function ResourcePage({ params }: Props) {
  const { locale, slug } = await params;
  const resource = await getResourceBySlug(slug, locale);

  if (!resource) {
    notFound();
  }

  const t = await getTranslations({ locale, namespace: "resources" });

  const primaryLink = resource.links?.find((link) => link.url?.trim());
  const finalEmbedSrc = primaryLink ? getEmbeddedSrc(primaryLink.type, primaryLink.url) : null;
  const externalUrl = primaryLink ? getExternalUrl(primaryLink.type, primaryLink.url) : null;

  return (
    <>
      <Breadcrumb
        pageName={resource.title}
        description={resource.description}
        homeHref={`/${locale}`}
      />

      <section className="pb-[120px] pt-[120px]">
        <div className="container">
          <div className="-mx-4 flex flex-wrap justify-center">
            <div className="w-full px-4 lg:w-8/12">
              <div>
                {finalEmbedSrc ? (
                  <div className="relative mb-10 aspect-video w-full overflow-hidden rounded">
                    <iframe
                      src={finalEmbedSrc}
                      className="absolute left-0 top-0 h-full w-full"
                      allowFullScreen
                      title={resource.title}
                    ></iframe>
                  </div>
                ) : (
                  <div className="relative mb-10 aspect-video w-full overflow-hidden rounded">
                    <Image
                      src={resource.image_url}
                      alt={resource.title}
                      fill
                      loading="lazy"
                      className="object-cover"
                    />
                  </div>
                )}

                <div className="mb-10">
                  <div className="mb-3 flex items-center gap-4">
                    {resource.type && (
                      <span className="inline-flex items-center justify-center rounded bg-primary/80 px-4 py-1 text-sm font-semibold text-white dark:bg-primary">
                        {t(`types.${resource.type}`)}
                      </span>
                    )}
                  </div>
                  <h2 className="mb-8 text-3xl font-bold leading-tight text-black dark:text-white sm:text-4xl">
                    {resource.title}
                  </h2>
                  <p className="mb-10 text-base font-medium leading-relaxed text-body-color sm:text-lg sm:leading-relaxed">
                    {resource.description}
                  </p>
                  
                  {externalUrl && (
                    <div className="flex flex-wrap items-center gap-4">
                      <a
                        href={externalUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center rounded-md bg-primary px-10 py-3 text-base font-bold text-white transition duration-300 ease-in-out hover:bg-opacity-90 hover:shadow-signUp"
                      >
                        {t("exploreMore")}
                      </a>
                      <a
                        href={externalUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-base font-medium text-body-color hover:text-primary dark:text-white dark:hover:text-primary break-all"
                      >
                        {externalUrl}
                      </a>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

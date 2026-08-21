"use client";

import VideoModal from "@/components/video-modal";
import { Feature, ResourceLink } from "@/types/feature";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { useExpandedResource } from "./expanded-resource-context";
import { Link } from "@/i18n/navigation";
import { getEmbeddedSrc, getExternalUrl } from "@/utils/resource-utils";

const SingleResource = ({ feature, translatedType }: { feature: Feature; translatedType?: string }) => {
  const { id, title, description, image_url, type, slug, links = [] } = feature;
  const t = useTranslations("resources");
  const { expandedResourceId, setExpandedResourceId } = useExpandedResource();
  const isExpanded = expandedResourceId === id;
  const [isEmbeddedOpen, setIsEmbeddedOpen] = useState(false);
  const [embeddedSrc, setEmbeddedSrc] = useState("");

  const handleViewMore = () => {
    if (isExpanded) {
      setExpandedResourceId(null);
    } else {
      setExpandedResourceId(id);
    }
  };

  const handleResourceClick = () => {
    if (slug) return; // Handled by Link

    const primaryLink = links.find((link) => link.url?.trim());
    if (!primaryLink) return;

    const src = getEmbeddedSrc(primaryLink.type, primaryLink.url);
    if (src) {
      setEmbeddedSrc(src);
      setIsEmbeddedOpen(true);
      return;
    }

    const externalUrl = getExternalUrl(primaryLink.type, primaryLink.url);
    if (!externalUrl) return;
    window.open(externalUrl, "_blank", "noopener,noreferrer");
  };

  const ResourceTitle = () => {
    const content = (
      <span className="text-left cursor-pointer hover:text-primary dark:hover:text-primary">
        {title}
      </span>
    );

    if (slug) {
      return <Link href={`/resources/${slug}`}>{content}</Link>;
    }

    return (
      <button type="button" onClick={handleResourceClick}>
        {content}
      </button>
    );
  };

  const ResourceImage = () => {
    const content = (
      <>
        <Image
          src={image_url}
          alt={title}
          fill
          loading="lazy"
          className="object-cover hover:scale-105 transition-transform duration-300"
        />
        {/* Type Badge */}
        {type && (
          <div className="absolute top-2 right-2 bg-primary/80 dark:bg-primary text-white px-3 py-1 rounded text-xs font-semibold">
            {translatedType || type}
          </div>
        )}
      </>
    );

    if (slug) {
      return (
        <Link
          href={`/resources/${slug}`}
          className="relative mb-6 block w-full overflow-hidden rounded-lg bg-gray-200 aspect-video text-left cursor-pointer"
        >
          {content}
        </Link>
      );
    }

    return (
      <button
        type="button"
        onClick={handleResourceClick}
        className="relative mb-6 block w-full overflow-hidden rounded-lg bg-gray-200 aspect-video text-left cursor-pointer"
      >
        {content}
      </button>
    );
  };

  return (
    <div className="w-full">
      <div className="wow fadeInUp" data-wow-delay=".15s">
        {/* Image Container */}
        <ResourceImage />

        {/* Content */}
        <h3 className="mb-3 text-xl font-bold text-black sm:text-2xl lg:text-xl xl:text-2xl dark:text-white transition-colors">
          <ResourceTitle />
        </h3>
        <p className={`text-body-color pr-2.5 text-base leading-relaxed font-medium ${!isExpanded ? "line-clamp-3" : ""}`}>
          {description}
        </p>

        {/* View More/Less Button */}
        <button
          onClick={handleViewMore}
          className="mt-4 inline-flex items-center text-primary hover:text-primary/80 font-semibold text-sm transition-colors"
        >
          {isExpanded ? t("viewLess") : t("viewMore")}
          <svg className={`w-4 h-4 ml-2 transition-transform ${isExpanded ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      <VideoModal
        isOpen={isEmbeddedOpen}
        onClose={() => setIsEmbeddedOpen(false)}
        src={embeddedSrc}
      />
    </div>
  );
};

export default SingleResource;

"use client";

import VideoModal from "@/components/video-modal";
import { Feature, ResourceLink } from "@/types/feature";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { useExpandedResource } from "./expanded-resource-context";

const hasHttpProtocol = (url: string) => /^https?:\/\//i.test(url);

const getExternalUrl = (link: ResourceLink): string | null => {
  const rawUrl = link.url.trim();
  if (!rawUrl) return null;

  const type = link.type.toLowerCase();

  switch (type) {
    case "youtube":
      return hasHttpProtocol(rawUrl) ? rawUrl : `https://www.youtube.com/watch?v=${rawUrl}`;
    case "netflix":
      return hasHttpProtocol(rawUrl) ? rawUrl : `https://www.netflix.com/title/${rawUrl}`;
    case "vk":
      if (hasHttpProtocol(rawUrl)) return rawUrl;
      return rawUrl.startsWith("video")
        ? `https://vk.com/${rawUrl}`
        : `https://vk.com/video-${rawUrl}`;
    case "vimeo":
      return hasHttpProtocol(rawUrl) ? rawUrl : `https://vimeo.com/${rawUrl}`;
    default:
      return hasHttpProtocol(rawUrl) ? rawUrl : `https://${rawUrl}`;
  }
};

const getEmbeddedSrc = (rawValue: string): string | null => {
  const trimmed = rawValue.trim();
  if (!trimmed) return null;

  if (!trimmed.includes("<iframe")) {
    return hasHttpProtocol(trimmed) ? trimmed : null;
  }

  const match = trimmed.match(/src=["']([^"']+)["']/i);
  return match?.[1] ?? null;
};

const SingleResource = ({ feature, translatedType }: { feature: Feature; translatedType?: string }) => {
  const { id, title, description, image_url, type, links = [] } = feature;
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
    const primaryLink = links.find((link) => link.url?.trim());
    if (!primaryLink) return;

    if (primaryLink.type.toLowerCase() === "embedded") {
      const src = getEmbeddedSrc(primaryLink.url);
      if (!src) return;
      setEmbeddedSrc(src);
      setIsEmbeddedOpen(true);
      return;
    }

    const externalUrl = getExternalUrl(primaryLink);
    if (!externalUrl) return;
    window.open(externalUrl, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="w-full">
      <div className="wow fadeInUp" data-wow-delay=".15s">
        {/* Image Container */}
        <button
          type="button"
          onClick={handleResourceClick}
          className="relative mb-6 block w-full overflow-hidden rounded-lg bg-gray-200 aspect-video text-left cursor-pointer"
        >
          <Image
            src={image_url}
            alt={title}
            fill
            className="object-cover hover:scale-105 transition-transform duration-300"
          />
          {/* Type Badge */}
          {type && (
            <div className="absolute top-2 right-2 bg-primary/80 dark:bg-primary text-white px-3 py-1 rounded text-xs font-semibold">
              {translatedType || type}
            </div>
          )}
        </button>

        {/* Content */}
        <h3 className="mb-3 text-xl font-bold text-black sm:text-2xl lg:text-xl xl:text-2xl dark:text-white transition-colors">
          <button
            type="button"
            onClick={handleResourceClick}
            className="text-left cursor-pointer hover:text-primary dark:hover:text-primary"
          >
            {title}
          </button>
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

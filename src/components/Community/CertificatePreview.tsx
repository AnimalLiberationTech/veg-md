"use client";

import Image from "next/image";
import { useId, useRef } from "react";

type CertificatePreviewProps = {
  src: string;
  alt: string;
  width: number;
  height: number;
  caption: string;
  title: string;
  previewLabel: string;
  closeLabel: string;
};

export default function CertificatePreview({
  src,
  alt,
  width,
  height,
  caption,
  title,
  previewLabel,
  closeLabel,
}: CertificatePreviewProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const titleId = useId();

  const openModal = () => {
    dialogRef.current?.showModal();
  };

  return (
    <>
      <figure className="mb-5">
        <button
          type="button"
          onClick={openModal}
          aria-label={previewLabel}
          className="group relative block w-full overflow-hidden rounded-sm border border-dark/15 bg-gray-50 text-left transition hover:border-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary dark:border-white/15 dark:bg-black/40 dark:hover:border-secondary-green dark:focus-visible:outline-secondary-green"
        >
          <div className="relative mx-auto aspect-2166/3121 max-h-96 w-full">
            <Image
              src={src}
              alt={alt}
              width={width}
              height={height}
              loading="lazy"
              className="h-full w-full object-contain p-2 transition duration-300 group-hover:scale-[1.01]"
            />
          </div>
          <span className="flex items-center justify-center gap-2 border-t border-dark/10 bg-white/95 px-4 py-2.5 text-sm font-medium text-primary dark:border-white/10 dark:bg-gray-dark/95 dark:text-secondary-green">
            <svg
              aria-hidden="true"
              className="h-4 w-4 shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 1010.5 18a7.5 7.5 0 006.15-3.35zM10.5 7.5v6m-3-3h6"
              />
            </svg>
            {previewLabel}
          </span>
        </button>
        <figcaption className="mt-2.5 text-sm leading-relaxed text-gray-600 dark:text-gray-300">
          {caption}
        </figcaption>
      </figure>

      <dialog
        ref={dialogRef}
        aria-labelledby={titleId}
        {...({ closedby: "any" } as Record<string, string>)}
        onClick={(event) => {
          if (event.target === dialogRef.current) {
            dialogRef.current.close();
          }
        }}
        className="m-auto max-h-[92vh] w-[min(92vw,56rem)] overflow-hidden rounded-lg border border-dark/20 bg-white p-0 text-black shadow-2xl backdrop:bg-black/75 backdrop:backdrop-blur-xs dark:border-white/20 dark:bg-gray-dark dark:text-white"
      >
        <div className="flex items-center justify-between gap-4 border-b border-dark/10 px-5 py-3.5 dark:border-white/10">
          <h2 id={titleId} className="text-base font-semibold sm:text-lg">
            {title}
          </h2>
          <form method="dialog">
            <button
              type="submit"
              aria-label={closeLabel}
              className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-md border border-dark/15 px-3 py-1.5 text-sm font-medium text-gray-700 transition hover:bg-gray-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary dark:border-white/15 dark:text-gray-200 dark:hover:bg-white/10 dark:focus-visible:outline-secondary-green"
            >
              {closeLabel}
            </button>
          </form>
        </div>
        <div className="max-h-[calc(92vh-4.5rem)] overflow-auto bg-gray-100 p-4 dark:bg-black/60">
          <Image
            src={src}
            alt={alt}
            width={width}
            height={height}
            className="mx-auto h-auto max-w-full rounded-xs shadow-md"
          />
        </div>
      </dialog>
    </>
  );
}

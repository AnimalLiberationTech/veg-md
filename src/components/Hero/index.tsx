"use client";

import {Link} from "@/i18n/navigation";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import PhotoCredit from "@/components/Common/PhotoCredit";

const carouselSlides = [
  {
    src: "/images/carousel/pexels-lukasfst-19571075.jpg",
    creditLabel: "Photo by Lukas Faust",
    creditHref: "https://www.pexels.com/@lukasfst",
  },
  {
    src: "/images/carousel/brigitta-baranyi-IXj2NzgqMwI-unsplash.jpg",
    creditLabel: "Photo by Brigitta Baranyi",
    creditHref: "https://unsplash.com/@bribrnyi",
  },
  {
    src: "/images/carousel/pexels-anntarazevich-8479698.jpg",
    creditLabel: "Photo by Anna Tarazevich",
    creditHref: "https://www.pexels.com/@anntarazevich",
  },
  {
    src: "/images/carousel/woman-standing-and-holding-food-in-bowl-25539501.jpg",
    creditLabel: "Photo by Don Marcus Café",
    creditHref: "https://www.pexels.com/@don-marcus-cafe-1346066855",
  },
  {
    src: "/images/carousel/pexels-she-eats-663643-13788771.jpg",
    creditLabel: "Photo by She Eats",
    creditHref: "https://www.pexels.com/@she-eats-663643/",
  },
  {
    src: "/images/carousel/pexels-shvetsa-12673985.jpg",
    creditLabel: "Photo by Anna Shvets",
    creditHref: "https://www.pexels.com/@shvetsa/",
  },
];

const Hero = () => {
  const t = useTranslations("hero");
  const tResources = useTranslations("resources");
  const [activeSlide, setActiveSlide] = useState(0);

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % carouselSlides.length);
    }, 5000);

    return () => window.clearInterval(intervalId);
  }, []);

  const prevSlide = () => {
    setActiveSlide((prev) => (prev - 1 + carouselSlides.length) % carouselSlides.length);
  };

  const nextSlide = () => {
    setActiveSlide((prev) => (prev + 1) % carouselSlides.length);
  };

  const currentSlide = carouselSlides[activeSlide];

  return (
    <>
      <section
        id="home"
        className="relative z-10 overflow-hidden bg-linear-to-br from-cream via-white to-secondary-green/20
          pb-8 pt-20 dark:bg-linear-to-br dark:from-[#1a1a1a] dark:via-[#0d0d0d] dark:to-dark/50
          md:pb-15 md:pt-30 xl:pb-20 xl:pt-37.5 2xl:pb-25 2xl:pt-45"
      >
        {/* Watercolor background elements */}
        <div className="absolute inset-0 overflow-hidden">
          {/* Soft watercolor circles - using the palette colors */}
          <div className="absolute top-10 -right-20 w-96 h-96 rounded-full bg-linear-to-br from-secondary-green/30 to-transparent blur-3xl opacity-40"></div>
          <div className="absolute -bottom-10 -left-20 w-80 h-80 rounded-full bg-linear-to-tr from-yellow-300/20 to-transparent blur-3xl opacity-30"></div>
          <div className="absolute top-1/2 left-1/4 w-72 h-72 rounded-full bg-linear-to-b from-dark/10 to-transparent blur-3xl opacity-20"></div>
        </div>

        <div className="container relative z-10">
          <div className="-mx-4 flex flex-wrap items-center">
            {/* Text Content */}
            <div className="w-full px-4 pt-10 md:w-2/3 md:pt-0">
              <div className="md:-mt-6 xl:-mt-7.5 2xl:-mt-9">
                <h1 className="mb-6 text-4xl font-bold leading-tight text-dark dark:text-white sm:text-5xl md:text-5xl lg:text-6xl">
                  {t("mainTitle")} <span className="text-dark relative">{t("highlight")}
                    <span className="absolute -bottom-2 left-0 w-full h-1 bg-yellow-300/40 dark:bg-yellow-300/20"></span>
                  </span> {t("mainTitleEnd")}
                </h1>

                <p className="mb-8 text-base leading-relaxed text-gray-600 dark:text-body-color-dark sm:text-lg">
                  {t("description")}
                </p>

                <div className="flex flex-col gap-4 sm:flex-row sm:gap-5">
                  <Link
                    href="/#resources"
                    className="inline-flex items-center justify-center rounded-lg bg-dark px-8 py-4 text-base font-semibold text-white duration-300 ease-in-out hover:bg-dark/90 hover:shadow-lg"
                  >
                    {tResources("learnMore")}
                    <svg className="ml-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </Link>
                  <Link
                    href="/community/activities"
                    className="inline-flex items-center justify-center rounded-lg border-2 border-dark px-8 py-4 text-base font-semibold text-dark duration-300 ease-in-out hover:bg-dark hover:text-white dark:border-white dark:text-white dark:hover:bg-white dark:hover:text-dark"
                  >
                    {t("joinIn")}
                  </Link>
                </div>
              </div>
            </div>

            {/* Image Section */}
            <div className="hidden w-full px-4 md:block md:w-1/3">
              <div className="relative">
                {/* Decorative watercolor frame */}
                <div className="absolute -inset-4 rounded-2xl bg-linear-to-br from-secondary-green/30 via-yellow-300/20 to-secondary-green/10 blur-xl opacity-60 dark:opacity-40"></div>

                <div className="relative overflow-hidden rounded-2xl shadow-2xl">
                  <Image
                    src={currentSlide.src}
                    alt={currentSlide.creditLabel}
                    width={720}
                    height={960}
                    className="h-auto w-full object-cover"
                    priority
                  />

                  <PhotoCredit
                    creditLabel={currentSlide.creditLabel}
                    creditHref={currentSlide.creditHref}
                    className="absolute bottom-2 right-2 z-20 rounded bg-black/60 px-2 py-1 text-[11px] italic text-white/90 hover:underline"
                  />

                  <button
                    type="button"
                    onClick={prevSlide}
                    aria-label="Previous slide"
                    className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-black/45 p-2 text-white transition hover:bg-black/65"
                  >
                    <span aria-hidden="true">&#8249;</span>
                  </button>
                  <button
                    type="button"
                    onClick={nextSlide}
                    aria-label="Next slide"
                    className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-black/45 p-2 text-white transition hover:bg-black/65"
                  >
                    <span aria-hidden="true">&#8250;</span>
                  </button>

                  <div className="absolute bottom-2 left-2 flex gap-1.5">
                    {carouselSlides.map((slide, index) => (
                      <button
                        key={slide.src}
                        type="button"
                        onClick={() => setActiveSlide(index)}
                        aria-label={`Go to slide ${index + 1}`}
                        className={`h-2 w-2 rounded-full transition ${
                          activeSlide === index ? "bg-white" : "bg-white/45"
                        }`}
                      />
                    ))}
                  </div>

                  {/* Watercolor overlay effect */}
                  <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-dark/20 via-transparent to-transparent"></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Decorative watercolor splashes */}
        <svg
          className="absolute bottom-0 right-0 -z-10 w-1/3 opacity-40 dark:opacity-20"
          viewBox="0 0 200 200"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M100 20C140 20 170 50 170 100C170 140 140 170 100 170C60 170 30 140 30 100C30 50 60 20 100 20Z"
            fill="#347928"
            opacity="0.1"
          />
          <path
            d="M150 80C170 90 180 110 170 130C160 150 140 160 120 150C100 140 90 120 100 100C110 80 130 70 150 80Z"
            fill="#C0EBA6"
            opacity="0.15"
          />
          <path
            d="M60 120C70 140 50 160 30 150C10 140 0 120 10 100C20 80 40 70 60 80C80 90 50 100 60 120Z"
            fill="#FCCD2A"
            opacity="0.1"
          />
        </svg>
      </section>
    </>
  );
};

export default Hero;

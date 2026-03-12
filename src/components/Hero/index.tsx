"use client";

import Link from "next/link";
import Image from "next/image";
import { useTranslations } from "next-intl";

const Hero = () => {
  const t = useTranslations("hero");

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
            <div className="w-full px-4 md:w-1/2">
              <div className="max-w-125">
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
                    href="#resources"
                    className="inline-flex items-center justify-center rounded-lg bg-dark px-8 py-4 text-base font-semibold text-white duration-300 ease-in-out hover:bg-dark/90 hover:shadow-lg"
                  >
                    {t("exploreButton")}
                    <svg className="ml-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </Link>
                  <Link
                    href="/about"
                    className="inline-flex items-center justify-center rounded-lg border-2 border-dark px-8 py-4 text-base font-semibold text-dark duration-300 ease-in-out hover:bg-dark hover:text-white dark:border-white dark:text-white dark:hover:bg-white dark:hover:text-dark"
                  >
                    {t("learnMoreButton")}
                  </Link>
                </div>
              </div>
            </div>

            {/* Image Section */}
            <div className="w-full px-4 md:w-1/2">
              <div className="relative">
                {/* Decorative watercolor frame */}
                <div className="absolute -inset-4 rounded-2xl bg-linear-to-br from-secondary-green/30 via-yellow-300/20 to-secondary-green/10 blur-xl opacity-60 dark:opacity-40"></div>

                <div className="relative overflow-hidden rounded-2xl shadow-2xl">
                  <Image
                    src="/images/hero/salad.jpg"
                    alt="Fresh vegetables and fruits"
                    width={600}
                    height={500}
                    className="h-auto w-full object-cover"
                    priority
                  />

                  {/* Watercolor overlay effect */}
                  <div className="absolute inset-0 bg-linear-to-t from-dark/20 via-transparent to-transparent"></div>

                  {/* Floating card with stats */}
                  <div className="absolute bottom-6 left-6 rounded-xl bg-white/95 dark:bg-gray-dark/95 backdrop-blur-sm p-4 shadow-lg">
                    <p className="mb-2 text-sm font-semibold text-dark dark:text-white">{t("whyVeganCard")}</p>
                    <ul className="space-y-1 text-xs text-gray-700 dark:text-gray-300">
                      <li className="flex items-center gap-2">
                        <span className="inline-block h-1.5 w-1.5 rounded-full bg-dark"></span>
                        {t("healthWellness")}
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="inline-block h-1.5 w-1.5 rounded-full bg-dark"></span>
                        {t("environment")}
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="inline-block h-1.5 w-1.5 rounded-full bg-dark"></span>
                        {t("animalCompassion")}
                      </li>
                    </ul>
                  </div>
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

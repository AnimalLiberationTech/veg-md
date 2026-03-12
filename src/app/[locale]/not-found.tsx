import Link from "next/link";
import {getTranslations} from "next-intl/server";

export default async function NotFound() {
  const t = await getTranslations("notFound");

  return (
    <section className="relative z-10 overflow-hidden bg-cream pb-20 pt-32 dark:bg-black md:pb-24 md:pt-36 lg:pb-28 lg:pt-40">
      <div className="container">
        <div className="mx-auto max-w-3xl rounded-2xl bg-white/90 px-6 py-10 text-center shadow-xl dark:bg-gray-dark/90 sm:px-10 sm:py-12">
          <p className="mb-3 text-sm font-semibold tracking-wider text-dark/70 dark:text-white/70">404</p>
          <h1 className="mb-4 text-3xl font-bold text-dark dark:text-white sm:text-4xl">{t("title")}</h1>
          <p className="mb-8 text-base text-body-color dark:text-body-color-dark sm:text-lg">{t("description")}</p>
          <Link
            href="/"
            className="inline-flex items-center justify-center rounded-lg bg-dark px-8 py-3 text-base font-semibold text-white duration-300 hover:bg-dark/90"
          >
            {t("backHomeButton")}
          </Link>
        </div>
      </div>
    </section>
  );
}


"use client";
import Image from "next/image";
import {Link, usePathname} from "@/i18n/navigation";
import {useLocale, useTranslations} from "next-intl";
import {useEffect, useState} from "react";
import ThemeToggler from "./ThemeToggler";

import {locales} from "@/constants";
import menuData from "./menuData";

const ExternalLinkIcon = () => (
  <svg
    aria-hidden="true"
    className="h-3.5 w-3.5"
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M7 13L13 7M9 7H13V11"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const Header = () => {
  const tMenu = useTranslations("menu");
  const currentLocale = useLocale();

  // submenu handler
  const [openIndex, setOpenIndex] = useState(-1);

  const [navbarOpen, setNavbarOpen] = useState(false);
  const [sticky, setSticky] = useState(false);

  const closeMobileMenu = () => {
    setNavbarOpen(false);
    setOpenIndex(-1);
  };

  const navbarToggleHandler = () => {
    setNavbarOpen(!navbarOpen);
  };

  useEffect(() => {
    const onScroll = () => {
      setSticky(window.scrollY >= 80);

      // On mobile, collapse the menu as soon as user starts scrolling.
      if (navbarOpen && window.innerWidth < 1024) {
        setNavbarOpen(false);
        setOpenIndex(-1);
      }
    };

    window.addEventListener("scroll", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
    };
  }, [navbarOpen]);

  const handleSubmenu = (index: number) => {
    if (openIndex === index) {
      setOpenIndex(-1);
    } else {
      setOpenIndex(index);
    }
  };

  const usePathName = usePathname();

  return (
    <>
      <header
        className={`header top-0 left-0 z-40 flex w-full items-center ${
          sticky
            ? "dark:bg-gray-dark dark:shadow-sticky-dark shadow-sticky fixed z-9999 bg-white/80 backdrop-blur-xs transition"
            : "absolute bg-transparent"
        }`}
      >
        <div className="container">
          <div className="relative -mx-4 flex items-center justify-between">
            <div className="w-60 max-w-full px-4 xl:mr-12">
              <Link
                href="/"
                className={`header-logo block w-full py-2 pb-2`}
              >
                <Image
                  src="/images/logo.png"
                  alt="Vegan Moldova logo"
                  width={120}
                  height={120}
                />
              </Link>
            </div>
            <div className="flex w-full items-center justify-between px-4">
              <div>
                <button
                  onClick={navbarToggleHandler}
                  id="navbarToggler"
                  aria-label="Mobile Menu"
                  className="ring-primary absolute top-1/2 right-4 block translate-y-[-50%] rounded-lg px-3 py-[6px] focus:ring-2 lg:hidden"
                >
                  <span
                    className={`relative my-1.5 block h-0.5 w-7.5 bg-black transition-all duration-300 dark:bg-white ${
                      navbarOpen ? "top-1.75 rotate-45" : " "
                    }`}
                  />
                  <span
                    className={`relative my-1.5 block h-0.5 w-7.5 bg-black transition-all duration-300 dark:bg-white ${
                      navbarOpen ? "opacity-0" : " "
                    }`}
                  />
                  <span
                    className={`relative my-1.5 block h-0.5 w-7.5 bg-black transition-all duration-300 dark:bg-white ${
                      navbarOpen ? "-top-2 -rotate-45" : " "
                    }`}
                  />
                </button>
                <nav
                  id="navbarCollapse"
                  className={`navbar border-body-color/50 dark:border-body-color/20 dark:bg-dark absolute right-0 z-30 w-[250px] rounded border-[.5px] bg-white px-6 py-4 duration-300 lg:visible lg:static lg:w-auto lg:border-none lg:!bg-transparent lg:p-0 lg:opacity-100 ${
                    navbarOpen
                      ? "visibility top-full opacity-100"
                      : "invisible top-[120%] opacity-0"
                  }`}
                >
                  <ul className="block lg:flex lg:space-x-12">
                    {menuData.map((menuItem, index) => (
                      <li key={index} className="group relative">
                        {menuItem.path ? (
                          menuItem.newTabUrl ? (
                            <a
                              href={menuItem.newTabUrl}
                              target={menuItem.newTab ? "_blank" : "_self"}
                              rel={menuItem.newTab ? "noopener noreferrer" : ""}
                              onClick={closeMobileMenu}
                              className={`flex items-center gap-1 py-2 text-base lg:mr-0 lg:inline-flex lg:px-0 lg:py-6 text-dark hover:text-primary dark:text-white dark:hover:text-white`}
                            >
                              {tMenu(menuItem.titleKey)}
                              <ExternalLinkIcon />
                            </a>
                          ) : (
                            <Link
                              href={menuItem.path}
                              onClick={closeMobileMenu}
                              className={`flex py-2 text-base lg:mr-0 lg:inline-flex lg:px-0 lg:py-6 ${
                                usePathName === menuItem.path
                                  ? "text-primary dark:text-white"
                                  : "text-dark hover:text-primary dark:text-white dark:hover:text-white"
                              }`}
                            >
                              {tMenu(menuItem.titleKey)}
                            </Link>
                          )
                        ) : (
                          <>
                            <p
                            onClick={() => handleSubmenu(index)}
                            className="text-dark group-hover:text-primary flex cursor-pointer items-center justify-between py-2 text-base lg:mr-0 lg:inline-flex lg:px-0 lg:py-6 dark:text-white dark:group-hover:text-white"
                          >
                              {tMenu(menuItem.titleKey)}
                              <span className="pl-3">
                                <svg width="25" height="24" viewBox="0 0 25 24">
                                  <path
                                    fillRule="evenodd"
                                    clipRule="evenodd"
                                    d="M6.29289 8.8427C6.68342 8.45217 7.31658 8.45217 7.70711 8.8427L12 13.1356L16.2929 8.8427C16.6834 8.45217 17.3166 8.45217 17.7071 8.8427C18.0976 9.23322 18.0976 9.86639 17.7071 10.2569L12 15.964L6.29289 10.2569C5.90237 9.86639 5.90237 9.23322 6.29289 8.8427Z"
                                    fill="currentColor"
                                  />
                                </svg>
                              </span>
                            </p>
                            <div
                              className={`submenu dark:bg-dark relative top-full left-0 rounded-sm bg-white transition-[top] duration-300 group-hover:opacity-100 lg:invisible lg:absolute lg:top-[110%] lg:block lg:w-[250px] lg:p-2 lg:opacity-0 lg:shadow-lg lg:group-hover:visible lg:group-hover:top-full ${
                                openIndex === index ? "block" : "hidden"
                              }`}
                            >
                              {menuItem.submenu.map((submenuItem, index) => (
                                submenuItem.newTabUrl ? (
                                  <a
                                    href={submenuItem.newTabUrl}
                                    key={index}
                                    target={submenuItem.newTab ? "_blank" : "_self"}
                                    rel={submenuItem.newTab ? "noopener noreferrer" : ""}
                                    onClick={closeMobileMenu}
                                    className="text-dark hover:text-primary flex items-center gap-1 rounded-sm py-2.5 text-sm lg:px-3 dark:text-white dark:hover:text-white"
                                  >
                                    {tMenu(submenuItem.titleKey)}
                                    <ExternalLinkIcon />
                                  </a>
                                ) : (
                                  <Link
                                    href={submenuItem.path}
                                    key={index}
                                    onClick={closeMobileMenu}
                                    className="text-dark hover:text-primary block rounded-sm py-2.5 text-sm lg:px-3 dark:text-white dark:hover:text-white"
                                  >
                                    {tMenu(submenuItem.titleKey)}
                                  </Link>
                                )
                              ))}
                            </div>
                          </>
                        )}
                      </li>
                    ))}
                  </ul>
                </nav>
              </div>
              <div className="flex items-center justify-end pr-16 lg:pr-0 gap-1.5">
                {locales.map(({ code, name }) => {
                  return (
                    <Link
                      key={code}
                      href={usePathName}
                      locale={code}
                      hrefLang={code}
                      className={`
                        flex items-center justify-center rounded-lg border px-1.5 py-1 text-[10px] font-bold uppercase transition-all duration-300 md:px-3 md:py-1.5 md:text-xs
                        ${currentLocale === code 
                          ? "border-primary bg-primary/10 text-primary shadow-sm" 
                          : "border-gray-200 bg-white text-dark hover:border-primary/50 hover:bg-gray-50 dark:border-white/10 dark:bg-dark dark:text-white dark:hover:border-primary/50 dark:hover:bg-white/5"}
                      `}
                    >
                      <span className="flex items-center gap-1.5">
                        <span className="mr-1 inline-block">
                          {code === 'ro' ? '🇷🇴' : code === 'ru' ? '🇷🇺' : '🇬🇧'}
                        </span>
                        <span className="md:hidden">
                          {code === 'en' ? 'EN' : code === 'ro' ? 'RO' : 'RU'}
                        </span>
                        <span className="hidden md:inline">
                          {name}
                        </span>
                      </span>
                    </Link>
                  );
                })}
                <div>
                  <ThemeToggler />
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>
    </>
  );
};

export default Header;

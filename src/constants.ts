export const defaultMetadata = {
  manifest: "/site.webmanifest",
  icons: {
    icon: [
      {url: "/favicon.ico"},
      {url: "/favicon-16x16.png", sizes: "16x16", type: "image/png"},
      {url: "/favicon-32x32.png", sizes: "32x32", type: "image/png"},
    ],
    apple: "/apple-touch-icon.png",
  },
}

export const locales = [
  {code: "ro", label: "🇷🇴 Română"},
  {code: "ru", label: "🇷🇺 Русский"},
  {code: "en", label: "🇬🇧 English"},
];

export const supportedLocales = locales.map(locale => locale.code);

export const veganMoldovaTgGroupUrl = "https://t.me/veganmoldova/882";
export const uvmEmail = "moldovavegana@gmail.com";
export const uvmSite = "https://uvem.org";
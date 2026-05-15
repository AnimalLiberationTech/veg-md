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
  {code: "ro", name: "Română"},
  {code: "ru", name: "Русский"},
  {code: "en", name: "English"},
];

export const supportedLocales = locales.map(locale => locale.code);

export const veganMoldovaTgGroupUrl = "https://t.me/veganmoldova/882";
export const wtfChisinauInsta = "https://www.instagram.com/activism.wtf.chisinau";
export const uvmEmail = "moldovavegana@gmail.com";
export const uvmSite = "https://uvem.org";
export const bugReportUrl = "https://smtp-notifier.fra.appwrite.run/send-bug-report";
export const gCalUrl = "https://veg-md.fra.appwrite.run/google/get-cal";
export const gSheetUrl = "https://veg-md.fra.appwrite.run/google/get-sheet";
export const expensesCsvUrl =
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vSu_lowuCcBP7SHm1Qn6UavMR96-HGtcbBBbrkS6us_G9o8WIreXjiednNh0oWDBcodLUNK2wVb3blo/pub?gid=610595844&single=true&output=csv";
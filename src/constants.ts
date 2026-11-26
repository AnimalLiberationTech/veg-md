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
] as const;

export const supportedLocales = locales.map((locale) => locale.code);

export const veganMoldovaTgGroupUrl = "https://t.me/veganmoldova/882";
export const wtfChisinauInsta = "https://www.instagram.com/activism.wtf.chisinau";
export const uvmEmail = "moldovavegana@gmail.com";
export const uvmSite = "https://uvem.org";

export const legalInfo = {
  legalName: "A.O. Uniunea Vegetarienilor din Moldova",
  fullLegalName: "Asociația obștească Uniunea Vegetarienilor din Moldova",
  idno: "1025023062786",
  registrationDate: "10.01.2001",
  statuteApprovalDate: "26.02.2026",
  extractNumber: "232534",
  extractDate: "05.11.2026",
  administrator: "Anton Matușenco",
  address: "MD-2005, strada Ion Pruncul 24, ap. 1, mun. Chișinău, Republica Moldova",
  phone: "+37369401723",
  email: "salut@vegan.md",
  website: "https://vegan.md",
  statuteUrl: "/docs/Statut_UVM_aprobat.pdf",
  certificateUrl: "/docs/Extras_RSUD_UVM.jpg",
  certificateWidth: 2166,
  certificateHeight: 3121,
} as const;
export const bugReportUrl = "https://smtp-notifier.fra.appwrite.run/send-bug-report";
export const gCalUrl = "https://veg-md.fra.appwrite.run/google/get-cal";
export const gCalCommunityUrl = gCalUrl + "?cal=community&days=30";
export const gSheetUrl = "https://veg-md.fra.appwrite.run/google/get-sheet";

export const wpArticlesCacheKey = "uvem-articles";
export const gCalCacheKey = "community-cal";
export const gSheetDonationsCacheKey = "donations-table";
export const gSheetExpensesCacheKey = "expenses-table";
export const countryCodeCacheKey = "country-code";
export const cacheTtlMsMap = {
  [wpArticlesCacheKey]: 60 * 60 * 1000,  // 1 hour
  [gCalCacheKey]: 5 * 60 * 1000,  // 5 min
  [gSheetDonationsCacheKey]: 60 * 60 * 1000,  // 1 hour
  [gSheetExpensesCacheKey]: 24 * 60 * 60 * 1000,  // 24 hours
  [countryCodeCacheKey]: 24 * 60 * 60 * 1000, // 24 hours
}
export const countryCodeUrl = "https://ip.matusenco.com/country-code.php";
export const appwriteEndpoint = "https://fra.cloud.appwrite.io/v1";
export const appwriteProjectId = "69496060003d273d4a8c";

export const telemetryConfig = {
  databaseId: "analytics",
  tableId: "user-actions",
  site: "veg-md",
};

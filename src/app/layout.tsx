import React from "react";
import {Inter} from "next/font/google";
import "../styles/index.css";

const inter = Inter({subsets: ["latin"]});

type Props = {
  children: React.ReactNode;
};

export default function RootLayout({children}: Props) {
  return (
    <html suppressHydrationWarning lang="en">
      <body className={`bg-cream dark:bg-black ${inter.className}`}>{children}</body>
    </html>
  );
}

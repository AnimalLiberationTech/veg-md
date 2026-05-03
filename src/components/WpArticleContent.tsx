"use client";

import {decode} from "html-entities";
import ClientBugMailer from "@/components/Common/ClientBugMailer";
import useWpArticles from "@/hooks/use-wp-articles";
import React from "react";

interface WpArticleContentProps {
  pageKey: string;
  locale: string;
  bugReportPath?: string;
}

export default function WpArticleContent({
  pageKey,
  locale,
  bugReportPath,
}: WpArticleContentProps) {
  const { loading, getArticle } = useWpArticles();

  const article = getArticle(pageKey, locale);

   if (loading && !article) {
     return (
       <section className="pt-37.5 pb-30" suppressHydrationWarning>
        <div className="container">
          <div className="-mx-4 flex flex-wrap justify-center">
            <div className="w-full px-4 lg:w-8/12">
               <div className="animate-pulse">
                  <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-8"></div>
                  <div className="space-y-4">
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6"></div>
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
                  </div>
               </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

   if (article) {
     return (
       <section className="pt-37.5 pb-30" suppressHydrationWarning>
        <div className="container">
          <div className="-mx-4 flex flex-wrap justify-center">
            <div className="w-full px-4 lg:w-8/12">
               <h2 className="mb-8 text-3xl leading-tight font-bold text-black sm:text-4xl sm:leading-tight dark:text-white">
                 {decode(article.title?.rendered || "")}
               </h2>

              <article
                className="text-body-color [&_a]:text-primary [&_a]:underline [&_h2]:mt-10 [&_h2]:mb-4 [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:text-black dark:[&_h2]:text-white [&_h3]:mt-8 [&_h3]:mb-3 [&_h3]:text-xl [&_h3]:font-bold [&_h3]:text-black dark:[&_h3]:text-white [&_img]:my-8 [&_img]:h-auto [&_img]:max-w-full [&_p]:mb-6 [&_ul]:mb-6 [&_ul]:list-disc [&_ul]:pl-6"
                dangerouslySetInnerHTML={{ __html: article.content?.rendered || "" }}
              />
            </div>
          </div>
        </div>
      </section>
    );
  }

   return (
      <>
        <section className="pt-37.5 pb-30" suppressHydrationWarning>
         <div className="container">
           <div className="-mx-4 flex flex-wrap justify-center">
             <div className="w-full px-4 lg:w-8/12">
               {bugReportPath ? (
                 <ClientBugMailer locale={locale} pagePath={bugReportPath} />
               ) : null}

               <div className="text-center py-8">
                 <p className="text-body-color">No content available</p>
               </div>
             </div>
           </div>
         </div>
       </section>
     </>
   );
}

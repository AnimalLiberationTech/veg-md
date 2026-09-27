import {NextResponse} from "next/server";
import {getResourcesAppwriteDb} from "@/components/Resources/resources-appwrite-db";
import {supportedLocales} from "@/constants";

export function generateStaticParams() {
  return supportedLocales.map((locale) => ({locale}));
}

export async function GET(
  _request: Request,
  {params}: {params: Promise<{locale: string}>},
) {
  const {locale} = await params;
  try {
    const resources = await getResourcesAppwriteDb(locale);
    return NextResponse.json(resources);
  } catch (error) {
    if (process.env.NODE_ENV !== "production") {
      console.error("Failed to fetch resources:", error);
    }
    return NextResponse.json({error: "Failed to fetch resources"}, {status: 500});
  }
}


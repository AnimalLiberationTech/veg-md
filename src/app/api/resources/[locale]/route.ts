import {NextResponse} from "next/server";
import {getResourcesData} from "@/components/Resources/resourcesData";
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
    const resources = await getResourcesData(locale);
    return NextResponse.json(resources);
  } catch (error) {
    console.error("Failed to fetch resources:", error);
    return NextResponse.json({error: "Failed to fetch resources"}, {status: 500});
  }
}


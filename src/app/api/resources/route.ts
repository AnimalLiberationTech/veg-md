import {NextRequest, NextResponse} from "next/server";
import {getResourcesData} from "@/components/Resources/resourcesData";

export async function GET(request: NextRequest) {
  const locale = request.nextUrl.searchParams.get("locale") ?? "ro";

  try {
    const resources = await getResourcesData(locale);
    return NextResponse.json(resources);
  } catch (error) {
    console.error("Failed to fetch resources:", error);
    return NextResponse.json({error: "Failed to fetch resources"}, {status: 500});
  }
}


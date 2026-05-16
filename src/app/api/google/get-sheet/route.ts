import {NextResponse} from "next/server";
import {gSheetUrl} from "@/constants";

const ALLOWED_SHEETS = new Set(["community-donations", "community-expenses"]);

export async function GET(request: Request) {
  const url = new URL(request.url);
  const sheet = url.searchParams.get("sheet")?.trim() || "";

  if (!ALLOWED_SHEETS.has(sheet)) {
    return NextResponse.json({error: "Invalid sheet"}, {status: 400});
  }

  try {
    const upstreamResponse = await fetch(`${gSheetUrl}?sheet=${encodeURIComponent(sheet)}`, {
      next: {revalidate: 300},
    });

    const body = await upstreamResponse.text();

    return new NextResponse(body, {
      status: upstreamResponse.status,
      headers: {
        "content-type": upstreamResponse.headers.get("content-type") || "application/json; charset=utf-8",
      },
    });
  } catch (error) {
    console.error("Failed to proxy sheet data:", error);
    return NextResponse.json({error: "Failed to load sheet data"}, {status: 500});
  }
}


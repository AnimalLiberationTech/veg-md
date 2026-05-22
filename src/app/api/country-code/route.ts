import {NextResponse} from "next/server";
import {countryCodeUrl} from "@/constants";

export async function GET() {
  try {
    const response = await fetch(countryCodeUrl, {
      next: { revalidate: 3600 } // Cache for 1 hour
    });
    
    if (!response.ok) {
      return NextResponse.json({ country_code: null }, { status: response.status });
    }
    
    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("[API] Failed to proxy country code:", error);
    return NextResponse.json({ country_code: null }, { status: 500 });
  }
}

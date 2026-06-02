import {NextResponse} from 'next/server';

// This is a server-side proxy to the external calendar endpoint.
// The browser client will call this same-origin route to avoid CORS problems.
export async function GET(request: Request) {
  try {
    const reqUrl = new URL(request.url);
    const search = reqUrl.search; // This preserves query params like ?cal=community&days=30

    // The real, external URL we are proxying to.
    const externalUrl = `https://veg-md.fra.appwrite.run/google/get-cal${search}`;

    const res = await fetch(externalUrl, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!res.ok) {
      // Pass through the upstream error status.
      return NextResponse.json(
        {error: `Failed to fetch from upstream: ${res.statusText}`},
        {status: res.status}
      );
    }

    const data = await res.json();

    // Return the data from the external service to our client.
    return NextResponse.json(data);
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : String(err);
    console.error('[api/google/get-cal] Failed to proxy calendar request:', errorMessage);
    return NextResponse.json({error: 'Failed to fetch calendar data.'}, {status: 500});
  }
}


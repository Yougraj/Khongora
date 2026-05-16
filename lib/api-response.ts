import { NextResponse } from "next/server";

/** Public JSON responses with edge/browser caching. */
export function jsonCached(data: unknown, maxAgeSeconds = 60) {
  return NextResponse.json(data, {
    headers: {
      "Cache-Control": `public, s-maxage=${maxAgeSeconds}, stale-while-revalidate=300`,
    },
  });
}

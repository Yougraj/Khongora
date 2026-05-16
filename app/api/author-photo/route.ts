import { readFile } from "fs/promises";
import path from "path";
import { NextResponse } from "next/server";

const LOCAL_PATH = path.join(process.cwd(), "public", "author.jpg");

function isImageBuffer(buf: Buffer): boolean {
  if (buf.length < 4) return false;
  if (buf[0] === 0xff && buf[1] === 0xd8) return true; // JPEG
  if (buf[0] === 0x89 && buf[1] === 0x50) return true; // PNG
  if (buf[0] === 0x47 && buf[1] === 0x49) return true; // GIF
  if (buf.subarray(0, 4).toString() === "RIFF") return true; // WebP
  return false;
}

const FALLBACK_SVG = `<svg xmlns="http://www.w3.org/2000/svg" width="256" height="256" viewBox="0 0 256 256" role="img" aria-label="Jugal Kishur">
  <rect width="256" height="256" rx="32" fill="#E8E2D9"/>
  <text x="128" y="148" text-anchor="middle" font-family="Georgia, serif" font-size="72" fill="#2D2D2D">JK</text>
</svg>`;

export async function GET() {
  const remote = process.env.AUTHOR_IMAGE_URL?.trim();
  if (remote) {
    try {
      const res = await fetch(remote, {
        headers: { Accept: "image/*" },
        next: { revalidate: 86400 },
      });
      if (res.ok) {
        const buf = Buffer.from(await res.arrayBuffer());
        if (isImageBuffer(buf)) {
          const type = res.headers.get("content-type") ?? "image/jpeg";
          return new NextResponse(buf, {
            headers: {
              "Content-Type": type.split(";")[0],
              "Cache-Control": "public, max-age=86400, stale-while-revalidate=604800",
            },
          });
        }
      }
    } catch {
      /* fall through */
    }
  }

  try {
    const buf = await readFile(LOCAL_PATH);
    if (isImageBuffer(buf)) {
      const type =
        buf[0] === 0x89
          ? "image/png"
          : buf.subarray(0, 4).toString() === "RIFF"
            ? "image/webp"
            : "image/jpeg";
      return new NextResponse(buf, {
        headers: {
          "Content-Type": type,
          "Cache-Control": "public, max-age=3600",
        },
      });
    }
  } catch {
    /* missing or invalid file */
  }

  return new NextResponse(FALLBACK_SVG, {
    headers: {
      "Content-Type": "image/svg+xml",
      "Cache-Control": "public, max-age=300",
    },
  });
}

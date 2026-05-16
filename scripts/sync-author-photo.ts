/**
 * Download AUTHOR_IMAGE_URL from .env.local into public/author.jpg.
 *
 * Get the URL: open https://www.facebook.com/jugalkishur → profile photo →
 * right‑click → Copy image address (fbcdn.net link), then set AUTHOR_IMAGE_URL
 * in .env.local and run: npm run sync-author-photo
 */
import { readFile, writeFile } from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const envPath = path.join(root, ".env.local");
const outPath = path.join(root, "public", "author.jpg");

async function loadEnv(): Promise<string | undefined> {
  try {
    const raw = await readFile(envPath, "utf8");
    for (const line of raw.split("\n")) {
      const m = line.match(/^\s*AUTHOR_IMAGE_URL\s*=\s*(.+)\s*$/);
      if (!m) continue;
      let v = m[1].trim();
      if (
        (v.startsWith('"') && v.endsWith('"')) ||
        (v.startsWith("'") && v.endsWith("'"))
      ) {
        v = v.slice(1, -1);
      }
      return v || undefined;
    }
  } catch {
    /* no .env.local */
  }
  return process.env.AUTHOR_IMAGE_URL?.trim();
}

function isImage(buf: Buffer): boolean {
  if (buf.length < 4) return false;
  if (buf[0] === 0xff && buf[1] === 0xd8) return true;
  if (buf[0] === 0x89 && buf[1] === 0x50) return true;
  return false;
}

const url = await loadEnv();
if (!url) {
  console.error(
    "Set AUTHOR_IMAGE_URL in .env.local (direct fbcdn profile photo URL), then re-run."
  );
  process.exit(1);
}

const res = await fetch(url, { headers: { Accept: "image/*" } });
if (!res.ok) {
  console.error(`Fetch failed: ${res.status} ${res.statusText}`);
  process.exit(1);
}

const buf = Buffer.from(await res.arrayBuffer());
if (!isImage(buf)) {
  console.error("Downloaded file is not a JPEG/PNG image.");
  process.exit(1);
}

await writeFile(outPath, buf);
console.log(`Saved ${outPath} (${buf.length} bytes)`);

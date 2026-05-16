/** In-memory JSON cache + in-flight dedupe for snappy client navigation. */

type CacheEntry = { data: unknown; at: number };

const cache = new Map<string, CacheEntry>();
const inflight = new Map<string, Promise<unknown>>();

const TTL_MS = 5 * 60 * 1000;

export function peekCache<T>(url: string): T | null {
  const hit = cache.get(url);
  if (!hit) return null;
  if (Date.now() - hit.at > TTL_MS) {
    cache.delete(url);
    return null;
  }
  return hit.data as T;
}

export function setCache<T>(url: string, data: T): void {
  cache.set(url, { data, at: Date.now() });
}

export function invalidateCache(url?: string): void {
  if (url) {
    cache.delete(url);
    inflight.delete(url);
    return;
  }
  cache.clear();
  inflight.clear();
}

export async function fetchJson<T>(
  url: string,
  init?: RequestInit
): Promise<T> {
  const skipCache = init?.method && init.method !== "GET";

  if (!skipCache) {
    const cached = peekCache<T>(url);
    if (cached !== null) return cached;
  }

  const key = `${init?.method ?? "GET"}:${url}`;
  let pending = inflight.get(key);

  if (!pending) {
    pending = fetch(url, init).then(async (res) => {
      if (!res.ok) throw new Error(`Request failed (${res.status})`);
      return res.json() as Promise<T>;
    });
    inflight.set(key, pending);
  }

  try {
    const data = (await pending) as T;
    if (!skipCache) setCache(url, data);
    return data;
  } finally {
    inflight.delete(key);
  }
}

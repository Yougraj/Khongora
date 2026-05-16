import { fetchJson, peekCache } from "./client-fetch";

/** Warm API cache when user hovers a nav or content link. */
export function prefetchApi(href: string): void {
  const api = apiUrlFromHref(href);
  if (!api || peekCache(api)) return;
  fetchJson(api).catch(() => {});
}

function apiUrlFromHref(href: string): string | null {
  if (href === "/") return "/api/home";
  if (href === "/books") return "/api/books";
  if (href === "/novels") return "/api/novels";
  if (href === "/poems") return "/api/poems";
  if (href === "/articles") return "/api/articles";
  if (href === "/blog") return "/api/blogs";

  const detail =
    /^\/(books|novels|poems|articles)\/([^/]+)$/.exec(href) ??
    /^\/blog\/([^/]+)$/.exec(href);

  if (!detail) return null;

  if (href.startsWith("/blog/")) {
    return `/api/blogs/${detail[1]}`;
  }

  const type = detail[1];
  const id = detail[2];
  return `/api/${type}/${id}`;
}

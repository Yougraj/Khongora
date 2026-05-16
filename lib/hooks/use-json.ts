"use client";

import { useEffect, useState } from "react";
import { fetchJson, peekCache } from "@/lib/client-fetch";

export function useJson<T>(url: string | null) {
  const enabled = Boolean(url);
  const [data, setData] = useState<T | null>(() =>
    enabled && url ? peekCache<T>(url) : null
  );
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(() =>
    enabled && url ? peekCache<T>(url) === null : false
  );

  useEffect(() => {
    if (!enabled || !url) return;

    let cancelled = false;
    const cached = peekCache<T>(url);

    if (cached) {
      setData(cached);
      setLoading(false);
    }

    fetchJson<T>(url)
      .then((next) => {
        if (!cancelled) {
          setData(next);
          setError(null);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setError("Failed to load");
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [url, enabled]);

  return {
    data,
    error,
    /** True only when there is nothing to show yet */
    loading: loading && data === null,
    /** Has cached or fresh data */
    ready: data !== null,
  };
}

export function todayDateInputValue(): string {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

export function toDateInputValue(value: unknown): string {
  if (value === undefined || value === null || value === '') {
    return todayDateInputValue();
  }
  const d = new Date(String(value));
  if (Number.isNaN(d.getTime())) return todayDateInputValue();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

export function parsePublishDate(value: string | undefined, fallback = new Date()): Date {
  if (!value?.trim()) return fallback;
  const parsed = new Date(`${value.trim()}T12:00:00`);
  return Number.isNaN(parsed.getTime()) ? fallback : parsed;
}

/** Apply admin publish date to document fields used for sorting and display. */
export function applyPublishDate(
  doc: Record<string, unknown>,
  publishDate?: string
): Record<string, unknown> {
  const when = parsePublishDate(publishDate);
  const out = { ...doc };
  out.uploadedAt = when;
  out.publishedAt = when;
  delete out.publishDate;
  return out;
}

export function publishDateFromDoc(doc: Record<string, unknown>): string {
  return toDateInputValue(doc.publishedAt ?? doc.uploadedAt);
}

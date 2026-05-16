export const CONTENT_TYPES = ['books', 'novels', 'poems', 'articles', 'blogs'] as const;
export type ContentType = (typeof CONTENT_TYPES)[number];

export function isContentType(value: string): value is ContentType {
  return CONTENT_TYPES.includes(value as ContentType);
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function getUploadedAt(doc: Record<string, any>): Date {
  const raw = doc.publishedAt ?? doc.uploadedAt ?? doc.createdAt ?? doc.updatedAt;
  const d = raw ? new Date(raw) : new Date(0);
  return Number.isNaN(d.getTime()) ? new Date(0) : d;
}

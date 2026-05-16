import { ObjectId } from 'mongodb';
import { formatDisplayDate, formatRelativeDate } from './dates';
import { getUploadedAt } from './content-types';
import { normalizePlainText } from './plain-text';

const DEFAULT_COVER =
  'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=280&h=400&fit=crop';

function resolveCover(doc: Record<string, unknown>, fallback = ''): string {
  const url = doc.cover ?? doc.coverImage;
  if (typeof url === 'string' && url.trim()) return url.trim();
  return fallback;
}

export function toId(value: unknown): string {
  if (value instanceof ObjectId) return value.toString();
  if (typeof value === 'string') return value;
  return String(value ?? '');
}

function metaFields(doc: Record<string, unknown>) {
  const uploadedAt = getUploadedAt(doc);
  return {
    uploadedAt: uploadedAt.toISOString(),
    date: formatDisplayDate(uploadedAt),
    dateRelative: formatRelativeDate(uploadedAt),
    likeCount: (doc.likeCount as number) ?? 0,
  };
}

function excerptFromText(text: string | undefined, max = 120): string {
  if (!text) return '';
  const plain = normalizePlainText(text).replace(/\s+/g, ' ').trim();
  if (plain.length <= max) return plain;
  return `${plain.slice(0, max).trim()}…`;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function serializeBook(doc: Record<string, any>) {
  const pages = doc.pages ?? 200;
  const chapters = doc.chapters ?? Math.max(1, Math.ceil(pages / 25));

  return {
    _id: toId(doc._id),
    title: doc.title,
    author: doc.author,
    cover: resolveCover(doc, DEFAULT_COVER),
    rating: doc.rating ?? 0,
    readers: doc.readers ?? doc.totalReviews ?? 0,
    readTime: doc.readTime ?? `${Math.max(1, Math.ceil(pages / 60))} hrs`,
    chapters,
    description: normalizePlainText(doc.description ?? ''),
    content: normalizePlainText(doc.content ?? doc.description ?? ''),
    ...metaFields(doc),
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function serializeNovel(doc: Record<string, any>) {
  const episodes = doc.episodes ?? doc.chapters ?? 1;
  const rawEpisodes = doc.episodesList ?? [
    {
      id: 1,
      title: 'Episode 1',
      duration: '25 min',
      content: doc.content ?? doc.synopsis ?? doc.description ?? '',
    },
  ];
  const episodesList = rawEpisodes.map(
    (ep: { id?: number; title?: string; duration?: string; content?: string }, i: number) => ({
      id: ep.id ?? i + 1,
      title: ep.title ?? `Episode ${i + 1}`,
      duration: ep.duration ?? '25 min',
      content: normalizePlainText(ep.content ?? ''),
    })
  );

  return {
    _id: toId(doc._id),
    title: doc.title,
    author: doc.author,
    cover: resolveCover(doc),
    rating: doc.rating ?? 0,
    episodes,
    readTime: doc.readTime ?? `${Math.max(1, Math.ceil(episodes / 2))} hrs`,
    description: normalizePlainText(doc.description ?? doc.synopsis ?? ''),
    episodesList,
    ...metaFields(doc),
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function serializeArticle(doc: Record<string, any>) {
  const minutes = doc.readTimeMinutes ?? 5;

  return {
    _id: toId(doc._id),
    title: doc.title,
    author: doc.author,
    readTime: doc.readTime ?? `${minutes} min`,
    excerpt: normalizePlainText(doc.excerpt ?? doc.summary ?? excerptFromText(doc.content)),
    content: normalizePlainText(doc.content ?? doc.summary ?? ''),
    ...metaFields(doc),
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function serializePoem(doc: Record<string, any>) {
  const lineCount = doc.lines ?? 0;

  return {
    _id: toId(doc._id),
    title: doc.title,
    author: doc.author,
    cover: resolveCover(doc),
    readTime: doc.readTime ?? `${Math.max(1, Math.ceil(lineCount / 4))} min`,
    lines: lineCount,
    excerpt: doc.excerpt ?? excerptFromText(doc.content, 80),
    year: doc.year ?? (doc.publishedYear ? String(doc.publishedYear) : ''),
    content: normalizePlainText(doc.content ?? ''),
    analysis: normalizePlainText(doc.analysis ?? ''),
    ...metaFields(doc),
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function serializeBlog(doc: Record<string, any>) {
  return {
    _id: toId(doc._id),
    title: doc.title,
    author: doc.author,
    cover: resolveCover(doc),
    excerpt: normalizePlainText(doc.excerpt ?? excerptFromText(doc.body ?? doc.content)),
    readTime: doc.readTime ?? '5 min',
    featured: doc.featured ?? false,
    content: normalizePlainText(doc.content ?? doc.body ?? ''),
    ...metaFields(doc),
  };
}

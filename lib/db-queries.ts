import { getDb } from './mongodb';
import {
  serializeBook,
  serializeNovel,
  serializePoem,
  serializeArticle,
  serializeBlog,
} from './serializers';
import type { ContentType } from './content-types';
import { CONTENT_TYPES } from './content-types';

const SERIALIZERS = {
  books: serializeBook,
  novels: serializeNovel,
  poems: serializePoem,
  articles: serializeArticle,
  blogs: serializeBlog,
} as const;

export async function fetchLatest(type: ContentType, limit = 4) {
  const db = await getDb();
  const docs = await db
    .collection(type)
    .find({})
    .sort({ uploadedAt: -1, createdAt: -1 })
    .limit(limit)
    .toArray();
  return docs.map((d) => ({ type, ...SERIALIZERS[type](d) }));
}

export async function fetchAllSorted(type: ContentType) {
  const db = await getDb();
  const docs = await db
    .collection(type)
    .find({})
    .sort({ uploadedAt: -1, createdAt: -1 })
    .toArray();
  return docs.map((d) => SERIALIZERS[type](d));
}

export async function searchContent(query: string, limitPerType = 5) {
  const q = query.trim();
  if (!q) return [];

  const db = await getDb();
  const regex = { $regex: q, $options: 'i' };
  const filter = {
    $or: [
      { title: regex },
      { author: regex },
      { description: regex },
      { summary: regex },
      { excerpt: regex },
      { synopsis: regex },
      { content: regex },
      { body: regex },
    ],
  };

  const results: Array<{
    type: ContentType;
    _id: string;
    title: string;
    author: string;
    excerpt: string;
    href: string;
  }> = [];

  for (const type of CONTENT_TYPES) {
    const docs = await db.collection(type).find(filter).limit(limitPerType).toArray();
    for (const doc of docs) {
      const s = SERIALIZERS[type](doc);
      const base = type === 'blogs' ? 'blog' : type;
      results.push({
        type,
        _id: s._id,
        title: s.title,
        author: s.author,
        excerpt: ('description' in s && s.description) || ('excerpt' in s && s.excerpt) || '',
        href: `/${base}/${s._id}`,
      });
    }
  }

  return results;
}

import { ObjectId } from 'mongodb';
import { getDb } from './mongodb';
import { toId } from './serializers';
import { formatRelativeDate } from './dates';
import type { ContentType } from './content-types';

export interface CommentDoc {
  _id?: ObjectId;
  contentType: ContentType;
  contentId: string;
  name: string;
  email: string;
  text: string;
  hidden?: boolean;
  createdAt: Date;
}

export function serializeComment(doc: CommentDoc & { _id: ObjectId }) {
  return {
    _id: toId(doc._id),
    contentType: doc.contentType,
    contentId: doc.contentId,
    name: doc.name,
    text: doc.text,
    date: formatRelativeDate(doc.createdAt),
    createdAt: doc.createdAt,
  };
}

export async function getVisibleComments(contentType: ContentType, contentId: string) {
  const db = await getDb();
  const comments = await db
    .collection<CommentDoc>('comments')
    .find({ contentType, contentId, hidden: { $ne: true } })
    .sort({ createdAt: -1 })
    .toArray();
  return comments.map((c) => serializeComment(c as CommentDoc & { _id: ObjectId }));
}

export async function getRandomComments(limit = 5) {
  const db = await getDb();
  const count = await db.collection('comments').countDocuments({ hidden: { $ne: true } });
  if (count === 0) return [];

  const sampleSize = Math.min(limit, count);
  const comments = await db
    .collection<CommentDoc>('comments')
    .aggregate([{ $match: { hidden: { $ne: true } } }, { $sample: { size: sampleSize } }])
    .toArray();
  return comments.map((c) => serializeComment(c as CommentDoc & { _id: ObjectId }));
}
